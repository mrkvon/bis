from collections import Counter
from itertools import zip_longest
from typing import OrderedDict

import xlsxwriter
from django.contrib import admin
from django.core.files.temp import NamedTemporaryFile
from django.core.paginator import Paginator
from django.http import FileResponse
from rest_framework.serializers import ModelSerializer

from bis.helpers import print_progress
from bis.models import User
from event.models import Event
from xlsx_export.serializers import UserExportSerializer, EventExportSerializer, DonorExportSerializer


class XLSXWriter:
    def __init__(self, file_name):
        self.tmp_file = NamedTemporaryFile(mode='w', suffix='.xlsx', newline='', encoding='utf8',
                                           prefix=file_name + '_')
        self.writer = xlsxwriter.Workbook(self.tmp_file.name, {'constant_memory': True})

        self.format = lambda: None
        self.format.green = self.writer.add_format({'bg_color': '#c9ffc9'})
        self.format.red = self.writer.add_format({'bg_color': '#ff9999'})
        self.format.shrink = self.writer.add_format()
        self.format.shrink.set_shrink()
        self.format.text_wrap = self.writer.add_format()
        self.format.text_wrap.set_text_wrap()

    def get_file(self):
        self.writer.close()
        self.tmp_file.flush()

        return self.tmp_file

    def add_worksheet(self, name):
        self.worksheet = self.writer.add_worksheet(name)
        self.row = 0
        self.header_keys = []

    def from_queryset(self, queryset, serializer_class):
        self.add_worksheet(queryset.model._meta.verbose_name_plural)

        for page in Paginator(queryset, 100):
            print_progress('exporting xlsx', page.number, page.paginator.num_pages)
            serializer = serializer_class(page.object_list, many=True)
            for item in serializer.data:
                if not self.row:
                    self.write_header(serializer.child.get_fields())
                self.write_row(item)

    def write_values(self, values):
        values = {key: value for key, value in values}
        for i, key in enumerate(self.header_keys):
            value = values.get(key)
            if isinstance(value, list):
                value = '\n'.join(str(v) for v in value)
            if value is False:
                value = 'ne'
            if value is True:
                value = 'ano'
            if value is None:
                value = '-'
            self.worksheet.write(self.row, i, str(value), self.format.shrink)

        self.row += 1

    def get_header_values(self, fields, prefix='', key_prefix=''):
        if prefix: prefix += ' - '
        if key_prefix: key_prefix += '_'
        for key, value in fields.items():
            if isinstance(value, ModelSerializer):
                yield from self.get_header_values(value.get_fields(), prefix + value.Meta.model._meta.verbose_name,
                                                  key_prefix + key)
            else:
                self.header_keys.append(key_prefix + key)
                yield key_prefix + key, prefix + (getattr(value, 'label', value) or key)

    def write_header(self, fields):
        self.write_values(list(self.get_header_values(fields)))

    def get_row_values(self, item, key_prefix=''):
        if key_prefix: key_prefix += '_'
        for key, value in item.items():
            if isinstance(value, OrderedDict):
                yield from self.get_row_values(value, key_prefix + key)
            else:
                yield key_prefix + key, value

    def write_row(self, item):
        self.write_values(self.get_row_values(item))

    def events_stats(self, queryset):
        self.add_worksheet('Uživatelé událostí')
        participants = User.objects.filter(participated_in_events__event__in=queryset)
        organizers = User.objects.filter(events_where_was_organizer__in=queryset)
        main_organizers = User.objects.filter(events_where_was_as_main_organizer__in=queryset)

        self.write_header(dict(
            p='=Učastníci',
            pe='Emaily',
            pc='Počet účastí',
            o='Orgové',
            oe='Emaily orgů',
            oc='Počet zorganizovaných akcí',
            m='Hlavní orgové',
            me='Emaily hlavních orgů',
            mc='Počet odvedených akcí'
        ))

        for line in zip_longest(
            *zip(*Counter(participants).most_common()),
            *zip(*Counter(organizers).most_common()),
            *zip(*Counter(main_organizers).most_common()),
            fillvalue=''
        ):
            row = []
            for item in line:
                if isinstance(item, User):
                    row += [item.get_name(), item.email or '']
                else:
                    row += [item]

            row = {a: b for a, b in zip(self.header_keys, row)}
            self.write_row(row)




@admin.action(description='Exportuj data')
def export_to_xlsx(model_admin, request, queryset):
    serializer_class = \
    [s for s in [UserExportSerializer, EventExportSerializer, DonorExportSerializer]
     if s.Meta.model is queryset.model][0]
    queryset = serializer_class.get_related(queryset)

    writer = XLSXWriter(queryset.model._meta.verbose_name_plural)
    writer.from_queryset(queryset, serializer_class)
    if queryset.model is Event:
        writer.events_stats(queryset)
    file = writer.get_file()

    return FileResponse(open(file.name, 'rb'))

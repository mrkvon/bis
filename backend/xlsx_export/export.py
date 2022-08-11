import xlsxwriter
from django.contrib import admin
from django.core.files.temp import NamedTemporaryFile
from django.core.paginator import Paginator
from django.http import FileResponse
from rest_framework.serializers import ModelSerializer
from typing import OrderedDict

from bis.helpers import print_progress
from xlsx_export.serializers import UserExportSerializer, EventExportSerializer


class XLSXWriter:
    def __init__(self, file_name, serializer_class):
        self.serializer_class = serializer_class

        self.tmp_file = NamedTemporaryFile(mode='w', suffix='.xlsx', newline='', encoding='utf8',
                                           prefix=file_name + '_')
        self.writer = xlsxwriter.Workbook(self.tmp_file.name, {'constant_memory': True})
        self.worksheet = self.writer.add_worksheet(file_name)
        self.row = 0
        self.header_keys = []

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

    def from_queryset(self, queryset):
        queryset = self.serializer_class.get_related(queryset)

        for page in Paginator(queryset, 100):
            print_progress('exporting xlsx', page.number, page.paginator.num_pages)
            serializer = self.serializer_class(page.object_list, many=True)
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
                yield from self.get_header_values(value.get_fields(), prefix + value.Meta.model._meta.verbose_name, key_prefix + key)
            else:
                self.header_keys.append(key_prefix + key)
                yield key_prefix + key, prefix + (value.label or key)

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


@admin.action(description='Exportuj data')
def export_to_xlsx(model_admin, request, queryset):
    serializer_class = [s for s in [UserExportSerializer, EventExportSerializer] if s.Meta.model is queryset.model][0]

    writer = XLSXWriter(queryset.model._meta.verbose_name_plural, serializer_class)
    writer.from_queryset(queryset)
    file = writer.get_file()

    return FileResponse(open(file.name, 'rb'))

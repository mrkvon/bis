import xlsxwriter
from django.contrib import admin
from django.core.files.temp import NamedTemporaryFile
from django.core.paginator import Paginator
from django.http import FileResponse
from rest_framework.serializers import ModelSerializer

from bis.helpers import print_progress
from bis.models import User


class UserExportSerializer(ModelSerializer):
    class Meta:
        model = User

        exclude = ()


class XLSXWriter:
    def __init__(self, file_name, serializer_class):
        self.serializer_class = serializer_class

        self.tmp_file = NamedTemporaryFile(mode='w', suffix='.xlsx', newline='', encoding='utf8',
                                           prefix=file_name + '_')
        self.writer = xlsxwriter.Workbook(self.tmp_file.name, {'constant_memory': True})
        self.worksheet = self.writer.add_worksheet(file_name)
        self.row = 0

        self.format = lambda: None
        self.format.green = self.writer.add_format({'bg_color': '#c9ffc9'})
        self.format.red = self.writer.add_format({'bg_color': '#ff9999'})
        self.format.shrink = self.writer.add_format()
        self.format.shrink.set_shrink()
        self.format.text_wrap = self.writer.add_format()
        self.format.text_wrap.set_text_wrap()

    def get_file(self):
        print('closing writer')
        self.writer.close()
        print('flusing')
        self.tmp_file.flush()
        print('flushed')

        return self.tmp_file

    def from_queryset(self, queryset):
        for page in Paginator(queryset, 100):
            print_progress('exporting xlsx', page.number, page.paginator.num_pages)
            serializer = self.serializer_class(page.object_list, many=True)
            for item in serializer.data:
                if not self.row:
                    self.write_header(item)
                self.write_row(item)

            self.tmp_file.flush()

    def write_values(self, values):
        for i, value in enumerate(values):
            self.worksheet.write(self.row, i, str(value), self.format.shrink)

        self.row += 1

    def write_header(self, item):
        values = [self.serializer_class.Meta.model._meta.get_field(key).verbose_name for key in item]
        self.write_values(values)

    def write_row(self, item):
        self.write_values(item.values())


@admin.action(description='Exportuj data')
def export_to_xlsx(model_admin, request, queryset):
    serializer_class = [s for s in [UserExportSerializer] if s.Meta.model is queryset.model][0]

    writer = XLSXWriter(queryset.model._meta.verbose_name_plural, serializer_class)
    writer.from_queryset(queryset)
    file = writer.get_file()

    return FileResponse(open(file.name, 'rb'))

import base64
import binascii
import re

from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.exceptions import ValidationError
from rest_framework.fields import FileField, ImageField
from rest_framework.pagination import PageNumberPagination


class Pagination(PageNumberPagination):
    page_size_query_param = 'page_size'


def parse_request_data(serializer_class):
    def decorator(fn):
        def wrapper(request):
            serializer = serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            return fn(request, serializer.validated_data)

        return wrapper

    return decorator


class Base64FieldMixin:
    EMPTY_VALUES = None, "", [], (), {}

    def to_internal_value(self, base64_data):
        # Check if this is a base64 string
        if base64_data in self.EMPTY_VALUES:
            return None

        try:
            assert isinstance(base64_data, str), 'Expects base64 string'
            assert ";base64," in base64_data, '";base64," not in data'
            header, base64_data = base64_data.split(";base64,", 1)
            assert re.match(r'data:\w+/\w+;filename=.*', header), 'header does not match "data:\w+/\w+;filename=.*"'
            header = header[5:]
            content_type, filename = header.split(';')
            filename = filename.split('=', 1)[1]
            extension = content_type.split('/', 1)[1]

        except AssertionError as e:
            raise ValidationError(e)

        try:
            decoded_file = base64.b64decode(base64_data)
        except (TypeError, binascii.Error, ValueError) as e:

            raise ValidationError(e)

        complete_file_name = filename + "." + extension
        data = SimpleUploadedFile(
            name=complete_file_name,
            content=decoded_file,
            content_type=content_type
        )

        return super().to_internal_value(data)


class Base64ImageField(Base64FieldMixin, ImageField):
    pass


class Base64FileField(Base64FieldMixin, FileField):
    pass

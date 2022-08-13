from os import symlink
from os.path import splitext, join, exists

from PIL import Image
from django.conf import settings
from django.db.models import ImageField
from django.db.models.fields.files import ImageFieldFile
from pip._vendor.pep517.dirtools import mkdir_p


def get_thumbnail_path(file_name, size_name):
    file_name, file_extension = splitext(file_name)
    return join('thumbnails', f"{file_name}_{size_name}{file_extension}")


class ThumbnailImageFieldFile(ImageFieldFile):
    @property
    def urls(self):
        urls = {
            size: '/media/' + get_thumbnail_path(self.name, size) for size in settings.THUMBNAIL_SIZES
        }
        urls['original'] = self.url
        for key, value in urls.items():
            urls[key] = settings.FULL_HOSTNAME + value

        return urls


class ThumbnailImageField(ImageField):
    attr_class = ThumbnailImageFieldFile

    def pre_save(self, model_instance, add):
        file = getattr(model_instance, self.attname)

        if file and not file._committed:
            file.save(file.name, file.file, save=False)

            thumbnail_dir_path = join(settings.BASE_DIR, 'media', 'thumbnails', self.upload_to)
            mkdir_p(thumbnail_dir_path)

            file_path = join(settings.MEDIA_DIR, file.name)
            image = Image.open(file_path)
            for size_name, size in settings.THUMBNAIL_SIZES.items():
                thumbnail_path = join(settings.MEDIA_ROOT, get_thumbnail_path(file.name, size_name))

                if exists(thumbnail_path):
                    continue

                if image.width >= size or image.height >= size:
                    new = image.copy()
                    new.thumbnail((size, size))
                    new.save(thumbnail_path)
                else:
                    symlink(file_path, thumbnail_path)

        return file

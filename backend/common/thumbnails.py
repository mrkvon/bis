from os import symlink, makedirs
from os.path import splitext, join, exists

from PIL import Image, UnidentifiedImageError
from django.conf import settings
from django.db.models import ImageField
from django.db.models import signals


def get_thumbnail_path(file_name, size_name):
    file_name, file_extension = splitext(file_name)
    return join('thumbnails', f"{file_name}_{size_name}{file_extension}")


class ThumbnailImageField(ImageField):
    def contribute_to_class(self, cls, name, **kwargs):
        super().contribute_to_class(cls, name, **kwargs)
        if not cls._meta.abstract:
            signals.post_save.connect(self.create_thumbnails, sender=cls)

    def create_thumbnails(self, instance, **kwargs):
        file = getattr(instance, self.attname)

        if file:
            thumbnail_dir_path = join(settings.BASE_DIR, 'media', 'thumbnails', self.upload_to)
            makedirs(thumbnail_dir_path, exist_ok=True)

            file_path = join(settings.MEDIA_ROOT, file.name)
            try:
                image = Image.open(file_path)
            except UnidentifiedImageError:
                image = None

            for size_name, size in settings.THUMBNAIL_SIZES.items():
                thumbnail_path = join(settings.MEDIA_ROOT, get_thumbnail_path(file.name, size_name))

                if exists(thumbnail_path):
                    continue

                if image and (image.width >= size or image.height >= size):
                    try:
                        new = image.copy()
                        new.thumbnail((size, size))
                        new.save(thumbnail_path)
                        continue
                    except (OSError, ValueError):
                        pass

                symlink(file_path, thumbnail_path)

from django.core.management import BaseCommand
from django.utils.timezone import now

from bis.models import User, DuplicateUser


class Command(BaseCommand):
    progresses = {}

    def print_progress(self, slug, i, total):
        if slug not in self.progresses:
            self.progresses[slug] = now()

        if (now() - self.progresses[slug]).seconds > 1:
            print(f"importing {slug}, progress {100 * i / total:.2f}%")
            self.progresses[slug] = now()

    def handle(self, *args, **options):
        c = 0
        for i, user in enumerate(User.objects.all()):
            self.print_progress('users', i, User.objects.count())
            for other in User.objects.filter(id__gt=user.id, first_name=user.first_name, last_name=user.last_name):
                if user.birthday and other.birthday and user.birthday != other.birthday:
                    DuplicateUser.objects.get_or_create(user=user, other=other)
                    continue

                print('merging ', user, ' with ', other)
                user.merge_with(other)

        print('same name, different birthday', c)

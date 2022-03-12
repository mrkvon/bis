# Generated by Django 4.0.3 on 2022-03-11 17:13
from django.contrib.auth.hashers import make_password
from django.db import migrations
from django.utils import timezone


def migrate(apps, _):
    User = apps.get_model('bis', 'User')
    Qualification = apps.get_model('bis', 'Qualification')
    Membership = apps.get_model('bis', 'Membership')
    QualificationCategory = apps.get_model('categories', 'QualificationCategory')

    iva = User.objects.get_or_create(email='iva@lomic.cz')[0]  # clen orchis
    kuba = User.objects.get_or_create(email='kuba@lomic.cz')[0]  # org
    janek = User.objects.get_or_create(email='janek@lomic.cz')[0]  # orchis board member
    dali = User.objects.get_or_create(email='dali@lomic.cz')[0]  # director
    ondra = User.objects.get_or_create(email='ondra@lomic.cz')[0]  # bis admin
    terka = User.objects.get_or_create(email='terka@lomic.cz')[0]  # office worker
    jarik = User.objects.get_or_create(email='jarik@lomic.cz')[0]  # krk
    hanka = User.objects.get_or_create(email='hanka@lomic.cz')[0]  # VV
    marketa = User.objects.get_or_create(email='marketa@lomic.cz')[0]  # edu

    OrganizingUnit = apps.get_model('administration_units', 'OrganizingUnit')
    BrontosaurusMovement = apps.get_model('administration_units', 'BrontosaurusMovement')

    orchis = OrganizingUnit.objects.get_or_create(name='Orchis')[0]
    orchis.board_members.add(janek)
    OrganizingUnit.objects.get_or_create(name='Rozruch')

    brontosaurus_movement = BrontosaurusMovement.objects.get_or_create(director=dali)[0]
    brontosaurus_movement.bis_administrators.add(ondra)
    brontosaurus_movement.office_workers.add(terka)
    brontosaurus_movement.audit_committee.add(jarik)
    brontosaurus_movement.executive_committee.add(hanka)
    brontosaurus_movement.education_members.add(marketa)

    User.objects.get_or_create(email='admin@lomic.cz')[0].delete()

    Qualification.objects.get_or_create(
        category=QualificationCategory.objects.get(name='OHB'),
        valid_till=timezone.datetime(2025, 2, 5).date(),
        user=kuba
    )
    Membership.objects.get_or_create(
        user=iva,
        administrative_unit=orchis,
        year=2022,
    )

    iva.password = make_password('iva')
    iva.save()
    kuba.password = make_password('kuba')
    kuba.save()
    janek.password = make_password('janek')
    janek.save()
    dali.password = make_password('dali')
    dali.save()
    ondra.password = make_password('ondra')
    ondra.save()
    terka.password = make_password('terka')
    terka.save()
    jarik.password = make_password('jarik')
    jarik.save()
    hanka.password = make_password('hanka')
    hanka.save()
    marketa.password = make_password('marketa')
    marketa.save()


class Migration(migrations.Migration):
    dependencies = [
        ('administration_units', '0004_delete_administrativeunit_and_more'),
    ]

    operations = [
        migrations.RunPython(migrate, migrations.RunPython.noop)
    ]

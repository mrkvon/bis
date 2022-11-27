from django.core.management.base import BaseCommand

from bis.models import Location
from categories.models import DietCategory, EventIntendedForCategory, QualificationCategory, \
    AdministrationUnitCategory, MembershipCategory, EventProgramCategory, \
    EventCategory, GrantCategory, DonationSourceCategory, OrganizerRoleCategory, TeamRoleCategory, OpportunityCategory, \
    LocationProgramCategory, LocationAccessibilityCategory, RoleCategory, HealthInsuranceCompany, SexCategory, \
    EventGroupCategory
from translation.translate import _


class Command(BaseCommand):
    help = "Creates categories etc."

    def create_event_categories(self, data, prefix='', name_prefix=''):
        if len(prefix):
            prefix += '__'
        if len(name_prefix):
            name_prefix += ' - '

        for key, value in data.items():
            slug = prefix + key
            name = name_prefix + _(f'event_categories.{slug}')
            if value is None:
                EventCategory.objects.update_or_create(
                    slug=slug,
                    defaults=dict(name=name)
                )
            else:
                self.create_event_categories(value, slug, name)

    def handle(self, *args, **options):
        DietCategory.objects.update_or_create(slug='meat', defaults=dict(name='s masem'))
        DietCategory.objects.update_or_create(slug='vege', defaults=dict(name='vegetariánská'))
        DietCategory.objects.update_or_create(slug='vegan', defaults=dict(name='veganská'))

        EventIntendedForCategory.objects.update_or_create(slug='for_all', defaults=dict(name='pro všechny'))
        EventIntendedForCategory.objects.update_or_create(slug='for_young_and_adult',
                                                          defaults=dict(name='pro mládež a dospělé'))
        EventIntendedForCategory.objects.update_or_create(slug='for_kids', defaults=dict(name='pro děti'))
        EventIntendedForCategory.objects.update_or_create(slug='for_parents_with_kids',
                                                          defaults=dict(name='pro rodiče s dětmi'))
        EventIntendedForCategory.objects.update_or_create(slug='for_first_time_participant',
                                                          defaults=dict(name='pro prvoúčastníky'))

        p = QualificationCategory.objects.update_or_create(
            slug='consultant',
            defaults=dict(name='Konzultant', parent=None))[0]
        p = QualificationCategory.objects.update_or_create(
            slug='instructor',
            defaults=dict(name='Instruktor', parent=p))[0]
        p = QualificationCategory.objects.update_or_create(
            slug='organizer',
            defaults=dict(name='Organizátor (OHB)', parent=p))[0]
        QualificationCategory.objects.update_or_create(
            slug='weekend_organizer',
            defaults=dict(name='Organizátor víkendovek (OvHB)', parent=p))

        p = QualificationCategory.objects.update_or_create(
            slug='consultant_for_kids',
            defaults=dict(name='Konzultant Brďo', parent=None))[0]
        p = QualificationCategory.objects.update_or_create(
            slug='kids_leader',
            defaults=dict(name='Vedoucí Brďo', parent=p))[0]
        QualificationCategory.objects.update_or_create(
            slug='kids_intern',
            defaults=dict(name='Praktikant Brďo', parent=p))

        QualificationCategory.objects.update_or_create(
            slug='main_leader_of_kids_camps',
            defaults=dict(name='Hlavní vedoucí dětských táborů (HVDT)'))

        AdministrationUnitCategory.objects.update_or_create(slug="basic_section", defaults=dict(name='Základní článek'))
        AdministrationUnitCategory.objects.update_or_create(slug="headquarter", defaults=dict(name='Ústředí'))
        AdministrationUnitCategory.objects.update_or_create(slug="regional_center",
                                                            defaults=dict(name='Regionální centrum'))
        AdministrationUnitCategory.objects.update_or_create(slug="club", defaults=dict(name='Klub'))

        MembershipCategory.objects.update_or_create(slug='family', defaults=dict(name='rodinné'))
        MembershipCategory.objects.update_or_create(slug='family_member', defaults=dict(name='rodinný příslušník'))
        MembershipCategory.objects.update_or_create(slug='kid', defaults=dict(name='dětské do 15 let'))
        MembershipCategory.objects.update_or_create(slug='student', defaults=dict(name='individuální 15-26 let'))
        MembershipCategory.objects.update_or_create(slug='adult', defaults=dict(name='individuální nad 26 let'))
        MembershipCategory.objects.update_or_create(slug='member_elsewhere', defaults=dict(name='platil v jiném ZČ'))

        EventGroupCategory.objects.update_or_create(slug='camp', defaults=dict(name='Tábor'))
        EventGroupCategory.objects.update_or_create(slug='weekend_event', defaults=dict(name='Víkendovka'))
        EventGroupCategory.objects.update_or_create(slug='other', defaults=dict(name='Ostatní'))

        EventProgramCategory.objects.update_or_create(slug='monuments', defaults=dict(name='Akce památky'))
        EventProgramCategory.objects.update_or_create(slug='nature', defaults=dict(name='Akce příroda'))
        EventProgramCategory.objects.update_or_create(slug='kids', defaults=dict(name='BRĎO'))
        EventProgramCategory.objects.update_or_create(slug='eco_tent', defaults=dict(name='Ekostan'))
        EventProgramCategory.objects.update_or_create(slug='holidays_with_brontosaurus', defaults=dict(
            name='PsB (Prázdniny s Brontosaurem = vícedenní letní akce)'))
        EventProgramCategory.objects.update_or_create(slug='education', defaults=dict(name='Vzdělávání'))
        EventProgramCategory.objects.update_or_create(slug='international', defaults=dict(name='Mezinárodní'))
        EventProgramCategory.objects.update_or_create(slug='none', defaults=dict(name='Žádný'))

        event_categories = {
            'internal': {
                'general_meeting': None,
                'volunteer_meeting': None,
                'section_meeting': None,
            },
            'public': {
                'volunteering': None,
                'only_experiential': None,
                'educational': {
                    'lecture': None,
                    'course': None,
                    'ohb': None,
                    'educational': None,
                    'educational_with_stay': None,
                },
                'club': {
                    'lecture': None,
                    'meeting': None,
                },
                'other': {
                    'for_public': None,
                    'exhibition': None,
                    'eco_tent': None,
                }
            }
        }

        self.create_event_categories(event_categories)

        GrantCategory.objects.update_or_create(slug='msmt', defaults=dict(name='mšmt'))
        GrantCategory.objects.update_or_create(slug='other', defaults=dict(name='z jiných projektů'))

        DonationSourceCategory.objects.update_or_create(slug='bank_transfer', defaults=dict(name='bankovním převodem'))

        OrganizerRoleCategory.objects.update_or_create(slug='program', defaults=dict(name='Tvorba a vedení her'))
        OrganizerRoleCategory.objects.update_or_create(slug='material',
                                                       defaults=dict(name='Materiálně-technické zajištění'))
        OrganizerRoleCategory.objects.update_or_create(slug='cook', defaults=dict(name='Kuchař/ka'))
        OrganizerRoleCategory.objects.update_or_create(slug='photo', defaults=dict(name='Fotograf/ka'))
        OrganizerRoleCategory.objects.update_or_create(slug='propagation', defaults=dict(name='Propagace akcí'))
        OrganizerRoleCategory.objects.update_or_create(slug='communication',
                                                       defaults=dict(name='Komunikace s účastníky/lektory/lokalitou'))
        OrganizerRoleCategory.objects.update_or_create(slug='manager', defaults=dict(name='Hospodář/ka'))
        OrganizerRoleCategory.objects.update_or_create(slug='medic', defaults=dict(name='Zdravotník/ce'))
        OrganizerRoleCategory.objects.update_or_create(slug='singer', defaults=dict(name='Hudebník/ce'))
        OrganizerRoleCategory.objects.update_or_create(slug='generic', defaults=dict(name='Všeuměl / podržtaška'))

        TeamRoleCategory.objects.update_or_create(slug='lector', defaults=dict(name='Lektor'))
        TeamRoleCategory.objects.update_or_create(slug='lecturer', defaults=dict(name='Přednášející'))
        TeamRoleCategory.objects.update_or_create(slug='graphic', defaults=dict(name='Grafik'))
        TeamRoleCategory.objects.update_or_create(slug='translator', defaults=dict(name='Překladatel'))
        TeamRoleCategory.objects.update_or_create(slug='copywriter', defaults=dict(name='Copywriter'))
        TeamRoleCategory.objects.update_or_create(slug='marketing', defaults=dict(name='Markeťák'))
        TeamRoleCategory.objects.update_or_create(slug='web', defaults=dict(name='Webař'))
        TeamRoleCategory.objects.update_or_create(slug='manager', defaults=dict(name='Hospodář'))

        OpportunityCategory.objects.update_or_create(slug='organizing', defaults=dict(
            name='Organizování akcí',
            description='Příležitosti organizovat či pomáhat s pořádáním našich akcí.'))
        OpportunityCategory.objects.update_or_create(slug='collaboration', defaults=dict(
            name='Spolupráce',
            description='Příležitosti ke spolupráci na chodu a rozvoji Hnutí Brontosaurus.'))
        OpportunityCategory.objects.update_or_create(slug='location_help', defaults=dict(
            name='Pomoc lokalitě',
            description='Příležitosti k pomoci dané lokalitě, která to aktuálně potřebuje.'))

        LocationProgramCategory.objects.update_or_create(slug='nature', defaults=dict(name='AP - Akce příroda'))
        LocationProgramCategory.objects.update_or_create(slug='monuments', defaults=dict(name='APAM - Akce památky'))

        LocationAccessibilityCategory.objects.update_or_create(slug='good', defaults=dict(name='Snadná (0-1,5h)'))
        LocationAccessibilityCategory.objects.update_or_create(slug='ok', defaults=dict(name='Středně obtížná (1,5-3h)'))
        LocationAccessibilityCategory.objects.update_or_create(slug='bad', defaults=dict(name='Obtížná (více než 3h)'))

        RoleCategory.objects.update_or_create(slug='director', defaults=dict(name='Ředitel'))
        RoleCategory.objects.update_or_create(slug='admin', defaults=dict(name='Admin'))
        RoleCategory.objects.update_or_create(slug='office_worker', defaults=dict(name='Kancl'))
        RoleCategory.objects.update_or_create(slug='auditor', defaults=dict(name='KRK'))
        RoleCategory.objects.update_or_create(slug='executive', defaults=dict(name='VV'))
        RoleCategory.objects.update_or_create(slug='education_member', defaults=dict(name='EDU'))
        RoleCategory.objects.update_or_create(slug='chairman', defaults=dict(name='Předseda'))
        RoleCategory.objects.update_or_create(slug='vice_chairman', defaults=dict(name='Místopředseda'))
        RoleCategory.objects.update_or_create(slug='manager', defaults=dict(name='Hospodář'))
        RoleCategory.objects.update_or_create(slug='board_member', defaults=dict(name='Člen představenstva'))
        RoleCategory.objects.update_or_create(slug='main_organizer', defaults=dict(name='Hlavní organizátor'))
        RoleCategory.objects.update_or_create(slug='organizer', defaults=dict(name='Organizátor'))
        RoleCategory.objects.update_or_create(slug='any', defaults=dict(name='Kdokoli'))

        HealthInsuranceCompany.objects.update_or_create(slug='VZP', defaults=dict(
            name='Všeobecná zdravotní pojišťovna České republiky'))
        HealthInsuranceCompany.objects.update_or_create(slug='VOZP', defaults=dict(
            name='Vojenská zdravotní pojišťovna České republiky'))
        HealthInsuranceCompany.objects.update_or_create(slug='CZPZ', defaults=dict(
            name='Česká průmyslová zdravotní pojišťovna'))
        HealthInsuranceCompany.objects.update_or_create(slug='OZP', defaults=dict(
            name='Oborová zdravotní pojišťovna zaměstnanců bank, pojišťoven a stavebnictví'))
        HealthInsuranceCompany.objects.update_or_create(slug='ZPS', defaults=dict(
            name='Zaměstnanecká pojišťovna Škoda'))
        HealthInsuranceCompany.objects.update_or_create(slug='ZPMV', defaults=dict(
            name='Zdravotní pojišťovna ministerstva vnitra České republiky'))
        HealthInsuranceCompany.objects.update_or_create(slug='RBP', defaults=dict(
            name='RBP, zdravotní pojišťovna'))

        SexCategory.objects.update_or_create(slug='woman', defaults=dict(name='Žena'))
        SexCategory.objects.update_or_create(slug='man', defaults=dict(name='Muž'))
        SexCategory.objects.update_or_create(slug='other', defaults=dict(name='Jiné'))

        Location.objects.update_or_create(name='Online', defaults=dict(
            for_beginners=True,
            accessibility_from_prague=LocationAccessibilityCategory.objects.get(slug='good'),
            accessibility_from_brno=LocationAccessibilityCategory.objects.get(slug='good'),
        ))

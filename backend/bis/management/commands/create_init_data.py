from django.core.management.base import BaseCommand

from categories.models import DietCategory, PropagationIntendedForCategory, QualificationCategory, \
    AdministrationUnitCategory, MembershipCategory, EventProgramCategory, \
    EventCategory, GrantCategory, DonationSourceCategory, OrganizerRoleCategory, TeamRoleCategory, OpportunityCategory, \
    LocationProgram, LocationAccessibility


class Command(BaseCommand):
    help = "Creates categories etc."

    def create_event_categories(self, data, translations, prefix='', name_prefix=''):
        if len(prefix):
            prefix += '__'
        if len(name_prefix):
            name_prefix += ' - '

        for key, value in data.items():
            slug = prefix + key
            name = name_prefix + translations[slug]
            if type(value) == str:
                EventCategory.objects.update_or_create(
                    slug=slug,
                    defaults=dict(name=name)
                )
            else:
                self.create_event_categories(value, translations, slug, name)

    def handle(self, *args, **options):
        DietCategory.objects.update_or_create(slug='meat', defaults=dict(name='s masem'))
        DietCategory.objects.update_or_create(slug='vege', defaults=dict(name='vegetariánská'))
        DietCategory.objects.update_or_create(slug='vegan', defaults=dict(name='veganská'))

        PropagationIntendedForCategory.objects.update_or_create(slug='for_all', defaults=dict(name='pro všechny'))
        PropagationIntendedForCategory.objects.update_or_create(slug='for_young_and_adult',
                                                                defaults=dict(name='pro mládež a dospělé'))
        PropagationIntendedForCategory.objects.update_or_create(slug='for_kids', defaults=dict(name='pro děti'))
        PropagationIntendedForCategory.objects.update_or_create(slug='for_parents_with_kids',
                                                                defaults=dict(name='pro rodiče s dětmi'))
        PropagationIntendedForCategory.objects.update_or_create(slug='for_first_time_participant',
                                                                defaults=dict(name='pro prvoúčastníky'))

        c = QualificationCategory.objects.update_or_create(
            slug='Konzultant',
            defaults=dict(name='nejvyšší kvalifikace', parent=None))[0]
        i = QualificationCategory.objects.update_or_create(
            slug='Instruktor',
            defaults=dict(name='OHB + ODHB', parent=c))[0]
        odhb = QualificationCategory.objects.update_or_create(
            slug='ODHB',
            defaults=dict(name='Organizátor dětských akcí HB', parent=i))[0]
        QualificationCategory.objects.update_or_create(
            slug='OpDHB',
            defaults=dict(name='Praktikant dětských akcí HB', parent=odhb))
        ohb = QualificationCategory.objects.update_or_create(
            slug='OHB',
            defaults=dict(name='Organizátor akcí HB', parent=i))[0]
        QualificationCategory.objects.update_or_create(
            slug='OvHB',
            defaults=dict(name='Organizátor víkendových akcí HB', parent=ohb))

        QualificationCategory.objects.update_or_create(
            slug='HVDT',
            defaults=dict(name='Hlavní vedoucí dětských táborů'))

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

        EventProgramCategory.objects.update_or_create(slug='monuments', defaults=dict(name='Akce památky'))
        EventProgramCategory.objects.update_or_create(slug='nature', defaults=dict(name='Akce příroda'))
        EventProgramCategory.objects.update_or_create(slug='kids', defaults=dict(name='BRĎO'))
        EventProgramCategory.objects.update_or_create(slug='eco_tent', defaults=dict(name='Ekostan'))
        EventProgramCategory.objects.update_or_create(slug='holidays_with_brontosaurus', defaults=dict(
            name='PsB (Prázdniny s Brontosaurem = vícedenní letní akce)'))
        EventProgramCategory.objects.update_or_create(slug='education', defaults=dict(name='Vzdělávání'))
        EventProgramCategory.objects.update_or_create(slug='international', defaults=dict(name='Mezinárodní'))

        translations = {
            'internal': 'Interní',
            'internal__general_meeting': 'Valná hromada',
            'internal__volunteer_meeting': 'Schůzka dobrovolníků, týmovka',
            'internal__section_meeting': 'Oddílová, družinová schůzka',
            'public': 'Veřejná',
            'public__volunteering': 'Dobrovolnická',
            'public__volunteering__only_volunteering': 'Čistě dobrovolnická',
            'public__volunteering__with_experience': 'Dobrovolnická se zážitkovým programem',
            'public__only_experiential': 'Čistě zážitková',
            'public__sports': 'Sportovní',
            'public__educational': 'Vzdělávací',
            'public__educational__lecture': 'Přednáška',
            'public__educational__course': 'Kurz, školení',
            'public__educational__ohb': 'OHB',
            'public__educational__educational': 'Výukový program',
            'public__educational__educational_with_stay': 'Pobytový výukový program',
            'public__club': 'Klub',
            'public__club__lecture': 'Přednáška',
            'public__club__meeting': 'Setkání',
            'public__other': 'Ostatní',
            'public__other__for_public': 'Akce pro veřejnost',
            'public__other__exhibition': 'Výstava',
            'public__other__eco_tent': 'Ekostan',
        }

        event_categories = {
            'internal': {
                'general_meeting': 'Valná hromada',
                'volunteer_meeting': 'Schůzka dobrovolníků, týmovka',
                'section_meeting': 'Oddílová, družinová schůzka',
            },
            'public': {
                'volunteering': {
                    'only_volunteering': 'Čistě dobrovolnická',
                    'with_experience': 'Dobrovolnická se zážitkovým programem',
                },
                'only_experiential': 'Čistě zážitková',
                'sports': 'Sportovní',
                'educational': {
                    'lecture': 'Přednáška',
                    'course': 'Kurz, školení',
                    'ohb': 'OHB',
                    'educational': 'Výukový program',
                    'educational_with_stay': 'Pobytový výukový program',
                },
                'club': {
                    'lecture': 'Přednáška',
                    'meeting': 'Setkání',
                },
                'other': {
                    'for_public': 'Akce pro veřejnost',
                    'exhibition': 'Výstava',
                    'eco_tent': 'Ekostan',
                }
            }
        }

        self.create_event_categories(event_categories, translations)

        GrantCategory.objects.update_or_create(slug='msmt', defaults=dict(name='mšmt'))
        GrantCategory.objects.update_or_create(slug='other', defaults=dict(name='z jiných projektů'))

        DonationSourceCategory.objects.update_or_create(slug='bank_transfer', defaults=dict(name='bankovním převodem'))
        DonationSourceCategory.objects.update_or_create(slug='darujme', defaults=dict(name='darujme.cz'))

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

        LocationProgram.objects.update_or_create(slug='nature', defaults=dict(name='AP - Akce příroda'))
        LocationProgram.objects.update_or_create(slug='monuments', defaults=dict(name='APAM - Akce památky'))

        LocationAccessibility.objects.update_or_create(slug='good', defaults=dict(name='Snadná (0-1,5h)'))
        LocationAccessibility.objects.update_or_create(slug='ok', defaults=dict(name='Středně obtížná (1,5-3h)'))
        LocationAccessibility.objects.update_or_create(slug='bad', defaults=dict(name='Obtížná (více než 3h)'))

import requests
from dateutil.parser import isoparse
from django.conf import settings
from django.core.management.base import BaseCommand

from administration_units.models import AdministrationUnit
from bis.models import User, UserEmail, UserAddress
from categories.models import DonationSourceCategory
from donations.models import Donor, Donation


class Command(BaseCommand):
    help = "Import new donations from darujme"

    def handle(self, *args, **options):
        url = f"https://www.darujme.cz/api/v1/organization/206/pledges-by-filter" \
              f"?apiId={settings.DARUJME_API_KEY}" \
              f"&apiSecret={settings.DARUJME_SECRET}" \
              f"&projectId=525"  # adoptuj brontosaura

        data = requests.get(url).json()
        donation_source = DonationSourceCategory.objects.get(slug='darujme')

        for pledge in data['pledges']:
            donor = pledge['donor']
            custom = pledge['customFields']

            transactions = pledge['transactions']
            transactions = [t for t in transactions if t['state'] == 'sent_to_organization']

            if not transactions:
                continue

            user = User.objects.get_or_create(emails__email=donor['email'], defaults=dict(
                first_name=donor['firstName'],
                last_name=donor['lastName'],
                phone=donor['phone'],
            ))[0]

            UserEmail.objects.get_or_create(email=donor['email'], defaults=dict(user=user))
            UserAddress.objects.get_or_create(user=user, defaults=dict(
                street=donor['address']['street'],
                city=donor['address']['city'],
                zip_code=donor['address']['postCode'].replace(' ', '')[:5],
            ))

            donor = Donor.objects.get_or_create(user=user, defaults=dict(
                date_joined=isoparse(pledge['pledgedAt']),
                basic_section_support=custom.get('Brontosaurus_adopce_ZC') and AdministrationUnit.objects.get(
                    abbreviation=custom['Brontosaurus_adopce_ZC']),
                regional_center_support=custom.get('Brontosaurus_adopce_RC') and AdministrationUnit.objects.get(
                    abbreviation=custom['Brontosaurus_adopce_RC']),
            ))[0]

            for transaction in transactions:
                Donation.objects.get_or_create(_import_id=transaction['transactionId'], defaults=dict(
                    donor=donor,
                    donated_at=isoparse(transaction['receivedAt']),
                    amount=transaction['sentAmount']['cents'] / 100,
                    donation_source=donation_source,
                    info=f'přeposlaná částka: {transaction["outgoingAmount"]["cents"] / 100}'
                ))

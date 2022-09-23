from typing import Union, List

import requests
from django.conf import settings
from rest_framework.utils import json
from simplejson import JSONDecodeError

from ecomail.models import Contact, ContactLog

BASE_URI = "https://api2.ecomailapp.cz/"


def send(contacts: Union[Contact, List[Contact]], method, uri, data=None, params=None):
    if data is None:
        data = {}
    if params is None:
        params = {}
    if not isinstance(contacts, list):
        contacts = [contacts]

    response = requests.request(method, BASE_URI + uri,
                                json=data,
                                params=params,
                                headers={'key': settings.ECOMAIL_API_KEY})

    log = f"uri: {uri}\n\n" \
          f"status_code: {response.status_code}\n\n" \
          f"data: {json.dumps(data)}\n\n" \
          f"response: {response.text}\n\n" \
          f"reason: {response.reason}\n\n"

    for contact in contacts:
        ContactLog.objects.create(contact=contact, log=log, status=response.status_code)

    try:
        return response.json()
    except JSONDecodeError:
        return {"response": response}

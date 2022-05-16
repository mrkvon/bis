from typing import Union, List

import requests
from django.conf import settings
from rest_framework.utils import json
from simplejson import JSONDecodeError

from mailjet.models import Contact, ContactLog

BASE_URI = "https://api.mailjet.com/"


def send(contacts: Union[Contact, List[Contact]], method, uri, data=None, params=None, version="v3"):
    if data is None:
        data = {}
    if params is None:
        params = {}
    if not isinstance(contacts, list):
        contacts = [contacts]

    data["TemplateErrorReporting"] = {
        "Email": "mailjet@maesty.online",
        "Name": "Maesty"
    }

    response = requests.request(method, f"{BASE_URI}{version}/{uri}",
                                json=data,
                                params=params,
                                auth=(settings.MAILJET_API_KEY, settings.MAILJET_SECRET))

    log = f"uri: {uri}\n\n" \
          f"data: {json.dumps(data)}\n\n" \
          f"response: {response.text}\n\n" \
          f"reason: {response.reason}\n\n"

    for contact in contacts:
        ContactLog.objects.create(contact=contact, log=log, status=response.status_code)

    if response.status_code not in {200, 201, 204}:
        if settings.DEBUG:
            raise ValueError('wrong response code')

    try:
        return response.json()
    except JSONDecodeError:
        return {"response": response}

from mailjet.helpers import send
from mailjet.models import Contact
from mailjet.serializers import DeleteContactSerializer, CreateContactSerializer, SetSubscriptionStatusSerializer, \
    SendEmailSerializer


def delete_contact(email):
    DeleteContactSerializer(data=dict(email=email)).is_valid(raise_exception=True)

    contact, _ = Contact.objects.get_or_create(email=email)
    response = send(contact, "GET", f"REST/contact/{email}")

    # if contact exists in mailjet
    if 'Data' in response:
        id = response["Data"][0]["ID"]
        send(contact, "DELETE", f"contacts/{id}", version="v4")


def create_contact(email, data: dict = None):
    if data is None:
        data = {}
    CreateContactSerializer(data=dict(email=email, data=data)).is_valid(raise_exception=True)

    contact, _ = Contact.objects.get_or_create(email=email)

    send(contact, "POST", "REST/contact", {
        "Email": email
    })
    send(contact, "PUT", f"REST/contactdata/{email}", {
        "Data": [
            {
                "Name": key,
                "Value": value
            } for key, value in data.items()
        ]
    })


def set_subscription_status(email, list_id, is_subscribed):
    SetSubscriptionStatusSerializer(data=dict(email=email, list_id=list_id, is_subscribed=is_subscribed)).is_valid(
        raise_exception=True)

    contact, _ = Contact.objects.get_or_create(email=email)
    send(contact, "POST", f"REST/listrecipient", {
        "ContactAlt": email,
        "ListID": list_id,
        "IsUnsubscribed": "true"
    })

    res = send(contact, "GET", f"REST/listrecipient", params={
        "ContactEmail": email,
        "ContactsList": list_id
    })
    id = res["Data"][0]["ID"]

    send(contact, "PUT", f"REST/listrecipient/{id}", {
        "IsUnsubscribed": str(not is_subscribed).lower()
    })


def send_email(from_email, from_name, subject, template_id, recipients, reply_to=None, variables=None,
               attachments=None):
    if attachments is None:
        attachments = []
    if variables is None:
        variables = {}
    if reply_to is None:
        reply_to = from_email

    SendEmailSerializer(data=dict(from_email=from_email, from_name=from_name, subject=subject, template_id=template_id,
                                  recipients=recipients, variables=variables, attachments=attachments)).is_valid(
        raise_exception=True)

    contacts = [Contact.objects.get_or_create(email=email)[0] for email in recipients]
    res = send(contacts, "POST", f"send", {
        "FromEmail": from_email,
        "FromName": from_name,
        "Subject": subject,
        "Mj-TemplateID": template_id,
        "Mj-TemplateLanguage": True,
        "Vars": variables,
        "Recipients": [
            {
                "Email": email
            } for email in recipients
        ],
        "Attachments": [
            {
                "Filename": attachment['name'],
                "Content-type": attachment['content_type'],
                "content": attachment['data']
            } for attachment in attachments
        ],
        "Headers": {
            "Reply-To": reply_to
        }
    })
    assert len(res['Sent']) == len(recipients)
    print('SENT EMAIL', f"{subject=},\t{from_email=},\t{from_name=},\t{recipients=}")

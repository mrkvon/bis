from django.conf import settings

from ecomail import ecomail
from project.settings import EMAIL

SENDER_NAME = 'BIS'


def email_password_reset_link(user, login_code):
    email_text(user.email, 'Link pro (pře)nastavení hesla, platný jednu hodinu',
               f'{settings.FULL_HOSTNAME}/reset_password'
               f'?email={user.email}'
               f'&code={login_code.code}'
               f'&password_exists={user.has_usable_password()}')


def email_login_code(email, code):
    email_text(email, 'Kód pro přihlášení', f'tvůj kód pro přihlášení je {code}.')


def email_text(email, subject, text, reply_to=None):
    text = text.replace("\n", "<br>")
    ecomail.send_email(
        EMAIL, SENDER_NAME,
        subject,
        '111',
        [email],
        reply_to=reply_to,
        variables={'content': text}
    )

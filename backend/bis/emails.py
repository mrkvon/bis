from mailjet import mailjet
from project.settings import EMAIL

SENDER_NAME = 'BIS'


def email_login_code(user, code):
    mailjet.send_email(
        EMAIL, SENDER_NAME,
        'Kód pro přihlášení',
        '3937126',
        [user.email],
        variables={'code': code}
    )


def email_text(email, subject, text, reply_to=None):
    text = text.replace("\n", "<br>")
    mailjet.send_email(
        EMAIL, SENDER_NAME,
        subject,
        '3937114',
        [email],
        reply_to=reply_to,
        variables={'text': text}
    )

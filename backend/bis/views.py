from urllib.parse import urlencode

from django import forms
from django.contrib.auth import REDIRECT_FIELD_NAME, login
from django.core.exceptions import ValidationError
from django.forms import Form, EmailField, TextInput
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.views.generic import FormView
from rest_framework.exceptions import Throttled

from bis.emails import email_login_code
from bis.models import User
from login_code.models import LoginCode


class LoginForm(Form):
    email = EmailField(label="E-mail", widget=TextInput(attrs={'autofocus': 'autofocus'}))

    def clean_email(self):
        email = self.cleaned_data['email']
        if not User.objects.filter(email=email, email_exists=True).exists():
            raise ValidationError('Uživatel s tímto emailem neexistuje')

        user = User.objects.get(email=email)
        try:
            login_code = LoginCode.make(user)
        except Throttled:
            raise ValidationError('Příliš mnoho pokusů, zkuste to znovu za hodinu')

        email_login_code(user, login_code.code)

        return email


class LoginView(FormView):
    template_name = 'bis/login.html'
    form_class = LoginForm

    def form_valid(self, form):
        email = form.cleaned_data['email']
        args = {'email': email}
        next = self.request.GET.get(REDIRECT_FIELD_NAME)
        if next:
            args[REDIRECT_FIELD_NAME] = next

        url = reverse('code')
        query_string = urlencode(args)
        url = f"{url}?{query_string}"
        return HttpResponseRedirect(url)


class CodeForm(Form):
    code = forms.IntegerField(label='Kód z e-mailu')


class CodeView(FormView):
    template_name = 'bis/code.html'
    form_class = CodeForm

    def form_valid(self, form):
        email = self.request.GET['email']
        code = form.cleaned_data['code']
        next = self.request.GET.get(REDIRECT_FIELD_NAME, '/admin/')
        if not next:
            next = '/admin/'

        user = User.objects.get(email=email)
        LoginCode.is_valid(user, code)

        login(self.request, user)

        return HttpResponseRedirect(next)

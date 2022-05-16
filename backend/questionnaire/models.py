from django.contrib.gis.db.models import *

from event.models import EventRegistration
from translation.translate import translate_model


@translate_model
class Questionnaire(Model):
    # one to one relationship to event
    # holds relations to its questions and answers
    event_registration = OneToOneField(EventRegistration, on_delete=CASCADE, null=True, blank=True,
                                       related_name='questionnaire')

    class Meta:
        ordering = 'id',

    def __str__(self):
        return 'Dotazník'


@translate_model
class Question(Model):
    question = CharField(max_length=255)
    is_required = BooleanField(default=True)
    order = PositiveIntegerField(default=0)
    questionnaire = ForeignKey(Questionnaire, on_delete=CASCADE, related_name='questions')

    class Meta:
        ordering = 'order',

    def __str__(self):
        return self.question


@translate_model
class QuestionnaireAnswers(Model):
    # hold set of answers by specific user for specific questionnaire
    questionnaire = ForeignKey(Questionnaire, on_delete=CASCADE, related_name='answers')
    user = ForeignKey('bis.User', on_delete=CASCADE, related_name='filled_questionnaires')

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'Odpovědi uživatele {self.user}'


@translate_model
class Answer(Model):
    # holds answer for specific question
    question = ForeignKey(Question, on_delete=CASCADE, related_name='answers')
    part_of = ForeignKey(QuestionnaireAnswers, on_delete=CASCADE, related_name='answers')
    answer = TextField()

    class Meta:
        ordering = 'question__order',

    def __str__(self):
        return f'Odpověď na otázku {self.question}'

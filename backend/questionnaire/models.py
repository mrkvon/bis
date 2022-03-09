from django.contrib.gis.db.models import *


class Questionnaire(Model):
    # one to one relationship to event
    # holds relations to its questions and answers
    pass


class Question(Model):
    question = CharField(max_length=255)
    is_required = BooleanField(default=True)
    order = PositiveIntegerField(default=0)
    questionnaire = ForeignKey(Questionnaire, on_delete=CASCADE, related_name='questions')


class QuestionnaireAnswers(Model):
    # hold set of answers by specific user for specific questionnaire
    questionnaire = ForeignKey(Questionnaire, on_delete=PROTECT, related_name='answers')
    user = ForeignKey('bis.User', on_delete=PROTECT, related_name='filled_questionnaires')


class Answer(Model):
    # holds answer for specific question
    question = ForeignKey(Question, on_delete=PROTECT, related_name='answers')
    part_of = ForeignKey(QuestionnaireAnswers, on_delete=PROTECT, related_name='answers')
    answer = TextField()

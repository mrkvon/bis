from django.contrib import admin
from nested_admin.nested import NestedModelAdmin, NestedStackedInline, NestedTabularInline

from questionnaire.models import *


class QuestionAdmin(NestedTabularInline):
    model = Question
    sortable_field_name = 'order'
    extra = 0


class AnswerAdmin(NestedTabularInline):
    model = Answer
    extra = 0
    classes = ['collapse']


class QuestionnaireAnswersAdmin(NestedTabularInline):
    model = QuestionnaireAnswers
    inlines = AnswerAdmin,
    extra = 0
    classes = ['collapse']


@admin.register(Questionnaire)
class QuestionnaireAdmin(NestedModelAdmin):
    inlines = QuestionAdmin, QuestionnaireAnswersAdmin

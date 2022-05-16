from nested_admin.forms import SortableHiddenMixin
from nested_admin.nested import NestedTabularInline

from questionnaire.models import *


class QuestionAdmin(SortableHiddenMixin, NestedTabularInline):
    model = Question
    sortable_field_name = 'order'
    extra = 0


class AnswerAdmin(NestedTabularInline):
    model = Answer
    extra = 0
    classes = ['collapse']

    readonly_fields = 'question', 'answer'


class QuestionnaireAnswersAdmin(NestedTabularInline):
    model = QuestionnaireAnswers
    inlines = AnswerAdmin,
    extra = 0
    classes = ['collapse']

    autocomplete_fields = 'user',


class QuestionnaireAdmin(NestedTabularInline):
    model = Questionnaire
    inlines = QuestionAdmin, QuestionnaireAnswersAdmin

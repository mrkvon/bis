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


class QuestionnaireAnswersAdmin(NestedTabularInline):
    model = QuestionnaireAnswers
    inlines = AnswerAdmin,
    extra = 0
    classes = ['collapse']


class QuestionnaireAdmin(NestedTabularInline):
    model = Questionnaire
    inlines = QuestionAdmin, QuestionnaireAnswersAdmin

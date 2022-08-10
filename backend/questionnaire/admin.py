from nested_admin.forms import SortableHiddenMixin
from nested_admin.nested import NestedTabularInline

from bis.admin_permissions import PermissionMixin
from questionnaire.models import *


class QuestionAdmin(PermissionMixin, SortableHiddenMixin, NestedTabularInline):
    model = Question
    sortable_field_name = 'order'
    extra = 0


class AnswerAdmin(PermissionMixin, NestedTabularInline):
    model = Answer
    extra = 0
    classes = ['collapse']

    readonly_fields = 'question', 'answer'


class QuestionnaireAnswersAdmin(PermissionMixin, NestedTabularInline):
    model = QuestionnaireAnswers
    inlines = AnswerAdmin,
    extra = 0
    classes = ['collapse']

    autocomplete_fields = 'user',


class QuestionnaireAdmin(PermissionMixin, NestedTabularInline):
    model = Questionnaire
    inlines = QuestionAdmin, QuestionnaireAnswersAdmin

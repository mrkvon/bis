from bis.models import *


class ActiveQualificationFilter(admin.SimpleListFilter):
    title = 'Má aktivní kvalifikaci'
    parameter_name = 'active_qualification'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Ano'),
            ('no', 'Ne'),
        )

    def queryset(self, request, queryset):
        query = {'qualification__valid_till__gte': timezone.now().date()}
        if self.value() == 'yes':
            queryset = queryset.filter(**query)
        if self.value() == 'no':
            queryset = queryset.exclude(**query)
        return queryset


class ActiveMembershipFilter(admin.SimpleListFilter):
    title = 'Má aktivní členství'
    parameter_name = 'active_membership'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Ano'),
            ('no', 'Ne'),
        )

    def queryset(self, request, queryset):
        query = {'memberships__year': timezone.now().year}
        if self.value() == 'yes':
            queryset = queryset.filter(**query)
        if self.value() == 'no':
            queryset = queryset.exclude(**query)
        return queryset

# class ContactLogAdmin(StackedInline):
#     model = ContactLog
#     readonly_fields = 'status', 'log'
#
#
# @admin.register(Contact)
# class ContactAdmin(admin.ModelAdmin):
#     list_display = ['email']
#     readonly_fields = 'email',
#     inlines = [ContactLogAdmin]

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# On configure l'admin pour qu'il affiche notre champ "role"
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role', 'profile_photo')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role', 'profile_photo')}),
    )

admin.site.register(User, CustomUserAdmin)
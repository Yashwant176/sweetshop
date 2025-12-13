from django.contrib import admin
from .models import Sweet

@admin.register(Sweet)
class SweetAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'price', 'quantity')
    search_fields = ('name', 'category')

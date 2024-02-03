from django.contrib import admin
from .models import UnityData, Experiment

class ExperimentAdmin(admin.ModelAdmin):
    readonly_fields = ('token',)

# Register your models here.
admin.site.register(UnityData)
admin.site.register(Experiment, ExperimentAdmin)

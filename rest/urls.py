from django.urls import path
from . import views
from users.views import logout_view

urlpatterns = [
    path('', views.data_table, name='data_table'),
    path('logout/', logout_view, name='logout'),
    path('api/dataCSV/', views.UnityDataView.as_view()),
    path('generateCSV/', views.generate_csv, name='generate_csv'),
    path('api/saveDataCSV/', views.UnityDataCreateView.as_view(), name='unity_data_create'),
]

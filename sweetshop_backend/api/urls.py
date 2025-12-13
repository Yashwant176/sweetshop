from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('auth/register/',views.RegisterView.as_view(), name='register'),
    path('auth/login', TokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(),name='token_refresh'),

    path('sweets/',views.SweetListCreateView.as_view(),name='sweet_list_create'),
    path('sweets/<int:pk>/',views.SweetDetailView.as_view(), name='sweet_detail'),
    path('sweets/search/',views.SweetSearchView.as_view(), name='sweet_search'),

    path('sweets/<int:pk>/purchase/', views.PurchaseSweetView.as_view(), name='purchase_sweet'),
    path('sweets/<int:pk>/restock/', views.RestockSweetView.as_view(), name='restock_sweet'),
]

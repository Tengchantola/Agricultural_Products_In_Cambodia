from django.urls import path
from django.contrib import admin
from .views import (
    MarketListCreate, MarketDetail,
    ProductListCreate, ProductDetail,
    MarketPriceListCreate,
    RegisterView, CurrentUserView, AuthUserListView, AuthUserDetail, MarketPriceDetail, AuthUserListCreateView
)

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Markets
    path('markets/', MarketListCreate.as_view(), name='markets'),
    path('markets/<int:pk>/', MarketDetail.as_view(), name='market-detail'),

    # Products
    path('products/', ProductListCreate.as_view(), name='products'),
    path('products/<int:pk>/', ProductDetail.as_view(), name='product-detail'),

    # Market Prices
    path('prices/', MarketPriceListCreate.as_view(), name='prices'),
    path('prices/<int:pk>/', MarketPriceDetail.as_view(), name='prices-detail'),

    # Register
    path('register/', RegisterView.as_view(), name='register'),

    # Login
    path('login/', TokenObtainPairView.as_view(), name='login'),

    # Token Refresh
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Profile
    path('profile/', CurrentUserView.as_view(), name='current_user'),

    # Admin User
    path("users/", AuthUserListCreateView.as_view(), name="user-list-create"),
    path('users/<int:pk>/', AuthUserDetail.as_view(), name='user-detail'),
]

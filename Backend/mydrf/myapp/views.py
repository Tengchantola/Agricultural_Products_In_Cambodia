from rest_framework import generics
from .models import Market, Product, MarketPrice, AuthUser
from .serializers import MarketSerializer, ProductSerializer, MarketPriceSerializer, RegisterSerializer, AuthUserSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.permissions import IsAdminUser

class MarketListCreate(generics.ListCreateAPIView):
    queryset = Market.objects.all()
    serializer_class = MarketSerializer


class MarketDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Market.objects.all()
    serializer_class = MarketSerializer


class ProductListCreate(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class MarketPriceListCreate(generics.ListCreateAPIView):
    queryset = MarketPrice.objects.all()
    serializer_class = MarketPriceSerializer

class MarketPriceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = MarketPrice.objects.all()
    serializer_class = MarketPriceSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user = request.user
        return Response({
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        })
    
class AuthUserListView(generics.ListAPIView):
    queryset = AuthUser.objects.all()
    serializer_class = AuthUserSerializer
    permission_classes = [IsAuthenticated] 

class AuthUserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = AuthUser.objects.all()
    serializer_class = AuthUserSerializer
    permission_classes = [IsAuthenticated] 

class AuthUserListCreateView(generics.ListCreateAPIView):
    queryset = AuthUser.objects.all()
    serializer_class = AuthUserSerializer
    permission_classes = [IsAuthenticated] 
    
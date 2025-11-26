from rest_framework import serializers
from .models import Market, Product, MarketPrice, AuthUser
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
User = get_user_model()

class MarketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Market
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class MarketPriceSerializer(serializers.ModelSerializer):
    ProductName = serializers.CharField(source='Product.ProductName', read_only=True)
    MarketName = serializers.CharField(source='Market.MarketName', read_only=True)

    class Meta:
        model = MarketPrice
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuthUser
        fields = '__all__'
        extra_kwargs = {
            'is_staff': {'default': False},
            'is_superuser': {'default': False},
            'is_active': {'default': True},
            'date_joined': {'default': timezone.now},
        }


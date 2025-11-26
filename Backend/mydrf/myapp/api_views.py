from rest_framework import viewsets
from .models import Question, Choice, Student
from .serializers import MarketSerializer, ProductSerializer, MarketPriceSerializer


class MarketSerializer(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = MarketSerializer


class ProductSerializer(viewsets.ModelViewSet):
    queryset = Choice.objects.all()
    serializer_class = ProductSerializer


class MarketPriceSerializer(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = MarketPriceSerializer

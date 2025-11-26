from django.contrib import admin
from .models import Market, Product, MarketPrice
# Register your models here.
admin.site.register(Market)
admin.site.register(Product)
admin.site.register(MarketPrice)

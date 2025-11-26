from django.db import models

class Market(models.Model):
    MarketID = models.AutoField(primary_key=True)
    MarketName = models.CharField(max_length=100)
    Province = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.MarketName


class Product(models.Model):
    ProductID = models.AutoField(primary_key=True)
    ProductName = models.CharField(max_length=100)
    Category = models.CharField(max_length=100, blank=True, null=True)  # Fruit, vegetable, meat...

    def __str__(self):
        return self.ProductName


class MarketPrice(models.Model):
    PriceID = models.AutoField(primary_key=True)
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    Market = models.ForeignKey(Market, on_delete=models.CASCADE)
    Price = models.IntegerField()
    PriceDate = models.DateField()

    class Meta:
        unique_together = ('Product', 'Market', 'PriceDate')

    def __str__(self):
        return f"{self.Product.ProductName} - {self.Market.MarketName} - {self.Price}"

class AuthUser(models.Model):
    id = models.AutoField(primary_key=True)
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    email = models.CharField(max_length=254, blank=True)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    picture = models.CharField(max_length=200, blank=True)
    
    class Meta:
        db_table = 'AUTH_USER' 
        managed = False 

    def __str__(self):
        return self.username

from django.db import models

# Create your models here.
class Sweet(models.Model):
    name=models.CharField(max_length=100, unique=True)
    category=models.CharField(max_length=100)
    price=models.DecimalField(max_digits=5, decimal_places=2)
    quantity=models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.name} ({self.category})"
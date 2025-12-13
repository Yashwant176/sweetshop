from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Sweet
from .serializers import SweetSerializer

#auth
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "User already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        User.objects.create_user(username=username, password=password)
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )

#sweets list and create
class SweetListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sweets = Sweet.objects.all()
        serializer = SweetSerializer(sweets, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return Response(
                {"error": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = SweetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#sweets detail, update, delete
class SweetDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        sweet = get_object_or_404(Sweet, pk=pk)
        serializer = SweetSerializer(sweet)
        return Response(serializer.data)

    def put(self, request, pk):
        if not request.user.is_staff:
            return Response(
                {"error": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )

        sweet = get_object_or_404(Sweet, pk=pk)
        serializer = SweetSerializer(sweet, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response(
                {"error": "Admin only"},
                status=status.HTTP_403_FORBIDDEN
            )

        sweet = get_object_or_404(Sweet, pk=pk)
        sweet.delete()
        return Response(
            {"message": "Sweet deleted"},
            status=status.HTTP_204_NO_CONTENT
        )

#search
class SweetSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        name = request.query_params.get("name", "")
        sweets = Sweet.objects.filter(name__icontains=name)
        serializer = SweetSerializer(sweets, many=True)
        return Response(serializer.data)

#purchase
class PurchaseSweetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        quantity = int(request.data.get("quantity", 1))
        sweet = get_object_or_404(Sweet, pk=pk)

        if sweet.quantity < quantity:
            return Response(
                {"error": "Not enough stock"},
                status=status.HTTP_400_BAD_REQUEST
            )

        sweet.quantity -= quantity
        sweet.save()

        return Response(
            {
                "message": "Purchase successful",
                "remaining_stock": sweet.quantity
            },
            status=status.HTTP_200_OK
        )

#restock(admin only)
class RestockSweetView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        quantity = request.data.get("quantity")

        if not quantity:
            return Response(
                {"error": "Quantity is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        sweet = get_object_or_404(Sweet, pk=pk)
        sweet.quantity += int(quantity)
        sweet.save()

        return Response(
            {
                "message": "Sweet restocked successfully",
                "new_stock": sweet.quantity
            },
            status=status.HTTP_200_OK
        )

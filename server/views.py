#ALLOWS US TO INTEGRATE APIs USING PYTHON CODE
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import UserSerializer #Imports to allow writing JSON Objects into database
from rest_framework import status #Return status code for API calls Ex. 400, 201
from django.shortcuts import get_object_or_404 
from rest_framework.authtoken.models import Token #Gets User information
from django.contrib.auth.models import User
from django.http import JsonResponse #Adds API endpoint
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
import json

"""
AUTHENTICATION API ENDPOINTS (Used by the React frontend)

These API views replace Django's traditional HTML-based forms.
The frontend (Vite + React) sends POST requests to these endpoints
to handle signup and login. WORKING ON AUTH KEYS

Endpoints:
- POST /api/signup/  -> Creates user, returns token + user info
- POST /api/login/   -> Logs in user, returns token + user info
"""

#Login
'''
#LOGIN VIEW IN DJANGO DONT DELETE UNTIL SURE FRONTEND CONNECTED WITH BACKEND
@api_view(['POST'])
def login(request):
    user = get_object_or_404(User, username=request.data['username'])
    if not user.check_password(request.data['password']):
        return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(instance=user)
    return Response({"token": token.key, "user": serializer.data})
'''
@csrf_exempt
def api_login(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({"detail": "Username and password required"}, status=400)

    user = authenticate(username=username, password=password)
    if user is None:
        return JsonResponse({"detail": "Invalid credentials"}, status=400)

    # For now just return basic user info.
    # Later you can swap this for JWT / token auth.
    return JsonResponse(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
    )

#Signup
'''
#DITTO FROM LOGIN
@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(username=request.data['username'])
        user.set_password(request.data['password'])
        user.save()
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
'''
@csrf_exempt
def api_signup(request):
    if request.method != "POST":
        return JsonResponse({"detail": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    username = data.get("username")
    email = data.get("email", "")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({"detail": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"detail": "Username already taken"}, status=400)

    user = User.objects.create_user(username=username, email=email, password=password)

    return JsonResponse(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },
        status=201,
    )

#Token_Auth
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed for {}".format(request.user.email))

#Django API endpoint
def ping(request):
    return JsonResponse({"message": "Connecting with DJANGO"}) #Testing for connecting Front and Backend
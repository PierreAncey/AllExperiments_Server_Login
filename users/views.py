from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('data_table')
        else:
            return render(request, 'registration/login.html', {'error': 'Invalid username or password !'})
    else:
        return render(request, 'registration/login.html')
    
def logout_view(request):
    logout(request)
    return render(request, 'registration/login.html')
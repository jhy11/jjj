import json
from django.views.generic import View
from django.http import HttpRequest, JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from management.models import member, membership

class index(View):
    def get(self, request: HttpRequest, *args, **kwargs):
        context = {}
        
        return render(request, 'index.html', context)


class LogoutView(View):
    # post로 고쳐야함
    def get(self, request: HttpRequest, *args, **kwargs):
        logout(request)

        return redirect('/')


class LoginView(View):
    '''
    로그인 기능
    '''
    def get(self, request: HttpRequest, *args, **kwargs):
        #이미 로그인한 상태
        if request.user.id:
            print("lll")
            print(request.user)
            return redirect('/')

        return render(request, 'login.html')

    def post(self, request: HttpRequest, *args, **kwargs):
        context = {}

        id = request.POST['username']
        password = request.POST['password']

        user = authenticate(username=id, password=password)

        if user is not None:
            login(request, user)
            context['success'] = True
            context['message'] = '로그인 되었습니다.'
        else:
            context['success'] = False
            context['message'] = '일치하는 회원정보가 없습니다.'
        
        return JsonResponse(context, content_type='application/json')

class RegisterView(View):
    '''
    회원가입 기능, 이메일 전송
    '''
    def get(self, request: HttpRequest, *args, **kwargs):
        #context = {}
        #if request.user.id:
        #    return redirect('/')

        return render(request, 'register.html')

    def post(self, request: HttpRequest, *args, **kwargs):
        context = {}

        id = request.POST['username']
        password = request.POST['password']
        confirm_password = request.POST['confirm-password']
        name = request.POST['register-name']
        email = request.POST['register-email']
        phone = request.POST['register-phone']

        if password != confirm_password:
            context['success'] = False
            context['message'] = '비밀번호가 일치하지 않습니다.'
            return JsonResponse(context, content_type='application/json')

        try:
            user = User.objects.get(username=id)
            context['success'] = False
            context['message'] = '이미 존재하는 아이디입니다'
            return JsonResponse(context, content_type='application/json')
        except:
            print('사용 가능한 아이디')

        try:
            mem = member.objects.get(mem_phone=phone)
            context['success'] = False
            context['message'] = '이미 가입한 번호입니다.'
            return JsonResponse(context, content_type='application/json')
        except:
            print('사용 가능한 번호')

        try:
            user = User.objects.get(email=email)
            context['success'] = False
            context['message'] = '이미 가입한 이메일입니다.'
            return JsonResponse(context, content_type='application/json')
        except:
            print('사용 가능한 이메일 주소')
            user = User.objects.create_user(
                id,
                email,
                password,
            )
            user.is_active = True
            user.save()

            userid = user.id
            mem = member.objects.create(
                    user = User.objects.filter(id=userid).first(),
                    mem_name = name,
                    mem_phone = phone,
                    mem_point = 2000,
                    mem_level = membership.objects.filter(level='Basic').first(),
                )

        context['success'] = True
        context['message'] = '회원 가입 완료'
        context['id'] = id
        context['password'] = password
        context['email'] = email
        return JsonResponse(context, content_type='application/json')


class CheckSameId(View):
    def post(self, request: HttpRequest, *args, **kwargs):
        request.POST = json.loads(request.body)
        context = {}

        id = request.POST['username']

        try:
            user = User.objects.get(username=id)
            context['success'] = False
            return JsonResponse(context, content_type='application/json')

        except:
            context['success'] = True
        return JsonResponse(context, content_type='application/json')


class CheckSameEmail(View):
    def post(self, request: HttpRequest, *args, **kwargs):
        request.POST = json.loads(request.body)
        context = {}

        email = request.POST['email']

        try:
            user = User.objects.get(email=email)
            context['success'] = False
            return JsonResponse(context, content_type='application/json')

        except:
            context['success'] = True
        return JsonResponse(context, content_type='application/json')
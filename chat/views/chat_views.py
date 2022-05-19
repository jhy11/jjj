from itertools import count
from django.http import HttpRequest, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View

from management.models import shop, product, member, coupon

class ChatView(View):
    template_name='chat.html'

    def get(self, request: HttpRequest):
        context={}
        Shop = shop.objects.get(manager__user__id=request.user.id)
        
        shopcnt = shop.objects.count() # 현재 28
        print(shopcnt)

        context['shop'] = Shop
        
        return render(request, self.template_name, context=context)

class IssueCoupon(View):
    '''
    채팅 중인 멤버에게 흥정한 상품의 쿠폰을 발행합니다
    '''
    def get(self, request: HttpRequest):
        context ={}

        productId = request.GET.get('proId')
        memberName = request.GET.get('memName')

        Member  = member.objects.get(user__username = memberName)
        Product = product.objects.get(id = productId)
        ShopId = product.objects.get(id=productId).shop.id
        Shop = shop.objects.get(id = ShopId)

        # 10프로 할인 쿠폰 발급
        coupon.objects.create(
            member = Member,
            product = Product,
            shop = Shop,
            rate=10,
        )



        context['success'] = True
        context['message'] = '쿠폰을 성공적으로 발행했습니다'
        return JsonResponse(context, content_type='application/json')

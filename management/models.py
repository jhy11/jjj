from django.db import models
from django.db.models.deletion import CASCADE
from config.models import BaseModel
from django.contrib.auth.models import User
from django_quill.fields import QuillField


#회원등급
class membership(BaseModel):
    level = models.CharField(db_column='level', max_length=50, blank=True, null=True)
    condition = models.IntegerField(db_column='condition', blank=True, null=True)
    acc_rate = models.IntegerField(db_column='acc_rate', blank=True, null=True)

    class Meta:
            db_table = 'membership'


# 회원
class member(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="member", null=True)
    mem_level =  models.ForeignKey(membership, on_delete=models.CASCADE, verbose_name='membership', default=1)
    mem_name = models.CharField(db_column='mem_name', max_length=100, blank=True, null=True)
    mem_phone = models.CharField(db_column='mem_phone', max_length=100, blank=True, null=True)
    mem_point = models.IntegerField(db_column='mem_point', blank=True, null=True)
    monthtly_price = models.IntegerField(db_column='monthtly_price', blank=True, null=True)

    class Meta:
        db_table = "member"


#상점 카테고리
class shop_category(BaseModel):
    name = models.CharField(db_column='name', max_length=50, blank=True, null=True)
 
    class Meta:
            db_table = 'shop_category'

#상점
class shop(BaseModel):
    shop_category = models.ForeignKey(shop_category, on_delete=models.CASCADE, verbose_name='shop_category', default=1)
    manager = models.ForeignKey(member, on_delete=models.CASCADE, verbose_name='manager', default=1)
    shop_name = models.CharField(db_column='shop_name', max_length=50, blank=True, null=True)
    shop_phone = models.CharField(db_column='shop_phone', max_length=50, blank=True, null=True)
    
    class Meta:
            db_table = 'shop'


#상품 카테고리
class pro_category(BaseModel):
    name = models.CharField(db_column='name', max_length=50, blank=True, null=True)
 
    class Meta:
            db_table = 'pro_category'


#상품
class product(BaseModel):
    pro_category = models.ForeignKey(pro_category, on_delete=models.CASCADE, verbose_name='pro_category', default=1)
    shop = models.ForeignKey(shop, on_delete=models.CASCADE, verbose_name='shop', default=1)
    name = models.CharField(db_column='name', max_length=50, blank=True, null=True)
    price = models.CharField(db_column='price', max_length=50, blank=True, null=True)
    stock = models.CharField(db_column='stock', max_length=50, blank=True, null=True)
    status = models.CharField(db_column='status', max_length=50, blank=True, null=True)
    # comment = models.CharField(db_column='comment', max_length=50, blank=True, null=True) #short comment
    description = models.TextField(db_column='description',blank=True, null=True)
    content = QuillField(blank=True, null=True)
    main_img = models.ImageField(blank=True, null=True, upload_to='product/main')
    #image = models.CharField(db_column='image', max_length=1024, blank=True, null=True)
    #image_type = models.CharField(db_column='image_type', max_length=50)
    
    class Meta:
        db_table = 'product'

#상품옵션
class option(BaseModel):
    product = models.ForeignKey(product, on_delete=models.CASCADE, verbose_name='product', default=1)
    opt_name = models.CharField(db_column='opt_name', max_length=50, blank=True, null=True)
 
    class Meta:
            db_table = 'option'


#주문
class order(BaseModel):
    member = models.ForeignKey(member, on_delete=models.CASCADE, verbose_name='member', default=1)
    address = models.CharField(db_column='address', max_length=50, blank=True, null=True)
    code = models.CharField(db_column='code', max_length=50, blank=True, null=True)
    name = models.CharField(db_column='name', max_length=50, blank=True, null=True)
    call = models.CharField(db_column='call', max_length=50, blank=True, null=True)
    status = models.CharField(db_column='status', max_length=50, blank=True, null=True)
    date = models.CharField(db_column='date', max_length=50, blank=True, null=True)
    type = models.CharField(db_column='type', max_length=50, blank=True, null=True)
    transport_no = models.CharField(db_column='transport_no', max_length=50, blank=True, null=True)
    total_price = models.IntegerField(db_column='total_price', blank=True, null=True)
    order_no = models.CharField(db_column='order_no', max_length=50, blank=True, null=True)
    
    class Meta:
            db_table = 'order'

#상품-주문
class order_product(BaseModel):
    product = models.ForeignKey(product, on_delete=models.CASCADE, verbose_name='prdoduct', default=1)
    order = models.ForeignKey(order, on_delete=models.CASCADE, verbose_name='order', default=1)
    amount = models.IntegerField(db_column='amount', blank=True, null=True)
    status = models.CharField(db_column='status', max_length=50, blank=True, null=True)
 
    class Meta:
            db_table = 'order-product'


#상품 문의 카테고리
class qna_category(BaseModel):
    name = models.CharField(db_column='name', max_length=50, blank=True, null=True)

    class Meta:
            db_table = 'qna_category'


#상품 문의
class qna(BaseModel):
    member = models.ForeignKey(member, on_delete=models.CASCADE, verbose_name='member', default=1)
    product = models.ForeignKey(product, on_delete=models.CASCADE, verbose_name='product', default=1)
    category = models.ForeignKey(qna_category, on_delete=models.CASCADE, verbose_name='category', default=1)
    title = models.CharField(db_column='title', max_length=50, blank=True, null=True)
    content = models.CharField(db_column='content', max_length=50, blank=True, null=True)
    password = models.CharField(db_column='password', max_length=50, blank=True, null=True)
    answer_flag = models.CharField(db_column='answer_flag', max_length=10, blank=True, null=True, default='0')

    class Meta:
            db_table = 'qna'

#상품 문의 답변
class qna_answer(BaseModel):
    qna = models.ForeignKey(qna, on_delete=models.CASCADE, verbose_name='qna', default=1)
    content = models.CharField(db_column='content', max_length=50, blank=True, null=True)

    class Meta:
            db_table = 'qna_answer'

#결제
class payment(BaseModel):
    member = models.ForeignKey(member, on_delete=models.CASCADE, verbose_name='member', default=1)
    pay_method = models.CharField(db_column='pay_method', max_length=50, blank=True, null=True)

    class Meta:
            db_table = 'payment'


#후기
class comment(BaseModel):
    comment_img = models.ImageField(blank=True, null=True, upload_to='comment/main')
    member = models.ForeignKey(member, on_delete=models.CASCADE, verbose_name='member', default=1)
    product = models.ForeignKey(product, on_delete=models.CASCADE, verbose_name='product', default=1)
    content = models.CharField(db_column='content', max_length=50, blank=True, null=True)
    rate = models.CharField(db_column='rate', max_length=50, blank=True, null=True)

    class Meta:
            db_table = 'comment'

#후기 답변
class comment_reply(BaseModel):
    comment = models.ForeignKey(comment, on_delete=models.CASCADE, verbose_name='comment', default=1)
    content = models.CharField(db_column='content', max_length=50, blank=True, null=True)

    class Meta:
            db_table = 'comment_reply'
            
#장바구니
class cart(BaseModel):
    member = models.ForeignKey(member, on_delete=models.CASCADE, verbose_name='member', default=1)

    class Meta:
            db_table = 'cart'

#장바구니-상품
class cart_product(BaseModel):
    cart = models.ForeignKey(cart, on_delete=models.CASCADE, verbose_name='cart', default=1)
    product = models.ForeignKey(product, on_delete=models.CASCADE, verbose_name='product', default=1)
    amount = models.CharField(db_column='amount', max_length=50, blank=True, null=True)

    class Meta:
            db_table = 'cart-product'

#배송주소
class address(BaseModel):
    member = models.ForeignKey(member, on_delete=models.CASCADE, verbose_name='member', default=1)
    ad_name = models.CharField(db_column='ad_name', max_length=50, blank=True, null=True)
    code = models.CharField(db_column='code', max_length=50, blank=True, null=True)
    ad_detail = models.CharField(db_column='ad_detail', max_length=50, blank=True, null=True)

    class Meta:
            db_table = 'address'
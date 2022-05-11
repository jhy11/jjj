from django_quill.forms import QuillFormField
from django import forms
from management.models import product, pro_subcategory
from django.forms import HiddenInput



class ProjectForm(forms.Form):
    body = QuillFormField()

class ProjectSecondForm(forms.ModelForm):
    class Meta:
        model = product
      
        exclude = ['DeleteFlag', 'shop', 'deleted_at']
      
        labels = {
            'pro_subcategory': '상품카테고리',
            'name': '상품명',
            'price': '상품 가격',
            'stock': '재고 보유량',
            'description': '상세설명',
            'content': '내용',
            'main_img': '대표이미지(사진첨부필수)',

        }
        widgets = { 
            'status': forms.HiddenInput(attrs={'value': 0}),
         } 
       

      
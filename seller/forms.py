from django_quill.forms import QuillFormField
from django import forms
from management.models import product, pro_subcategory,comment,comment_reply
from django.forms import HiddenInput



class ProjectForm(forms.ModelForm):
    body = QuillFormField()

class ProjectSecondForm(forms.ModelForm):
    
    class Meta:
        model = product
      
        exclude = ['DeleteFlag','deleted_at']
      
        labels = {
            'pro_subcategory': '상품카테고리',
            'name': '상품명',
            'price': '상품 가격',
            'stock': '재고 보유량',
            'description': '상세설명',
            'content': '내용',
            'main_img': '대표이미지',

        }
        widgets = { 
            'pro_subcategory': forms.Select(attrs={'class':'form-control','placeholder':"카테고리"}),
            'name': forms.TextInput(attrs={'class':'form-control','placeholder':"상품명을 입력하세요"}),
            'price': forms.TextInput(attrs={'class':'form-control','type':'number','placeholder':"가격을 입력하세요"}),
            'description': forms.Textarea(attrs={'class':'form-control','placeholder':"상품설명을 입력하세요"}),
            'main_img': forms.FileInput(attrs={'class':'form-control','type':'file','multiple':'multiple','required': 'required'}),
            'status': forms.HiddenInput(attrs={'value': 0}),
            'shop': forms.HiddenInput(),

         } 
       

      
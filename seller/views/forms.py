from django import forms
from management.models import pro_category, product
from django_quill.forms import QuillFormField

class ProjectForm(forms.Form):
    content = QuillFormField()
"""

class ProjectSecondForm(forms.ModelForm):
    class Meta:
        model = product
        fields =  '__all__'
        exclude = ['pro_category', 'shop', 'main_img', 'status']
        #('name', 'price', 'stock', 'description', 'content',)
"""
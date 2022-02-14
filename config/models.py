from tkinter.tix import Tree
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models.deletion import DO_NOTHING
from django.db.models.signals import post_save
from django.dispatch import receiver


class BaseModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='생성시간')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='수정시간')
    deleted_at = models.DateTimeField(null=True, verbose_name='삭제시간')
    DeleteFlag = models.CharField(db_column='DeleteFlag', max_length=10, blank=True, null=True, default='0')

    def delete(self, using=None, keep_parents=False):
        self.DeleteFlag = '1' 
        self.deleted_at = timezone.now()
        self.save(using=using)
        return 

    class Meta:
        abstract = True

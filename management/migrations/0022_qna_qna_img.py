# Generated by Django 4.0.1 on 2022-05-01 04:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('management', '0021_liked_liked_product'),
    ]

    operations = [
        migrations.AddField(
            model_name='qna',
            name='qna_img',
            field=models.ImageField(blank=True, null=True, upload_to='qna/main'),
        ),
    ]

from rest_framework import serializers
from .models import BlogPost
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class BlogPostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'author']
        read_only_fields = ['created_at', 'updated_at']
    
    def create(self, validated_data):
        # Get the current user from the context
        user = self.context.get('request').user
        blog_post = BlogPost.objects.create(author=user, **validated_data)
        return blog_post
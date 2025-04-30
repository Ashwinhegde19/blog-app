from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import BlogPost
from .serializers import BlogPostSerializer

class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow authors of a blog post to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions are only allowed to the author of the post
        return obj.author == request.user

class BlogPostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing blog posts.
    """
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

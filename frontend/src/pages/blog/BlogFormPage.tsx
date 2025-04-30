import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import BlogService, { BlogPost, CreateBlogData } from '../../services/blog.service';
import AuthService from '../../services/auth.service';
import { getErrorMessage } from '../../utils/errorUtils';

const BlogFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  useEffect(() => {
    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // If ID is provided, it's an edit operation
    if (id) {
      setIsEdit(true);
      fetchBlog(parseInt(id));
    }
  }, [id, navigate]);

  const fetchBlog = async (blogId: number) => {
    try {
      setInitialLoading(true);
      const blog = await BlogService.getBlogById(blogId);
      setTitle(blog.title);
      setContent(blog.content);
      
      // Check if current user is the author
      const currentUser = await AuthService.getCurrentUser();
      if (blog.author.id !== currentUser.id) {
        setError('You do not have permission to edit this blog post.');
        navigate(`/blogs/${blogId}`);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to fetch blog post for editing.'));
      console.error(err);
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setLoading(true);
    setError('');

    const blogData: CreateBlogData = {
      title: title.trim(),
      content: content.trim()
    };

    try {
      let response: BlogPost;
      
      if (isEdit && id) {
        response = await BlogService.updateBlog(parseInt(id), blogData);
      } else {
        response = await BlogService.createBlog(blogData);
      }
      
      navigate(`/blogs/${response.id}`);
    } catch (err) {
      setError(getErrorMessage(err, isEdit ? 'Failed to update blog post.' : 'Failed to create blog post.'));
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
          <CardDescription>
            {isEdit 
              ? 'Update your blog post with the form below' 
              : 'Share your thoughts with the world by creating a new blog post'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm bg-destructive/20 text-destructive rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for your blog post"
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Content
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content here..."
                className="min-h-[300px] resize-y"
                disabled={loading}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(id ? `/blogs/${id}` : '/blogs')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading 
                  ? (isEdit ? 'Saving...' : 'Creating...') 
                  : (isEdit ? 'Save Changes' : 'Create Post')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogFormPage;
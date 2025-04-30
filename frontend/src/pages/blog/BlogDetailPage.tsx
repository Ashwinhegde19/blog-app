import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import BlogService, { BlogPost } from '../../services/blog.service';
import AuthService from '../../services/auth.service';
import { formatDate } from '../../utils';
import { getErrorMessage } from '../../utils/errorUtils';

const BlogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthor, setIsAuthor] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const blogData = await BlogService.getBlogById(parseInt(id));
        setBlog(blogData);
        
        // Check if the current user is the author
        if (AuthService.isAuthenticated()) {
          try {
            const currentUser = await AuthService.getCurrentUser();
            setIsAuthor(blogData.author.id === currentUser.id);
          } catch (error) {
            console.error('Error checking if user is author:', error);
          }
        }
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to fetch blog post. It may have been deleted or does not exist.'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirmDelete) return;

    try {
      setIsDeleting(true);
      await BlogService.deleteBlog(parseInt(id));
      navigate('/blogs');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete blog post. Please try again.'));
      setConfirmDelete(false);
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
          <CardFooter>
            <Link to="/blogs">
              <Button variant="outline">Back to Blogs</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Blog Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The blog post you're looking for does not exist or has been removed.</p>
          </CardContent>
          <CardFooter>
            <Link to="/blogs">
              <Button variant="outline">Back to Blogs</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl mb-2">{blog.title}</CardTitle>
              <CardDescription>
                By {blog.author.username} • {formatDate(blog.created_at)}
              </CardDescription>
            </div>
            {isAuthor && (
              <div className="flex space-x-2">
                <Link to={`/blogs/edit/${blog.id}`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                {!confirmDelete ? (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setConfirmDelete(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap">
              {blog.content.split('\n').map((paragraph, index) => (
                paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            {blog.updated_at !== blog.created_at && (
              <p>Last updated on {formatDate(blog.updated_at)}</p>
            )}
          </div>
          <Link to="/blogs">
            <Button variant="outline">Back to Blogs</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BlogDetailPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import BlogService, { BlogPost, BlogsResponse } from '../../services/blog.service';
import { formatDate, truncateText } from '../../utils';
import { getErrorMessage } from '../../utils/errorUtils';

const BlogsListPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null
  });
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response: BlogsResponse = await BlogService.getAllBlogs(page);
        setBlogs(response.results);
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous
        });
      } catch (err) {
        setError(getErrorMessage(err, 'Failed to fetch blogs. Please try again later.'));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  const handleNextPage = () => {
    if (pagination.next) {
      setPage(page + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous) {
      setPage(page - 1);
      window.scrollTo(0, 0);
    }
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">Blog Posts</h1>
          <p className="text-muted-foreground mb-8">Discover thoughts and stories from our community</p>
        </div>

        {error && (
          <div className="p-4 text-sm bg-destructive/20 text-destructive rounded-md">
            {error}
          </div>
        )}

        {blogs.length === 0 && !loading ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No blogs found</h2>
            <p className="text-muted-foreground mb-4">Be the first to create a blog post!</p>
            <Link to="/create-blog">
              <Button>Create a Blog Post</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Card key={blog.id} className="flex flex-col hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                    </CardTitle>
                    <CardDescription>
                      By {blog.author.username} • {formatDate(blog.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="line-clamp-3 text-muted-foreground">
                      {truncateText(blog.content, 150)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/blogs/${blog.id}`} className="w-full">
                      <Button variant="outline" className="w-full">Read More</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="flex justify-between items-center mt-8">
              <div className="text-sm text-muted-foreground">
                Showing {blogs.length} of {pagination.count} blogs
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousPage} 
                  disabled={!pagination.previous}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNextPage} 
                  disabled={!pagination.next}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogsListPage;
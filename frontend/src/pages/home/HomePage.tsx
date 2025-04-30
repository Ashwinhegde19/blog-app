import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import BlogService, { BlogPost } from '../../services/blog.service';
import { formatDate, truncateText } from '../../utils';
import AuthService from '../../services/auth.service';

const HomePage: React.FC = () => {
  const [latestBlogs, setLatestBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = AuthService.isAuthenticated();

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        setLoading(true);
        const response = await BlogService.getAllBlogs(1);
        // Get only the latest 3 blogs
        setLatestBlogs(response.results.slice(0, 3));
      } catch (error) {
        console.error('Error fetching latest blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to BlogApp
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-muted-foreground">
            A place to share your thoughts, ideas, and stories with the world.
          </p>
          <div className="mt-10">
            <Link to="/blogs">
              <Button size="lg" className="mr-4">
                Browse Blogs
              </Button>
            </Link>
            <Link to={isAuthenticated ? "/create-blog" : "/login"}>
              <Button variant="outline" size="lg">
                {isAuthenticated ? "Create New Blog" : "Get Started"}
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Feature section */}
        <div className="mt-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-foreground">Easy to Use</h3>
              <p className="mt-2 text-base text-muted-foreground">
                Create an account and start blogging in minutes. No complicated setup required.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-foreground">Share Your Voice</h3>
              <p className="mt-2 text-base text-muted-foreground">
                Express yourself through well-formatted blog posts that look great on any device.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 text-center hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-foreground">Build Community</h3>
              <p className="mt-2 text-base text-muted-foreground">
                Connect with readers and other writers who share your interests.
              </p>
            </div>
          </div>
        </div>

        {/* Latest blogs section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-10">Latest Blog Posts</h2>
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : latestBlogs.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {latestBlogs.map((blog) => (
                <Card key={blog.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">
                      <Link to={`/blogs/${blog.id}`} className="hover:text-primary transition-colors">
                        {blog.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      By {blog.author.username} • {formatDate(blog.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-3 text-muted-foreground">
                      {truncateText(blog.content, 120)}
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
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">No blog posts yet. Be the first to create one!</p>
              <div className="mt-4">
                <Link to={isAuthenticated ? "/create-blog" : "/login"}>
                  <Button>
                    {isAuthenticated ? "Create New Blog" : "Sign In to Blog"}
                  </Button>
                </Link>
              </div>
            </div>
          )}
          {latestBlogs.length > 0 && (
            <div className="text-center mt-10">
              <Link to="/blogs">
                <Button variant="secondary">View All Blog Posts</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
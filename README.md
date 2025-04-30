# Blog Application

A full-stack blog application built with Django (backend) and React with TypeScript (frontend). The application allows users to create, view, and manage blog posts.

## Features

- User authentication using email and password
- Create, read, update, and delete blog posts
- Public blog listing with pagination
- Responsive design for mobile and desktop
- Protected routes for authenticated users

## Technology Stack

### Backend
- Django
- Django REST Framework
- SQLite database
- JWT Authentication

### Frontend
- React with TypeScript
- React Router for navigation
- Tailwind CSS with Shadcn UI components
- Axios for API communication

## Getting Started

### Prerequisites
- Python 3.x
- Node.js and npm
- Git

### Installation and Setup

#### Backend Setup

1. Clone the repository and navigate to the project directory:
```
git clone https://github.com/yourusername/blog-app.git
cd blog-app
```

2. Navigate to the backend directory:
```
cd backend
```

3. Create and activate a virtual environment:
```
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

4. Install dependencies using the requirements.txt file:
```
pip install -r requirements.txt
```

5. Run migrations to set up the database:
```
python manage.py migrate
```

6. Create a superuser (admin) for accessing the admin interface:
```
python manage.py createsuperuser
```

7. Start the Django development server:
```
python manage.py runserver
```

The backend will be accessible at http://localhost:8000/
The admin interface will be at http://localhost:8000/admin/ (login with your superuser credentials)

#### Frontend Setup

1. Open a new terminal window and navigate to the frontend directory from the project root:
```
cd frontend
```

2. Install dependencies:
```
npm install
```

3. Start the React development server:
```
npm start
```

The frontend will be accessible at http://localhost:3000/

## Using the Application

1. Register a new account through the Register page
2. Log in with your credentials
3. Browse existing blog posts on the home page
4. Create new posts using the "Create Post" button
5. Edit or delete your own posts from the post detail page

## API Endpoints

### Authentication
- `POST /api/users/register/` - Register a new user
- `POST /api/users/token/` - Get JWT tokens
- `POST /api/users/token/refresh/` - Refresh JWT token
- `GET /api/users/me/` - Get current user details

### Blog Posts
- `GET /api/blog/posts/` - List all blog posts (paginated)
- `GET /api/blog/posts/{id}/` - Retrieve a specific blog post
- `POST /api/blog/posts/` - Create a new blog post (authenticated users only)
- `PUT /api/blog/posts/{id}/` - Update a blog post (blog author only)
- `DELETE /api/blog/posts/{id}/` - Delete a blog post (blog author only)

## Troubleshooting

### Backend Issues
- If you encounter any module import errors, ensure you've activated the virtual environment and installed all dependencies correctly
- For database errors, try deleting the db.sqlite3 file and running migrations again
- Check the Django server logs for detailed error messages

### Frontend Issues
- For "module not found" errors, make sure all dependencies are properly installed
- Clear browser cache if you're seeing outdated content
- Check the browser console for JavaScript errors

## Deployment

### Backend Deployment
The backend can be deployed to any cloud platform that supports Django applications, such as AWS, Google Cloud, or Heroku.

### Frontend Deployment
The frontend can be deployed to services like Netlify, Vercel, or GitHub Pages.

## License
This project is licensed under the MIT License.
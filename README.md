 Smart Learning Path Generator 🎓

An AI-powered educational platform that creates personalized learning paths for students based on their knowledge level, learning style, and goals. The system uses AI to generate custom content, quizzes, and track progress with intelligent tutoring capabilities.

![Smart Learning Path Generator](https://img.shields.io/badge/Status-Production%20Ready-green)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-18.2-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)

## 🌟 Features

### Core Functionality
- **AI-Powered Learning Path Generation**: Generate personalized learning paths based on goals, skill level, and learning style
- **Progress Tracking**: Track completion status and time spent on each module
- **Interactive Modules**: Expandable modules with topics, objectives, and resources
- **Beautiful UI**: Distinctive, modern design with smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Authentication & Security
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected API routes
- Session management

### AI Integration
- OpenAI GPT-4 for content generation
- Personalized learning paths
- Quiz generation (optional feature)
- Tutoring assistance (optional feature)

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18.2
- React Router for navigation
- Vite for fast development
- Custom CSS with animations

**Backend:**
- Node.js with Express
- PostgreSQL for data persistence
- OpenAI API for AI features
- JWT for authentication

**Database Schema:**
- Users table
- Learning paths table
- Learning profiles table
- User progress tracking
- Quizzes and attempts (optional)

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- PostgreSQL (v15 or higher)
- OpenAI API key (for AI features)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd smart-learning-path-generator
```

### 2. Database Setup

```bash
# Install PostgreSQL (if not already installed)
# macOS with Homebrew:
brew install postgresql@15
brew services start postgresql@15

# Linux (Ubuntu/Debian):
sudo apt-get install postgresql postgresql-contrib

# Windows: Download from https://www.postgresql.org/download/

# Create database
psql postgres
CREATE DATABASE learning_path_db;
\q

# Run schema
psql learning_path_db < backend/schema.sql
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - DATABASE_URL: Your PostgreSQL connection string
# - JWT_SECRET: A secure random string
# - OPENAI_API_KEY: Your OpenAI API key
# - PORT: 5000 (or your preferred port)
```

Example `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/learning_path_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
OPENAI_API_KEY=sk-your-openai-api-key-here
NODE_ENV=development
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 5. Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Application runs on http://localhost:3000
```

## 📱 Usage Guide

### 1. Create an Account
- Navigate to http://localhost:3000
- Click "Create Account"
- Enter your name, email, and password
- Click "Create Account"

### 2. Generate a Learning Path
- Click "Generate New Path" from the dashboard
- Enter your learning goal (e.g., "Learn Python for data analysis")
- Select your skill level (Beginner, Intermediate, or Advanced)
- Choose your learning style
- Click "Generate Learning Path"

### 3. Track Your Progress
- View your generated learning path
- Click on modules to expand and see details
- Mark modules as complete when finished
- Track your overall progress percentage

## 🎨 Design Philosophy

This application follows a **bold, distinctive aesthetic** approach:

- **Typography**: Uses DM Serif Display for headings (elegant serif) paired with Work Sans for body text
- **Color Palette**: Vibrant, warm colors with orange-coral primary (#FF6B35) and teal accents (#4ECDC4)
- **Animations**: Smooth, purposeful animations using cubic-bezier easing
- **Spacing**: Generous whitespace with intentional density in content areas
- **Interactions**: Hover effects, micro-interactions, and visual feedback

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
GET /api/auth/me - Get current user (requires auth)
```

### Learning Paths
```
POST /api/learning-paths/generate - Generate new learning path
GET /api/learning-paths - Get all user's learning paths
GET /api/learning-paths/:id - Get specific learning path
POST /api/learning-paths/:id/progress - Update module progress
DELETE /api/learning-paths/:id - Delete learning path
```

### Quizzes (Optional)
```
POST /api/quizzes/generate - Generate quiz for module
GET /api/quizzes/:id - Get quiz
POST /api/quizzes/:id/attempt - Submit quiz attempt
GET /api/quizzes/:id/attempts - Get user's attempts
```

### Tutoring (Optional)
```
POST /api/tutoring/ask - Get AI tutoring help
```

## 📊 Database Schema

### Users Table
```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR, UNIQUE)
- password (VARCHAR, hashed)
- name (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Learning Paths Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER, foreign key)
- title (VARCHAR)
- description (TEXT)
- difficulty (VARCHAR)
- estimated_duration (INTEGER)
- content (JSONB) - stores modules and structure
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### User Progress Table
```sql
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER, foreign key)
- learning_path_id (INTEGER, foreign key)
- module_id (VARCHAR)
- completed (BOOLEAN)
- score (INTEGER)
- time_spent (INTEGER)
- completed_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

## 🔐 Security Considerations

- Passwords are hashed using bcrypt (10 rounds)
- JWT tokens expire after 7 days
- Protected routes require valid authentication
- CORS configured for development (adjust for production)
- SQL injection prevention through parameterized queries
- Environment variables for sensitive data

## 🚢 Deployment

### Backend Deployment (Heroku Example)

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_secret_here
heroku config:set OPENAI_API_KEY=your_key_here

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
# Update API URL to point to your backend
```

## 🧪 Testing

### Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Access protected routes without token

**Learning Path Generation:**
- [ ] Generate path with different skill levels
- [ ] Generate path with different learning styles
- [ ] View generated learning path
- [ ] Expand/collapse modules

**Progress Tracking:**
- [ ] Mark module as complete
- [ ] View progress percentage
- [ ] Check progress persistence after logout

## 📈 Future Enhancements

- [ ] Quiz generation and assessment
- [ ] Real-time tutoring with WebSockets
- [ ] Collaborative learning features
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Integration with external learning platforms
- [ ] Gamification features (badges, streaks)
- [ ] Social learning community
- [ ] Export learning paths to PDF
- [ ] Voice-based navigation

## 🤝 Contributing

This is an assignment project for Nebula9.ai Full Stack Developer Internship.

## 📄 License

This project is created as part of an internship assignment.

## 👤 Author

**Assignment #9: Smart Learning Path Generator**  
Created for: Nebula9.ai Full Stack Developer Internship  
Submission Date: February 13, 2026

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Nebula9.ai for the opportunity
- React and Node.js communities

---

**Note**: This is a demonstration project showcasing full-stack development skills including:
- Modern React development
- RESTful API design
- Database modeling
- AI integration
- Authentication & authorization
- Responsive UI design
- Clean code practices

For questions or issues, please create an issue in the repository.


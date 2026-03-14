# BookVerse

<p align="center">
  <img src="/public/BookVerse.png" alt="BookVerse Logo" width="200" />
</p>

<p align="center">
  <strong>Your Book Review Community</strong>
</p>

<p align="center">
  Discover, review, and share books with the BookVerse community. Write reviews, create posts, and connect with fellow book lovers.
</p>

<p align="center">
  <a href="https://book-verse-blond.vercel.app">🌐 Live Demo</a>
  •
  <a href="https://github.com/bh-official/BookVerse">🐙 GitHub</a>
  </p>

---

## 📋 Table of Contents

- [Application Overview](#application-overview)
- [Core Features](#core-features)
- [Application Architecture](#application-architecture)
- [The Tech Stack](#the-tech-stack)
- [Database Schema](#database-schema)
- [Schema Visualizer](#schema-visualizer)
- [Security](#security)
- [API Endpoints](#api-endpoints)
- [Page Usability & Flow](#page-usability--flow)
- [Major Changes & Polish](#major-changes--polish)
- [Setup & Execution](#setup--execution)
- [Reflection](#reflection)
- [Requirements Achieved](#requirements-achieved)
- [Challenges](#challenges)
- [What Went Well](#what-went-well)
- [What I Learned](#what-i-learned)
- [Areas for Improvement](#areas-for-improvement)
- [Future Enhancements](#future-enhancements)
- [Summary](#summary)

---

## Application Overview

**BookVerse** is a full-stack web application built with Next.js that serves as a book review community platform. Users can browse books, write reviews, create posts, follow other users, and like posts. The application features a modern dark-themed UI with purple and pink accent colors, providing an immersive reading community experience.

---

## Core Features

### 🔐 Authentication

- **Clerk Integration**: Secure user authentication with sign-in/sign-up modals
- **User Profiles**: Custom profiles with usernames and bios
- **Session Management**: Automatic session handling with redirect support

### 📚 Book Management

- **Browse Books**: View all books in the library with cover images
- **Add Books**: Create new book entries with title, author, description, quotes, release date, and category
- **Edit Books**: Modify book information
- **Categories**: Browse books by genre/category (Fiction, Non-Fiction, Horror, Fantasy, Comedy, etc.)

### ✍️ Reviews & Posts

- **Write Reviews**: Create detailed reviews for any book
- **Edit Reviews**: Modify your reviews
- **Community Posts**: Share thoughts, recommendations, and discussions
- **Edit Posts**: Update your posts
- **Delete Posts**: Remove your posts

### 👥 Social Features

- **Follow System**: Follow/unfollow other users
- **Like Posts**: Like posts from other users
- **User Profiles**: View your profile and other users' profiles
- **Activity Feed**: See posts from users you follow

---

## Application Architecture

```
bookverse/
├── public/                    # Static assets
│   └── BookVerse.png         # Logo
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/              # API routes
│   │   │   └── posts/[id]/like/  # Like API
│   │   ├── books/            # Book pages
│   │   │   ├── [id]/         # Individual book
│   │   │   ├── new/          # Add book
│   │   │   └── page.js      # Books listing
│   │   ├── categories/       # Category pages
│   │   ├── posts/            # Posts page
│   │   ├── users/            # User pages
│   │   │   ├── [id]/        # Other user profiles
│   │   │   ├── you/         # Current user profile
│   │   │   └── onboarding/   # Onboarding flow
│   │   ├── sign-in/         # Clerk sign-in
│   │   ├── sign-up/         # Clerk sign-up
│   │   ├── layout.js        # Root layout
│   │   └── page.js          # Landing page
│   ├── components/           # React components
│   │   ├── Header.jsx       # Navigation header
│   │   ├── Footer.jsx       # Footer
│   │   ├── Logo.jsx         # Logo component
│   │   ├── EditButton.jsx   # Edit action button
│   │   ├── DeleteButton.jsx # Delete action button
│   │   ├── LikeButton.jsx   # Like button
│   │   └── ...
│   └── utils/                # Utility functions
│       ├── db.js            # Database connection
│       ├── getUser.js       # User helpers
│       ├── categories.js    # Category utilities
│       └── seed.js          # Database seeding
```

---

## The Tech Stack

| Category           | Technology                     |
| ------------------ | ------------------------------ |
| **Framework**      | Next.js 16.1.6 (App Router)    |
| **Language**       | JavaScript/React 19            |
| **Styling**        | Tailwind CSS 4                 |
| **Authentication** | Clerk                          |
| **Database**       | PostgreSQL (Neon)              |
| **ORM/Query**      | PostgreSQL node module (pg)    |
| **UI Components**  | Radix UI (AlertDialog, Dialog) |
| **Animations**     | Framer Motion                  |
| **Fonts**          | Google Fonts (Unna, Inter)     |
| **Deployment**     | Vercel                         |

---

## Database Schema

### Tables

1. **user_account** - User profiles
   - `id` (SERIAL PRIMARY KEY)
   - `username` (VARCHAR)
   - `bio` (TEXT)
   - `clerk_id` (TEXT) - Links to Clerk authentication

2. **books** - Book catalog
   - `id` (SERIAL PRIMARY KEY)
   - `user_id` (INT, FK)
   - `title` (VARCHAR)
   - `author` (VARCHAR)
   - `description` (TEXT)
   - `quote` (VARCHAR)
   - `released` (DATE)
   - `img_url` (TEXT)
   - `category` (VARCHAR)

3. **posts** - Community posts
   - `id` (SERIAL PRIMARY KEY)
   - `user_id` (INT, FK)
   - `content` (TEXT)
   - `created_at` (TIMESTAMPTZ)

4. **review** - Book reviews
   - `id` (SERIAL PRIMARY KEY)
   - `user_id` (INT, FK)
   - `book_id` (INT, FK)
   - `content` (TEXT)

5. **followers** - Follow system
   - `id` (SERIAL PRIMARY KEY)
   - `follower_id` (INT)
   - `following_id` (INT)
   - `created_at` (TIMESTAMPTZ)
   - UNIQUE constraint on (follower_id, following_id)

6. **post_likes** - Post likes
   - `id` (SERIAL PRIMARY KEY)
   - `user_id` (INT)
   - `post_id` (INT)
   - `created_at` (TIMESTAMPTZ)
   - UNIQUE constraint on (user_id, post_id)

7. **genres** - Book genres
8. **book_genres** - Book-genre associations

---

## Schema Visualizer

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  user_account  │     │     books       │     │     posts       │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)        │     │ id (PK)         │     │ id (PK)         │
│ username       │◄──┐  │ user_id (FK)   │     │ user_id (FK)   │
│ bio            │  │  │ title          │     │ content         │
│ clerk_id       │  │  │ author         │     │ created_at      │
└─────────────────┘  │  │ description    │     └────────┬────────┘
                     │  │ quote          │              │
                     │  │ released       │              │
                     │  │ img_url        │              │
                     │  │ category       │              │
                     │  └────────┬──────┘              │
                     │           │                     │
                     │           ▼                     │
                     │  ┌─────────────────┐            │
                     │  │     review      │            │
                     │  ├─────────────────┤            │
                     │  │ id (PK)         │            │
                     │  │ user_id (FK)    │            │
                     │  │ book_id (FK)    │            │
                     │  │ content         │            │
                     │  └─────────────────┘            │
                     │                                 │
                     │     ┌─────────────────┐         │
                     │     │    followers    │         │
                     │     ├─────────────────┤         │
                     └────►│ id (PK)         │◄────────┘
                           │ follower_id (FK) │
                           │ following_id(FK)│
                           │ created_at      │
                           └─────────────────┘

                           ┌─────────────────┐
                           │   post_likes    │
                           ├─────────────────┤
                           │ id (PK)         │
                           │ user_id (FK)    │
                           │ post_id (FK)    │
                           │ created_at      │
                           └─────────────────┘
```

---

## Security

- **Authentication**: Clerk handles all authentication securely
- **Database Connections**: Parameterized queries prevent SQL injection
- **Environment Variables**: Sensitive data stored in `.env`
- **Error Handling**: Global error boundaries protect application stability
- **Route Protection**: Server components validate user sessions
- **Input Validation**: Form inputs validated on both client and server

---

## API Endpoints

### Like Posts

- **POST** `/api/posts/[id]/like`
  - Toggles like on a post
  - Requires authentication
  - Returns updated like count

---

## Page Usability & Flow

### Landing Page (`/`)

- Hero section with animated text
- Feature highlights
- Call-to-action buttons
- Animated book showcase

### Books (`/books`)

- Grid display of all books
- Book cover images
- Author and title
- Category tags
- Add book button (authenticated)

### Book Detail (`/books/[id]`)

- Full book information
- Reviews section
- Add review functionality
- Edit/Delete book (owner only)

### Categories (`/categories`)

- Browse by category
- Book count per category
- Category emojis

### Posts (`/posts`)

- Community posts feed
- Like functionality
- User attribution

### User Profile (`/users/you`)

- Your posts
- Edit profile
- Follower/following counts
- Add post functionality

### Other Profiles (`/users/[id]`)

- View other users
- Follow/unfollow
- Their posts

### Authentication

- Sign In modal
- Sign Up modal
- Profile setup (onboarding)

---

## Major Changes & Polish

### Recent Updates

1. **Font Improvements**
   - Added Inter font for body text
   - Added Unna serif font for headings
   - Better typography hierarchy

2. **Styling Consistency**
   - Unified dark theme across all pages
   - Purple/pink accent colors
   - Custom scrollbars

3. **Menu Styling**
   - Styled Clerk sign-in/sign-up modals
   - User dropdown menu styling
   - Consistent button styles

4. **Error Handling**
   - Global error boundary
   - Custom 404 pages
   - Invalid route handling
   - Profile not found pages

5. **Component Refinement**
   - Reusable EditButton component
   - Reusable DeleteButton component
   - Consistent action buttons across app

---

## Setup & Execution

### Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (Neon)
- Clerk account

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/bookverse.git
cd bookverse

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
# DATABASE_URL=your_postgres_connection_string
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
# CLERK_SECRET_KEY=your_clerk_secret

# Run the development server
npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
npm run build
npm start
```

---

## Reflection

### Requirements Achieved

✅ User authentication with Clerk  
✅ Book catalog with CRUD operations  
✅ Book reviews system  
✅ Community posts  
✅ Follow/unfollow system  
✅ Like posts functionality  
✅ User profiles with bios  
✅ Category browsing  
✅ Error handling pages  
✅ Responsive design  
✅ Dark theme UI

### Challenges

- Integrating Clerk authentication with custom database
- Handling dynamic routes with Next.js App Router
- Managing complex state for likes and follows
- Database schema design for social features
- Styling consistency across components

### What Went Well

- Clean component architecture
- Reusable UI components
- Consistent dark theme
- Smooth animations with Framer Motion
- Good separation of concerns

### What I Learned

- Next.js 16 App Router patterns
- Clerk authentication integration
- PostgreSQL with Node.js
- Radix UI for accessible components
- Framer Motion animations
- Tailwind CSS customization

### Areas for Improvement

- Add more test coverage
- Implement caching strategies
- Add loading skeletons
- Improve mobile responsiveness
- Add search functionality
- Add notifications system

### Future Enhancements

- Book recommendations algorithm
- Reading lists/shelves
- Comments on posts
- Direct messaging
- Book ratings (1-5 stars)
- User activity feed
- Social sharing
- Reading progress tracking

---

## Summary

BookVerse is a comprehensive book review community platform that demonstrates full-stack web development with modern technologies. It provides a clean, dark-themed interface for book lovers to discover literature, share reviews, and connect with fellow readers. The application showcases proper authentication integration, database design, and responsive UI development.

---

<p align="center">
  Made with ❤️ for book lovers everywhere
</p>

<p align="center">
  © 2026 BookVerse. All rights reserved.
</p>

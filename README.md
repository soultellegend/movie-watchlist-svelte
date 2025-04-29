# SvelteFlix - Movie Watchlist Application

## Project Overview
SvelteFlix is a web application developed as a Web Programming II course project, designed to help users discover, track, and organize their movie-watching experience. The application allows users to search for movies, add them to personalized watchlists, categorize them by watch status, and view detailed information about each movie.

## Purpose
The main purpose of this application is to provide movie enthusiasts with a comprehensive tool to:
- Discover new movies through search and popular movie recommendations
- Track movies they plan to watch
- Organize watched movies by status (planning, watching, completed, on hold, dropped)
- Keep track of their viewing statistics (total movies watched, watch time)
- Access detailed information about each movie

## Implementation

### Technology Stack
- **Frontend**: SvelteKit 5.0, TailwindCSS 4.0
- **Backend**: SvelteKit server routes, SQLite database
- **Authentication**: Lucia authentication system with Argon2 password hashing
- **API Integration**: The Movie Database (TMDB) API
- **Database ORM**: Drizzle ORM
- **Styling**: Tailwind CSS for responsive design and some css ugly coded for page specific

### Key Features
1. **User Authentication**: Secure login and registration system
2. **Movie Discovery**: Search functionality and popular movies display
3. **Watchlist Management**: Add, remove, and categorize movies
4. **Watch Status Tracking**: Planning, watching, completed, on hold, dropped
5. **Profile Statistics**: Track watch count and total watch time
6. **Responsive Design**: Mobile-friendly interface

## APIs and External Services

### TMDB API Integration
The application integrates with The Movie Database (TMDB) API to fetch movie data. Key endpoints used:

1. **Popular Movies**: `/movie/popular` - Fetches trending and popular movies
2. **Movie Search**: `/search/movie` - Searches for movies by title
3. **Movie Details**: `/movie/{id}` - Fetches detailed information about a specific movie

The TMDB API client is implemented in `src/lib/server/tmdb.ts` and handles all API requests, including:
- Fetching movie metadata (title, poster, description)
- Retrieving movie runtime information for watch time calculation
- Searching movies by title
- Getting detailed movie information

### Internal API Endpoints
The application provides its own API endpoints to facilitate communication between the frontend and backend:

#### Movie APIs
- `GET /api/movies/popular` - Retrieves popular movies with pagination support
  - Query params: `page` (optional, defaults to 1)
  - Returns: List of popular movies with pagination metadata

- `GET /api/movies/search` - Searches for movies by title
  - Query params: `query` (required), `page` (optional, defaults to 1)
  - Returns: List of movies matching the search query

- `GET /api/movies/[id]` - Retrieves detailed information about a specific movie
  - Path params: `id` (movie ID)
  - Returns: Detailed movie information

#### Watchlist APIs
- `GET /api/watchlist` - Retrieves the current user's watchlist
  - Requires authentication
  - Returns: List of movies in the user's watchlist

- `POST /api/watchlist` - Adds a movie to the user's watchlist
  - Requires authentication
  - Body: Movie information
  - Returns: Success/error status

- `DELETE /api/watchlist/[id]` - Removes a movie from the user's watchlist
  - Requires authentication
  - Path params: `id` (movie ID)
  - Returns: Success/error status

- `GET /api/watchlist/check/[id]` - Checks if a movie is in the user's watchlist
  - Requires authentication
  - Path params: `id` (movie ID)
  - Returns: Boolean indicating presence in watchlist

- `PUT /api/watchlist/status/[status]` - Updates a movie's watch status
  - Requires authentication
  - Path params: `status` (watch status)
  - Body: Movie ID and additional update data
  - Returns: Success/error status

## Database and Stored Data

### Database Schema
The application uses SQLite with Drizzle ORM for data persistence. The database schema includes:

1. **User Table**
   - `id`: Primary key (text)
   - `username`: User's username (unique, text)
   - `passwordHash`: Hashed password (text)

2. **Session Table**
   - `id`: Primary key (text)
   - `userId`: Foreign key to user (text)
   - `expiresAt`: Session expiration timestamp (integer)

3. **Watchlist Table**
   - `id`: Primary key (auto-incrementing integer)
   - `movieId`: TMDB movie ID (integer)
   - `title`: Movie title (text)
   - `posterPath`: Path to movie poster (text, nullable)
   - `voteAverage`: Movie rating (integer, nullable)
   - `backdropPath`: Path to backdrop image (text, nullable)
   - `releaseDate`: Movie release date (text, nullable)
   - `overview`: Movie description (text, nullable)
   - `runtime`: Movie runtime in minutes (integer, nullable)
   - `addedAt`: When the movie was added to watchlist (text, defaults to current timestamp)
   - `status`: Watch status (text, defaults to 'planning')
   - `startedAt`: When the user started watching (text, nullable)
   - `completedAt`: When the user finished watching (text, nullable)
   - `userId`: Foreign key to user (text)

## Component Communication

### Data Flow Architecture
The application follows SvelteKit's recommended data flow patterns:

1. **Server-to-Client Communication**:
   - Server-side data loading through `+page.server.ts` files that fetch data and pass it to Svelte components
   - API endpoints for dynamic data operations

2. **Client-State Management**:
   - Local component state using Svelte's `$state` for UI interactions
   - Form actions for data modifications

3. **Component Communication**:
   - Parent-to-child props passing
   - Event dispatching for child-to-parent communication
   - Form actions for server interactions

### Authentication Flow
1. User registers/logs in via the login form
2. Server validates credentials and creates a session
3. Session token is stored in an HTTP-only cookie
4. Server hooks validate the session on each request
5. User information is made available via the `locals` object

### Watchlist Management Flow
1. User searches for a movie or browses popular movies
2. User adds a movie to their watchlist
3. Server stores the movie details including runtime
4. User can update the watch status of movies
5. Watch status changes update completion time and statistics

## Setup and Development

### Prerequisites
- Node.js 16+
- npm or yarn

### Environment Variables
Copy `.env.example` to `.env` and add your required credentials:

```
# Database Configuration
DATABASE_URL=local.db

# TMDB API Configuration
TMDB_API_KEY=your_api_key
TMDB_API_URL=https://api.themoviedb.org/3
TMDB_API_READ_ACCESS_TOKEN=your_access_token
```

### Installation
```bash
# Install dependencies
npm install

# Setup the database
npm run db:push

# Start development server
npm run dev
```

### Database Management
- `npm run db:push`: Apply schema changes to the database
- `npm run db:migrate`: Generate migration files
- `npm run db:studio`: Open Drizzle Studio to view/edit data

## Deployment
The application can be deployed to any platform that supports Node.js applications. For production deployment:

```bash
npm run build
```

*This project was created as an assignment for Web Programming II course.*

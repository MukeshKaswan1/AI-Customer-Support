# AI Customer Support Chat

A full-stack application that provides an AI-powered customer support chat interface with authentication, chat history, and MongoDB integration.

## Features

- User authentication with JWT
- AI-powered chat responses using OpenRouter.ai
- Persistent chat history with MongoDB
- Responsive UI for all devices
- Dockerized application for easy deployment

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT with bcrypt for password hashing
- **AI**: OpenRouter.ai API integration
- **Containerization**: Docker and Docker Compose

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- MongoDB (if running without Docker)
- OpenRouter.ai API key

### Environment Variables

1. Create a `.env` file in the server directory (copy from `.env.example`):

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/supportchat
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
NODE_ENV=development
```

2. Create a `.env` file in the client directory (copy from `.env.example`):

```
VITE_API_URL=http://localhost:5000
```

### Running with Docker

The easiest way to run the application is with Docker Compose:

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Running without Docker

#### Backend

```bash
cd server
npm install
npm start
```

#### Frontend

```bash
cd client
npm install
npm run dev
```

## API Endpoints

### Authentication

- `POST /auth/signup`: Register a new user
- `POST /auth/login`: Log in a user
- `GET /auth/me`: Get current user information

### Chat

- `POST /chat/send`: Send a message and get AI response
- `GET /chat/history`: Get chat history for current user
- `GET /chat/conversations`: Get all conversations for current user
- `GET /chat/conversations/:id`: Get messages for a specific conversation

## Project Structure

```
.
├── client                  # Frontend React application
│   ├── public              # Static files
│   ├── src                 # Source files
│   │   ├── components      # React components
│   │   ├── context         # React context (auth, etc.)
│   │   ├── pages           # Page components
│   │   ├── services        # API services
│   │   └── types           # TypeScript type definitions
│   ├── .env.example        # Example environment variables
│   └── Dockerfile          # Frontend Docker configuration
├── server                  # Backend Node.js application
│   ├── src                 # Source files
│   │   ├── middleware      # Express middleware
│   │   ├── models          # Mongoose models
│   │   ├── routes          # Express routes
│   │   ├── services        # Service layer (AI, etc.)
│   │   └── index.js        # Entry point
│   ├── .env.example        # Example environment variables
│   └── Dockerfile          # Backend Docker configuration
├── docker-compose.yml      # Docker Compose configuration
└── README.md               # Project documentation
```

## Security Considerations

- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- Rate limiting is implemented to prevent abuse
- Helmet is used for setting HTTP security headers

## Future Enhancements

- Typing indicators
- Message read receipts
- File uploads
- Configurable AI models
- User profile management
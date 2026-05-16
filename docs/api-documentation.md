# API Documentation — Scholar's Study

## Auth Service (`:5001`)

### POST `/api/auth/register`
Register a new user.
- **Body**: `{ "username": "...", "email": "...", "password": "..." }`
- **Response**: `201 Created`

### POST `/api/auth/login`
Authenticate a user and receive a JWT.
- **Body**: `{ "email": "...", "password": "..." }`
- **Response**: `{ "body": "JWT_TOKEN" }`

### GET `/api/auth/profile`
Get the authenticated user's profile.
- **Headers**: `Authorization: <token>`
- **Response**: `{ "username": "...", "email": "..." }`

---

## Interview Service (`:5002`)

### POST `/api/interview/generate`
Generate AI interview questions based on a topic.
- **Headers**: `Authorization: <token>`
- **Body**: `{ "topic": "...", "difficulty": "Beginner/Intermediate/Advanced" }`
- **Response**: Structured JSON of questions.

### POST `/api/interview/chat`
Append a question/answer pair to the interview transcript.
- **Headers**: `Authorization: <token>`
- **Body**: `{ "topic": "...", "interviewData": { "text": "...", "type": "question/response" } }`

### POST `/api/interview/evaluate`
Trigger AI evaluation of the completed session.
- **Headers**: `Authorization: <token>`
- **Body**: `{ "topic": "..." }`
- **Response**: Mentor-style feedback JSON.

### GET `/api/interview/results`
Fetch all previous interview results for the user.
- **Headers**: `Authorization: <token>`
- **Response**: Array of interview objects.

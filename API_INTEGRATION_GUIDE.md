# API Integration Guide

This document provides detailed instructions for backend developers to integrate with the Government Company Registration Chatbot frontend.

## Table of Contents

1. [Overview](#overview)
2. [Base URL Configuration](#base-url-configuration)
3. [Authentication Flow](#authentication-flow)
4. [API Endpoints](#api-endpoints)
5. [Request/Response Formats](#requestresponse-formats)
6. [Error Handling](#error-handling)
7. [Database Integration](#database-integration)
8. [Testing](#testing)

## Overview

The frontend is fully built and ready for API integration. All API calls are centralized in the `src/services/` directory using Axios with automatic token management and error handling.

## Base URL Configuration

Set the API base URL in your `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

For production:
```env
VITE_API_URL=https://your-api-domain.com/api
```

## Authentication Flow

### Token Management

- Tokens are automatically encrypted and stored in localStorage
- Every request includes `Authorization: Bearer <token>` header
- Expired tokens trigger automatic logout and redirect to login

### Authentication Endpoints

#### 1. Register

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "userId": "uuid",
    "email": "john@example.com",
    "requiresOtp": true
  }
}
```

**Backend Actions:**
1. Validate input data
2. Hash password
3. Create user in database
4. Generate alphanumeric OTP (6 characters, A-Z, 0-9)
5. Send OTP via email
6. Store OTP with expiry (e.g., 10 minutes)

---

#### 2. Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response (if email not verified):**
```json
{
  "success": true,
  "message": "Please verify your email with OTP",
  "data": {
    "requiresOtp": true
  }
}
```

**Response (if email verified):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "requiresOtp": false
  }
}
```

**Backend Actions:**
1. Validate credentials
2. Check if email is verified
3. If not verified, resend OTP and return requiresOtp: true
4. If verified, generate JWT token
5. Return user data and token

---

#### 3. Verify OTP

**Endpoint:** `POST /auth/verify-otp`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "AB12CD"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Backend Actions:**
1. Validate OTP
2. Check if OTP is expired
3. Mark email as verified
4. Delete used OTP
5. Generate JWT token
6. Create profile in Supabase if not exists

---

#### 4. Resend OTP

**Endpoint:** `POST /auth/resend-otp`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP has been resent to your email"
}
```

**Backend Actions:**
1. Generate new OTP
2. Invalidate previous OTP
3. Send email with new OTP

---

#### 5. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset OTP sent to your email"
}
```

**Backend Actions:**
1. Check if user exists
2. Generate password reset OTP
3. Send email with OTP
4. Store OTP with expiry

---

#### 6. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "AB12CD",
  "newPassword": "NewSecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Backend Actions:**
1. Validate OTP
2. Check if OTP is expired
3. Hash new password
4. Update user password
5. Delete used OTP
6. Invalidate all existing tokens

---

#### 7. Get Current User

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "createdAt": "2024-01-01T00:00:00Z",
      "avatar": "optional_url"
    }
  }
}
```

**Backend Actions:**
1. Verify JWT token
2. Get user data from database
3. Return user information

---

#### 8. Logout

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Backend Actions:**
1. Invalidate token (add to blacklist or remove from active sessions)
2. Clean up any session data

---

## Chat Endpoints

### 1. Create Chat Session

**Endpoint:** `POST /chat/sessions`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "workflowType": "company_registration",
  "title": "Company Registration"
}
```

**Workflow Types:**
- `company_registration` - For name registration
- `company_incorporation` - For full incorporation
- `general` - For general inquiries

**Response:**
```json
{
  "success": true,
  "data": {
    "session": {
      "id": "uuid",
      "userId": "uuid",
      "workflowType": "company_registration",
      "title": "Company Registration",
      "isActive": true,
      "metadata": {},
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Backend Actions:**
1. Verify user authentication
2. Create session in Supabase `chat_sessions` table
3. Initialize metadata if needed
4. Return session data

---

### 2. Get User Sessions

**Endpoint:** `GET /chat/sessions`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "uuid",
        "userId": "uuid",
        "workflowType": "company_registration",
        "title": "Company Registration",
        "isActive": true,
        "metadata": {},
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

**Backend Actions:**
1. Verify user authentication
2. Fetch all sessions for the user from Supabase
3. Order by `updatedAt` DESC
4. Return sessions array

---

### 3. Get Session Messages

**Endpoint:** `GET /chat/sessions/:sessionId/messages`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of messages (default: 50)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "sessionId": "uuid",
        "role": "user",
        "content": "I want to register a company",
        "timestamp": "2024-01-01T00:00:00Z",
        "metadata": {}
      },
      {
        "id": "uuid",
        "sessionId": "uuid",
        "role": "assistant",
        "content": "I'll help you register your company. Please upload the required documents...",
        "timestamp": "2024-01-01T00:00:01Z",
        "metadata": {}
      }
    ],
    "hasMore": false
  }
}
```

**Message Roles:**
- `user` - Messages from the user
- `assistant` - LLM responses
- `system` - System notifications

**Backend Actions:**
1. Verify user owns the session
2. Fetch messages from Supabase `messages` table
3. Order by `created_at` ASC
4. Apply pagination
5. Return messages with hasMore flag

---

### 4. Send Message

**Endpoint:** `POST /chat/messages`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "sessionId": "uuid",
  "content": "I want to register Tech Solutions Ltd",
  "metadata": {
    "companyNames": ["Tech Solutions Ltd", "TechSol Inc", "Solutions Tech Corp"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "uuid",
      "sessionId": "uuid",
      "role": "assistant",
      "content": "I'll check the availability of these names:\n1. Tech Solutions Ltd - Available\n2. TechSol Inc - Not Available\n3. Solutions Tech Corp - Available",
      "timestamp": "2024-01-01T00:00:00Z",
      "metadata": {
        "availableNames": ["Tech Solutions Ltd", "Solutions Tech Corp"],
        "unavailableNames": ["TechSol Inc"]
      }
    },
    "session": {
      "id": "uuid",
      "userId": "uuid",
      "workflowType": "company_registration",
      "title": "Company Registration",
      "isActive": true,
      "metadata": {
        "currentStep": "name_check",
        "companyNames": ["Tech Solutions Ltd", "TechSol Inc", "Solutions Tech Corp"]
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:02Z"
    }
  }
}
```

**Backend Actions:**
1. Verify user owns the session
2. Save user message to Supabase `messages` table
3. Process message with LLM:
   - For company_registration workflow:
     - Check company name availability
     - Validate documents
     - Guide through registration steps
   - For company_incorporation workflow:
     - Guide through incorporation process
     - Validate requirements
   - For general workflow:
     - Provide information and assistance
4. Save LLM response to `messages` table
5. Update session metadata and `updated_at`
6. Return LLM message and updated session

**LLM Integration:**
- Use OpenAI, Anthropic Claude, or other LLM API
- Maintain conversation context using session history
- Include workflow-specific instructions in system prompt
- Handle document validation logic
- Implement company name availability checking

---

### 5. Upload Document

**Endpoint:** `POST /chat/documents`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
file: <file>
sessionId: "uuid"
documentType: "registration_form" (optional)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "uuid",
      "sessionId": "uuid",
      "userId": "uuid",
      "name": "registration_form.pdf",
      "size": 1024000,
      "type": "application/pdf",
      "url": "https://storage.url/documents/uuid.pdf",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

**Document Status:**
- `pending` - Awaiting verification
- `verified` - Document accepted
- `rejected` - Document rejected

**Backend Actions:**
1. Verify user owns the session
2. Validate file (size, type, format)
3. Upload to Supabase Storage
4. Create document record in `documents` table
5. Process document validation (OCR, format check, etc.)
6. Return document information

**Document Verification:**
- Implement document validation logic
- Use OCR for text extraction if needed
- Validate document completeness
- Update document status based on verification
- If rejected, send email notification with reason

---

### 6. Delete Session

**Endpoint:** `DELETE /chat/sessions/:sessionId`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Session deleted successfully"
}
```

**Backend Actions:**
1. Verify user owns the session
2. Delete session from Supabase (CASCADE deletes messages and documents)
3. Clean up associated files from storage

---

### 7. Update Session Title

**Endpoint:** `PATCH /chat/sessions/:sessionId`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "New Company Registration"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session updated successfully"
}
```

**Backend Actions:**
1. Verify user owns the session
2. Update session title in Supabase
3. Update `updated_at` timestamp

---

## Error Handling

All error responses should follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "status": "error_code"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Unprocessable Entity (invalid data)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

### Error Examples

**Validation Error:**
```json
{
  "success": false,
  "message": "Validation failed",
  "status": "validation_error",
  "errors": {
    "email": "Invalid email format",
    "password": "Password must be at least 8 characters"
  }
}
```

**Authentication Error:**
```json
{
  "success": false,
  "message": "Invalid token",
  "status": "unauthorized"
}
```

**Resource Not Found:**
```json
{
  "success": false,
  "message": "Session not found",
  "status": "not_found"
}
```

---

## Database Integration

The frontend uses Supabase with the following schema:

### Tables

1. **profiles**
   - `id` (uuid, PK, references auth.users)
   - `username` (text)
   - `avatar` (text, optional)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

2. **chat_sessions**
   - `id` (uuid, PK)
   - `user_id` (uuid, FK to profiles)
   - `workflow_type` (text)
   - `title` (text)
   - `is_active` (boolean)
   - `metadata` (jsonb)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

3. **messages**
   - `id` (uuid, PK)
   - `session_id` (uuid, FK to chat_sessions)
   - `role` (text: user, assistant, system)
   - `content` (text)
   - `metadata` (jsonb)
   - `created_at` (timestamptz)

4. **documents**
   - `id` (uuid, PK)
   - `session_id` (uuid, FK to chat_sessions)
   - `user_id` (uuid, FK to profiles)
   - `name` (text)
   - `size` (bigint)
   - `type` (text)
   - `url` (text)
   - `status` (text: pending, verified, rejected)
   - `created_at` (timestamptz)
   - `updated_at` (timestamptz)

### Row Level Security (RLS)

All tables have RLS enabled. Users can only:
- Read their own data
- Create their own data
- Update their own data
- Delete their own data

Backend should use service role key for admin operations.

---

## Testing

### Testing Endpoints

1. **Authentication Flow:**
   ```bash
   # Register
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"testuser","email":"test@example.com","password":"Test123456"}'

   # Verify OTP
   curl -X POST http://localhost:3000/api/auth/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","otp":"ABC123"}'

   # Login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"Test123456"}'
   ```

2. **Chat Flow:**
   ```bash
   # Create Session
   curl -X POST http://localhost:3000/api/chat/sessions \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"workflowType":"company_registration","title":"Test Session"}'

   # Send Message
   curl -X POST http://localhost:3000/api/chat/messages \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"sessionId":"<session-id>","content":"I want to register a company"}'

   # Upload Document
   curl -X POST http://localhost:3000/api/chat/documents \
     -H "Authorization: Bearer <token>" \
     -F "file=@document.pdf" \
     -F "sessionId=<session-id>"
   ```

### Frontend Testing

The frontend is configured to run on `http://localhost:5173` by default.

To test integration:
1. Set `VITE_API_URL` in `.env`
2. Start backend server
3. Run `npm run dev`
4. Test authentication flow
5. Test chat functionality
6. Test document upload

---

## LLM Integration Notes

### System Prompts

For **Company Registration** workflow:
```
You are a government-approved company registration assistant. Your role is to:
1. Guide users through company name registration
2. Request required documents
3. Validate company name availability
4. Verify uploaded documents
5. Process registration applications

Current workflow step: [step]
User context: [context]
```

For **Company Incorporation** workflow:
```
You are a government-approved company incorporation assistant. Your role is to:
1. Guide users through the complete incorporation process
2. Collect all required information
3. Validate documents and requirements
4. Process incorporation applications

Current workflow step: [step]
User context: [context]
```

### Context Management

- Maintain conversation history for each session
- Store workflow progress in session metadata
- Track document status and validation results
- Remember company names suggested
- Keep track of current workflow step

### Company Name Validation

Implement logic to:
1. Check name against database
2. Validate against naming rules
3. Check for similar existing names
4. Verify availability
5. Return clear availability status

### Document Validation

Implement validation for:
1. File format and size
2. Document completeness
3. Required fields presence
4. Signature verification
5. Date validity

---

## Security Considerations

1. **Token Security:**
   - Use strong JWT secrets
   - Set appropriate expiry times
   - Implement token refresh mechanism
   - Blacklist revoked tokens

2. **Data Validation:**
   - Validate all inputs
   - Sanitize user content
   - Prevent SQL injection
   - Validate file uploads

3. **Rate Limiting:**
   - Implement rate limits per endpoint
   - Protect against brute force
   - Limit file upload size/frequency

4. **CORS:**
   - Configure appropriate CORS headers
   - Whitelist frontend domain
   - Handle preflight requests

5. **Encryption:**
   - Use HTTPS in production
   - Encrypt sensitive data
   - Hash passwords properly
   - Secure file storage

---

## Support

For integration questions or issues:
- Review this guide thoroughly
- Check the README.md for frontend details
- Test endpoints with provided curl examples
- Verify error responses match expected format

## Deployment Checklist

- [ ] Configure production API URL
- [ ] Set up HTTPS
- [ ] Configure CORS properly
- [ ] Set up email service for OTP
- [ ] Configure file storage
- [ ] Set up LLM API keys
- [ ] Test all endpoints
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Test error handling
- [ ] Verify RLS policies
- [ ] Test authentication flow
- [ ] Test chat workflows
- [ ] Test document upload
- [ ] Load test API endpoints

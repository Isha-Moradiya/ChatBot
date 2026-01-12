# Government Company Registration Chatbot

A modern, LLM-driven chatbot web application for government-reference company name registration and incorporation.

## Features

- **LLM-Driven Conversations**: Intelligent chatbot powered by AI for natural interactions
- **Session-Based Chat**: Multiple chat sessions with workflow-specific conversations
- **Document Upload & Validation**: Upload and verify documents within chat
- **Authentication**: Email/Password with OTP verification
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Chat Interface**: ChatGPT-like UI with message history
- **Two Main Workflows**:
  - Company Name Registration
  - Company Incorporation

## Tech Stack

- **Frontend**: React.js + TypeScript
- **UI Components**: shadcn/ui
- **Routing**: react-router-dom
- **State Management**: React Context API
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Security**: Crypto-JS for encryption

## Project Structure

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatMessage.tsx
│   │   ├── ChatInput.tsx
│   │   ├── Sidebar.tsx
│   │   ├── UserProfile.tsx
│   │   └── DocumentUpload.tsx
│   └── ui/              # shadcn/ui components
├── contexts/
│   ├── AuthContext.tsx
│   └── ChatContext.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── VerifyOtpPage.tsx
│   ├── ForgotPasswordPage.tsx
│   ├── ResetPasswordPage.tsx
│   └── ChatPage.tsx
├── services/
│   ├── auth.service.ts
│   └── chat.service.ts
├── types/
│   ├── auth.types.ts
│   └── chat.types.ts
├── lib/
│   ├── api-client.ts
│   └── encryption-utils.ts
└── config/
    └── env.ts
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ENCRYPTION_KEY=your_encryption_key
```

4. Start the development server:
```bash
npm run dev
```

## Database Schema

The application uses Supabase with the following tables:

### profiles
- User profile information
- Links to auth.users

### chat_sessions
- Chat conversation sessions
- Workflow type (company_registration, company_incorporation, general)
- Session metadata

### messages
- Individual chat messages
- Role (user, assistant, system)
- Message content and metadata

### documents
- Uploaded documents
- Document verification status
- File information and URLs

## API Integration

### Backend API Requirements

The frontend is ready for API integration. The backend should implement the following endpoints:

#### Authentication Endpoints

```
POST /auth/register
POST /auth/login
POST /auth/verify-otp
POST /auth/resend-otp
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/logout
GET  /auth/me
```

#### Chat Endpoints

```
POST   /chat/sessions           - Create new chat session
GET    /chat/sessions           - Get user's chat sessions
GET    /chat/sessions/:id/messages - Get messages for a session
POST   /chat/messages           - Send a message
POST   /chat/documents          - Upload document
DELETE /chat/sessions/:id       - Delete a session
PATCH  /chat/sessions/:id       - Update session title
```

### Request/Response Formats

All API responses should follow this format:

```typescript
{
  success: boolean;
  message?: string;
  data?: any;
}
```

### Authentication

The API client automatically:
- Adds Bearer token to requests
- Handles 401 errors and redirects to login
- Encrypts tokens in localStorage
- Manages token lifecycle

## Chat Workflow

### Company Name Registration Flow

1. User starts "Company Name Registration" workflow
2. LLM requests required documents
3. User uploads documents
4. User provides 3-4 company name suggestions
5. LLM checks name availability
6. LLM validates documents
7. If documents incorrect:
   - LLM sends error explanation
   - Email notification with secure link
   - Re-upload UI shown
8. If documents correct:
   - Success confirmation
   - Registration completed

### Company Incorporation Flow

Similar workflow with incorporation-specific requirements.

## Key Features

### Authentication
- Email/Password registration and login
- Alphanumeric OTP verification (A-Z, 0-9)
- Password reset flow
- Secure token management with encryption

### Chat Interface
- ChatGPT-like conversation UI
- Message history per session
- Document upload within chat
- Session management (create, delete, switch)
- Responsive sidebar with session list

### User Experience
- Guest mode: Try 3 messages before login
- Smooth transitions and animations
- Loading states and error handling
- Mobile-responsive design
- Dark mode support (via shadcn/ui)

## Security

- All tokens encrypted in localStorage
- Row Level Security (RLS) on all database tables
- Users can only access their own data
- Secure document upload handling
- HTTPS recommended for production

## Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Adding New Features

1. Create types in `src/types/`
2. Add service functions in `src/services/`
3. Create components in `src/components/`
4. Update contexts if needed
5. Add routes in `App.tsx`

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

3. Configure environment variables in your hosting platform

4. Ensure API endpoints are correctly configured

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License Here]

## Support

For support, email [your-email] or create an issue in the repository.

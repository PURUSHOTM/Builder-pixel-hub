# ContractPro - SaaS Contract & Invoice Manager

A modern, professional SaaS application for freelancers to manage contracts, invoices, and client relationships with automated workflows and e-signature integration.

## 🚀 Features

### Core Modules

- **🔐 Authentication** - JWT-based login/signup with protected routes
- **👥 Client Management** - CRUD operations for client information
- **📄 Contract Management** - Create, manage, and track contracts with e-signature integration
- **💳 Invoice Management** - Generate invoices with automated payment reminders
- **📊 Dashboard** - Comprehensive analytics and business insights
- **📈 Reports** - Export and analyze business data

### Key Highlights

- **Modern UI/UX** - Professional design with light/dark mode support
- **Responsive Design** - Optimized for all screen sizes
- **Real-time Updates** - Live notifications and status tracking
- **API Integration** - Modular interceptor system for backend communication
- **Type Safety** - Full TypeScript support throughout
- **Accessibility** - WCAG compliant with proper ARIA labels

## 🛠 Tech Stack

### Frontend

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type safety and better development experience
- **React Router 6** - Client-side routing with protected routes
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/UI** - High-quality, accessible UI components
- **React Query** - Server state management and caching
- **React Hook Form** - Efficient form handling
- **Recharts** - Beautiful charts and data visualization
- **Vite** - Fast build tool and development server

### State Management

- **React Context** - Authentication state management
- **React Query** - Server state and caching
- **Local Storage** - Persistent authentication tokens

### Design System

- **Professional Color Palette** - Blue-based theme with semantic colors
- **Inter Font** - Modern, readable typography
- **Consistent Spacing** - 8px grid system
- **Responsive Breakpoints** - Mobile-first approach
- **Dark Mode** - System preference detection

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components (shadcn/ui)
│   └── layout/             # Layout components (Sidebar, Header, etc.)
├── pages/
│   ├── Auth/               # Authentication pages
│   ├── Dashboard/          # Dashboard and analytics
│   ├── Clients/            # Client management
│   ├── Contracts/          # Contract management
│   ├── Invoices/           # Invoice management
│   └── Reports/            # Reports and exports
├── lib/
│   ├── api/                # API client with interceptors
│   ├── auth/               # Authentication context and utilities
│   ├── types/              # TypeScript type definitions
│   └── utils.ts            # Utility functions
├── hooks/                  # Custom React hooks
└── styles/                 # Global styles and themes
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Modern web browser
- Backend API server (see Backend Setup)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd contractpro
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Account

For testing purposes, use these credentials:

- **Email:** demo@contractpro.com
- **Password:** demo123

## 🔧 Backend Configuration

### Required Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api

# MongoDB Connection
MONGODB_URI=mongodb+srv://pkkashyap110:wbys5YFBKBJJhHmN@cluster0.u0ttgdi.mongodb.net/contractpro

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Service (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@contractpro.com

# E-signature Integration
HELLOSIGN_API_KEY=your-hellosign-api-key
DOCUSIGN_CLIENT_ID=your-docusign-client-id
DOCUSIGN_CLIENT_SECRET=your-docusign-client-secret
```

### API Endpoints

The frontend expects these backend endpoints:

```
Authentication:
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
GET  /api/auth/me

Clients:
GET    /api/clients
POST   /api/clients
GET    /api/clients/:id
PUT    /api/clients/:id
DELETE /api/clients/:id

Contracts:
GET    /api/contracts
POST   /api/contracts
GET    /api/contracts/:id
PUT    /api/contracts/:id
DELETE /api/contracts/:id
POST   /api/contracts/:id/send-signature

Invoices:
GET    /api/invoices
POST   /api/invoices
GET    /api/invoices/:id
PUT    /api/invoices/:id
DELETE /api/invoices/:id
POST   /api/invoices/:id/send
POST   /api/invoices/:id/remind

Dashboard:
GET    /api/dashboard/stats
GET    /api/dashboard/revenue
GET    /api/dashboard/activity
```

## 🎨 Design System

### Colors

- **Primary:** Blue (`#2563eb`) - Professional and trustworthy
- **Success:** Green (`#22c55e`) - Positive actions and status
- **Warning:** Orange (`#f59e0b`) - Attention and warnings
- **Error:** Red (`#ef4444`) - Errors and dangerous actions
- **Neutral:** Slate - Text and borders

### Typography

- **Font Family:** Inter - Modern, readable sans-serif
- **Font Weights:** 300, 400, 500, 600, 700, 800
- **Line Heights:** Optimized for readability

### Components

All UI components follow the shadcn/ui design system with custom theming:

- Consistent border radius (0.75rem)
- Smooth animations and transitions
- Accessible focus states
- Responsive design patterns

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Protected Routes** - Client-side route protection
- **Input Validation** - Form validation with error handling
- **XSS Protection** - Sanitized user inputs
- **CSRF Protection** - Request validation
- **Environment Variables** - Sensitive data protection

## 📱 Responsive Design

- **Mobile First** - Optimized for mobile devices
- **Breakpoints:**
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run type checking
npm run typecheck

# Build for production
npm run build
```

## 🚀 Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Heroku/DigitalOcean)

1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy backend API
4. Update VITE_API_URL in frontend

## 📋 Development Roadmap

### Phase 1: Foundation ✅

- Authentication system
- Basic layout and navigation
- Dashboard with mock data
- Responsive design

### Phase 2: Core Features (In Progress)

- Client management CRUD
- Contract creation and management
- Invoice generation
- PDF export functionality

### Phase 3: Advanced Features (Planned)

- E-signature integration (HelloSign/DocuSign)
- Automated payment reminders
- Email notifications
- Advanced reporting

### Phase 4: Enhancement (Future)

- Mobile app (React Native)
- Advanced analytics
- Team collaboration
- API rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue on GitHub
- Email: support@contractpro.com
- Documentation: [docs.contractpro.com](https://docs.contractpro.com)

## 🙏 Acknowledgments

- [Shadcn/UI](https://ui.shadcn.com/) for the excellent UI components
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React Query](https://tanstack.com/query) for server state management
- [Lucide React](https://lucide.dev/) for beautiful icons

# ContractPro Backend API

Professional Express.js backend for the ContractPro SaaS application with MongoDB and JWT authentication.

## 🚀 Features

- **JWT Authentication** - Secure user authentication and authorization
- **MongoDB Integration** - Professional database schema with Mongoose ODM
- **RESTful API** - Complete CRUD operations for all resources
- **Input Validation** - Comprehensive validation with express-validator
- **Error Handling** - Professional error handling and logging
- **Security** - Helmet, CORS, rate limiting, and input sanitization
- **Seeded Data** - Ready-to-use dummy data for development

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Error handling middleware
│   └── validation.js        # Input validation middleware
├── models/
│   ├── User.js              # User model with bcrypt hashing
│   ├── Client.js            # Client model
│   ├── Contract.js          # Contract model with status tracking
│   └── Invoice.js           # Invoice model with calculations
├── routes/
│   ├── auth.js              # Authentication endpoints
│   ├── clients.js           # Client management endpoints
│   ├── contracts.js         # Contract management endpoints
│   ├── invoices.js          # Invoice management endpoints
│   └── dashboard.js         # Dashboard analytics endpoints
├── scripts/
│   └── seedData.js          # Database seeding script
├���─ server.js                # Main Express server
├── package.json             # Dependencies and scripts
└── .env                     # Environment configuration
```

## 🛠 Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Configuration

The `.env` file is already configured with:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://pkkashyap110:wbys5YFBKBJJhHmN@cluster0.u0ttgdi.mongodb.net/contractpro?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=contractpro-super-secret-jwt-key-2024-production-ready
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:8080
```

### 3. Seed the Database

```bash
npm run seed
```

This will create:

- 3 demo users (including demo@contractpro.com)
- 5 clients with complete information
- 4 contracts in various states
- 5 invoices with different statuses

### 4. Start the Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 🔑 Demo Credentials

After seeding, you can login with:

- **Email:** demo@contractpro.com
- **Password:** demo123

## 📚 API Endpoints

### Authentication

```
POST /api/auth/register     # Register new user
POST /api/auth/signup       # Alias for register
POST /api/auth/login        # User login
GET  /api/auth/me           # Get current user
PUT  /api/auth/profile      # Update user profile
POST /api/auth/logout       # User logout
```

### Clients

```
GET    /api/clients         # Get all clients (paginated)
POST   /api/clients         # Create new client
GET    /api/clients/:id     # Get client by ID
PUT    /api/clients/:id     # Update client
DELETE /api/clients/:id     # Delete client (soft delete)
```

### Contracts

```
GET    /api/contracts       # Get all contracts (paginated)
POST   /api/contracts       # Create new contract
GET    /api/contracts/:id   # Get contract by ID
PUT    /api/contracts/:id   # Update contract
DELETE /api/contracts/:id   # Delete contract
POST   /api/contracts/:id/send-signature  # Send for signature
POST   /api/contracts/:id/sign             # Mark as signed (demo)
GET    /api/contracts/:id/export-pdf       # Export as PDF
```

### Invoices

```
GET    /api/invoices        # Get all invoices (paginated)
POST   /api/invoices        # Create new invoice
GET    /api/invoices/:id    # Get invoice by ID
PUT    /api/invoices/:id    # Update invoice
DELETE /api/invoices/:id    # Delete invoice
POST   /api/invoices/:id/send          # Send invoice
POST   /api/invoices/:id/remind        # Send payment reminder
POST   /api/invoices/:id/mark-paid     # Mark as paid
GET    /api/invoices/:id/export-pdf    # Export as PDF
```

### Dashboard

```
GET /api/dashboard/stats              # Get dashboard statistics
GET /api/dashboard/revenue            # Get revenue chart data
GET /api/dashboard/activity           # Get recent activity
GET /api/dashboard/upcoming-deadlines # Get upcoming deadlines
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with configurable salt rounds
- **Rate Limiting** - Prevent abuse with express-rate-limit
- **Input Validation** - Comprehensive validation with express-validator
- **CORS Protection** - Configured for frontend domain
- **Helmet Security** - Security headers and protections
- **Error Handling** - Secure error responses without data leakage

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String (required, 2-50 chars)
  email: String (required, unique, valid email)
  password: String (required, min 6 chars, hashed)
  role: String (freelancer|admin, default: freelancer)
  avatar: String (optional)
  isEmailVerified: Boolean (default: false)
  lastLoginAt: Date
  isActive: Boolean (default: true)
  timestamps: createdAt, updatedAt
}
```

### Client Model

```javascript
{
  name: String (required, max 100 chars)
  email: String (required, valid email)
  company: String (required, max 100 chars)
  phone: String (optional, valid format)
  address: {
    street, city, state, zipCode, country
  }
  notes: String (optional, max 500 chars)
  userId: ObjectId (ref: User, required)
  isActive: Boolean (default: true)
  timestamps: createdAt, updatedAt
}
```

### Contract Model

```javascript
{
  title: String (required, max 200 chars)
  content: String (required, max 10000 chars)
  clientId: ObjectId (ref: Client, required)
  userId: ObjectId (ref: User, required)
  amount: Number (required, min: 0)
  currency: String (USD|EUR|GBP|CAD|AUD)
  status: String (draft|sent|signed|expired|cancelled)
  signatureId: String (for e-signature integration)
  sentAt: Date
  signedAt: Date
  expiresAt: Date (required, future date)
  terms: String (max 2000 chars)
  isActive: Boolean (default: true)
  timestamps: createdAt, updatedAt
}
```

### Invoice Model

```javascript
{
  invoiceNumber: String (auto-generated, unique)
  clientId: ObjectId (ref: Client, required)
  userId: ObjectId (ref: User, required)
  items: [{
    description: String (required, max 200 chars)
    quantity: Number (required, min: 0.01)
    rate: Number (required, min: 0)
    amount: Number (auto-calculated)
  }]
  subtotal: Number (auto-calculated)
  taxRate: Number (0-100, default: 0)
  taxAmount: Number (auto-calculated)
  total: Number (auto-calculated)
  currency: String (USD|EUR|GBP|CAD|AUD)
  status: String (draft|sent|paid|overdue|cancelled)
  issueDate: Date (default: now)
  dueDate: Date (required, >= issueDate)
  paidAt: Date
  notes: String (max 500 chars)
  reminders: [{
    dateSent: Date
    type: String (first|second|final)
    status: String (sent|failed)
  }]
  isActive: Boolean (default: true)
  timestamps: createdAt, updatedAt
}
```

## 🧪 Testing

```bash
# Health check
curl http://localhost:3001/health

# Test authentication
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "demo@contractpro.com", "password": "demo123"}'

# Test protected route (replace TOKEN with JWT from login)
curl -X GET http://localhost:3001/api/dashboard/stats \
  -H "Authorization: Bearer TOKEN"
```

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_super_secure_jwt_secret_key
FRONTEND_URL=https://your-frontend-domain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_SALT_ROUNDS=12
```

### Deployment Options

1. **Heroku**
2. **DigitalOcean App Platform**
3. **AWS EC2 with PM2**
4. **Docker Container**

## 📝 Development Notes

- All routes are protected by JWT authentication except auth endpoints
- Passwords are hashed with bcrypt before storing
- Soft delete is implemented for all resources (isActive: false)
- Pagination is implemented for list endpoints
- Input validation is comprehensive with helpful error messages
- Database indexes are optimized for common queries
- Error handling provides appropriate HTTP status codes

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the React frontend:

1. **CORS configured** for frontend domain
2. **Consistent API responses** with success/error format
3. **JWT tokens** for stateless authentication
4. **Pagination support** for large datasets
5. **Search and filtering** capabilities
6. **Real-time status updates** for contracts and invoices

## 📞 Support

For backend-specific issues:

- Check server logs for detailed error information
- Verify MongoDB connection and credentials
- Ensure all environment variables are set correctly
- Test individual endpoints with curl or Postman

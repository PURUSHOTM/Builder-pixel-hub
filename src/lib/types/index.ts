// Authentication Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "freelancer" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Client Types
export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientData {
  name: string;
  email: string;
  company: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  notes?: string;
}

// Contract Types
export type ContractStatus =
  | "draft"
  | "sent"
  | "signed"
  | "expired"
  | "cancelled";

export interface Contract {
  id: string;
  title: string;
  content: string;
  clientId: string;
  client?: Client;
  amount: number;
  currency: string;
  status: ContractStatus;
  signatureId?: string;
  sentAt?: string;
  signedAt?: string;
  expiresAt: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContractData {
  title: string;
  content: string;
  clientId: string;
  amount: number;
  currency: string;
  expiresAt: string;
}

// Invoice Types
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  client?: Client;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  notes?: string;
  reminders: PaymentReminder[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceData {
  clientId: string;
  items: Omit<InvoiceItem, "id" | "amount">[];
  taxRate: number;
  currency: string;
  dueDate: string;
  notes?: string;
}

export interface PaymentReminder {
  id: string;
  dateSent: string;
  type: "first" | "second" | "final";
  status: "sent" | "failed";
}

// Dashboard Types
export interface DashboardStats {
  totalClients: number;
  activeContracts: number;
  pendingInvoices: number;
  totalRevenue: number;
  monthlyRevenue: number;
  overdueInvoices: number;
}

export interface RevenueChart {
  month: string;
  revenue: number;
  invoices: number;
}

export interface RecentActivity {
  id: string;
  type: "contract_signed" | "invoice_paid" | "client_added" | "invoice_sent";
  description: string;
  timestamp: string;
  relatedId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "date";
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  options?: Array<{ value: string; label: string }>;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType;
  badge?: string | number;
  disabled?: boolean;
  external?: boolean;
}

// Theme Types
export type Theme = "light" | "dark" | "system";

// Export utility types
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Filter and sort types
export interface FilterOptions {
  search?: string;
  status?: string;
  dateRange?: {
    from: string;
    to: string;
  };
  clientId?: string;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}

import { ApiResponse, PaginatedResponse } from "../types";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Demo mode configuration - always disabled for production use
const DEMO_MODE = false;

// Request/Response Interceptors
type RequestInterceptor = (
  config: RequestInit & { url: string },
) => RequestInit & { url: string };
type ResponseInterceptor = (response: Response) => Promise<Response>;
type ErrorInterceptor = (error: any) => Promise<any>;

class ApiClient {
  private baseUrl: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.setupDefaultInterceptors();
  }

  // Add interceptors
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor) {
    this.errorInterceptors.push(interceptor);
  }

  // Setup default interceptors
  private setupDefaultInterceptors() {
    // Auth token interceptor
    this.addRequestInterceptor((config) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    });

    // Content-Type interceptor
    this.addRequestInterceptor((config) => {
      if (
        !config.headers?.["Content-Type"] &&
        config.body &&
        !(config.body instanceof FormData)
      ) {
        config.headers = {
          ...config.headers,
          "Content-Type": "application/json",
        };
      }
      return config;
    });

    // Response logging interceptor (development only)
    if (import.meta.env.DEV) {
      this.addResponseInterceptor(async (response) => {
        console.log(`${response.status} ${response.url}`);
        return response;
      });
    }

    // Error handling interceptor
    this.addErrorInterceptor(async (error) => {
      if (error.status === 401) {
        // Clear auth token and redirect to login
        localStorage.removeItem("authToken");
        window.location.href = "/auth/login";
      }
      throw error;
    });
  }

  // Mock response for demo mode
  private async getMockResponse<T>(
    endpoint: string,
    method: string = "GET",
  ): Promise<ApiResponse<T>> {
    // Simulate network delay for realistic UX
    await new Promise((resolve) =>
      setTimeout(resolve, Math.random() * 300 + 200),
    );

    // Mock responses based on endpoint
    if (endpoint === "/auth/login" && method === "POST") {
      return {
        success: true,
        data: {
          user: {
            id: "demo-user-id",
            name: "Demo User",
            email: "demo@contractpro.com",
            role: "freelancer",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: "demo-jwt-token-" + Date.now(),
        } as T,
        message: "Login successful",
      };
    }

    if (endpoint === "/auth/signup" && method === "POST") {
      return {
        success: true,
        data: {
          user: {
            id: "demo-user-id",
            name: "Demo User",
            email: "demo@contractpro.com",
            role: "freelancer",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          token: "demo-jwt-token-" + Date.now(),
        } as T,
        message: "Account created successfully",
      };
    }

    if (endpoint === "/auth/me") {
      return {
        success: true,
        data: {
          id: "demo-user-id",
          name: "Demo User",
          email: "demo@contractpro.com",
          role: "freelancer",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as T,
      };
    }

    // Default mock response
    return {
      success: true,
      data: {} as T,
      message: "Demo response",
    };
  }

  // Core request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    // Use mock responses in demo mode
    if (DEMO_MODE) {
      console.log(`[DEMO MODE] ${options.method || "GET"} ${endpoint}`);
      return this.getMockResponse<T>(endpoint, options.method || "GET");
    }

    let config = {
      url: `${this.baseUrl}${endpoint}`,
      ...options,
      headers: {
        ...options.headers,
      },
    };

    // Apply request interceptors
    for (const interceptor of this.requestInterceptors) {
      config = interceptor(config);
    }

    try {
      let response = await fetch(config.url, config);

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        response = await interceptor(response);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // Handle cases where response is not valid JSON
        data = {
          message: response.statusText || "Request failed",
          error: "Invalid response format",
        };
      }

      if (!response.ok) {
        const error = new Error(data.error || data.message || "Request failed");
        (error as any).status = response.status;
        (error as any).data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // In demo mode, don't throw network errors
      if (
        DEMO_MODE &&
        error instanceof TypeError &&
        error.message.includes("fetch")
      ) {
        console.log(`[DEMO MODE] Network error caught, using mock response`);
        return this.getMockResponse<T>(endpoint, options.method || "GET");
      }

      // Handle network errors gracefully
      if (error instanceof TypeError && error.message.includes("fetch")) {
        const networkError = new Error(
          "Unable to connect to server. Please check your internet connection.",
        );
        (networkError as any).status = 0;
        (networkError as any).name = "NetworkError";
        error = networkError;
      }

      // Apply error interceptors
      for (const interceptor of this.errorInterceptors) {
        try {
          error = await interceptor(error);
        } catch (interceptorError) {
          // If interceptor fails, use original error
          console.warn("Error interceptor failed:", interceptorError);
        }
      }
      throw error;
    }
  }

  // HTTP methods
  async get<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    return this.request<T>(url);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
    });
  }

  // Paginated requests
  async getPaginated<T>(
    endpoint: string,
    params?: Record<string, any>,
  ): Promise<PaginatedResponse<T>> {
    const response = await this.get<T[]>(endpoint, params);
    return response as unknown as PaginatedResponse<T>;
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Specialized API clients for different modules
export class AuthApi {
  static async login(credentials: { email: string; password: string }) {
    return apiClient.post("/auth/login", credentials);
  }

  static async signup(credentials: {
    name: string;
    email: string;
    password: string;
  }) {
    return apiClient.post("/auth/signup", credentials);
  }

  static async logout() {
    return apiClient.post("/auth/logout");
  }

  static async refreshToken() {
    return apiClient.post("/auth/refresh");
  }

  static async forgotPassword(email: string) {
    return apiClient.post("/auth/forgot-password", { email });
  }

  static async resetPassword(token: string, password: string) {
    return apiClient.post("/auth/reset-password", { token, password });
  }

  static async verifyEmail(token: string) {
    return apiClient.post("/auth/verify-email", { token });
  }

  static async getCurrentUser() {
    return apiClient.get("/auth/me");
  }
}

export class ClientsApi {
  static async getClients(params?: any) {
    return apiClient.getPaginated("/clients", params);
  }

  static async getClient(id: string) {
    return apiClient.get(`/clients/${id}`);
  }

  static async createClient(data: any) {
    return apiClient.post("/clients", data);
  }

  static async updateClient(id: string, data: any) {
    return apiClient.put(`/clients/${id}`, data);
  }

  static async deleteClient(id: string) {
    return apiClient.delete(`/clients/${id}`);
  }
}

export class ContractsApi {
  static async getContracts(params?: any) {
    return apiClient.getPaginated("/contracts", params);
  }

  static async getContract(id: string) {
    return apiClient.get(`/contracts/${id}`);
  }

  static async createContract(data: any) {
    return apiClient.post("/contracts", data);
  }

  static async updateContract(id: string, data: any) {
    return apiClient.put(`/contracts/${id}`, data);
  }

  static async deleteContract(id: string) {
    return apiClient.delete(`/contracts/${id}`);
  }

  static async sendForSignature(id: string) {
    return apiClient.post(`/contracts/${id}/send-signature`);
  }

  static async exportPdf(id: string) {
    return apiClient.get(`/contracts/${id}/export-pdf`);
  }
}

export class InvoicesApi {
  static async getInvoices(params?: any) {
    return apiClient.getPaginated("/invoices", params);
  }

  static async getInvoice(id: string) {
    return apiClient.get(`/invoices/${id}`);
  }

  static async createInvoice(data: any) {
    return apiClient.post("/invoices", data);
  }

  static async updateInvoice(id: string, data: any) {
    return apiClient.put(`/invoices/${id}`, data);
  }

  static async deleteInvoice(id: string) {
    return apiClient.delete(`/invoices/${id}`);
  }

  static async sendInvoice(id: string) {
    return apiClient.post(`/invoices/${id}/send`);
  }

  static async sendReminder(id: string) {
    return apiClient.post(`/invoices/${id}/remind`);
  }

  static async exportPdf(id: string) {
    return apiClient.get(`/invoices/${id}/export-pdf`);
  }
}

export class DashboardApi {
  static async getStats() {
    return apiClient.get("/dashboard/stats");
  }

  static async getRevenueChart(period?: string) {
    return apiClient.get("/dashboard/revenue", { period });
  }

  static async getRecentActivity() {
    return apiClient.get("/dashboard/activity");
  }
}

// Export default instance
export default apiClient;

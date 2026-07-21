const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

const ROLE_KEYS = ['student', 'company'] as const;

class ApiClient {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const activeRole = sessionStorage.getItem('auth_active_role') as 'student' | 'company' | null;
    if (activeRole) {
      return localStorage.getItem(`auth_token_${activeRole}`);
    }
    for (const role of ROLE_KEYS) {
      const token = localStorage.getItem(`auth_token_${role}`);
      if (token) return token;
    }
    return null;
  }

  private clearAllAuth(): void {
    for (const role of ROLE_KEYS) {
      localStorage.removeItem(`auth_token_${role}`);
      localStorage.removeItem(`auth_user_${role}`);
    }
  }

  private isAuthEndpoint(endpoint: string): boolean {
    return endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/register');
  }

  async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, isFormData = false } = options;
    const token = this.getToken();

    const config: RequestInit = {
      method,
      headers: {
        ...headers,
      },
    };

    if (token) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    if (body && !isFormData) {
      (config.headers as Record<string, string>)['Content-Type'] = 'application/json';
      config.body = JSON.stringify(body);
    } else if (body && isFormData) {
      config.body = body;
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401 && !this.isAuthEndpoint(endpoint)) {
      if (typeof window !== 'undefined') {
        this.clearAllAuth();
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      throw new Error('Unauthorized');
    }

    if (response.status === 401) {
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  get<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T = any>(endpoint: string, body?: any, isFormData = false) {
    return this.request<T>(endpoint, { method: 'POST', body, isFormData });
  }

  put<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  patch<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, { method: 'PATCH', body });
  }

  delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;

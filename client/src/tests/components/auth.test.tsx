
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '@/pages/login';
import { useAuth } from '@/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('Login Component', () => {
  it('renders login form correctly', () => {
    const mockLogin = vi.fn();
    (useAuth as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });

    render(<Login />, { wrapper: createWrapper() });
    
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const mockLogin = vi.fn();
    (useAuth as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });

    render(<Login />, { wrapper: createWrapper() });
    
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        userType: 'user',
      });
    });
  });

  it('displays error message on login failure', () => {
    const mockLogin = vi.fn();
    (useAuth as any).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: 'Invalid credentials',
    });

    render(<Login />, { wrapper: createWrapper() });
    
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});

// Simple version of App.tsx for debugging
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";

function SimpleLogin() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>SportX CPD Platform</h1>
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        <h2>Login Form</h2>
        <p>Use: student1 / demo123</p>
        <button 
          onClick={async () => {
            try {
              const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'student1', password: 'demo123' })
              });
              const data = await response.json();
              alert('Login successful: ' + JSON.stringify(data.user));
              window.location.reload();
            } catch (error) {
              alert('Login failed: ' + error.message);
            }
          }}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Login as Student
        </button>
      </div>
    </div>
  );
}

function SimpleApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div>
          <SimpleLogin />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default SimpleApp;
// Import React library and useState hook for component state management
import React, { useState } from 'react';
// Import UI layout components and form elements from React Bootstrap
import { Container, Form, Button, Card, ToggleButton, ButtonGroup } from 'react-bootstrap';
// Import routing navigation hook from React Router
import { useNavigate } from 'react-router-dom';

function Login() {
  // State hook to toggle between Login view (false) and Register view (true)
  const [isRegistering, setIsRegistering] = useState(false);
  // State hook to store the user's full name during registration
  const [name, setName] = useState('');
  // State hook to store user email address or phone number identifier
  const [identifier, setIdentifier] = useState('');
  // State hook to store user password input
  const [password, setPassword] = useState('');
  // State hook to store selected role ('User' or 'Admin'), defaulting to 'User'
  const [role, setRole] = useState('User');
  // Initialize navigation hook to programmatically switch routes
  const navigate = useNavigate();

  // Handler function for processing both authentication and registration submissions
  const handleAuthSubmit = (e) => {
    e.preventDefault(); // Prevent default browser form refresh reload behavior
    // Retrieve existing registered users list from localStorage, or initialize empty array
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

    if (isRegistering) {
      // --- REGISTRATION LOGIC BLOCK ---
      
      // Validate that full name is provided
      if (!name) {
        alert('Please enter your name.');
        return;
      }
      
      // Check if user account already exists with the same identifier (email/phone)
      const userExists = existingUsers.find((u) => u.identifier === identifier);
      if (userExists) {
        alert('An account with this email/phone already exists. Please log in.');
        return;
      }

      // Create new user object containing profile details and assigned role
      const newUser = { name, identifier, password, role };
      existingUsers.push(newUser); // Append new user to array
      
      // Save updated users list back into localStorage securely
      localStorage.setItem('users', JSON.stringify(existingUsers));
      alert('Registration successful! Please log in.');
      
      setIsRegistering(false); // Switch view back to login screen
      setName('');             // Clear name input field
      setPassword('');         // Clear password input field
    } else {
      // --- LOGIN AUTHENTICATION LOGIC BLOCK ---
      
      // Search for matching user credentials inside localStorage records
      const foundUser = existingUsers.find(
        (u) => u.identifier === identifier && u.password === password
      );

      if (foundUser) {
        // If matched: Store active user session in localStorage under 'currentUser'
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        alert(`Welcome back, ${foundUser.name} (${foundUser.role})!`);
        navigate('/buses'); // Redirect authenticated user/admin to the bus table page
      } else if (identifier === 'admin@transit.com' && password === 'admin123') {
        // Fallback hardcoded default admin account credentials check
        const defaultAdmin = { name: 'System Admin', identifier, role: 'Admin' };
        localStorage.setItem('currentUser', JSON.stringify(defaultAdmin));
        alert('Logged in as Default Admin!');
        navigate('/buses'); // Redirect default admin to bus table
      } else {
        // Error handling alert for incorrect login credentials
        alert('Invalid email/phone or password. Please check your credentials or register.');
      }
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center justify-content-center fade-in py-5">
      {/* Centered responsive container box */}
      <Container style={{ maxWidth: '450px' }}>
        <Card className="custom-card p-4 p-md-5 shadow-sm border-0">
          
          {/* Header text dynamically switches depending on login or register mode */}
          <div className="text-center mb-4">
            <h3 className="fw-bold text-dark">{isRegistering ? 'Create Account' : 'TransitTrack Login'}</h3>
            <p className="text-muted small">
              {isRegistering ? 'Register to access transit routes' : 'Sign in to monitor & manage schedules'}
            </p>
          </div>

          <Form onSubmit={handleAuthSubmit}>
            {/* CONDITIONAL INPUT: Full Name field appears only during registration mode */}
            {isRegistering && (
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold small text-secondary">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} // Update name state on typing
                  className="py-2 rounded-3 shadow-none border-secondary-subtle"
                  required
                />
              </Form.Group>
            )}

            {/* Email Address or Phone Number input field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small text-secondary">Email Address or Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="name@example.com or 9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)} // Update identifier state on typing
                className="py-2 rounded-3 shadow-none border-secondary-subtle"
                required
              />
            </Form.Group>

            {/* Password input field */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small text-secondary">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state on typing
                className="py-2 rounded-3 shadow-none border-secondary-subtle"
                required
              />
            </Form.Group>

            {/* CONDITIONAL TOGGLE: Role selector switch appears only during registration mode */}
            {isRegistering && (
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold small text-secondary d-block">Select Role</Form.Label>
                <ButtonGroup className="w-15">
                  {/* User Role Selection Button */}
                  <ToggleButton
                    id="role-user"
                    type="radio"
                    variant={role === 'User' ? 'primary' : 'outline-secondary'}
                    name="role"
                    value="User"
                    checked={role === 'User'}
                    onChange={(e) => setRole(e.currentTarget.value)}
                  >
                    User
                  </ToggleButton>
                  {/* Admin Role Selection Button */}
                  <ToggleButton
                    id="role-admin"
                    type="radio"
                    variant={role === 'Admin' ? 'danger' : 'outline-secondary'}
                    name="role"
                    value="Admin"
                    checked={role === 'Admin'}
                    onChange={(e) => setRole(e.currentTarget.value)}
                  >
                    Admin
                  </ToggleButton>
                </ButtonGroup>
              </Form.Group>
            )}

            {/* Primary submission button text changes dynamically based on mode */}
            <Button variant="primary" type="submit" className="w-100 py-2 rounded-pill fw-semibold shadow-sm mb-3">
              {isRegistering ? 'Register Account' : 'Log In'}
            </Button>

            {/* Toggle button link to switch between Login and Register views */}
            <div className="text-center mt-3">
              <Button
                variant="link"
                className="text-decoration-none small text-primary fw-semibold"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? 'Already have an account? Log in' : "Don't have an account? Register here"}
              </Button>
            </div>

            {/* Navigation button to return back to the Home page */}
            <div className="text-center mt-2">
              <Button variant="link" className="text-decoration-none text-muted small" onClick={() => navigate('/')}>
                ← Back to Home
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default Login;
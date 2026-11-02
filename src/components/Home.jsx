import React, { useState, useEffect } from 'react';
import { Container, Button, Navbar, Nav, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  // SECTION 1: Load logged-in user session on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  // SECTION 2: Handle user logout session clearing
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  // SECTION 3: Handle protected navigation with authentication checks
  const handleProtectedNavigation = (targetPath) => {
    if (!currentUser) {
      alert('Please log in first to access this section.');
      navigate('/login');
    } else {
      navigate(targetPath);
    }
  };

  return (
    <div className="fade-in">
      {/* SECTION 4: Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow-sm py-3">
        <Navbar.Brand href="#home" className="fw-bold fs-4 text-primary">🚍 TransitTrack</Navbar.Brand>
        <Nav className="ms-auto align-items-center gap-3">
          {currentUser ? (
            <>
              <span className="text-light fw-semibold small bg-secondary px-3 py-1 rounded-pill">
                {currentUser.name} ({currentUser.role})
              </span>
              <Button variant="outline-info" size="sm" className="rounded-pill px-3" onClick={() => handleProtectedNavigation('/booking')}>
                🎟️ Book Seats
              </Button>
              <Button variant="outline-light" size="sm" className="rounded-pill px-3" onClick={() => handleProtectedNavigation('/buses')}>
                Bus Table
              </Button>
              <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline-light" className="rounded-pill px-4" onClick={() => navigate('/login')}>Login</Button>
              <Button variant="primary" className="rounded-pill px-4 shadow-sm" onClick={() => navigate('/login')}>Register</Button>
            </>
          )}
        </Nav>
      </Navbar>

      {/* SECTION 5: Hero banner section */}
      <div className="hero-section text-center">
        <Container style={{ maxWidth: '800px' }}>
          <h1 className="display-3 fw-bold mb-3 text-white">Seamless Bus Route & Schedule Management</h1>
          <p className="lead text-light mb-4 opacity-90">
            Efficiently monitor bus routes, track departure times, book tickets, and keep your transit network organized in one portal.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button
              variant="success"
              size="lg"
              className="rounded-pill px-4 shadow"
              onClick={() => handleProtectedNavigation('/buses')}
            >
              View Bus Table
            </Button>
            
            <Button
              variant="info"
              size="lg"
              className="rounded-pill px-4 text-white shadow"
              onClick={() => handleProtectedNavigation('/booking')}
            >
              🎟️ Book Tickets Now
            </Button>

            {currentUser?.role === 'Admin' && (
              <Button
                variant="outline-light"
                size="lg"
                className="rounded-pill px-4"
                onClick={() => handleProtectedNavigation('/register')}
              >
                Add New Route
              </Button>
            )}
          </div>
        </Container>
      </div>

      {/* SECTION 6: Regional Transit Cards with clear visible text */}
      <Container className="my-5 py-4">
        <Row className="g-4">
          <Col md={4}>
            <Card className="custom-card hover-lift p-4 h-100 text-center border-0 shadow-sm">
              <div className="fs-1 mb-3">🚌</div>
              <h4 className="fw-bold mb-2 text-white">KSRTC Public Transport</h4>
              <p className="text-light small opacity-85">
                Track schedule timings for Kerala State RTC fleets, including Swift, Super Fast, Express, and Minnal services.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="custom-card hover-lift p-4 h-100 text-center border-0 shadow-sm">
              <div className="fs-1 mb-3">🚏</div>
              <h4 className="fw-bold mb-2 text-white">Private Stage Carriers</h4>
              <p className="text-light small opacity-85">
                Monitor local city routes and private stage carriage bus timings running between major hubs like Ernakulam and Trivandrum.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="custom-card hover-lift p-4 h-100 text-center border-0 shadow-sm">
              <div className="fs-1 mb-3">🛣️</div>
              <h4 className="fw-bold mb-2 text-white">Interstate Bus Lines</h4>
              <p className="text-light small opacity-85">
                Manage long-distance interstate routes connecting Kerala with neighbouring states, including Bengaluru, Chennai, and Mysuru.
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home;
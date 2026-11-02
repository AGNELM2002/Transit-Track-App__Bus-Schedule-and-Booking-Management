// Import React library and useState, useEffect hooks for component state management
import React, { useState, useEffect } from 'react';
// Import UI layout components, cards, buttons, and navigation from React Bootstrap
import { Container, Card, Button, Navbar, Nav } from 'react-bootstrap';
// Import routing hooks from React Router to navigate and access location router state
import { useNavigate, useLocation } from 'react-router-dom';

function BusDetail() {
  // Initialize navigation hook to programmatically switch routes
  const navigate = useNavigate();
  // Initialize location hook to retrieve router state data passed from previous pages
  const location = useLocation();
  // State hook to store selected bus details object
  const [bus, setBus] = useState(null);
  // State hook to store currently logged-in user session profile
  const [currentUser, setCurrentUser] = useState(null);

  // SECTION 1: Authentication Guard and Data Retrieval from Router State on Mount
  useEffect(() => {
    // Retrieve active user profile session from localStorage
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      alert('Unauthorized! Please log in first.');
      navigate('/login'); // Redirect unauthorized users to login screen
      return;
    }
    setCurrentUser(user); // Set active user state

    // Check if bus data exists in router location state
    if (location.state?.bus) {
      setBus(location.state.bus);
    } else {
      navigate('/buses'); // Redirect back to table if no bus data is found
    }
  }, [location, navigate]);

  // Return null if bus data is still loading or unavailable
  if (!bus) return null;

  // SECTION 2: Location Cleaner Helper (Strips out times & parentheses for clean Google Maps search)
  // Converts strings like "VYTTILA HUB (12:15 AM)" or "06:00 AM - ERNAKULAM" into just "VYTTILA HUB" or "ERNAKULAM"
  const cleanLocationName = (rawText) => {
    if (!rawText) return '';
    
    // Remove text inside parentheses (e.g., time values like "(12:15 AM)")
    let cleaned = rawText.replace(/\s*\([^)]*\)/g, '');
    
    // If formatted as "Time - Location", extract and return only the location text part
    if (cleaned.includes('-')) {
      const parts = cleaned.split('-').map((p) => p.trim());
      const locationPart = parts.find((p) => !/\d{1,2}:\d{1,2}/.test(p)) || parts[parts.length - 1];
      cleaned = locationPart;
    }
    return cleaned.trim();
  };

  // SECTION 3: Google Maps Redirection Trigger Helper
  const openGoogleMap = (rawLocationText) => {
    const cleanName = cleanLocationName(rawLocationText); // Clean name to exclude timestamp values
    // Construct Google Maps search URL query string using the clean location name
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanName)}`;
    window.open(mapsUrl, '_blank'); // Open Google Maps search link in a new browser tab
  };

  // SECTION 4: Parse and split comma-separated stops string into an individual clean array of stop items
  const parsedStops = bus.stops
    ? bus.stops.split(',').map((stop) => stop.trim()).filter((stop) => stop.length > 0)
    : [];

  return (
    <div className="bg-light min-vh-100 pb-5 fade-in">
      {/* SECTION 5: Top Navbar with app branding, user session badge, and back button */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow-sm mb-4 py-3">
        <Navbar.Brand href="/" className="fw-bold text-primary">🚍 TransitTrack</Navbar.Brand>
        <Nav className="ms-auto align-items-center gap-3">
          {currentUser && (
            // Display active user name and role badge in brackets
            <span className="text-light fw-semibold small bg-secondary px-3 py-1 rounded-pill">
              {currentUser.name} ({currentUser.role})
            </span>
          )}
          <Button variant="outline-light" size="sm" className="rounded-pill px-3" onClick={() => navigate('/buses')}>
            ← Back to Table
          </Button>
        </Nav>
      </Navbar>

      <Container style={{ maxWidth: '800px' }}>
        {/* SECTION 6: Bus Summary Header Card */}
        <Card className="custom-card p-4 p-md-4 shadow-sm border-0 mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h2 className="fw-bold text-dark mb-1">{bus.busName}</h2>
              <span className="badge bg-primary px-3 py-2 fs-6">Bus Number: {bus.busNumber}</span>
            </div>
            <Button variant="outline-primary" size="sm" className="rounded-pill px-4" onClick={() => navigate('/buses')}>
              View All Buses
            </Button>
          </div>
        </Card>

        {/* SECTION 7: Roadmap Flowchart Container displaying checkpoints */}
        <Card className="custom-card p-4 p-md-5 shadow-sm border-0">
          <h4 className="fw-bold text-dark mb-4 pb-2 border-bottom">🗺️ Route Roadmap & Checkpoints</h4>

          {/* Vertical timeline line container */}
          <div className="roadmap-container position-relative ps-4" style={{ borderLeft: '3px solid #3b82f6' }}>
            
            {/* SECTION 8: Starting Point / Departure Checkpoint Card */}
            <div className="mb-4 position-relative">
              {/* Timeline node circle indicator */}
              <div 
                className="position-absolute bg-primary rounded-circle shadow-sm" 
                style={{ width: '16px', height: '16px', left: '-29px', top: '12px' }}
              ></div>
              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 border">
                <div>
                  <span className="text-uppercase small text-muted fw-bold d-block">Starting Point / Departure</span>
                  <span className="fw-bold fs-5 text-dark">{bus.departureTime}</span>
                </div>
                {/* Map button triggers Google Maps query for departure location without time */}
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="rounded-pill px-3"
                  onClick={() => openGoogleMap(bus.departureTime)}
                >
                  📍 Open Map
                </Button>
              </div>
            </div>

            {/* SECTION 9: Dynamically Mapped Intermediate Stops & ETAs Checkpoints */}
            {parsedStops.length > 0 && (
              <div className="mb-4">
                <span className="text-uppercase small text-secondary fw-bold d-block mb-3">Intermediate Stops & ETAs</span>
                {parsedStops.map((stop, index) => (
                  <div key={index} className="mb-3 position-relative ps-2">
                    {/* Intermediate timeline node circle indicator */}
                    <div 
                      className="position-absolute bg-warning rounded-circle shadow-sm" 
                      style={{ width: '12px', height: '12px', left: '-27px', top: '14px' }}
                    ></div>
                    <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 border shadow-sm">
                      <div>
                        <span className="text-muted small fw-semibold me-2">Stop #{index + 1}</span>
                        <span className="fw-bold text-dark">{stop}</span>
                      </div>
                      {/* Individual map button for each stop */}
                      <Button 
                        variant="outline-danger" 
                        size="sm" 
                        className="rounded-pill px-3"
                        onClick={() => openGoogleMap(stop)}
                      >
                        📍 Open Map
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 10: Destination / Arrival Checkpoint Card */}
            <div className="position-relative">
              {/* Arrival timeline node circle indicator */}
              <div 
                className="position-absolute bg-success rounded-circle shadow-sm" 
                style={{ width: '16px', height: '16px', left: '-29px', top: '12px' }}
              ></div>
              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 border">
                <div>
                  <span className="text-uppercase small text-muted fw-bold d-block">Destination / Arrival</span>
                  <span className="fw-bold fs-5 text-dark">{bus.arrivalTime}</span>
                </div>
                {/* Map button triggers Google Maps query for arrival destination location */}
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  className="rounded-pill px-3"
                  onClick={() => openGoogleMap(bus.arrivalTime)}
                >
                  📍 Open Map
                </Button>
              </div>
            </div>

          </div>
        </Card>
      </Container>
    </div>
  );
}

export default BusDetail;
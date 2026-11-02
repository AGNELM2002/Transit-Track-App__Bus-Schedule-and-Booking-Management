import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Navbar, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function BusForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.bus || null;
  const [currentUser, setCurrentUser] = useState(null);

  // State hook for bus form attributes including total seats and ticket rate
  const [bus, setBus] = useState({
    id: '',
    busName: '',
    busNumber: '',
    departureTime: '',
    arrivalTime: '',
    stops: '',
    totalSeats: 40,
    ticketRate: 150,
    bookedSeats: [] // Array tracking booked seats e.g. ["12A", "13M"]
  });

  // SECTION 1: Authentication Guard & Data Pre-population for Edit
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      alert('Unauthorized! Please log in first.');
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    if (editData) {
      setBus(editData);
    }
  }, [navigate, editData]);

  // SECTION 2: Input Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus({ ...bus, [name]: value });
  };

  // SECTION 3: Submit Handler for Registering or Updating Bus
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser?.role !== 'Admin') {
      alert('Access Denied: Only Admins can add or modify bus routes.');
      return;
    }

    const existingBuses = JSON.parse(localStorage.getItem('buses')) || [];

    if (bus.id) {
      const updatedBuses = existingBuses.map((b) => (b.id === bus.id ? bus : b));
      localStorage.setItem('buses', JSON.stringify(updatedBuses));
      alert('Bus route updated successfully!');
    } else {
      const newBus = { ...bus, id: Date.now().toString() };
      const updatedBuses = [...existingBuses, newBus];
      localStorage.setItem('buses', JSON.stringify(updatedBuses));
      alert('New bus registered successfully!');
    }

    navigate('/buses');
  };

  return (
    <div className="bg-light min-vh-100 pb-5 fade-in">
      {/* SECTION 4: Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow-sm mb-4 py-3">
        <Navbar.Brand href="/" className="fw-bold text-primary">🚍 TransitTrack</Navbar.Brand>
        <Nav className="ms-auto align-items-center gap-3">
          {currentUser && (
            <span className="text-light fw-semibold small bg-secondary px-3 py-1 rounded-pill">
              {currentUser.name} ({currentUser.role})
            </span>
          )}
          <Button variant="outline-light" size="sm" className="rounded-pill px-3" onClick={() => navigate('/buses')}>Bus Table</Button>
        </Nav>
      </Navbar>

      <Container style={{ maxWidth: '650px' }}>
        <Card className="custom-card p-4 p-md-5 shadow-sm border-0">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-dark">{bus.id ? '✏️ Edit Bus Route' : '🚌 Register New Bus'}</h2>
            <p className="text-muted small">Fill in the schedule, seating capacity, and fare details</p>
          </div>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-secondary">Bus Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="busName"
                    placeholder="e.g., Kerala Express"
                    value={bus.busName}
                    onChange={handleChange}
                    className="py-2 rounded-3 shadow-none border-secondary-subtle"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-secondary">Bus Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="busNumber"
                    placeholder="e.g., KL-01-AB-1234"
                    value={bus.busNumber}
                    onChange={handleChange}
                    className="py-2 rounded-3 shadow-none border-secondary-subtle"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-secondary">Departure Time & Point</Form.Label>
                  <Form.Control
                    type="text"
                    name="departureTime"
                    placeholder="e.g., 08:00 AM - Ernakulam"
                    value={bus.departureTime}
                    onChange={handleChange}
                    className="py-2 rounded-3 shadow-none border-secondary-subtle"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-secondary">Arrival Time & Destination</Form.Label>
                  <Form.Control
                    type="text"
                    name="arrivalTime"
                    placeholder="e.g., 01:30 PM - Trivandrum"
                    value={bus.arrivalTime}
                    onChange={handleChange}
                    className="py-2 rounded-3 shadow-none border-secondary-subtle"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-secondary">Total Number of Seats</Form.Label>
                  <Form.Control
                    type="number"
                    name="totalSeats"
                    min="1"
                    max="60"
                    value={bus.totalSeats}
                    onChange={handleChange}
                    className="py-2 rounded-3 shadow-none border-secondary-subtle"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-secondary">Rate per Ticket (in ₹)</Form.Label>
                  <Form.Control
                    type="number"
                    name="ticketRate"
                    min="1"
                    value={bus.ticketRate}
                    onChange={handleChange}
                    className="py-2 rounded-3 shadow-none border-secondary-subtle"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold small text-secondary">Intermediate Stops & ETAs</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="stops"
                placeholder="e.g., Vyttila (08:30 AM), Alappuzha (10:00 AM)"
                value={bus.stops}
                onChange={handleChange}
                className="py-2 rounded-3 shadow-none border-secondary-subtle"
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="light" className="px-4 rounded-pill border" onClick={() => navigate('/buses')}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" className="px-4 rounded-pill shadow-sm">
                {bus.id ? 'Update Route' : 'Register Bus'}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
}

export default BusForm;
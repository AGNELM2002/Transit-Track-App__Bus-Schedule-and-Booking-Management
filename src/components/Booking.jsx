import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Navbar, Nav, Form, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [buses, setBuses] = useState([]);
  const [selectedBusId, setSelectedBusId] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Form states
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [numSeats, setNumSeats] = useState(1);
  const [passengerName, setPassengerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [seatNumber, setSeatNumber] = useState('');

  // SECTION 1: Authentication Guard & Load Buses
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      alert('Unauthorized! Please log in first.');
      navigate('/login');
      return;
    }
    setCurrentUser(user);
    if (user.name) setPassengerName(user.name);

    const storedBuses = JSON.parse(localStorage.getItem('buses')) || [];
    setBuses(storedBuses);

    // Pre-select bus if passed from BusTable
    if (location.state?.bus) {
      setSelectedBusId(location.state.bus.id);
      setDeparture(location.state.bus.departureTime);
      setArrival(location.state.bus.arrivalTime);
    } else if (storedBuses.length > 0) {
      setSelectedBusId(storedBuses[0].id);
      setDeparture(storedBuses[0].departureTime);
      setArrival(storedBuses[0].arrivalTime);
    }
  }, [location, navigate]);

  const currentBus = buses.find((b) => b.id === selectedBusId);

  // SECTION 2: Handle Bus Selection Change
  const handleBusChange = (e) => {
    const bId = e.target.value;
    setSelectedBusId(bId);
    const bus = buses.find((b) => b.id === bId);
    if (bus) {
      setDeparture(bus.departureTime);
      setArrival(bus.arrivalTime);
    }
  };

  // SECTION 3: Handle Booking Submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!currentBus) {
      alert('Please select a valid bus.');
      return;
    }

    const updatedBuses = buses.map((b) => {
      if (b.id === currentBus.id) {
        const existingBooked = b.bookedSeats || [];
        const newSeats = seatNumber.split(',').map(s => s.trim()).filter(s => s.length > 0);
        return {
          ...b,
          bookedSeats: [...existingBooked, ...newSeats]
        };
      }
      return b;
    });

    localStorage.setItem('buses', JSON.stringify(updatedBuses));
    alert(`Successfully booked ${numSeats} seat(s) on ${currentBus.busName}!\nPassenger: ${passengerName}\nSeats: ${seatNumber}`);
    navigate('/buses');
  };

  return (
    <div className="bg-light min-vh-100 pb-5 fade-in">
      {/* SECTION 4: Navbar */}
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

      <Container style={{ maxWidth: '1000px' }}>
        <h2 className="fw-bold text-dark mb-4 text-center">🎟️ Bus Seat Reservation Portal</h2>

        <Row className="g-4">
          {/* SECTION 5: Booking Form */}
          <Col md={7}>
            <Card className="custom-card p-4 shadow-sm border-0">
              <h4 className="fw-bold text-dark mb-3">Passenger & Ticket Details</h4>
              <Form onSubmit={handleBookingSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold small text-secondary">Select Bus Route</Form.Label>
                  <Form.Select
                    value={selectedBusId}
                    onChange={handleBusChange}
                    className="py-2 rounded-3 shadow-none border-secondary-subtle"
                    required
                  >
                    {buses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.busName} ({b.busNumber}) - ₹{b.ticketRate || 150}/ticket
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small text-secondary">From (Departure Location)</Form.Label>
                      <Form.Control
                        type="text"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        className="py-2 rounded-3 shadow-none border-secondary-subtle"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small text-secondary">To (Arrival Location)</Form.Label>
                      <Form.Control
                        type="text"
                        value={arrival}
                        onChange={(e) => setArrival(e.target.value)}
                        className="py-2 rounded-3 shadow-none border-secondary-subtle"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small text-secondary">Passenger Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter full name"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="py-2 rounded-3 shadow-none border-secondary-subtle"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small text-secondary">Phone Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="10-digit mobile number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="py-2 rounded-3 shadow-none border-secondary-subtle"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small text-secondary">Number of Seats (1 to 60)</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="60"
                        value={numSeats}
                        onChange={(e) => setNumSeats(e.target.value)}
                        className="py-2 rounded-3 shadow-none border-secondary-subtle"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold small text-secondary">Seat Number(s) (e.g. 12A, 13M)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="e.g., 12A, 13M"
                        value={seatNumber}
                        onChange={(e) => setSeatNumber(e.target.value)}
                        className="py-2 rounded-3 shadow-none border-secondary-subtle"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {currentBus && (
                  <div className="bg-light p-3 rounded-3 mb-3">
                    <span className="fw-bold text-dark d-block">Fare Summary:</span>
                    <span className="text-muted small">
                      {numSeats} Seat(s) × ₹{currentBus.ticketRate || 150} = <strong className="text-primary">₹{numSeats * (currentBus.ticketRate || 150)}</strong>
                    </span>
                  </div>
                )}

                <Button variant="primary" type="submit" className="w-100 py-2 rounded-pill fw-semibold shadow-sm">
                  Confirm & Book Tickets
                </Button>
              </Form>
            </Card>
          </Col>

          {/* SECTION 6: Bus Layout Preview (As requested by user) */}
          <Col md={5}>
            <Card className="custom-card p-4 bg-white shadow-sm border-0 text-center">
              <h5 className="fw-bold text-dark mb-2">Bus Seating Layout Preview</h5>
              <p className="text-muted small mb-3">Reference layout indicating window (W), middle (M), and aisle (A) seats[cite: 13].</p>
              
              {/* Seating Legend Indicator */}
              <div className="d-flex justify-content-center gap-2 mb-3 flex-wrap">
                <span className="seat-badge seat-available">Available</span>
                <span className="seat-badge seat-booked">Booked</span>
                <span className="seat-badge seat-ladies">Ladies</span>
              </div>

              {/* Graphical Layout Container */}
              <div className="border rounded-3 p-3 bg-light">
                <div className="fs-3 mb-2">steering 🛞</div>
                <div className="d-flex justify-content-around mb-2 fw-bold text-secondary small">
                  <span>WINDOW</span>
                  <span>MIDDLE</span>
                  <span>AISLE</span>
                </div>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex justify-content-around">
                    <span className="badge bg-secondary p-2">1 W</span>
                    <span className="badge bg-secondary p-2">2 M</span>
                    <span className="badge bg-primary p-2">3 A</span>
                  </div>
                  <div className="d-flex justify-content-around">
                    <span className="badge bg-secondary p-2">6 A</span>
                    <span className="badge bg-secondary p-2">7 M</span>
                    <span className="badge bg-secondary p-2">8 W</span>
                  </div>
                  <div className="d-flex justify-content-around">
                    <span className="badge bg-secondary p-2">9 W</span>
                    <span className="badge bg-secondary p-2">10 M</span>
                    <span className="badge bg-primary p-2">11 A</span>
                  </div>
                </div>
                <p className="text-muted smaller mt-3 mb-0">Select your preferred seat numbers matching the layout above.</p>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Booking;
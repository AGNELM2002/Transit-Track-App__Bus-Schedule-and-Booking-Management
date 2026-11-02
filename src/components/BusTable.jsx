import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Navbar, Nav, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function BusTable() {
  const [buses, setBuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // SECTION 1: Check Authentication and Load Stored Bus Data
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      alert('Unauthorized! Please log in first.');
      navigate('/login');
      return;
    }
    setCurrentUser(user);

    const storedBuses = JSON.parse(localStorage.getItem('buses')) || [];
    setBuses(storedBuses);
  }, [navigate]);

  // SECTION 2: Delete Route Handler (Admin Only)
  const handleDelete = (id) => {
    if (currentUser?.role !== 'Admin') {
      alert('Access Denied: Only Admins can delete bus routes.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this bus route?')) {
      const updatedBuses = buses.filter((bus) => bus.id !== id);
      setBuses(updatedBuses);
      localStorage.setItem('buses', JSON.stringify(updatedBuses));
    }
  };

  // SECTION 3: Edit Handler (Admin Only)
  const handleEdit = (bus) => {
    if (currentUser?.role !== 'Admin') {
      alert('Access Denied: Only Admins can edit bus routes.');
      return;
    }
    navigate('/register', { state: { bus } });
  };

  // SECTION 4: Navigate to Details Roadmap Page
  const handleViewDetails = (bus) => {
    navigate('/bus-detail', { state: { bus } });
  };

  // SECTION 5: Navigate to Booking Page with Selected Bus
  const handleBooking = (bus) => {
    navigate('/booking', { state: { bus } });
  };

  // SECTION 6: Text Highlighting Helper
  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} style={{ color: '#dc3545', fontWeight: 'bold', backgroundColor: '#ffe6e6', padding: '0 3px', borderRadius: '4px' }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // SECTION 7: Upgraded Search & Filter Logic (Search term, From, and To locations)
  const filteredBuses = buses.filter((bus) => {
    const query = searchTerm.toLowerCase();
    const matchesGeneral = 
      bus.busName.toLowerCase().includes(query) ||
      bus.departureTime.toLowerCase().includes(query) ||
      bus.arrivalTime.toLowerCase().includes(query) ||
      bus.stops.toLowerCase().includes(query);

    const matchesFrom = fromFilter ? bus.departureTime.toLowerCase().includes(fromFilter.toLowerCase()) : true;
    const matchesTo = toFilter ? bus.arrivalTime.toLowerCase().includes(toFilter.toLowerCase()) : true;

    return matchesGeneral && matchesFrom && matchesTo;
  });

  return (
    <div className="bg-light min-vh-100 pb-5 fade-in">
      {/* SECTION 8: Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-4 shadow-sm mb-4 py-3">
        <Navbar.Brand href="/" className="fw-bold text-primary">🚍 TransitTrack</Navbar.Brand>
        <Nav className="ms-auto align-items-center gap-3">
          {currentUser && (
            <span className="text-light fw-semibold small bg-secondary px-3 py-1 rounded-pill">
              {currentUser.name} ({currentUser.role})
            </span>
          )}
          <Button variant="outline-info" size="sm" className="rounded-pill px-3" onClick={() => navigate('/booking')}>🎟️ Book Seats</Button>
          <Button variant="outline-light" size="sm" className="rounded-pill px-3" onClick={() => navigate('/')}>Home</Button>
          {currentUser?.role === 'Admin' && (
            <Button variant="primary" size="sm" className="rounded-pill px-3 shadow-sm" onClick={() => navigate('/register')}>+ Add New Bus</Button>
          )}
        </Nav>
      </Navbar>

      <Container fluid className="px-4" style={{ maxWidth: '1350px' }}>
        {/* SECTION 9: Header & Upgraded Search / From / To Filters */}
        <div className="d-flex flex-column gap-3 mb-4 bg-white p-4 rounded-4 shadow-sm">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="fw-bold text-dark m-0">📋 Registered Bus Routes & Schedules</h2>
            {currentUser?.role === 'Admin' && (
              <Button variant="success" size="sm" className="rounded-pill px-3 shadow-sm" onClick={() => navigate('/register')}>
                + Register Bus
              </Button>
            )}
          </div>

          <Row className="g-3">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="🔍 Search name, stop, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-pill py-2 shadow-none border-secondary-subtle px-3"
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="📍 Filter From (Departure)..."
                value={fromFilter}
                onChange={(e) => setFromFilter(e.target.value)}
                className="rounded-pill py-2 shadow-none border-secondary-subtle px-3"
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="🏁 Filter To (Arrival)..."
                value={toFilter}
                onChange={(e) => setToFilter(e.target.value)}
                className="rounded-pill py-2 shadow-none border-secondary-subtle px-3"
              />
            </Col>
          </Row>
        </div>

        {/* SECTION 10: Table Rendering */}
        {filteredBuses.length === 0 ? (
          <div className="text-center mt-5 p-5 bg-white rounded-4 shadow-sm">
            <div className="fs-1 mb-3">📭</div>
            <p className="text-muted fs-5">No matching bus routes found.</p>
          </div>
        ) : (
          <div className="modern-table-container border">
            <Table responsive hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th style={{ width: '4%' }}>#</th>
                  <th style={{ width: '15%' }}>Bus Name</th>
                  <th style={{ width: '12%' }}>Bus Number</th>
                  <th style={{ width: '15%' }}>Departure</th>
                  <th style={{ width: '15%' }}>Arrival</th>
                  <th style={{ width: '12%' }}>Available Seats</th>
                  <th style={{ width: '17%' }}>Stops & ETAs</th>
                  <th style={{ width: '10%' }} className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuses.map((bus, index) => {
                  const total = bus.totalSeats || 40;
                  const bookedCount = bus.bookedSeats ? bus.bookedSeats.length : 0;
                  const available = total - bookedCount;

                  return (
                    <tr key={bus.id}>
                      <td className="fw-bold text-center">{index + 1}</td>
                      <td className="fw-semibold text-dark">{bus.busName}</td>
                      <td><code className="bg-light px-2 py-1 rounded text-primary fw-semibold">{bus.busNumber}</code></td>
                      <td>{bus.departureTime}</td>
                      <td>{bus.arrivalTime}</td>
                      <td>
                        <span className={`badge px-3 py-2 ${available > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {available} / {total} Seats
                        </span>
                      </td>
                      <td className="text-muted small" style={{ wordBreak: 'break-word' }}>
                        {highlightText(bus.stops, searchTerm)}
                      </td>
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-1 flex-wrap">
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-pill px-3 shadow-sm fw-semibold"
                            onClick={() => handleBooking(bus)}
                            title="Book Tickets"
                          >
                            Book
                          </Button>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="rounded-circle p-1 d-flex align-items-center justify-content-center"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => handleViewDetails(bus)}
                            title="View Roadmap"
                          >
                            👁️
                          </Button>
                          {currentUser?.role === 'Admin' && (
                            <>
                              <Button
                                variant="outline-warning"
                                size="sm"
                                className="rounded-circle p-1 d-flex align-items-center justify-content-center"
                                style={{ width: '32px', height: '32px' }}
                                onClick={() => handleEdit(bus)}
                                title="Edit"
                              >
                                ✏️
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                className="rounded-circle p-1 d-flex align-items-center justify-content-center"
                                style={{ width: '32px', height: '32px' }}
                                onClick={() => handleDelete(bus.id)}
                                title="Delete"
                              >
                                🗑️
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        )}
      </Container>
    </div>
  );
}

export default BusTable;
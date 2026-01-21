import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, logout, getMyAppointments, getMyPrescriptions } from '../services/api';
import { formatDateTime, formatDate, isWithinDays, generateRecurringAppointments, generateRecurringRefills } from '../utils/dateUtils';

function PatientDashboard() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchData();
    } else {
      // No user found, redirect to login
      navigate('/');
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsData, prescriptionsData] = await Promise.all([
        getMyAppointments(),
        getMyPrescriptions()
      ]);

      setAppointments(appointmentsData);
      setPrescriptions(prescriptionsData);
      setError('');
    } catch (err) {
      // If authentication fails, redirect to login
      if (err.message.includes('token') || err.message.includes('Authentication')) {
        logout();
        navigate('/');
      } else {
        setError(err.message || 'Failed to load data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Generate all recurring appointments and filter for next 7 days
  const upcomingAppointments = appointments
    .flatMap(apt => generateRecurringAppointments(apt, 3))
    .filter(apt => isWithinDays(apt.datetime, 7))
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  // Generate all recurring refills and filter for next 7 days
  const upcomingRefills = prescriptions
    .flatMap(rx => generateRecurringRefills(rx, 3))
    .filter(rx => isWithinDays(rx.refill_on, 7))
    .sort((a, b) => new Date(a.refill_on) - new Date(b.refill_on));

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <div className="header">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>Patient Portal</h1>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
          <div className="nav">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/appointments">All Appointments</Link>
            <Link to="/prescriptions">All Prescriptions</Link>
          </div>
        </div>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}

        <div className="card">
          <h2>Welcome, {user?.name}!</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Email: {user?.email}
          </p>
        </div>

        <h2>Your Health Summary</h2>

        <div className="grid">
          <div className="summary-card">
            <h3>Upcoming Appointments</h3>
            <div className="count">{upcomingAppointments.length}</div>
            <p>in the next 7 days</p>
          </div>

          <div className="summary-card">
            <h3>Medication Refills Due</h3>
            <div className="count">{upcomingRefills.length}</div>
            <p>in the next 7 days</p>
          </div>
        </div>

        {upcomingAppointments.length > 0 && (
          <div className="card">
            <h3>Upcoming Appointments (Next 7 Days)</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Date & Time</th>
                  <th>Repeat</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAppointments.map((apt, idx) => (
                  <tr key={idx}>
                    <td>{apt.provider}</td>
                    <td>{formatDateTime(apt.datetime)}</td>
                    <td>{apt.repeat || 'One-time'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '15px' }}>
              <Link to="/appointments" className="btn btn-primary">
                View All Appointments
              </Link>
            </div>
          </div>
        )}

        {upcomingRefills.length > 0 && (
          <div className="card">
            <h3>Medication Refills (Next 7 Days)</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Refill Date</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {upcomingRefills.map((rx, idx) => (
                  <tr key={idx}>
                    <td>{rx.medication}</td>
                    <td>{rx.dosage}</td>
                    <td>{formatDate(rx.refill_on)}</td>
                    <td>{rx.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '15px' }}>
              <Link to="/prescriptions" className="btn btn-primary">
                View All Prescriptions
              </Link>
            </div>
          </div>
        )}

        {upcomingAppointments.length === 0 && upcomingRefills.length === 0 && (
          <div className="card">
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No appointments or medication refills scheduled for the next 7 days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default PatientDashboard;

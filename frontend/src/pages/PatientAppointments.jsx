import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, logout, getMyAppointments } from '../services/api';
import { formatDateTime, isWithinThreeMonths, generateRecurringAppointments } from '../utils/dateUtils';

function PatientAppointments() {
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchAppointments();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getMyAppointments();
      setAppointments(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Generate all recurring appointments and filter for next 3 months
  const upcomingAppointments = appointments
    .flatMap(apt => generateRecurringAppointments(apt, 3))
    .filter(apt => isWithinThreeMonths(apt.datetime))
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

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
          <h2>All Upcoming Appointments</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Showing appointments for the next 3 months
          </p>

          {upcomingAppointments.length > 0 ? (
            <div style={{ marginTop: '20px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Provider</th>
                    <th>Date & Time</th>
                    <th>Repeat Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((apt, idx) => (
                    <tr key={idx}>
                      <td>{apt.provider}</td>
                      <td>{formatDateTime(apt.datetime)}</td>
                      <td>{apt.repeat ? `Repeats ${apt.repeat}` : 'One-time appointment'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No upcoming appointments scheduled.
            </p>
          )}
        </div>

        <div style={{ marginTop: '20px' }}>
          <Link to="/dashboard" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PatientAppointments;

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCurrentUser, logout, getMyPrescriptions } from '../services/api';
import { formatDate, isWithinThreeMonths, generateRecurringRefills } from '../utils/dateUtils';

function PatientPrescriptions() {
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      fetchPrescriptions();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await getMyPrescriptions();
      setPrescriptions(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Generate all recurring refills and filter for next 3 months
  const upcomingRefills = prescriptions
    .flatMap(rx => generateRecurringRefills(rx, 3))
    .filter(rx => isWithinThreeMonths(rx.refill_on))
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
          <h2>All Prescriptions & Refills</h2>
          <p style={{ color: '#666', marginTop: '5px' }}>
            Showing prescription refills for the next 3 months
          </p>

          {upcomingRefills.length > 0 ? (
            <div style={{ marginTop: '20px' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Quantity</th>
                    <th>Refill Date</th>
                    <th>Refill Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingRefills.map((rx, idx) => (
                    <tr key={idx}>
                      <td>{rx.medication}</td>
                      <td>{rx.dosage}</td>
                      <td>{rx.quantity}</td>
                      <td>{formatDate(rx.refill_on)}</td>
                      <td>{rx.refill_schedule ? `Refills ${rx.refill_schedule}` : 'One-time'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No prescriptions or refills scheduled.
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

export default PatientPrescriptions;

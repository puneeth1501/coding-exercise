import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getUserById,
  updateUser,
  getUserAppointments,
  getUserPrescriptions,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  createPrescription,
  updatePrescription,
  deletePrescription,
  getMedications,
  getDosages
} from '../services/api';
import { formatDateTime, formatDate, toInputDateTime, toInputDate } from '../utils/dateUtils';

function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]);
  const [dosages, setDosages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showEditUser, setShowEditUser] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Forms
  const [userForm, setUserForm] = useState({ name: '', email: '' });
  const [appointmentForm, setAppointmentForm] = useState({
    id: null,
    provider: '',
    datetime: '',
    repeat: '',
    end_date: ''
  });
  const [prescriptionForm, setPrescriptionForm] = useState({
    id: null,
    medication: '',
    dosage: '',
    quantity: '',
    refill_on: '',
    refill_schedule: 'monthly'
  });

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userData, appointmentsData, prescriptionsData, medsData, dosagesData] = await Promise.all([
        getUserById(id),
        getUserAppointments(id),
        getUserPrescriptions(id),
        getMedications(),
        getDosages()
      ]);

      setUser(userData);
      setUserForm({ name: userData.name, email: userData.email });
      setAppointments(appointmentsData);
      setPrescriptions(prescriptionsData);
      setMedications(medsData);
      setDosages(dosagesData);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // User Management
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      await updateUser(id, userForm);
      setFormSuccess('Patient updated successfully!');
      setTimeout(() => {
        setShowEditUser(false);
        setFormSuccess('');
        fetchData();
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to update patient');
    }
  };

  // Appointment Management
  const openAppointmentModal = (appointment = null) => {
    if (appointment) {
      setAppointmentForm({
        id: appointment._id,
        provider: appointment.provider,
        datetime: toInputDateTime(appointment.datetime),
        repeat: appointment.repeat || '',
        end_date: appointment.end_date ? toInputDate(appointment.end_date) : ''
      });
    } else {
      setAppointmentForm({
        id: null,
        provider: '',
        datetime: '',
        repeat: '',
        end_date: ''
      });
    }
    setFormError('');
    setFormSuccess('');
    setShowAppointmentModal(true);
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      const data = {
        user_id: id,
        provider: appointmentForm.provider,
        datetime: new Date(appointmentForm.datetime).toISOString(),
        repeat: appointmentForm.repeat || null,
        end_date: appointmentForm.end_date || null
      };

      if (appointmentForm.id) {
        await updateAppointment(appointmentForm.id, data);
        setFormSuccess('Appointment updated successfully!');
      } else {
        await createAppointment(data);
        setFormSuccess('Appointment created successfully!');
      }

      setTimeout(() => {
        setShowAppointmentModal(false);
        setFormSuccess('');
        fetchData();
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to save appointment');
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      await deleteAppointment(appointmentId);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete appointment');
    }
  };

  // Prescription Management
  const openPrescriptionModal = (prescription = null) => {
    if (prescription) {
      setPrescriptionForm({
        id: prescription._id,
        medication: prescription.medication,
        dosage: prescription.dosage,
        quantity: prescription.quantity,
        refill_on: toInputDate(prescription.refill_on),
        refill_schedule: prescription.refill_schedule
      });
    } else {
      setPrescriptionForm({
        id: null,
        medication: '',
        dosage: '',
        quantity: '',
        refill_on: '',
        refill_schedule: 'monthly'
      });
    }
    setFormError('');
    setFormSuccess('');
    setShowPrescriptionModal(true);
  };

  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    try {
      const data = {
        user_id: id,
        medication: prescriptionForm.medication,
        dosage: prescriptionForm.dosage,
        quantity: parseInt(prescriptionForm.quantity),
        refill_on: prescriptionForm.refill_on,
        refill_schedule: prescriptionForm.refill_schedule
      };

      if (prescriptionForm.id) {
        await updatePrescription(prescriptionForm.id, data);
        setFormSuccess('Prescription updated successfully!');
      } else {
        await createPrescription(data);
        setFormSuccess('Prescription created successfully!');
      }

      setTimeout(() => {
        setShowPrescriptionModal(false);
        setFormSuccess('');
        fetchData();
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to save prescription');
    }
  };

  const handleDeletePrescription = async (prescriptionId) => {
    if (!window.confirm('Are you sure you want to delete this prescription?')) {
      return;
    }

    try {
      await deletePrescription(prescriptionId);
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to delete prescription');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container">
        <div className="error">Patient not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <div className="container">
          <h1>Patient Record</h1>
          <button onClick={() => navigate('/admin')} className="btn btn-secondary" style={{ marginTop: '10px' }}>
            Back to Admin Dashboard
          </button>
        </div>
      </div>

      <div className="container">
        {error && <div className="error">{error}</div>}

        {/* Patient Info */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2>{user.name}</h2>
              <p style={{ color: '#666', marginTop: '5px' }}>
                Email: {user.email}<br />
                Patient ID: {user._id}<br />
                Created: {formatDate(user.created_at)}
              </p>
            </div>
            <button onClick={() => setShowEditUser(true)} className="btn btn-primary">
              Edit Patient Info
            </button>
          </div>
        </div>

        {/* Appointments */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Appointments</h3>
            <button onClick={() => openAppointmentModal()} className="btn btn-success">
              + Add Appointment
            </button>
          </div>

          {appointments.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Date & Time</th>
                  <th>Repeat</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td>{apt.provider}</td>
                    <td>{formatDateTime(apt.datetime)}</td>
                    <td>{apt.repeat || 'One-time'}</td>
                    <td>{apt.end_date ? formatDate(apt.end_date) : 'N/A'}</td>
                    <td>
                      <button
                        onClick={() => openAppointmentModal(apt)}
                        className="btn btn-primary"
                        style={{ marginRight: '5px', padding: '5px 10px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(apt._id)}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No appointments scheduled.
            </p>
          )}
        </div>

        {/* Prescriptions */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3>Prescriptions</h3>
            <button onClick={() => openPrescriptionModal()} className="btn btn-success">
              + Add Prescription
            </button>
          </div>

          {prescriptions.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Quantity</th>
                  <th>Refill Date</th>
                  <th>Schedule</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((rx) => (
                  <tr key={rx._id}>
                    <td>{rx.medication}</td>
                    <td>{rx.dosage}</td>
                    <td>{rx.quantity}</td>
                    <td>{formatDate(rx.refill_on)}</td>
                    <td>{rx.refill_schedule}</td>
                    <td>
                      <button
                        onClick={() => openPrescriptionModal(rx)}
                        className="btn btn-primary"
                        style={{ marginRight: '5px', padding: '5px 10px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePrescription(rx._id)}
                        className="btn btn-danger"
                        style={{ padding: '5px 10px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
              No prescriptions on file.
            </p>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditUser && (
        <div className="modal" onClick={() => setShowEditUser(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Patient Information</h2>
              <button className="close-btn" onClick={() => setShowEditUser(false)}>×</button>
            </div>

            {formError && <div className="error">{formError}</div>}
            {formSuccess && <div className="success">{formSuccess}</div>}

            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowEditUser(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <div className="modal" onClick={() => setShowAppointmentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{appointmentForm.id ? 'Edit Appointment' : 'New Appointment'}</h2>
              <button className="close-btn" onClick={() => setShowAppointmentModal(false)}>×</button>
            </div>

            {formError && <div className="error">{formError}</div>}
            {formSuccess && <div className="success">{formSuccess}</div>}

            <form onSubmit={handleAppointmentSubmit}>
              <div className="form-group">
                <label>Provider Name *</label>
                <input
                  type="text"
                  value={appointmentForm.provider}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, provider: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date & Time *</label>
                <input
                  type="datetime-local"
                  value={appointmentForm.datetime}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, datetime: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Repeat Schedule</label>
                <select
                  value={appointmentForm.repeat}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, repeat: e.target.value })}
                >
                  <option value="">One-time appointment</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {appointmentForm.repeat && (
                <div className="form-group">
                  <label>End Date (Optional)</label>
                  <input
                    type="date"
                    value={appointmentForm.end_date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, end_date: e.target.value })}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAppointmentModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {appointmentForm.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <div className="modal" onClick={() => setShowPrescriptionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{prescriptionForm.id ? 'Edit Prescription' : 'New Prescription'}</h2>
              <button className="close-btn" onClick={() => setShowPrescriptionModal(false)}>×</button>
            </div>

            {formError && <div className="error">{formError}</div>}
            {formSuccess && <div className="success">{formSuccess}</div>}

            <form onSubmit={handlePrescriptionSubmit}>
              <div className="form-group">
                <label>Medication *</label>
                <select
                  value={prescriptionForm.medication}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, medication: e.target.value })}
                  required
                >
                  <option value="">Select medication</option>
                  {medications.map((med) => (
                    <option key={med._id} value={med.name}>
                      {med.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Dosage *</label>
                <select
                  value={prescriptionForm.dosage}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, dosage: e.target.value })}
                  required
                >
                  <option value="">Select dosage</option>
                  {dosages.map((dose) => (
                    <option key={dose._id} value={dose.value}>
                      {dose.value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={prescriptionForm.quantity}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Refill Date *</label>
                <input
                  type="date"
                  value={prescriptionForm.refill_on}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, refill_on: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Refill Schedule *</label>
                <select
                  value={prescriptionForm.refill_schedule}
                  onChange={(e) => setPrescriptionForm({ ...prescriptionForm, refill_schedule: e.target.value })}
                  required
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowPrescriptionModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  {prescriptionForm.id ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDetail;

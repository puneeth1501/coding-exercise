import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/api';

// Patient Portal Pages
import Login from './pages/Login';
import PatientDashboard from './pages/PatientDashboard';
import PatientAppointments from './pages/PatientAppointments';
import PatientPrescriptions from './pages/PatientPrescriptions';

// Admin EMR Pages
import AdminDashboard from './pages/AdminDashboard';
import PatientDetail from './pages/PatientDetail';

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Patient Portal Routes */}
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <PatientAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute>
              <PatientPrescriptions />
            </ProtectedRoute>
          }
        />

        {/* Admin EMR Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/patient/:id" element={<PatientDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

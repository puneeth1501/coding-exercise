// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getAllUsers, createUser } from '../services/api';
// import { formatDate } from '../utils/dateUtils';

// function AdminDashboard() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });
//   const [createError, setCreateError] = useState('');
//   const [createSuccess, setCreateSuccess] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllUsers();
//       setUsers(data);
//       setError('');
//     } catch (err) {
//       setError(err.message || 'Failed to load users');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRowClick = (userId) => {
//     navigate(`/admin/patient/${userId}`);
//   };

//   const handleCreateUser = async (e) => {
//     e.preventDefault();
//     setCreateError('');
//     setCreateSuccess('');

//     try {
//       await createUser(formData);
//       setCreateSuccess('Patient created successfully!');
//       setFormData({ name: '', email: '', password: '' });
//       setTimeout(() => {
//         setShowCreateModal(false);
//         setCreateSuccess('');
//         fetchUsers();
//       }, 1500);
//     } catch (err) {
//       setCreateError(err.message || 'Failed to create patient');
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div>
//       <div className="header">
//         <div className="container">
//           <h1>Mini EMR - Admin Dashboard</h1>
//           <p style={{ margin: '10px 0 0 0' }}>
//             <a href="/" style={{ color: 'white', textDecoration: 'none' }}>
//               Go to Patient Portal
//             </a>
//           </p>
//         </div>
//       </div>

//       <div className="container">
//         {error && <div className="error">{error}</div>}

//         <div className="card">
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
//             <h2>All Patients</h2>
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="btn btn-success"
//             >
//               + Create New Patient
//             </button>
//           </div>

//           {users.length > 0 ? (
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Created Date</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id} onClick={() => handleRowClick(user.id)}>
//                     <td>{user.id}</td>
//                     <td>{user.name}</td>
//                     <td>{user.email}</td>
//                     <td>{formatDate(user.created_at)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
//               No patients in the system.
//             </p>
//           )}
//         </div>
//       </div>

//       {showCreateModal && (
//         <div className="modal" onClick={() => setShowCreateModal(false)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>Create New Patient</h2>
//               <button
//                 className="close-btn"
//                 onClick={() => setShowCreateModal(false)}
//               >
//                 ×
//               </button>
//             </div>

//             {createError && <div className="error">{createError}</div>}
//             {createSuccess && <div className="success">{createSuccess}</div>}

//             <form onSubmit={handleCreateUser}>
//               <div className="form-group">
//                 <label htmlFor="name">Full Name *</label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email">Email *</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="password">Password *</label>
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   required
//                   minLength="6"
//                 />
//               </div>

//               <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowCreateModal(false)}
//                   className="btn btn-secondary"
//                 >
//                   Cancel
//                 </button>
//                 <button type="submit" className="btn btn-success">
//                   Create Patient
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, createUser } from '../services/api';
import { formatDate } from '../utils/dateUtils';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (userId) => {
    if (!userId) return;
    navigate(`/admin/patient/${userId}`);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    try {
      await createUser(formData);
      setCreateSuccess('Patient created successfully!');
      setFormData({ name: '', email: '', password: '' });

      setTimeout(() => {
        setShowCreateModal(false);
        setCreateSuccess('');
        fetchUsers();
      }, 1500);
    } catch (err) {
      setCreateError(err.message || 'Failed to create patient');
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="header">
        <div className="container">
          <h1>Mini EMR - Admin Dashboard</h1>
          <p style={{ margin: '10px 0 0 0' }}>
            <a href="/" style={{ color: 'white', textDecoration: 'none' }}>
              Go to Patient Portal
            </a>
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="container">
        {error && <div className="error">{error}</div>}

        <div className="card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <h2>All Patients</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-success"
            >
              + Create New Patient
            </button>
          </div>

          {users.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    onClick={() => handleRowClick(user._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              No patients in the system.
            </p>
          )}
        </div>
      </div>

      {/* CREATE PATIENT MODAL */}
      {showCreateModal && (
        <div className="modal" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Patient</h2>
              <button
                className="close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>

            {createError && <div className="error">{createError}</div>}
            {createSuccess && <div className="success">{createSuccess}</div>}

            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'flex-end'
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-success">
                  Create Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;


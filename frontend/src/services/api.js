const API_BASE_URL = 'https://mini-emr-backend-2zwz.onrender.com/api';

// Helper function to handle API requests
const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'An error occurred');
  }

  return response.json();
};

// Auth API
export const login = async (email, password) => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Users API
export const getAllUsers = () => apiRequest('/users');
export const getUserById = (id) => apiRequest(`/users/${id}`);
export const createUser = (userData) => apiRequest('/users', {
  method: 'POST',
  body: JSON.stringify(userData),
});
export const updateUser = (id, userData) => apiRequest(`/users/${id}`, {
  method: 'PUT',
  body: JSON.stringify(userData),
});
export const getMe = () => apiRequest('/users/me');

// Medications and Dosages
export const getMedications = () => apiRequest('/users/medications');
export const getDosages = () => apiRequest('/users/dosages');

// Appointments API
export const getUserAppointments = (userId) => apiRequest(`/appointments/user/${userId}`);
export const getMyAppointments = () => apiRequest('/appointments/my-appointments');
export const getAppointmentById = (id) => apiRequest(`/appointments/${id}`);
export const createAppointment = (appointmentData) => apiRequest('/appointments', {
  method: 'POST',
  body: JSON.stringify(appointmentData),
});
export const updateAppointment = (id, appointmentData) => apiRequest(`/appointments/${id}`, {
  method: 'PUT',
  body: JSON.stringify(appointmentData),
});
export const deleteAppointment = (id) => apiRequest(`/appointments/${id}`, {
  method: 'DELETE',
});

// Prescriptions API
export const getUserPrescriptions = (userId) => apiRequest(`/prescriptions/user/${userId}`);
export const getMyPrescriptions = () => apiRequest('/prescriptions/my-prescriptions');
export const getPrescriptionById = (id) => apiRequest(`/prescriptions/${id}`);
export const createPrescription = (prescriptionData) => apiRequest('/prescriptions', {
  method: 'POST',
  body: JSON.stringify(prescriptionData),
});
export const updatePrescription = (id, prescriptionData) => apiRequest(`/prescriptions/${id}`, {
  method: 'PUT',
  body: JSON.stringify(prescriptionData),
});
export const deletePrescription = (id) => apiRequest(`/prescriptions/${id}`, {
  method: 'DELETE',
});

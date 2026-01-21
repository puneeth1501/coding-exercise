# Mini EMR & Patient Portal

A full-stack web application featuring a mini Electronic Medical Record (EMR) system for administrators and a Patient Portal for patients to view their medical information.

This application was built as a coding exercise to demonstrate full-stack development skills with React, Node.js, Express, and MongoDB Atlas.

## Quick Start

To run this application locally:

```bash
# 1. Clone the repository
git clone <repository-url>
cd mini-emr-app

# 2. Install and run backend
cd backend
npm install
npm run seed    # Seeds MongoDB with sample data
npm run dev     # Starts backend on port 5001

# 3. In a new terminal, install and run frontend
cd frontend
npm install
npm run dev     # Starts frontend on port 3000

# 4. Access the application
# Patient Portal: http://localhost:3000
# Admin EMR: http://localhost:3000/admin

# 5. Test credentials
# Email: mark@some-email-provider.net
# Password: Password123!
```

## Features

### Patient Portal (/)
- **Login System**: Secure authentication for patients
- **Dashboard**: Summary view showing:
  - Upcoming appointments in the next 7 days
  - Medication refills due in the next 7 days
  - Basic patient information
- **Appointments View**: Full schedule of upcoming appointments (3 months)
- **Prescriptions View**: Complete list of medications and refill schedules (3 months)
- **Recurring Appointments**: Supports weekly and monthly recurring appointments
- **Recurring Refills**: Supports weekly and monthly prescription refills

### Admin EMR (/admin)
- **Patient Management**:
  - View all patients in a table
  - Create new patients with email and password
  - Update patient information
- **Appointment Management** (CRUD):
  - Schedule appointments with providers
  - Set recurring appointments (weekly/monthly)
  - Set end dates for recurring appointments
  - Update and delete appointments
- **Prescription Management** (CRUD):
  - Prescribe medications from a predefined list
  - Set dosages, quantities, and refill schedules
  - Update and delete prescriptions
- **No Authentication Required**: Admin interface accessible without login (as per requirements)

## Tech Stack

### Frontend
- React 18
- React Router v6
- Vite (build tool)
- CSS (vanilla)

### Backend
- Node.js
- Express
- MongoDB Atlas (cloud database)
- Mongoose (ODM)
- bcrypt (password hashing)
- JWT (authentication)
- CORS
- dotenv (environment variables)

## Project Structure

```
mini-emr-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # MongoDB connection configuration
│   │   │   └── seed.js          # MongoDB seeding script
│   │   ├── models/
│   │   │   ├── User.js          # Mongoose User schema
│   │   │   ├── Appointment.js   # Mongoose Appointment schema
│   │   │   ├── Prescription.js  # Mongoose Prescription schema
│   │   │   ├── Medication.js    # Mongoose Medication schema
│   │   │   └── Dosage.js        # Mongoose Dosage schema
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── usersController.js
│   │   │   ├── appointmentsController.js
│   │   │   └── prescriptionsController.js
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT authentication middleware
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── usersRoutes.js
│   │       ├── appointmentsRoutes.js
│   │       └── prescriptionsRoutes.js
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env                     # Environment variables (MongoDB URI, JWT secret)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── PatientAppointments.jsx
│   │   │   ├── PatientPrescriptions.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── PatientDetail.jsx
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── utils/
│   │   │   └── dateUtils.js     # Date formatting and calculations
│   │   ├── App.jsx              # Main app with routing
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v20.x or higher)
- npm or yarn

### Fix npm Cache Issue (If Encountered)

If you encounter npm cache permission errors, run:

```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Create a `.env` file in the backend directory with:
```
PORT=5001
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb+srv://anantha:Puneeth1501@cluster0.qtcwnmz.mongodb.net/mini-emr?retryWrites=true&w=majority
```

Note: The MongoDB Atlas connection string is pre-configured. For production, use your own MongoDB instance.

4. Seed the database with sample data:
```bash
npm run seed
```

This will connect to MongoDB Atlas and create:
- 2 sample patients (Mark Johnson and Lisa Smith)
- Their appointments and prescriptions
- List of medications and dosages

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

If you encounter npm cache issues, try:
```bash
npm install --force
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Test Credentials

### Patient Login
Use these credentials to test the Patient Portal:

**Patient 1:**
- Email: `mark@some-email-provider.net`
- Password: `Password123!`

**Patient 2:**
- Email: `lisa@some-email-provider.net`
- Password: `Password123!`

### Admin EMR
Access the Admin EMR at `http://localhost:3000/admin` - no login required.

## API Endpoints



### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `GET /api/users/me` - Get current user (Protected)
- `POST /api/users` - Create new user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `GET /api/users/medications` - Get medications list
- `GET /api/users/dosages` - Get dosages list

### Appointments
- `GET /api/appointments/user/:userId` - Get user appointments (Admin)
- `GET /api/appointments/my-appointments` - Get current user appointments (Protected)
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create appointment (Admin)
- `PUT /api/appointments/:id` - Update appointment (Admin)
- `DELETE /api/appointments/:id` - Delete appointment (Admin)

### Prescriptions
- `GET /api/prescriptions/user/:userId` - Get user prescriptions (Admin)
- `GET /api/prescriptions/my-prescriptions` - Get current user prescriptions (Protected)
- `GET /api/prescriptions/:id` - Get single prescription
- `POST /api/prescriptions` - Create prescription (Admin)
- `PUT /api/prescriptions/:id` - Update prescription (Admin)
- `DELETE /api/prescriptions/:id` - Delete prescription (Admin)

## Deployment

### Backend Deployment (Render, Railway, or Heroku)

The application uses MongoDB Atlas, which provides cloud-based persistent storage. No additional database setup is required for deployment.

#### Prerequisites:
1. MongoDB Atlas cluster is already configured and accessible
2. Backend requires environment variables: `PORT`, `JWT_SECRET`, `MONGODB_URI`

#### Deployment

**Render**
1. Connect your GitHub repository
2. Select "Web Service"
3. Set configuration:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables:
     - `PORT=5001`
     - `JWT_SECRET=puneeth`
     - `MONGODB_URI=mongodb+srv://anantha:Puneeth1501@cluster0.qtcwnmz.mongodb.net/mini-emr?retryWrites=true&w=majority`
4. Deploy
5. Run seed command once: `npm run seed` (via Render shell or manually)


### Frontend Deployment (Vercel or Netlify)

1. Update API base URL in `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

2. Build the frontend:
```bash
npm run build
```

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Environment Variables

**Backend (.env):**
```
PORT=5001
JWT_SECRET=puneeth
MONGODB_URI=mongodb+srv://anantha:Puneeth1501@cluster0.qtcwnmz.mongodb.net/mini-emr?retryWrites=true&w=majority
```

**Frontend:**
Update `API_BASE_URL` in `src/services/api.js` to point to your deployed backend (default: `http://localhost:5001/api`).

## Database Schema (MongoDB)

### Users Collection
- `_id` - ObjectId (MongoDB generated)
- `name` - String (required)
- `email` - String (required, unique)
- `password` - String (required, bcrypt hashed)
- `created_at` - Date (default: current date)

### Appointments Collection
- `_id` - ObjectId (MongoDB generated)
- `user_id` - ObjectId (references Users)
- `provider` - String (required)
- `datetime` - Date (required, ISO format)
- `repeat` - String (weekly/monthly/null)
- `end_date` - Date (optional)
- `created_at` - Date (default: current date)

### Prescriptions Collection
- `_id` - ObjectId (MongoDB generated)
- `user_id` - ObjectId (references Users)
- `medication` - String (required)
- `dosage` - String (required)
- `quantity` - Number (required)
- `refill_on` - Date (required)
- `refill_schedule` - String (required: weekly/monthly)
- `created_at` - Date (default: current date)

### Medications Collection
- `_id` - ObjectId (MongoDB generated)
- `name` - String (unique)

### Dosages Collection
- `_id` - ObjectId (MongoDB generated)
- `value` - String (unique)

## Development

### Running Tests
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Building for Production
```bash
# Frontend
cd frontend
npm run build
```

## Features Implemented

- Full CRUD operations for patients, appointments, and prescriptions
- Secure authentication with JWT tokens
- Password hashing with bcrypt
- Recurring appointments and refills with weekly/monthly schedules
- 7-day summary view for patients
- 3-month detailed view for appointments and prescriptions
- Responsive design
- Modal dialogs for create/edit operations
- Form validation
- Error handling
- MongoDB Atlas cloud database integration
- ObjectId validation for MongoDB compatibility

## Development Journey & Issues Resolved

This section documents the key challenges encountered during development and their solutions.

### Issue 1: npm Cache Permission Errors
**Problem:** During frontend dependency installation, encountered `EACCES: permission denied` errors.

**Error Message:**
```
npm error errno -13
npm error EACCES: permission denied, rename '/Users/puneethchowdary/.npm/_cacache/tmp/...'
```

**Solution:**
- Used `npm install --cache /tmp/.npm-cache` to bypass the corrupted cache
- Alternative solution: `sudo chown -R $(whoami) ~/.npm && npm cache clean --force`

### Issue 2: Port 5000 Already in Use
**Problem:** Backend server couldn't start because port 5000 was occupied by macOS ControlCenter process.

**Detection:** Used `lsof -i :5000` to identify the process using the port.

**Solution:**
- Changed backend port from 5000 to 5001 in `.env`
- Updated frontend `api.js` to use `http://localhost:5001/api`
- Updated frontend `vite.config.js` proxy target to `http://localhost:5001`

### Issue 3: Infinite Loading Screen / Redirect Loop
**Problem:** Patient portal showed loading screen and redirected to `/dashboard` even without login.

**Root Cause:** PatientDashboard component didn't handle the case when `getCurrentUser()` returns null.

**Solution:**
Added redirect logic in `PatientDashboard.jsx`:
```javascript
useEffect(() => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    setUser(currentUser);
    fetchData();
  } else {
    navigate('/');
  }
}, [navigate]);
```

Applied same fix to PatientAppointments and PatientPrescriptions pages.

**Files Modified:**
- `src/pages/PatientDashboard.jsx:15-23`
- `src/pages/PatientAppointments.jsx:15-23`
- `src/pages/PatientPrescriptions.jsx:15-23`

### Issue 4: ERR_FILE_NOT_FOUND for Favicon
**Problem:** Browser console showed "Failed to load resource: net::ERR_FILE_NOT_FOUND" for favicon.

**Solution:**
- Created `/frontend/public/favicon.svg` with application icon
- Added link tag in `index.html`: `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />`

### Issue 5: Database Migration from SQLite to MongoDB
**Problem:** Initial implementation used SQLite, but production deployment required a cloud database solution.

**Decision:** Migrated to MongoDB Atlas for cloud-based persistent storage.

**Migration Steps:**
1. Installed mongoose: `npm install mongoose`
2. Created Mongoose models for all entities (User, Appointment, Prescription, Medication, Dosage)
3. Updated `database.js` to connect to MongoDB Atlas
4. Rewrote all controllers to use Mongoose methods instead of SQLite queries
5. Created new seed script for MongoDB
6. Updated `.env` with MongoDB connection string

**Key Changes:**
- ID format changed from integer (1, 2, 3) to ObjectId (24-character hex strings)
- Relationships now use ObjectId references instead of foreign keys
- Queries updated from SQL to Mongoose methods

### Issue 6: 500 Internal Server Error - MongoDB ObjectId Casting
**Problem:** Multiple 500 errors when accessing patient data via `/api/users/1`, `/api/appointments/user/1`, `/api/prescriptions/user/1`.

**Root Cause:** Application was trying to access user ID "1" (SQLite integer format) but MongoDB requires 24-character hexadecimal ObjectIds like "6970cce4aa168bec521fa6de".

**Error Details:**
```
CastError: Cast to ObjectId failed for value "1" (type string) at path "_id" for model "User"
BSONError: input must be a 24 character hex string, 12 byte Uint8Array, or an integer
```

**Solution:**
Added ObjectId validation in controllers to return 400 Bad Request instead of 500 error:

```javascript
// Example from usersController.js
export const getUserById = async (req, res) => {
  try {
    // Validate if ID is a valid MongoDB ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }
    const user = await User.findById(req.params.id, 'name email created_at');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Database error' });
  }
};
```

**Files Modified:**
- `src/controllers/usersController.js:18-36`
- `src/controllers/appointmentsController.js:4-17`
- `src/controllers/prescriptionsController.js:4-17`

**User Instruction:** Use the new MongoDB patients created via the admin dashboard at `/admin` instead of old SQLite patient IDs. The seeded patients have ObjectIds like:
- Mark Johnson: `6970cce4aa168bec521fa6de`
- Lisa Smith: `6970cce4aa168bec521fa6e8`

## Known Limitations & Notes

1. **MongoDB ObjectIds Required:** Patient IDs must be valid 24-character hexadecimal strings. Integer IDs from previous SQLite implementation will not work.

2. **Admin Authentication:** The admin interface at `/admin` has no authentication as per initial requirements. In production, add proper authentication.

3. **MongoDB Atlas Connection:** The application uses a shared MongoDB Atlas cluster. For production, create your own MongoDB instance with proper security.

4. **CORS Configuration:** Currently allows all origins. Configure appropriately for production deployment.

5. **JWT Secret:** Change the JWT_SECRET in production to a strong, randomly generated value.

## Future Enhancements

- Add authentication to Admin EMR
- Implement appointment reminders
- Add prescription refill requests
- Include medical history and notes
- Add search and filtering capabilities
- Implement pagination for large datasets
- Add file uploads for medical documents
- Include appointment cancellation feature
- Add email notifications

## Conversation Summary & Development History

This application was developed through an iterative process with the following key milestones:

### Phase 1: Initial Setup (SQLite)
- Received detailed requirements for a mini-EMR and Patient Portal
- Set up monorepo structure with separate backend and frontend directories
- Chose React with Vite for frontend, Node.js/Express for backend
- Initially implemented with SQLite database for rapid development
- Created all models, controllers, routes, and frontend pages
- Implemented JWT authentication and CRUD operations

### Phase 2: Troubleshooting & Fixes
1. **npm Cache Issues:** Resolved permission errors during dependency installation
2. **Port Conflicts:** Changed from port 5000 to 5001 due to macOS ControlCenter
3. **Redirect Loop:** Fixed infinite loading screen by adding proper null checks in dashboard components
4. **Missing Favicon:** Added SVG favicon to eliminate console errors

### Phase 3: MongoDB Migration
- User requested MongoDB for production deployment with persistent storage
- Provided MongoDB Atlas credentials: `mongodb+srv://anantha:Puneeth1501@cluster0.qtcwnmz.mongodb.net/`
- Migrated entire application from SQLite to MongoDB Atlas:
  - Installed Mongoose
  - Created all Mongoose schemas
  - Rewrote all controllers to use Mongoose methods
  - Updated database configuration
  - Created new MongoDB-compatible seed script
- Successfully seeded MongoDB with sample data

### Phase 4: ObjectId Validation
- Discovered 500 errors when accessing patient data with old integer IDs
- Root cause: MongoDB requires 24-character hex ObjectIds, not integer IDs
- Added regex validation in controllers: `^[0-9a-fA-F]{24}$`
- Returns 400 Bad Request for invalid ID formats instead of 500 errors
- Updated three controllers: users, appointments, prescriptions

### Current Status
- Application fully functional with MongoDB Atlas
- Backend running on port 5001
- Frontend running on port 3000
- Database seeded with 2 test patients
- All CRUD operations working correctly
- ObjectId validation in place
- Ready for deployment

### Key Decisions Made
1. **React over NextJS:** Simpler setup, better suited for this application size
2. **Vite over Create React App:** Faster build times, modern tooling
3. **MongoDB over SQLite:** Required for cloud deployment with persistent storage
4. **Port 5001 over 5000:** Avoided conflict with macOS system services
5. **ObjectId Validation:** Improved error handling and user experience

### Lessons Learned
1. MongoDB ObjectIds require special handling compared to integer IDs
2. Always validate ID formats at the API level for better error messages
3. macOS port 5000 is commonly occupied by ControlCenter
4. Frontend null checks are critical for authentication flows
5. Cloud databases (MongoDB Atlas) provide better deployment options than file-based databases

## License

This project is created as a coding exercise.

## Contact

For questions or issues, please contact the development team.

---

**Last Updated:** 2026-01-21
**MongoDB Cluster:** cluster0.qtcwnmz.mongodb.net
**Database:** mini-emr
**Backend Port:** 5001
**Frontend Port:** 3000

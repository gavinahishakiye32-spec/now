SwiftWheel Fleet Management System (FMS)

Project Overview
A web-based Fleet Management System for SwiftWheel transportation and logistics company in Kigali City, Rwanda. The system manages vehicle operations, trips, and maintenance records efficiently.

Technology Stack

- Frontend: React.js + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: Session-based (express-session + connect-mongo)
- Password Encryption: bcryptjs

Default Credentials

- Username: admin
- Password: Admin@1234

Features

1.  Vehicle Management

- Add new vehicles (Name, Plate Number, Model, Fuel Type, Capacity)
- View all registered vehicles in a table

2.  Trip Management

- Record trip details (Vehicle, Driver, Date, Destination, Fuel Consumed, Trip Cost)
- View all trips with vehicle information

3.  Maintenance Management

- Add maintenance records (Vehicle, Service Type, Cost, Date, Status)
- Edit existing maintenance records
- Delete maintenance records
- View all maintenance records

4.  Reports

- Daily Trip Report: Shows all trips for selected date with totals (fuel & cost)
- Daily Fleet Status Report: Shows vehicle name, fuel consumed, maintenance status, and availability
  API Endpoints

Auth

- POST /api/auth/login - Login with username/password
- POST /api/auth/logout - Logout and destroy session
- GET /api/auth/me - Check if user is logged in

Vehicles

- GET /api/vehicles - Get all vehicles (requires auth)
- POST /api/vehicles- Create new vehicle (requires auth)

Trips

- GET /api/trips - Get all trips (requires auth)
- GET /api/trips/report/daily - Get daily trip report (requires auth)
- POST /api/trips - Create new trip (requires auth)

Maintenance

- GET /api/maintenance - Get all maintenance records (requires auth)
- GET /api/maintenance/:id` - Get single record (requires auth)
- POST /api/maintenance - Create maintenance record (requires auth)
- PUT /api/maintenance/:id - Update maintenance record (requires auth)
- DELETE /api/maintenance/:id - Delete maintenance record (requires auth)

Reports

- GET /api/reports/daily-trips - Daily trip report
- GET /api/reports/fleet-status - Daily fleet status report

How to Run

3. Run seed to create admin user: node seed.js
4. Start backend: npm start
5. Start frontend: npm run dev`

Access

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

Notes

- All forms use Insert operation (create new records)
- Maintenance form uses Delete, Update, and Retrieve operations
- Password is encrypted using bcrypt before storing in database
- Session-based authentication with MongoDB store for persistence

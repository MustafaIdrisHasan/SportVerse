# 🏎️ RaceScope - Motor Racing Aggregator Platform

RaceScope is a comprehensive full-stack web application for motor racing enthusiasts to track, plan, and watch races from Formula 1, MotoGP, Le Mans, and other major racing series.

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Registration & Login** with email validation and strong password requirements
- **JWT-based authentication** with token expiry and auto-refresh
- **Protected routes** and user session management
- **User profile management** with preferences

### 🏁 Race Management
- **Multi-series support**: Formula 1, MotoGP, Le Mans, WEC, IndyCar, NASCAR
- **Comprehensive race information**: schedules, circuits, weather, drivers
- **Real-time countdown** to race start times
- **Watch links** by country and broadcaster
- **Series-specific styling** with color-coded badges

### 📱 User Features
- **Favorites system** - save your preferred races
- **Reminder system** - get notifications for upcoming races
- **Interactive dashboard** with personalized content
- **Schedule planner** with calendar view
- **Race details pages** with full information

### 🎨 UI/UX
- **Dark mode by default** with professional racing theme
- **Responsive design** for all screen sizes
- **Modern UI components** with Tailwind CSS
- **Smooth animations** and transitions
- **Racing-themed typography** with Orbitron font

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API communication
- **React Icons** for iconography

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** database
- **JWT** for authentication
- **bcrypt** for password hashing
- **Helmet** for security
- **CORS** for cross-origin requests
- **Rate limiting** for API protection

## 📁 Project Structure

```
racescope/
├── frontend/                 # React TypeScript application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Basic UI components (Button, Input, Card)
│   │   │   ├── layout/      # Layout components (Header, Layout)
│   │   │   └── race/        # Race-specific components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Zustand stores
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript interfaces
│   │   └── hooks/           # Custom React hooks
│   ├── public/
│   └── package.json
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   └── types/           # TypeScript interfaces
│   └── package.json
├── database/                 # Database scripts and seeds
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (v12 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/racescope.git
cd racescope
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your database credentials

# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Start the development server
npm start
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb racescope

# Run migrations (when implemented)
npm run migrate
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=racescope
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=RaceScope
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Races
- `GET /api/races` - Get all races
- `GET /api/races/upcoming` - Get upcoming races
- `GET /api/races/:id` - Get race by ID
- `GET /api/races/series/:seriesId` - Get races by series

### User Preferences
- `POST /api/user/favorites` - Add race to favorites
- `DELETE /api/user/favorites/:raceId` - Remove from favorites
- `POST /api/user/reminders` - Add race reminder
- `DELETE /api/user/reminders/:raceId` - Remove reminder

## 🔐 Security Features

- **Password hashing** with bcrypt (12 rounds)
- **JWT tokens** with expiration
- **Rate limiting** (100 requests per 15 minutes)
- **Helmet.js** for security headers
- **CORS** configuration
- **Input validation** and sanitization
- **SQL injection** protection with parameterized queries

## 🎯 Validation Rules

### User Registration
- **Name**: 2-100 characters
- **Email**: Valid email format, unique
- **Password**: 
  - Minimum 8 characters
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one number
  - At least one special character (@$!%*?&)

## 🧪 Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## 📱 Mobile Responsive

RaceScope is fully responsive and works seamlessly on:
- 📱 Mobile phones (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1440px+)

## 🎨 Design System

### Colors
- **Formula 1**: #e10600 (Red)
- **MotoGP**: #0066cc (Blue)
- **Le Mans/WEC**: #ff8c00 (Orange)
- **IndyCar**: #0066ff (Blue)
- **NASCAR**: #ffcc00 (Yellow)

### Typography
- **Primary Font**: Orbitron (racing-themed)
- **Body Font**: System fonts for readability

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Build the application: `npm run build`
4. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Racing data providers
- Open source community
- Racing fans worldwide

---

**Built with ❤️ for racing enthusiasts by the RaceScope Team** 
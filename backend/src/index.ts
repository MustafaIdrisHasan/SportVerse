// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth';

// Import database connection (this will test the connection)
import './config/database';

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'RaceScope API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);

// Mock race data endpoint (temporary for development)
app.get('/api/races', (req, res) => {
  const mockRaces = [
    {
      id: '1',
      name: 'Qatar Grand Prix',
      date: '2024-03-10T15:00:00Z',
      circuit: 'Lusail International Circuit',
      country: 'Qatar',
      seriesId: 'f1',
      series: { id: 'f1', name: 'Formula 1', color: '#e10600', icon: '🏎️' },
      schedule: [
        { session: 'Practice 1', date: '2024-03-08', time: '11:30' },
        { session: 'Practice 2', date: '2024-03-08', time: '15:00' },
        { session: 'Practice 3', date: '2024-03-09', time: '11:30' },
        { session: 'Qualifying', date: '2024-03-09', time: '15:00' },
        { session: 'Race', date: '2024-03-10', time: '15:00' },
      ],
      watchLinks: [
        { country: 'US', broadcaster: 'ESPN', subscription: false },
        { country: 'UK', broadcaster: 'Sky Sports F1', subscription: true },
        { country: 'Global', broadcaster: 'F1 TV Pro', subscription: true },
      ],
    },
    {
      id: '2',
      name: 'Portimão Grand Prix',
      date: '2024-03-24T14:00:00Z',
      circuit: 'Algarve International Circuit',
      country: 'Portugal',
      seriesId: 'motogp',
      series: { id: 'motogp', name: 'MotoGP', color: '#0066cc', icon: '🏍️' },
      schedule: [
        { session: 'Practice 1', date: '2024-03-22', time: '10:45' },
        { session: 'Practice 2', date: '2024-03-22', time: '15:00' },
        { session: 'Qualifying', date: '2024-03-23', time: '14:10' },
        { session: 'Race', date: '2024-03-24', time: '14:00' },
      ],
      watchLinks: [
        { country: 'US', broadcaster: 'NBC Sports', subscription: true },
        { country: 'UK', broadcaster: 'BT Sport', subscription: true },
      ],
    },
  ];

  res.json({
    success: true,
    data: mockRaces,
  });
});

app.get('/api/races/upcoming', (req, res) => {
  const mockRaces = [
    {
      id: '1',
      name: 'Qatar Grand Prix',
      date: '2024-03-10T15:00:00Z',
      circuit: 'Lusail International Circuit',
      country: 'Qatar',
      seriesId: 'f1',
      series: { id: 'f1', name: 'Formula 1', color: '#e10600', icon: '🏎️' },
      schedule: [
        { session: 'Practice 1', date: '2024-03-08', time: '11:30' },
        { session: 'Practice 2', date: '2024-03-08', time: '15:00' },
        { session: 'Practice 3', date: '2024-03-09', time: '11:30' },
        { session: 'Qualifying', date: '2024-03-09', time: '15:00' },
        { session: 'Race', date: '2024-03-10', time: '15:00' },
      ],
      watchLinks: [
        { country: 'US', broadcaster: 'ESPN', subscription: false },
        { country: 'UK', broadcaster: 'Sky Sports F1', subscription: true },
        { country: 'Global', broadcaster: 'F1 TV Pro', subscription: true },
      ],
    },
    {
      id: '2',
      name: 'Portimão Grand Prix',
      date: '2024-03-24T14:00:00Z',
      circuit: 'Algarve International Circuit',
      country: 'Portugal',
      seriesId: 'motogp',
      series: { id: 'motogp', name: 'MotoGP', color: '#0066cc', icon: '🏍️' },
      schedule: [
        { session: 'Practice 1', date: '2024-03-22', time: '10:45' },
        { session: 'Practice 2', date: '2024-03-22', time: '15:00' },
        { session: 'Qualifying', date: '2024-03-23', time: '14:10' },
        { session: 'Race', date: '2024-03-24', time: '14:00' },
      ],
      watchLinks: [
        { country: 'US', broadcaster: 'NBC Sports', subscription: true },
        { country: 'UK', broadcaster: 'BT Sport', subscription: true },
      ],
    },
  ];

  res.json({
    success: true,
    data: mockRaces,
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  res.status(error.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message || 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 RaceScope API server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app; 
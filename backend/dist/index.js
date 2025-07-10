"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const schedule_1 = __importDefault(require("./routes/schedule"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, compression_1.default)());
if (process.env.NODE_ENV !== 'production') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'RaceScope API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
app.use('/api/auth', auth_1.default);
app.use('/api/schedule', schedule_1.default);
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
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    res.status(error.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : error.message || 'Something went wrong',
    });
});
app.listen(PORT, () => {
    console.log(`🚀 RaceScope API server running on port ${PORT}`);
    console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map
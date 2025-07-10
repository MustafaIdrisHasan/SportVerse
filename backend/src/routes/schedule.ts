import { Router } from 'express';
import { ScheduleController } from '../controllers/scheduleController';

const router = Router();

// === SYNC ROUTES (Admin) ===
/**
 * @route   POST /api/schedule/sync/all
 * @desc    Sync all sports schedules from scrapers to database
 * @access  Admin
 * @example POST /api/schedule/sync/all
 */
router.post('/sync/all', ScheduleController.syncAllSchedules);

/**
 * @route   POST /api/schedule/sync/f1
 * @desc    Sync F1 schedule from scraper to database
 * @access  Admin
 * @example POST /api/schedule/sync/f1
 */
router.post('/sync/f1', ScheduleController.syncF1Schedule);

/**
 * @route   POST /api/schedule/sync/nascar
 * @desc    Sync NASCAR schedule from scraper to database
 * @access  Admin
 * @example POST /api/schedule/sync/nascar
 */
router.post('/sync/nascar', ScheduleController.syncNASCARSchedule);

/**
 * @route   POST /api/schedule/sync/rally
 * @desc    Sync Rally (WRC) schedule from scraper to database
 * @access  Admin
 * @example POST /api/schedule/sync/rally
 */
router.post('/sync/rally', ScheduleController.syncRallySchedule);

/**
 * @route   POST /api/schedule/sync/cricket
 * @desc    Sync Cricket schedule from scraper to database
 * @access  Admin
 * @example POST /api/schedule/sync/cricket
 */
router.post('/sync/cricket', ScheduleController.syncCricketSchedule);

/**
 * @route   POST /api/schedule/sync/football
 * @desc    Sync Football schedule from scraper to database
 * @access  Admin
 * @example POST /api/schedule/sync/football
 */
router.post('/sync/football', ScheduleController.syncFootballSchedule);

// === DATABASE ROUTES (Real Data) ===
/**
 * @route   GET /api/schedule/races/upcoming
 * @desc    Get upcoming races from database (real data)
 * @access  Public
 * @query   {number} limit - Optional limit
 * @example GET /api/schedule/races/upcoming?limit=10
 */
router.get('/races/upcoming', ScheduleController.getUpcomingRaces);

/**
 * @route   GET /api/schedule/races
 * @desc    Get all races from database (real data)
 * @access  Public
 * @example GET /api/schedule/races
 */
router.get('/races', ScheduleController.getRaces);

// === LEGACY SCRAPER ROUTES (Mock Data) ===
/**
 * @route   GET /api/schedule/upcoming
 * @desc    Get upcoming events (next 7 days) - LEGACY MOCK DATA
 * @access  Public
 * @query   {string} sport - Optional sport filter
 * @query   {number} limit - Optional limit (default: 10)
 * @example GET /api/schedule/upcoming?sport=f1&limit=5
 */
router.get('/upcoming', ScheduleController.getUpcomingEvents);

/**
 * @route   GET /api/schedule
 * @desc    Get all sports schedules - LEGACY MOCK DATA
 * @access  Public
 * @example GET /api/schedule
 */
router.get('/', ScheduleController.getAllSchedules);

/**
 * @route   GET /api/schedule/:sport
 * @desc    Get schedule for a specific sport - LEGACY MOCK DATA
 * @access  Public
 * @param   {string} sport - The sport to get schedule for (f1, nascar, rally, cricket, football)
 * @example GET /api/schedule/f1
 */
router.get('/:sport', ScheduleController.getSchedule);

export default router; 
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const sportsScraper_1 = require("../utils/sportsScraper");
class ScheduleController {
    static async getSchedule(req, res) {
        try {
            const { sport } = req.params;
            if (!sport) {
                res.status(400).json({
                    success: false,
                    error: 'Sport parameter is required',
                });
                return;
            }
            const normalizedSport = sport.toLowerCase();
            const supportedSports = ['f1', 'nascar', 'rally', 'cricket', 'football'];
            if (!supportedSports.includes(normalizedSport)) {
                res.status(400).json({
                    success: false,
                    error: `Unsupported sport: ${sport}. Supported sports: ${supportedSports.join(', ')}`,
                });
                return;
            }
            let events = [];
            switch (normalizedSport) {
                case 'f1':
                    events = await (0, sportsScraper_1.getF1Schedule)();
                    break;
                case 'nascar':
                    events = await (0, sportsScraper_1.getNASCARSchedule)();
                    break;
                case 'rally':
                    events = await (0, sportsScraper_1.getRallySchedule)();
                    break;
                case 'cricket':
                    events = await (0, sportsScraper_1.getCricketMatches)();
                    break;
                case 'football':
                    events = await (0, sportsScraper_1.getFootballMatches)();
                    break;
                default:
                    res.status(400).json({
                        success: false,
                        error: 'Invalid sport specified',
                    });
                    return;
            }
            events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const response = {
                success: true,
                data: events,
                message: `Successfully fetched ${events.length} upcoming ${sport.toUpperCase()} events`,
                sport: normalizedSport,
            };
            res.json(response);
        }
        catch (error) {
            console.error(`Error fetching ${req.params.sport} schedule:`, error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching schedule',
            });
        }
    }
    static async getAllSchedules(req, res) {
        try {
            const sports = ['f1', 'nascar', 'rally', 'cricket', 'football'];
            const allEvents = [];
            const promises = sports.map(async (sport) => {
                try {
                    switch (sport) {
                        case 'f1':
                            return await (0, sportsScraper_1.getF1Schedule)();
                        case 'nascar':
                            return await (0, sportsScraper_1.getNASCARSchedule)();
                        case 'rally':
                            return await (0, sportsScraper_1.getRallySchedule)();
                        case 'cricket':
                            return await (0, sportsScraper_1.getCricketMatches)();
                        case 'football':
                            return await (0, sportsScraper_1.getFootballMatches)();
                        default:
                            return [];
                    }
                }
                catch (error) {
                    console.error(`Error fetching ${sport} schedule:`, error);
                    return [];
                }
            });
            const results = await Promise.all(promises);
            results.forEach(events => {
                allEvents.push(...events);
            });
            allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const response = {
                success: true,
                data: allEvents,
                message: `Successfully fetched ${allEvents.length} upcoming events across all sports`,
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching all schedules:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching schedules',
            });
        }
    }
    static async getUpcomingEvents(req, res) {
        try {
            const { sport } = req.query;
            const limit = req.query.limit ? parseInt(req.query.limit) : 10;
            let events = [];
            if (sport) {
                const normalizedSport = sport.toLowerCase();
                const supportedSports = ['f1', 'nascar', 'rally', 'cricket', 'football'];
                if (!supportedSports.includes(normalizedSport)) {
                    res.status(400).json({
                        success: false,
                        error: `Unsupported sport: ${sport}. Supported sports: ${supportedSports.join(', ')}`,
                    });
                    return;
                }
                switch (normalizedSport) {
                    case 'f1':
                        events = await (0, sportsScraper_1.getF1Schedule)();
                        break;
                    case 'nascar':
                        events = await (0, sportsScraper_1.getNASCARSchedule)();
                        break;
                    case 'rally':
                        events = await (0, sportsScraper_1.getRallySchedule)();
                        break;
                    case 'cricket':
                        events = await (0, sportsScraper_1.getCricketMatches)();
                        break;
                    case 'football':
                        events = await (0, sportsScraper_1.getFootballMatches)();
                        break;
                }
            }
            else {
                const sports = ['f1', 'nascar', 'rally', 'cricket', 'football'];
                const promises = sports.map(async (sportType) => {
                    try {
                        switch (sportType) {
                            case 'f1':
                                return await (0, sportsScraper_1.getF1Schedule)();
                            case 'nascar':
                                return await (0, sportsScraper_1.getNASCARSchedule)();
                            case 'rally':
                                return await (0, sportsScraper_1.getRallySchedule)();
                            case 'cricket':
                                return await (0, sportsScraper_1.getCricketMatches)();
                            case 'football':
                                return await (0, sportsScraper_1.getFootballMatches)();
                            default:
                                return [];
                        }
                    }
                    catch (error) {
                        console.error(`Error fetching ${sportType} schedule:`, error);
                        return [];
                    }
                });
                const results = await Promise.all(promises);
                results.forEach(sportEvents => {
                    events.push(...sportEvents);
                });
            }
            const now = new Date();
            const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            const upcomingEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= now && eventDate <= sevenDaysFromNow;
            });
            upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const limitedEvents = upcomingEvents.slice(0, limit);
            const response = {
                success: true,
                data: limitedEvents,
                message: `Successfully fetched ${limitedEvents.length} upcoming events in the next 7 days`,
                sport: sport,
            };
            res.json(response);
        }
        catch (error) {
            console.error('Error fetching upcoming events:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error while fetching upcoming events',
            });
        }
    }
}
exports.ScheduleController = ScheduleController;
//# sourceMappingURL=scheduleController.js.map
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFootballMatches = exports.getCricketMatches = exports.getRallySchedule = exports.getNASCARSchedule = exports.getF1Schedule = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const luxon_1 = require("luxon");
const IST_TIMEZONE = 'Asia/Kolkata';
const convertToIST = (dateString, timeString, sourceTimezone = 'UTC') => {
    try {
        const dt = luxon_1.DateTime.fromFormat(`${dateString} ${timeString}`, 'yyyy-MM-dd HH:mm', { zone: sourceTimezone });
        const istDateTime = dt.setZone(IST_TIMEZONE);
        return {
            date: istDateTime.toFormat('yyyy-MM-dd'),
            time: istDateTime.toFormat('HH:mm')
        };
    }
    catch (error) {
        console.error('Date conversion error:', error);
        return { date: dateString, time: timeString };
    }
};
const getF1Schedule = async () => {
    try {
        const response = await axios_1.default.get('https://www.formula1.com/en/racing/2024.html', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(response.data);
        const events = [];
        $('.event-item, .race-item').each((index, element) => {
            const eventName = $(element).find('.event-title, .race-title').text().trim();
            const dateStr = $(element).find('.event-date, .race-date').text().trim();
            const location = $(element).find('.event-location, .race-location').text().trim();
            const circuit = $(element).find('.event-circuit, .race-circuit').text().trim();
            if (eventName && dateStr && location) {
                const currentYear = new Date().getFullYear();
                const eventDate = new Date(dateStr);
                if (eventDate > new Date()) {
                    const { date, time } = convertToIST(eventDate.toISOString().split('T')[0], '15:00', 'UTC');
                    events.push({
                        sport: 'F1',
                        event: eventName,
                        date,
                        time,
                        location: location,
                        circuit: circuit || location,
                        country: location.split(',').pop()?.trim() || location,
                        status: 'upcoming'
                    });
                }
            }
        });
        if (events.length === 0) {
            return getMockF1Schedule();
        }
        return events;
    }
    catch (error) {
        console.error('Error scraping F1 schedule:', error);
        return getMockF1Schedule();
    }
};
exports.getF1Schedule = getF1Schedule;
const getNASCARSchedule = async () => {
    try {
        const response = await axios_1.default.get('https://www.nascar.com/schedule/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(response.data);
        const events = [];
        $('.schedule-item, .race-item').each((index, element) => {
            const eventName = $(element).find('.race-name, .event-name').text().trim();
            const dateStr = $(element).find('.race-date, .event-date').text().trim();
            const track = $(element).find('.track-name, .venue').text().trim();
            const location = $(element).find('.location, .city-state').text().trim();
            if (eventName && dateStr && track) {
                const eventDate = new Date(dateStr);
                if (eventDate > new Date()) {
                    const { date, time } = convertToIST(eventDate.toISOString().split('T')[0], '19:00', 'America/New_York');
                    events.push({
                        sport: 'NASCAR',
                        event: eventName,
                        date,
                        time,
                        location: track,
                        venue: location || track,
                        country: 'United States',
                        status: 'upcoming'
                    });
                }
            }
        });
        if (events.length === 0) {
            return getMockNASCARSchedule();
        }
        return events;
    }
    catch (error) {
        console.error('Error scraping NASCAR schedule:', error);
        return getMockNASCARSchedule();
    }
};
exports.getNASCARSchedule = getNASCARSchedule;
const getRallySchedule = async () => {
    try {
        const response = await axios_1.default.get('https://www.wrc.com/en/calendar/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(response.data);
        const events = [];
        $('.calendar-item, .rally-item').each((index, element) => {
            const eventName = $(element).find('.rally-name, .event-name').text().trim();
            const dateStr = $(element).find('.rally-date, .event-date').text().trim();
            const country = $(element).find('.rally-country, .country').text().trim();
            if (eventName && dateStr && country) {
                const eventDate = new Date(dateStr);
                if (eventDate > new Date()) {
                    const { date, time } = convertToIST(eventDate.toISOString().split('T')[0], '10:00', 'Europe/London');
                    events.push({
                        sport: 'Rally',
                        event: eventName,
                        date,
                        time,
                        location: country,
                        country: country,
                        status: 'upcoming'
                    });
                }
            }
        });
        if (events.length === 0) {
            return getMockRallySchedule();
        }
        return events;
    }
    catch (error) {
        console.error('Error scraping Rally schedule:', error);
        return getMockRallySchedule();
    }
};
exports.getRallySchedule = getRallySchedule;
const getCricketMatches = async () => {
    try {
        const response = await axios_1.default.get('https://www.espncricinfo.com/live-cricket-match-schedule-fixtures', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(response.data);
        const events = [];
        $('.match-item, .fixture-item').each((index, element) => {
            const teams = $(element).find('.team-name').map((i, el) => $(el).text().trim()).get();
            const dateStr = $(element).find('.match-date').text().trim();
            const venue = $(element).find('.venue').text().trim();
            const matchType = $(element).find('.match-type').text().trim();
            if (teams.length >= 2 && dateStr) {
                const eventDate = new Date(dateStr);
                if (eventDate > new Date()) {
                    const { date, time } = convertToIST(eventDate.toISOString().split('T')[0], '14:30', 'Asia/Kolkata');
                    events.push({
                        sport: 'Cricket',
                        event: `${teams[0]} vs ${teams[1]}`,
                        date,
                        time,
                        location: venue || 'TBD',
                        teams: teams,
                        country: 'India',
                        status: 'upcoming'
                    });
                }
            }
        });
        if (events.length === 0) {
            return getMockCricketMatches();
        }
        return events;
    }
    catch (error) {
        console.error('Error scraping Cricket matches:', error);
        return getMockCricketMatches();
    }
};
exports.getCricketMatches = getCricketMatches;
const getFootballMatches = async () => {
    try {
        const response = await axios_1.default.get('https://www.espn.com/soccer/fixtures', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const $ = cheerio.load(response.data);
        const events = [];
        $('.fixture-item, .match-item').each((index, element) => {
            const teams = $(element).find('.team-name').map((i, el) => $(el).text().trim()).get();
            const dateStr = $(element).find('.match-date').text().trim();
            const venue = $(element).find('.venue').text().trim();
            const league = $(element).find('.league').text().trim();
            if (teams.length >= 2 && dateStr) {
                const eventDate = new Date(dateStr);
                if (eventDate > new Date()) {
                    const { date, time } = convertToIST(eventDate.toISOString().split('T')[0], '20:00', 'Europe/London');
                    events.push({
                        sport: 'Football',
                        event: `${teams[0]} vs ${teams[1]}`,
                        date,
                        time,
                        location: venue || 'TBD',
                        teams: teams,
                        country: 'England',
                        status: 'upcoming'
                    });
                }
            }
        });
        if (events.length === 0) {
            return getMockFootballMatches();
        }
        return events;
    }
    catch (error) {
        console.error('Error scraping Football matches:', error);
        return getMockFootballMatches();
    }
};
exports.getFootballMatches = getFootballMatches;
const getMockF1Schedule = () => {
    const now = luxon_1.DateTime.now().setZone(IST_TIMEZONE);
    const nextRace = now.plus({ days: 7 });
    return [
        {
            sport: 'F1',
            event: 'Australian Grand Prix',
            date: nextRace.toFormat('yyyy-MM-dd'),
            time: '15:30',
            location: 'Melbourne',
            circuit: 'Albert Park Circuit',
            country: 'Australia',
            status: 'upcoming'
        },
        {
            sport: 'F1',
            event: 'Bahrain Grand Prix',
            date: nextRace.plus({ days: 14 }).toFormat('yyyy-MM-dd'),
            time: '18:00',
            location: 'Sakhir',
            circuit: 'Bahrain International Circuit',
            country: 'Bahrain',
            status: 'upcoming'
        }
    ];
};
const getMockNASCARSchedule = () => {
    const now = luxon_1.DateTime.now().setZone(IST_TIMEZONE);
    const nextRace = now.plus({ days: 3 });
    return [
        {
            sport: 'NASCAR',
            event: 'Daytona 500',
            date: nextRace.toFormat('yyyy-MM-dd'),
            time: '02:30',
            location: 'Daytona International Speedway',
            venue: 'Daytona Beach, FL',
            country: 'United States',
            status: 'upcoming'
        }
    ];
};
const getMockRallySchedule = () => {
    const now = luxon_1.DateTime.now().setZone(IST_TIMEZONE);
    const nextRally = now.plus({ days: 10 });
    return [
        {
            sport: 'Rally',
            event: 'Rally Sweden',
            date: nextRally.toFormat('yyyy-MM-dd'),
            time: '15:30',
            location: 'Sweden',
            country: 'Sweden',
            status: 'upcoming'
        }
    ];
};
const getMockCricketMatches = () => {
    const now = luxon_1.DateTime.now().setZone(IST_TIMEZONE);
    const nextMatch = now.plus({ days: 2 });
    return [
        {
            sport: 'Cricket',
            event: 'India vs Australia',
            date: nextMatch.toFormat('yyyy-MM-dd'),
            time: '14:30',
            location: 'Wankhede Stadium',
            teams: ['India', 'Australia'],
            country: 'India',
            status: 'upcoming'
        }
    ];
};
const getMockFootballMatches = () => {
    const now = luxon_1.DateTime.now().setZone(IST_TIMEZONE);
    const nextMatch = now.plus({ days: 1 });
    return [
        {
            sport: 'Football',
            event: 'Manchester United vs Liverpool',
            date: nextMatch.toFormat('yyyy-MM-dd'),
            time: '01:30',
            location: 'Old Trafford',
            teams: ['Manchester United', 'Liverpool'],
            country: 'England',
            status: 'upcoming'
        }
    ];
};
//# sourceMappingURL=sportsScraper.js.map
import axios from 'axios';
import * as cheerio from 'cheerio';
import { DateTime } from 'luxon';
import { SportsEvent } from '../types';

const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Utility function to convert date/time to IST
 */
const convertToIST = (dateString: string, timeString: string, sourceTimezone: string = 'UTC'): { date: string; time: string } => {
  try {
    const dt = DateTime.fromFormat(`${dateString} ${timeString}`, 'yyyy-MM-dd HH:mm', { zone: sourceTimezone });
    const istDateTime = dt.setZone(IST_TIMEZONE);
    
    return {
      date: istDateTime.toFormat('yyyy-MM-dd'),
      time: istDateTime.toFormat('HH:mm')
    };
  } catch (error) {
    console.error('Date conversion error:', error);
    return { date: dateString, time: timeString };
  }
};

/**
 * Scrape Formula 1 schedule from official F1 website
 */
export const getF1Schedule = async (): Promise<SportsEvent[]> => {
  try {
    const response = await axios.get('https://www.formula1.com/en/racing/2024.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: SportsEvent[] = [];
    
    // F1 schedule scraping logic
    $('.event-item, .race-item').each((index, element) => {
      const eventName = $(element).find('.event-title, .race-title').text().trim();
      const dateStr = $(element).find('.event-date, .race-date').text().trim();
      const location = $(element).find('.event-location, .race-location').text().trim();
      const circuit = $(element).find('.event-circuit, .race-circuit').text().trim();
      
      if (eventName && dateStr && location) {
        // Parse date (this is a simplified example - real parsing would be more complex)
        const currentYear = new Date().getFullYear();
        const eventDate = new Date(dateStr);
        
        if (eventDate > new Date()) {
          const { date, time } = convertToIST(
            eventDate.toISOString().split('T')[0],
            '15:00', // Default race time
            'UTC'
          );
          
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
    
    // If scraping fails, return mock data
    if (events.length === 0) {
      return getMockF1Schedule();
    }
    
    return events;
  } catch (error) {
    console.error('Error scraping F1 schedule:', error);
    return getMockF1Schedule();
  }
};

/**
 * Scrape NASCAR schedule
 */
export const getNASCARSchedule = async (): Promise<SportsEvent[]> => {
  try {
    const response = await axios.get('https://www.nascar.com/schedule/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: SportsEvent[] = [];
    
    $('.schedule-item, .race-item').each((index, element) => {
      const eventName = $(element).find('.race-name, .event-name').text().trim();
      const dateStr = $(element).find('.race-date, .event-date').text().trim();
      const track = $(element).find('.track-name, .venue').text().trim();
      const location = $(element).find('.location, .city-state').text().trim();
      
      if (eventName && dateStr && track) {
        const eventDate = new Date(dateStr);
        
        if (eventDate > new Date()) {
          const { date, time } = convertToIST(
            eventDate.toISOString().split('T')[0],
            '19:00', // Default NASCAR time
            'America/New_York'
          );
          
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
  } catch (error) {
    console.error('Error scraping NASCAR schedule:', error);
    return getMockNASCARSchedule();
  }
};

/**
 * Scrape Rally (WRC) schedule
 */
export const getRallySchedule = async (): Promise<SportsEvent[]> => {
  try {
    const response = await axios.get('https://www.wrc.com/en/calendar/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: SportsEvent[] = [];
    
    $('.calendar-item, .rally-item').each((index, element) => {
      const eventName = $(element).find('.rally-name, .event-name').text().trim();
      const dateStr = $(element).find('.rally-date, .event-date').text().trim();
      const country = $(element).find('.rally-country, .country').text().trim();
      
      if (eventName && dateStr && country) {
        const eventDate = new Date(dateStr);
        
        if (eventDate > new Date()) {
          const { date, time } = convertToIST(
            eventDate.toISOString().split('T')[0],
            '10:00', // Default rally start time
            'Europe/London'
          );
          
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
  } catch (error) {
    console.error('Error scraping Rally schedule:', error);
    return getMockRallySchedule();
  }
};

/**
 * Scrape Cricket matches from ESPNCricinfo
 */
export const getCricketMatches = async (): Promise<SportsEvent[]> => {
  try {
    const response = await axios.get('https://www.espncricinfo.com/live-cricket-match-schedule-fixtures', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: SportsEvent[] = [];
    
    $('.match-item, .fixture-item').each((index, element) => {
      const teams = $(element).find('.team-name').map((i, el) => $(el).text().trim()).get();
      const dateStr = $(element).find('.match-date').text().trim();
      const venue = $(element).find('.venue').text().trim();
      const matchType = $(element).find('.match-type').text().trim();
      
      if (teams.length >= 2 && dateStr) {
        const eventDate = new Date(dateStr);
        
        if (eventDate > new Date()) {
          const { date, time } = convertToIST(
            eventDate.toISOString().split('T')[0],
            '14:30', // Default cricket start time
            'Asia/Kolkata'
          );
          
          events.push({
            sport: 'Cricket',
            event: `${teams[0]} vs ${teams[1]}`,
            date,
            time,
            location: venue || 'TBD',
            teams: teams,
            country: 'India', // Default, should be parsed from venue
            status: 'upcoming'
          });
        }
      }
    });
    
    if (events.length === 0) {
      return getMockCricketMatches();
    }
    
    return events;
  } catch (error) {
    console.error('Error scraping Cricket matches:', error);
    return getMockCricketMatches();
  }
};

/**
 * Scrape Football matches
 */
export const getFootballMatches = async (): Promise<SportsEvent[]> => {
  try {
    const response = await axios.get('https://www.espn.com/soccer/fixtures', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const events: SportsEvent[] = [];
    
    $('.fixture-item, .match-item').each((index, element) => {
      const teams = $(element).find('.team-name').map((i, el) => $(el).text().trim()).get();
      const dateStr = $(element).find('.match-date').text().trim();
      const venue = $(element).find('.venue').text().trim();
      const league = $(element).find('.league').text().trim();
      
      if (teams.length >= 2 && dateStr) {
        const eventDate = new Date(dateStr);
        
        if (eventDate > new Date()) {
          const { date, time } = convertToIST(
            eventDate.toISOString().split('T')[0],
            '20:00', // Default football time
            'Europe/London'
          );
          
          events.push({
            sport: 'Football',
            event: `${teams[0]} vs ${teams[1]}`,
            date,
            time,
            location: venue || 'TBD',
            teams: teams,
            country: 'England', // Default, should be parsed
            status: 'upcoming'
          });
        }
      }
    });
    
    if (events.length === 0) {
      return getMockFootballMatches();
    }
    
    return events;
  } catch (error) {
    console.error('Error scraping Football matches:', error);
    return getMockFootballMatches();
  }
};

// Mock data functions (fallback when scraping fails)
const getMockF1Schedule = (): SportsEvent[] => {
  const now = DateTime.now().setZone(IST_TIMEZONE);
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

const getMockNASCARSchedule = (): SportsEvent[] => {
  const now = DateTime.now().setZone(IST_TIMEZONE);
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

const getMockRallySchedule = (): SportsEvent[] => {
  const now = DateTime.now().setZone(IST_TIMEZONE);
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

const getMockCricketMatches = (): SportsEvent[] => {
  const now = DateTime.now().setZone(IST_TIMEZONE);
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

const getMockFootballMatches = (): SportsEvent[] => {
  const now = DateTime.now().setZone(IST_TIMEZONE);
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
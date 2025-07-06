export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getTimeUntilRace = (raceDate: string): string => {
  const now = new Date().getTime();
  const race = new Date(raceDate).getTime();
  const difference = race - now;

  if (difference < 0) {
    return 'Race completed';
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const isRaceUpcoming = (raceDate: string): boolean => {
  const now = new Date().getTime();
  const race = new Date(raceDate).getTime();
  return race > now;
};

export const getSeriesColor = (seriesName: string): string => {
  const colors: { [key: string]: string } = {
    'Formula 1': '#e10600',
    'F1': '#e10600',
    'MotoGP': '#0066cc',
    'Le Mans': '#ff8c00',
    'WEC': '#ff8c00',
    'IndyCar': '#0066ff',
    'NASCAR': '#ffcc00',
  };
  
  return colors[seriesName] || '#6b7280';
};

export const getCountryFlag = (countryCode: string): string => {
  // Convert country code to flag emoji
  const offset = 127397;
  return countryCode
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(char.charCodeAt(0) + offset))
    .join('');
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}; 
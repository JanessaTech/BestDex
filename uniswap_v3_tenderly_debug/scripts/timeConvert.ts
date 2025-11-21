export function timeAgo(date: Date | string): string {
    const now = new Date();
    const targetDate = typeof date === 'string' ? new Date(date) : date;
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
    
    // If date is in the future, return "just now"
    if (diffInSeconds < 0) {
      return 'just now';
    }
    
    // Define time units
    const intervals = {
      year: 31536000, // 365 * 24 * 60 * 60
      month: 2592000,  // 30 * 24 * 60 * 60
      week: 604800,   // 7 * 24 * 60 * 60
      day: 86400,     // 24 * 60 * 60
      hour: 3600,     // 60 * 60
      minute: 60,
      second: 1
    };
    
    // Calculate relative time
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(diffInSeconds / secondsInUnit);
      
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    
    return 'just now';
  }

  const res = timeAgo("2025-11-20T03:02:37.255Z")
  console.log(res)

  //npx hardhat run scripts\timeConvert.ts
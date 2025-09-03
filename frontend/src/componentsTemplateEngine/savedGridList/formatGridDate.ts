export function formatGridDate(timestamp: number | string) {
    const date = new Date(timestamp);
    const now = new Date();
  
    const isToday =
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate();
  
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
  
    const isYesterday =
      date.getFullYear() === yesterday.getFullYear() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getDate() === yesterday.getDate();
  
    // Zeit im hh:mm am/pm Format ohne Sekunden
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // 0 -> 12
  
    const timeString = `${hours}:${minutes} ${ampm}`;
  
    if (isToday) return `today, ${timeString}`;
    if (isYesterday) return `yesterday, ${timeString}`;
  
    // Andernfalls normales Datum
    return `${date.toLocaleDateString()}, ${timeString}`;
  }
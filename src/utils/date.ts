/**
 * Formats a date string to a readable format
 * @param date - Date string in ISO format (e.g., "2013-01-01")
 * @returns Formatted date string (e.g., "Jan 2013") or original/empty string if invalid
 */
export function formatDate(date?: string): string {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    return date;
  }
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

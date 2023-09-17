export function getFormattedDate(log?: string): string {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = String(currentDate.getFullYear());
  const hour = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  return log?`${year}/${month}/${day}-${hour}:${minutes}:${seconds}`: `${year}${month}${day}-${hour}${minutes}${seconds}`;
}

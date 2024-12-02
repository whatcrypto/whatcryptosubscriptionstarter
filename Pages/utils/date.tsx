export function dateToString(inputDate: any) {
  const date = new Date(inputDate);
  const options: any = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

export function getMonthAbbreviation(date: any) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return months[date.getMonth()];
}

export function addDays(now = new Date(), days = 10) {
  const date = new Date(now);
  date.setDate(date.getDate() + days);
  return date;
}

export function addSeconds(now = new Date(), seconds = 10) {
  const date = new Date(now);
  date.setSeconds(date.getSeconds() + seconds);
  return date;
}

export function daysDiff(date1: any, date2: any) {
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

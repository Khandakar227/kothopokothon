export function toDateTimeFormat(dateString:string) {
    const date = new Date(dateString);
    const d = date.getDate();
    const m = date.getMonth();
    const y = date.getFullYear();
    const hh = date.getHours();
    const mm = date.getMinutes();
    return `${d}/${m}/${y} ${hh}:${mm}`;
}
import * as chrono from "chrono-node";

const parseUserTime = (text: string, timezoneOffsetMinutes: number): string => {
    const parsed = chrono.parse(text, new Date())[0];

    if (!parsed) throw new Error("Invalid date");

    const year = parsed.start.get("year") ?? new Date().getUTCFullYear();
    const month = (parsed.start.get("month") ?? new Date().getUTCMonth() + 1) - 1;
    const day = parsed.start.get("day") ?? new Date().getUTCDate();
    const hour = parsed.start.get("hour") ?? 0;
    const minute = parsed.start.get("minute") ?? 0;
    const second = parsed.start.get("second") ?? 0;

    const utc = Date.UTC(year, month, day, hour, minute, second);
    const adjusted = new Date(utc - timezoneOffsetMinutes * 60 * 1000);

    return adjusted.toISOString();
}

export default parseUserTime;
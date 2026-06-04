import * as chrono from "chrono-node";

const parseUserTime = (text: string, timezoneOffsetMinutes: number): string => {
    const localNow = new Date(Date.now() + timezoneOffsetMinutes * 60 * 1000);
    const parsed = chrono.parse(text, localNow)[0];
    if (!parsed) throw new Error("Invalid date");

    const parsedDate = parsed.start.date();
    const adjusted = new Date(parsedDate.getTime() - timezoneOffsetMinutes * 60 * 1000);
    return adjusted.toISOString();
}

export default parseUserTime;
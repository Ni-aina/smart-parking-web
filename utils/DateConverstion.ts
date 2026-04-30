import * as chrono from "chrono-node";

const parseUserTime = (text: string)=> {
    const parsed = chrono.parseDate(text);

    if (!parsed) throw new Error("Invalid date");

    return parsed.toISOString();
}

export default parseUserTime;
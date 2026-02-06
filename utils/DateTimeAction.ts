export const getDateFormat = (date: Date) => {
    return date.toLocaleDateString([], {
        day: "2-digit",
        month: "short",
        year: "numeric"
    })
}

export const getTimeFormat = (date: Date) => {
    return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    })
}

export const addHours = (date: Date, hours: number) => {
    const newDate = new Date(date);
    newDate.setHours(date.getHours() + hours)
    return newDate;
}

export const calculateDurationHours = (
    startDateTime: Date | string,
    endDateTime: Date | string
): number => {
    const start = typeof startDateTime === 'string'
        ? new Date(startDateTime)
        : startDateTime
    const end = typeof endDateTime === 'string'
        ? new Date(endDateTime)
        : endDateTime

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date input");
    }

    const diffMs = end.getTime() - start.getTime();

    if (diffMs < 0) {
        throw new Error("End date must be after start date");
    }

    const hours = diffMs / (1000 * 60 * 60);

    return Math.ceil(hours)
}
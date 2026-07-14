export const formatMB = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1)
}

export const formatSpeed = (bytesPerSecond: number) => {
    if (bytesPerSecond > 1024 * 1024) {
        return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`
    }

    return `${(bytesPerSecond / 1024).toFixed(0)} KB/s`
}

export const formatTimeLeft = (seconds: number, language: "en" | "fr") => {
    if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return language === "fr"
            ? `${minutes}m ${secs}s restantes`
            : `${minutes}m ${secs}s left`
    }

    return language === "fr"
        ? `${seconds}s restantes`
        : `${seconds}s left`
}
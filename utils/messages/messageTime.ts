type Translate = (key: string, params?: Record<string, string | number>) => string

export const shouldShowMessageTime = (
    currentCreatedAt: string,
    previousCreatedAt?: string
) => {
    if (!previousCreatedAt) return true

    const current = new Date(currentCreatedAt).getTime()
    const previous = new Date(previousCreatedAt).getTime()

    if (Number.isNaN(current) || Number.isNaN(previous)) return true

    return current - previous > 1000 * 60 * 15
}

export const formatMessageTime = (date: string, locale: string) => {
    return new Date(date).toLocaleString(locale, {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    })
}

export const formatRelativeMessageTime = (date: string, t: Translate) => {
    const time = new Date(date).getTime()
    if (Number.isNaN(time)) return ""

    const diffMs = Date.now() - time
    const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) return t("messages.time.now")
    if (diffMinutes === 1) return t("messages.time.minuteAgo")
    if (diffMinutes < 60) return t("messages.time.minutesAgo", { count: diffMinutes })
    if (diffHours === 1) return t("messages.time.hourAgo")
    if (diffHours < 24) return t("messages.time.hoursAgo", { count: diffHours })
    if (diffDays === 1) return t("messages.time.dayAgo")
    if (diffDays < 7) return t("messages.time.daysAgo", { count: diffDays })

    return new Date(date).toLocaleDateString([], {
        month: "short",
        day: "2-digit"
    })
}

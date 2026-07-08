export const messageRoles = ["owner", "driver", "agent"] as const

export type MessageRole = typeof messageRoles[number]
export type RoleFilter = "all" | MessageRole

export const roleBadgeClass: Record<MessageRole, string> = {
    owner: "bg-blue-500/10 text-blue-400",
    driver: "bg-green-500/10 text-green-400",
    agent: "bg-yellow-500/10 text-yellow-400"
}

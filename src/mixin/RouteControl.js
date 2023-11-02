export function defineConversationRoute() {
    if (import.meta.env.VITE_IS_LOCAL === "True") {
        return "/conversation"
    } else {
        return "/"
    }
}

export function defineLandingRoute() {
    if (import.meta.env.VITE_IS_LOCAL === "True") {
        return "/"
    } else {
        return "/welcome"
    }
}
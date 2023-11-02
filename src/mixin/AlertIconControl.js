export function defineIconRoute() {
    if (import.meta.env.VITE_IS_LOCAL === "True") {
        return "/icons/"
    } else {
        return "/teammate/icons/"
    }
}
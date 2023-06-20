export function callBaseUrl() {
    if (import.meta.env.VITE_IS_LOCAL === "True") {
        return import.meta.env.VITE_LOCAL_BASE_API_URL
    } else {
        return 'Production'
    }
}

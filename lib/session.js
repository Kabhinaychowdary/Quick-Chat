// Session management using cookies (not localStorage)
// This ensures data is not stored in browser storage

export function setUserSession(user) {
    // Store user session in cookie (expires in 24 hours)
    const expires = new Date()
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000) // 24 hours

    document.cookie = `quickchat_session=${JSON.stringify(user)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
}

export function getUserSession() {
    // Get user session from cookie
    const cookies = document.cookie.split(';')
    const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('quickchat_session='))

    if (sessionCookie) {
        try {
            const value = sessionCookie.split('=')[1]
            return JSON.parse(decodeURIComponent(value))
        } catch (error) {
            return null
        }
    }

    return null
}

export function clearUserSession() {
    // Clear user session cookie
    document.cookie = 'quickchat_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

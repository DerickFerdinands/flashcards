"use server"

const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "password123"

export async function login(username: string, password: string) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        return { success: true }
    }
    return { success: false }
}


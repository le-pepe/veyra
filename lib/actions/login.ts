'use server'

export async function loginAction(password: string) {
    return password === process.env.ADMIN_PASSWORD;
}
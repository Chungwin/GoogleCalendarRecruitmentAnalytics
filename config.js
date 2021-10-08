const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    CLIENT_ID: process.env.GOOGLECALENDAR_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLECALENDAR_CLIENT_SECRET,
    REFRESH_TOKEN: process.env.GOOGLECALENDAR_REFRESH_TOKEN,
    CALENDAR_EMAIL: process.env.CALENDAR_EMAIL,
    COMPANY_ID: process.env.COMPANY_ID,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DATABASE,
    GOOGLE_CAL_DATABASE: process.env.DATABASE_NAME,
    CONNECTION_URL: process.env.CONNECTION_URL 
}
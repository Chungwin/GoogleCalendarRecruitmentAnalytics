const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    CLIENT_ID: process.env.GOOGLECALENDAR_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLECALENDAR_CLIENT_SECRET,
    REFRESH_TOKEN: process.env.GOOGLECALENDAR_REFRESH_TOKEN
}
# Google Calendar Data for Recruitment Analytics
This is a follow-up on my **[Breezy Recruitment Analytics Project.](https://github.com/Chungwin/BreezyRecruitmentAnalytics)**

**Goal:**
- Store all Google Calendar Events from a given calendar in a SQL Database. 
- Identify Interviews 
- Connect Interview-Event-Data with Interview-Dta from **[Breezy Recruitment Analytics Project.](https://github.com/Chungwin/BreezyRecruitmentAnalytics)** for more precise time meterics.
- Constatly update and anonmyise the data accordig to GDPR-guidelines.

## Installation
- Node.js
- MySQL
- Dependencies from package.json

## How to use
Create Project and Enable APIs & Services in your **[Google Cloud Platform](https://console.cloud.google.com/)** 
<br>
Create a .env file with
```sh
GOOGLECALENDAR_CLIENT_ID= ...
GOOGLECALENDAR_CLIENT_SECRET= ...
GOOGLECALENDAR_REFRESH_TOKEN= ...
```

## License

MIT
**Free Software, Hell Yeah!**
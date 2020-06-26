const cron = require("node-cron");
const dailyReminder = require("./dailyReminder");
const setMoodReminder = require("./setMoodReminder");

// Lembrete de daily
cron.schedule("59 10 * * MON-FRI", () => dailyReminder(), {
	timezone: "America/Sao_Paulo",
});

cron.schedule("20 16 * * MON-FRI", () => setMoodReminder(), {
	timezone: "America/Sao_Paulo",
});

const cron = require("node-cron");
const dailyReminder = require("./dailyReminder");

// Lembrete de daily
cron.schedule("0 11 * * MON-FRI", () => dailyReminder(), {
	timezone: "America/Sao_Paulo",
});

cron.schedule("20 16 * * MON-FRI", () => reminder(), {
	timezone: "America/Sao_Paulo",
});

const cron = require("node-cron");
const dailyReminder = require("./dailyReminder");
const setMoodReminder = require("./setMoodReminder");
const planningReminder = require("./planningReminder");

// Lembrete da planning
cron.schedule("0 8 * * 1", () => planningReminder(), {
	timezone: "America/Sao_Paulo",
});

// Lembrete de daily
cron.schedule("59 10 * * 2,3,4,5", () => dailyReminder(), {
	timezone: "America/Sao_Paulo",
});

// Lembrete para definir humor
cron.schedule("20 16 * * 1,2,3,4,5", () => setMoodReminder(), {
	timezone: "America/Sao_Paulo",
});

console.log("Jobs online");

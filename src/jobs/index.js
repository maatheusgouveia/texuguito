const cron = require("node-cron");
const Sentry = require("@sentry/node");
const sentryConfig = require("../config/sentry");
const dailyReminder = require("./dailyReminder");
const setMoodReminder = require("./setMoodReminder");
const planningReminder = require("./planningReminder");

Sentry.init({
	dsn: sentryConfig.sentry_dsn,
	debug: false,
});

try {
	// Lembrete da planning
	cron.schedule("59 9 * * 1", () => planningReminder(), {
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
} catch (e) {
	Sentry.captureException(e);
}

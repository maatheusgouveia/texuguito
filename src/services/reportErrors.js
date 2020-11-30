const { admin_id } = require('../config/bot');

async function reportErrors(client, error) {
	if (admin_id) {
		const adminUser = await client.users.fetch(admin_id);
		adminUser.send('Ocorreu um erro na aplicação');
		adminUser.send(`Descrição: ${error.message}`);
	}
}

module.exports = reportErrors;

const axios = require('axios');

class GetRandomGif {
	static async run(search) {
		const response = await axios.get(
			`https://api.tenor.com/v1/random?q=${search}&limit=1`,
		);

		const gif = response.data.results[0].media[0].gif.url;

		return gif;
	}
}

module.exports = GetRandomGif;

import type { MultilineChart } from './models';

export const load_chart_data = async (): Promise<MultilineChart> => {
	try {
		const url = `http://localhost:4000/api/chartdata`;
		console.log(`url ${url}`);
		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json, text/plain, */*'
			}
		});

		if (response.ok) {
			return (await response.json()) as MultilineChart;
		} else {
			const body = await response.text();
			console.log(`response status ${response.status}, body ${body}`);
			return Promise.reject();
		}
	} catch (e) {
		console.info(`error getting the date ${e}`);
	}
	return Promise.reject();
};

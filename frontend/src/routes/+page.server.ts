import type { PageServerLoad } from './$types';
import { load_chart_data } from '$lib/api';

export const load: PageServerLoad = async () => {
	const multiLineChart = await load_chart_data();

	// for some reason a new Date() is required to make it really a JS/TS date
	multiLineChart.lineData.forEach((lineData) => {
		lineData.points.forEach((point) => {
			point.x = new Date(point.x);
		});
	});

	multiLineChart.minX = new Date(multiLineChart.minX);
	multiLineChart.maxX = new Date(multiLineChart.maxX);

	// console.log(`multiLineChart ${JSON.stringify(multiLineChart)}`);
	return {
		multiLineChart: multiLineChart
	};
};

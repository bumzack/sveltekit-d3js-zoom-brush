import type { LineData, MultilineChart, PointData } from './models';

export const deepCopy = (input: MultilineChart): MultilineChart => {
	const lineDataCopy = input.lineData.map((lineData) => {
		const pointsCopy = lineData.points.map((point) => {
			const pointCopy: PointData = {
				x: point.x,
				y: point.y
			};
			return pointCopy;
		});

		const lineDataCopy: LineData = {
			points: pointsCopy,
			legend: lineData.legend,
			color: lineData.color
		};
		return lineDataCopy;
	});

	const multLineChartCopy: MultilineChart = {
		minX: input.minX,
		maxX: input.maxX,
		minY: input.minY,
		maxY: input.maxY,
		lineData: lineDataCopy
	};

	return multLineChartCopy;
};

export const formatDate = (dd: Date): string => {
	return `${String(dd.getDate()).padStart(2, '0')}-${String(dd.getMonth() + 1).padStart(2, '0')}-${dd.getFullYear()}`;
};

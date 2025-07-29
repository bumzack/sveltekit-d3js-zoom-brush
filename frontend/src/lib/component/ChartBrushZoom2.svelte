<script lang="ts">
	import { scaleLinear, scaleTime } from 'd3-scale';
	import { curveBasis, line } from 'd3-shape';
	import { brushX } from 'd3-brush';
	import { select } from 'd3-selection';
	import type { ChartMargins, ChartParameter, MultilineChart, PointData } from '$lib/models';
	import { deepCopy } from '$lib/utils';
	import SimpleChart2 from './SimpleChart2.svelte';

	let { data }: { data: MultilineChart } = $props();

	let dataZoomed: MultilineChart = $derived(deepCopy(data));

	let width = $state(300);
	let height = $state(300);
	let margin: ChartMargins = $state({ top: 10, right: 0, bottom: 20, left: 35 });
	let brushElement: HTMLElement | undefined = $derived(undefined);

	// zoomed chart xScale
	let xScaleZoomed = $derived(
		data && width
			? scaleTime()
					.domain([dataZoomed.minX, dataZoomed.maxX])
					.range([margin.left, width - margin.right])
			: null
	);

	// zoomed chart yScale
	let yScaleZoomed = $derived(
		data && width
			? scaleLinear()
					.domain([dataZoomed.minY, dataZoomed.maxY])
					.range([height - margin.bottom, margin.top])
			: null
	);

	// zoomed chart lineGenerator
	let lineGeneratorZoomed = $derived(
		xScaleZoomed && yScaleZoomed
			? line()
					.x((d: PointData) => xScaleZoomed(d.x))
					.y((d: PointData) => yScaleZoomed(+d.y))
					.curve(curveBasis)
			: null
	);

	// full chart xScale
	let xScaleFull = $derived(
		data && width
			? scaleTime()
					.domain([data.minX, data.maxX])
					.range([margin.left, width - margin.right])
			: null
	);

	// full chart yScale
	let yScaleFull = $derived(
		data && width
			? scaleLinear()
					.domain([data.minY, data.maxY])
					.range([height - margin.bottom, margin.top])
			: null
	);

	// full chart lineGenerator
	let lineGeneratorFull = $derived(
		xScaleFull && yScaleFull
			? line()
					.x((d: PointData) => xScaleFull(d.x))
					.y((d: PointData) => yScaleFull(+d.y))
					.curve(curveBasis)
			: null
	);

	// brushing stuff
	let brush = $derived(
		brushX()
			.extent([
				[margin.left, margin.top],
				[width - margin.right, height - margin.bottom]
			])
			// use 'end' if you want to update the zoomed chart only on mouse release
			.on('brush', brushed)
	);

	$effect(() => {
		console.log(`effect() called`);
		if (brushElement) {
			console.log(`effect() called and brushElement !== undefined`);
			select(brushElement).call(brush);
		} else {
			console.log(`effect() called and brushElement === undefined`);
		}
	});

	function brushed(event: d3.D3BrushEvent<unknown>) {
		const selection = event.selection;
		if (selection) {
			if (xScaleFull && xScaleZoomed && dataZoomed) {
				const [x0, x1] = selection.map((x) => xScaleFull.invert(x));
				xScaleZoomed.domain([x0, x1]);
				const tmp = deepCopy(data);
				let min: number = 100000000;
				let max: number = -10000000;
				tmp.lineData.forEach((lineData) => {
					let pointsZoomed = lineData.points.filter((point) => {
						return point.x >= x0 && point.x <= x1;
					});
					pointsZoomed.forEach((x) => {
						if (x.y > max) {
							max = x.y;
						}
						if (x.y < min) {
							min = x.y;
						}
					});
					lineData.points = pointsZoomed;
				});
				if (min > 0) {
					min = 0;
				}
				dataZoomed = tmp;

				dataZoomed.minX = x0;
				dataZoomed.maxX = x1;

				// if you don't want to change the y scale/extent on the zoomed chart, then
				// remove these 2 lines - then the "full" and "zoomed" chart will always have
				// the same y-axis scale/extent
				dataZoomed.minY = min;
				dataZoomed.maxY = max;
			}
		}
	}

	let zoomed = $state(false);

	let chartParamterZoomed: ChartParameter = $derived({
		full: zoomed,
		height: height,
		margin: margin,
		xScale: xScaleZoomed,
		yScale: yScaleZoomed,
		lineGenerator: lineGeneratorZoomed
	});

	let full = $state(true);
	let chartParamterFull: ChartParameter = $derived({
		full: full,
		height: height,
		margin: margin,
		xScale: xScaleFull,
		yScale: yScaleFull,
		lineGenerator: lineGeneratorFull
	});

	$effect(() => {
		console.log(`CHarBrushZoom2: multiLineChart ${data}`);
		console.log(`chartParamterZoomed ${JSON.stringify(chartParamterZoomed)}`);
		console.log(`chartParamterFull ${JSON.stringify(chartParamterFull)}`);
	});
</script>

<SimpleChart2 {width} data={dataZoomed} chartParameter={chartParamterZoomed} {brushElement} />

<SimpleChart2 {width} {data} chartParameter={chartParamterFull} {brushElement} />

<script lang="ts">
	import { scaleLinear, scaleTime } from 'd3-scale';
	import { curveBasis, line } from 'd3-shape';
	import { draw } from 'svelte/transition';
	import { brushX } from 'd3-brush';
	import { select } from 'd3-selection';
	import SimpleChart from './SimpleChart.svelte';
	import AxisY from './AxisY.svelte';
	import AxisX from './AxisX.svelte';
	import type { ChartMargins, MultilineChart, PointData } from '$lib/models';
	import { deepCopy } from '$lib/utils';

	let { data = $bindable() }: { data: MultilineChart } = $props();

	let dataZoomed: MultilineChart = $state(deepCopy(data));

	let width = $state(0);
	let height = $state(300);
	let margin: ChartMargins = $state({ top: 10, right: 0, bottom: 20, left: 35 });
	let brushElement = $state(null);

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
		if (brushElement) {
			select(brushElement).call(brush);
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
</script>

<SimpleChart
	bind:data={dataZoomed}
	bind:height
	bind:margin
	bind:xScale={xScaleZoomed}
	bind:yScale={yScaleZoomed}
	bind:lineGenerator={lineGeneratorZoomed}
/>

<div class="container">
	<div class="row">
		<div class="col-lg-12">
			<h4>Full range of data</h4>
			<div bind:clientWidth={width}>
				{#if data && width && xScaleFull && yScaleFull && lineGeneratorFull}
					<svg {width} {height}>
						<!-- this is the only reason, why the SimpleChart component can't be reused  -->
						<!-- attempts at passing the "brushElement" as  a prop didn't work -->
						<g bind:this={brushElement} {width} {height} />
						<AxisX
							{width}
							{height}
							{margin}
							ticksNumber={width > 380 ? 10 : 4}
							xScale={xScaleFull}
							format={(d: Date) =>
								`${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`}
						/>
						<AxisY {margin} yScale={yScaleFull} />

						// eslint-disable-next-line svelte/require-each-key
						{#each data.lineData as lineData}
							<path
								in:draw={{ duration: 1000 }}
								d={lineGeneratorFull(lineData.points)}
								stroke={lineData.color}
								stroke-width={1.5}
								fill="none"
							/>
						{/each}
					</svg>
				{/if}
			</div>
		</div>
	</div>
</div>

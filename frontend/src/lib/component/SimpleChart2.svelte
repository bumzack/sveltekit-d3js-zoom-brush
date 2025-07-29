<script lang="ts">
	import type { ChartParameter, MultilineChart, ToolTipData } from '$lib/models';
	import { formatDate } from '$lib/utils';
	import { draw } from 'svelte/transition';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	let {
		data,
		chartParameter,
		width,
		brushElement = $bindable()
	}: {
		data: MultilineChart;
		chartParameter: ChartParameter;
		width: number;
		brushElement: any | undefined;
	} = $props();

	let toolTip: ToolTipData = $derived({
		txt: '',
		x: 0,
		y: 0
	});

	let showToolTip = $state(false);

	$effect(() => {
		console.log(`SimpleChart2: data ${data}`);
		console.log(`SimpleChart2: width ${JSON.stringify(width)}`);
		console.log(`SimpleChart2: chartParameter ${JSON.stringify(chartParameter)}`);
		if (chartParameter !== undefined) {
			console.log(`SimpleChart2: chartParameter.xScale ${JSON.stringify(chartParameter.xScale)}`);
			console.log(`SimpleChart2: chartParameter.yScale ${JSON.stringify(chartParameter.yScale)}`);
			console.log(
				`SimpleChart2: chartParameter.lineGenerator ${JSON.stringify(chartParameter.lineGenerator)}`
			);
		}
	});
</script>

<div class="container">
	<div class="row">
		<div class="col-lg-12">
			<h4>Zoomed Data</h4>
			<div bind:clientWidth={width}>
				{console.log(`blupp      ${JSON.stringify(chartParameter)}`)}
				{#if data && chartParameter && width && chartParameter.xScale && chartParameter.yScale && chartParameter.lineGenerator}
					<svg {width} height={chartParameter.height} id="svgid-{chartParameter.full}">
						{#if brushElement !== undefined}
							{console.log(`ASASASASAXXXXXXXXXXX     full chart  ${JSON.stringify(brushElement)}`)}
							<g
								bind:this={brushElement}
								{width}
								height={chartParameter.height}
								class="brushElem"
								id="brushelem-{chartParameter.full}"
							/>
						{:else}
							{console.log('YYYYYYYYYYY      zoommed chart')}
						{/if}

						<AxisX
							{width}
							height={chartParameter.height}
							margin={chartParameter.margin}
							ticksNumber={width > 380 ? 10 : 4}
							xScale={chartParameter.xScale}
							format={(d: Date) =>
								`${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`}
						/>
						<AxisY margin={chartParameter.margin} yScale={chartParameter.yScale} />

						{#if showToolTip && !chartParameter.full}
							<text
								fill="#aa0055"
								x={+toolTip.x - 75}
								y={+toolTip.y - 10}
								text-anchor="middle"
								font-size="12"
							>
								{toolTip.txt}
							</text>
							<circle cx={+toolTip.x} cy={+toolTip.y} r="3" fill="red" />
						{/if}

						// eslint-disable-next-line svelte/require-each-key
						{#each data.lineData as lineData}
							<!-- the line -->
							<path
								in:draw={{ duration: 1000 }}
								d={chartParameter.lineGenerator(lineData.points)}
								stroke={lineData.color}
								stroke-width={1.5}
								fill="none"
							/>

							{#if !chartParameter.full}
								<!-- these are invisible circles to show a tooltip using a mouseover event -->
								// eslint-disable-next-line svelte/require-each-key
								{#each lineData.points as d}
									<circle
										pointer-events="all"
										role="progressbar"
										cx={chartParameter.xScale(d.x)}
										cy={chartParameter.yScale(d.y)}
										r="3"
										fill="none"
										stroke="none"
										onmouseover={() => {
											showToolTip = true;
											toolTip.txt = `  ${d.y} @ ${formatDate(d.x)}`;
											toolTip.x = chartParameter.xScale(d.x);
											toolTip.y = chartParameter.yScale(d.y);
										}}
										onmouseleave={() => {
											showToolTip = false;
										}}
									/>
								{/each}
							{/if}
						{/each}

						<!-- a poor mans legend :-) -->
						{#each data.lineData as lineData, i}
							<text
								fill={lineData.color}
								x={+chartParameter.margin.left + 10}
								y={20 + i * 20}
								text-anchor="left"
							>
								{lineData.legend}
							</text>
						{/each}
					</svg>
				{/if}
			</div>
		</div>
	</div>
</div>

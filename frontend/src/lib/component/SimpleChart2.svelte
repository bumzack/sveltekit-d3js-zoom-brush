<script lang="ts">
	import type { ChartParameter, MultilineChart, PointData, ToolTipData } from '$lib/models';
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
		brushElement: SVGGElement | null;
	} = $props();

	let toolTip: ToolTipData = $derived({
		txt: '',
		x: 0,
		y: 0
	});

	let showToolTip = $state(false);
</script>

<div class="container">
	<div class="row">
		<div class="col-lg-12">
			<h4>Zoomed Data</h4>
			<div bind:clientWidth={width}>
				{#if data && chartParameter && width && chartParameter.xScale && chartParameter.yScale && chartParameter.lineGenerator}
					<svg {width} height={chartParameter.height} id="svgid-{chartParameter.full}">
						{#if brushElement !== null}
							<g
								bind:this={brushElement}
								{width}
								height={chartParameter.height}
								class="brushElem"
								id="brushelem-{chartParameter.full}"
							/>
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

						{#each data.lineData as lineData, i (i)}
							<path
								in:draw={{ duration: 1000 }}
								d={chartParameter.lineGenerator(lineData.points as PointData[])}
								stroke={lineData.color}
								stroke-width={1.5}
								fill="none"
							/>
						{/each}

						<!-- a poor mans legend :-) -->
						{#each data.lineData as lineData, i (i)}
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

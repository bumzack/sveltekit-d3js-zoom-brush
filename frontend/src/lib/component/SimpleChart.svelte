<script lang="ts">
	import { draw } from 'svelte/transition';
	import { formatDate } from '$lib/utils';
	import type {
		ChartMarginsGeneric,
		MultilineChart,
		ToolTipDataGeneric
	} from '$lib/models_generic';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	let {
		data = $bindable(),
		xScale = $bindable(),
		yScale = $bindable(),
		lineGenerator = $bindable(),
		height = $bindable(),
		margin = $bindable()
	}: {
		data: MultilineChart;
		xScale: any; // not happy about these "any"s
		yScale: any;
		lineGenerator: any;
		height: number;
		margin: ChartMarginsGeneric;
	} = $props();

	let width = $state(0); // width will be set by the clientWidth

	let toolTip: ToolTipDataGeneric = $derived({
		txt: '',
		x: 0,
		y: 0
	});

	let showToolTip = $state(false);
</script>

<div class="container">
	<div class="row">
		<div class="col-lg-12">
			<div bind:clientWidth={width}>
				{#if data && width && xScale && yScale && lineGenerator}
					<svg {width} {height}>
						<AxisX
							{width}
							{height}
							{margin}
							ticksNumber={width > 380 ? 10 : 4}
							{xScale}
							format={(d: Date) =>
								`${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`}
						/>
						<AxisY {margin} {yScale} />

						{#if showToolTip}
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
								d={lineGenerator(lineData.points)}
								stroke={lineData.color}
								stroke-width={1.5}
								fill="none"
							/>

							<!-- these are invisible circles to show a tooltip using a mouseover event -->
							// eslint-disable-next-line svelte/require-each-key
							{#each lineData.points as d}
								<circle
									pointer-events="all"
									role="progressbar"
									cx={xScale(d.x)}
									cy={yScale(d.y)}
									r="3"
									fill="none"
									stroke="none"
									onmouseover={() => {
										showToolTip = true;
										toolTip.txt = `  ${d.y} @ ${formatDate(d.x)}`;
										toolTip.x = xScale(d.x);
										toolTip.y = yScale(d.y);
									}}
									onmouseleave={() => {
										showToolTip = false;
									}}
								/>
							{/each}
						{/each}

						<!-- a poor mans legend :-) -->
						{#each data.lineData as lineData, i}
							<text fill={lineData.color} x={+margin.left + 10} y={20 + i * 20} text-anchor="left">
								{lineData.legend}
							</text>
						{/each}
					</svg>
				{/if}
			</div>
		</div>
	</div>
</div>

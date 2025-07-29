<!-- taken from here: https://datavisualizationwithsvelte.com/basics/basic-shapes -->

<script lang="ts">
	// Props
	let { xScale, margin, height, width, ticksNumber = 2, format = null } = $props();

	// Conditionally apply the formatter if provided
	const formatter = format
		? (tick) => format(tick) // Use the provided formatter
		: (tick) => tick; // Default: no formatting
</script>

{#if xScale}
	<g transform="translate(0,{height - margin.bottom})">
		<!-- Axis line -->
		<line stroke="currentColor" x1={margin.left} x2={width - margin.right} />

		<!-- Ticks -->
		// eslint-disable-next-line svelte/require-each-key
		{#each xScale.ticks(ticksNumber) as tick}
			<line stroke="currentColor" x1={xScale(tick)} x2={xScale(tick)} y1={0} y2={6} />
		{/each}

		<!-- Tick labels -->
		// eslint-disable-next-line svelte/require-each-key
		{#each xScale.ticks(ticksNumber) as tick}
			<text font-size="12px" fill="currentColor" text-anchor="middle" x={xScale(tick)} y={16}>
				{formatter(tick)}
			</text>
		{/each}
	</g>
{/if}

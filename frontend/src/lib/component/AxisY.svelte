<!-- taken from here: https://datavisualizationwithsvelte.com/basics/basic-shapes -->

<script lang="ts">
	let { yScale, margin, ticksNumber = 5 } = $props();
</script>

{#if yScale}
	<g transform="translate({margin.left},0)">
		<line stroke="currentColor" y1={yScale(yScale.domain()[0])} y2={yScale(yScale.domain()[1])} />

		<!-- Specify the number of ticks here -->
		// eslint-disable-next-line svelte/require-each-key
		{#each yScale.ticks(ticksNumber) as tick}
			{#if tick !== 0}
				<line stroke="currentColor" x1={0} x2={-6} y1={yScale(tick)} y2={yScale(tick)} />
			{/if}

			<text
				fill="currentColor"
				text-anchor="end"
				font-size="10"
				dominant-baseline="middle"
				x={-9}
				y={yScale(tick)}
			>
				{tick}
			</text>
		{/each}
	</g>
{/if}

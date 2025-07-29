<script lang="ts">
	import ChartBrushZoom from '$lib/component/ChartBrushZoom.svelte';
	import type { MultilineChart } from '$lib/models';
	import type { PageData } from './$types';

	const { data }: { data: PageData } = $props();

	let multiLineChart: MultilineChart = $state(data.multiLineChart);
</script>

<div class="row">
	<div class="col-lg-12 demo">
		<h1>Brushable & zoomable multi line chart</h1>
		<ChartBrushZoom bind:data={multiLineChart} />
	</div>
</div>

<style>
	.demo {
		margin-top: 50px;
	}
</style>

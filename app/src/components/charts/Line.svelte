<script>
	import Axis from './Axis.svelte';
	import {scaleTime, scaleLinear} from 'd3-scale';
	import {line, curveCardinal} from 'd3-shape';
	import {max, extent} from 'd3-array'
	
    export let data;
	export let margin = {top: 0, right: 0, bottom: 0, left: 0};
	export let width;
	export let height;
	export let format;
    export let key;
		
	$: x = scaleTime()
		.domain(extent(data, d => d[key.x])).nice()
		.range([margin.left, width - margin.right]);
	
	$: y = scaleLinear()
		.domain([0, max(data, d => d[key.y])]).nice()
		.range([height - margin.bottom - margin.top, margin.top]);

	$: path = line()
		.x(d => x(d[key.x]))
		.y(d => y(d[key.y]))
		.curve(curveCardinal);
	
</script>

{#if width}
<svg viewBox="0 0 {width} {height}" {width} {height}>
	<Axis {width} {height} {margin} scale={y} position='left' format={format.y} time= {''}/>
	<g>
		<path 
			d={path(data)}
			class="line"
		/>
	</g>
	<Axis {width} {height} {margin} scale={x} position='bottom' format={format.x} time= {''}/>
</svg>
{/if}

<style>
	path {
		fill:none;
		stroke-width: 2;
		stroke: #000;
	}
</style>
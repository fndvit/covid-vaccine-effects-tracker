<script>
	import Axis from './Axis.svelte';
	import {scaleTime, scaleLinear} from 'd3-scale';
	import {line, curveCardinal} from 'd3-shape';
	import {max, extent} from 'd3-array'
	
    export let data;
    export let series;
	export let margin = {top: 0, right: 0, bottom: 0, left: 0};
	export let width;
	export let height;
	export let format;
    export let key;
	export let color;
		
	$: x = scaleTime()
		.domain(extent(data[series[0]], d => d[key.x])).nice()
		.range([margin.left, width - margin.right]);
	
	$: y = scaleLinear()
		.domain([0, max(data[series[0]], d => d[key.y])]).nice()
		.range([height - margin.bottom - margin.top, margin.top]);

	$: path_blue = line()
		.x(d => x(d[key.x]))
		.y(d => y(d[key.y]))
		.curve(curveCardinal);

	$: path_gray = line()
		.x(d => x(d[key.x]))
		.y(d => y(d[key.y]))
		.curve(curveCardinal);


// 	console.log("Hello multiline!");
// 	console.log(data[series[1]]);
// //	console.log(max(data, d => d[series[0]][key.y]>d[series[1]][key.y]?d[series[0]][key.y]:d[series[1]][key.y]));
// 	// console.log(data[0]);
// 	// console.log(data[0]['ia14']);
// 	// console.log(format);
// 	// console.log(key);
// 	console.log("Bye line!");	
</script>

{#if width}
<svg viewBox="0 0 {width} {height}" {width} {height}>
	<g>
		{#each series as d,i }
			<path 
			d={path_blue(data[d])}
			class="line"
			role="img"
			aria-roledescription="Corba {data[d]}"
			style="stroke:{color[i]}"
			/> 
			<!-- 
			aria-label="Evolució de l'incidència acumulada a 14 dies en població de residències" -->
		{/each}
    </g>
	<Axis {width} {height} {margin} scale={y} position='left' format={format.y} time= {''} />
	<Axis {width} {height} {margin} scale={x} position='bottom' format={format.x} time= {''} />
</svg>
{/if}

<style>
	path {
		fill:none;
		stroke-width: 2;
	}
</style>
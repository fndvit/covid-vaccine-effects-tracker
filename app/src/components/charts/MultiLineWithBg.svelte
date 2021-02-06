<script>
	import Axis from './Axis.svelte';
	import {scaleTime, scaleLinear} from 'd3-scale';
	import {line, area, curveCardinal} from 'd3-shape';
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
		.domain(extent(data[series[0]], d => d[key.x]))
		.range([margin.left, width - margin.right]);
	
	$: y = scaleLinear()
		.domain([0, max(data[series[0]], d => d[key.y])]).nice()
		.range([height - margin.bottom - margin.top, margin.top]);

	$: y_bg = scaleLinear()
		.domain([0, 100])
		.range([height - margin.bottom - margin.top, margin.top]);

	$: path = line()
		.x(d => x(d[key.x]))
		.y(d => y(d[key.y]))
		.curve(curveCardinal);

	$: path_bg = area()
		.x(d => x(d[key.x]))
		.y0(y_bg(0))
		.y1(d => y_bg(d[key.bg1]))
		.curve(curveCardinal);

	$: path_bg2 = area()
		.x(d => x(d[key.x]))
		.y0(y_bg(0))
		.y1(d => y_bg(d[key.bg2]))
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
		<path 
			d={path_bg(data[series[0]])}
			class="area"
			role="img"
		/>
		<!-- 'url(#diagonalHatch)' -->
		<!-- aria-roledescription="barra dosis entregadas diariamente"
		aria-label="Dosis entregadas: {data[data.length - 1][key.bg]}" -->
		<path 
			d={path_bg2(data[series[0]])}
			class="area_enforced"
			role="img"
		/>

		{#each series as d,i }
			<path 
			d={path(data[d])}
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
	<Axis {width} {height} {margin} scale={y_bg} position='right' format={format.y} time= {''} />
	<Axis {width} {height} {margin} scale={x} position='bottom' format={format.x} time= {''} />
</svg>
{/if}

<style>
	path {
		fill:none;
		stroke-width: 2;
	}
	.area{
		stroke: none;
		fill:url(#diagonalHatch);
	}
	.area_enforced{
		stroke: none;
		fill:url(#diagonalHatchEnforced);
	}
</style>
<script>
	import Axis from './Axis.svelte';
	import {scaleTime, scaleLinear} from 'd3-scale';
	import {line, area, curveCardinal} from 'd3-shape';
	import {max, extent, bisector} from 'd3-array'
	
    export let data;
    export let series;
	export let margin = {top: 0, right: 0, bottom: 0, left: 0};
	export let width;
	export let height;
	export let format;
    export let key;
	export let color;
		
	let datum = {};
	let tooltip = false;

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

	const mouseMove = (m) => {
		tooltip = true;
		//Set the data in ascending order
		const mX = (m.offsetX) ? m.offsetX + 2 : m.clientX;
		const _data = [...data[series[0]]];
//		_data.sort((a,b) => a[key.x] - b[[key.x]]);
		const index = x.invert(mX);
		index.setHours(0,0,0,0);
		const i = bisector(d => d[key.x]).center(_data, index);
		series.forEach(d => {
			datum[d] = data[d][i];			
		});
}

	const leave = (m) => {
		tooltip = false;
	}

	const getAnchor = (x) => {
		switch(true) {
			case x < 20:
				return 'start';
			case x  > width - 40:
				return 'end';
			default:
				return 'middle'
		}
	}
</script>

{#if width}
<svg viewBox="0 0 {width} {height}" {width} {height}
	role="document"
	aria-label='Evolució diària de las la incidència'
	xml:lang="ca"
	on:touchmove|preventDefault
	on:pointermove|preventDefault={mouseMove}
	on:mouseleave={leave}
	on:touchend={leave}
>
	<g>
		{#each data[series[0]] as d,i}
		<rect 
			height={height - margin.bottom - margin.top -20}
			width={(width - margin.left - margin.right) / data[series[0]].length}
			x={x(d[key.x])}
			y={margin.top}
			opacity={(d[key.bg1] + d[key.bg2]) / 200} 
			class="area"
		/>
		{/each}

		<!-- 
			<path 
			d={path_bg(data[series[0]])}
			class="area"
			role="img"
		/> -->
		<!-- 'url(#diagonalHatch)' -->
		<!-- aria-roledescription="barra dosis entregadas diariamente"
		aria-label="Dosis entregadas: {data[data.length - 1][key.bg]}" -->
		<!-- <path 
			d={path_bg2(data[series[0]])}
			class="area_enforced"
			role="img"
		/> -->

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
	<!-- <Axis {width} {height} {margin} scale={y_bg} position='right' format={format.y} time= {''} /> -->
	<Axis {width} {height} {margin} scale={x} position='bottom' format={format.x} time= {''} />
	<g>
		{#if tooltip}
			<text
				x={x(datum[series[0]][key.x])}
				y={y(0) - 20}
				pointer-events="none"
				text-anchor={getAnchor(x(datum[series[0]][key.x]))}
				class="tooltip vaccine percentage"
			>
				{`Vac. 1a dosi: ${format.pct(datum[series[0]][key.bg1])}%`}
			</text>
			<text
				x={x(datum[series[0]][key.x])}
				y={y(0) - 5}
				pointer-events="none"
				text-anchor={getAnchor(x(datum[series[0]][key.x]))}
				class="tooltip complete vaccine percentage"
			>
				{`Vac. 2a dosi: ${format.pct(datum[series[0]][key.bg2])}%`}
			</text>
			{#each series as d,i }
				<!-- svelte-ignore component-name-lowercase -->
				<line
					x1={x(datum[d][key.x])}
					y1={y(0)}
					x2={x(datum[d][key.x])}
					y2={y(datum[d][key.y])}
					pointer-events="none"
					stroke="rgba(0,0,0,.5)"
					stroke-width=.3
					class="tooltip"
				/>
				<circle
					r=3
					cx={x(datum[d][key.x])}
					cy={y(datum[d][key.y])}
					stroke="rgba(0,0,0,1)"
					pointer-events="none"
					stroke-width=2
					class="tooltip blue"
				/>
				<text
					x={x(datum[d][key.x])}
					y={y(datum[d][key.y]) - 8}
					pointer-events="none"
					text-anchor={getAnchor(x(datum[d][key.x]))}
					class="tooltip value"
				>
					{format.y(datum[d][key.y])}
				</text>
				<text
					x={x(datum[d][key.x])}
					y={y(0) + 20}
					pointer-events="none"
					text-anchor={getAnchor(x(datum[d][key.x]))}
					class="tooltip date"
				>
					{format.x(datum[d][key.x])}
				</text>
			{/each}
		{/if}
	</g>
</svg>
{/if}

<style>
	path {
		fill:none;
		stroke-width: 2;
	}
	.area{
		stroke-width: 0;
		stroke:none;
		fill:url(#diagonalHatchOpacity);
	}
	.area_enforced{
		stroke: none;
		fill:url(#diagonalHatchEnforced);
	}
	text {
		fill: #505050;
		font-size: .75rem;
		paint-order: stroke;
		stroke:#f2f2f2;
		stroke-width: 5px;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

</style>
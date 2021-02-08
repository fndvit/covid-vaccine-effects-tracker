<script>
	import { Canvas } from 'svelte-canvas'
	import { extent } from 'd3-array'
	import { scaleLinear } from 'd3-scale'
    import { Delaunay } from 'd3-delaunay'
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
	import Point from './Point.svelte'
	
	const margin = { top: 10, right: 10, bottom: 25, left: 25 }

	let width, height 
	let picked = null, click = false
	
    const points = [...new Array(10000)]
        .map(d => (
            {x1: Math.random() * 400,
            y1: Math.random() * 400,
            x2: Math.random() * 400,
            y2: Math.random() * 400,
        }))

    console.log()

	$: x = scaleLinear()
				 	.domain(extent(points, d => d.x1))
					.range([margin.left, width - margin.right])
					.nice()

	$: y = scaleLinear()
					.domain(extent(points, d => d.y1))
					.range([height - margin.bottom, margin.top])
					.nice()
	
    $: delaunay = Delaunay.from(points, d => x(d[_x]), d => y(d[_y]))
    
    $: _x = 'x1'
    $: _y = 'y1'

</script>
<button on:click={() => {
    _x = 'x2';
    _y = 'y2';
}}>
To
</button>
<button on:click={() => {
    _x = 'x1';
    _y = 'y1';
}}>
Fro
</button>
<div class="canvas" bind:clientWidth={width} bind:clientHeight={height}>
    
	<Canvas 
		{width} {height} 
		style='cursor: pointer'
		on:mousemove={({ offsetX: x, offsetY: y }) => picked = delaunay.find(x, y)}
		on:mouseout={() => picked = null}
		on:mousedown={() => click = true}
		on:mouseup={() => click = false}
	>

		{#each points as point, i}
			<Point 
				x={x(point[_x])} 
				y={y(point[_y])} 
				fill="tomato"
				r={i === picked && !click ? 3 : 1}
                stroke={i === picked && "#000"} 
			/>
		{/each}
	</Canvas>
</div>

<style>
    .canvas {
        width:100%;
        position:relative;
    }
</style>
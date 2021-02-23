<script>
	import { Layer } from 'svelte-canvas'
	import { tweened } from 'svelte/motion';
	import { quadOut, cubicOut } from 'svelte/easing';

	export let x = 0;
	export let y = 0;
	export let r = 1; 
	export let fill = "black"; 
	export let stroke = null; 
    export let strokeWidth = 1;
	
    const radius = tweened(r, { duration: 200, easing:cubicOut});
    const x_pos = tweened(x, { duration: 300, easing:quadOut});
    const y_pos = tweened(y, { duration: 300, easing:quadOut});

    $: radius.set(r);
    $: x_pos.set(x);
    $: y_pos.set(y);
	
	$: render = ({ context }) => {
		context.fillStyle = fill;
		context.beginPath();
		context.arc($x_pos, $y_pos, $radius, 0, 2 * Math.PI);
		context.fill();
		
		if (stroke) {
			context.strokeStyle = stroke;
			context.lineWidth = strokeWidth;
			context.beginPath();
			context.arc($x_pos, $y_pos, $radius + strokeWidth / 2, 0, 2 * Math.PI);
			context.stroke();
		} 
	}
</script>

<Layer {render} priority={stroke && 1} />
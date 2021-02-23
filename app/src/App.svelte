<script>
	import Menu from './components/Menu.svelte'
	import Comunidad from './components/Comunidad.svelte'
	import Credits from './components/Credits.svelte'
	import locale from '@reuters-graphics/d3-locale';

	export let data;
	let width;
	const loc = new locale('es');

	let lastData = new Date(data['si'][data['si'].length -1].data);
</script>

<svelte:window bind:innerWidth={width}/>

<Menu />

<main role='main'>
	<svg 
		xmlns:svg="https://www.w3.org/2000/svg" 
		viewBox="0 0 0 0"
		width=0 height=0
		role='img'
		aria-label='Textura en diagonal para los gráficos'
		alt='Textura en diagonal para los gráficos'
	>	
		<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4">
			<path d="M-1,1 l2,-2
					 M0,4 l4,-4
					 M3,5 l2,-2" 
				  style="stroke:#808080; stroke-width:.3" />
		</pattern>
		<pattern id="diagonalHatchEnforced" patternUnits="userSpaceOnUse" width="4" height="4">
			<path d="M-1,1 l2,-2
					 M0,4 l4,-4
					 M3,5 l2,-2" 
				  style="stroke:#505050; stroke-width:.5" />
		</pattern>
		<pattern id="diagonalHatchOpacity" patternUnits="userSpaceOnUse" width="4" height="4">
			<path d="M-1,1 l2,-2
					 M0,4 l4,-4
					 M3,5 l2,-2" 
				  style="stroke:#000; stroke-width:.5" />
		</pattern>
	</svg>

	<p class="text update">Actualizat a <strong>{lastData.toLocaleDateString('ca-ES',  { month: 'long', day: 'numeric' })}</strong></p>
	<div class="title">
		<h1>Efectes de la vacunació en la població de residències</h1>
	</div>
	<p class="text summary">Les vacunacions tenen un gran impacte en la reducció de la incidència</p>

	<ul>
		<!-- {#each _data as d,i } -->
		<Comunidad {data} height={300}/>
		<!-- {/each} -->
	</ul>

	<Credits />
</main>

<style>
	:global(body, html) {
		background-color: #f2f2f2;
		font-family: neue-haas-grotesk-display, sans-serif;
		font-size: 14px;
	}
	:global(ul) {
		list-style-type: none;
		padding: 0;
	}
	:global(.blue) { 
		fill: #00bbc4;
		background-color: #00bbc4;
	}
	:global(.gray) { fill: #ffffff}
	:global(strong) { font-weight: 600;}
	:global(.text) {
		font-family: neue-haas-grotesk-text, sans-serif;
		font-size: .9rem;
		line-height: 1.5;
		color: #505050;
		padding:0 0 1.5rem 0;
		margin:0;
	}
	:global(.numbers, .headers) {
        display: grid;
        grid-template-columns: 21% 21% 21% 16% 21%;
    }
	ul {
		border-bottom:3px solid #dcdcdc;
	}
	.title {
		display: grid;
		grid-template-columns: 80% auto;
	}
	.selected {
		font-weight: 600;
	}
	.icon {
		width:80%;
		margin:.5rem auto;
	}
	.summary {
		font-size: 1.15rem;
	}
	.update {
		margin:3rem 0 0 0;
		padding:0;
		color:#9f192b;
		font-weight: 400;
		font-size: 1rem;
	}
	main {
		padding: 1em;
		margin: 0 auto;
	}
	h1 {
		font-size:2rem;
		font-weight: 100;
		line-height: 1.35;
		margin-top:0;
		padding-top:0;
	}
	.headers {
		padding: 1rem 1rem .5rem 1rem;
    	margin: 0 -1rem 0 -1rem;
		position:sticky;
		top: 0;
		z-index: 100;
		text-align:right;
		font-size:.7rem;
		text-transform: uppercase;
		background-color: #f2f2f2;
		align-content: end;
		height:4.2rem;
    }
	.header {
		margin:0;
		padding:0;	
		padding-left:2rem;
		cursor: pointer;
		position:relative;
		height:4rem;
		transition: all .3s;
	}
	.header::after {
		width:1rem;
		height:1rem;
		display:block;
		position:absolute;
		bottom:.5rem;
		opacity:.25;
		object-fit: scale-down;
		transition: all .3s;
	}
	.header.selected::after {
		opacity:1;
	}
	.header:not(:first-child)::after{
		content: url('/img/keyboard_arrow_down-24px.svg');
		right:.5rem;
	}
	.header:first-child::after{
		content: url('/img/sort_by_alpha-24px.svg');
		left:0;
		bottom:.85rem;
	}
	.left {
		text-align:left!important;
		padding-left:0!important;
	}
	:global(.link){
        color:#333;
        text-decoration: none;
        border-bottom: 1px dashed #333;
        transition: all .3s;
    }

    :global(.link:hover) {
        color:#505050;
        background-color:#FFF;
        text-decoration: none;
        border-bottom: 1px solid #333;
    }
	:global(.number, .header) {
        padding-left:1rem!important;
    }
	@media screen and (min-width: 640px) {
		:global(body, html) {
			font-size: 16px;
		}
		main {
			padding: 1em;
			margin: 0 auto;
			max-width: 42rem;
		}
		.title {
			display: grid;
			grid-template-columns: 70% auto;
		}
		h1 {
			font-size:3rem;
			line-height: 1.2;
		}
		.icon {
			width:50%;
			margin:0 auto;
		}
	}
</style>
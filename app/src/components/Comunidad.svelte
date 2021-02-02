<script>
    import MultiLine from './charts/MultiLine.svelte'
    // import Legend from './common/Legend.svelte'
    import locale from '@reuters-graphics/d3-locale';

    export let data;
    export let height;
 
    let width = 800;
    let margin = {bottom:20, top:20, left:4, right:4};
    const loc = new locale('es');

    const f = {
		x: loc.formatTime('%b %e'),
        y: loc.format(',.1d'),
        pct: loc.format(',.1f')
    }

    let residencies = data.filter(d => d.residencia === "Si")
    
    residencies.forEach(d => {
        d.data2 = new Date(d.data)                
    });

    let general = data.filter(d => d.residencia === "No")
    
    general.forEach(d => {
        d.data2 = new Date(d.data)                
    });

    // console.log("general:");
    // console.log(general);
    // console.log(height);
    // const legendItems = [
    //     {  
    //         color:'url(#diagonalHatch)',
    //         label:'Vacunas entregadas<br/>(cada semana)'
    //     },
    //     {  
    //         class:'blue',
    //         label:'<strong>Dosis administradas</strong><br/>(diario)'
    //     }
    // ];


</script>

<li class='ccaa'>
Lorem ipsum
  <!-- <div> class='chart' style='height:{height + margin.top + margin.bottom}' bind:clientWidth={width}>  -->
    <MultiLine data={{residencies,general}} series={['residencies','general']} {width} height={height + margin.top + margin.bottom} key={{x: 'data2', y: 'ia14'}} format={f} {margin}/>
<!-- </div> -->

</li>

<style>
    .ccaa {
        padding-bottom: 2rem;
    }
    h2, h3, .number {
        margin:0;
        padding:0;
        hyphens: auto;
    }
    h2, .number { font-size: 1.15rem;}
    h3 { 
        font-size: 1rem;
        color: #505050;
    }
    h2, h3 { font-weight: 600;}
    .icon { 
        width: 80%;
        margin: 0 auto;
    }
    .date {
        color:#505050;
        font-size: .9rem;
        text-align: right;
        margin-top:.5rem;
        font-weight: 400;
    }
    .numbers {
        padding:.5rem 0;
        border-top: 1px solid #dcdcdc;
        border-bottom: 1px dashed #dcdcdc;
        position:sticky;
        top:5.7rem;
        background-color: #f2f2f2;
        z-index:10;
    }
    .number {
        text-align: right;
        font-variant-numeric: tabular-nums;
    }
    .estimates {
        display: grid;
        gap: 1rem;
        grid-template-columns: 80% auto;
    }
    .indent {
        margin-left: 0;
    }
    .chart {
        width:100%;
    }
    a {
        color:#333;
        text-decoration: none;
        border-bottom: 1px dashed #333;
        transition: all .3s;
    }
    .anchor, .anchor:hover {
        color:inherit;
        border: none;
        background-color:inherit;
        scroll-margin-top: 6rem;
    }
    a:hover {
        color:#505050;
        background-color:#FFF;
        text-decoration: none;
        border-bottom: 1px solid #333;
    }
    @media screen and (min-width: 640px) {
		.indent {
            margin-left: 8rem;
        }
        .icon { 
            width: 40%;
            margin: 0 auto;
        }
	}
</style>
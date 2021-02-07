<script>
    import MultiLineWithBb from './charts/MultiLineWithBg.svelte'
    import Legend from './common/Legend.svelte'
    import locale from '@reuters-graphics/d3-locale';
    
    export let data;
    export let height;
 
    let width;
    let margin = {bottom:20, top:20, left:4, right:4};
    const loc = new locale('es');

    const f = {
		x: loc.formatTime('%b %e'),
        y: loc.format(',.1d'),
        pct: loc.format(',.1f')
    }
    
    const legendItems = [
        {  
            color:'#00bbc4',
            label:'Índex IA14 residències'
        },
        {  
            color:'#333',
            label:'Índex IA14 no residències'
        },
        {  
            color:'url(#diagonalHatch)',
            label:'Vacunats en 1a dosi'
        },
        {  
            color:'url(#diagonalHatchEnforced)',
            label:'Vacunats en 2a dosi'
        },
    ];

    const legendItems2 = [
        {  
            color:'#00bbc4',
            label:'IA14 residències'
        },
        {  
            color:'#333',
            label:'IA14 no residències'
        },
        {  
            color:'url(#diagonalHatch)',
            label:'Vacunats en 1a dosi'
        },
        {  
            color:'url(#diagonalHatchEnforced)',
            label:'Vacunats en 2a dosi'
        },
    ];

    let pob_residencies = 65749; //Obtingut a partir de l'excel catalunya_setmanal
                                 //a partir de la IA i el nombre de casos en dues setmanes
                                 //en data 7/2/21

    let IA14_1_09 = data['si'].find(d=>d.data.includes("2020-09-01"));
    data['si'].forEach(d => {
        d.data2 = new Date(d.data);  
        d.indexIA = 100 * d.ia14 / IA14_1_09.ia14;
        d.perc_vacunats = 100 * d.vacunats / pob_residencies;
        d.perc_pauta_completa = 100 * d.pauta_completa /pob_residencies;
    });

    let IA14_1_09_no = data['no'].find(d=>d.data.includes("2020-09-01"));
    data['no'].forEach(d => {
        d.data2 = new Date(d.data)                
        d.indexIA = 100 * d.ia14 / IA14_1_09_no.ia14;
    });
    //console.log(data);

    let max_index_ia14_si = data['si'].find(d=>d.data.includes("2021-01-20")).indexIA;
    let last_index_ia14_si = data['si'][data['si'].length -1].indexIA;
    let perc_reduction_si = 100 * (1 - (last_index_ia14_si/max_index_ia14_si));
    let last_ia14_si = data['si'][data['si'].length -1].ia14;

    let max_index_ia14_no = data['no'].find(d=>d.data.includes("2021-01-20")).indexIA;
    let last_index_ia14_no = data['no'][data['no'].length -1].indexIA;
    let perc_reduction_no = 100 * (1 - (last_index_ia14_no/max_index_ia14_no));
    let last_ia14_no = data['no'][data['no'].length -1].ia14;
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
<p>En la gràfica podem observar l'índex respecte el valor a data de 1 de setembre de 2020 per població 
en residències i en no residències. Com es pot veure, en la segona onada (octubre-novembre 2020)
el comportament de la corba va ser similar entre un grup i un altre. En la tercera onada (gener-febrer 2021),
veiem l'efecte de les vacunacions, fent que la corba de passi de l'índex {loc.format(',.1d')(max_index_ia14_si)} (20 de gener) 
a {loc.format(',.1d')(last_index_ia14_si)} (darrera dada disponible), corresponent a un <strong>{loc.format(',.1d')(perc_reduction_si)}%</strong> de reducció.
En canvi, per a la població no resident, la corba ha passat de {loc.format(',.1d')(max_index_ia14_no)} a  {loc.format(',.1d')(last_index_ia14_no)},
corresponent a un <strong>{loc.format(',.1d')(perc_reduction_no)}%</strong> de reducció.
</p>
<div class='chart' style='height:{height + margin.top + margin.bottom}' bind:clientWidth={width}> 
    <Legend {legendItems} />
    <MultiLineWithBb  {data} 
                series={['si','no']} 
                {width} 
                height={height + margin.top + margin.bottom} 
                key={{x: 'data2', y: 'indexIA', bg1:'perc_vacunats',bg2:'perc_pauta_completa'}} 
                format={f} 
                {margin}
                color = {["#00bbc4","#333"]}/>
    </div>

<p>Si representem els valors d'incidència acumulada a 14 dies, s'obtenen les següents dades, on es pot observar 
    que la població en residències encara té una afectació més alta que la població no resident
    ({loc.format(',.1d')(last_ia14_si)} respecte a {loc.format(',.1d')(last_ia14_no)}).
</p>
<div class='chart' style='height:{height + margin.top + margin.bottom}' bind:clientWidth={width}> 
    <Legend legendItems={legendItems2} />
    <MultiLineWithBb  {data} 
                series={['si','no']} 
                {width} 
                height={height + margin.top + margin.bottom} 
                key={{x: 'data2', y: 'ia14', bg1:'perc_vacunats',bg2:'perc_pauta_completa'}} 
                format={f} 
                {margin}
                color = {["#00bbc4","#333"]}/>
    </div>
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
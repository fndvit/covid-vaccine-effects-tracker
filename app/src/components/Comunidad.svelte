<script>
    import MultiLineWithBb from './charts/MultiLineWithBg.svelte'
    import Legend from './common/Legend.svelte'
    import locale from '@reuters-graphics/d3-locale';
    
    export let data;
    export let height;
 
    let width;
    let margin = {bottom:20, top:20, left:4, right:4};
    const loc = new locale('es');
    let formatTimeCat = (d) => d.toLocaleDateString('ca-ES',  { month: 'short', day: 'numeric' });

    const f = {
		// x: loc.formatTime('%b %e'),
		x: formatTimeCat,
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
    ];

    const legendItems2 = [
        {  
            color:'#00bbc4',
            label:'Índex IA14 residències'
        },
        {  
            color:'#333',
            label:'Índex IA14 no residències'
        },
        {  
            color:'url(#diagonalHatchOpacity)',
            label:'Vacunats'
        }
    ];

    const legendItems3 = [
        {  
            color:'#00bbc4',
            label:'IA14 residències'
        },
        {  
            color:'#333',
            label:'IA14 no residències'
        },
        {  
            color:'url(#diagonalHatchOpacity)',
            label:'Vacunats'
        }
    ];
    const legendItems4 = [
        {  
            color:'#00bbc4',
            label:'Exitus residències'
        },
        {  
            color:'#333',
            label:'Exitus no residències'
        },
        {  
            color:'url(#diagonalHatchOpacity)',
            label:'Vacunats'
        }
    ];
    let pob_residencies = 65749; //Obtingut a partir de l'excel catalunya_setmanal
                                 //a partir de la IA i el nombre de casos en dues setmanes
                                 //en data 7/2/21

    let IA14_02_11 = data['si'].find(d=>d.data.includes("2020-11-02"));
    let IA14_20_01 = data['si'].find(d=>d.data.includes("2021-01-20"));
    data['si'].forEach(d => {
        d.data2 = new Date(d.data);  
        d.indexIA_2o = 100 * d.ia14 / IA14_02_11.ia14;
        d.indexIA_3o = 100 * d.ia14 / IA14_20_01.ia14;
        d.perc_vacunats = 100 * d.vacunats / pob_residencies;
        d.perc_pauta_completa = 100 * d.pauta_completa /pob_residencies;
    });

    let IA14_02_11_no = data['no'].find(d=>d.data.includes("2020-11-02"));
    let IA14_20_01_no = data['no'].find(d=>d.data.includes("2021-01-20"));
    data['no'].forEach(d => {
        d.data2 = new Date(d.data)                
        d.indexIA_2o = 100 * d.ia14 / IA14_02_11_no.ia14;
        d.indexIA_3o = 100 * d.ia14 / IA14_20_01_no.ia14;
    });
    //console.log(data);

    const init_2aOnada = new Date(2020, 9, 1); //1 d'octubre de 2020
    const end_2aOnada = new Date(2020, 11, 15); //14 de desembre de 2020
    const data_si_2o = data['si'].filter(d=>d.data2 >= init_2aOnada && d.data2 <= end_2aOnada);
    const data_no_2o = data['no'].filter(d=>d.data2 >= init_2aOnada && d.data2 <= end_2aOnada);
    let data_2aOnada = {si:data_si_2o, no:data_no_2o};
        
    const init_3aOnada = new Date(2020, 11, 15); //15 de desembre de 2020
    const data_si_3o = data['si'].filter(d=>d.data2 >= init_3aOnada );
    const data_no_3o = data['no'].filter(d=>d.data2 >= init_3aOnada );
    let data_3aOnada = {si:data_si_3o, no:data_no_3o};
        

    let max_index_ia14_si = data['si'].find(d=>d.data.includes("2021-01-20")).indexIA_3o;
    let last_index_ia14_si = data['si'][data['si'].length -1].indexIA_3o;
    let perc_reduction_si = 100 * (1 - (last_index_ia14_si/max_index_ia14_si));
    let last_ia14_si = data['si'][data['si'].length -1].ia14;

    let max_index_ia14_no = data['no'].find(d=>d.data.includes("2021-01-20")).indexIA_3o;
    let last_index_ia14_no = data['no'][data['no'].length -1].indexIA_3o;
    let perc_reduction_no = 100 * (1 - (last_index_ia14_no/max_index_ia14_no));
    let last_ia14_no = data['no'][data['no'].length -1].ia14;


    // console.log("general:");
    //console.log(data);
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

<h3>2a Onada</h3>
<p>En la gràfica podem observar l'índex respecte el valor màxim de la segona onada (que es produí el 2 de novembre de 2020) 
en residències i en no residències. Com es pot veure, en aquesta segona onada el comportament de la corba va ser 
similar entre un grup i un altre. </p>

<div class='chart' style='height:{height + margin.top + margin.bottom}' bind:clientWidth={width}> 
    <Legend {legendItems} />
    <MultiLineWithBb  data = {data_2aOnada} 
                series={['si','no']} 
                {width} 
                height={height + margin.top + margin.bottom} 
                key={{x: 'data2', y: 'indexIA_2o', bg1:'perc_vacunats',bg2:'perc_pauta_completa'}} 
                format={f} 
                {margin}
                color = {["#00bbc4","#333"]}/>
    </div>

<h3>3a Onada</h3>
<p>En la tercera onada (gener-febrer 2021),
veiem l'efecte de les vacunacions, fent que la corba de passi de l'índex {loc.format(',.1d')(max_index_ia14_si)} (20 de gener) 
a {loc.format(',.1d')(last_index_ia14_si)} (darrera dada disponible), corresponent a un <strong>{loc.format(',.1d')(perc_reduction_si)}%</strong> de reducció.
En canvi, per a la població no resident, la corba ha passat de {loc.format(',.1d')(max_index_ia14_no)} a  {loc.format(',.1d')(last_index_ia14_no)},
corresponent a un <strong>{loc.format(',.1d')(perc_reduction_no)}%</strong> de reducció.
</p>

<div class='chart' style='height:{height + margin.top + margin.bottom}' bind:clientWidth={width}> 
    <Legend legendItems={legendItems2} />
    <MultiLineWithBb  data = {data_3aOnada} 
                series={['si','no']} 
                {width} 
                height={height + margin.top + margin.bottom} 
                key={{x: 'data2', y: 'indexIA_3o', bg1:'perc_vacunats',bg2:'perc_pauta_completa'}} 
                format={f} 
                {margin}
                color = {["#00bbc4","#333"]}/>
</div>

<h3>Valors absoluts d'incidència acumulada</h3>
<p>Si representem els valors d'incidència acumulada a 14 dies, s'obtenen les següents dades, on es pot observar 
    que la població en residències encara té una afectació més alta que la població no resident
    ({loc.format(',.1d')(last_ia14_si)} respecte a {loc.format(',.1d')(last_ia14_no)}).
</p>
    <div class='chart' style='height:{height + margin.top + margin.bottom}' bind:clientWidth={width}> 
    <Legend legendItems={legendItems3} />
    <MultiLineWithBb  {data} 
                series={['si','no']} 
                {width} 
                height={height + margin.top + margin.bottom} 
                key={{x: 'data2', y: 'ia14', bg1:'perc_vacunats',bg2:'perc_pauta_completa'}} 
                format={f} 
                {margin}
                color = {["#00bbc4","#333"]}/>
    </div>

    <h3>Valors absoluts d'exitus</h3>
    <p>Si representem els exitus, s'obtenen les següents dades:
    </p>
        <div class='chart' style='height:{height + margin.top + margin.bottom}' bind:clientWidth={width}> 
        <Legend legendItems={legendItems4} />
        <MultiLineWithBb  {data} 
                    series={['si','no']} 
                    {width} 
                    height={height + margin.top + margin.bottom} 
                    key={{x: 'data2', y: 'exitus', bg1:'perc_vacunats',bg2:'perc_pauta_completa'}} 
                    format={f} 
                    {margin}
                    color = {["#00bbc4","#333"]}/>
        </div>
    
    
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
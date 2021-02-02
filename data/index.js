const dir = require('node-dir');
const d3time = require('d3-time-format');
const {prov} = require('./utils/prov-to-ccaa')
const csv = require("csv-parse/lib/sync");
const request = require('request');
const unzipper = require('unzipper');
const {writeJSON, writeCSV} = require('./utils/write');

const dest = '../app/public/'
 
const main = async () => {
  const directory = await unzipper.Open.url(request,'https://dadescovid.cat/static/csv/catalunya_setmanal.zip');
  const file = directory.files.find(d => d.path === 'catalunya_setmanal.csv');
  const content = await file.buffer();
  const raw = content.toString();
  const _data = csv(raw, {
    trim: true,
    delimiter: ';',
    columns:true,
    skip_empty_lines: true
  })

  const data = _data.map(d => {
    const o = {}
    o.data = new Date(d.DATA_FI);
    o.residencia = d.RESIDENCIA;
    o.r0 = +d.R0_CONFIRMAT_M;
    o.ia14 = +d.IA14;
    o.confirmats = +d.CASOS_CONFIRMAT;
    o.taxa_confirmats = +d.TAXA_CASOS_CONFIRMAT;
    o.ingressos_total = +d.INGRESSOS_TOTAL;
    o.ingressos_crit = +d.INGRESSOS_CRITIC;
    o.vacunats = +d.VACUNATS_DOSI_1;
    o.pauta_completa = +d.VACUNATS_DOSI_2;
    return {...o}
  }).filter(d => d.data >= new Date('2020-12-01'))

  writeJSON(data, 'catalunya_setmanals', dest)
}
 
main();
const dir = require('node-dir');
const d3time = require('d3-time-format');
const {prov} = require('./utils/prov-to-ccaa')
const csv = require("csv-parse/lib/sync");
const request = require('request');
const unzipper = require('unzipper');
const {writeJSON, writeCSV} = require('./utils/write');
const aq = require('arquero')

const dest = '../app/public/'
 
const main = async () => {

  const filterDate = new Date('2020-09-01');

  const weekly = aq.fromCSV(
    await unzip('https://dadescovid.cat/static/csv/catalunya_setmanal.zip', 'catalunya_setmanal.csv'),
    {delimiter: ';'}
  )
    .select({RESIDENCIA:'residencia',DATA_FI:'data',IA14:'ia14',TAXA_CASOS_CONFIRMAT:'taxa_confirmats',CASOS_CONFIRMAT:'confirmats',INGRESSOS_TOTAL:'ingressos'})

  const daily = aq.fromCSV(
    await unzip('https://dadescovid.cat/static/csv/catalunya_diari.zip', 'catalunya_diari.csv'),
    {delimiter: ';'}
  )
  .groupby('DATA', 'RESIDENCIA')
  .rollup({
    VACUNATS: d => aq.op.sum(d.VACUNATS_DOSI_1),
    VACUNATS2: d => aq.op.sum(d.VACUNATS_DOSI_2)
  })

  const rename = [{DATA:'data'},{CUM_VACUNATS:'vacunats'}, {CUM_VACUNATS2: 'pauta_completa'},'ia14','taxa_confirmats','confirmats','ingressos'];
  const derive = {
    CUM_VACUNATS: aq.rolling(d => aq.op.sum(d.VACUNATS + d.VACUNATS2)),
    CUM_VACUNATS2: aq.rolling(d => aq.op.sum(d.VACUNATS2))
  }

  const res_si = daily
    .filter(d => d.RESIDENCIA === 'Si')
    .join(weekly.filter(d=> d.residencia === 'Si'), ['DATA', 'data'])
    .orderby('DATA')
    .derive(derive)
    .select(rename)

  const res_no = daily
    .filter(d => d.RESIDENCIA === 'No')
    .join(weekly.filter(d=> d.residencia === 'No'), ['DATA', 'data'])
    .orderby('DATA')
    .derive(derive)
    .select(rename);

  const res_indef = daily
    .filter(d => d.RESIDENCIA === '--')
    .join(weekly.filter(d=> d.residencia === '--'), ['DATA', 'data'])
    .orderby('DATA')
    .derive(derive)
    .select(rename)

  const data = {
    si:res_si.objects().filter(d => d.data >= filterDate),
    no:res_no.objects().filter(d => d.data >= filterDate),
    indefinit:res_indef.objects().filter(d => d.data >= filterDate),
  }

  writeJSON(data, 'data_residence', dest)

}

const unzip = async (url, file) => {
  const dir = await unzipper.Open.url(request, url);
  const f = dir.files.find(d => d.path === file);
  const raw = await f.buffer();
  return raw.toString();
}
 
main();
const fetch = require('node-fetch');
const dir = require('node-dir');
const d3time = require('d3-time-format');
const fs = require('fs');
const aq = require('arquero');
// const {writeCSV, writeJSON} = require('./utils/write');
// const {listDates, find, download, dateDiff, approxDate, sNumber} = require('./utils/utils');
// const groupby = require('lodash/groupBy');
// const d2lIntl = require('d2l-intl');
// const {extent} = require('d3-array');

fetch('')
  .then(res => res.json())
  .then(json => {
    console.log(json)
  })
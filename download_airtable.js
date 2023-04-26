require('dotenv').config();
const path = require('path');

if (process.env.AIRTABLE_TOKEN === undefined) {
  console.error('Please set the AIRTABLE_TOKEN environment variable');
  process.exit(1);
}

const Airtable = require('airtable');
const fs = require('fs-extra');

Airtable.configure({
  apiKey: process.env.AIRTABLE_TOKEN
});
const base = Airtable.base('appR5gUvSEznOM3Qn');

async function downloadTable(tableName) {
  const records = await base(tableName).select().all();
  let jsonRecords = records.map(record => record.fields);
  // jsonRecords = Promise.all(jsonRecords.map(record => { 
  return { tableName, records, jsonRecords };
}

const fieldMappings = {
  'subject_refs': 'Subjects',
  'interviewers': 'Interviewers',
  'programs': 'Programs',
  has(obj) {
    return Object.keys(this).some(key => Object.keys(obj).indexOf(key) !== -1);
  },
  recordsToBeConverted(obj) {
    return Object.keys(this).filter(key => Object.keys(obj).indexOf(key) !== -1);
  }
};
async function downloadAllTables() {
  /***************************************************************************************
   * WE CREATE THE TABLENAMES ARRAY TO HOLD THE NAMES OF THE TABLES WE WANT TO DOWNLOAD. *
   ***************************************************************************************/
  const tableNames = [
    'Index',
    'Subjects',
    'Programs',
    'Interviewers'
  ];
  /*********************************************************************************************
   * WE CREATE AN EMPTY TABLES OBJECT TO STORE THE TABLE OBJECTS WE’LL GET FROM DOWNLOADTABLE. *
   *********************************************************************************************/
  const tables = {};

  /****************************************************************************************************
   * WE LOOP THROUGH THE TABLENAMES ARRAY, DOWNLOADING EACH TABLE AND ADDING IT TO THE TABLES OBJECT. *
   ****************************************************************************************************/
  console.log('starting to download tables');
  for (const tableName of tableNames) {
    console.log('Downloading table: ' + tableName);
    tables[tableName] = await downloadTable(tableName);
  }

  console.log('finished downloading tables');
  /***************************************************************************
   * WE LOOP THROUGH THE TABLES OBJECT AND UPDATE THE RECORDS IN EACH TABLE. *
   ***************************************************************************/
  for (let tableName in tables) {
    const table = tables[tableName];
    /*********************************************************************
     * WE LOOP THROUGH THE RECORDS IN EACH TABLE AND UPDATE THE RECORDS. *
     *********************************************************************/
    table.jsonRecords = table.jsonRecords.map(record => {
      /********************************************************************************
       * IF THE RECORD CONTAINS FIELDS WE WANT TO UPDATE, WE LOOP THROUGH THE FIELDS. *
       ********************************************************************************/
      if (fieldMappings.has(record)) {
        /********************************************************************
         * WE LOOP THROUGH THE FIELDMAPPINGS OBJECT AND UPDATE THE RECORDS. *
         ********************************************************************/
        fieldMappings.recordsToBeConverted(record).forEach(key => {
          /***********************************************************************
           * WE CONVERT THE RECORDS FROM AN ARRAY OF IDS TO AN ARRAY OF RECORDS. *
           ***********************************************************************/
          record[key] = record[key].map(id => {
            return [...tables[fieldMappings[key]].records].find(r => r.id === id).fields.uri;
          });
        });
      }
      return record;
    });

      /*******************************
       * SPECIAL TREATMENT FOR INDEX *
       *******************************/
    // if table is index 
    if (tableName === 'Index') {
      // loop through records
      table.jsonRecords = table.jsonRecords.map(record => { 
        record.recording_dates = record.recording_dates || [];
        record.birth_place_cities = record.birth_place_cities || [ null ];
        record.birth_place_countries = record.birth_place_countries || [ null ];
        record.birth_years = record.birth_years?.map(year => (+year).toFixed(1)) || [];
        record.subject_refs = record.subject_refs || [];
        record.programs = record.programs || [];
        record.interviewers = record.interviewers || [];
        record.birth_place = record.birth_place || null;
        record.birth_date = record.birth_date || null;

        return record;
      });
    }
    /****************************************
     * WE WRITE THE RECORDS TO A JSON FILE. *
     ****************************************/
    fs.ensureDirSync(path.resolve(__dirname, `./src/Data/json/from_airtable`));
    fs.writeFileSync(path.resolve(__dirname, `./src/Data/json/${tableName}.json`), JSON.stringify(table.jsonRecords, null, 2));

  }

}

downloadAllTables();
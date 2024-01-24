const xlsxj = require("xlsx-to-json");
const fs = require('fs');
const moment = require('moment');
const util = require('util')
const axios = require('axios');
require('dotenv').config()

const gemini = require('./AIServices/gemini.js');
const openai = require('./AIServices/openai.js');
const { TIME_LOG_DATE_FORMAT, JOB_API_DATE_FORMAT } = require('./constants');
const getJobList = require('./APIServices/listJobs');
const submitTimesheet = require('./APIServices/submitTimesheet');
const logger = require('./logger/winston');
logger.info('Starting script...');

const xlsxjPromise = util.promisify(xlsxj)

const { EMAIL } = process.env;

async function processArray(inputArray) {
  try {
    const map = {};
    for (const item of inputArray) {
      let { Description: description, 'Work Item': taskName, Hours: hours, Start_date, End_date, Paraphase, 'Check Grammer': checkGrammer } = item;

      if (checkGrammer === 'TRUE' || Paraphase === 'TRUE') {
        if (process.env.AI_MODAL === 'gemini') {
          description = await gemini(description, checkGrammer === 'TRUE');
        } else if (process.env.AI_MODAL === 'openai') {
          description = await openai(description, checkGrammer === 'TRUE');
        }
      }
      if (Start_date && End_date) {
        let startDate = moment(Start_date, TIME_LOG_DATE_FORMAT);
        let endDate = moment(End_date, TIME_LOG_DATE_FORMAT);
        for (let d = moment(startDate); d.isSameOrBefore(endDate); d.add(1, 'days')) {
          const response = await getJobList(d.format(JOB_API_DATE_FORMAT));
          const matchingItem = response.data.data.find(responseItem =>
            responseItem.projectName === item['Project Name'] &&
            responseItem.name === item['Job Name']
          );
          if (matchingItem) {
            item.jobId = matchingItem.id;
          }
          const dateStr = d.format(TIME_LOG_DATE_FORMAT);
          if (!map[dateStr]) {
            map[dateStr] = [];
          }
          map[dateStr].push({
            description, taskName, hours, date: dateStr, jobId: item.jobId,
            "id": "",
            "isEditAllowed": true,
            "isUkShift": false,
            "isUsShift": false,
            "isWeekend": false,
            "submittedBy": EMAIL,
            "timelogId": null,
            "user": EMAIL
          });
        }
      } else if (Start_date) {
        const d = moment(Start_date, TIME_LOG_DATE_FORMAT);
        const dateStr = d.format(TIME_LOG_DATE_FORMAT);
        if (!map[dateStr]) {
          map[dateStr] = [];
        }
        const response = await getJobList(d.format(JOB_API_DATE_FORMAT));
        const matchingItem = response.data.data.find(responseItem =>
          responseItem.projectName === item['Project Name'] &&
          responseItem.name === item['Job Name']
        );
        if (matchingItem) {
          item.jobId = matchingItem.id;
        }
        map[dateStr].push({
          description, taskName, hours, date: dateStr, jobId: item.jobId,
          "id": "",
          "isEditAllowed": true,
          "isUkShift": false,
          "isUsShift": false,
          "isWeekend": false,
          "submittedBy": EMAIL,
          "timelogId": null,
          "user": EMAIL
        });
      }
    }
    const output = Object.keys(map).map(date => ({ date, tasks: map[date] }));
    return output;

  } catch (error) {
    logger.error('🚀 ~ file: index.js:88 ~ processArray ~ error:', error)
    throw new Error(error);
  }
}

const runScript = async () => {
  try {
    // convert excel file to json files
    const jsonData = await xlsxjPromise({
      input: "timesheet.xlsx",
      output: "output.json"
    });
    logger.debug('xlsx to json conversion done!!!')

    const processedArray = await processArray(jsonData)
    logger.debug('processing array done!!!')
    fs.writeFile("thing.json", JSON.stringify(processedArray), function (err, result) {
      if (err) console.log('error', err);
    });

    const submitTimeSheetPromises = processedArray.map((data) => {
      const hours = data.tasks.reduce((acc, task) => acc + Number(task.hours), 0)
      if (hours < process.env.HOURS_PER_DAY) {
        logger.info(`Hours for ${data.date} is less than ${process.env.HOURS_PER_DAY}`)
      }
      return submitTimesheet(data)
    })

    await Promise.all(submitTimeSheetPromises)

    console.log('Timesheet submitted successfully!!!')
    return { status: 'success' }

  } catch (error) {
    console.log('🚀 ~ file: index.js:106 ~ runScript ~ error:', error, error?.response?.data, error?.message)
    throw new Error(error);
  }
}

runScript()
const moment = require('moment');

const fetchSubmittedLogs = require('./APIServices/fetchSubmittedLogs');
const logger = require('./logger/winston');
logger.info('Starting script...');

const calculateMissingHours = async (month) => {
  try {
    const firstDayOfMonth = moment(month, 'MM/YYYY').startOf('month');
    const lastDayOfMonth = moment(month, 'MM/YYYY').endOf('month');
    for (let d = moment(firstDayOfMonth); d.isSameOrBefore(lastDayOfMonth); d.add(1, 'days')) {
      const response = await fetchSubmittedLogs(d.format('DD-MMM-YYYY'));
      const totalHours = (response.data.data.reduce((acc, item) => {
        return acc + item.hoursInMins;
      }, 0)/60);
      if (totalHours != Number(process.env.HOURS_PER_DAY)) {
        logger.info(`Hours submitted: ${d.format('DD/MM/YYYY')} is ${totalHours}`);
      }
    }
  } catch (error) {
    logger.error('Error while calculating missing hours', error);
  }
}

calculateMissingHours('01/2024');
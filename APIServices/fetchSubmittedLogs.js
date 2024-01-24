const axios = require('axios');
require('dotenv').config()

const logger = require('../logger/winston');
const token = process.env.TOKEN;

const headers = { 
  'authority': 'india-001.azure-apim.net', 
  'accept': '*/*', 
  'accept-language': 'en-US', 
  'authorization': token, 
  'cache-control': 'no-cache, no-store', 
  'content-type': 'application/json', 
  'origin': 'https://apps.powerapps.com', 
  'pragma': 'no-cache', 
  'referer': 'https://apps.powerapps.com/', 
  'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"', 
  'sec-ch-ua-mobile': '?0', 
  'sec-ch-ua-platform': '"Linux"', 
  'sec-fetch-dest': 'empty', 
  'sec-fetch-mode': 'cors', 
  'sec-fetch-site': 'cross-site', 
  'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36', 
  'x-ms-client-app-id': '/providers/Microsoft.PowerApps/apps/9e9ab14c-50bc-4870-b533-2cf927f57b01', 
  'x-ms-client-app-version': '2023-08-28T06:29:13Z', 
  'x-ms-client-environment-id': '/providers/Microsoft.PowerApps/environments/default-a3ba1793-2843-406e-9ee0-86d3cff47e2c', 
  'x-ms-client-object-id': process.env.CLIENT_OBJECT_ID,
  'x-ms-client-request-id': process.env.CLIENT_REQUEST_ID,
  'x-ms-client-session-id': process.env.CLIENT_SESSION_ID,
  'x-ms-client-tenant-id': 'a3ba1793-2843-406e-9ee0-86d3cff47e2c', 
  'x-ms-request-method': 'POST', 
  'x-ms-request-url': '/apim/logicflows/018d6a00440c4ed9a57438cf9329fbd5/triggers/manual/run?api-version=2015-02-01-preview', 
  'x-ms-user-agent': 'PowerApps/3.23122.15 (Web Player; AppName=9e9ab14c-50bc-4870-b533-2cf927f57b01)'
};

const data = {
  // "HTTP_Body": "03-Jan-2024",
  // "HTTP_Body_1": "03-Jan-2024",
  "HTTP_Body_2": process.env.EMAIL,
  "HTTP_URI": process.env.AZILEN_URL
}

/**
 * 
 * @param {date} date format: DD-MMM-YYYY
 * @returns [
    {
        "id": "ca40cf90-a94d-11ee-96aa-ff86211c7f61",
        "zoho_id": null,
        "description": "Team Meeting",
        "hours": "01:00",
        "isEditAllowed": true,
        "jobId": "38330000020676711",
        "user": "piyush.koradiya@azilen.com",
        "workDate": "2024-01-03T06:30:00.000Z",
        "billingStatus": "Non-billable",
        "approvalStatus": "notsubmitted",
        "taskName": "Apax",
        "hoursInMins": 60,
        "jobName": "Team Meeting",
        "projectId": "38330000020239907",
        "projectName": "Novusnorth_Apax Support",
        "employeeMailId": "piyush.koradiya@azilen.com",
        "comment": null,
        "isDeleteAllowed": null,
        "timesheetId": null,
        "submittedOn": "2024-01-02T09:03:26.717Z",
        "submittedBy": "piyush.koradiya@azilen.com",
        "approvedOn": "2024-01-02T09:03:26.717Z",
        "approvedOrRejectedBy": null,
        "syncWithZohoAttendence": false,
        "syncAttemptCount": 0,
        "isUsShift": false,
        "isUkShift": false,
        "isWeekend": false,
        "date": "03/01/2024",
        "timelogId": "ca40cf90-a94d-11ee-96aa-ff86211c7f61",
        "isEdit": false
    },
    {
        "id": "ca441b59-a94d-11ee-96aa-fbaf4e4dd961",
        "zoho_id": null,
        "description": "Learning and Exploration",
        "hours": "01:00",
        "isEditAllowed": true,
        "jobId": "38330000024995769",
        "user": "piyush.koradiya@azilen.com",
        "workDate": "2024-01-03T06:30:00.000Z",
        "billingStatus": "Non-billable",
        "approvalStatus": "notsubmitted",
        "taskName": "Learning and Exploration",
        "hoursInMins": 60,
        "jobName": "Learning and Exploration",
        "projectId": "38330000020239907",
        "projectName": "Novusnorth_Apax Support",
        "employeeMailId": "piyush.koradiya@azilen.com",
        "comment": null,
        "isDeleteAllowed": null,
        "timesheetId": null,
        "submittedOn": "2024-01-02T09:03:26.708Z",
        "submittedBy": "piyush.koradiya@azilen.com",
        "approvedOn": "2024-01-02T09:03:26.708Z",
        "approvedOrRejectedBy": null,
        "syncWithZohoAttendence": false,
        "syncAttemptCount": 0,
        "isUsShift": false,
        "isUkShift": false,
        "isWeekend": false,
        "date": "03/01/2024",
        "timelogId": "ca441b59-a94d-11ee-96aa-fbaf4e4dd961",
        "isEdit": false
    }
]
 */

module.exports = async function fetchSubmittedLogs(date) {
  logger.debug(`Getting submitted logs for date: ${date}`);
  try {
    data.HTTP_Body = date;
    data.HTTP_Body_1 = date;
    const response = await axios.post(process.env.TEAMS_URL, data, { headers });
    return response;
  } catch (error) {
    console.error('Error while fetching submitted logs', error, error.response.data, error.response.data?.innerError?.error);
    throw new Error(error);
  }
}
// Date: 28/12/2023
// Created By: Piyush

const axios = require('axios');

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
  'x-ms-request-url': `/apim/logicflows/${process.env.REQUEST_URL_ID_JOB_LIST}/triggers/manual/run?api-version=2015-02-01-preview`,
  'x-ms-user-agent': 'PowerApps/3.23122.15 (Web Player; AppName=9e9ab14c-50bc-4870-b533-2cf927f57b01)'
};

const data = {
  'HTTP_URI': `${process.env.AZILEN_URL}/employee/${process.env.EMAIL}`,
};

module.exports = async function getJobList(date) {
  logger.debug(`Getting job list for date: ${date}`);
  try {
    data.HTTP_Body = date;
    const response = await axios.post(process.env.TEAMS_URL, data, { headers });
    return response;
  } catch (error) {
    console.error('Error while fetching job list', error.response.data);
    throw new Error(error);
  }
}
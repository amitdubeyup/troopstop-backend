const AWS = require("aws-sdk");
AWS.config.update({ region: "ap-south-1" });
const S3 = new AWS.S3({ endpoint: 'https://s3.ap-south-1.amazonaws.com' });

require('dotenv').config();

module.exports = {
  S3: S3,
  database: process.env.DATABASE,
  serverSecret: process.env.SERVER_SECRET,
  tokenExpire: process.env.TOKEN_EXPIRE,
  google_api_key: process.env.GOOGLE_API_KEY,
};
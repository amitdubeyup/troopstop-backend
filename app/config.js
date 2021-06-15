const AWS = require("aws-sdk");
AWS.config.update({region: "ap-south-1"});
const S3 = new AWS.S3({ endpoint: 'https://s3.ap-south-1.amazonaws.com' });

module.exports = {
  S3: S3,
  database: 'mongodb+srv://troopstop:troopstop@troopstop.kqem8.mongodb.net/troopstop',
  serverSecret: '$2y$12$4A2phQdjCl9fFvcuTHpn3.l7mZTBNagz4HrApfnY1tJYcyHgalifK',
  tokenExpire: '30d',
  google_api_key: 'AIzaSyCJnen-AB1eM6aoGKKLSnA1cyDIQknzD5Q',
};
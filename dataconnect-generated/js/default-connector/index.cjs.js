const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'crypto-bank-rb',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;


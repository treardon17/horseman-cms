const { GQC }  =  require('graphql-compose');

const ModuleSettingsSchema = require('./module_settings.js');
const ModuleSchema = require('./module.js');

const graphqlSchema = GQC.buildSchema();
module.exports = graphqlSchema;

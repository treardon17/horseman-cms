const Database = require('../db/database.js');
const mongoose = require('mongoose');
const ComposeWithMongoose = require('graphql-compose-mongoose');
const { GQC }  =  require('graphql-compose');

// Create a schema for our MongoDB collection
const ModuleSettingSchema = new mongoose.Schema({
  name: String,
  fields: {
    type: mongoose.Schema.Types.Mixed,
    description: 'JSON object defining the fields available in a particular module type',
  },
});
const ModuleSettingModel = mongoose.model('ModuleSettingModel', ModuleSettingSchema);

// Convert Mongoose model to GraphQL pieces
const customizationOptions = {}; // left it empty for simplicity, described below
const ModuleSettingTC = ComposeWithMongoose.composeWithMongoose(ModuleSettingModel, customizationOptions);

// Generate the fields we need to query for the different pieces of data
GQC.rootQuery().addFields({
  moduleSettingById: ModuleSettingTC.getResolver('findById'),
  moduleSettingByIds: ModuleSettingTC.getResolver('findByIds'),
  moduleSettingOne: ModuleSettingTC.getResolver('findOne'),
  moduleSettingMany: ModuleSettingTC.getResolver('findMany'),
  moduleSettingCount: ModuleSettingTC.getResolver('count'),
  moduleSettingConnection: ModuleSettingTC.getResolver('connection'),
  moduleSettingPagination: ModuleSettingTC.getResolver('pagination'),
});
 
GQC.rootMutation().addFields({
  moduleSettingCreate: ModuleSettingTC.getResolver('createOne'),
  moduleSettingUpdateById: ModuleSettingTC.getResolver('updateById'),
  moduleSettingUpdateOne: ModuleSettingTC.getResolver('updateOne'),
  moduleSettingUpdateMany: ModuleSettingTC.getResolver('updateMany'),
  moduleSettingRemoveById: ModuleSettingTC.getResolver('removeById'),
  moduleSettingRemoveOne: ModuleSettingTC.getResolver('removeOne'),
  moduleSettingRemoveMany: ModuleSettingTC.getResolver('removeMany'),
});
 
// const graphqlSchema = GQC.buildSchema();
// module.exports = graphqlSchema;
module.exports = GQC;

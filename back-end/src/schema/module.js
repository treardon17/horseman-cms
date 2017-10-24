const Database = require('../db/database.js');
const mongoose = require('mongoose');
const ComposeWithMongoose = require('graphql-compose-mongoose');
const { GQC }  =  require('graphql-compose');

// Create a schema for our MongoDB collection
const ModuleSchema = new mongoose.Schema({
  name: String,
  slug: String,
  dateCreated: Date,
  dateModified: Date,
  tags: [String],
  pages: [String],
  fields: {
    type: mongoose.Schema.Types.Mixed,
    description: 'JSON object defining the data specific to a particular module',
  },
});
const ModuleModel = mongoose.model('ModuleModel', ModuleSchema);

// Convert Mongoose model to GraphQL pieces
const customizationOptions = {}; // left it empty for simplicity, described below
const ModuleTC = ComposeWithMongoose.composeWithMongoose(ModuleModel, customizationOptions);

// Generate the fields we need to query for the different pieces of data
GQC.rootQuery().addFields({
  moduleSettingById: ModuleTC.getResolver('findById'),
  moduleSettingByIds: ModuleTC.getResolver('findByIds'),
  moduleSettingOne: ModuleTC.getResolver('findOne'),
  moduleSettingMany: ModuleTC.getResolver('findMany'),
  moduleSettingCount: ModuleTC.getResolver('count'),
  moduleSettingConnection: ModuleTC.getResolver('connection'),
  moduleSettingPagination: ModuleTC.getResolver('pagination'),
});
 
GQC.rootMutation().addFields({
  moduleSettingCreate: ModuleTC.getResolver('createOne'),
  moduleSettingUpdateById: ModuleTC.getResolver('updateById'),
  moduleSettingUpdateOne: ModuleTC.getResolver('updateOne'),
  moduleSettingUpdateMany: ModuleTC.getResolver('updateMany'),
  moduleSettingRemoveById: ModuleTC.getResolver('removeById'),
  moduleSettingRemoveOne: ModuleTC.getResolver('removeOne'),
  moduleSettingRemoveMany: ModuleTC.getResolver('removeMany'),
});
 
// const graphqlSchema = GQC.buildSchema();
// module.exports = graphqlSchema;
module.exports = GQC
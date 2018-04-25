

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// delering sub schema
var state_object =
    new Schema({id: Schema.Types.Number, state: Schema.Types.Boolean});

var deviceStateModelSchema = new Schema(
    {
      device_id: {type: ObjectId, required: true},
      state_array: [{id: {type: Number}, state: {type: Boolean}}]
    },
    {collection: 'state_storage'});

var deviceState = mongoose.model('state_storage', deviceStateModelSchema);
module.exports = deviceState;
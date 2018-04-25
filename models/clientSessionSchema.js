
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

// delering sub schema
var clientSessionModelSchema = new Schema({
  user_id:
      {type: ObjectId, required: [true, 'user_id is required']},
  expiry: {type:Number, required: [true, 'expiry time is required']},
  sessionId: {
    type: String,
    required: [true, 'sessionId is required!'],
    maxlength: 64
  }
},{collection:'clientSessions'});

var clientSession = mongoose.model('clientSession', clientSessionModelSchema);
module.exports = clientSession;
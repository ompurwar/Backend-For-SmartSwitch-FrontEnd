var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var userModelSchema = new Schema({
  user_name:
      {type: String, unique: true, required: [true, 'username is required']},
  adhaar_no: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
    /*index: {
      unique: true,
      partialFilterExpression: {adhaar_no: {$type: 'string'}}
    }*/
  },
  nationality: {type: String},
  name: {
    first_name: {type: String},
    middle_name: {type: String},
    last_name: {type: String}
  },
  age: {type: Number, minimum: 18},
  contact: {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    mob_no: {type: String, unique: true, sparse: true},
    address: {
      address_line: {type: String},
      street: {type: String},
      city: {type: String},
      state: {type: String},
      pin_code: {type: String},
      country: {type: String},
      landmark: {type: String},
    }
  },
  gender: {type: String},
  kids: {type: Number},
  credentials: {salt: {type: String}, pass: {type: String}},
  // devices owned
  device_owned: [{type: Schema.Types.ObjectId, sparse: true}],
  active_flag: {type: Boolean},

});

/*var userModelSchema = new Schema({
  Email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  username: {type: String, unique: true, required: true},
  credentials: {
    pass: {type: String, required: true},
    salt: {type: String, required: true, unique: true}
  }

});


var userModelSchema = new Schema({
  user_name: {type: String,unique:true, required: [true, 'username is
required']},
  adhaar_no: {type: String, unique:true,required: [true, 'adhaar no is
required']},
  nationality: {type: String, required: [true, 'nationality is required']},
  name: {
    first_name: {type: String, required: [true, 'first name is required']},
    middle_name: {type: String},
    last_name: {type: String}
  },
  age: {type: Number, minimum: 18, required: true},
  contact: {
    email: {
      type:String,
      unique: true,
      required: true,
      lowercase: true,
    },
    mob_no: {
      type: String,
      unique:true,
      required:[true,"mobile number is required"]
    },
    address: {
      address_line:{type:String,required:[true,"address line is required"]},
      street: {type: String},
      city: {type: String},
      state: {type: String},
      pin_code: {type: String},
      country: {type: String},
      landmark: {type: String},
    }
  },
  gender: {type: String, required: [true, 'sex is required']},
  kids: {type: Number},
  credentials: {
    salt: {type: String, required: [true, 'salt is required']},
    pass: {type: String, required: [true, 'pass is required']}
  },
  //devices owned
  device_owned: [{type:Schema.Types.ObjectId}],
  active_flag: {type: Boolean, required: [true, 'active flag is required']},

});*/

var user = mongoose.model('user', userModelSchema);

module.exports = user;
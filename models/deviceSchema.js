var mongoose = require('mongoose');
//instantiating mongoose schema object
var deviceSchema = mongoose.Schema;

//a dummy device representation for reference
var dummy = {
  SHA256: 'eca102e9ba65ae8df7744126482d0b7517e6f08f3ff0576555daf6d3d0cdeae3',
  sta_mac: 'A0:20:A6:25:1A:2F',
  ap_mac: 'A2:20:A6:25:1A:2F',
  chip_Id: 2431535,
  device_type: 'Switch_board_DuO',
  chip_name: 'ESP8266_NodeMCU',
  chip_version: '1.0',
  chip_size: 4194304,
  free_size: 2818048,
  sketch_size: 324560,
  sdk_version: '2.1.0(deb1901)'
};

// defining Device Schema
var deviceModelSchema = deviceSchema({
  SHA256: {type: String, minLenght: dummy.SHA256.length, required: true},
  sta_mac: {
    type: String,
    minLenght: dummy.sta_mac.length,
    required: true,
    unique: true
  },
  ap_mac: {
    type: String,
    minLenght: dummy.ap_mac.length,
    required: true,
    unique: true
  },
  chip_Id: {type: Number, required: true, unique: true},
  device_type: {type: String},
  chip_name: {type: String},
  chip_version: {type: String},
  chip_size: {type: Number},
  free_size: {type: Number},
  sketch_size: {type: Number},
  sdk_version: {type: String}
} ,{ collection: 'Devices' });



// compiling the schema
var device = mongoose.model('Device', deviceModelSchema);

// exporting the schema
module.exports = device;

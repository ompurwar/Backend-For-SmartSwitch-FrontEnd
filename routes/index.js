var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var crypto = require('crypto');
var Devices = require('../models/deviceSchema');  // importing the device schema
var User = require('../models/userSchema');       // importing userSchema
var deviceState =
    require('../models/deviceStateSchema');  // importing device state schema
var MySession = require('../models/clientSessionSchema');
var customFunctions = require(
    '../includes/essencial_functions_module');  // importing custom functions
var myCustomFunction = new customFunctions();   // instantiating
//////////////////////////////////////////////////////
// connecting to mongodb
mongoose.connect('mongodb://localhost:27017/SwitchGrid');
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
// getting the connectio object
var db = mongoose.connection;

// handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

// router.get('/', function(req, res) { res.render('index', {title: 'login'});
// });
router.get(
    '/', function(req, res) { res.json({'message': 'Wlecome to IoT-GRID'}); })
router.get('/api/getDevices', function(req, res) {
  Devices.find()
      .select('sta_mac')
      .then(function(doc) {
        console.log(doc);
        res.json(doc);
      })
      .catch(function(err) { res.send(err); });

});

//=================================SignUp API================================
router.post('/api/signUp', function(req, res) {
  console.log('chutiye\t' + JSON.stringify(req.body));
  var body = req.body;
  if (body.username !== '' && body.email !== '') {
    if (body.password !== body.confPassword) {
      res.json({
           errFlag: 1,
           signedUp: false,
           message: 'confPassword should match with password'
         })
          .status(400);
    } else {
      var pass = body.password;
      var UserProfile = {};
      var salt = crypto.randomBytes(10).toString('hex');
      UserProfile.user_name = body.username;
      UserProfile.contact = {email: body.email};
      // storing the pass in a secure manner using salt (additional random bits
      // of data)
      UserProfile.credentials = {
        salt: salt,  // salt for password
        pass: myCustomFunction.hashit(pass + salt)
      };
      UserProfile.active_flag = true;
      User.create(UserProfile)
          .then(function(doc) {
            res.json({
                 errFlag: 0,
                 signedUp: true,
                 message: 'singned up successfully'
               })
                .status(200);
          })
          .catch(function(err) {
            console.log(err);
            res.json({errFlag: 1, err: err, signedUp: false});
          });
    }
  } else {
    res.json({
         errrFlag: 1,
         signedUp: false,
         message: 'username and email is required'
       })
        .status(400);
  }
});

// =============================Login API=====================================
router.post('/api/logIn', function(req, res) {
  var body = req.body;
  console.log(body.Email);
  if ((body.Email !== null && body.Email !== undefined && body.Email !== '') &&
      (body.pass !== null && body.pass !== undefined && body.pass !== '')) {
    User.where({'contact.email': body.Email})
        .lean()
        .then(function(doc) {
          result = doc[0];
          if (result === undefined) {
            res.json({
                 errFlag: 1,
                 loggedIn: false,
                 message: 'Email Dose not Exist!'
               })
                .status(404);
          } else {
            console.log(result);
            console.log(body.pass);
            // ================================Authenticating=================
            // =========================pre authentication procedure==========
            var digest =
                myCustomFunction.hashit(body.pass + result.credentials.salt);
            var sessionId = crypto.randomBytes(32).toString('hex');
            var expiry = Date.now() + 600000;
            console.log(digest);
            //==================validating the pass===========================
            if (result.credentials.pass === digest) {
              console.log('[log] pass matched');
              var myDoc = {
                user_id: result._id,
                expiry: expiry,
                sessionId: sessionId
              };
              //===================creating a session key================
              MySession.create(myDoc)
                  .then(function(doc) {
                    result =
                        myCustomFunction.jsonOmitKeys(result, ['credentials']);
                    console.log(doc);
                    var returnObj = {
                      loggedIn: true,
                      sessionId: sessionId,
                      expiry: expiry,
                      user_profile: result
                    };
                    console.log('[log] session insearted');
                    res.json(returnObj).status(200);
                  })
                  .catch(function(err) { res.json(err).status(400); });
            }
          }
        })
        .catch(function(err) { res.json(err); });
  }
});


router.post('/api/addDevice', function(req, res) {
  var recievedDeviceId = req.body.deviceId;
  var recievedUserId = req.body.user_id;
  console.log(req.body);
  Devices.find()
      .where({_id: recievedDeviceId})
      .select('device_id')
      .then(function(doc) {
        console.log(doc);
        if (doc[0] !== undefined && doc[0] !== null && doc[0] !== '') {
          console.log(recievedUserId);
          User.findById({_id: recievedUserId})
              .select('device_owned')
              .then(function(doc) {
                console.log(doc);
                var devices_owned = [];
                devices_owned = doc.device_owned;
                console.log(
                    'device found at \n\t' +
                    devices_owned.findIndex(function(element) {
                      return element == recievedDeviceId;
                    }));
                if (devices_owned.findIndex(function(element) {
                      return element == recievedDeviceId;
                    }) > -1) {
                  // device already add owned by user
                  res.json({
                    errrFlag: 1,
                    success: false,
                    message: 'can\'t add device already owned by user!'
                  });
                  console.log('device already owned by user');

                } else {
                  User.findByIdAndUpdate(
                      {_id: recievedUserId},
                      {$push: {'device_owned': recievedDeviceId}},
                      function(err, model) {
                        if (err)
                          throw err;
                        else {
                          res.json({
                            errrFlag: 0,
                            success: true,
                            message: 'device added successfully!'
                          });
                          console.log(model);
                        }
                      });
                }
                /**/
              })
              .catch(function(err) {});
        }
      })
      .catch();
});

router.post('/api/getStates', function(req, res) {
  console.log(req.body);
  if (req.body.device_id) {
    deviceState.find()
        .where({device_id: req.body.device_id})
        .select('device_id state_array.id state_array.state')
        .then(function(doc) {
          console.log(doc);
          res.json({result: doc});
        })
        .catch(function(err) { res.send(err); });
  } else {
    res.json({message: 'please send device_id'});
  }

});

router.post('/api/setStates', function(req, res) {
  if (req.body.device_states[0]) {
    body = req.body.device_states;
    console.log(JSON.stringify(req.body));
    body.forEach(element => {
      deviceState.find()
          .where({device_id: element.deviceId})
          .update({state_array: element.state_array})
          .then(function(doc) {
            console.log(JSON.stringify(doc));

            res.json({result: doc, success: true});
          })
          .catch(function(err) { res.send({error: err, success: false}); });
    });
  } else {
    res.send({errFlag: 1, message: 'please send some data'}).status(400)
  }
});


router.post('/api/refreshUser', function(req, res) {
  sessionId = req.body.sessionId;
  MySession.findOne()
      .where({sessionId: sessionId})
      .then(function(doc) {
        console.log(doc);
        var user_id = doc.user_id;
        console.log(req.body);
        if (user_id) {
          User.findOne()
              .where({_id: user_id})
              .lean()
              .then(function(doc) {
                console.log(doc);
                doc = myCustomFunction.jsonOmitKeys(doc, ['credentials']);
                res.json({user_data: doc, success: true});
              })
              .catch(function(err) { res.json(err); });
        } else {
          res.json({message: 'please provide user id'});
        }
      })
      .catch(function(err) {
        console.log(err);
        res.json({message: 'some error occured'})
      });

});
/*
var user_id = req.body.user_id;

*/
module.exports = router;
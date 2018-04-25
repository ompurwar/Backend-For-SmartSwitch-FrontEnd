$(document).ready(function() {
  function myData(_id, mac) {
    var self = this;
    self._id = ko.observable(_id);
    self.sta_mac = ko.observable(mac);
  }
  
  
  
  function myViewModel() {
    var self = this;
    self.data = ko.observableArray([]);
    self.currentMac = ko.observable('');
    self.state = ko.observableArray([false, false]);
    self.disableGetDeviceBtn = ko.observable(false);
    self.controleBtn = ko.observable('hidden');
    self.deviceId = ko.observable('dsfadf');
    self.controlBtnSwitchDisabled = ko.observable(true);
    /////
    /*
    showControlPanel: ko.observable(false),
    showGetDeviceMacBtn: ko.observable(true),
    showGetDeviceMacPanle: ko.observable(true),*/
   
  
    self.getdevices = function() {
      console.log('hello');
  
      $.ajax({
        url: 'http://hello-pc:3000/api/getDevices',
        type: 'GET',
        async: true,
        success: function(responseData) {
          responseData.forEach(function(element) {
            console.log(element._id);
            // for inserting values in to an array  "myViewModel.data.push()" will
            // be used instead of "myViewModel.data().push()" because data() will
            // be use to fetch values (beacuse knockout provides this way) but
            // here we have to write value in this data array
            self.data.push(
                new myData(String(element._id), String(element.sta_mac)));
          });
          //"myViewModel.showGetDeviceMacBtn=false;" will assign valsue to the
          //"myViewModel.showGetDeviceMacBtn" but will not poppulate ths value but
          //"myViewModel.showGetDeviceMacBtn(false);" will assign as well as
          // populate this value
          self.disableGetDeviceBtn(true);
          self.controleBtn('visible');
          console.log(self.showGetDeviceMacBtn);
          // for reteiving values from this  array  "myViewModel.data().push()"
          // will
          // be used instead of "myViewModel.data.push()" because "data" will
          // be use to write values (beacuse knockout provides this way) but
          // here we have to write value in this data array
          self.data().forEach(function(element) {
            console.log(element._id() + ' ' + element.sta_mac());
          });
  
          console.log(self.currentMac);
  
        },
        error: function(objHttp) { console.log(objHttp.responseText); }
      });
    };
    self.chooseDevice = function(a) {
      self.controlBtnSwitchDisabled(false);
      self.deviceId(a._id());
      console.log(a._id());
    };
    self.fillGrid = function() {
      var jsonData;
      jsonData.deviceId = self.deviceId();
      self.callgetSateApi(jsonData);
    };
    self.callgetSateApi = function(json) {
      $.ajax({
        url: 'http://hello-pc:3000/api/getStates',
        type: 'POST',
        data: json,
        async: true,
  
        success: function(responseData) {
          var i = 0;
          responseData.result[0].state_array.forEach(function(element) {
  
            self.state()[i] = element.state;
            console.log(String(self.state()[i]));
            ++i;
          });
  
        },
        error: function(objHttp) { console.log(objHttp.responseText); }
      });
    };
  
    self.setStates = function(a) {
      self.state()[a-1] = !(self.state()[a-1]);
      console.log("[setStates] a = "+a)
      var jsonData={};
      var i =0;
      jsonData.deviceId = self.deviceId();
      jsonData.state_array = [];
      
      self.state().forEach(function(element){
        jsonData.state_array.push({id : i+1,state : element});
        ++i;
      });
      console.log(JSON.stringify(jsonData));
    
      $.ajax({
        url: 'http://hello-pc:3000/api/setStates',
        type: 'POST',
        data: ko.toJSON(jsonData),
        async: true,
        contentType: "application/json",
  
        success: function(responseData) {
          
         
  
        },
        error: function(objHttp) { console.log(objHttp.responseText); }
      });
    };
  }
  
  
  
  ko.applyBindings(new myViewModel());
});




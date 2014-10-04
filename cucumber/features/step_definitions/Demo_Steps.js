/*
# Copyright 2014 Open Ag Data Alliance
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
*/

var jsonPath = require('JSONPath');
function check_attributes(table, object){
      /**
       *  check if all attributes specified in table exists in object
       *  @param {Object} table : attribute table passed  via cucumber
       *  @param {Object} object: object to be tested
      */

      for(var idx in table.rows()){
            var look_for = table.rows()[idx][0];

	         if(object[look_for] === undefined){
                console.log(object);
     	          console.log(look_for);
                return false;
           }
      }

      return true;
}

function getNode(jsonpath, root, opt){
    //TODO: remove this function
    //just do : jsonPath.eval(root, jsonpath) directly
    var node = jsonPath.eval(root, jsonpath);
    if(node[0] === undefined){
        //so that the test will stop
    	  throw {"reason": "json path is invalid" };
    }
    return node[0];
  }

var StepDef = function () {
  /*
   *  Define all the definitions for the steps here
   *
  */
  this.World = require("../support/world.js").World;

  var context = this;
  this.Given(/^the client is logged in$/, function (callback) {
    //TODO: Obtain the token from wherever
    callback();
  });

  this.Given(/^the client is authorized$/, function (callback) {
    //TODO: Check token validity somehow
    callback();
  });

  this.When(/^the client requests "([^"]*)" for "([^"]*)" that are "([^"]*)"$/, function (arg0, arg1, arg2, callback) {

      this.current_url = this.root_url + "/" + arg0 + "/" + arg1 + "/" + arg2 + "?_expand=2";
      this.get(this.current_url, this.get_token(), callback);
      this.current_model = null;
      console.log("Endpoint: " + this.current_url);
  });


  this.Then(/^the response is a "([^"]*)"$/, function (model_name, callback) {
    // This step tells the parser what response model to use/expect in subsequent tests
    this.current_model = this.models[model_name];
    //try{
    //  this.last_response = JSON.parse(this._lastResponse.body);
    this.last_response = this._lastResponse.body;
    //}catch(ex){
    //callback.fail(new Error("Bad JSON: " + ex.message));
    //}
    console.log("Expecting a " + model_name + " back");
    callback();
  });

  this.Then(/^each "([^"]*)" has the following attributes:$/, function (item_key, table, callback) {

    var object = getNode(this.current_model.vocabularies[item_key].jsonpath,
                         this.last_response);
    //console.log(object);
    var result = check_attributes(table, object);

    if(!result) callback.fail(new Error("Failed - Attribute Check for: " + item_key));
    callback();
  });


  this.Then(/^the response contains (\d+) or more items$/, function (minkey, callback) {
      var cnt = 0;
     // try{
      this.last_response = this._lastResponse.body;
     // }catch(ex){
     //   callback.fail(new Error("Bad JSON" + ex.message + " <- " + this._lastResponse.body));
   //   }
      for (var i in this.last_response){
         cnt++;
      }
      if(cnt < minkey) callback.fail(new Error("Failed - " + cnt +  " keys found"));
      callback();
  });


  this.Then(/^the "([^"]*)" attribute of each "([^"]*)" contains at least the following information:$/,
      function (attribute_name, parent_key, table, callback) {
    var roots = jsonPath.eval(this._lastResponse.body,
            this.current_model.vocabularies[parent_key].jsonpath);
    var cnt = 0;
    for(var rootkey in roots){
       var object = roots[rootkey];
       object = object[attribute_name];
       var result = check_attributes(table, object);
       if(!result) callback.fail(new Error("Failed - Attribute Check for: " + attribute_name));
       cnt++;
    }

    callback();
  });

  this.Then(/^the "([^"]*)" attribute contains at least the following information:$/, function (attribute_name, table, callback) {
       var object = getNode(this.current_model.vocabularies[attribute_name].jsonpath,
                         this.last_response,
                         0);
       var result = check_attributes(table, object);
       if(!result) callback.fail(new Error("Failed - Attribute Check for: " + attribute_name));
       callback();
  });

   this.When(/^the client requests for the harvester with VIN "([^"]*)"$/, function (vin, callback) {

    this.current_url = this.root_url + "/configurations/machines/harvesters";
     var that = this;
     var kallback = callback;
     this.get(this.current_url, this.get_token(), function(){
         var configobj = that._lastResponse.body;
         var streamlink = configobj[vin]._href;

         that.get(streamlink, that.get_token(), kallback);
     });
  });

  this.When(/^the client requests a "([^"]*)" stream for harvester with VIN "([^"]*)"$/,
      function (what_stream, vin, callback) {
    /*
      Obtain the requested stream link from configuration document
    */

    this.current_url = this.root_url + "/configurations/machines/harvesters";
    var that = this;

    var kallback = callback;
    this.get(this.current_url, this.get_token(), function(){
      var configobj = that._lastResponse.body;
      var streamlink = configobj[vin]._href;

      that.get(streamlink, that.get_token(), function(){
            var resourceobj = that._lastResponse.body;
            var datalink = resourceobj.streams[what_stream]._href;
	    //kallback();
	    console.log("New Endpoint: " + datalink );
	    that.get(datalink, that.get_token(), kallback);
      });

    });
    this.current_model = null;
  });

  this.Then(/^the response contains at least the following information:$/, function (table, callback) {
    var object = this._lastResponse.body;
    var result = check_attributes(table, object);
    if(!result) callback.fail(new Error("Failed - Attribute Check"));

    callback();
  });

  this.Then(/^the "([^"]*)" attribute contains (\d+) or more item$/,
          function (attribute, min_children, callback) {
    var object = jsonPath.eval(this.last_response,this.current_model.vocabularies[attribute].jsonpath );

    if(Number(object.length) < Number(min_children)){
      callback.fail(new Error("The property " + attribute
              + " must be iterable and have 0 more 1 items inside."));
    }
    callback();
  });

  this.Then(/^each item has at least the following information:$/, function (table,callback) {
     for(var key in this.last_response){
         var result = check_attributes(table, this.last_response[key]);
         callback();
     }
  });

  this.Then(/^each item in "([^"]*)" has the following information:$/, function (this_key, table, callback) {
    //TODO: need to match that greedy regex ^
    var root = this.last_response[this_key];
    this.previous_step = {};
    var fallthrough = 0;
    for(key in root){
	    var iterable = root[key];
 	    this.previous_step[key] = iterable;
	    var result = check_attributes(table, iterable);

 	    fallthrough++;
    }
   console.log(fallthrough);
   callback();

 });

  this.Then(/^the "([^"]*)" of each item in "([^"]*)" contains at least the following information:$/, function (inner, outer, table, callback) {
    var iter = this.last_response[outer];
    for(key in iter){
     var iterable = iter[key][inner];
           //console.log(iterable);
           var result = check_attributes(table, iterable);
    }
    callback();
});


}


module.exports = StepDef;

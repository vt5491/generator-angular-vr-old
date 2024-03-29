
'use strict';

// TODO: write some uts for the generator
// TODO: test the multiple write times.  make sure it's idempotent
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var inquirer = require('inquirer');
var async = require('async');

module.exports = yeoman.generators.Base.extend({

  // separate out globals and constants, so we can call this method from
  // our uts as well
  _initGlobals: function (cb) {
    this.defaultArtifactNames = {};
    // services
    this.defaultArtifactNames.mainService = 'main-service';
    //this.defaultArtifactNames.mainSeorvice = 'mainservice';
    this.defaultArtifactNames.baseService = 'base';
    this.defaultArtifactNames.utilsService = 'utils';
    
    // controllers
    // note: main controller is gen'd by the angular generator, thus we comment it out
    // so we don't gen it again.
    //this.defaultArtifactNames.mainController = 'main';
    this.defaultArtifactNames.custController = 'cust';

    // directives
    this.defaultArtifactNames.canvasKeysDirective = 'canvas-keys';
    
    this.artifacts = {};
    this.artifacts.services = {};
    this.artifacts.controllers = {};
    this.artifacts.directives = {};
    
    // initialize service names
    this.artifacts.services.mainService = this.defaultArtifactNames.mainService;
    this.artifacts.services.base = this.defaultArtifactNames.baseService;
    this.artifacts.services.utils = this.defaultArtifactNames.utilsService;

    // initialize controller names
    this.artifacts.controllers.cust = this.defaultArtifactNames.custController;
    
    // initialize directive names
    this.artifacts.directives.canvasKeys = this.defaultArtifactNames.canvasKeysDirective;

    // call callback function, if any
    //(typeof cb === 'undefined' || null === cb) ? null : cb();    
    //if (typeof cb !== 'undefined' && null !== cb) { cb();};
    typeof cb === 'function' && cb();
  },
  
  initializing:
  {
    angularVRInit: function () {
      //this.log('appname=' + this.determineAppname());
      this.log('this.options.skipBaseAppInstall = ' + this.options.skipBaseAppInstall);
      this.log('app.js destinataionPath=' + this.destinationPath('app/scripts/app.js'));
      if( this.fs.exists( this.destinationPath('app/scripts/app.js'))  || this.options.skipBaseAppInstall) {
        this.log("Angular base app found. Skipping angular install.\n");
        //this.composeWith('angular',  {args: ['']} );
        this.angularAppFound = true;
      }
      else {
        this.log("angular base app not found");
        this.angularAppFound = false;
      }

      _defineGlobals();
    },

    angularBasePrompt: function () {
      //var done = this.async();

      this.log( 'Welcome to the second ' + chalk.red('angular-vr') + ' generator.\n');
      // TODO: only issue this message if it looks like its not an empty directory
      // or if its not a pre-existing angular app
      this.log( 'Note: this generator will not create the root folder for you project.');
      this.log( 'It will create the artifacts in the current dir.');
      this.log( 'In short, create a subdirectory with the name of your app and run the generator from there');
      //debugger;
      if(this.angularAppFound){
        this.log("Angular base app found. Skipping angular install.\n");
      }
      else {
        this.log("angular base app not found");
      };

      var prompts = [];

      if (!this.angularAppFound) {
        var done = this.async();
        
        prompts.push( {
          type: 'input',
          name: 'appName',
          message: 'What is your app\'s name (example: sketch-vr) ?'
        });

        this.prompt(prompts, function (props) {
          this.props = props;
          this.appName = props.appName;

          done();
        }.bind(this));
      };
    }
  }, // end initializing

  prompting: {
    
    angularVrPrompt: function () {
      this.log('now in prompting');
      var done = this.async();
      
      var prompts = [{
        type: 'checkbox',
        name: 'artifactsToRename',
        message: 'Please specify any name you wish to override:',
        choices: [
          {
            value: new inquirer.Separator("--- services ---")
          },
          {
            value: 'mainService',
            name: this.artifacts.services.mainService,
            checked: false
          },
          {
            value: 'baseService',
            name: this.artifacts.services.base,
            checked: false
          },
          {
            value: 'utilsService',
            name: this.artifacts.services.utils,
            checked: false
          },
          {
            value: new inquirer.Separator("--- controllers ---")
          },
          {
            value: 'custController',
            name: this.artifacts.controllers.cust,
            checked: false
          },          
          {
            value: new inquirer.Separator("--- directives ---")
          },
          {
            value: 'canvasKeysDirective',
            name: this.artifacts.directives.canvasKeys,
            checked: false
          },          
        ]
      }];
      this.prompt(prompts, function (props) {
        
        this.artifactsToRename = props.artifactsToRename;

        done();
      }.bind(this));
    },

    renameArtifactsPrompt: function() {
      var done = this.async();
      
      var prompts = [];
      
      this.artifactsToRename.forEach(function (val, index, array) {
        //debugger;
        prompts.push( {
          type: 'input',
          name: val,
          //message: 'new name for ' + val + ' (current: ' this.defaultArtifactNames[val] + '):'
          message: 'new name for ' + this.defaultArtifactNames[val]
        });

      }.bind(this));

      this.prompt(prompts, function(props) {
        Object.keys(props).forEach(function (key, index, array){
          switch(key) {
          case 'mainService':
            this.artifacts.services.mainService = props.mainService;
            break;
          case 'baseService':
            this.artifacts.services.base = props.baseService;
            break;
          case 'utilsService':
            this.artifacts.services.utils = props.utilsService;
            break;
          case 'custController':
            this.artifacts.controllers.cust = props.custController;
            break;
          case 'canvasKeysDirective':
            this.artifacts.directives.canvasKeys = props.canvasKeysDirective;
            break;
          default:
            this.log('switch: found unknown key:' + key);
          }

        }.bind(this));
        
        done();
      }.bind(this));
    },

    // debug: function() {
    //   this.log('this.artifacts.services.mainService=' + this.artifacts.services.mainService);
    //   this.log('this.artifacts.services.baseService=' + this.artifacts.services.baseService);
    // }
  },

  // writing: {
  //   app: function () {

  //     var done = this.async();
  //     this.fs.copyTpl(
  //       this.templatePath('_vt_marker.json'),
  //       this.destinationPath('vt_marker.json'),
  //       { title: 'abc'}
  //     );
  //     done();
  //   },

  //   projectfiles: function () {
  //   }
  // },

  
  //_subgeneratorApp: function (cb) {
  subgeneratorApp: function () {

      if (!this.angularAppFound) {
        var done = this.async();
       
        // var after = function(object, functionName, action) {
        //   var oldFunction = object.functionName;
        //   var newFunction = function() {
        //     oldFunction();
        //     action();
        //   };
        //   // restore original
        //   object.functionName = oldFunction;
        // };
        
        // after(this, 'composeWith', done);
        // var origFunction = this.composeWith;
        // // var newFunction = function() {
        // //   origFunction();
        // //   //this.composeWith();
        // //   done();
        // // }.bind(this);
        // //this.composeWith = newFunction;
        // this.composeWith = function () {
        //   this.log('now in first step of new function, this.appName=' + this.appName);
        //   origFunction.apply(this, ['angular:service', {args: [ this.appName ]} ])
        //     // .on('end', function() {
        //     //   this.log('hello');
        //     //}.bind(this));
        //   ;
        //   done();
        // }.bind(this);
        // this.log('about to call aspected composeWith');
        // //this.composeWith('angular:service',  {args: [ this.appName ]} );
        // this.composeWith();
        // this.log('back from aspected composeWith');
        // // restore original
        // this.composeWith = origFunction;

        
        
        this.log('now creating base Angular app...');
        
        //this.composeWith('angular:service',  {args: [ this.appName ]} )
        //this.invoke('angular:service',  {args: [ this.appName ]} )
        // going from yeoman-generator 19.2 -> 20.3 did not fix the problem
        // doesn't work (does not drive .on)
        //this.composeWith('angular',  {args: [ this.appName ]} )
        // works (drives .on)
        this.invoke('angular',  {args: [ this.appName ]} )
        //this.composeWith('angular',  {args: [ this.appName ]} )        
         .on('end',function(){
                        this.log('>>>in end handler of angular base install');
                        done();
                        //cb();
                    }.bind(this));
        
        //done();
      }

  },

 // _subgeneratorServices: function (cb) {
  subgeneratorServices: function () {
    Object.keys(this.artifacts.services).forEach( function (key, index, array) {
      //this.log('regex: found key ' + key);
      this.composeWith('angular:service',  {args: [ this.artifacts.services[key] ]} );
    }.bind(this));    
  },

  subgeneratorControllers: function () {
    Object.keys(this.artifacts.controllers).forEach( function (key, index, array) {
      //this.log('regex: found key ' + key);
      this.composeWith('angular:controller',  {args: [ this.artifacts.controllers[key] ]} );
    }.bind(this));
  },

  subgeneratorDirectives: function () {
    Object.keys(this.artifacts.directives).forEach( function (key, index, array) {
      //this.log('regex: found key ' + key);
      this.composeWith('angular:directive',  {args: [ this.artifacts.directives[key] ]} );
    }.bind(this));
  },

  vtDebug: function (msg, cb) {
    var outMsg = msg || 'now in vtDebug';

    //cb = _.isFunction(cb) ? cb : function () {};
    
    this.log(outMsg);

    typeof cb === 'undefined' ? null : cb();
    //cb();
  },
  // // use async to synchronize the subgenerator steps
  // subgeneratorAll: function () {
  //   try {
  //     async.waterfall([
  //     //async.series([
  //       function sga (cb) {
  //         this._subgeneratorApp(cb);
  //       }.bind(this),
  //       function sgs (cb) {
  //         this._subgeneratorServices(cb);
  //       }.bind(this),
        
  //       //this._subgeneratorServices(callback),
  //       // this._subgeneratorControllers(),
  //       // this._subgeneratorDirectives()
  //    ]);
  //   }
  //   catch(e){
  //     this.log('subgeneratorAll: caught error ' + e);
  //   };
  // },

  // helper methods

  // insert template tags into base angular files
  _markupBaseFile: function (filePath, cb) {
    // var noop = function(){}; // do nothing.
    // cb = cb || noop;
    var baseFileContents = this.fs.read(filePath);

    this.log('_markupBaseFile: baseFileContents=' + baseFileContents);

    // call callback function, if any    
    //if (typeof cb !== 'undefined' && null !== cb) { cb();};
    typeof cb === 'function' && cb("abc");

    return "def";
  },

  // helper method
  _markupFile_orig: function (filePath) {
 // _injectTemplate: function (filePath) {
    var fileContents = this.fs.read(filePath);
    this.conflicter.force = true;

    // loop over each line looking for our insert point
    var lines = _.map(fileContents.split('\n'));

    var accumulateLines = function(str) {
      var result = '';

      // look for closing bracket, and insert our tag before this
      if (/^\s\s\}\);/.test(str)) {
        result +=  '<%= stuff %>' + '\n';   
      }
      result += str + '\n';

      return result;
      
    };

    // convert file string into an array of lines (including tagged line)
    var taggedLines = _.map(lines, accumulateLines);

    // convert the array back into a string so we can rewrite to the file
    fileContents = null;

    var strAccumulate = function(str) {
      fileContents += str;
    };

    _.map(taggedLines, strAccumulate);

    // and write it back
    this.fs.write(filePath, fileContents);
  },
   
  /*  
  // insert tags into the base angular artifacts, so we can later inject our custom code
  markupArtifacts: function () {
    // services
    Object.keys(this.artifacts.services).forEach( function (key, index, array) {
      var filePath = this.destinationPath('app/scripts/services/' + [ this.artifacts.services[key] ] + '.js');
      this._markupFile(filePath);
    }.bind(this));
    
    // controllers
    Object.keys(this.artifacts.controllers).forEach( function (key, index, array) {
      var filePath = this.destinationPath('app/scripts/controllers/' + [ this.artifacts.controllers[key] ] + '.js');
      this._markupFile(filePath);
    }.bind(this));

    // directives
    Object.keys(this.artifacts.directives).forEach( function (key, index, array) {
      var filePath = this.destinationPath('app/scripts/directives/' + [ this.artifacts.directives[key] ] + '.js');
      this._markupFile(filePath);
    }.bind(this));
  },                                                 

  // inject partials into the template code
  partialsInjection: function () {

    Object.keys(this.artifacts.services).forEach( function (key, index, array) {
      var templatePath = this.destinationPath('app/scripts/services/' + [ this.artifacts.services[key] ] + '.js');
      var partialPath = this.templatePath('../partials/services/' + [ this.artifacts.services[key] ] + '.js');

      

      //debugger;
      var partialContents = this.fs.read(partialPath);

      partialContents += new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + '\n';
      this.fs.copyTpl(
        templatePath,
        templatePath,
        { stuff: partialContents}
      );
      
    }.bind(this));
    
  }, 
*/  
  end: function () {
    //var done = this.async();
    this.log("end: all done.");
    //this.log("\n");
    //done();
  }

});
  

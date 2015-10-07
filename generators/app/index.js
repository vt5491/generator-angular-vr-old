'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var inquirer = require('inquirer');

module.exports = yeoman.generators.Base.extend({

  initializing:
  {
    angularVRInit: function () {
      //this.log('appname=' + this.determineAppname());
      if( this.fs.exists( this.destinationPath('/app/scripts/app.js'))) {
        //this.log("Angular base app found. Skipping angular install.\n");
        //this.composeWith('angular',  {args: ['']} );
        this.angularAppFound = true;
      }
      else {
        //this.log("angular base app not found");
        this.angularAppFound = false;
      }

      this.defaultArtifactNames = {};
      // services
      this.defaultArtifactNames.mainService = 'main-service';
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
    },

    angularBasePrompt: function () {
      var done = this.async();

      this.log( 'Welcome to the second ' + chalk.red('angular-vr') + ' generator.\n');
      // TODO: only issue this message if it looks like its not an empty directory
      // or if its not a pre-existing angular app
      this.log( 'Note: this generator will not create the root folder for you project.');
      this.log( 'It will create the artifacts in the current dir.');
      this.log( 'In short, create a subdirectory with the name of your app and run the generator from there');

      if(this.angularAppFound){
        this.log("Angular base app found. Skipping angular install.\n");
      }
      else {
        this.log("angular base app not found");
      };

      var prompts = [];

      if (!this.angularAppFound) {
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
    },

  }, // end initializing

  prompting: {

    angularVrPrompt: function () {
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
        debugger;
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

  writing: {
    app: function () {

      var done = this.async();
      this.fs.copyTpl(
        this.templatePath('_vt_marker.json'),
        this.destinationPath('vt_marker.json'),
        { title: 'abc'}
      );
      done();
    },

    projectfiles: function () {
    }
  },

  subgeneratorsApp: function () {

      if (!this.angularAppFound) {
        var done = this.async();

        this.log('now creating base Angular app...');
        //this.composeWith('angular:service',  {args: [ this.appName ]} )
        this.composeWith('angular',  {args: [ this.appName ]} )
         .on('end',function(){
                        this.log('in end handler of angular base install');
                        done();
                    }.bind(this));
        
        done();
      }

  },

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
  
  end: function () {
    //var done = this.async();
    this.log("all done.");
    //this.log("\n");
    //done();
  }

});

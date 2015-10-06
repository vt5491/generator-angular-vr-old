'use strict';

var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var inquirer = require('inquirer');

module.exports = yeoman.generators.Base.extend({

  initializing: function () {
    if( this.fs.exists( this.destinationPath('/app/scripts/app.js'))) {
      this.log("angular base app found");
      //this.composeWith('angular',  {args: ['']} );
      this.angularAppFound = true;
    }
    else {
      this.log("angular base app not found");
      this.angularAppFound = false;
    }

    // initialize service names
    this.mainService = 'main-service';
    this.baseService = 'base';
  },

  prompting: {
    // f1: function () {
    //   var done = this.async();
    //   this.log('f1 hi');
    //   done();main
    // },
    // f2: function () {
    //   this.log('f2 hi');
    // }
    angularBasePrompt: function () {
      //var done = this.async();

      this.log( 'Welcome to the second ' + chalk.red('AngularVr') + ' generator!');

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

          //done();
        }.bind(this));
      };
    },
    // f2: function () {
    //   this.log('f2 hi');
    // }

    angularVrPrompt: function () {
      var done = this.async();
      //this.log('now in angularVrPrompt');
      var prompts = [{
        type: 'checkbox',
        name: 'artifactsToRename',
        message: 'Please specify any name you wish to override:',
        choices: [
          {
            value: new inquirer.Separator("--- services")
            //name: 'main-service.js',
            //checked: false
          },
          {
            value: 'mainService',
            name: this.mainService,
            checked: false
          },
          {
            value: 'baseService',
            name: this.baseService,
            checked: false
          }
        ]
      }];
      this.prompt(prompts, function (props) {
        //this.log('props.artifactsToRename=' + props.artifactsToRename);

        this.artifactsToRename = props.artifactsToRename;
        //debugger;
        // this.artifactsToRename = [];

        // if (this.mainService) {
        //   this.artifactsToRename.push("'mainService'");
        // }

        // this.props = props;
        // //this.artifacts = props.artifacts;

        done();
      }.bind(this));
    },

    renameArtifactsPrompt: function() {
      //this.log('now in renameartifactsPrompt');
      var done = this.async();
      
      //this.log('this.artifactstorename.length= ' + this.artifactsToRename.length);
      //this.log('this.artifactsToRename=' + this.artifactsToRename);

      var prompts = [];
      this.artifactsToRename.forEach(function (val, index, array) {
        //console.log(index + ': ' + val);
        //this.log('new name for ' + val);

        prompts.push( {
          type: 'input',
          name: val,
          message: 'new name for ' + val + ':'
        });

      }.bind(this));

      this.prompt(prompts, function(props) {
        //this.log('props 2=' + props);

        Object.keys(props).forEach(function (key, index, array){
          switch(key) {
          case 'mainService':
            //this.log('switch: change mainService');
            this.mainService = props.mainService;
            break;
          case 'baseService':
            //this.log('switch: change base');
            this.baseService = props.baseService;
            break;
          default:
            this.log('switch: found unknown key:' + key);
          }

        }.bind(this));
        //debugger;
        done();
      }.bind(this));

      //done();
    },

    debug: function() {
      this.log('this.mainService=' + this.mainService);
      this.log('this.baseService=' + this.baseService);
    }
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

//    // Note: this has to be here, before install
//    // refer to m-iconic yo generator
    subgenerators: function () {
      var done = this.async();

      this.log("now executing subgenerators");
      //this.log("path= " + this.destinationPath('/app/scripts/app.js')); 
      //this.log("path exitsts= " + this.fs.exists(this.destinationPath('/app/scripts/app.js'))); 
      //this.composeWith('angular:controller',  {args: ['mycontroller']} );
      this.log("\nnow done with subgeneration");
      done();
  }, 

  subgeneratorServices: function () {
    debugger;
    Object.keys(this).forEach( function (key, index, array) {
      //this.log('key.search=' + key.search(/Service$/));
      if( key.search(/Service/) > 0) {
        this.log('regex: found key ' + key);
        this.log('regex: this[key]= ' + this[key]);
        this.composeWith('angular:service',  {args: [ this[key] ]} );
      };
    }.bind(this));
    
  }
//  subgenerators_read: function () {
//    this.conflicter.force = true
//    var fp = this.destinationPath('app/scripts/controllers/mycontroller.js');
//    var fc = this.fs.read(fp);
//
//    var a = _.map( fc.split('\n'));
//    var obj = this;
//
//    var f = function(str) {
//        obj.log('f.str=' + str);
//        var result = '';
//
//        if (/^\s\s\}\);/.test(str)) {
//          result +=  '<%= stuff %>' + '\n'   
//        }
//        result += str + '\n';
//
//        return result;
//    };
//
//    //this.log('a.length=' + a.length);
//    var templatizedArr = _.map(a, f);
//
//    this.log('templatizedArr=' + templatizedArr);
//
//    var fc = null;
//
//    var strFunc = function(str) {
//        fc += str;
//    };
//
//    _.map(templatizedArr, strFunc);
//   
//    //fc += '\nhello there 3\n';
//    this.fs.write(fp, fc);
//    //this.conflicter.force = false
//  },
//
//  subgenerators_edit: function () {
//    var fp = this.destinationPath('app/scripts/controllers/mycontroller.js');
//
//    this.fs.copyTpl(
//      //this.templatePath(fp),
//      fp,
//      fp,
//        { stuff: 'abc'}
//    );
//  }, 

});

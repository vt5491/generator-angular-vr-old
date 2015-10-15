'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var local_fs = require('fs');
var memFs = require('mem-fs');
var editor = require('mem-fs-editor');

var store = memFs.create();
var fs = editor.create(store);

var fs_extra = require('fs-extra');

//fs.write('somefile.js', 'var a = 1;');

describe('angular-vr:app', function () {
  console.log("entered test-app.js");
  // before(function (done) {
  //   helpers.run(path.join(__dirname, '../generators/app'))
  //     .withOptions({ skipInstall: true })
  //     .withPrompts({ artifactsToRename: [] })
  //     .on('end', done);
  //   console.log('now in before');
  //   //done();
  // });

//   this.app = helpers.createGenerator('ratchet:app', [
//     '../../app', [
//         helpers.createDummyGenerator(),
//         'mocha:app'
//     ]
// ]);
  // // works
  // before(function (done) {
  //   helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
  //     if (err) {
  //       return done(err);
  //     }

  //     this.app = helpers.createGenerator('angular-vr', [
  //       '../../generators/app', [
  //         helpers.createDummyGenerator(),
  //         'angular:app'
  //       ]
  //     ]);
  //     done();
      
  //   }.bind(this))
  // });

  // before(function (done) {
  //   helpers.testDirectory(path.join(__dirname, 'temp'), function (err) {
  //     if (err) {
  //       return done(err);
  //     }

  //     this.app = helpers.createGenerator('angular-vr', [

  //       '../../generators/app', [
  //         helpers.createDummyGenerator(),
  //         'angular:app'
  //       ]
  //     ]);
  //     done();
      
  //   }.bind(this))
  // });  

  // beforeEach(function (done) {
  //   // helpers
  //   //   .testDirectory(path.join(__dirname, './temp'), function () {
  //   //     //fs.writeFileSync(path.join(__dirname, './temp/testfile'), 'Roses are red.');
  //   //     local_fs.writeFileSync(path.join(__dirname, './temp/testfile'), 'Roses are red.');

  //   //     this.app = helpers.createGenerator('angular-vr', [
  //   //       '../../generators/app', [
  //   //         helpers.createDummyGenerator(),
  //   //         'angular'
  //   //       ]
  //   //     ]);
        
  //   //   }.bind(this));

  //   //console.log('test-app.js: now in ready handler, this= %o\n\n', this);
  //   console.log('test-app.js: now in ready handler, helpers= %o\n\n', helpers);
    
  //   helpers
  //     .testDirectory(path.join(__dirname, './temp'), function () {
  //       //fs.writeFileSync(path.join(__dirname, './temp/testfile'), 'Roses are red.');
  //       local_fs.writeFileSync(path.join(__dirname, './temp/testfile'), 'Roses are red.');

  //       this.app = helpers.createGenerator('angular-vr', [
  //         '../../generators/app', [
  //           helpers.createDummyGenerator(),
  //           'angular'
  //         ]
  //       ]);
        
  //     }.bind(this))
    
  //     .run(path.join( __dirname, '../generators/app'))
  //     .withPrompts({ artifactsToRename: [] })
  //     .on('end', function () {
  //       // assert something
  //       console.log('now in end handler');
  // 	    // var b = true;    
  //       // assert.equal(b, true);

  //       done();
  //     });
  // });

  var angular_vr;
  
  var mockPrompts = {
    // compass: true,
    // bootstrap: true,
    // compassBootstrap: true,
    // modules: [],
    artifactsToRename: []
  };

 var genOptions = {
    'appPath': 'app',
    'skip-install': true,
    'skip-welcome-message': true,
    'skip-message': true,
    'angularAppFound': true,
    'skipBaseAppInstall' : true,
  };
  
  beforeEach(function (done) {
    var myHelper = null;
    helpers.testDirectory(path.join(__dirname, 'tmp', 'file'), function (err) {
      if (err) {
        done(err);
      }
      angular_vr = helpers.createGenerator(
        'angular-vr:app',
        [
          '../../../generators/app',
          // '../../../common',
          // '../../../controller',
          // '../../../main',
          [ helpers.createDummyGenerator(), 'angular:app' ]
        ],
        false,
        genOptions
      )
      // .on('ready', function(generator) {
      //   generator.fs.write('file.txt', 'foo');
      // })
      ;
      helpers.mockPrompt(angular_vr, mockPrompts);

      // create an angular install marker file, so the install doesn't try to install
      // angular base app.
      //fs.write('somefile.js', 'var a = 1;');
      //fs.write('tmp/app/scripts/app.js', 'marker file created by test-app.js');

     //  helpers.inTmpDir(function (dir) {
     //   var done = this.async(); // `this` is the RunContext object.
     //   //fs.copy(path.join(__dirname, '../templates/common'), dir, done);
     //   fs.write(path.join(__dirname, './tmp/app/scripts/app.js'),'hello');
     // });
      // helpers.on('ready', function(generator) {
      //   generator.fs.write('file.txt', 'foo');
      // });
     //fs_extra.writeFileSync('tmp/app/scripts/app.js', 'marker file created by test-app.js');
      //console.log('angular_vr=%o\n\n', angular_vr);
      done();
    });

  });

   // it('creates expected JS files', function (done) {
   //    angular_vr.run({}, function() {
   //      // helpers.assertFile([].concat(expected, [
   //      //   '.jscsrc',
   //      //   'app/scripts/app.js',
   //      //   'app/scripts/controllers/main.js',
   //      //   'test/spec/controllers/main.js'
   //      // ]));
   //      done();
   //    })
   //    // .on('ready', function(generator) {
   //    //   generator.fs.write('file.txt', 'foo');
   //    // })

   //   //  .inDir(function (dir) {
   //   //   console.log('inTmpDir call');
  
   //   //   var done = this.async(); // `this` is the RunContext object.
   //   //   //fs.copy(path.join(__dirname, '../templates/common'), dir, done);
   //   //   fs.write(path.join(__dirname, './tmp/app/scripts/app.js'),'hello');
   //   // })
   //   ;
   //  });

  it('creates expected files 2', function (done) {
    angular_vr.run({}, function(e) { done();});
  });
/*
  before(function (done) {
    helpers.createDummyGenerator('angular');
    
    helpers.run(path.join( __dirname, '../generators/app'))
      .withOptions({ foo: 'bar', angularAppFound: true })    // Mock options passed in
      .withArguments(['def'])      // Mock the arguments
      .withPrompts({
        coffee: false,
        artifactsToRename: []
      }) // Mock the prompt answers
      .on('ready', function (generator) {
        // This is called right before `generator.run()` is called
        //console.log('test-app.js: now in ready handler, this= %o', this);
        this.angularAppFound = true;
        // this.app = helpers.createGenerator('angular', [
        //   '../generators/app', [
        //     helpers.createDummyGenerator(),
        //     'angular'
        //   ]
        // ]);
        
      })
      .on('method:', function (m) {console.log('on-method: method=' + m);});
      //.on('end', done);
      //done();
  });  
*/
  // it('creates files', function () {
  //   assert.file([
  //     'bower.json',
  //     'package.json',
  //     '.editorconfig',
  //     '.jshintrc'
  //   ]);
  // });
  it("simple test", function() {
	var a = true;

    //expect(a).toBe(true);
    assert.equal(a, true);
  });
});

/* global require: false */
'use strict';

/**
  This file is used to configure the [grunt](http://gruntjs.com/) tasks
  aimed to generate the web frontend of the camunda BPM platform.
  @author Valentin Vago <valentin.vago@camunda.com>
  @author Nico Rehwaldt  <nico.rehwaldt@camunda.com>
 */

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var pkg = require('./package.json');

  var config = pkg.gruntConfig || {};

  config.grunt = grunt;
  config.pkg = pkg;

  grunt.initConfig({
    // the default value should be the "dev" destination
    // this is not exactly the best solution, but otherwise, when tasks are "rerunned"
    // with the watch tasks, the value get lost...
    // so, it's fine for the "dist" build mode
    // who will override the value but only run once
    buildTarget:      grunt.option('target') || config.devTarget,

    pkg:              pkg,

    bower:            require('camunda-commons-ui/grunt/config/bower')(config),

    jasmine_node:     require('camunda-commons-ui/grunt/config/jasmine_node')(config),

    karma:            require('camunda-commons-ui/grunt/config/karma')(config),

    requirejs:        require('./grunt/config/requirejs')(config),

    less:             require('camunda-commons-ui/grunt/config/less')(config),

    copy:             require('./grunt/config/copy')(config),

    watch:            require('./grunt/config/watch')(config),

    connect:          require('camunda-commons-ui/grunt/config/connect')(config),

    jsdoc:            require('camunda-commons-ui/grunt/config/jsdoc')(config),

    jshint:           require('camunda-commons-ui/grunt/config/jshint')(config),

    changelog:        require('camunda-commons-ui/grunt/config/changelog')(config),

    clean:            require('camunda-commons-ui/grunt/config/clean')(config)
  });

  grunt.registerTask('build', function(mode) {
    mode = mode || 'prod';

    grunt.config.data.buildTarget = (mode === 'prod' ? config.prodTarget : config.devTarget);
    grunt.log.subhead('Will build the "'+ pkg.name +'" project in "'+ mode +'" mode and place it in "'+ grunt.config('buildTarget') +'"');
    if (mode === 'dev') {
      grunt.log.writeln('Will serve on port "'+
        config.connectPort +
        '" and liverreload available on port "'+
        config.livereloadPort +
        '"');
    }

    var tasks = [
      'clean',
//       'jshint',
//       'jsdoc',
      'bower',
      'copy',
      'less',
      'requirejs'
    ];

    grunt.task.run(tasks);
  });


  grunt.registerTask('auto-build', [
    'build:dev',
    'watch'
  ]);


  grunt.registerTask('prepublish', ['build', 'changelog']);

  grunt.registerTask('default', ['build']);
};

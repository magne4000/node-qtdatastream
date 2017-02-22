'use strict';

var webpack = require('./webpack.config.js');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    nodeunit: {
      files: ['test/*_test.js']
    },
    eslint: {
      target: ['src/*.js', 'test/*_test.js']
    },
    jsdoc: {
      dist: {
        src: ['src/*.js', 'package.json', 'README.md'],
        options: {
          template: 'node_modules/docdash',
          configure: 'jsdoc.conf.json',
          destination: 'doc'
        }
      }
    },
    webpack: {
      web: webpack({BUILD_ENV: 'PROD', TARGET_ENV: 'WEB'}),
      node: webpack({BUILD_ENV: 'DEV', TARGET_ENV: 'NODE'})
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-webpack');

  // Default task.
  grunt.registerTask('default', ['eslint', 'webpack:node', 'nodeunit', 'webpack:web', 'jsdoc']);

};

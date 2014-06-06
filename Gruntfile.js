/*global module:false*/
module.exports = function (grunt) {
	'use strict';

	var fs = require('fs');
	var execSync = require('exec-sync');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			all: ['Gruntfile.js', 'src/*.js', 'test/*.js'],
			options: {
				jshintrc: '.jshintrc'
			}
		},
		concat: {
			options: {
				separator: '\n'
			},
			domComparator: {
				dest: 'test/dom-comparator.js',
				src: ['src/*.js']
			},
			unit: {
				dest: 'test/unit-tests.js',
				src: ['test/unit/*.spec.js']
			}
		},
		watch: {
			scripts: {
				files: ['src/*.js'],
				tasks: ['concat']
			},
			tests: {
				files: ['test/unit/*.spec.js'],
				tasks: ['concat', 'testem']
			},
			options: {
				spawn: false, // don't spawn another process
				livereload: true // runs livereload server on 35729
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('testem', function () {
		var testemConfig = {
			'test_page': 'test/test-index.html',
			'launch_in_ci': ['Chrome']
		};
		fs.writeFileSync('testem.json', JSON.stringify(testemConfig), {encoding: 'utf8'});
		var output = execSync('./node_modules/testem/testem.js ci');
		grunt.log.writeln(output);
		if (output.indexOf('not ok') >= 0) {
			grunt.fail.fatal('one or more tests failed');
		}
	});

	grunt.registerTask('default', ['concat', 'testem']);
};

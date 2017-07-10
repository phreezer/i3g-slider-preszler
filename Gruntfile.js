
module.exports = function (grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		appName: 'i3g Component',
		jsFileName: 'jquery.<%= pkg.name %>',
		cssFileName: 'i3g.component',
		banner: '/*!\n' +
			'* <%= pkg.prettyName %> - v<%= pkg.version %>\n' +
			'* Homepage: <%= pkg.homepage %>\n' +
			'* Author: <%= pkg.author.name %>\n' +
			'* Author URL: <%= pkg.author.url %>\n*/\n',
		concat: {
			options: {
				separator: '\n\n',
				banner: '<%= banner %>'
			},
			js: {
				src: [
		  'src/js/app.js'
		],
				dest: 'dist/js/<%= jsFileName %>.js'
			}/*,
			css: {
				src: [
		  'src/css/main.scss',
		  'src/css/variables.scss',
		  'src/css/core.scss'
		],
				dest: 'dist/scss/<%= cssFileName %>.scss'
			}*/
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				files: {
					'dist/js/<%= jsFileName %>.min.js': '<%= concat.js.dest %>'
				}
			}
		},
		sass: {
			options: {
				sourceMap: true,
				sourceMapContents: true,
				sourceMapEmbed: true
			},
			dist: {
				files: {
					'.tmp/styles/main.css': 'src/scss/main.scss'
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					'dist/css/<%= cssFileName %>.min.css': '.tmp/styles/main.css'
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', 'src/**/*.js'],
			options: {
				// options here to override JSHint defaults
				globals: {
					jQuery: true,
					console: true,
					module: true,
					document: true
				}
			}
		},
		copy: {
			'sass': {
				expand: true,
				cwd: 'src/scss',
				src: '**/*.*',
				dest: 'dist/scss/'
			},
			'images': {
				expand: true,
				cwd: 'src/images',
				src: '**/*.*',
				dest: 'dist/images/'
			},
			'fonts': {
				expand: true,
				cwd: 'src/fonts',
				src: '**/*.*',
				dest: 'dist/fonts/'
			}
		},
		watch: {
			files: ['<%= concat.js.src %>', 'src/**/*.scss'],
			tasks: ['jshint', 'concat', 'uglify', 'sass', 'cssmin', 'copy:sass', 'copy:images' , 'copy:fonts']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'sass', 'cssmin', 'copy:sass', 'copy:images' , 'copy:fonts']);

};

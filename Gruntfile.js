
module.exports = function (grunt) {

	var serveStatic = require('serve-static');

	grunt.initConfig({
		app: require( './bower.json' ).appPath || 'src',
		dist: 'dist',
		pkg: grunt.file.readJSON('package.json'),
		appName: '<%= pkg.name %>',
		jsFileName: '<%= pkg.name %>',
		cssFileName: '<%= pkg.name %>',
		// The actual grunt server settings
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: 'localhost',
				livereload: 35729
			},
			livereload: {
				options: {
					open: true,
					middleware: function ( connect ) {
						return [
							connect().use(function (req, res, next) {
								res.setHeader('Access-Control-Allow-Origin', '*');
								res.setHeader('Access-Control-Allow-Methods', '*');
								next();
							}),
							serveStatic( 'dist' ),
							connect().use(
								'/bower_components',
								serveStatic( './bower_components' )
							),
							serveStatic( 'examples' )
						];
					}
				}
			},
			dist: {
				options: {
					open: true,
					base: '<%= yeoman.dist %>'
				}
			}
		},
		banner: '/*!\n' +
			'* <%= pkg.name %> - v<%= pkg.version %>\n' +
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
					'<%= app %>/js/service.js',
					'<%= app %>/js/directive.js'
		],
				dest: '<%= dist %>/js/<%= jsFileName %>.js'
			}
		},
		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist: {
				files: {
					'<%= dist %>/js/<%= jsFileName %>.min.js': '<%= concat.js.dest %>'
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
					'.tmp/styles/main.css': '<%= app %>/scss/main.scss'
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					'<%= dist %>/css/<%= cssFileName %>.min.css': '.tmp/styles/main.css'
				}
			}
		},
		jshint: {
			files: ['Gruntfile.js', '<%= app %>/**/*.js'],
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
				cwd: '<%= app %>/scss',
				src: '**/*.*',
				dest: '<%= dist %>/scss/'
			},
			'images': {
				expand: true,
				cwd: '<%= app %>/images',
				src: '**/*.*',
				dest: '<%= dist %>/images/'
			},
			'fonts': {
				expand: true,
				cwd: '<%= app %>/fonts',
				src: '**/*.*',
				dest: '<%= dist %>/fonts/'
			},
			'html': {
				expand: true,
				cwd: '<%= app %>/views',
				src: '**/*.*',
				dest: '<%= dist %>/views/'
			}
		},
		preprocess: {
			options: {
				inline: true
			},
			'prod': {
				options: {
					inline: true,
					context: {
						PROD: true
					}
				},
				src: [
					'<%= dist %>/**/*.html',
					'<%= dist %>/**/*.js'
				]
			},
			'dev': {
				options: {
					inline: true,
					context: {
						DEBUG: true
					}
				},
				src: [
					'<%= dist %>/**/*.html',
					'<%= dist %>/**/*.js'
				]
			}
		},
		watch: {
			files: ['<%= concat.js.src %>', '<%= app %>/**/*.scss', '<%= app %>/**/*.html'],
			tasks: ['jshint', 'concat', 'uglify', 'sass', 'cssmin', 'copy:sass', 'copy:images' , 'copy:fonts', 'copy:html'],
			options: {
				livereload: '<%= connect.options.livereload %>',
				event: ['all']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-preprocess');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('build', ['jshint', 'concat', 'uglify', 'sass', 'cssmin', 'copy:sass', 'copy:images' , 'copy:fonts', 'copy:fonts', 'preprocess:prod']);

	grunt.registerTask('serve', ['jshint', 'concat', 'uglify', 'sass', 'cssmin', 'copy:sass', 'copy:images' , 'copy:fonts', 'copy:fonts', 'preprocess:dev', 'connect:livereload', 'watch']);

};

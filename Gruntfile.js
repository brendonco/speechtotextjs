module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // browserify: {
    //   dist: {
    //     files: {
    //       './dist/www/js/main.js': ['app/main.js'],
    //     }
    //   }
    // },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    copy:{
      main:{
        files:[
          {expand:true, flatten:true, src:['node_modules/knockout/build/output/*.js'], dest:'./dist/www/lib'},
          {expand:true, flatten:true, src:['node_modules/eventjs/build/event.browser.min.js'], dest:'./dist/www/lib'},
          {expand:true, flatten:true, src:['node_modules/requirejs/*.js'], dest:'./dist/www/lib'},
          {expand:true, cwd: 'app/', src:['./*.html'], dest:'./dist/www/'},
          {expand:true, flatten:true, cwd: 'app/', src:['./scripts/api/speechtotext.js'], dest:'./dist/www/js/'},
          {expand:true, flatten:true, src:['app/img/*.gif', 'app/img/*.png'], dest:'./dist/www/img'}
        ]
      }
    },
    concat: {
      js: {
        src: ['app/scripts/*.js'], //['app/controllers/*.js', 'app/controllers/**/*.js', 'app/directives/**/*.js', 'app/services/**/*.js'],
        dest: './dist/www/js/main.js'
      }
    },
    clean:{
      options: { force:true },
      release:["./dist/www"]
    },
    mocha: {
      test: {
        src: ['test/**/*.html'],
        options: {
          run: true,
          logErrors: true
        }
      }
    },
    watch: {
      scripts: {
        files: ['app/scripts/**/*.js', 'app/**/*.html', 'app/**/*.scss'],
        tasks: ['default'],
        options: {
          spawn: false,
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.loadNpmTasks('grunt-mocha');

  // Default task(s).
  //grunt.registerTask('default', ['clean', 'concat', 'copy:main']);
  grunt.registerTask('default', ['clean', 'concat', 'copy:main', 'watch']);

};
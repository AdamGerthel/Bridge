module.exports = function(grunt) {

 grunt.registerTask('watch', [ 'watch' ]);

 grunt.initConfig({
   sass: {
     style: {
       files: {
         "theme/css/main.css": "theme/sass/main.scss"
       }
     }
   },
   jshint: {
    all: {
      src: ['app/*.js']
    }
   },
   watch: {
     js: {
       files: ['app/*.js'],
       tasks: ['jshint'],
       options: {
         livereload: false,
       }
     },
     css: {
       files: ['theme/sass/**/*.scss'],
       tasks: ['sass:style'],
       options: {
         livereload: false,
       }
     }
   }
 });

 grunt.loadNpmTasks('grunt-contrib-jshint');
 grunt.loadNpmTasks('grunt-contrib-sass');
 grunt.loadNpmTasks('grunt-contrib-watch');

};

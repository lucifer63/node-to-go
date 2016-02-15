module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            scripts: {
                src: 'js/**.js'
            }
        },

        uglify: {
            scripts: {
                expand: true,
                cwd: 'js/',
                src: '**.js',
                dest: 'build/',
                ext: '.min.js'
            }
        },

        less: {
            styles: {
                files: {
                    'build/styles/admin.css': 'css/admin.less',
                    'build/styles/default.css': 'css/default.less'
                }
            }
        },

        watch: {
            scripts: {
                files: 'js/**.js',
                task: 'jshint:scripts'
            },

            styles: {
                files: 'css/**.less',
                task: 'less:styles'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jshint', 'less']);
    grunt.registerTask('build', ['jshint', 'uglify', 'less']);

};
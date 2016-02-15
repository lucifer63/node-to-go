module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            scripts: {
                src: [ 
                    'server.js',
                    'js/**.js', 
                    '!**/arp.js',
                    '!**/async.js',
                    '!**/*.min.js'
                ]
            }
        },

        uglify: {
            scripts: {
                expand: true,
                cwd: 'js/',
                src: [ 
                    '**.js',
                    '!*.min.js'
                ],
                dest: 'build/js/'
            }
        },

        less: {
            styles: {
                files: {
                    'build/css/admin.css': 'css/admin.less',
                    'build/css/default.css': 'css/default.less'
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
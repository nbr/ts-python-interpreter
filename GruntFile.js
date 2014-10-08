module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    //grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-qunit'); //Note: Requires, bundled with PhantomJS

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    port: 8080,
                    base: './'
                }
            }
        },
        typescript: {
            base: {
                src: ['src/*.ts'],
                dest: 'compiled/',
                options: {
                    module: 'amd',
                    target: 'es5'
                }
            }
        },
        //watch: {
        //    files: '**/*.ts',
        //    tasks: ['typescript']
        //},
        open: {
            dev: {
                path: 'http://localhost:8080/index.html'
            }
        }
    });

    //@nbraga: For now, not using 'watch' but could be useful later
    //grunt connect:keepalive would run server indefinitely if needed
    //O/w I am adding QUnit tests and then will close
    grunt.registerTask('default', ['connect', 'open']);

}

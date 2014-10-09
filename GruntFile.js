module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-qunit'); //Note: Requires, bundled with PhantomJS

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        qunit: {
            all: ['test/index.html']
        },
        /*connect: {
            server: {
                options: {
                    port: 8080,
                    base: './'
                }
            }
        },*/
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
        watch: {
            files: 'src/*.ts',
            tasks: ['typescript','qunit']
        },
        open: {
            dev: {
                path: 'test/index.html'
            }
        }
    });
    grunt.registerTask('default',['qunit']);
    grunt.registerTask('watch',['qunit','watch'])
    grunt.registerTask('show-results', ['qunit','open']);

}

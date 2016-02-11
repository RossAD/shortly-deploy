module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      uploadToServer: 'git push live master'
    },
    concat: {
      options: { separator: ';'},
      dist : {
        src : ['public/client/**/*.js'],
        dest : 'public/dist/<%= pkg.name %>.js'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      target: {
        files: {
          'public/dist/<%= pkg.name %>.min.js' : ['<%= concat.dist.dest %>']
        }
      }
    },

    eslint: {
      target: [
        'public/client/*.js',
        // Add list of files to lint here
      ]
    },

    cssmin: {
      target: {
        files: {
          'public/dist/min.css': ['public/*.css']
        }
      }
    },
    processhtml: {
      files: {'views/index.ejs': ['views/index.ejs']}
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
    sshconfig: {
      someserver: {
        host: 'http://104.236.180.13', // is this right?
        username: 'root',
        password: 'batman',
        agent: process.env.SSH_AUTH_SOCK,
        agentForward: true
      }
    },
    sshexec: {
      deploy: {
        command: [
          'cd root/shortly-deploy',
          'npm install',
          'nodemon server.js'
        ].join(' && '),
        options: {
          config: 'someserver'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-processhtml');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'eslint',
    'mochaTest'
  ]);

  grunt.registerTask('build', ['concat','uglify','cssmin','processhtml']);

  grunt.registerTask('upload', function(n) {
    // if (grunt.option('prod')) {
      // git push live master
      grunt.task.run(['exec']);
      //push to live master
      // add your production server task here
    // } else {
    //   grunt.task.run([ 'server-dev' ]);
    // }
  });

  grunt.registerTask('deploy', function(target) {
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);
    
    grunt.task.run([ 'test' ]);
    grunt.task.run([ 'build' ]);
    grunt.task.run([ 'upload' ]);
    grunt.task.run([ 'watch' ]);
    grunt.task.run([ 'sshexec' ]);

  })Ω;


};

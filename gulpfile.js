var gulp = require('gulp');
var coffee = require('gulp-coffee');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var docco = require('gulp-docco');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

// paths
var p = {};
p.docs = {
  out: 'docs/'
};
p.docs.docco = {
  root: p.docs.out+'docco/',
  in: '*.md'
};
p.docs.docco.out = p.docs.docco.root+'docs';
p.scripts = {
  src: 'src/**/*coffee',
  lib: 'lib',
  docco: p.docs.docco.root+'lib'
};
p.tests = {
  src: 'test/'+p.scripts.src,
  lib: 'test/'+p.scripts.lib,
  docco: p.docs.docco.root+'tests'
};
p.examples = {
  src: 'examples/'+p.scripts.src,
  lib: 'examples/'+p.scripts.lib,
  docco: p.docs.docco.root+'examples'
};

// delete glob helper
rmglob = function(glob, cb) {
  del(glob, cb);
}

// compile (lit)coffeescript helper
compile = function(src, lib) {
  return gulp.src(src)
    .pipe(sourcemaps.init())
    .pipe(coffee())
    .pipe(sourcemaps.write({ includeContent: false, sourceRoot: __dirname+'/'+lib }))
    .pipe(gulp.dest(lib));
};

// docco helper
doccompile = function(src, out) {
  return gulp.src(src)
    .pipe(docco())
    .pipe(gulp.dest(out));
};

// istanbul + mocha helper
coverage_and_test = function () {
  return gulp.src(p.scripts.lib+'/**/*.js')
    .pipe(istanbul())
    .on('finish', function () {
      gulp.src(p.tests.lib+'/*.js', { read: false })
        .pipe(mocha({
          reporter: 'spec',
          timeout: 2000,
          harmony: true
        }))
        .pipe(istanbul.writeReports({
          reporters: ['lcov', 'text', 'text-summary']
        }));
    });
};

// setup tasks
tasks = {
  compile_scripts: function() { return compile(p.scripts.src, p.scripts.lib) },
  compile_tests: function() { return compile(p.tests.src, p.tests.lib) },
  compile_examples: function() { return compile(p.examples.src, p.examples.lib) },
  compile: ['compile_scripts', 'compile_tests', 'compile_examples'],
  docco_scripts: function () { return doccompile(p.scripts.src, p.scripts.docco) },
  docco_tests: function () { return doccompile(p.tests.src, p.tests.docco) },
  docco_examples: function () { return doccompile(p.examples.src, p.examples.docco) },
  docco_docs: function() { return doccompile(p.docs.docco.in, p.docs.docco.out) },
  docs: ['docco_docs', 'docco_scripts', 'docco_tests', 'docco_examples'],
  clean_compile: function(done) { rmglob ([p.scripts.lib, p.tests.lib, p.examples.lib], done); },
  clean_docco: function(done) { rmglob ([p.docs.docco.root], done); },
  clean_coverage: function(done) { rmglob (['coverage'], done); },
  clean: ['clean_compile', 'clean_docco', 'clean_coverage'],
  tests: [['compile_tests', 'compile_scripts'], function() { return coverage_and_test() }],
  watch: ['watch_compile', 'watch_docs'],
  default: ['compile', 'docs']
}
tasks.watch_compile = function() {
  gulp.watch(p.scripts.src, ['compile_scripts']);
  gulp.watch(p.tests.src, ['compile_tests']);
  gulp.watch(p.examples.src, ['compile_examples']);
};
tasks.watch_docs = function() {
  gulp.watch(p.docs.docco.in, ['docco_docs']);
  gulp.watch(p.scripts.src, ['docco_scripts']);
  gulp.watch(p.tests.src, ['docco_tests']);
  gulp.watch(p.examples.src, ['docco_examples']);
};

// tell gulp about every task
Object.keys(tasks).forEach(function(t) {
  if (tasks[t] instanceof Array && tasks[t][0] instanceof Array) {
    gulp.task(t, tasks[t][0], tasks[t][1]);
  } else {
    gulp.task(t, tasks[t]);
  }
});

var gulp = require('gulp');
var coffee = require('gulp-coffee');
var docco = require('gulp-docco');
var sourcemaps = require('gulp-sourcemaps');

var paths = {
  scripts: {
    in: 'src/**/*coffee',
    out: 'lib'
  },
  tests: {
    in: 'test/src/**/*coffee',
    out: 'test/lib'
  },
  docco: {
    in: '*.md',
    out: 'docs/docco'
  }
};

paths.docco_scripts = {
  in: paths.scripts.in,
  out: 'docs/docco/lib'
};

paths.docco_tests = {
    in: paths.tests.in,
    out: 'docs/docco/tests'
};

gulp.task('scripts', function() {
  return gulp.src(paths.scripts.in)
    .pipe(sourcemaps.init())
    .pipe(coffee())
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: __dirname+'/src'}))
    .pipe(gulp.dest(paths.scripts.out));
});

gulp.task('tests', function() {
  return gulp.src(paths.tests.in)
    .pipe(sourcemaps.init())
    .pipe(coffee())
    .pipe(sourcemaps.write({includeContent: false, sourceRoot: __dirname+'/test/src'}))
    .pipe(gulp.dest(paths.tests.out));
});

docco_scripts = function() {
  return gulp.src(paths.docco_scripts.in)
  .pipe(docco())
  .pipe(gulp.dest(paths.docco_scripts.out))
};
gulp.task('docco_scripts', docco_scripts);

docco_tests = function() {
  return gulp.src(paths.docco_tests.in)
  .pipe(docco())
  .pipe(gulp.dest(paths.docco_tests.out))
};
gulp.task('docco_tests', docco_tests);


docco_examples = function() {
  return gulp.src('examples/**/*coffee')
  .pipe(docco())
  .pipe(gulp.dest('docs/docco/examples'))
};
gulp.task('docco_examples', docco_examples);


gulp.task('docco', function() {
  var ret = gulp.src(paths.docco.in)
  .pipe(docco())
  .pipe(gulp.dest(paths.docco.out));

  docco_scripts();
  docco_tests();
  docco_examples();

  return ret;
});

gulp.task('watch', function() {
  gulp.watch(paths.scripts.in, ['scripts', 'docco']);
  gulp.watch(paths.tests.in, ['tests', 'docco']);
});

gulp.task('default', ['scripts', 'tests', 'docco', 'watch']);

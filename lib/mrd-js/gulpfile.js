const { series, parallel, src, dest } = require('gulp');

var uglify        = require('gulp-uglify');
var concat        = require('gulp-concat');


function build(callback){
   return src([
      './src/jsrsasign/jsrsasign-all-min.js',
      './src/*.js',
   ])
   .pipe(concat('MRD.min.js'))
   // .pipe(uglify())
   .pipe(dest('./'))
}

exports.build = series(build);
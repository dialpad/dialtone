var gulp = require('gulp');
var cp = require('child_process');
var browsersync = require('browser-sync').create();
var config = require('../config').jekyll;

//  Build Jekyll site
gulp.task('jekyll', function(done) {
    // browsersync.notify('Compiling Jekyll site. Hold on...');

    return cp
        .spawn(
            'jekyll',
            [
                'build',
                '--source=' + config.src,
                '--destination=' + config.dest,
                '--config=' + config.config,
                '--baseurl=' + config.baseurl
            ],
            { stdio: 'inherit' }
        )
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll'], function(done) {
    browsersync.reload();
    done();
});

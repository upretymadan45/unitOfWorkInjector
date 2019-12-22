var gulp = require("gulp")
var inject = require("gulp-inject-string")
var stripCode = require('gulp-strip-code');
var fs = require('fs')


gulp.task('inject', async function () {
    var repos = JSON.parse(fs.readFileSync("./repositories.json")).repositories

    var iUowContent = ''
    var uowDeclarationContent = ''
    var uowInitializationContent = ''

    repos.forEach(repo => {
        iUowContent = iUowContent + `I${repo} ${repo}{get;}\n`

        uowDeclarationContent = uowDeclarationContent + `public I${repo} ${repo}{get;}\n`

        uowInitializationContent = uowInitializationContent + `${repo} = new ${repo}(context);\n`
    });

    gulp.src('IUow.cs')
        .pipe(stripCode({
            start_comment: "start-iuow-block",
            end_comment: "end-iuow-block",
            keep_comments: true
        }))
        .pipe(inject.after('/* start-iuow-block */', '\n' + iUowContent))
        .pipe(gulp.dest('./'))

    gulp.src('Uow.cs')
        .pipe(stripCode({
            start_comment: "start-uow-dec-block",
            end_comment: "end-uow-dec-block",
            keep_comments: true
        }))
        .pipe(stripCode({
            start_comment: "start-uow-ini-block",
            end_comment: "end-uow-ini-block",
            keep_comments: true
        }))
        .pipe(gulp.dest('./'))
        .pipe(inject.after('/* start-uow-dec-block */', '\n' + uowDeclarationContent))
        .pipe(inject.after('/* start-uow-ini-block */', '\n' + uowInitializationContent))
        .pipe(gulp.dest('./'))
});


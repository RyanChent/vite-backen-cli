#! node
const program = require('commander')
const download = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')

program.version('1.0.0', '-v, --version')
    .command('init <name>')
    .action((name) => {
        // 开始下载
        const spinner = ora('Downloading...');
        spinner.start();
        download('github:RyanChent/vite-backen-admin#master', name, { clone: true }, (err) => {
            if (err) {
                spinner.fail()
                console.log(symbols.error, chalk.red('Failed'))
            } else {
                spinner.succeed()
            }

            console.log(symbols.success, chalk.green('Success'))
            console.log(`Done. Now run:
                cd ${name}
                npm install (or yarn)
                npm run dev (or yarn dev)
                `)
        })
    })
program.parse(process.argv);
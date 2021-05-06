#! node
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const fs = require('fs')
const handlebars = require('handlebars')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')
const exec = require('child_process').exec

program.version('1.0.0', '-v, --version')
    .command('init <name>')
    .action((name) => {
        inquirer.prompt([
            {
                name: 'description',
                message: '请输入项目描述'
            },
            {
                name: 'author',
                message: '请输入作者名称'
            }
        ]).then((answers) => {
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
                const meta = {
                    name,
                    description: answers.description,
                    author: answers.author
                }
                const fileName = `${name}/package.json`
                const content = fs.readFileSync(fileName).toString()
                const result = handlebars.compile(content)(meta)
                fs.writeFileSync(fileName, result)

                console.log(symbols.success, chalk.green('Success'))
                console.log(`Done. Now run:
                cd ${name}
                npm install (or yarn)
                npm run dev (or yarn dev)
                `)
                exec(`cd ${name} && npm install`, (err, stdout, stderr) => {
                    if (stderr) {
                        console.log(stderr)
                        process.exit()
                    } else {
                        console.log(chalk.green('Init Success'))
                    }
                })
            })

        })
    })
program.parse(process.argv);
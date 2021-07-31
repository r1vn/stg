#!/usr/bin/env node

'use strict' // 2021-07-30 07.55

const fs = require('fs')
const os = require('os')
const { xdArgvParse } = require('./util/xdArgvParse')
const { xdStringGenerate } = require('./util/xdStringGenerate')
const { xdFileWrite } = require('./util/xdFileWrite')

class OptsCLI
{
    count = 1
    outfile
    
    constructor (argv)
    {
        if (argv.args.length > 2)
        {
            this.count = Number(argv.args[2])

            if (!Number.isInteger(this.count) || this.count < 1)
            {
                throw `count must be an integer > 0`
            }
        }

        if (argv.opts.hasOwnProperty('o'))
        {
            if (typeof argv.opts.o !== 'string')
            {
                throw `no output file specified`
            }

            this.outfile = require('path').resolve(argv.opts.o)
        }
    }
}

class OptsGen
{
    preset
    length = 16
    case
    interval
    separator = ' '
    
    constructor (argv)
    {
        if (fs.existsSync(`${ os.homedir() }/.config/stg/${ argv.args[0] }`))
        {
            this.preset = fs.readFileSync(`${ os.homedir() }/.config/stg/${ argv.args[0] }`, 'utf8').split('\n').filter(str => str !== '')
        }
        else if (fs.existsSync(`${ __dirname }/presets/${ argv.args[0] }`))
        {
            this.preset = fs.readFileSync(`${ __dirname }/presets/${ argv.args[0] }`, 'utf8').split('\n').filter(str => str !== '')
        }
        else
        {
            this.preset = argv.args[0].split('')
        }

        if (argv.args.length > 1)
        {
            this.length = Number(argv.args[1])

            if (!Number.isInteger(this.length) || this.length < 1)
            {
                throw `length must be an integer > 0`
            }
        }

        if (argv.opts.hasOwnProperty('c'))
        {
            if      (argv.opts.c === 'l') this.case = 'lower'
            else if (argv.opts.c === 'u') this.case = 'upper'
            else if (argv.opts.c === 'm') this.case = 'mixed'
            else throw `if specified, case (-c) must be 'l', 'u', or 'm' (lower/upper/mixed)`
        }

        if (argv.opts.hasOwnProperty('i'))
        {
            if (typeof argv.opts.i !== 'string')
            {
                throw `no interval specified`
            }

            this.interval = Number(argv.opts.i)

            if (!Number.isInteger(this.interval) || this.interval < 0)
            {
                throw `interval must be an integer >= 0`
            }
        }

        if (argv.opts.hasOwnProperty('s'))
        {
            if (typeof argv.opts.s !== 'string')
            {
                throw `no separator specified`
            }

            this.separator = argv.opts.s
        }
    }
}

void function main ()
{
    process.addListener('uncaughtException', err =>
    {
        console.error(err.message || err)
        process.exit(1)
    })

    // opts

    const argv = xdArgvParse(process.argv.slice(2))

    if (argv.opts.help)
    {
        const readme = fs.readFileSync(__dirname + '/README.md', 'utf8')
        console.log(readme.match(/```([\s\S]*?)```/)[1].trim())
        console.log(`\npreset files can be placed to the following directories, one character or word per line:\n${ __dirname }/presets\n${ os.homedir() }/.config/stg`)
        return
    }

    if (!argv.args.length)
    {
        console.log(`stg preset [length=16] [count=1] [opts]\nrun "stg -help" or go to https://github.com/r1vn/stg for more detail`)
        return
    }

    if (argv.args.length > 3)
    {
        throw `expected 1-3 arguments, got ${ argv.args.length }`
    }

    for (const key in argv.opts)
    {
        if (!['t', 's', 'c', 'i', 'o', 'debug'].includes(key))
        {
            throw `unknown option: ${ key }`
        }
    }

    const optsCLI = new OptsCLI(argv)
    const optsGen = new OptsGen(argv)

    if (argv.opts.debug) console.log({ argv, optsCLI, optsGen })

    // output
    
    if (optsCLI.outfile)
    {
        const { xdFileWrite } = require('./util/xdFileWrite')

        console.log(`writing to ${ optsCLI.outfile }`)
        
        try
        {
            xdFileWrite(optsCLI.outfile, '')
        }
        catch (err)
        {
            throw `failed to create the output file ${ optsCLI.outfile }: ${ err.message }`
        }
    }
    
    const outstream = optsCLI.outfile ? fs.createWriteStream(optsCLI.outfile) : process.stdout

    for (let i = 0; i < optsCLI.count; i++)
    {
        outstream.write(xdStringGenerate(optsGen) + '\n')
    }

    // trivia

    if (argv.opts.t)
    {
        const { bigPow, bigLog2 } = require('./util/etc')

        const p = bigPow(optsGen.preset.length, optsGen.length)
        const { expn, precise } = bigLog2(p)
        const pn = `${ optsGen.preset.length }^${ optsGen.length }`

        if (!optsCLI.outfile) console.log('---------------------')
        console.log(`permutations = ${ pn } = ${ p }`)
        console.log(`entropy bits = log2(${ pn }) ${ precise ? '=' : '≈' } ${ expn }`)
    }
}()
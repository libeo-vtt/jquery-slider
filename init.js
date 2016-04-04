#!/usr/bin/env node

var fs = require('fs');
var rm = require('rimraf');
var glob = require('multi-glob').glob;
var program = require('commander');
var inquirer = require('inquirer');
var package = require('./package.json');
var bower = require('./bower.json');

program
    .version(package.version)
    .option('-n, --name', 'project name')
    .parse(process.argv);

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}

// Initialisation prompt questions
var questions = [{
    name: 'name',
    message: 'Plugin name (lowercase):',
    validate: function(input) {
        return input !== '' ? true : 'You must enter a valid name.';
    }
}, {
    name: 'version',
    message: 'Project version:',
    default: '0.0.0',
    validate: function(input) {
        return input !== '' ? true : 'You must enter a valid version.';
    }
}, {
    name: 'description',
    message: 'Plugin description:'
}, {
    name: 'keywords',
    message: 'Plugin keywords:'
}, {
    name: 'repository',
    message: 'Plugin repository:'
}];

// Prompt user for project informations
inquirer.prompt(questions, function(answers) {

    // Update package.json values
    package.name = 'vtt-jquery-' + answers.name;
    package.version = answers.version;
    package.description = answers.description;
    package.keywords = answers.keywords;
    package.repository = answers.repository;

    // Update bower.json values
    bower.name = 'vtt-jquery-' + answers.name;
    bower.version = answers.version;
    bower.description = answers.description;
    bower.keywords = answers.keywords;
    bower.main = 'dist/jquery.' + answers.name + '.js';
    bower.homepage = answers.repository;

    // Update package.json
    fs.writeFile('./package.json', JSON.stringify(package, null, 2), function(error) {
        if (error) return console.log(error);
    });

    // Update bower.json
    fs.writeFile('./bower.json', JSON.stringify(bower, null, 2), function(error) {
        if (error) return console.log(error);
    });

    // Rename plugin main file
    fs.renameSync('./src/jquery.plugin.js', './src/jquery.' + answers.name + '.js');

    // Save new project values
    glob(['./src/jquery.' + answers.name + '.js', './demo/index.html'], function(error, files) {
        if (error) return console.log(error);

        for (var i = 0, t = files.length; i < t; i++) {
            (function(i) {
                var file = files[i];

                // Replace module name inside template file
                fs.readFile(file, 'utf8', function(error, data) {
                    if (error) return console.log(error);

                    data = replaceAll('MODULENAME_LOWERCASE', answers.name, data);
                    data = replaceAll('MODULENAME_UPPERCASE', answers.name.charAt(0).toUpperCase() + answers.name.slice(1), data);

                    fs.writeFile(file, data, 'utf8', function(error) {
                        if (error) return console.log(error);
                    });
                });
            })(i);
        }
    });
});

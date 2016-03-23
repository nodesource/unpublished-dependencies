#!/usr/bin/env node

var fs = require('fs')
var path = require('path')
var find = require('find')
var prettyjson = require('prettyjson')

var packageList = path.join(__dirname, 'packages-list.txt')
var modules = fs.readFileSync(packageList, 'utf8').split('\n')

var deps = findDeps(process.argv[2])
if (deps.length > 0) {
  console.log('We found the following unpublished dependencies in your projects:\n')
  console.log(prettyjson.render(deps) + '\n')
  console.log('Please feel free to open a ticket on https://support.nodesource.com and include the output of this command, our N|Support team will be able to assist you on how to proceed.')
} else {
  console.log('No unpublished dependencies found in your Node.js projects')
}

function findDeps (dir) {
  console.log('Looking for unpublished dependencies in your Node.js projects\n')

  var packages
  try {
    packages = find.fileSync('package.json', path.resolve(dir))
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }

  var depended = []
  for (var i = 0; i < packages.length; i++) {
    var packageName = packages[i]
    var pkg
    try {
      pkg = require(path.resolve(dir, packageName))
      var dependencies = modules.filter(function (item) {
        return pkg.dependencies && pkg.dependencies[item] ||
          pkg.devDependencies && pkg.devDependencies[item]
      })

      if (dependencies.length > 0) {
        depended.push({
          package: packageName,
          dependencies: dependencies
        })
      }
    } catch (e) {
    }
  }

  return depended
}

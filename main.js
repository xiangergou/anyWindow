const http = require('http');
const libPath = require('path');
const libUrl = require('url');
var libFs = require("fs");      //文件系统模块 

const promisify = require('util').promisify;
const readdir = promisify(libFs.readdir)
const stat = promisify(libFs.stat)

const route = require('./utils/route.js');


http.createServer(async (req, res) => {
  let pathName = libUrl.parse(req.url).pathname;

  // if (libPath.extname(pathName) == "") {
  //     //如果路径没有扩展名 
  //   pathName = libPath.join(pathName, "index.html") //指定访问目录 
  // }
  // if (pathName.charAt(pathName.length - 1) == "/") {
  //     //如果访问目录 
  //   // libPath.join(pathName, "index.html")
  //     pathName += "index.html"; //指定为默认网页 
  // }

  var filePath = libPath.join("./", pathName);
  route(req, res, filePath)

}).listen(8888);
console.log('Server running on port 8888.');
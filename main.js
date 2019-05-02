const http = require('http');
const libPath = require('path');
const libUrl = require('url');
var libFs = require("fs");      //文件系统模块 


//依据路径获取返回内容类型字符串,用于http响应头 
var funGetContentType = function (filePath) {
  var contentType = "";

  //使用路径解析模块获取文件扩展名 
  var ext = libPath.extname(filePath);

  switch (ext) {
    case ".html":
      contentType = "text/html";
      break;
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".gif":
      contentType = "image/gif";
      break;
    case ".jpg":
      contentType = "image/jpeg";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".ico":
      contentType = "image/icon";
      break;
    default:
      contentType = "application/octet-stream";
  }

  //返回内容类型字符串 
  return contentType;
}


http.createServer((req, res) => {
  let pathName = libUrl.parse(req.url).pathname;


  if (libPath.extname(pathName) == "") {
      //如果路径没有扩展名 
    pathName = libPath.join(pathName, "index.html") //指定访问目录 
  }
  if (pathName.charAt(pathName.length - 1) == "/") {
      //如果访问目录 
    // libPath.join(pathName, "index.html")
      pathName += "index.html"; //指定为默认网页 
  }

  var filePath = libPath.join("./", pathName);

  libFs.stat(filePath, (err, stats) => {
    if (err) {
      return err
    }
    if (stats.isDirectory()) {
    }
    else if (stats.isFile()) {
      // libFs.readFile(filePath, (err, content) => {
      //   if (err) return err;
      //   res.end(content)
      // })
     
      res.writeHead(200, { "Content-Type": funGetContentType(filePath) });
      
      let stream = libFs.createReadStream(filePath);
      //指定如果流读取错误,返回404错误 
      stream.on("error", function () {
        res.writeHead(404);
        res.end("<h1>404 Read Error</h1>");
      });
      
      stream.pipe(res);

      // stream.on('end', (content) => {
      //   stream.pipe(res);
      // })
    }
  })



}).listen(8888);
console.log('Server running on port 8888.');
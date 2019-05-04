
const libPath = require('path');
const libUrl = require('url');
var libFs = require("fs");      //文件系统模块 

const promisify = require('util').promisify;
const readdir = promisify(libFs.readdir)
const stat = promisify(libFs.stat)

const handlebars = require('handlebars');

const tplPath = libPath.join(__dirname, '../template/dir.tpl')
const source = libFs.readFileSync(tplPath)
const template = handlebars.compile(source.toString());


const compress = require('./compress')


//依据路径获取返回内容类型字符串,用于http响应头 
var funGetContentType = function (filePath) {
  var contentType = "";

  //使用路径解析模块获取文件扩展名 
  var ext = libPath.extname(filePath);

  switch (ext) {
    case ".html": case ".tpl":
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


module.exports = async function(req, res, filePath) {
  try {
    const stats = await stat(filePath);
    if (stats.isDirectory()) {
      const files = await readdir(filePath);
      res.writeHead(200, { "Content-Type": "text/html" });
      const data = {
        title: libPath.basename(filePath),
        files,
        dir: libPath.relative(process.cwd(), filePath)
      }
      res.end(template(data))
    }
    else if (stats.isFile()) {
      res.setHeader('Content-Type', 'text/html')
      // res.writeHead(200, { "Content-Type": funGetContentType(filePath) });
      // way 1
      // libFs.readFile(filePath, (err, data) => {
      //   res.end(data.toString())
      // })

      // lib
      let rs = libFs.createReadStream(filePath);
      rs = compress(rs, req, res);
      rs.pipe(res);
      // let stream = libFs.createReadStream(filePath);
      //指定如果流读取错误,返回404错误 
      // stream.on("error", function () {
      //   res.writeHead(404);
      //   res.end("<h1>404 Read Error</h1>");
      // });

      // stream.pipe(res);
      // stream.on('end', (content) => {
      //   stream.pipe(res);
      // })
    }
  } catch (ex) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} is not a dictory or file`);
  }

}
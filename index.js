const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const serve = require('koa-static');
const path = require('path');
const route = require('koa-route');
const ejs = require('ejs');
const bodyParser = require('koa-bodyparser');


const main = serve(path.join(__dirname));
app.use(main);
app.use(bodyParser());

const compile = ctx => {
  try {
    ejs.renderFile(__dirname + '/parse.ejs', JSON.parse(fs.readFileSync('./json/schema.json')), {
      rmWhitespace: true,
    }, function (err, result) {
      if (!err) {
        ctx.response.body = result;
      }
      else {
        ctx.response.body = err.stack;
      }
    })
  } catch (e) {
    
  }
};

app.use(route.post('/compile', compile));

app.listen(8080);
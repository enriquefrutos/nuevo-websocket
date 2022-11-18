const express = require('express');
const app = express();
const PORT = 8081;
const { engine } = require('express-handlebars');
const Contenedor = require('./container/contenedor');
const ContenedorMsg = require('./container/contenedorMsg');

const moment = require('moment');
const timestamp = moment().format('h:mm a');

const datas = new Contenedor;
const dataMsg = new ContenedorMsg;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);

httpServer.listen(PORT, () => console.log("Listening http://localhost:" + PORT));

app.use('/public', express.static(__dirname + '/public'));

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);

app.get('/', async (req, res) => {
  res.render('productslist');
});



io.on("connection", async (socket) => {
  console.log(`Se conecto ${socket.id}`);

  socket.emit("product-list", await datas.getAll());

  socket.emit("msg-list", await dataMsg.getAll());

  socket.on("product", async (data) => {

    await datas.save(data);

    console.log('Se recibio un producto nuevo', "producto:", data);

    io.emit("product-list", await datas.getAll());

  });

  socket.on("msg", async (data) => {

    await dataMsg.save({ socketid: socket.id, timestamp: timestamp, ...data });

    console.log('Se recibio un msg nuevo', "msg:", data);

    io.emit("msg-list", await dataMsg.getAll());

  });
});



// Setup basic express server
var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var port = process.env.PORT || 3000;

server.listen(port, function() {
  console.log("Server listening at port %d", port);
});

// Routing
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.get("/dashboard", (req, res) => {
  res.sendFile("./dashboard");
});

// Chatroom

var numUsers = 0;
var btn1value = 20;
var btn2value = 20;
var btn3value = 20;

io.on("connection", function(socket) {
  var addedUser = false;
  console.log("usuario conectado");

  //////////////////////////  add user  ////////////////////////////////////////

  // when the client emits 'add user', this listens and executes
  socket.on("add user", function(username) {
    if (addedUser) return;
    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;

    socket.emit("login", {
      numUsers: numUsers,
      username: username,
      bar1: btn1value,
      bar2: btn2value,
      bar3: btn3value
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit("user joined", {
      username: socket.username,
      numUsers: numUsers
    });

    console.log("Quantidade de usuarios: " + numUsers);
  });
  ///////////////////// botao no dashboard acionado ///////////////////////////////
  
  socket.on("botaoAcionado", function(data){
    
    var dataStatus = data.status;
    var btn = data.buttom;
    
    console.log("Botão clicado: "+ btn);
    console.log("Status transmitido: "+ dataStatus);

    socket.broadcast.emit("acionarBotoes",{
      botao: btn,
      status:dataStatus});
  });
  
  socket.on("encheu", function(){
    console.log("Tem uma barra cheia");
    socket.broadcast.emit("cheio");
  });

  ////////////////////  btns nos clientes clicados ///////////////////////////////////////////////

  // when the client clicks btn1 we broadcast it to others
  socket.on("btn1clicked", function() {
    btn1value += 1;

    socket.broadcast.emit("update", {
      bar1: btn1value,
      bar2: btn2value,
      bar3: btn3value
    });

    socket.emit("btn1clicked", {
      bar: btn1value
    });
  });

  socket.on("btn2clicked", function() {
    btn2value += 5;

    socket.broadcast.emit("update", {
      bar1: btn1value,
      bar2: btn2value,
      bar3: btn3value
    });

    socket.emit("btn2clicked", {
      bar: btn2value
    });
  });
  socket.on("btn3clicked", function() {
    btn3value += 5;

    socket.broadcast.emit("update", {
      bar1: btn1value,
      bar2: btn2value,
      bar3: btn3value
    });

    socket.emit("btn3clicked", {
      bar: btn3value
    });
  });

  //////////////////////////////////////////////////////////////

  // when the client emits 'new message', this listens and executes
  socket.on("new message", function(data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit("new message", {
      username: socket.username,
      message: data
    });
    console.log("enviando mensagem");
  });

  ///////////////////////////////////////////////////////////////////////////

  // when the client emits 'typing', we broadcast it to others
  socket.on("typing", function() {
    socket.broadcast.emit("typing", {
      username: socket.username
    });
  });

  ////////////////////////////////////////////////////////////////////////////

  // when the client emits 'stop typing', we broadcast it to others
  socket.on("stop typing", function() {
    socket.broadcast.emit("stop typing", {
      username: socket.username
    });
  });

  ///////////////////////////////////////////////////////////////////////////

  // when the user disconnects.. perform this
  socket.on("disconnect", function() {
    console.log("usuario " + socket.username + " desconectado");

    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit("user left", {
        username: socket.username,
        numUsers: numUsers
      });
    }

    if (numUsers <= 0) {
      btn1value = 20;
      btn2value = 20;
      btn3value = 20;
    }
  });

  ///////////////////////////////////////////////////////////////////////////
});

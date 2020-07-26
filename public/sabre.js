var socket = io();
var vis = "visible";
var localuser = "";


socket.on("login", function(data) {
  localuser = data.username;
  var size = data.bar1;
  setBarSize("b01", size);
  size = data.bar2;
  setBarSize("b02", size);
  size = data.bar3;
  setBarSize("b03", size);
  console.log("initial bar size: " + size);
  console.log(localuser + " pode interagir");
});

socket.on("update", function(data) {
  var size = data.bar1;
  setBarSize("b01", size);
  size = data.bar2;
  setBarSize("b02", size);
  size = data.bar3;
  setBarSize("b03", size);
});

socket.on("acionarBotoes", function(data) {
  var status = data.status;
  var index = data.botao;
  if (status === "true") {
    showControls(index);
  } else {
    hideControls(index);
  }
});

function showControls(index) {
  var index = index;
  var btnEbar = [".fogo", ".algodao", ".agua"];

  document.querySelector(btnEbar[index]).style.display = "grid";
}

function hideControls(index) {
  var index = index;
  var btnEbar = [".fogo", ".algodao", ".agua"];

  document.querySelector(btnEbar[index]).style.display = "none";
}

function btn1() {
  socket.emit("btn1clicked");
}

function btn2() {
  socket.emit("btn2clicked");
}

function btn3() {
  socket.emit("btn3clicked");
}

socket.on("btn1clicked", function(data) {
  actionBtn("b01", data);
});

socket.on("btn2clicked", function(data) {
  actionBtn("b02", data);
});

socket.on("btn3clicked", function(data) {
  actionBtn("b03", data);
});

function actionBtn(btn, data) {
  var size = data.bar;
  var button = btn.toString();
  setBarSize(button, size);
}



function setBarSize(bar, size) {
  var size = size;
  var barsize = size.toString();
  barsize = barsize + "px";
  console.log("bar size: " + barsize);
  
    var min = 500;
    var max = 505;
  
  if (size <= min) {
    document.getElementById(bar).style.width = barsize;
  }
  else if(size>min && size<max){
    socket.emit("encheu");
  }
  hideAllControls();
}

var apagou = false;

function hideAllControls() {
  var btnEbar = [".fogo", ".algodao", ".agua"];

  if (apagou == false) {
      console.log("Escondendo os controles");

    var i;
    for (i = 0; i < btnEbar.length; i++) {
      //console.log("loopando");
      document.querySelector(btnEbar[i]).style.display = "none";
    }
  }
  apagou = true;
}

function showAllControls() {
  var btnEbar = [".fogo", ".algodao", ".agua"];

  if (apagou == true) {
      console.log("Escondendo os controles");

    var i;
    for (i = 0; i < btnEbar.length; i++) {
      //console.log("loopando");
      document.querySelector(btnEbar[i]).style.display = "grid";
    }
  }
  apagou = false;
}

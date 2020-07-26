var socket = io();
var vis = "visible";
var localuser = "";
var m_dashboard = document.getElementById("dashboard");
var plateia = document.getElementById("dashUsers");
var aviso = document.getElementById(".barraCheia");
var publico;

function dashboard(publico) {
  m_dashboard.innerHTML = "Painel controle produção";
  //plateia = document.getElementById("dashUsers");
  if (publico === undefined) {
    publico = 0;
  }
  plateia.innerHTML = " " + publico;
}

function acionarBtnFogo() {
  var btnStatus = document.forms["btnFogo"]["estado"].value;
  estadoBotoes(btnStatus,0);
}

function acionarBtnAlgodao() {
  var btnStatus = document.forms["btnAlgodao"]["estado"].value;
  estadoBotoes(btnStatus,1);
}

function acionarBtnAgua() {
  var btnStatus = document.forms["btnAgua"]["estado"].value;
  estadoBotoes(btnStatus,2);
}


function estadoBotoes(value,index) {
  
  var btnStatus = value;
  var ids = ["btnStatusFogo","btnStatusAlgodao","btnStatusAgua"];
  var btn = ["Fogo","Algodão","Água"];
  
  if (btnStatus === "true") {
    document.getElementById(ids[index]).innerHTML = " Botão ligado";
    console.log("Botão " +btn[index]+ " ligado");
  } else {
    document.getElementById(ids[index]).innerHTML  = " Botão desligado";
    console.log("Botão " +btn[index]+ " desligado");
  }
  
  socket.emit("botaoAcionado",{
    buttom: index,
    status : btnStatus
  });
}

socket.on("cheio", function(){
  console.log("Avisar que a barra encheu");
  document.getElementById("barraCheia").style.visibility = "visible";
})



socket.on("login", function(data) {
  localuser = data.username;
  //plateia.innerHTML = " "+publico;
  m_dashboard.innerHTML = "deu certo";
});

socket.on("update", function(data) {
  m_dashboard.innerHTML = "deu certo";
});

socket.on("user joined", function(data) {
  document.getElementById("dashUsers").innerHTML = data.numUsers;
});

socket.on("user left", function(data) {
  var plateia = data.numUsers;
  document.getElementById("dashUsers").innerHTML = plateia;
});

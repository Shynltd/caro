const { text } = require("express");
var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);
app.get("/playonlinegomoku",function(req,res){
    res.render("gomokuOnline",{page:"gomokuOnline"});
});
app.get("/xiangqi",function(req,res){
    res.render("xiangqi",{page:"xiangqi"});
});
app.get("/listtablegomokuonline",function(req,res){
    res.render("listTableGomokuOnline",{page:"listTableGomokuOnline"});
});
app.get("/",function(req,res){
    res.render("gomoku",{page:"gomoku2Player"});
});
//io
let listPlayer = [];
let listPlayerName = [];
let player1Ready = false,player2Ready = false;
//
let roomNum = 12;
let x = 20,y=25;
let arrRoom = new Array(roomNum);
for(let i=0;i<roomNum;i++){
    arrRoom[i] = new Array(3);
    arrRoom[i][0] = new Array();
    arrRoom[i][1] = new Array();
    createDataChess(i);
}
//
let numStatusPlayer = 2;
let arrStatusPlayer = [];
arrStatusPlayer = new Array(roomNum);
for(let i=0;i<roomNum;i++){
    arrStatusPlayer[i] = new Array(numStatusPlayer);
    arrStatusPlayer[i][0] = false;
    arrStatusPlayer[i][1] = false;
}
io.on("connection",function(socket){
    //socket call
    listPlayer.push(socket.id);listPlayerName.push("");
    console.log("co nguoi ket noi!!"+socket.id);
    //socket.emit("client-get-player",{gameFinish:gameFinish,listPlayer:listPlayer});
    //socket.broadcast.emit("clients-get-new-player",{listPlayer:listPlayer});
    //
    //socket listen
    socket.on("client-send-data",function(data){
        console.log(data);
    });
    socket.on("client-send-locateXO",function(data){
        updateDataGame(data.idRoomNumber,data.xflag,data.x,data.y);
        io.to(data.idRoomNumber+"").emit("server-send-data-for-all",data);
    });
    socket.on("client-send-username",function(data){
        let status = checkUsername(data.username,socket.id);
        if(status==true){
            socket.emit("server-send-signin-status",{status:status,username:data.username});
        }else{
            socket.emit("server-send-signin-status",{status:status});
        }
    });
    socket.on("client-request-datagame",function(data){
        socket.emit("client-get-datagame",{arrChess:arrRoom[data.idRoomNumber][2]});
    });
    socket.on("client-want-leave-room",function(){
        let idRoomNumber  = delPlayer(socket.id);
        socket.leave(idRoomNumber+"");
        if(idRoomNumber != -1){
            io.to(idRoomNumber+"").emit("clients-get-delete-player",{
                listPlayer:arrRoom[idRoomNumber][0],
                listPlayerName:arrRoom[idRoomNumber][1]});
            //
            io.sockets.emit("clients-update-list-room",{arrRoom:arrRoom});//update number Player per rooms
        }
        socket.emit("server-send-leave-room-success");
    });
    socket.on("client-send-mess",function(data){
        ordPlayer = orderPlayer(socket.id,data.idRoomNumber);
        io.to(data.idRoomNumber+"").emit("clients-get-mess",{
            username:arrRoom[data.idRoomNumber][1][ordPlayer],
            text:data.text});
    });
    socket.on("disconnect",function(){
        //
        idRoomNumber = delPlayer(socket.id);
        if(idRoomNumber != -1){
            io.to(idRoomNumber+"").emit("clients-get-delete-player",{
                listPlayer:arrRoom[idRoomNumber][0],
                listPlayerName:arrRoom[idRoomNumber][1]});
            //
            io.sockets.emit("clients-update-list-room",{arrRoom:arrRoom});//update number Player per rooms
        }
        console.log("co nguoi thoat!!"+socket.id);
    });
    socket.on("client-send-ready-play",function(data){
        //
        if(isPlaying(data.idRoomNumber,socket.id,data.ready)==true){
            reloadDataGame(data.idRoomNumber);
            io.to(data.idRoomNumber+"").emit("clients-can-play",{playing:true});
        }
        console.log("Nguoi choi da san sang!!"+socket.id);
    });
    socket.on("client-request-reload-game",function(data){
        //
        reloadDataGame(data.idRoomNumber);
        io.to(data.idRoomNumber+"").emit("server-send-reload-game-success",{arrChess:arrRoom[data.idRoomNumber][2]});
    });
    socket.on("client-join-room",function(data){
        //
        if(data.idRoomNumber!=-1){
            socket.join(data.idRoomNumber+"");
            arrRoom[data.idRoomNumber][0].push(socket.id);
            arrRoom[data.idRoomNumber][1].push(data.username);
            io.to(data.idRoomNumber+"").emit("clients-get-new-player",{
            idPlayer:socket.id,
            listPlayer:arrRoom[data.idRoomNumber][0],
            listPlayerName:arrRoom[data.idRoomNumber][1]});
        }
        //
        io.sockets.emit("clients-update-list-room",{arrRoom:arrRoom});//update number Player per rooms
    });
    socket.on("client-send-winner",function(data){
        //
        if(arrRoom[data.idRoomNumber][0].length>=2){
            //player1Ready = false;player2Ready = false;
            arrStatusPlayer[data.idRoomNumber][0] = false;
            arrStatusPlayer[data.idRoomNumber][0] = false;
            if(arrRoom[data.idRoomNumber][0][0]==socket.id){
                io.to(data.idRoomNumber+"").emit("server-send-player-go-first",{idPlayer:arrRoom[data.idRoomNumber][0][1]});
            }else{
                io.to(data.idRoomNumber+"").emit("server-send-player-go-first",{idPlayer:arrRoom[data.idRoomNumber][0][0]});
            }
        }
    });
});
function delPlayer(idPlayer){
    let vt = -1;
    for(let i=0;i<listPlayer.length;i++){
        if(listPlayer[i]==idPlayer){
            vt = i;break;
        }
    }
    if(vt>=0){
        listPlayer.splice(vt,1);
        listPlayerName.splice(vt,1);
    }
    let vtP = -1;vt = -1;
    for(let i=0;i<arrRoom.length;i++){
        for(let j=0;j<arrRoom[i][0].length;j++){
            if(arrRoom[i][0][j]==idPlayer){
                vtP = i;vt = j;break;
            }
        }
    }
    if(vtP>=0 && vt>=0){
        arrRoom[vtP][0].splice(vt,1);
        arrRoom[vtP][1].splice(vt,1);
    }
    return vtP;
}
function isPlaying(vtP,idPlayer,ready){
    let vt = -1;
    if(vtP!=-1){
        for(let i=0;i<arrRoom[vtP][0].length;i++){
            if(arrRoom[vtP][0][i]==idPlayer){
                vt = i;break;
            }
        }
        if(vt==0){
            if(ready==true){
                //player1Ready = true;
                arrStatusPlayer[vtP][0] = true;
            }else{
                //player1Ready = false;
                arrStatusPlayer[vtP][0] = false;
            }
        }else if(vt==1){
            if(ready==true){
                //player2Ready = true;
                arrStatusPlayer[vtP][1] = true;
            }else{
                //player2Ready = false;
                arrStatusPlayer[vtP][1] = false;
            }
        }else{
            vt = -1;
        }
    }
    if(arrStatusPlayer[vtP][0] == true &&
        arrStatusPlayer[vtP][1] == true && vt != -1){
        return true;
    }else{
        return false;
    }
}
function updateDataGame(vtP,xflag,x,y){
    if(vtP != -1){
        if(xflag==true){
            arrRoom[vtP][2][x][y] = 1;
        }else{
            arrRoom[vtP][2][x][y] = 0;
        }
    }
}
function reloadDataGame(vtP){
    //player1Ready = false;player2Ready=false;
    arrStatusPlayer[vtP][0] = false;
    arrStatusPlayer[vtP][1] = false;
    //reset arr
    if(vtP != -1){
        arrRoom[vtP][2].slice(0,x);
        arrRoom[vtP][2] = new Array(x);
        for(let i=0;i<x;i++){
            arrRoom[vtP][2][i] = new Array(y); 
        }
    }
}
function orderPlayer(idPlayer,vtP){
    let vt=-1;
    if(vtP!=-1){
        for(let i=0;i<arrRoom[vtP][0].length;i++){
            if(idPlayer == arrRoom[vtP][0][i]){
                vt = i;break;
            }
        }
    }
    return vt;
}
function createDataChess(vtP){
    arrRoom[vtP][2] = new Array(x);
    for(let i=0;i<x;i++){
        arrRoom[vtP][2][i] = new Array(y); 
    }
}
function checkUsername(username,idPlayer){
    if(username.length > 0 && username.length <= 20 && addUsername(username,idPlayer)==true){
        return true;
    }else{
        return false;
    }
}
function addUsername(username,idPlayer){
    let vt = listPlayer.indexOf(idPlayer);
    let containName = listPlayerName.indexOf(username);
    if(vt>-1 && containName==-1){
        listPlayerName[vt] = username;
        return true;
    }else{
        return false;
    }
}
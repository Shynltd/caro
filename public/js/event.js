$("#btn-ready-gomoku").click(function(){
    restartGame();
});
///
$("#btn-ready-gomoku-online").click(function(){
    if(unableBtnPlay == false){
        if($("#btn-ready-gomoku-online").hasClass("unready")==true){
            $("#btn-ready-gomoku-online").addClass("ready").removeClass("unready");
            $("#btn-ready-gomoku-online").removeClass("btn-success").addClass("btn-warning");
            $("#btn-ready-gomoku-online").text("Hủy sẵn sàng");
            canPlayStatus();
            socket.emit("client-send-ready-play",{ready:true,idRoomNumber:idRoomNumber});
        }else{
            $("#btn-ready-gomoku-online").addClass("unready").removeClass("ready");
            $("#btn-ready-gomoku-online").removeClass("btn-warning").addClass("btn-success");
            $("#btn-ready-gomoku-online").text("Sẵn sàng");
            socket.emit("client-send-ready-play",{ready:false,idRoomNumber:idRoomNumber});
        }
    }
});
socket.on("server-send-data-for-all",function(data){
    stopWaiting();
    let i=data.x,j=data.y;
        if(isWatchOnly(socket.id)==false){
            if(data.xflag == true){
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/X-chess-color.png")');
                arrChess[i][j] = 1;
                if(xflag==true){
                    gameFinish = true;
                }else{
                    gameFinish = false;
                }
            }else{
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/O-chess-color.png")');
                arrChess[i][j] = 0;
                if(xflag==false){
                    gameFinish = true;
                }else{
                    gameFinish = false;
                }
            }
            if(gameFinish==true){
                $(".p-player-status").text("Lượt đối thủ..");
            }else{
                $(".p-player-status").text("Lượt của bạn..");
            }
            findPlayerWin();
        }else{//
            if(data.xflag == true){
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/X-chess-color.png")');
                arrChess[i][j] = 1;
            }else{
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/O-chess-color.png")');
                arrChess[i][j] = 0;
            }
            findPlayerWin();
        }
});
socket.on("clients-get-new-player",function(data){
    listPlayer = data.listPlayer;
    listPlayerName = data.listPlayerName;
    if(socket.id==data.idPlayer){
        reloadGame(socket.id);
        if(listPlayer.length>2){//nguoi xem lay du lieu
            socket.emit("client-request-datagame",{idRoomNumber:idRoomNumber});
        }
    }else{
        checkPlayer(socket.id);
    }
    showListPlayer(listPlayerName);
});
socket.on("clients-get-delete-player",function(data){
    listPlayer = data.listPlayer;
    listPlayerName = data.listPlayerName;
    if(listPlayer.length >= 2){
        let currentIdRoom = listPlayer[0]+listPlayer[1];
        if(idRoom != currentIdRoom){
            reloadGame(socket.id);
        }
    }else{
        socket.emit("client-request-reload-game",{idRoomNumber:idRoomNumber});
    }
    showListPlayer(listPlayerName);
});
socket.on("clients-can-play",function(data){
    idRoom = listPlayer[0]+listPlayer[1];
    if(watchOnly(socket.id)==false){
        restartGame();
        playingStatus();
    }else{
        restartGame();
    }
});
socket.on("server-send-leave-room-success",function(data){
    idRoomNumber = -1;
    leaveRoom();
});
socket.on("client-get-datagame",function(data){
    arrChess = data.arrChess;
    loadDataGame();
    stopWaiting();
});
socket.on("server-send-player-go-first",function(data){
    if(data.idPlayer == socket.id){
        xflag = true;
    }else{
        xflag = false;
    }
});
socket.on("server-send-reload-game-success",function(data){
    arrChess = data.arrChess;
    reloadGame(socket.id);

});
function checkPlayer(idPlayer){
    if(listPlayer.length==2){
        unableBtnPlay = false;
        canPlayStatus();
    }else if(listPlayer.length>2){
        if(orderPlayer(idPlayer)>1){
            watchOnlyStatus();
        }
    }
    else{
        unableBtnPlay = true;
        findPlayerStatus();
    }
}
function watchOnly(idPlayer){
    let vt=orderPlayer(idPlayer);
    if(vt>=0 && vt<=1){
        unableBtnPlay = false;
        return false;
    }else{
        gameStop = true;
        unableBtnPlay = true;
        setupStart();
        watchOnlyStatus();
        return true;
    }
}
function canPlayStatus(){
    unableBtnPlay = false;
    if($("#btn-ready-gomoku-online").hasClass("unready")==true){
        $(".p-player-status").text("Tìm thấy người chơi. Hãy sẵn sàng..");
    }else{
        $(".p-player-status").text("Đang chờ đối thủ sẵn sàng..");
    }
}
function playingStatus(){
    gameStop = false;
    unableBtnPlay = true;
    if(xflag == true){
            gameFinish = false;
            $(".p-player-status").text("Lượt của bạn..");
    }else{
        gameFinish = true;
        $(".p-player-status").text("Lượt đối thủ..");
    }
    //$(".p-player-status").text("Đang chơi..");
}
function findPlayerStatus(){
    unableBtnPlay = true;
    gameFinish = true;
    xflag = true;
    $("#btn-ready-gomoku-online").text("Sẵn sàng");
    $(".p-player-status").text("Đang tìm đối thủ..");
}
function watchOnlyStatus(){
    gameStop = true;
    $("#btn-ready-gomoku-online").text("Chỉ xem..");
    $("#btn-ready-gomoku-online").removeClass("btn-success").addClass("btn-warning");
    $(".p-player-status").text("");
}
function playerOneStatus(){
    xflag = true;
    gameFinish = true;
    $("#btn-ready-gomoku-online").addClass("unready").removeClass("ready");
    $("#btn-ready-gomoku-online").removeClass("btn-warning").addClass("btn-success");
    $("#btn-ready-gomoku-online").text("Sẵn sàng");
    $(".p-player-status").text("Tìm thấy người chơi. Hãy sẵn sàng..");
}
function playerTwoStatus(){
    xflag = false;
    gameFinish = true;
    $("#btn-ready-gomoku-online").addClass("unready").removeClass("ready");
    $("#btn-ready-gomoku-online").removeClass("btn-warning").addClass("btn-success");
    $("#btn-ready-gomoku-online").text("Sẵn sàng");
    $(".p-player-status").text("Tìm thấy người chơi. Hãy sẵn sàng..");
}
function showListPlayer(listPlayerName){
    $("#div-list-player").html("");
    listPlayerName.forEach(element => {
        $("#div-list-player").append('<div class="player">'+ element +'</div>');
    });
}
function loadDataGame(){
    idRoom = listPlayer[0]+listPlayer[1];
    for(let i=0;i<x;i++){
        for(let j=0;j<y;j++){
            if(arrChess[i][j]==0){
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/O-chess-color.png")');
            }else if(arrChess[i][j]==1){
                $("#pos-"+i+"-"+j).css('background-image', 'url("Images/X-chess-color.png")');
            }
        }
    }
    findPlayerWin();
}
function isWatchOnly(idPlayer){
    let vt=orderPlayer(idPlayer);
    if(vt>1||vt==-1){
        unableBtnPlay = true;
        return true;
    }else{
        return false;
    }
}
function orderPlayer(idPlayer){
    let vt=-1;
    for(let i=0;i<listPlayer.length;i++){
        if(idPlayer == listPlayer[i]){
            vt = i;break;
        }
    }
    return vt;
}
function reloadGame(idPlayer){
    restartGame();
    ordPlayer = orderPlayer(idPlayer);
    if(ordPlayer==0){
        playerOneStatus();
        unableBtnPlay = false;
    }else if(ordPlayer==1){
        playerTwoStatus();
        unableBtnPlay = false;
    }else{
        watchOnlyStatus();
    }
    checkPlayer();
}
function callAlert(nameNotice,text){
    $(function() {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      $(function(){
        Toast.fire({
          icon: nameNotice,
          title: text,
        })
      });
    });
  }
  function waiting(){
    $(".screen-container").css("opacity",0.8);
    $(".loader").show();
  }
  function stopWaiting(){
    $(".screen-container").css("opacity",1);
    $(".loader").hide();
  }
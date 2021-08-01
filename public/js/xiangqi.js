//xu ly ban co
const x = 10,y=9;
const DISTANCECHESS = 57;
const CHESSMOVETIME = 300;
let gameFinish = false;
let flagColor = "red";
let oldX=-1,oldY=-1;
let gameStop = true;
//
let arrChess = new Array(x);
for(let i=0;i<x;i++){
    arrChess[i] = new Array(y).fill("");
}
restartGame();
//
$("#btn-ready-xiangqi").click(function(){
    restartGame();
});
function setupChessmans(){
        arrChess[0][0] = "chariot-black-1.png";
        arrChess[0][1] = "hourse-black-1.png";
        arrChess[0][2] = "elephant-black-1.png";
        arrChess[0][3] = "advisior-black-1.png";
        arrChess[0][4] = "general-black-1.png";
        arrChess[0][5] = "advisior-black-1.png";
        arrChess[0][6] = "elephant-black-1.png";
        arrChess[0][7] = "hourse-black-1.png";
        arrChess[0][8] = "chariot-black-1.png";
        //
        arrChess[9][0] = "chariot-red-1.png";
        arrChess[9][1] = "hourse-red-1.png";
        arrChess[9][2] = "elephant-red-1.png";
        arrChess[9][3] = "advisior-red-1.png";
        arrChess[9][4] = "general-red-1.png";
        arrChess[9][5] = "advisior-red-1.png";
        arrChess[9][6] = "elephant-red-1.png";
        arrChess[9][7] = "hourse-red-1.png";
        arrChess[9][8] = "chariot-red-1.png";
        //
        arrChess[2][1] = "cannon-black-1.png";
        arrChess[2][7] = "cannon-black-1.png";
        //
        arrChess[7][1] = "cannon-red-1.png";
        arrChess[7][7] = "cannon-red-1.png";
        //
        arrChess[3][0] = "soldier-black-1.png";
        arrChess[3][2] = "soldier-black-1.png";
        arrChess[3][4] = "soldier-black-1.png";
        arrChess[3][6] = "soldier-black-1.png";
        arrChess[3][8] = "soldier-black-1.png";
        //
        arrChess[6][0] = "soldier-red-1.png";
        arrChess[6][2] = "soldier-red-1.png";
        arrChess[6][4] = "soldier-red-1.png";
        arrChess[6][6] = "soldier-red-1.png";
        arrChess[6][8] = "soldier-red-1.png";
}
function chessMove(newX,newY){
        $("#pos-"+oldX+"-"+oldY).hide();
        $("#pos-hide").css({
            "background-image": 'url("../Images/Xiangqi/'+ arrChess[oldX][oldY] +'")',
            "top": oldX*DISTANCECHESS+"px",
            "left": oldY*DISTANCECHESS+"px",
            "z-index": 2
        }).show().animate({
            top: newX*DISTANCECHESS,
            left: newY*DISTANCECHESS
          }, CHESSMOVETIME, function() {
            // Animation complete.
            isWin(newX,newY);
            switchPos(newX,newY);
            arrChess[newX][newY] = arrChess[oldX][oldY];
            arrChess[oldX][oldY] = "";
            $("#pos-"+oldX+"-"+oldY).show();
            $("#pos-hide").hide();
            oldX=-1;oldY=-1;
        });
}
function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
}
function switchPos(newX,newY){
        $( "#pos-"+oldX+"-"+oldY ).css({
            "background-image": 'none',
        });
        $( "#pos-"+newX+"-"+newY ).css({
            "background-image": 'url("../Images/Xiangqi/'+ arrChess[oldX][oldY] +'")',
        });
}
function checkMove(newX,newY){
        if(arrChess[oldX][oldY].indexOf("hourse")>=0){
            //hourse
            return hourseCanMove(newX,newY);
        }else if(arrChess[oldX][oldY].indexOf("elephant")>=0){
            //elephant
            return elephantCanMove(newX,newY);
        }else if(arrChess[oldX][oldY].indexOf("general")>=0){
            //general
            return generalCanMove(newX,newY);
        }else if(arrChess[oldX][oldY].indexOf("soldier")>=0){
            //soldier
            return soldierCanMove(newX,newY);
        }else if(arrChess[oldX][oldY].indexOf("chariot")>=0){
            //chariot
            return chariotCanMove(newX,newY);
        }else if(arrChess[oldX][oldY].indexOf("cannon")>=0){
            //cannon
            return cannonCanMove(newX,newY);
        }else if(arrChess[oldX][oldY].indexOf("advisior")>=0){
            //advisior
            return advisiorCanMove(newX,newY);
        }else {
            alert("unknown");
        }
        alert("chưa thể đi");
        return false;
}
function hourseCanMove(newX,newY){
    if((Math.abs(oldX-newX)==2 && Math.abs(oldY-newY)==1)){
        if(newX>oldX && arrChess[oldX+1][oldY] != ""){
            return false;
        }else if(newX<oldX && arrChess[oldX-1][oldY] != ""){
            return false;
        }
        return true;
    }else if(Math.abs(oldX-newX)==1 && Math.abs(oldY-newY)==2){
        if(newY>oldY && arrChess[oldX][oldY+1] != ""){
            return false;
        }else if(newY<oldY && arrChess[oldX][oldY-1] != ""){
            return false;
        }
        return true;
    }else{
        return false;
    }
}
function elephantCanMove(newX,newY){
    if(flagColor=="red" && newX < 5){//cant not out of kingdom
        return false;
    }else if(flagColor=="black" && newX >= 5){//cant not out of kingdom
        return false;
    }
    // check if
    if((Math.abs(oldX-newX)==2 && Math.abs(oldY-newY)==2)){
        if(newX>oldX){
            if(newY>oldY && arrChess[oldX+1][oldY+1]!=""){
                return false;
            }else if(newY<oldY && arrChess[oldX+1][oldY-1]!=""){
                return false;
            }else{
                return true;
            }
        }else{
            if(newY>oldY && arrChess[oldX-1][oldY+1]!=""){
                return false;
            }else if(newY<oldY && arrChess[oldX-1][oldY-1]!=""){
                return false;
            }else{
                return true;
            }
        }
    }else{
        return false;
    }
}
function cannonCanMove(newX,newY){
    if(oldX==newX){
        let Ymax = -1,Ymin = -1,pass=0;
        if(oldY>newY){
            Ymax = oldY;Ymin = newY;
        }else{
            Ymax = newY;Ymin = oldY;
        }
        for(let i=Ymin+1;i<Ymax;i++){
            if(arrChess[oldX][i]!=""){
                pass++;
            }
        }
        if(arrChess[newX][newY]=="" && pass == 0){//go
            return true;
        }else if(pass == 1 && arrChess[newX][newY] != ""){//attack
            return true;
        }else{
            return false;
        }
    }else if(oldY==newY){
        let Xmax = -1,Xmin = -1,pass = 0;
        if(oldX>newX){
            Xmax = oldX;Xmin = newX;
        }else{
            Xmax = newX;Xmin = oldX;
        }
        for(let i=Xmin+1;i<Xmax;i++){
            if(arrChess[i][oldY]!=""){
                pass++;
            }
        }
        if(arrChess[newX][newY]=="" && pass == 0){//go
            return true;
        }else if(pass == 1 && arrChess[newX][newY] != ""){//attack
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}
function chariotCanMove(newX,newY){
    if(oldX==newX){
        let Ymax = -1,Ymin = -1;
        if(oldY>newY){
            Ymax = oldY;Ymin = newY;
        }else{
            Ymax = newY;Ymin = oldY;
        }
        for(let i=Ymin+1;i<Ymax;i++){
            if(arrChess[oldX][i]!=""){
                return false;
            }
        }
        return true;
    }else if(oldY==newY){
        let Xmax = -1,Xmin = -1;
        if(oldX>newX){
            Xmax = oldX;Xmin = newX;
        }else{
            Xmax = newX;Xmin = oldX;
        }
        for(let i=Xmin+1;i<Xmax;i++){
            if(arrChess[i][oldY]!=""){
                return false;
            }
        }
        return true;
    }else{
        return false;
    }
}
function advisiorCanMove(newX,newY){
    if(flagColor == "red"){
        if(newY>=3 && newY<=5 && newX >= 7){
            if(Math.abs(newY-oldY) == 1 && Math.abs(newX-oldX) == 1){
                return true;
            }else{
                return false;
            }
        }else{//out of range
            return false;
        }
    }else{
        if(newY>=3 && newY<=5 && newX <= 2){
            if(Math.abs(newY-oldY) == 1 && Math.abs(newX-oldX) == 1){
                return true;
            }else{
                return false;
            }
        }else{//out of range
            return false;
        }
    }
}
function soldierCanMove(newX,newY){
    if(flagColor=="red"){
        if(newX-oldX==1){
            return false;
        }
        if(oldX < 5){
            //out of kingdom
            if(oldX==newX && Math.abs(newY-oldY)==1){
                return true;
            }else if(oldY==newY && Math.abs(newX-oldX)==1){
                return true;
            }else{
                return false;
            }
        }else{
            //in of kingdom
            if(oldY==newY && newX-oldX==-1){
                return true;
            }else{
                return false;
            }
            
        }
        return false;
    }else{
        if(oldX-newX==1){
            return false;
        }
        if(oldX >= 5){
            //out of kingdom
            if(oldX==newX && Math.abs(newY-oldY)==1){
                return true;
            }else if(oldY==newY && Math.abs(newX-oldX)==1){
                return true;
            }else{
                return false;
            }
        }else{
            //in of kingdom
            if(oldY==newY && oldX-newX==-1){
                return true;
            }else{
                return false;
            }
        }
        return false;
    }
}
function generalCanMove(newX,newY){
    if(flagColor == "red"){
        if(arrChess[newX][newY] != "" && newY == oldY){//kill general
           for(let i=newX+1;i<oldX;i++){
               if(arrChess[i][newY] != ""){
                   return false;
               }
           }
           return true;
        }
        if(newY>=3 && newY<=5 && newX >= 7){
            if((Math.abs(newY-oldY) == 1 && newX==oldX)||
            (Math.abs(newX-oldX) == 1 && newY==oldY)){
                return true;
            }else{
                return false;
            }
        }else{//out of range
            return false;
        }
    }else{
        if(arrChess[newX][newY] != "" && newY == oldY){//kill general
            for(let i=oldX+1;i<newX;i++){
                if(arrChess[i][newY] != ""){
                    return false;
                }
            }
            return true;
        }
        if(newY>=3 && newY<=5 && newX <= 2){
            if((Math.abs(newY-oldY) == 1 && newX==oldX)||
            (Math.abs(newX-oldX) == 1 && newY==oldY)){
                return true;
            }else{
                return false;
            }
        }else{//out of range
            return false;
        }
    }
}
function isWin(newX,newY){
    if(arrChess[newX][newY].indexOf("general-red")>=0){
        gameStop = true;
        $("#p-player-status").text("Cờ đen thắng");
        $("#khung-ban-co-2").css('opacity', '0.6');
        return false;
    }else if(arrChess[newX][newY].indexOf("general-black")>=0){
        gameStop = true;
        $("#p-player-status").text("Cờ đỏ thắng");
        $("#khung-ban-co-2").css('opacity', '0.6');
        return true;
    }
    return false;
}
function restartGame(){
    gameStop = false;
    flagColor = "red";
    arrChess = new Array(x);
        for(let i=0;i<x;i++){
            arrChess[i] = new Array(y).fill("");
        }
    $("#khung-ban-co-2").css('opacity', '1');
    $("#p-player-status").text("");
        setupChessmans();
        $("#khung-ban-co-2").html("");
        jQuery('<div/>', {
            id: "pos-hide",
            "class": 'align-items-center pb-2 mb-3 khung-ban-co quan-co'
            }).hide().appendTo('#khung-ban-co-2');
        for(let i=0;i<x;i++){
            for(let j=0;j<y;j++){
                let posX = i * DISTANCECHESS;
                let posY = j * DISTANCECHESS;
                if(arrChess[i][j].length>0){
                    jQuery('<div/>', {
                        id: "pos-"+i+"-"+j,
                        "class": 'align-items-center pb-2 mb-3 khung-ban-co quan-co'
                    }).css({
                        "background-image": 'url("../Images/Xiangqi/'+ arrChess[i][j] +'")',
                        "top": posX+"px",
                        "left": posY+"px"
                    }).appendTo('#khung-ban-co-2');
                }else{
                    jQuery('<div/>', {
                        id: "pos-"+i+"-"+j,
                        "class": 'align-items-center pb-2 mb-3 khung-ban-co quan-co'
                    }).css({
                        "top": posX+"px",
                        "left": posY+"px"
                    }).appendTo('#khung-ban-co-2');
                }
                $("#pos-"+i+"-"+j).click(function() {
                    if(gameStop==true){
                        return;
                    }
                    if(arrChess[i][j]=="" || arrChess[i][j].indexOf(flagColor)<0){
                        //they move or attack
                        if(oldX!=-1){
                            if(checkMove(i,j)==true){
                                $("#pos-"+oldX+"-"+oldY).css({"border":"none"});
                                chessMove(i,j);
                                //turn order
                                if(flagColor == "black"){flagColor = "red";
                                }else{flagColor = "black";}
                            }
                        }
                    }else{//they select chessman
                        if(oldX!=i || oldY!=j){
                            $("#pos-"+i+"-"+j).css({"border":"1px solid grey"});
                            $("#pos-"+oldX+"-"+oldY).css({"border":"none"});
                        }
                        oldX = i;oldY = j;
                    }
                });
            }
        }
}

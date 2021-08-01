$(document).ready(function(){
    $(".loader").hide();
    $("#btn-send-mess").click(function(){
        let text = $("#input-mess").val();
        $("#input-mess").val("");
        waiting();
        if(checkMessSend(text)==true){
            socket.emit("client-send-mess",{idRoomNumber:idRoomNumber,text:text});
        }
    });
    $("#input-mess").bind("keyup",function (event) {
        if(event.keyCode === 13){
            event.preventDefault();
            $("#btn-send-mess").trigger('click');
        }
    });
    //event -socket
    socket.on("clients-get-mess",function(data){
        stopWaiting();
        updateMessBox(data.username,data.text);
    });
    function checkMessSend(text){
        if(text==""){
            stopWaiting();
            return false;
        }else{
            return true;
        }
    }
    function updateMessBox(username,text){
        $("#div-mess-player").append('<p class="text-mess"><strong>'+ username +'</strong>: ' + text + '</p>');
        $("#div-mess-player").scrollTop($("#div-mess-player").prop("scrollHeight"));
    }
});
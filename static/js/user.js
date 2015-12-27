$( document ).ready(function() {
    var name = "";
    $('#usernameInput').keypress(function (e) {
        if (e.which == 13) {
            login();
        }
    });

    $("#loginButton").click(function() {
        login();
    });
});

function login(){
    name = $("#usernameInput").val();
    if(name){
        $.ajax({
            method: "POST",
            url: "add_name",
            data: {name: name},
            success : function(text)
                {
                    if(jQuery.parseJSON(text).add_name){
                        showLobby();
                    } else {
                        alert("Gebruikersnaam is al gekozen, kies een andere");
                    }
                }
        })
        .fail(function() {
            error();
          })
    }
}

function showLobby(){
    refreshLobby();
    var timerId2 = 0;
    timerId2 = setInterval(function(){
        console.log("Checking if game has started");
        $.ajax({
            url: "check_game_status",
            method: "POST",
            data: {name: name},
            success : function(text)
                {
                    var json = jQuery.parseJSON(text);
                    if(json.started){
                        console.log("started");
                        clearInterval(timerId1);
                        clearInterval(timerId2);
                        $("#content").html(json.category_html);
                        console.log(json.chooser);
                        if(name.toUpperCase() == json.chooser.toUpperCase()) {
                            console.log("you can choose");
                        }
                    }
                }
        })
        .fail(function() {
            error();
        })
    }, REFRESH);
}
$( document ).ready(function() {
    $("#loginButton").click(function() {
    var name = $("#usernameInput").val();
    if(name){
        $.ajax({
            method: "POST",
            url: "add_name",
            data: {name: name},
            success : function(text)
                {
                    if(jQuery.parseJSON(text).add_name){
                        showLobby(name);
                    } else {
                        alert("Gebruikersnaam is al gekozen, kies een andere");
                    }
                }
        })
        .fail(function() {
            error();
          })
    }
    });

    function showLobby(name){
        $("#content").text("Laden ...");
        var timerId1 = 0;
        var timerId2 = 0;
        $.ajax({
            url: "get_lobby_file",
            success : function(text)
                {
                    $("#content").html(jQuery.parseJSON(text).lobby);
                    $("#users").append("".concat("<li>",name,"</li>"));
                    timerId1 = setInterval(getNames(), 2000);
                    getNames();
                }
        })
        .fail(function() {
            error();
        })

        timerId2 = setInterval(function(){
            console.log("Checking if game has started");
            $.ajax({
                url: "check_game_status",
                success : function(text)
                    {
                        if(jQuery.parseJSON(text).started){
                            console.log("started");
                            clearInterval(timerId1);
                            clearInterval(timerId2);
                        }
                    }
            })
            .fail(function() {
                error();
            })
        }, 2000);
    }

    function getNames(){
        $.ajax({
            url: "names",
            success : function(text)
                {
                    console.log(jQuery.parseJSON(text).names)
                }
        })
        .fail(function() {
            error();
        })
    }

    function error() {
        alert( "Error, herlaad de pagina en probeer opnieuw" );
    }

});
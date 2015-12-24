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
    });

    function showLobby(){
        $("#content").text("Wachten op andere spelers");
        var timerId = setInterval(function(){
            console.log("Checking if game has started");
            $.ajax({
                method: "POST",
                url: "check_game_status",
                data: {name: name},
                success : function(text)
                    {
                        if(jQuery.parseJSON(text).started){
                            console.log("started");
                            clearInterval(timerId);
                        }
                    }
            })
            .fail(function() {
                error();
              })
        }, 2000);
    }

    function error() {
        alert( "Error, herlaad de pagina en probeer opnieuw" );
    }

});
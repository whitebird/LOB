var REFRESH = 2000;

function refreshLobby(){
    $("#content").text("Laden ...");
    var timerId = 0;
    $.ajax({
        url: "get_lobby_file",
        success : function(text)
            {
                $("#content").html(jQuery.parseJSON(text).lobby_html);
                setLobbyNames();
                timerId = setInterval(setLobbyNames, REFRESH);
            }
    })
    .fail(function() {
        error();
    })
}

function setLobbyNames(){
    $.ajax({
        url: "names",
        success : function(text)
            {
                $("#users").html("");
                jQuery.parseJSON(text).names.forEach(function(entry) {
                    $("#users").append("".concat("<li>",entry,"</li>"));
                });
            }
    })
    .fail(function() {
        error();
    })
}

function error() {
    console.error( "Error, herlaad de pagina en probeer opnieuw" );
}
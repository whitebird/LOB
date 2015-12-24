$( document ).ready(function() {
    $("#loginButton").click(function() {
    var name = $("#usernameInput").val();
    if(name){
        $.ajax({
            method: "POST",
            url: "test",
            data: {name: name},
            success : function(text)
                {
                     var add_name = jQuery.parseJSON(text).add_name;
                    console.log(obj);
                }
        })
        .fail(function() {
            alert( "Error, reload page and try again" );
          })
    }
    });
});
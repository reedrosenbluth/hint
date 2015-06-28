function stop_speak()
{
    $("#bars").children().addClass("bar_no_a");
}

function start_speak()
{
    $("#bars").children().removeClass("bar_no_a");
}

function addHint(title, body, image, link)
{
    if (image === null){
        var template = $('#template_no_image').html();
        image = "nothing";
    }
    else {
        var template = $('#template').html();
    }

    if (typeof link === "undefined")
    {
        link = "#";
    }
    //console.log(template);
    Mustache.parse(template);   // optional, speeds up future uses
    var rendered = Mustache.render(template, {title: title, body: body, image: image, link:link});
    //console.log(rendered);
    $('#hints').prepend(rendered);
    $('#hint').animate({
        top:"+=200",
        opacity:"toggle"
    },1000);
}

socket.on('new_hint', function (data) {
    addHint(data.title, data.summary, data.image);
    console.log(data);
})

$( document ).ready(function() {
    console.log( "ready!" );

    // addHint("Python","Python is a programming language.");
    // addHint("Mark Zuckerberg", "Mark Zuckerberg invented facebook. This is a lot more text about him.", "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Mark_Zuckerberg_at_the_37th_G8_Summit_in_Deauville_018_v1.jpg/220px-Mark_Zuckerberg_at_the_37th_G8_Summit_in_Deauville_018_v1.jpg");
    $(".panel-footer").on("mouseover", function(){
        $(this).find("a").css("color","#292929");
    });

    $(".panel-footer").on("mouseout", function(){
        $(this).find("a").css("color","#666");
    });

    $(".panel-footer").on("click", function(){
        window.location.href = $(this).find("a").attr("href");
    })
});

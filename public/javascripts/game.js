//stop watch functions
function records(){
    document.getElementById('form').style.visibility = "visible";
}

var curtime = 0;
var timeunit = 100; //time unit - decimaly by 2
var timer = null;
var endtime;

function reset_timer(){
    notimer();
    curtime = 0;
    timer = setInterval('increasingsec()', (1000/timeunit));
    // event.preventdefault();
}

function increasingsec(){
    curtime+=1;
    document.getElementById('timer').innerHTML = (curtime / timeunit);
}

function notimer(){
    clearInterval(timer);
}

$(document).ready(function(){
    animateDiv();
    var url = "time";
    $.getJSON(url, function(data) {
        console.log(data);
        data.sort(function(a, b) {
            return parseFloat(a.Time) - parseFloat(b.Time);
        });
        var everything = "<ol>";
        for(var record in data) {
            var com = data[record];
            console.log(com);
            everything += "<li>" + com.Name + ": " + com.Time + "</li>";
        }
        everything += "</ol>";
        
        $("#times").html(everything);
        
        // var all = "<ol>"
        // for(var record in data) {
        //     var com = data[record];
        //     all += "<li>" + com.Name + ": " + com.Time + "</li>";
        // }
        // all += "</ol>";
        // $("#alltime").html(all);
    });
    
});

//gamefunctions

var velocity = 0.6;
var gamemode = false;
var padnum = 50;
var initialFace = "url('https://cdn4.iconfinder.com/data/icons/reaction/32/happy-512.png')";
var missedFace = "url('https://cdn4.iconfinder.com/data/icons/reaction/32/wink-512.png')";
var deadFace = "url('https://cdn4.iconfinder.com/data/icons/reaction/32/dead-512.png')"
var laughing = new Audio("http://www.eletech.com/Products/Kiddie_Ride_Boards/HAHAHA.WAV");
var facecliked = false;


$('#startGame').click(function(){
    // animateDiv();
    // $('#face').animate('resume');
    gamemode = true;
    facecliked = false;
    reset_timer();
    $('#face').css('background-image', initialFace);
    document.getElementById('startgameBox').style.visibility = "hidden";
});

$('#restartgame').click(function(){
    gamemode = true;
    facecliked = false;
    reset_timer();
    $('#face').css('background-image', initialFace);
//   document.getElementById('timeboard').style.visibility = "hidden";
});


function missed(){
    if (gamemode == true && facecliked == false){
        laughing.pause();
        laughing.currentTime = 0;
        laughing.play();
        $('#face').css('background-image', missedFace);
        setTimeout('back2original()', 500);
    }
}

function back2original(){
    $('#face').css('background-image', initialFace);
}

//when it is caught
function gotit(){
    facecliked = true;
    // velocity = 0.0000;
    if(gamemode == true){
        $('#face').css('background-image', deadFace);
        laughing.pause();
        laughing.currentTime = 0;
        notimer();
        // clearTimeout(failedpic);
        endtime = curtime/timeunit;
        console.log(endtime);
        // $('#face').animate('pause');
        gamemode = false;
        document.getElementById('submitform').style.visibility = "visible";
    }
}


$('#submit').click(function(){
    var curname;
    if ($("#name").val() == ""){
        curname = "unknown"
    }
    else{
        curname = $("#name").val();
    }
    var myquery = {Name:curname,Time:endtime};
    var jobj = JSON.stringify(myquery);
    var url = "time";
    $.ajax({
        url:url,
        type: "POST",
        data: jobj,
        contentType: "application/json; charset=utf-8"
    });
    
    //after finishing the post get the datasets
    $.getJSON(url, function(data) {
        console.log(data);
        data.sort(function(a, b) {
            return parseFloat(a.Time) - parseFloat(b.Time);
        });
        var everything = "<ol>";
        for(var comment in data) {
            var com = data[comment];
            everything += "<li>" + com.Name + ": " + com.Time + "</li>";
        }
        everything += "</ol>";
        $("#times").html(everything);
        
        // var all = "<ol>"
        // for(var comment in data) {
        //     var com = data[comment];
        //     all += "<li>" + com.Name + ": " + com.Time + "</li>";
        // }
        // all += "</ol>";
        // $("#alltime").html(all);
        
    });
    document.getElementById('submitform').style.visibility = "hidden";
    document.getElementById('startgameBox').style.visibility = "visible";
});


//animation&sound functions
function makeNewPosition(){
    
    var h = $("#game").height() - padnum;
    var w = $("#game").width() - padnum;
    
    var nh = Math.floor(Math.random() * (h-padnum));// + top;
    var nw = Math.floor(Math.random() * (w-padnum));// + left;
    
    return [nh,nw];    
    
}

function animateDiv(){
    var newq = makeNewPosition();
    var oldq = $('#face').offset();
    var speed = calcSpeed([oldq.top, oldq.left], newq);
    
    $('#face').animate({ top: newq[0], left: newq[1] }, speed, function(){
      animateDiv();        
    });
};

function calcSpeed(prev, next) {
    
    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);
    
    var greatest = x > y ? x : y;
    var speedModifier = velocity;
    var speed = Math.ceil(greatest/speedModifier);
    return speed;

}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

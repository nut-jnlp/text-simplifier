var flag_speech = false;
function vr_function(){
  var recognition = new webkitSpeechRecognition();
  recognition.lang = "ja";
  recognition.continuous = true;

  recognition.onsoundstart = function() {
    // $("#rec_text").text("認識中...");
  }
  recognition.onnomatch = function() {
    // $("#rec_text").text("もう一度試して下さい");
  }
  recognition.onerror = function(){
    // $("#rec_text").text("エラー");
    if(flag_speech == false){
      vr_function();
    }
  }
  recognition.onsoundend = function(){
    // $("#rec_text").text("停止中");
    vr_function();
  }

  recognition.onresult = function(event) {
    var results = event.results;
    for(var i = event.resultIndex; i < results.length; i++){
      var recognized_text = results[i][0].transcript;
      $.ajax("/text-simplifier/translate",
      {
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({input_text: recognized_text}),
        dataType: 'json'
      }).done(function(data){
        var simplified_text = data["normal"];
        var prepend_html = "<tr><td>" + recognized_text + "</td><td>" + simplified_text + "</td></tr>";
        $(prepend_html).hide().prependTo("#talk_log tbody").fadeIn("slow");
        index++;
        var msg = new SpeechSynthesisUtterance(simplified_text);
        msg.lang = 'ja-JP';
        window.speechSynthesis.speak(msg);
        // $("#rec_text").text("通訳を開始する");
        vr_function();
      });

    }
  }
  flag_speech = false;
  recognition.start();
}

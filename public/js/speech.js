if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

var socket = io('http://' + location.host);

$(document).ready(function () {
  if ('webkitSpeechRecognition' in window) {
    var recognition = new webkitSpeechRecognition();
    var final_transcript = '';
    recognition.continuous = true;
    recognition.interimResults = true;
    var interim_result = '';

    recognition.onresult = function (event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {

          var confidence = event.results[i][0].confidence;
          if ((confidence > 0.85) && i === (event.results.length - 1) && !event.results[i].isFinal) {

            new_result = event.results[i][0].transcript;

            if (new_result.startsWith(interim_result)) {
              new_result = new_result.substring(interim_result.length);
              interim_result += new_result;

              if (new_result !== '') {
                new_result = $.trim(new_result);
                socket.emit('new_result', { data: new_result });
              }

              //console.log(new_result);
            } else {
              interim_result = new_result;

              if (new_result !== '') {
                new_result = $.trim(new_result);
                socket.emit('new_result', { data: new_result });
              }

              //console.log(new_result)
            }
          }

        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
          interim_result = '';
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }

      $('#interim_span').html(interim_transcript);
      $('#final_span').html(final_transcript);
    };

    recognition.start();

  }
});

$(document).ready(function () {
  if ('webkitSpeechRecognition' in window) {
    var recognition = new webkitSpeechRecognition();
    var final_transcript = '';
    recognition.continuous = true;
    recognition.interimResults = true;
    //var interim_transcript = '';

    recognition.onresult = function (event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        console.log(event.results);
        if (i === event.results.length - 1) {
          console.log(event.results[i][0].transcript);
          console.log(event.results[i][0].confidence);
        }
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
        } else {
          interim_transcript += event.results[i][0].transcript;
        }
      }

      $('#interim_span').html(interim_transcript);
      $('#final_span').html(final_transcript);
    };

    document.querySelector('button').addEventListener('click', function () {
      recognition.start();
    });
  }
});
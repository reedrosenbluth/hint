$(document).ready(function () {
  if ('webkitSpeechRecognition' in window) {
    var recognition = new webkitSpeechRecognition();
    var final_transcript = '';
    recognition.continuous = true;
    recognition.interimResults = true;
    var interim_transcript_final = '';

    recognition.onresult = function (event) {
      var interim_transcript = '';
      for (var i = event.resultIndex; i < event.results.length; ++i) {
        // console.log(event.results);

          var confidence = event.results[i][0].confidence;
          if ((confidence > 0.85) && i === (event.results.length - 1)) {
            
            new_transcript = event.results[i][0].transcript;

            if (new_transcript.startsWith(interim_transcript_final)) {
              interim_transcript_final = new_transcript.substring(interim_transcript_final.length);
            } else {
              interim_transcript_final = new_transcript;
            }

            console.log(interim_transcript_final);
          }
          
        if (event.results[i].isFinal) {
          final_transcript += event.results[i][0].transcript;
          interim_transcript_final = '';
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
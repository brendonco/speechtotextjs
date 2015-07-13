//custom event for broadcasting and listener
var ev = document.createEvent("Event");

function onListen(name, callback){
  document.addEventListener(name, callback, false);
}

function onBroadcast(name, args){
  ev.initEvent(name, true, true);

  if(args){
    ev.args = args;
  }

  document.dispatchEvent(ev);
}

SpeechToText = function(options){
    this.ignore_onend = false;
    this.recognition = null;
    this.final_transcript = '';
    this.recognizing = false;

    var self = this;

    this.setFinalTranscript = function(s){
      this.final_transcript = s;
    }

    this.getFinalTranscript = function(){
      return this.final_transcript;
    }

    // if(options === undefined || !options){
    //     options = {
    //         continous: true,
    //         interimResults : true
    //     };
    // }

    // if (typeof webkitSpeechRecognition === 'undefined') {
    if (!('webkitSpeechRecognition' in window)) {
        this.upgrade();
    }else{
        this.recognition = new webkitSpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.onstart = function(){
          self.recognizing = true;
        };//this.onstart;
        this.recognition.onresult = this.onresult;
        this.recognition.onerror = function(event){
          onBroadcast('onSpeechError', event);
          if (event.error == 'no-speech') {
            self.ignore_onend = true;
          }
          if (event.error == 'audio-capture') {
            self.ignore_onend = true;
          }
          if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
              //console.log('info_blocked');
            } else {
              //console.log('info_denied');
            }
            self.ignore_onend = true;
          }
        };
        this.recognition.onend = function(){
            self.recognizing = false;

            if(self.ignore_onend) {
                return;
            }

            onBroadcast('onSpeechEnd');
        };//this.onend;
    }
}

SpeechToText.prototype.onListen = onListen;
SpeechToText.prototype.onBroadcast = onBroadcast;

SpeechToText.prototype.upgrade = function(){
    this.onBroadcast('errBrowserNotSupported');
}

SpeechToText.prototype.onstart = function(){
    this.recognizing = true;
}

SpeechToText.prototype.speak = function(){
    if(this.recognizing){
      this.recognition.stop();
      return;
    }

    if(this.recognition == null || this.recognition === 'undefined'){
      this.onBroadcast('errBrowserNotSupported');
    }else{
      this.recognition.start();
    }
}

SpeechToText.prototype.stop = function(){
  if(this.recognition){
    this.recognition.stop();
  }
}

SpeechToText.prototype.onresult = function(event){
    var interim_transcript = '';

    if (typeof(event.results) == 'undefined') {
      this.recognition.onend = null;
      this.recognition.stop();
      this.upgrade();
      return;
    }
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        this.final_transcript += event.results[i][0].transcript;

        onBroadcast('finalResult', this.final_transcript);
      } else {
        interim_transcript += event.results[i][0].transcript;

        onBroadcast('interimResult', interim_transcript);
      }
    }
    // final_transcript = capitalize(final_transcript);
    // final_span.innerHTML = linebreak(final_transcript);
    // interim_span.innerHTML = linebreak(interim_transcript);
    // if (this.final_transcript || interim_transcript) {
    //   console.log('inline-block');
    // }
}

SpeechToText.prototype.onend = function(e){
  //if(!this.final_transcript){
  this.recognizing = false;

  if(this.ignore_onend) {
      return;
  }

  onBroadcast('onSpeechEnd');
}

SpeechToText.prototype.onerror = function(){
    
}

if(window) {
  window["SpeechToText"] = SpeechToText;
}

if(typeof module !== 'undefined'){
  module.exports = SpeechToText;
}

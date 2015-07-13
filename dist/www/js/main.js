(function(){
    "use strict";

    require(['./js/speechtotext', './lib/knockout-latest.debug'], function(s, ko){

        function AppViewModel() {
            var speech;
            var self = this;

            self.result = ko.observable("");
            self.speechSupported = ko.observable(false);

            self.micImg = ko.observable("mic.gif");

            speech = new SpeechToText();

            speech.onListen("errBrowserNotSupported", upgradeBrowser);
            speech.onListen("finalResult", onResult);
            speech.onListen("interimResult", onInterimResult);
            speech.onListen("onSpeechEnd", onSpeechEnd);
            speech.onListen("onSpeechError", onError);

            if(typeof speech.recognition === 'undefined'){
                upgradeBrowser();
            }

            this.startSpeak = function(){
                // console.log("start speaking..");

                self.result("start speaking");

                if(self.micImg() === "mic.gif"){
                    self.micImg("mic-animate.gif");
                }else{
                    self.micImg("mic.gif");
                    self.stopSpeak();
                }

                //Object.create(SpeechToText.prototype);

                // this.info = ko.observable();

                // if(typeof speech.recognition === 'undefined'){
                //     this.info = ko.observable("<b>Browser not supported.</b>");
                // }
                speech.speak();
            };

            this.stopSpeak = function(){
                if(speech){
                    speech.stop();
                }
            }

            function upgradeBrowser(e){
                self.speechSupported(false);
                self.result("Browser not supported, please upgrade or download Chrome/Firefox.");
            }

            function onResult(e){
                self.result(e);
            }

            function onInterimResult(e){
                self.result(e.args);
            }

            function onSpeechEnd(e){
                self.result(""); //clear if speech is ended
            }

            function onError(e){
                 if (event.error == 'no-speech') {
                    //self.ignore_onend = true;
                  }
                  if (event.error == 'audio-capture') {
                    //self.ignore_onend = true;
                  }
                  if (event.error == 'not-allowed') {
                    if (event.timeStamp - start_timestamp < 100) {
                      //console.log('info_blocked');
                    } else {
                      //console.log('info_denied');
                    }
                    //self.ignore_onend = true;
                  }
            }
        }

        // Activates knockout.js
        ko.applyBindings(new AppViewModel()); 
    });
})();
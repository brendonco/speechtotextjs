var should = require('chai').should(),
    SpeectToText = require('SpeectToText'),
    upgrade = SpeectToText.upgrade,
    EventEmitter = require('events').EventEmitter;


describe('~~~upgrade', function(){
    it('Browser not supported', function(){
        var speech = SpeectToText();
        speech.on('error', function(msg){
            msg.should.equal('Browser not supported, please upgrade or download Chrome/Firefox.');
        });
    });
});
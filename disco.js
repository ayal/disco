var context = new AudioContext();
var vco = context.createOscillator();


var Voice = (function(context) {
	function Voice(frequency){
	    this.frequency = frequency;
	    this.vco = context.createOscillator();
	    this.vca = context.createGain();

	};

	Voice.prototype.stop = function() {
	    if (this.vco) {
		try {
		    var that = this;
		    this.vca.gain.value = 0;
		    setTimeout(function(){
			    that.vco && that.vco.stop();
			    that.vco = null;
			},100);
		}
		catch(e) {
		}
	    }
	}

	Voice.prototype.startx = function(t,dec) {
	    this.vco.type = vco.SINE;
	    this.vco.frequency.value = this.frequency;
	    this.vca.gain.value = 0.5;
	    this.vco.connect(this.vca);
	    this.vca.connect(context.destination);	    
	    this.vco.start(t);
	    this.vca.gain.setValueAtTime(0, dec + t);
	    var that = this;
	    setTimeout(function(){
		    that.vco.stop();
		    that.vco = null;
		},1000 + t * 1000);
	};

	return Voice;
    })(context);


makesound = function(buffer) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    var gainNode = context.createGain();
    gainNode.gain.value = 0.5; // reduce volume by 1/4
    source.playbackRate.value = rnd(1,50) / 10 ;
    source.connect(gainNode);
    gainNode.connect(context.destination);

    return source;
};

var rnd = function(a,b) {
    return Math.floor(Math.random() * b) + a;
}

function finishedLoading(bufferList) {
    var startTime = context.currentTime + 0.100;
    var tempo = 160; // BPM (beats per minute)
    var bps = 60 / tempo;
    var eighthNoteTime = (60 / tempo) / 2;

    for (var h = 0; h < 3; h++) {
	for (var j = 0; j < 8; ++j) {
	    for (var i = 0; i < 16; ++i) {
		var f;
		var time = startTime + (h * 8 * 16 + j * 16 + i) * bps * 0.25;

		var v = new Voice(150 + i * 50);
		h > 0 && h < 2 && v.startx(time,  0.05);

		if (i === 0 || i === 2 || i === 10) {
		    makesound(bufferList[1]).start(time);
		    var timex = startTime + (h * 8 * 16 + j * 16 + i + 0.25) * bps * 0.75;
		    makesound(bufferList[3]).start(timex);
		}

		if (i === 4 || i === 12 || i === 7 || i === 9) {
		    makesound(bufferList[0]).start(time);
		}

		if ([0,2,4,6,7,8,9,10,12,14].indexOf(i) !== -1) {
		    makesound(bufferList[2]).start(time);
		}

	    }
	}  
    }
}


bufferLoader = new BufferLoader(
    context,
    [
      'sounds/snare.wav',
      'sounds/kick.wav',
      'sounds/hihat.wav',
      'sounds/Clap.wav',
    ],
    finishedLoading
    );

bufferLoader.load();

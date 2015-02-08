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
	    this.vca.gain.value = 1;
	    this.vco.connect(this.vca);
	    this.vca.connect(context.destination);	    
	    this.vco.start(t);
	    this.vca.gain.setValueAtTime(0, dec + t);
	};


	Voice.prototype.start = function() {
	    var rgbav = 'rgba(' + this.frequency / 2.5 + ',0,' + this.frequency / 2.5 + ',' + 1 + ')';
	    $('body').css('background-color', rgbav)

	    /* VCO */
	    this.vco.type = vco.SINE;
	    this.vco.frequency.value = this.frequency;

	    this.vca.gain.value = 1;

	    /* connections */
	    this.vco.connect(this.vca);
	    this.vca.connect(context.destination);
	    
	    try {
		this.vco.start(0);
	    }
	    catch (ex) {
	    }
	};

	return Voice;
    })(context);


makesound = function(buffer) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    return source;
};

var rnd = function(a,b) {
    return Math.floor(Math.random() * b) + a;
}

function finishedLoading(bufferList) {
    var startTime = context.currentTime + 0.100;
    var tempo = 140; // BPM (beats per minute)
    var bps = 60 / tempo;
    var eighthNoteTime = (60 / tempo) / 2;

    for (var h = 0; h < 4; h++) {
	for (var j = 0; j < 8; ++j) {
	    for (var i = 0; i < 16; ++i) {
		var f;
		if (j < 4) { 
		    f = 150 + i * 50
			}
		else {
		    f = 150 + 15 * 50 - i * 50;
		}

		var v = new Voice(f);
		v.startx(startTime + (h * 8 * 16 + j * 16 + i) * bps * 0.25,  0.03);
		if (i === 0 || i === 6 || i === 7 ||  i === 12) {
		    makesound(bufferList[1]).start(startTime + (h * 8 * 16 + j * 16 + i) * bps * 0.25);
		}

		if (i === 0 || i === 7 || i === 9) {
		    makesound(bufferList[2]).start(startTime + (h * 8 * 16 + j * 16 + i) * bps * 0.25);
		}

		if (i === 4) {
		    makesound(bufferList[2]).start(startTime + (h * 8 * 16 + j * 16 + i) * bps * 0.25);
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
    ],
    finishedLoading
    );

bufferLoader.load();

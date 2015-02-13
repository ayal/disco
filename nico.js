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
    //source.playbackRate.value = rnd(1,50) / 10 ;
    source.connect(gainNode);
    gainNode.connect(context.destination);

    return source;
};

var rnd = function(a,b) {
    return Math.floor(Math.random() * b) + a;
}

function finishedLoading(bufferList) {
    var startTime = context.currentTime + 0.100;
    var tempo = 40; // BPM (beats per minute)
    var bps = 60 / tempo;
    var eighthNoteTime = (60 / tempo) / 2;

    for (var h = 0; h < 3; h++) {
    	for (var j = 0; j < 8; ++j) {
	    for (var i = 0; i < 8; ++i) {
	    	
		var time = function(x) {return startTime + (h * 8 * 8 + j * 8 + x) * bps *  0.25};

		var v = new Voice(150 + i * 50);
	         
		if (i === 0) {
		    makesound(bufferList[1]).start(time(i));
		    var v = new Voice(150 + i * 50);
		    v.startx(time(i + 0.25), 0.25);
		}
		
		if (i === 3) {
		    makesound(bufferList[1]).start(time(i + 0.5));
		    makesound(bufferList[1]).start(time(i + 2));
	        var v = new Voice(250 + i * 50);
		    v.startx(time(i + 0.5), 0.25);
		}

		if (i === 2 || i === 6) {
		    makesound(bufferList[3]).start(time(i));
		}

		

	    }
	}  
    }
}

setTimeout(function(){
		location.href='https://www.youtube.com/watch?v=VDxrIJXFjIU#t=3';
},37000)


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

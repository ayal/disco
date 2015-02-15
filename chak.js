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

	Voice.prototype.startx = function(t,dec,g) {
	    this.vco.type = vco.TRIANGLE;
	    this.vco.frequency.value = this.frequency;
	    this.vca.gain.value = 0.05;

	    var mod2 = context.createOscillator();
	    mod2.frequency.value = this.frequency * 2;
	    
	    var modGain2 = context.createGain();
	    modGain2.gain.value = 0.3;

	    mod2.connect(modGain2);


	    var mod1 = context.createOscillator();
	    mod1.frequency.value = this.frequency/2;
	    
	    var modGain1 = context.createGain();
	    modGain1.gain.value = 0.1;

	    mod1.connect(modGain1);

	    modGain2.connect(modGain1);
	    modGain1.connect(this.vca.gain);

	    this.vco.connect(this.vca);
	    this.vca.connect(context.destination);
	    
	    this.vco.start(t);
	    mod1.start(t);
	    mod2.start(t);
	    
	    this.vca.gain.setValueAtTime(0, dec + t);
	    var that = this;

	    setTimeout(function(){
		    that.vco.stop();
		    mod1.stop();
		    mod2.stop();
		    mod = null;
		    that.vco = null;
		},1000 + t * 1000);
	};

	return Voice;
    })(context);


makesound = function(buffer,x,g) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    var gainNode = context.createGain();
    gainNode.gain.value = g || 0.3; // reduce volume by 1/4
    x && (source.playbackRate.value = x);
    source.connect(gainNode);
    gainNode.connect(context.destination);

    return source;
};

var rnd = function(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

function finishedLoading(bufferList) {
    var startTime = context.currentTime + 0.100;
    var tempo = 55; // BPM (beats per minute)
    var bps = 60 / tempo;
    var eighthNoteTime = (60 / tempo) / 2;
    var voices = [146.83, 123.47, 196.00, 196.00, 123.47]
    for (var h = 0; h < 2; h++) {
    	for (var j = 0; j < 8; ++j) {
	    for (var i = 0; i < 8; ++i) {
	    	console.log('j',j,'h',h)
		var time = function(x) {return startTime + (h * 8 * 8 + j * 8 + x) * bps *  0.25};


		if ([0].indexOf(i) !== -1) {

		    var o = rnd(1,3);
		    var p = rnd(0,4);
		    var v = new Voice(voices[p] * o);
		    v.startx(time(i), 0.3);

		    var o = rnd(1,3);
		    var p = rnd(0,4);
		    var v = new Voice(voices[p] * o);
		    v.startx(time(i + 3), 0.3);

		    /*var v = new Voice(261.63);
		    v.startx(time(i+3), 0.7);

		    var v = new Voice(146.83);
		    v.startx(time(i+5), 0.7);

		    var v = new Voice(110.00);
		    v.startx(time(i+4), 0.7);*/
		    var p = rnd(0,4);
		    var o = rnd(1,3);
		    var v = new Voice(voices[p] * o);
		    v.startx(time(i+5), 0.3);
		}

		if ([0].indexOf(i) !== -1 && (j > 1  || h > 0 && j > 1 && j < 7)) {
		    makesound(bufferList[1]).start(time(i));
		}

		
		if ([0].indexOf(i) !== -1 && (j > 1 || h > 0 && j > 1  && j < 7)) {
		    makesound(bufferList[3]).start(time(i + 1.5));
		    makesound(bufferList[3]).start(time(i + 3 ));
		}

		if ([4].indexOf(i) !== -1 && (j > 1 || h > 0 && j > 1  && j < 7)) {
		    makesound(bufferList[1]).start(time(i ));
		    makesound(bufferList[1]).start(time(i + 1));
		}


		if ([6].indexOf(i) !== -1 && (j> 1  || h > 0 && j > 1  && j < 7)) {
		    makesound(bufferList[3]).start(time(i));
		}

		if ([0,2,4,6].indexOf(i) !== -1 && (h > 0 && j > 1  && j < 8)) {
		    var mrate = 1;
		    
		    var s = makesound(bufferList[4], mrate, 0.02);
		    s.start(time(i));
		    s.stop(time(i + 1));
		    
		    var s = makesound(bufferList[4], mrate-0.1, 0.02);
		    s.start(time(i+0.66));
		    s.stop(time(i + 1.75));


		}

		/*		if ([0,2,4].indexOf(i) !== -1 && (j > 4  || h > 0 && j > 0  && j < 7)) {
		    var mrate = 0.7 + rnd(5,10) / 10;

		    var s = makesound(bufferList[4], mrate, 0.1);
		    s.start(time(i));
		    s.stop(time(i + 1));

		    var s1 = makesound(bufferList[4],mrate - 0.3,0.1);
		    s1.start(time(i + 0.6));
		    s1.stop(time(i + 1.5));
		    
		    var s2 = makesound(bufferList[4],mrate,0.1);
		    s2.start(time(i + 1));
		    s2.stop(time(i + 2))

		    var s3 = makesound(bufferList[4],mrate - 0.3,0.1);
		    s3.start(time(i + 1.6));
		    s3.stop(time(i + 2.5))

		    }*/		

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
      'sounds/maraca.mp3',
    ],
    finishedLoading
    );

bufferLoader.load();

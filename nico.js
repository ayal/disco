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
	    var that = this;
	    setTimeout(function(){
		    that.vco.stop();
		    that.vco = null;
		},1000 + t * 1000);
	};

	return Voice;
    })(context);


makesound = function(buffer,x,g) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    var gainNode = context.createGain();
    gainNode.gain.value = g || 0.5; // reduce volume by 1/4
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
    var tempo = 40; // BPM (beats per minute)
    var bps = 60 / tempo;
    var eighthNoteTime = (60 / tempo) / 2;

    for (var h = 0; h < 2; h++) {
    	for (var j = 0; j < 8; ++j) {
	    for (var i = 0; i < 8; ++i) {
	    	
		var time = function(x) {return startTime + (h * 8 * 8 + j * 8 + x) * bps *  0.25};

		var v = new Voice(150 + i * 50);
	         
		if ([0].indexOf(i) !== -1  && j > 3) {
		    		    makesound(bufferList[1]).start(time(i));
		    var v = new Voice(100);
		    v.startx(time(i), 0.15);
		    
		    //var v = new Voice(650);
		    //v.startx(time(i + 2), 0.15);
		}
		
		if ([3].indexOf(i) !== -1  && j > 3) {
		    makesound(bufferList[1]).start(time(i + 0.5));
		    makesound(bufferList[1]).start(time(i + 2));
	            /*var v = new Voice(rnd(1,20) * 50);
		    v.startx(time(i + 0.5), 0.35);
		    var v = new Voice(rnd(1,20) * 50);
		    v.startx(time(i + 1.2), 0.65);*/
		}

		if ([2,6].indexOf(i) !== -1  && j > 3) {
		    makesound(bufferList[3]).start(time(i));
		}

		if ([0,2,4].indexOf(i) !== -1) {
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
      'sounds/maraca.mp3',
    ],
    finishedLoading
    );

bufferLoader.load();

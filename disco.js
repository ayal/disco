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


queue = [];
rhythm = [];


var playfreq = function(f,i,q) {
    var voice = new Voice(f);
    q.push({interval:i, voice: voice});
};

var playinst = function(inst,i,q) {
    q.push({interval:i, inst: inst});
};


var play = function (q) {
    lasttime = window.lasttime || new Date; 
    var playinterval = {};
    playinterval['handle'] = setInterval(function(){
	    if (q.length) {
		var interval = q[0].interval;
		var voice = q[0].voice || q[0].inst;
		

		if (new Date - lasttime >= interval - 50) {
		    window.lastvoice && lastvoice.stop();
		}

		if (new Date - lasttime >= interval) {
		    voice.start();

		    q = q.splice(1);
		    lasttime = new Date();
		    lastvoice = voice;
		}
	    }
	    else {
	    	window.clearInterval(playinterval['handle']);
		lastvoice.stop();
		location.href = 'https://www.youtube.com/watch?v=VDxrIJXFjIU#t=3'
	    }
	}, 10);
};

makesound = function(buffer) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    return source;
}

function finishedLoading(bufferList) {
  for (var h = 0; h <1; h++) {
      for (var j = 0; j < 5; j++) {
	  for (var i = 0; i < 16; i++) {
	      playfreq(150 + i * 50, 110 + j * 1, queue);   
	      if (i % 4 === 0) {
		  playinst(makesound(bufferList[0]), 440, rhythm);   
	      }
	  }
      }
  }


  play(queue);
  play(rhythm)
}


bufferLoader = new BufferLoader(
    context,
    [
      'sounds/hihat.wav',
      'sounds/kick.wav',
      'sounds/snare.wav',
    ],
    finishedLoading
    );

bufferLoader.load();

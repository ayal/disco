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


var playfreq = function(f,i) {
    var voice = new Voice(f);
    queue.push({interval:i, voice: voice});
};


var play = function () {
    lasttime = window.lasttime || new Date; 
    setInterval(function(){
	    if (queue.length) {
		var interval = queue[0].interval;
		var voice = queue[0].voice;

		if (new Date - lasttime >= interval - 50) {
		    window.lastvoice && lastvoice.stop();
		}

		if (new Date - lasttime >= interval) {
		    voice.start();

		    queue = queue.splice(1);
		    lasttime = new Date();
		    lastvoice = voice;
		}
	    }
	    else {
		lastvoice.stop();
		location.href = 'https://www.youtube.com/watch?v=VDxrIJXFjIU'
	    }
	}, 10);
};

for (var h = 0; h < 2; h++) {
    for (var j = 0; j < 5; j++) {
	for (var i = 0; i < 13; i++) {
	    if (i === 1) {
		playfreq(200 + i * 50, 160 + j * 5);   
	    }
	    else {
		playfreq(200 + i * 50, 100 + j * 5);   
	    }
	}
    }
}

	play();

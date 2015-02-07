var context = new AudioContext();

/* VCO */
var vco = context.createOscillator();
vco.type = vco.SINE;
vco.frequency.value = this.frequency;
vco.start(0);

/* VCA */
var vca = context.createGain();
vca.gain.value = 0;

/* Connections */
vco.connect(vca);
vca.connect(context.destination);

queue = [];


var playfreq = function(f,i) {
    queue.push({frequency:f, interval:i});
};


var play = function () {
    lasttime = window.lasttime || new Date; 
    setInterval(function(){
	    if (queue.length) {
		var interval = queue[0].interval;
		var frequency = queue[0].frequency;
		if (new Date - lasttime >= interval - 50) {
		    vca.gain.value = 0;
		}

		if (new Date - lasttime >= interval) {
		    vca.gain.value = 0;

		    vco.frequency.value = frequency;	
		    vca.gain.value = 1;
		    queue = queue.splice(1);
		    lasttime = new Date();
		}
	    }
	    else {
		vca.gain.value = 0;
	    }
	}, 10);
};

for (var j = 0; j < 13; j++) {
    for (var i = 0; i < 13; i++) {
	if (i === 1) {
	    playfreq(100 + i * 50, 500);   
	}
	else {
	    playfreq(100 + i * 50, 100);   
	}
    }
    play();
}


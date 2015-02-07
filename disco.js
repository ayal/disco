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


var playfreq = function(f) {
    queue.push(f);
};


var play = function (interval) {
    lasttime = window.lasttime || new Date; 
    setInterval(function(){
	    if (new Date - lasttime >= interval - 50) {
		vca.gain.value = 0;
	    }
	    if (new Date - lasttime >= interval) {
		vca.gain.value = 0;
		if (queue.length) {
		    vco.frequency.value = queue[0];	
		    vca.gain.value = 1;
		    queue = queue.splice(1);
		    lasttime = new Date();
		}
	    }   
	}, 10);
};

for (var j = 0; j < 13; j++) {
    for (var i = 0; i < 13; i++) {
	playfreq(100 + i * 50);   
    }
    play(100);
}


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

lasttime = new Date;

var play = function (interval) {
    setInterval(function(){
	    if (new Date - lasttime >= interval) {
		if (queue.length) {
		    vco.frequency.value = queue[0];	
		    vca.gain.value = 1;
		    queue = queue.splice(1);
		    lasttime = new Date();
		}	 
		vca.gain.value = 0;
	    }   
	}, 10);
};



playfreq(100);
playfreq(200);
playfreq(300);

play(500);


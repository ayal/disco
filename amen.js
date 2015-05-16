var context = new AudioContext();

var vco = context.createOscillator();

function Modulator (freq, gain,t) {
  this.modulator = context.createOscillator();
  this.gain = context.createGain();
  this.modulator.type = this.modulator.SQUARE;
  this.modulator.frequency.value = freq;
  this.gain.gain.value = gain;
  this.modulator.connect(this.gain);
  this.disconnect = function(){
      this.gain.disconnect();
      this.modulator.disconnect();
      this.vca = null;
      this.modulator = null;
  }
}

var canvas = document.getElementById('mycanvas');
var canvasCtx = canvas.getContext('2d');

var WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) - 100
var HEIGHT = Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 100

canvas.width = WIDTH;
canvas.height = HEIGHT;

analyser = context.createAnalyser();

analyser.connect(context.destination);
analyser.fftSize = 2048;
var bufferLength = analyser.fftSize
var data = new Uint8Array(bufferLength);


draw = function(){
    drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(data);
  
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = Math.max((WIDTH / (bufferLength)) * 5,3);
    var barHeight;
    var x = 50;

     	
    for(var i = 0; i < bufferLength; i++) {
	barHeight = (data[i] / 256) * HEIGHT;
	if (data[i] < 42) {
	    canvasCtx.fillStyle = 'rgb(0,70,0)';
        }
	else if (data[i] > 42 && data[i] < 256 / 3) {
	    canvasCtx.fillStyle = 'rgb(0,' + data[i]  + ',0)';
	}

	else if (data[i] > 256 / 3 && data[i] < 256 / 3 * 2) {
	    canvasCtx.fillStyle = 'rgb(0,' + data[i]  + ',' + data[i] +  ')';
	}

	else {
	    canvasCtx.fillStyle = 'rgb('+data[i]+',0,' + data[i] +')';
	}
	canvasCtx.beginPath();
	//	console.log(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
	canvasCtx.arc(x, HEIGHT - barHeight, barWidth*1.2, 0, 2 * Math.PI, false);
	canvasCtx.closePath();
	canvasCtx.fill();

    if (i === 10) {
    	
	canvasCtx.font = (16 + (data[i] / 128)*3) +  "px Verdana";
	canvasCtx.fillText("Amen - Music and Programming - Ayal Gelles", 50, HEIGHT - 10);
     }
	
	

	//	canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth*2,barWidth*10);

	x += barWidth + 1;
    }




};

drawit = _.once(draw);


var Voice = (function(context) {
	function Voice(frequency){
	    this.frequency = frequency;
	    this.vco = context.createOscillator();
	    this.vca = context.createGain();
	};

	Voice.prototype.startx = function(t,dec,g) {
	    this.vco.type = vco.SINE;
	    this.vco.frequency.value = this.frequency;

	    this.mod1 = new Modulator(this.frequency * Math.pow(2,rnd(-29,-29)), rnd(10,10000) * 10);
	    //this.mod2 = new Modulator(this.frequency * Math.pow(2,rnd(-20,2)), rnd(1,10)/ 10);
	    //	    this.mod3 = new Modulator(this.frequency * Math.pow(2,rnd(-6,3)), rnd(1,10)*10);

	    this.mod1.gain.connect(this.vco.frequency);
	    //this.mod2.gain.connect(this.mod1.gain);
	    //	    this.mod3.gain.connect(this.mod2.modulator.frequency);

	    this.vca.gain.value = 0;
	    this.vco.connect(this.vca)
	    this.vca.connect(analyser);

	    this.mod1.modulator.start(t - 0.005)
	    //this.mod2.modulator.start(t);
	    //	    this.mod3.modulator.start(t);
	    this.vco.start(t - 1);

	    this.vca.gain.linearRampToValueAtTime(g || 0.1, t)
	    this.vca.gain.linearRampToValueAtTime(0, t + dec)

	    var that = this;

	    setTimeout(function(){
	    	that.vco.disconnect();
		that.mod1.disconnect();
	    	//that.mod2.disconnect();
		//	    	that.mod3.disconnect();
		that.vca.disconnect();
		that.vca = null;
		that.vco = null;
		that.mod1 = null;
		//that.mod2 = null;
		//		that.mod3 = null;
		},1000 + (t+dec) * 1000);
	};

	return Voice;
    })(context);


makesound = function(buffer,x,g,stoptime,starttime,f) {
    var source = context.createBufferSource();
    source.buffer = buffer;
    var gainNode = context.createGain();
    gainNode.gain.value = g || 0.3; // reduce volume by 1/4
    x && (source.playbackRate.value = x);
    source.connect(gainNode);
    if (f) {
	gainNode.connect(f);
	f.connect(analyser);
    }
    else {
	gainNode.connect(analyser);
    }
    
    if (starttime) { 
	source.start(starttime);
	source.stop(stoptime);
    }
    var origstart = source.start;
    source.startx = function(t) {
	origstart.bind(source)(t);
	source.stop(t + 0.2);
    }
    return source;
};

var rnd = function(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
};


var semitone = 1.0594645615239402780161318002403;
var qtone = semitone / 2;


var makefilter = function(type, f){
    return null;
}

    
var gen = _.debounce(function(okgo) {
	var startTime = context.currentTime + 1.5;
	var tempo = 140; // BPM (beats per minute)
	var bps = 60 / tempo;
	var eighthNoteTime = (60 / tempo) / 2;

	var voices1 = [130.81,
		       155.56,
		       196.00,
		       220.00
		       ];
	drawit();
	

	for (var h =  0; h < 8; h++) {
	    for (var j = 0; j < 4; ++j) {
		var ss,bs = rnd(2,2)/2;
		for (var i = 0; i < 16; ++i) {

		    var time = function(x) {
			lasttime = startTime + (h * 4 * 16 + j * 16 + x) * bps *  0.25;
			return lasttime;
		    };

		    // R
		    if (i % 2 === 0) {
			makesound(bufferList[0], ss, 0.04, time(i+4), time(i));
		    }

		    // snare
		    if ([4,7,9,12,15].indexOf(i) !== -1 && [0,1].indexOf(j) !== -1) {
			makesound(bufferList[1], ss, 0.07, time(i+2), time(i));
		    }

		    if ([4,7,9,14].indexOf(i) !== -1 && [2].indexOf(j) !== -1) {
			makesound(bufferList[1], ss, 0.07, time(i+2), time(i));
		    }

		    if ([1,4,7,9,14].indexOf(i) !== -1 && [3].indexOf(j) !== -1) {
			makesound(bufferList[1], ss, 0.07, time(i+2), time(i));
		    }

		    // bass
		    if ([0,2,10,11].indexOf(i) !== -1 && [0,1].indexOf(j) !== -1) {
			makesound(bufferList[2], bs, 0.08, time(i+2), time(i));
		    }

		    if ([0,2,10].indexOf(i) !== -1 && [2].indexOf(j) !== -1) {
			makesound(bufferList[2], bs, 0.08, time(i+2), time(i));
		    }

		    if ([2,3,10].indexOf(i) !== -1 && [3].indexOf(j) !== -1) {
			makesound(bufferList[2], bs, 0.08, time(i+2), time(i));
		    }



		}
	    }
	}

	setTimeout(function(){
location.reload()
},(lasttime - startTime + 1) * 1100)
	
    },0)

function finishedLoading(bufferList) {

    window.bufferList = bufferList;
    gen();

}


bufferLoader = new BufferLoader(
    context,
    [
     'sounds/R.mp4',
     'sounds/S.mp4',
     'sounds/B.mp4',
     'sounds/C.mp4'
    ],
    finishedLoading
    );

bufferLoader.load();

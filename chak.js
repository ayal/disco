var context = new AudioContext();

var vco = context.createOscillator();



function Modulator (freq, gain,t) {
  this.modulator = context.createOscillator();
  this.gain = context.createGain();
  this.modulator.type = this.modulator.SINE;
  this.modulator.frequency.value = freq;
  this.gain.gain.value = gain;
  this.modulator.connect(this.gain);
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
var bufferLength = analyser.fftSize;
var data = new Uint8Array(bufferLength);
    

function draw() {
    drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(data);
        
    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = Math.max((WIDTH / bufferLength) * 5,3);
    var barHeight;
    var x = 50;

    for(var i = 0; i < bufferLength; i++) {
	barHeight = (data[i] / 128) * HEIGHT ;
	if (data[i] < 128 / 3) {
	    canvasCtx.fillStyle = 'rgb('+data[i]+',' + data[i]  + ',0)';
	}

	else if (data[i] > 128 / 3 && data[i] < 128 / 3 * 2) {
	    canvasCtx.fillStyle = 'rgb(0,' + data[i]  + ',' + data[i] +  ')';
	}

	else {
	    canvasCtx.fillStyle = 'rgb('+data[i]+',0,' + data[i] +')';
	}
	canvasCtx.beginPath();
	//	console.log(x,HEIGHT-barHeight/2,barWidth,barHeight/2);
	canvasCtx.arc(x, HEIGHT-barHeight/2, barWidth*1.2, 0, 2 * Math.PI, false);
	canvasCtx.closePath();
	canvasCtx.fill();
	//	canvasCtx.fillRect(x,HEIGHT-barHeight/2,barWidth*2,barWidth*10);

	x += barWidth + 1;
    }


    

};

draw();


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
	    this.vco.type = vco.SINE;
	    this.vco.frequency.value = this.frequency;

	    this.mod1 = new Modulator(this.frequency * rnd(1,4), 1);
	    this.mod2 = new Modulator(this.frequency / rnd(1/4), 0.8);

	    this.mod1.gain.connect(this.vca);
	    this.mod2.gain.connect(this.mod1.gain);

	    this.vca.gain.value = 0;
	    this.vco.connect(this.vca)
	    this.vca.connect(analyser);

	    this.mod1.modulator.start(t)
	    this.mod2.modulator.start(t)
	    this.vco.start(t);
	    
	    this.vca.gain.linearRampToValueAtTime(0.3, t + 0.005)
	    this.vca.gain.linearRampToValueAtTime(0, t + dec)

	    var that = this;
	    
	    setTimeout(function(){
	    	that.vco.disconnect();
	    	that.mod1.disconnect();
	    	that.mod2.disconnect();
		    //		    that.vco.stop();
		    //that.mod1.modulator.stop();
		    //that.mod2.modulator.stop()

		    //that.mod1 = null;
		    //that.mod2 = null;
		    //that.vco = null;
		},1000 + (t+dec) * 1000);


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
    gainNode.connect(analyser);

    return source;
};

var rnd = function(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
};


function finishedLoading(bufferList) {
    var startTime = context.currentTime + 0.100;
    var tempo = 55; // BPM (beats per minute)
    var bps = 60 / tempo;
    var eighthNoteTime = (60 / tempo) / 2;
    var voices = [146.83, 123.47, 196.00]
    for (var h = 0; h < 5; h++) {
    	for (var j = 0; j < 8; ++j) {
	    for (var i = 0; i < 8; ++i) {

		var time = function(x) {return startTime + (h * 8 * 8 + j * 8 + x) * bps *  0.25};


		if ([0].indexOf(i) !== -1) {

		    var o = rnd(1,2) / 2;
		    var p = rnd(2,2);
		    var v = new Voice(voices[0] * o);
		    v.startx(time(i), 0.8);

		    var v = new Voice(voices[1] * o);
		    v.startx(time(i + 3), 0.5);

		    var v = new Voice(voices[2] * o);
		    v.startx(time(i+5), 0.8);
		}

		if ([0].indexOf(i) !== -1 && (j > 3  || h > 0 && j > 1 && j < 7)) {
		    makesound(bufferList[1]).start(time(i));
		}

		
		if ([0].indexOf(i) !== -1 && (j > 3 || h > 0 && j > 1  && j < 7)) {
		    makesound(bufferList[3]).start(time(i + 1.5));
		    makesound(bufferList[3]).start(time(i + 3 ));
		}

		if ([4].indexOf(i) !== -1 && (j > 3 || h > 0 && j > 1  && j < 7)) {
		    makesound(bufferList[1]).start(time(i ));
		    makesound(bufferList[1]).start(time(i + 1));
		}


		if ([6].indexOf(i) !== -1 && (j> 3  || h > 0 && j > 1  && j < 7)) {
		    makesound(bufferList[3]).start(time(i));
		}

		if ([0,2,4,6].indexOf(i) !== -1 && (h > 0 && j > 1  && j < 8)) {
		    var mrate = 1;
		    
		    var s = makesound(bufferList[4], mrate, 0.02);
		    s.start(time(i));
		    s.stop(time(i + 1));
		    s.disconnect();
		    
		    var s = makesound(bufferList[4], mrate-0.1, 0.02);
		    s.start(time(i+0.66));
		    s.stop(time(i + 1.75));
		    s.disconnect();

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

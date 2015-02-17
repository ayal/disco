var context = new AudioContext();

var vco = context.createOscillator();



function Modulator (freq, gain,t) {
  this.modulator = context.createOscillator();
  this.gain = context.createGain();
  this.modulator.type = this.modulator.SINE;
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
var bufferLength = analyser.fftSize;
var data = new Uint8Array(bufferLength);

draw = function(){
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

    if (i === 10) {
    		  canvasCtx.font = (16 + (data[i] / 128)*4) +  "px Verdana";
	          canvasCtx.fillText("Hippy Hoppy - Music and Programming - Ayal Gelles", 10, HEIGHT - 10);

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

	    this.mod1 = new Modulator(this.frequency * Math.pow(2,rnd(2,3)), 0.8);
	    this.mod2 = new Modulator(this.frequency * Math.pow(2,rnd(-2,3)), rnd(1,10)/ 10);
	    this.mod3 = new Modulator(this.frequency * Math.pow(2,rnd(-2,5)), rnd(1,10)*10);

	    this.mod1.gain.connect(this.vca);
	    this.mod2.gain.connect(this.mod1.gain);
	    this.mod3.gain.connect(this.mod2.modulator.frequency);

	    this.vca.gain.value = 0;
	    this.vco.connect(this.vca)
	    this.vca.connect(analyser);

	    this.mod1.modulator.start(t);
	    this.mod2.modulator.start(t);
	    this.mod3.modulator.start(t);
	    this.vco.start(t - 0.05);

	    this.vca.gain.linearRampToValueAtTime(0.3, t)
	    this.vca.gain.linearRampToValueAtTime(0, t + dec)

	    var that = this;

	    setTimeout(function(){
	    	that.vco.disconnect();
	    	that.mod1.disconnect();
	    	that.mod2.disconnect();
	    	that.mod3.disconnect();
		that.vca.disconnect();
		that.vca = null;
		that.vco = null;
		that.mod1 = null;
		that.mod2 = null;
		that.mod3 = null;
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

    
var gen = _.debounce(function(okgo) {
	var startTime = context.currentTime + 1.5;
	var tempo = 55; // BPM (beats per minute)
	var bps = 60 / tempo;
	var eighthNoteTime = (60 / tempo) / 2;

	var voices1 = [146.83, 123.47, 196.00, 123.47];
	var voices2 = [123.47, 146.83, 185.00, 220.00];

	drawit();
	
	var s = makesound(bufferList[5], 0.8 + rnd(1,10)/10, 0.5);
	s.start(0);
	s.stop(4);

	for (var h =  0; h < 3; h++) {
	    for (var j = 0; j < 8; ++j) {
		var voices  = rnd(1,2) === 1 ? voices2 : voices1;

		for (var i = 0; i < 8; ++i) {

		    var time = function(x) {
			lasttime = startTime + (h * 8 * 8 + j * 8 + x) * bps *  0.25;
			return lasttime;
		    };


		    if ([0].indexOf(i) !== -1) {

			var o = 1/2;
			var p = rnd(0,3);
			var v = new Voice(voices[p] * o);
			v.startx(time(i + 1), 0.33);


			var p = rnd(0,3);
			var v = new Voice(voices[p] * o);
			v.startx(time(i+1.66), 0.33);


			var p = rnd(0,3);
			var v = new Voice(voices[p] * o);
			v.startx(time(i+2.33), 0.33);


			var p = rnd(0,3);
			var v = new Voice(voices[p] * o);
			v.startx(time(i+3.33), 0.33);
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

			var s = makesound(bufferList[4], mrate-rnd(-1,1)/10, 0.035);
			s.start(time(i));
			s.stop(time(i + 1));


			var s = makesound(bufferList[4], mrate-rnd(-1,1)/10, 0.035);
			s.start(time(i+0.66));
			s.stop(time(i + 1.75));


		    }

		    if ([0].indexOf(i) !== -1 && (h > 0 && j < 1)) {
			var mrate = 1;

			var s = makesound(bufferList[5], 1.1, 0.5);
			s.start(time(i));
			s.stop(time(i + 4));
		    }

		    if ([4].indexOf(i) !== -1 && (h > 0)) {
			var mrate = 1;

			var s = makesound(bufferList[6], 0.6 + rnd(1,10)/10, 0.5);
			s.start(time(i));
			s.stop(time(i + 4));
		    }


		}
	    }
	}

	setTimeout(function(){
location.reload()
},(lasttime - startTime)*1000)
	
    },0)

function finishedLoading(bufferList) {

    window.bufferList = bufferList;
    gen();

}


bufferLoader = new BufferLoader(
    context,
    [
      'sounds/snare.wav',
      'sounds/kick.wav',
      'sounds/hihat.wav',
      'sounds/Clap.wav',
      'sounds/maraca.mp3',
      'sounds/hippy.mp3',
      'sounds/muito.mp3',
    ],
    finishedLoading
    );

bufferLoader.load();

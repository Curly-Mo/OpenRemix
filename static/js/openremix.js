var OpenRemix = OpenRemix || {};

// Constructor
OpenRemix.Remixer = function(context, data, buffer, callback){
    this.context = context;
    this.beats = [];
    var source = context.createBufferSource();
    source.buffer = buffer;
    this.source = source;
    this.analyze(data, callback);
    this.queued = [];
    this._queue_time = 0;
}

/*
 * Instance Methods
 */ 

OpenRemix.Remixer.prototype.analyze = function(buffer, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/analyze');
    xhr.send(buffer);
    var remix = this;
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            var response = JSON.parse(xhr.responseText);
            console.log(response);
            remix.beats = response;
            if(callback){
                // Call this when analyze is complete
                callback.call(remix);
            }
        }
    }
};

OpenRemix.Remixer.prototype._queue_play = function(beat, when){
    var source = this.context.createBufferSource();
	source.loop = false;
    source.buffer = this.source.buffer;
    source.connect(this.context.destination);
    this.queued.push(source);
    source.start(when, beat.start, beat.duration);
    return when + parseFloat(beat.duration);
}

OpenRemix.Remixer.prototype.queue = function(beat){
    if(Array.isArray(beat)){
        // Optionally pass an array of beats and queue each in order
        for(var i=0; i<beat.length; i++){
            this.queue(beat[i]);
        }
		return;
    }
    var now = this.context.currentTime;
    if (now > this._queue_time) {
        this._queue_time = now;
    }
    this._queue_time = this._queue_play(beat, this._queue_time);
}

OpenRemix.Remixer.prototype.play = function(){
    if(this.context.state === 'suspended') {
        this.context.resume();
    }
}

OpenRemix.Remixer.prototype.pause = function(){
    this.context.suspend();
}

OpenRemix.Remixer.prototype.stop = function(){
    for (var i = 0; i < this.queued.length; i++) {
        if (this.queued[i] != null) {
            this.queued[i].stop();
        }
    }
    this.queued = [];
}


/*
 * Namespace Utilities
 */ 

OpenRemix.shuffle = function(beats){
	var new_beats = beats.slice(0);
    for (var i = new_beats.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = new_beats[i];
        new_beats[i] = new_beats[j];
        new_beats[j] = temp;
    }
    return new_beats;
};

OpenRemix.timbral_distance = function(s1, s2) {
    pairs = Object.keys(s1.features.chroma).map(function (key) {return [s1.features.chroma[key], s2.features.chroma[key]]});
    v1 = pairs.map(function (item) {return item[0]});
    v2 = pairs.map(function (item) {return item[1]});
    return OpenRemix.euclidean_distance(v1, v2);
}

OpenRemix.euclidean_distance = function(v1, v2) {
    var sum = 0;
    for (var i = 0; i < v1.length; i++) {
        var delta = v2[i] - v1[i];
        sum += delta * delta;
    }
    return Math.sqrt(sum);
}

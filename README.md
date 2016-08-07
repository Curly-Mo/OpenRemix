# OpenRemix

An attempt to recreate the functionality from The Echo Nest Remix.js using Amen and librosa.


## Run Server
```
python run.py
```
open http://127.0.0.1:5000


### Some things you can do
```
// Play all beats in order
remixer.queue(remixer.beats);

// Queue a specific beat to play (after all current beats finish)
remixer.queue(remixer.beats[12]);

// Play beats in random order
var beats = OpenRemix.shuffle(remixer.beats);
remixer.queue(beats);

// Get timbral distance between 2 beats (based on chroma euclidean distance)
OpenRemix.timbral_distance(remixer.beats[2], remixer.beats[16]);
```

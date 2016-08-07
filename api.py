import json
import datetime

import amen.feature
import amen.audio


class Beat(object):
    def __init__(self, start, duration, features):
        self.start = start
        self.duration = duration
        self.features = features

    def __repr__(self):
        args = self.start.delta * 1e-9, self.duration.delta * 1e-9
        return '<Beat, start: {0:.2f}, duration: {1:.2f}>'.format(*args)


class Analysis(object):
    def __init__(self, file_path):
        self.file_path = file_path
        self.audio = amen.audio.Audio(file_path)
        self.beats = list(self.analyze())

    def __repr__(self):
        return self.audio.__repr__()

    def analyze(self):
        time_slices = self.audio.timings['beats']
        for time_slice in time_slices:
            features = {}
            for key, feature in self.audio.features.items():
                feature = feature.at(time_slice)
                features[key] = feature
            beat = Beat(time_slice.time, time_slice.duration, features)
            yield(beat)

    def to_json(self):
        response = json.dumps(self.beats, default=JsonHandler)
        return response


def flatten(items, seqtypes=(list, tuple)):
    """Extract a single element if it is unnecessarily nested in a list"""
    while isinstance(items, seqtypes) and len(items) == 1:
        items = items[0]
    return items


def JsonHandler(obj):
    """JSON encoder that can parse Beat and Feature objects"""
    if isinstance(obj, Beat):
        return obj.__dict__
    elif isinstance(obj, datetime.timedelta):
        return obj.total_seconds()
    elif isinstance(obj, amen.feature.Feature):
        return flatten(obj.data.values.tolist())
    else:
        return json.JSONEncoder().default(obj)

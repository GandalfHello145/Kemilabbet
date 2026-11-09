"""Original quiet instrumental score for the chemistry films.

Usage: python compose_score.py input.mp4 output.mp4 --variation 1
Requires numpy and ffmpeg. Video frames are copied without re-encoding.
"""
import argparse
import json
from pathlib import Path
import subprocess
import tempfile
import wave
import numpy as np


def write_score(path, duration, variation):
    rate = 44100
    n = int((duration + .25) * rate)
    sound = np.zeros((n, 2), dtype=np.float32)
    transposition = [0, 2, -2, 5, 0, -5, 2][(variation - 1) % 7]
    chords = [(50, 57, 62, 65), (46, 53, 58, 62),
              (53, 60, 65, 69), (48, 55, 60, 64)]

    def add_note(start, seconds, midi, gain, pan=0, bell=False):
        count = min(int(seconds * rate), n - int(start * rate))
        if count <= 0:
            return
        t = np.arange(count, dtype=np.float32) / rate
        hz = 440 * 2 ** ((midi + transposition - 69) / 12)
        if bell:
            tone = (np.sin(2 * np.pi * hz * t) * np.exp(-t / 1.6)
                    + .20 * np.sin(2 * np.pi * hz * 2 * t) * np.exp(-t / .65)
                    + .07 * np.sin(2 * np.pi * hz * 3 * t) * np.exp(-t / .35))
            envelope = np.minimum(t / .012, 1)
        else:
            tone = (np.sin(2 * np.pi * hz * t)
                    + .14 * np.sin(2 * np.pi * hz * 2 * t + .1)
                    + .05 * np.sin(2 * np.pi * hz * 3 * t))
            envelope = np.minimum(t / 1.8, 1) * np.minimum((seconds - t) / 2.4, 1)
            envelope = np.maximum(envelope, 0)
        tone = tone * envelope * gain
        i = int(start * rate)
        sound[i:i+count, 0] += tone * np.sqrt((1-pan)/2)
        sound[i:i+count, 1] += tone * np.sqrt((1+pan)/2)

    for index, start in enumerate(np.arange(0, duration, 9.6)):
        chord = chords[index % len(chords)]
        for j, note in enumerate(chord):
            add_note(float(start), 12, note, .010, (j - 1.5) / 4)
        # An original sparse five-note figure, leaving long quiet gaps for reading.
        for offset, note_index, octave, pan in [(0.8, 0, 12, -.30),
                                               (2.0, 2, 12, .30),
                                               (3.6, 1, 12, -.12),
                                               (5.2, 3, 0, .12),
                                               (7.2, 2, 12, 0)]:
            add_note(float(start + offset), 3.6, chord[note_index] + octave,
                     .018, pan, bell=True)
    time = np.arange(n, dtype=np.float32) / rate
    fade = np.clip(time / 2, 0, 1) * np.clip((duration - time) / 3, 0, 1)
    sound *= fade[:, None]
    sound = np.clip(sound, -.85, .85)
    with wave.open(str(path), 'wb') as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(rate)
        output.writeframes((sound * 32767).astype('<i2').tobytes())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('input')
    parser.add_argument('output')
    parser.add_argument('--variation', type=int, default=1)
    args = parser.parse_args()
    data = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'json', args.input]))
    duration = float(data['format']['duration'])
    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='chemistry-score-') as temporary:
        audio = Path(temporary) / 'score.wav'
        write_score(audio, duration, args.variation)
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
                        '-i', args.input, '-i', str(audio),
                        '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy',
                        '-c:a', 'aac', '-b:a', '128k', '-shortest',
                        '-movflags', '+faststart', args.output], check=True)
    print(json.dumps({'output': args.output, 'duration': duration,
                      'music': 'Original synthesized instrumental score',
                      'video': 'copied without re-encoding'}))


if __name__ == '__main__':
    main()

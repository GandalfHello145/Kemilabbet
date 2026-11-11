"""Check the actual published v4 media, captions, and teaching timings."""
from pathlib import Path
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]


def seconds(stamp):
    h, m, s = stamp.split(':')
    return int(h) * 3600 + int(m) * 60 + float(s)


def audit():
    manifest = json.loads((ROOT / 'assets/films/v4/manifest.json').read_text())
    assert sorted(row['module'] for row in manifest) == list(range(1, 8))
    results = []
    for film in manifest:
        movie = ROOT / film['file']
        probe = json.loads(subprocess.check_output([
            'ffprobe', '-v', 'error', '-show_streams', '-show_format',
            '-show_chapters', '-of', 'json', str(movie)]))
        video = [s for s in probe['streams'] if s['codec_type'] == 'video']
        audio = [s for s in probe['streams'] if s['codec_type'] == 'audio']
        assert len(video) == len(audio) == 1, movie
        video = video[0]
        assert (video['width'], video['height']) == (1920, 1080), movie
        assert video['r_frame_rate'] == '30/1', movie
        assert video['codec_name'] == 'h264' and video['pix_fmt'] == 'yuv420p', movie
        duration = float(probe['format']['duration'])
        assert 90 <= duration <= 120, (movie, duration)
        assert abs(duration - film['duration']) < .08, movie
        assert film['narration'] is False and film['spoken_seconds'] == 0, movie
        report = json.loads(movie.with_suffix('.audio.json').read_text())
        assert report['narration'] is False and report['original_music'] is True, movie
        assert report['spoken_seconds'] == 0 and report['segments'] == [], movie
        assert movie.stat().st_size < 100_000_000, 'GitHub blob limit'
        cues = []
        caption_text = (ROOT / film['captions']).read_text()
        assert caption_text.startswith('WEBVTT'), movie
        for block in caption_text.strip().split('\n\n'):
            lines = block.splitlines()
            index = next((i for i, text in enumerate(lines) if '-->' in text), None)
            if index is None:
                continue
            start, end = map(seconds, lines[index].split(' --> '))
            text = ' '.join(lines[index + 1:])
            assert 0 <= start < end <= duration + .05, (movie, block)
            assert not cues or start >= cues[-1]['end'] - .002, movie
            wps = len(text.split()) / (end - start)
            assert wps <= 3.3, (movie, 'insufficient reading time', text, wps)
            cues.append({'start': start, 'end': end, 'words_per_second': round(wps, 2)})
        assert len(cues) >= 7, movie
        assert cues[-1]['end'] >= duration - .1, movie
        slug = movie.stem
        timing = json.loads((ROOT / 'manim/v4/timing' / (slug + '.json')).read_text())
        assert abs(timing['duration'] - duration) < .1, movie
        assert timing['animation_calls'] >= 28, movie
        assert timing['animation_seconds'] / duration >= .5, movie
        assert len(probe['chapters']) >= 7, movie
        for chapter in film['chapters']:
            assert 0 <= chapter['start'] < chapter['end'] < duration, movie
            assert chapter['automatic_reading_hold'] <= 4, (movie, chapter['title'])
        assert (ROOT / film['poster']).stat().st_size > 1000, movie
        results.append({'module': film['module'], 'duration': duration,
                        'size_bytes': movie.stat().st_size, 'native_1080p30': True,
                        'narration': False, 'cues': len(cues),
                        'maximum_words_per_second': max(row['words_per_second'] for row in cues),
                        'animation_calls': timing['animation_calls'],
                        'animation_seconds': timing['animation_seconds'],
                        'teaching_chapters': len(film['chapters']), 'passed': True})
    output = {'passed': True, 'film_count': 7, 'max_seconds': 120, 'results': results}
    report = ROOT / '.build/manim-v4/audit.json'
    report.parent.mkdir(parents=True, exist_ok=True)
    report.write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(output, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    audit()

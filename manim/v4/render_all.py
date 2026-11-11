"""Render seven original, concise chemistry films at native 1080p30.

No retiming or acceleration of earlier films is used. Every exported frame
comes from the v4 scene source. The audio contains instrumental music only.
"""
from pathlib import Path
import argparse
import json
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[2]
TARGETS = [
    ('scenes_1_2.py', 'AtomMaster', '01-atomer'),
    ('scenes_1_2.py', 'ModelMaster', '02-modeller'),
    ('scenes_3_4.py', 'ElectronMaster', '03-elektroner'),
    ('scenes_3_4.py', 'ReactionMaster', '04-forandringar'),
    ('scenes_5_7.py', 'MaterialMaster', '05-egenskaper'),
    ('scenes_5_7.py', 'PhaseMaster', '06-faser'),
    ('scenes_5_7.py', 'EnvironmentMaster', '07-miljo'),
]


def package(number, source, scene, slug):
    media = ROOT / '.build' / 'manim-v4' / slug / 'final'
    raw = media / 'videos' / Path(source).stem / '1080p30' / (scene + '.mp4')
    if not raw.exists():
        raise FileNotFoundError(raw)
    timing = json.loads((ROOT / 'manim/v4/timing' / (slug + '.json')).read_text())
    if timing.get('width') != 1920 or timing.get('fps') != 30:
        raise ValueError(f'{slug}: timing report must come from the final native render')
    final = ROOT / 'assets/films/v4' / (slug + '.mp4')
    captions = ROOT / 'assets/captions/v4' / (slug + '.vtt')
    subprocess.run([sys.executable, str(ROOT / 'manim/v4/music_score.py'),
                    str(raw), str(final), str(captions), '--variation', str(number)], check=True)
    poster = ROOT / 'assets/posters/v4' / (slug + '.jpg')
    poster.parent.mkdir(parents=True, exist_ok=True)
    # Pick an explanatory moment, rather than an introduction or transition.
    sample_time = timing['beats'][2]['start'] + 7
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
                    '-ss', str(sample_time), '-i', str(final),
                    '-frames:v', '1', '-q:v', '2', str(poster)], check=True)
    report = json.loads(final.with_suffix('.audio.json').read_text())
    chapters = []
    for beat in timing['beats']:
        beat = dict(beat)
        beat['title'] = beat['title'].replace('$_2$', '₂').replace('$_3$', '₃').replace('--', '–')
        chapters.append(beat)
    return {'module': number, 'scene': scene, 'file': final.relative_to(ROOT).as_posix(),
            'captions': captions.relative_to(ROOT).as_posix(),
            'poster': poster.relative_to(ROOT).as_posix(), 'duration': report['duration'],
            'width': 1920, 'height': 1080, 'fps': 30, 'audio': True,
            'narration': False, 'music': True, 'spoken_seconds': 0, 'version': 4,
            'animation_calls': timing['animation_calls'], 'chapters': chapters}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--skip-render', action='store_true', help='Package existing final native renders')
    parser.add_argument('--only', type=int, nargs='+', choices=range(1, 8))
    args = parser.parse_args()
    manifest = []
    for number, (source, scene, slug) in enumerate(TARGETS, 1):
        if args.only and number not in args.only:
            continue
        if not args.skip_render:
            subprocess.run([sys.executable, '-m', 'manim', '-r', '1920,1080',
                '--fps', '30', '--disable_caching', '--progress_bar', 'none',
                '--media_dir', str(ROOT / '.build/manim-v4' / slug / 'final'),
                str(ROOT / 'manim/v4' / source), scene], cwd=ROOT, check=True)
        manifest.append(package(number, source, scene, slug))
    output = ROOT / 'assets/films/v4/manifest.json'
    if args.only and output.exists():
        previous = json.loads(output.read_text())
        replaced = {row['module'] for row in manifest}
        manifest += [row for row in previous if row['module'] not in replaced]
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(sorted(manifest, key=lambda row: row['module']),
                                 ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()

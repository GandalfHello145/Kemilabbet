"""Rebuild the seven original films, soundtracks, posters and asset metadata."""
import json
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
SCENES = [('Atomer', '01-atomer'), ('Atommodeller', '02-modeller'),
          ('Elektroner', '03-elektroner'), ('Forandringar', '04-forandringar'),
          ('Egenskaper', '05-egenskaper'), ('Faser', '06-faser'), ('Miljo', '07-miljo')]


def main():
    records = []
    for number, (scene, slug) in enumerate(SCENES, 1):
        media = ROOT / '.build' / 'manim' / slug
        subprocess.run([sys.executable, '-m', 'manim', '-qm', '--fps', '30',
                        '--disable_caching', '--media_dir', str(media),
                        str(ROOT / 'manim' / 'kemilabbet_films.py'), scene],
                       cwd=ROOT, check=True)
        raw = media / 'videos' / 'kemilabbet_films' / '720p30' / (scene + '.mp4')
        final = ROOT / 'assets' / 'films' / 'v2' / (slug + '.mp4')
        subprocess.run([sys.executable, str(ROOT / 'manim' / 'compose_score.py'),
                        str(raw), str(final), '--variation', str(number)],
                       cwd=ROOT, check=True)
        poster = ROOT / 'assets' / 'posters' / 'v2' / (slug + '.jpg')
        poster.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
                        '-ss', '12', '-i', str(final), '-frames:v', '1',
                        '-q:v', '2', str(poster)], check=True)
        probe = json.loads(subprocess.check_output([
            'ffprobe', '-v', 'error', '-show_entries',
            'format=duration:stream=codec_type,width,height,r_frame_rate',
            '-of', 'json', str(final)]))
        records.append({'module': number, 'scene': scene,
                        'file': final.relative_to(ROOT).as_posix(),
                        'poster': poster.relative_to(ROOT).as_posix(),
                        'captions': f'assets/captions/v2/{slug}.vtt',
                        'duration': float(probe['format']['duration']),
                        'width': 1280, 'height': 720, 'fps': 30,
                        'audio': True, 'text': 'LaTeX Tex/MathTex'})
    (ROOT / 'assets' / 'films' / 'v2' / 'manifest.json').write_text(
        json.dumps(records, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()

"""Add the original instrumental score, without narration, to a chemistry film.

The legacy filename is retained for the production entry point. No TTS or
macOS voice is used. Video frames and existing chapters are copied unchanged;
caption files are read only when a raw render needs chapter metadata.
"""
import argparse
import json
from pathlib import Path
import subprocess
import sys
import tempfile

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from compose_score import write_score


def seconds(stamp):
    h, m, s = stamp.split(':')
    return int(h) * 3600 + int(m) * 60 + float(s)


def read_cues(path):
    cues = []
    for block in path.read_text(encoding='utf-8').strip().split('\n\n'):
        lines = block.splitlines()
        index = next((i for i, line in enumerate(lines) if '-->' in line), None)
        if index is None:
            continue
        start, end = lines[index].split(' --> ')
        cues.append((seconds(start), seconds(end), ' '.join(lines[index + 1:])))
    return cues


def metadata_text(value):
    for character in ('\\', '=', ';', '#', '\n'):
        value = value.replace(character, '\\' + character)
    return value


def build(input_movie, output_movie, captions, variation=1):
    input_movie, output_movie, captions = map(Path, (input_movie, output_movie, captions))
    probe = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-show_chapters', '-of', 'json', str(input_movie)]))
    duration = float(probe['format']['duration'])
    with tempfile.TemporaryDirectory(prefix='chemistry-music-') as temp_name:
        temporary = Path(temp_name)
        score = temporary / 'score.wav'
        write_score(score, duration, variation)
        inputs = ['-i', str(input_movie), '-i', str(score)]
        metadata_source = '0'
        if not probe.get('chapters'):
            # Fresh Manim renders have no chapters; an existing MP4 keeps
            # its exact chapter table instead of rebuilding it from captions.
            metadata = temporary / 'chapters.txt'
            chapter_lines = [';FFMETADATA1']
            for start, end, text in read_cues(captions):
                title = metadata_text(text.split('.')[0][:100])
                chapter_lines += ['[CHAPTER]', 'TIMEBASE=1/1000',
                                  f'START={round(start * 1000)}',
                                  f'END={round(min(end, duration) * 1000)}',
                                  f'title={title}']
            metadata.write_text('\n'.join(chapter_lines) + '\n', encoding='utf-8')
            inputs += ['-f', 'ffmetadata', '-i', str(metadata)]
            metadata_source = '2'
        output_movie.parent.mkdir(parents=True, exist_ok=True)
        subprocess.run([
            'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', *inputs,
            '-map', '0:v:0', '-map', '1:a:0',
            '-map_metadata', metadata_source, '-map_chapters', metadata_source,
            '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
            '-t', str(duration), '-movflags', '+faststart', str(output_movie)], check=True)
    final_probe = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'json', str(output_movie)]))
    site_root = Path(__file__).resolve().parents[2]
    try:
        public_file = output_movie.resolve().relative_to(site_root).as_posix()
    except ValueError:
        public_file = output_movie.name
    report = {'file': public_file, 'duration': float(final_probe['format']['duration']),
              'narration': False, 'narration_voice': None, 'mix_version': 4,
              'spoken_seconds': 0, 'segments': [], 'original_music': True,
              'video_frames': 'Copied without re-encoding'}
    output_movie.with_suffix('.audio.json').write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('input')
    parser.add_argument('output')
    parser.add_argument('captions')
    parser.add_argument('--variation', type=int, default=1)
    args = parser.parse_args()
    build(Path(args.input), Path(args.output), Path(args.captions), args.variation)

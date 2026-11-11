"""Extract one stable frame per teaching step and check silent movie metadata."""
from pathlib import Path
from PIL import Image,ImageDraw
import argparse
import av
import hashlib
import json

ROOT=Path(__file__).resolve().parents[2]

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('slug');parser.add_argument('scene')
    parser.add_argument('quality',choices=['preview','final'])
    args=parser.parse_args()
    folder=ROOT/'.build/manim-v5'/args.slug
    movies=list((folder/args.quality/'videos').glob(f'*/**/{args.scene}.mp4'))
    movies=[m for m in movies if 'partial_movie_files' not in m.parts]
    assert len(movies)==1,movies
    movie=movies[0]
    timing=json.loads((ROOT/f'manim/v5/timing/{args.slug}.json').read_text())
    with av.open(str(movie)) as c:
        s=c.streams.video[0]
        report={'file':str(movie),'duration':c.duration/1e6,'frames':s.frames,
            'width':s.width,'height':s.height,'fps':str(s.base_rate),
            'audio_streams':len(c.streams.audio),
            'max_caption_words_per_second':max(x['words_per_second'] for x in timing['reading']),
            'sha256':hashlib.sha256(movie.read_bytes()).hexdigest()}
        assert 70<=report['duration']<120
        assert report['audio_streams']==0
        assert report['max_caption_words_per_second']<=3
        if args.quality=='final':assert (s.width,s.height,s.base_rate)==(1920,1080,30)
    target=folder/'qa';target.mkdir(exist_ok=True)
    images=[]
    for i,beat in enumerate(timing['beats']):
        second=beat['end']-1
        with av.open(str(movie)) as c:
            s=c.streams.video[0];c.seek(int(max(0,second-2)/float(s.time_base)),stream=s)
            for frame in c.decode(s):
                if frame.time>=second:
                    image=frame.to_image();image.save(target/f'beat-{i+1}.png')
                    image.thumbnail((640,360));images.append(image);break
    rows=(len(images)+1)//2
    sheet=Image.new('RGB',(1280,rows*390),'#091524');draw=ImageDraw.Draw(sheet)
    for i,image in enumerate(images):
        x=i%2*640;y=i//2*390;sheet.paste(image,(x,y))
        draw.text((x+8,y+363),timing['beats'][i]['title'],fill='white')
    sheet.save(target/f'contact-{args.quality}.png')
    (target/f'report-{args.quality}.json').write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps(report))

if __name__=='__main__':main()

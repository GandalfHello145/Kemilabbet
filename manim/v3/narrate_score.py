"""Synchronize Swedish narration, original music and chapter metadata.

Uses the installed macOS Alva voice. Video frames are copied without recoding.
Run with the same Python environment as Manim; FFmpeg and macOS say are needed.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import wave
import numpy as np

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from compose_score import write_score

VOICE_CACHE=Path(__file__).resolve().parents[2]/'.build'/'swedish-voice'


def seconds(stamp):
    h,m,s = stamp.split(':')
    return int(h)*3600+int(m)*60+float(s)


def read_cues(path):
    cues=[]
    for block in path.read_text().strip().split('\n\n'):
        lines=block.splitlines()
        index=next((i for i,line in enumerate(lines) if '-->' in line),None)
        if index is None:continue
        start,end=lines[index].split(' --> ')
        cues.append((seconds(start),seconds(end),' '.join(lines[index+1:])))
    return cues


def spoken(text):
    pairs=[('H₂O','H två O'),('H2O','H två O'),('O₂','O två'),('O2','O två'),
           ('H₂','H två'),('H2','H två'),('CO₂','koldioxid'),('CO2','koldioxid'),
           ('NaCl','natriumklorid'),('PFAS','P F A S'),('→',', sedan '),
           ('2D','två dimensioner'),('3D','tre dimensioner')]
    for old,new in pairs:text=text.replace(old,new)
    return text


def speech_file(text,voice='Alva'):
    prepared=spoken(text)
    key=hashlib.sha256((voice+'\0'+'150'+'\0'+prepared).encode()).hexdigest()
    VOICE_CACHE.mkdir(parents=True,exist_ok=True)
    aiff=VOICE_CACHE/(key+'.aiff')
    if not aiff.exists():
        with tempfile.TemporaryDirectory(prefix='chemistry-speech-') as name:
            folder=Path(name)
            txt=folder/'words.txt';txt.write_text(prepared,encoding='utf-8')
            result=folder/'voice.aiff'
            subprocess.run(['say','-v',voice,'-r','150','-f',str(txt),'-o',str(result)],
                           check=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE)
            aiff.write_bytes(result.read_bytes())
    return aiff


def build(input_movie,output_movie,captions,variation,voice='Alva'):
    probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries',
                         'format=duration','-of','json',str(input_movie)]))
    duration=float(probe['format']['duration'])
    cues=read_cues(captions)
    # The closing graphic carries the full recap; its spoken call to action
    # stays short enough for a calm, natural reading pace.
    if cues and cues[-1][1]-cues[-1][0]<10:
        start,end,_=cues[-1]
        cues[-1]=(start,min(end,duration),
            'Förklara nu med egna ord. Använd modellerna och sambanden från filmen.')
    rate=44100
    spoken_seconds=0
    segments=[]
    with tempfile.TemporaryDirectory(prefix='chemistry-narration-') as temp_name:
        temp=Path(temp_name)
        score=temp/'score.wav'
        write_score(score,duration,variation)
        with wave.open(str(score),'rb') as src:
            music=np.frombuffer(src.readframes(src.getnframes()),dtype='<i2').astype(np.float32).reshape(-1,2)/32768
        audio=np.zeros_like(music)
        duck=np.ones(len(audio),dtype=np.float32)
        for index,(start,end,text) in enumerate(cues):
            aiff=speech_file(text,voice)
            voice_data=subprocess.check_output(['ffmpeg','-hide_banner','-loglevel','error',
                        '-i',str(aiff),'-ar',str(rate),'-ac','1','-f','f32le','-'])
            signal=np.frombuffer(voice_data,dtype='<f4').copy()
            available=max(.6,end-start-.7)
            raw_duration=len(signal)/rate
            speed=max(1,raw_duration/available)
            if speed>1.01:
                # Keep the spoken explanation within its matching visual chapter.
                filters=[]
                remaining=speed
                while remaining>2:
                    filters.append('atempo=2');remaining/=2
                filters.append(f'atempo={remaining:.6f}')
                voice_data=subprocess.check_output(['ffmpeg','-hide_banner','-loglevel','error',
                        '-i',str(aiff),'-af',','.join(filters),'-ar',str(rate),'-ac','1','-f','f32le','-'])
                signal=np.frombuffer(voice_data,dtype='<f4').copy()
            rms=np.sqrt(np.mean(signal**2)+1e-10)
            gain=min(.105/rms,.76/max(np.max(np.abs(signal)),.01))
            signal*=gain
            offset=int((start+.30)*rate)
            length=min(len(signal),len(audio)-offset)
            audio[offset:offset+length,0]+=signal[:length]*.707
            audio[offset:offset+length,1]+=signal[:length]*.707
            lo=max(0,offset-int(.15*rate));hi=min(len(duck),offset+length+int(.20*rate))
            duck[lo:hi]=.25
            spoken_seconds+=length/rate
            segments.append({'start':start+.30,'duration':length/rate,
                             'speed_factor':speed,'text':text})
        audio+=music*(duck[:,None]*.82)
        peak=max(np.max(np.abs(audio)),.01)
        if peak>.94:audio*=.94/peak
        mixed=temp/'mixed.wav'
        with wave.open(str(mixed),'wb') as target:
            target.setnchannels(2);target.setsampwidth(2);target.setframerate(rate)
            target.writeframes((audio*32767).astype('<i2').tobytes())
        metadata=temp/'chapters.txt'
        chapter_lines=[';FFMETADATA1']
        for start,end,text in cues:
            title=text.split('.')[0][:100].replace('=','\\=').replace(';','\\;').replace('#','\\#')
            chapter_lines += ['[CHAPTER]','TIMEBASE=1/1000',f'START={round(start*1000)}',
                              f'END={round(end*1000)}',f'title={title}']
        metadata.write_text('\n'.join(chapter_lines)+'\n')
        output_movie.parent.mkdir(parents=True,exist_ok=True)
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(input_movie),
             '-i',str(mixed),'-f','ffmetadata','-i',str(metadata),'-map','0:v:0','-map','1:a:0',
             '-map_metadata','2','-map_chapters','2','-c:v','copy','-c:a','aac','-b:a','192k',
             '-shortest','-movflags','+faststart',str(output_movie)],check=True)
    def stamp(t):
        value=round(t*1000)
        return f'{value//3600000:02}:{value//60000%60:02}:{value//1000%60:02}.{value%1000:03}'
    caption_lines=['WEBVTT','']
    for index,(start,end,text) in enumerate(cues,1):
        caption_lines += [str(index),f'{stamp(start)} --> {stamp(min(end,duration))}',text,'']
    captions.write_text('\n'.join(caption_lines),encoding='utf-8')
    site_root=Path(__file__).resolve().parents[2]
    try: public_file=output_movie.resolve().relative_to(site_root).as_posix()
    except ValueError: public_file=output_movie.name
    report={'file':public_file,'duration':duration,'narration_voice':voice,'mix_version':2,
            'spoken_seconds':spoken_seconds,'segments':segments,'original_music':True,
            'video_frames':'Copied without re-encoding'}
    output_movie.with_suffix('.audio.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k!='segments'},ensure_ascii=False),flush=True)


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('input');parser.add_argument('output');parser.add_argument('captions')
    parser.add_argument('--variation',type=int,default=1)
    args=parser.parse_args()
    build(Path(args.input),Path(args.output),Path(args.captions),args.variation)

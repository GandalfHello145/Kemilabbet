"""Render the seven longer films at native 1080p30, then add music only."""
from pathlib import Path
import json
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[2]
TARGETS=[('scenes_1_2.py','AtomMaster','01-atomer'),
         ('scenes_1_2.py','ModelMaster','02-modeller'),
         ('scenes_3_4.py','ElectronMaster','03-elektroner'),
         ('scenes_3_4.py','ReactionMaster','04-forandringar'),
         ('scenes_5_7.py','MaterialMaster','05-egenskaper'),
         ('scenes_5_7.py','PhaseMaster','06-faser'),
         ('scenes_5_7.py','EnvironmentMaster','07-miljo')]


def main():
    manifest=[]
    for number,(source,scene,slug) in enumerate(TARGETS,1):
        media=ROOT/'.build'/'manim-v3'/slug
        subprocess.run([sys.executable,'-m','manim','-r','1920,1080','--fps','30',
            '--disable_caching','--progress_bar','none','--media_dir',str(media),
            str(ROOT/'manim/v3'/source),scene],cwd=ROOT,check=True)
        raw=media/'videos'/Path(source).stem/'1080p30'/(scene+'.mp4')
        final=ROOT/'assets/films/v3'/(slug+'.mp4')
        captions=ROOT/'assets/captions/v3'/(slug+'.vtt')
        subprocess.run([sys.executable,str(ROOT/'manim/v3/narrate_score.py'),
            str(raw),str(final),str(captions),'--variation',str(number)],check=True)
        poster=ROOT/'assets/posters/v3'/(slug+'.jpg')
        poster.parent.mkdir(parents=True,exist_ok=True)
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-ss','40',
            '-i',str(final),'-frames:v','1','-q:v','2',str(poster)],check=True)
        report=json.loads(final.with_suffix('.audio.json').read_text())
        timing=json.loads((ROOT/'manim/v3/timing'/(slug+'.json')).read_text())
        manifest.append({'module':number,'scene':scene,'file':final.relative_to(ROOT).as_posix(),
            'captions':captions.relative_to(ROOT).as_posix(),
            'poster':poster.relative_to(ROOT).as_posix(),'duration':report['duration'],
            'width':1920,'height':1080,'fps':30,'audio':True,'narration':False,
            'music':True,'spoken_seconds':0,
            'animation_calls':timing['animation_calls'],'chapters':timing['beats']})
    (ROOT/'assets/films/v3/manifest.json').write_text(
        json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')


if __name__=='__main__':main()

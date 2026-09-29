from PIL import Image, ImageDraw, ImageFont
import subprocess, os, math, datetime, wave, struct

W, H, FPS, DURATION = 1920, 1080, 30, 20
OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(OUT, 'work')
STAMP = datetime.datetime.now().strftime('%Y-%m-%d-%H%M%S')
if os.path.basename(OUT) == 'brag-output':
    OUT = os.path.join(os.path.dirname(OUT), f'brag-output-{STAMP}')
    WORK = os.path.join(OUT, 'work')
os.makedirs(WORK, exist_ok=True)
os.makedirs(os.path.join(WORK, 'stills'), exist_ok=True)

FONT = '/usr/share/fonts/truetype/ibm-plex/IBMPlexSans-Regular.ttf'
BOLD = '/usr/share/fonts/truetype/ibm-plex/IBMPlexSans-SemiBold.ttf'
MONO = '/usr/share/fonts/truetype/dm-mono/DMMono-Regular.ttf'
CORAL = (212, 56, 26)
INK = (10, 10, 10)
STEEL = (95, 95, 95)
MUTED = (168, 170, 178)
SURFACE = (247, 248, 250)
HAIR = (229, 231, 235)
BLUE = (20, 86, 240)
GREEN = (27, 166, 115)

def font(path, size):
    return ImageFont.truetype(path, size)

def rounded(d, box, radius, fill, outline=None, width=1):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)

def centered(d, text, y, f, fill=INK):
    box = d.textbbox((0, 0), text, font=f)
    d.text(((W - (box[2]-box[0]))/2, y), text, font=f, fill=fill)

def fade(a, start, length=0.7):
    return max(0.0, min(1.0, (a-start)/length))

def text_fade(d, xy, text, f, fill, alpha):
    layer = Image.new('RGBA', (W,H), (0,0,0,0))
    ld = ImageDraw.Draw(layer)
    ld.text(xy, text, font=f, fill=(*fill, int(255*alpha)))
    return layer

def base(bg=(255,255,255)):
    return Image.new('RGB', (W,H), bg)

def scene(t):
    if t < 3.4:
        im = base((255,255,255)); d=ImageDraw.Draw(im)
        a=fade(t,0,0.65)
        badge='AI-POWERED & FREE'; bf=font(BOLD,22); bw=d.textbbox((0,0),badge,font=bf)[2]
        rounded(d, ((W-bw-44)/2,185,(W+bw+44)/2,235), 25, (255,240,238))
        d.text(((W-bw)/2,196),badge,font=bf,fill=CORAL)
        headline=['Get Your Resume','Past ATS Filters','in 30 Seconds']
        for i,line in enumerate(headline):
            f=font(BOLD,76 if i<2 else 70)
            bb=d.textbbox((0,0),line,font=f)
            d.text(((W-(bb[2]-bb[0]))/2,315+i*88),line,font=f,fill=INK)
        d.line((680,620,1240,620),fill=CORAL,width=5)
        d.ellipse((1228,608,1244,624),fill=CORAL)
        im=Image.blend(base((255,255,255)),im,a)
        return im
    if t < 6.8:
        im=base(); d=ImageDraw.Draw(im)
        centered(d,'Paste a job description. Upload your resume.',260,font(BOLD,42),INK)
        centered(d,'Get a tailored resume, ATS score, and cover letter — instantly.',325,font(FONT,28),STEEL)
        rounded(d,(660,470,1260,560),45,INK)
        centered(d,'Tailor My Resume Free  →',492,font(BOLD,28),(255,255,255))
        centered(d,'No signup required  ·  First tailoring free  ·  PDF & DOCX supported',640,font(FONT,20),MUTED)
        return im
    if t < 11.0:
        im=base(); d=ImageDraw.Draw(im)
        centered(d,'Your 30-second advantage starts here.',92,font(BOLD,38),INK)
        steps=[('1','Upload Resume'),('2','Paste Job Description'),('3','Get Results')]
        x0=440
        for i,(num,label) in enumerate(steps):
            x=x0+i*520
            if i<2: d.line((x+52,190,x+468,190),fill=CORAL if i==0 else HAIR,width=4)
            d.ellipse((x,150,x+80,230),fill=CORAL if i<2 else SURFACE,outline=None if i<2 else HAIR,width=2)
            d.text((x+30,168),num,font=font(BOLD,34),fill=(255,255,255) if i<2 else MUTED)
            bb=d.textbbox((0,0),label,font=font(BOLD,22)); d.text((x+40-(bb[2]-bb[0])/2,255),label,font=font(BOLD,22),fill=CORAL if i<2 else MUTED)
        rounded(d,(330,355,890,780),18,SURFACE,HAIR,2)
        d.text((410,405),'Resume uploaded successfully',font=font(BOLD,25),fill=INK)
        d.text((410,455),'alex-chen-resume.pdf',font=font(MONO,22),fill=STEEL)
        rounded(d,(410,525,810,585),30,(255,240,238))
        d.text((445,540),'✓  Ready to analyze',font=font(BOLD,21),fill=CORAL)
        rounded(d,(1030,355,1590,780),18,(255,255,255),HAIR,2)
        d.text((1100,405),'Step 2: Paste Job Description',font=font(BOLD,25),fill=INK)
        lines=['Senior Product Designer','Own end-to-end UX strategy','Figma · research · systems','Collaborate with engineering']
        for j,line in enumerate(lines): d.text((1100,475+j*48),line,font=font(FONT,20),fill=STEEL)
        rounded(d,(1100,685,1465,745),30,INK)
        d.text((1182,702),'Analyze match  →',font=font(BOLD,21),fill=(255,255,255))
        return im
    if t < 15.2:
        im=base((10,10,10)); d=ImageDraw.Draw(im)
        d.text((150,120),'H I R E F I T',font=font(BOLD,22),fill=CORAL)
        d.text((150,190),'Six AI tools. One honest match.',font=font(BOLD,54),fill=(255,255,255))
        d.text((150,275),'Your resume stays yours.',font=font(FONT,30),fill=(168,170,178))
        tools=['JD Analyzer','Resume Analyzer','Gap Analyzer','ATS Scorer','Resume Rewriter','Cover Letter']
        for i,name in enumerate(tools):
            y=405+i*70; done=t>11.0+i*0.42
            d.ellipse((155,y,189,y+34),fill=CORAL if done else (45,45,45))
            d.text((166,y+4),'✓' if done else '·',font=font(BOLD,22),fill=(255,255,255) if done else MUTED)
            d.text((220,y+2),name,font=font(BOLD,25),fill=(255,255,255) if done else (120,120,120))
            d.line((520,y+18,1060,y+18),fill=(50,50,50),width=2)
        rounded(d,(1270,390,1730,735),22,(24,30,37))
        d.text((1345,445),'MATCH LEVEL',font=font(BOLD,18),fill=MUTED)
        d.text((1350,500),'STRONG',font=font(BOLD,48),fill=(255,255,255))
        d.arc((1340,580,1610,850),200,340,fill=CORAL,width=20)
        d.text((1430,652),'89%',font=font(BOLD,52),fill=CORAL)
        d.text((1375,725),'ATS score',font=font(FONT,19),fill=MUTED)
        return im
    if t < 17.5:
        im=base(); d=ImageDraw.Draw(im)
        centered(d,'A tailored resume that still sounds like you.',240,font(BOLD,48),INK)
        centered(d,'Preservation-first. No invented skills. Every metric kept.',315,font(FONT,27),STEEL)
        rounded(d,(455,455,1465,690),20,SURFACE,HAIR,2)
        d.text((520,505),'ATS MATCH',font=font(BOLD,20),fill=STEEL)
        d.text((520,555),'34%',font=font(BOLD,62),fill=MUTED)
        d.line((770,580,970,580),fill=CORAL,width=5)
        d.text((1030,505),'TAILORED',font=font(BOLD,20),fill=STEEL)
        d.text((1030,555),'89%',font=font(BOLD,62),fill=CORAL)
        rounded(d,(710,760,1210,824),32,INK)
        centered(d,'Download tailored PDF  ↓',778,font(BOLD,22),(255,255,255))
        return im
    im=base(INK); d=ImageDraw.Draw(im)
    rounded(d,(900,175,1020,295),28,CORAL)
    d.text((926,207),'HF',font=font(BOLD,42),fill=(255,255,255))
    centered(d,'HireFit',345,font(BOLD,28),CORAL)
    centered(d,'No signup required. First tailoring free.',420,font(BOLD,52),(255,255,255))
    centered(d,'Paste a JD. Upload your resume. Get seen.',530,font(FONT,26),MUTED)
    centered(d,'hirefit.ai',690,font(MONO,20),STEEL)
    return im

def make_audio(path, duration):
    sr=44100; n=int(sr*duration)
    with wave.open(path,'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
        for i in range(n):
            t=i/sr; beat=0.0
            for freq,amp in [(110,0.12),(220,0.07),(330,0.035)]:
                beat += amp*math.sin(2*math.pi*freq*t)
            pulse=0.0
            if (t*2)%1 < 0.08: pulse=0.04*math.sin(2*math.pi*660*t)*math.exp(-((t*2)%1)*25)
            val=max(-1,min(1,(beat+pulse)*min(1,t*8)*min(1,(duration-t)*8)))
            w.writeframes(struct.pack('<h',int(val*32767)))

def main():
    raw=subprocess.Popen(['ffmpeg','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-pix_fmt','yuv420p','-crf','18','-movflags','+faststart',os.path.join(WORK,'silent.mp4')],stdin=subprocess.PIPE)
    poster=None
    for idx in range(int(DURATION*FPS)):
        t=idx/FPS; im=scene(t)
        if idx==int(3.0*FPS): poster=im.copy(); poster.save(os.path.join(OUT,'brag.jpg'),quality=95)
        raw.stdin.write(im.tobytes())
        if idx in [0,90,210,330,450,525]: im.save(os.path.join(WORK,'stills',f'scene-{idx:03d}.png'))
    raw.stdin.close(); raw.wait()
    audio=os.path.join(WORK,'music.wav'); make_audio(audio,DURATION)
    subprocess.run(['ffmpeg','-y','-i',os.path.join(WORK,'silent.mp4'),'-i',audio,'-c:v','copy','-c:a','aac','-b:a','160k','-shortest',os.path.join(OUT,'brag.mp4')],check=True)
    with open(os.path.join(OUT,'share-copy.txt'),'w') as f: f.write('Job hunting, tailored. HireFit turns a job description and your real resume into an ATS-ready application in 30 seconds — preserving every skill, metric, and bit of truth.\n')
    with open(os.path.join(OUT,'brag-plan.md'),'w') as f: f.write('# Brag Plan: HireFit\n\nAngle: show the honest path from JD + resume to a stronger application.\n\nTone: polished, punchy, clean.\n\nStoryboard: 0–3.4s hook; 3.4–6.8s reveal; 6.8–11s upload and JD flow; 11–15.2s six-tool analysis; 15.2–17.5s before/after ATS score; 17.5–20s outro.\n')
    print(OUT)

if __name__=='__main__': main()

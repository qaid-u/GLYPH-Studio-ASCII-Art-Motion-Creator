import {useRef,useState} from 'react';
import {dimensions,drawGrid,mapPixels,RAMPS,type Settings} from './engine';

export function HeroArtwork(){
  const [mode,setMode]=useState<'original'|'ascii'>('original');
  const [ready,setReady]=useState(false);
  const canvas=useRef<HTMLCanvasElement>(null);
  function renderPreview(image:HTMLImageElement){
    if(!canvas.current)return;
    const {cols,rows}=dimensions(image.naturalWidth,image.naturalHeight,120);
    const sample=document.createElement('canvas');sample.width=cols;sample.height=rows;
    const context=sample.getContext('2d',{willReadFrequently:true});if(!context)return;
    context.drawImage(image,0,0,cols,rows);
    const settings:Settings={columns:120,brightness:0,contrast:1.15,gamma:1,invert:false,ramp:RAMPS.Detailed,color:'source',foreground:'#e9ebe8',background:'#0b0d0c'};
    drawGrid(canvas.current,mapPixels(context.getImageData(0,0,cols,rows).data,cols,rows,settings),settings);
    setReady(true);
  }
  return <div className="hero-art" onPointerMove={e=>{if(e.pointerType==='mouse'){const rect=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--pointer-x',`${(e.clientX-rect.left)/rect.width*100}%`);e.currentTarget.style.setProperty('--pointer-y',`${(e.clientY-rect.top)/rect.height*100}%`)}}}>
    <img className="hero-image" src="/illustrations/cyber-artist.webp" alt="Original cyber-inspired illustration of a creative artist overlooking a futuristic city" onLoad={e=>renderPreview(e.currentTarget)} hidden={mode!=='original'}/>
    <canvas className="hero-image hero-ascii" ref={canvas} aria-label="ASCII rendering of the illustrated artist" hidden={mode!=='ascii'}/>
    <div className="hero-art-overlay" aria-hidden="true"><div className="hero-grid"/><div className="hero-cross cross-one">+</div><div className="hero-cross cross-two">+</div><div className="hero-jp">文字<br/>映像</div><div className="hero-coordinates">GLYPH / 視覚実験<br/>VISUAL EXPERIMENTS<br/><br/>[ CREATE / EDIT / EXPORT ]</div><div className="hero-scan"/></div>
    <div className="hero-mode" role="group" aria-label="Preview style"><span>VIEW / 表示</span><button type="button" aria-pressed={mode==='original'} onClick={()=>setMode('original')}>Original</button><button type="button" aria-pressed={mode==='ascii'} disabled={!ready} onClick={()=>setMode('ascii')}>ASCII</button></div>
  </div>;
}

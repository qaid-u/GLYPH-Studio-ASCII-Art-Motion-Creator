import {backgroundMask} from '../background';
import {drawTool,type ToolId,type ToolSettings} from './engine';
export function prepareForeground(image:HTMLImageElement,method:'subject'|'color',mask:ImageData|null,threshold:number):HTMLCanvasElement|null{
  if(method==='subject'&&!mask)return null;
  const matte=document.createElement('canvas'),mx=matte.getContext('2d',{willReadFrequently:true});if(!mx)throw Error('Canvas unavailable');
  if(method==='subject'&&mask){matte.width=mask.width;matte.height=mask.height;const thresholded=new ImageData(new Uint8ClampedArray(mask.data),mask.width,mask.height);for(let i=3;i<thresholded.data.length;i+=4)thresholded.data[i]=thresholded.data[i]>=Math.round(threshold*255/100)?255:0;mx.putImageData(thresholded,0,0)}
  else{const scale=Math.min(1,512/Math.max(image.naturalWidth,image.naturalHeight));matte.width=Math.max(1,Math.round(image.naturalWidth*scale));matte.height=Math.max(1,Math.round(image.naturalHeight*scale));mx.drawImage(image,0,0,matte.width,matte.height);const pixels=mx.getImageData(0,0,matte.width,matte.height),removed=backgroundMask(pixels.data,matte.width,matte.height,threshold);for(let i=0;i<removed.length;i++){const p=i*4;pixels.data[p]=pixels.data[p+1]=pixels.data[p+2]=255;pixels.data[p+3]=removed[i]?0:255}mx.putImageData(pixels,0,0)}
  const source=document.createElement('canvas'),scale=Math.min(1,2048/Math.max(image.naturalWidth,image.naturalHeight),Math.sqrt(4194304/(image.naturalWidth*image.naturalHeight)));source.width=Math.max(1,Math.round(image.naturalWidth*scale));source.height=Math.max(1,Math.round(image.naturalHeight*scale));const ctx=source.getContext('2d');if(!ctx)throw Error('Canvas unavailable');ctx.drawImage(image,0,0,source.width,source.height);ctx.globalCompositeOperation='destination-in';ctx.drawImage(matte,0,0,source.width,source.height);ctx.globalCompositeOperation='source-over';return source;
}
export type TransformedSource={source:HTMLCanvasElement;width:number;height:number;mask:HTMLCanvasElement|null};
export function transformSource(image:HTMLImageElement,foreground:HTMLCanvasElement|null,rotation:0|90|180|270,flipHorizontal:boolean):TransformedSource|null{
  if(rotation===0&&!flipHorizontal)return null;
  const scale=Math.min(1,2048/Math.max(image.naturalWidth,image.naturalHeight),Math.sqrt(4194304/(image.naturalWidth*image.naturalHeight))),w=Math.max(1,Math.round(image.naturalWidth*scale)),h=Math.max(1,Math.round(image.naturalHeight*scale)),swapped=rotation===90||rotation===270;
  const canvas=document.createElement('canvas');canvas.width=swapped?h:w;canvas.height=swapped?w:h;const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable');ctx.translate(canvas.width/2,canvas.height/2);ctx.scale(flipHorizontal?-1:1,1);ctx.rotate(rotation*Math.PI/180);ctx.drawImage(foreground||image,-w/2,-h/2,w,h);
  return {source:canvas,width:swapped?image.naturalHeight:image.naturalWidth,height:swapped?image.naturalWidth:image.naturalHeight,mask:foreground?canvas:null};
}
export function renderConverter(canvas:HTMLCanvasElement,image:HTMLImageElement,foreground:HTMLCanvasElement|null,tool:ToolId,settings:ToolSettings,time:number,maxSize=960,flatten=false,transformed:TransformedSource|null=null){
  const source=transformed?.source||foreground||image,width=transformed?.width||image.naturalWidth,height=transformed?.height||image.naturalHeight,mask=transformed?transformed.mask:foreground;
  drawTool(canvas,source,width,height,tool,settings,time,maxSize,!!mask);
  if(mask&&tool!=='receipt'){const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable');ctx.globalCompositeOperation='destination-in';ctx.drawImage(mask,0,0,canvas.width,canvas.height);ctx.globalCompositeOperation='source-over';if(flatten){ctx.globalCompositeOperation='destination-over';ctx.fillStyle='#0f0f1a';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.globalCompositeOperation='source-over'}}
}

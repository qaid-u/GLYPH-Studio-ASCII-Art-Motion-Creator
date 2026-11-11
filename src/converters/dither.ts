export type Algorithm='threshold'|'floyd'|'bayer'|'atkinson';
const bayer=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];
export function dither(source:Uint8ClampedArray,width:number,height:number,algorithm:Algorithm,threshold:number,brightness:number,contrast:number,invert:boolean,foreground:[number,number,number],background:[number,number,number],strength=1,phase=0):Uint8ClampedArray{
 const n=width*height,lum=new Float32Array(n),out=new Uint8ClampedArray(n*4);for(let i=0;i<n;i++){const p=i*4,alpha=source[p+3]/255;let value=(.2126*source[p]+.7152*source[p+1]+.0722*source[p+2])*alpha+255*(1-alpha);value=Math.max(0,Math.min(255,(value-127.5)*contrast+127.5+brightness));lum[i]=invert?255-value:value}
 const add=(x:number,y:number,e:number)=>{if(x>=0&&x<width&&y>=0&&y<height)lum[y*width+x]+=e};
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){const i=y*width+x,v=lum[i],cut=algorithm==='bayer'?threshold+(bayer[(y%4)*4+(x+phase)%4]-7.5)*12*strength:threshold,light=v>=cut,err=(v-(light?255:0))*strength,color=light?background:foreground,p=i*4;out[p]=color[0];out[p+1]=color[1];out[p+2]=color[2];out[p+3]=255;if(algorithm==='floyd'){add(x+1,y,err*7/16);add(x-1,y+1,err*3/16);add(x,y+1,err*5/16);add(x+1,y+1,err/16)}else if(algorithm==='atkinson'){const e=err/8;add(x+1,y,e);add(x+2,y,e);add(x-1,y+1,e);add(x,y+1,e);add(x+1,y+1,e);add(x,y+2,e)}}return out;
}
export function hexColor(color:string):[number,number,number]{return [1,3,5].map(i=>parseInt(color.slice(i,i+2),16)) as [number,number,number]}

/** Mask edge-connected pixels similar to the top-left pixel; does not mutate input. */
export function backgroundMask(pixels:Uint8ClampedArray,width:number,height:number,tolerance:number):Uint8Array {
 const mask=new Uint8Array(width*height),visited=new Uint8Array(width*height),queue=new Int32Array(width*height);if(!width||!height)return mask;
 const limit=Math.max(0,Math.min(100,tolerance))*Math.sqrt(3)*255/100,ref=[pixels[0],pixels[1],pixels[2]],refAlpha=pixels[3];let head=0,tail=0;
 function add(index:number){if(visited[index])return;visited[index]=1;const p=index*4,a=pixels[p+3];const dist=Math.hypot(pixels[p]-ref[0],pixels[p+1]-ref[1],pixels[p+2]-ref[2]);if((refAlpha===0&&a===0)||(refAlpha>0&&a>0&&dist<=limit)){mask[index]=1;queue[tail++]=index}}
 for(let x=0;x<width;x++){add(x);add((height-1)*width+x)}for(let y=1;y<height-1;y++){add(y*width);add(y*width+width-1)}
 while(head<tail){const i=queue[head++],x=i%width,y=Math.floor(i/width);if(x>0)add(i-1);if(x+1<width)add(i+1);if(y>0)add(i-width);if(y+1<height)add(i+width)}return mask;
}

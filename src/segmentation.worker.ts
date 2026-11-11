/// <reference lib="webworker" />
import * as ort from 'onnxruntime-web/wasm';
import wasmUrl from '../node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm?url';
import mjsUrl from '../node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.mjs?url';
ort.env.wasm.numThreads=1;
ort.env.wasm.wasmPaths={wasm:wasmUrl,mjs:mjsUrl};
self.onmessage=async (event:MessageEvent<{pixels:Uint8ClampedArray;modelUrl:string}>)=>{try{
 const {pixels,modelUrl}=event.data,size=320*320,data=new Float32Array(size*3);let max=0;for(let i=0;i<size;i++)max=Math.max(max,pixels[i*4],pixels[i*4+1],pixels[i*4+2]);const mean=[.485,.456,.406],std=[.229,.224,.225],denominator=max||255;
 for(let i=0;i<size;i++)for(let c=0;c<3;c++)data[c*size+i]=(pixels[4*i+c]/denominator-mean[c])/std[c];
 self.postMessage({status:'processing'});const session=await ort.InferenceSession.create(modelUrl,{executionProviders:['wasm']});const results=await session.run({[session.inputNames[0]]:new ort.Tensor('float32',data,[1,3,320,320])});const raw=results[session.outputNames[0]].data as Float32Array;let min=Infinity,maxValue=-Infinity;for(const value of raw){min=Math.min(min,value);maxValue=Math.max(maxValue,value)}const range=maxValue-min;if(!Number.isFinite(range)||range<1e-8)throw new Error('Could not identify a foreground subject in this image.');const mask=new Uint8ClampedArray(size);for(let i=0;i<size;i++)mask[i]=Math.round(255*(raw[i]-min)/range);self.postMessage({status:'done',mask},[mask.buffer]);await session.release();
 }catch(e){self.postMessage({status:'error',message:e instanceof Error?e.message:'Background removal failed.'})}};

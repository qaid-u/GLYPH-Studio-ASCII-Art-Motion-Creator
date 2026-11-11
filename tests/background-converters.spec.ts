import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
const tools=['one-bit','pink-phosphor','crt','flash-light','receipt','datamosh','blob-tracking'];
async function source(page:import('@playwright/test').Page){return page.evaluate(()=>{const c=document.createElement('canvas');c.width=300;c.height=200;const x=c.getContext('2d')!;x.fillStyle='rgb(110,110,110)';x.fillRect(0,0,300,200);x.fillStyle='rgb(220,30,50)';x.fillRect(90,40,120,120);x.fillStyle='black';x.fillRect(130,80,40,40);return c.toDataURL().split(',')[1]})}
for(const id of tools)test(`${id}: removes background in preview and PNG`,async({page})=>{
  await page.goto(`http://127.0.0.1:5173/#/converter/${id}`);
  await page.locator('.converter-page input[type=file]').setInputFiles({name:'subject.png',mimeType:'image/png',buffer:Buffer.from(await source(page),'base64')});
  const canvas=page.getByLabel('Converted image preview');await expect(canvas).toBeVisible();
  const original=await canvas.evaluate((c:HTMLCanvasElement)=>c.toDataURL());
  await page.locator('.converter-page').getByLabel('Remove image background').check();await page.locator('.converter-page').getByLabel('Removal method').selectOption('color');
  await expect(canvas).toHaveAttribute('data-background-removed','true');await expect.poll(()=>canvas.evaluate((c:HTMLCanvasElement)=>c.toDataURL())).not.toBe(original);
  if(id!=='receipt'){
    const alphas=await canvas.evaluate((c:HTMLCanvasElement)=>{const x=c.getContext('2d')!;return [x.getImageData(5,5,1,1).data[3],x.getImageData(Math.floor(c.width/2),Math.floor(c.height/2),1,1).data[3]]});
    expect(alphas[0]).toBe(0);expect(alphas[1]).toBeGreaterThan(0);
  }
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Export PNG'}).click()]);const png=await readFile((await download.path())!);
  const alpha=await page.evaluate(async b64=>{const image=new Image();image.src='data:image/png;base64,'+b64;await image.decode();const c=document.createElement('canvas');c.width=image.width;c.height=image.height;const x=c.getContext('2d')!;x.drawImage(image,0,0);return [x.getImageData(5,5,1,1).data[3],x.getImageData(Math.floor(c.width/2),Math.floor(c.height/2),1,1).data[3]]},png.toString('base64'));
  if(id==='receipt')expect(alpha[0]).toBe(255);else{expect(alpha[0]).toBe(0);expect(alpha[1]).toBeGreaterThan(0)}
  await page.getByRole('button',{name:'Show original'}).click();await expect(canvas).toHaveAttribute('data-background-removed','false');
  await page.getByRole('button',{name:'Show converted'}).click();await page.locator('.converter-page').getByLabel('Remove image background').uncheck();await expect(canvas).toHaveAttribute('data-background-removed','false');await expect.poll(()=>canvas.evaluate((c:HTMLCanvasElement)=>c.getContext('2d')!.getImageData(5,5,1,1).data[3])).toBe(255);
});
test('subject detection isolates an actual subject in a converter',async({page})=>{
  test.setTimeout(90000);await page.goto('http://127.0.0.1:5173/#/converter/pink-phosphor');await page.locator('.converter-page input[type=file]').setInputFiles('tests/fixtures/astronaut.png');
  await page.locator('.converter-page').getByLabel('Remove image background').check();await expect(page.locator('.converter-page p[role=status]')).toContainText('Subject isolated',{timeout:75000});
  const canvas=page.getByLabel('Converted image preview');await expect(canvas).toHaveAttribute('data-background-removed','true');
  const counts=await canvas.evaluate((c:HTMLCanvasElement)=>{const p=c.getContext('2d')!.getImageData(0,0,c.width,c.height).data;let transparent=0,visible=0;for(let i=3;i<p.length;i+=4){if(p[i]===0)transparent++;if(p[i]>0)visible++}return {transparent,visible}});expect(counts.transparent).toBeGreaterThan(0);expect(counts.visible).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Refine subject mask'}).click();await expect(page.locator('.converter-page').getByLabel('Mask refinement canvas')).toBeVisible();
});
test('animated WebM uses dark backdrop for removed background',async({page})=>{
  test.setTimeout(90000);await page.goto('http://127.0.0.1:5173/#/converter/flash-light');await page.locator('.converter-page input[type=file]').setInputFiles({name:'subject.png',mimeType:'image/png',buffer:Buffer.from(await source(page),'base64')});
  await page.locator('.converter-page').getByLabel('Remove image background').check();await page.locator('.converter-page').getByLabel('Removal method').selectOption('color');await page.locator('.converter-page').getByLabel('Duration').selectOption('3');
  const [download]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Export WebM'}).click()]);const video=await readFile((await download.path())!);expect([...video.subarray(0,4)]).toEqual([26,69,223,163]);
  const rgb=await page.evaluate(async b64=>{const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));const url=URL.createObjectURL(new Blob([bytes],{type:'video/webm'}));try{return await new Promise<number[]>((resolve,reject)=>{const v=document.createElement('video');v.onerror=()=>reject(Error('Could not decode WebM'));v.onloadeddata=()=>{const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;const x=c.getContext('2d')!;x.drawImage(v,0,0);resolve(Array.from(x.getImageData(5,5,1,1).data))};v.src=url})}finally{URL.revokeObjectURL(url)}},video.toString('base64'));
  expect(rgb[0]).toBeLessThan(35);expect(rgb[1]).toBeLessThan(35);expect(rgb[2]).toBeLessThan(45);
});

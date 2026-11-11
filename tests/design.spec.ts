import {test,expect} from '@playwright/test';
test('cyber interface stays usable on desktop and mobile',async({page})=>{
  for(const viewport of [{width:1440,height:900},{width:375,height:812}]){
    await page.setViewportSize(viewport);
    await page.goto('http://127.0.0.1:5173/');
    await expect(page.getByRole('heading',{name:/make images say more/i})).toBeVisible();
    await expect(page.getByRole('link',{name:/explore the tools/i})).toBeVisible();
    await expect(page.locator('.feature-card')).toHaveCount(8);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    await page.getByRole('link',{name:/Image to ASCII/}).click();
    await expect(page.getByRole('button',{name:'Try demo'})).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
    await page.getByRole('link',{name:'Back to all converters'}).click();
    await page.getByRole('link',{name:/Image to One Bit Dither/}).click();
    await expect(page.getByRole('button',{name:'Choose an image'}).first()).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  }
});
test('homepage switches between the original and real ASCII preview',async({page})=>{
  await page.goto('http://127.0.0.1:5173/');
  const controls=page.getByRole('group',{name:'Preview style'});
  const original=page.getByRole('img',{name:/original cyber-inspired illustration/i});
  const ascii=page.getByLabel('ASCII rendering of the illustrated artist');
  await expect(original).toBeVisible();
  await expect(controls.getByRole('button',{name:'ASCII'})).toBeEnabled();
  await controls.getByRole('button',{name:'ASCII'}).click();
  await expect(ascii).toBeVisible();
  await expect(original).toBeHidden();
  const colors=await ascii.evaluate((canvas:HTMLCanvasElement)=>new Set(Array.from(canvas.getContext('2d')!.getImageData(0,0,canvas.width,canvas.height).data).filter((_,i)=>i%4!==3)).size);
  expect(colors).toBeGreaterThan(10);
  await controls.getByRole('button',{name:'Original'}).click();
  await expect(original).toBeVisible();
});

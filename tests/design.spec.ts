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

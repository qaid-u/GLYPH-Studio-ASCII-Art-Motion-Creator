export function validateImage(file:File):string|null {if(!['image/png','image/jpeg','image/webp'].includes(file.type))return 'Choose a PNG, JPEG, or WebP image.';if(file.size>20*1024*1024)return 'Image must be 20 MB or smaller.';return null}
export function validImageDimensions(width:number,height:number):boolean{return width>0&&height>0&&width*height<=40000000}

type MobileToolbarProps={previewId:string;imageId:string;adjustId:string;onExport:()=>void;exportDisabled:boolean};
export function MobileToolbar({previewId,imageId,adjustId,onExport,exportDisabled}:MobileToolbarProps){
  const go=(id:string)=>document.getElementById(id)?.scrollIntoView({block:'start'});
  return <nav className="mobile-tools" aria-label="Mobile editor shortcuts">
    <button type="button" onClick={()=>go(previewId)} aria-label="Go to preview"><span aria-hidden="true">◫</span>Preview</button>
    <button type="button" onClick={()=>go(imageId)} aria-label="Go to image settings"><span aria-hidden="true">⊕</span>Image</button>
    <button type="button" onClick={()=>go(adjustId)} aria-label="Go to adjustments"><span aria-hidden="true">☷</span>Adjust</button>
    <button type="button" onClick={onExport} disabled={exportDisabled} aria-label="Download PNG"><span aria-hidden="true">↓</span>PNG</button>
  </nav>;
}

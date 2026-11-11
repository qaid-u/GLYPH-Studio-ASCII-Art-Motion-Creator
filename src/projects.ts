import type {Settings} from './engine';
import type {Motion} from './animation';
export interface Project {id:string; name:string; updatedAt:number; source:Blob; filename:string; settings:Settings; motion:Motion; removeBackground:boolean; removalMethod:'subject'|'color'; tolerance:number; subjectThreshold:number; transparentPng:boolean; mask:ImageData|null; fps:number; aspect:string; fit:string; filenameOutput:string; pngScale:number; videoSize:number; edgeStrength:number}
function database():Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const request=indexedDB.open('glyph-studio',1);request.onupgradeneeded=()=>request.result.createObjectStore('projects',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
async function access<T>(mode:IDBTransactionMode, operation:(store:IDBObjectStore)=>IDBRequest<T>):Promise<T>{const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction('projects',mode),req=operation(tx.objectStore('projects'));let result:T;req.onsuccess=()=>{result=req.result};tx.oncomplete=()=>{db.close();resolve(result)};tx.onerror=()=>{db.close();reject(tx.error)};tx.onabort=()=>{db.close();reject(tx.error||Error('Storage transaction aborted'))}})}
export const listProjects=()=>access<Project[]>('readonly',s=>s.getAll());
export const saveProject=(project:Project)=>access<IDBValidKey>('readwrite',s=>s.put(project));
export const deleteProject=(id:string)=>access<undefined>('readwrite',s=>s.delete(id));

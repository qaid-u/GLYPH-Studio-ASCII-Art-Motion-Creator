import type {ToolId,ToolSettings} from './engine';
export type ConverterProject={converterType:'image-converter';id:string;type:ToolId;name:string;source:Blob;filename:string;settings:ToolSettings;duration:number;updatedAt:number};
export {allConverterProjects,saveConverterProject,deleteConverterProject} from '../projects';

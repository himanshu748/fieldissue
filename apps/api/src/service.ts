import { createHash } from 'node:crypto';
import { observationAnalysisSchema,comparisonSchema,type CreateIssueInput,type ObservationInput,type PatchIssueInput } from '@fieldissue/shared';
import { IssueRepository } from './repository.js';
import type { IntelligenceProvider,EvidenceInput } from './intelligence.js';
import type { StorageProvider,Media } from './storage.js';
import { AppError } from './errors.js';
export class IssueService {
 constructor(public readonly repository:IssueRepository,private readonly storage:StorageProvider,private readonly intelligence:IntelligenceProvider){}
 private evidence(media:Media,note:string):EvidenceInput{return {image_base64:media.bytes.toString('base64'),mime_type:media.mime,note};}
 async create(input:CreateIssueInput,media:Media,key?:string){
  const hash=createHash('sha256').update(JSON.stringify(input)).update(media.mime).update(media.bytes).digest('hex');
  let cleanupKey:string|undefined;
  try{
   const created=await this.repository.transaction(async c=>{
    if(key){await c.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))',[key]);const existing=(await c.query('SELECT request_hash,issue_id FROM idempotency_keys WHERE key=$1',[key])).rows[0];if(existing){if(existing.request_hash!==hash)throw new AppError('IDEMPOTENCY_CONFLICT',409,'Idempotency key was used for a different request');return {id:existing.issue_id as string,replayed:true};}}
    const analysis=observationAnalysisSchema.parse(await this.intelligence.analyze(this.evidence(media,input.note)));
    const stored=await this.storage.put(media);cleanupKey=stored.storageKey;
    const result=await this.repository.create(input,stored,analysis,undefined,c);
    if(key)await c.query('INSERT INTO idempotency_keys(key,request_hash,issue_id) VALUES($1,$2,$3)',[key,hash,result.id]);return result;
   });cleanupKey=undefined;return {...await this.repository.get(created.id),nearbyIssues:await this.repository.nearby(input.latitude,input.longitude),replayed:created.replayed};
  }catch(error){if(cleanupKey)await this.storage.delete(cleanupKey).catch(()=>{});throw error;}
 }

 async addObservation(id:string,input:ObservationInput,media:Media){await this.repository.get(id);const analysis=observationAnalysisSchema.parse(await this.intelligence.analyze(this.evidence(media,input.note)));const stored=await this.storage.put(media);try{const observation=await this.repository.addObservation(id,input,stored,analysis);return {observation,recommendedStatus:null};}catch(error){await this.storage.delete(stored.storageKey).catch(()=>{});throw error;}}
 async diff(id:string,before:string,after:string){const pair=await this.repository.pair(id,before,after);const beforeMedia=await this.storage.read(pair.before.storage_key),afterMedia=await this.storage.read(pair.after.storage_key);const output=comparisonSchema.parse(await this.intelligence.compare({before:{...this.evidence(beforeMedia,pair.before.note),evidence:pair.before.ai_analysis},after:{...this.evidence(afterMedia,pair.after.note),evidence:pair.after.ai_analysis}}));return this.repository.saveDiff(pair.issueId,before,after,output);}
 async patch(id:string,patch:PatchIssueInput){return this.repository.get(await this.repository.patch(id,patch));}
 async resolve(id:string,note:string){return this.repository.get(await this.repository.patch(id,{status:'RESOLVED'},note));}
 async predict(id:string){const issue=await this.repository.get(id);if(['RESOLVED','REJECTED'].includes(issue.status))throw new AppError('INVALID_PREDICTION_TARGET',409,'Only active issues can be prioritized');const features=await this.repository.features(issue.id);const output=await this.intelligence.predict(features);await this.repository.savePrediction(issue.id,features,output);return output;}
}

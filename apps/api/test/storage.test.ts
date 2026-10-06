import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { LocalStorageProvider, validateImage } from '../src/storage.js';
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6X8sAAAAASUVORK5CYII=','base64');
let directory=''; afterEach(async()=>{if(directory) await rm(directory,{recursive:true,force:true})});
describe('media storage',()=>{
 it('validates image signature, size and unsafe filenames',()=>{
  expect(()=>validateImage({bytes:png,mime:'image/png',filename:'before.png'},1024)).not.toThrow();
  expect(()=>validateImage({bytes:png,mime:'image/jpeg',filename:'before.jpg'},1024)).toThrow();
  expect(()=>validateImage({bytes:png,mime:'image/png',filename:'../before.png'},1024)).toThrow();
  expect(()=>validateImage({bytes:png,mime:'image/png',filename:'before.png'},4)).toThrow();
 });
 it('round trips media with generated keys and rejects traversal',async()=>{
  directory=await mkdtemp(join(tmpdir(),'fieldissue-'));
  const storage=new LocalStorageProvider(directory,'http://localhost:3000/media');
  const result=await storage.put({bytes:png,mime:'image/png',filename:'before.png'});
  expect((await storage.read(result.storageKey)).bytes).toEqual(png);
  expect(result.storageKey).toMatch(/^[a-f0-9-]+\.png$/);
  await expect(storage.read('../secret')).rejects.toThrow();
  await storage.delete(result.storageKey);
  await expect(storage.read(result.storageKey)).rejects.toThrow();
 });
});

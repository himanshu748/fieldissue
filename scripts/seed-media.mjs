#!/usr/bin/env node
// Deterministic, valid PNG placeholders. No photos, provider calls, or generated
// model evidence. Every image visibly says DEMO FIXTURE / NOT A FIELD PHOTO.
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';
import 'dotenv/config';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destination = resolve(root, process.env.LOCAL_STORAGE_PATH || '.media');
const labels = [
  'BROKEN BENCH BEFORE', 'POTHOLE', 'OVERFLOWING LITTER BIN', 'GRAFFITI',
  'DAMAGED DIRECTION SIGN', 'BLOCKED DROPPED KERB', 'STREETLIGHT OUTAGE', 'BENCH REPAIRED AFTER',
];
// A small bitmap font keeps the fixture script dependency-free apart from the
// repository's dotenv reader. Rows encode five pixels, most-significant first.
const font = {
  A:[14,17,17,31,17,17,17], B:[30,17,17,30,17,17,30], C:[14,17,16,16,16,17,14],
  D:[30,17,17,17,17,17,30], E:[31,16,16,30,16,16,31], F:[31,16,16,30,16,16,16],
  G:[14,17,16,23,17,17,15], H:[17,17,17,31,17,17,17], I:[31,4,4,4,4,4,31],
  J:[7,2,2,2,2,18,12], K:[17,18,20,24,20,18,17], L:[16,16,16,16,16,16,31],
  M:[17,27,21,21,17,17,17], N:[17,25,21,19,17,17,17], O:[14,17,17,17,17,17,14],
  P:[30,17,17,30,16,16,16], Q:[14,17,17,17,21,18,13], R:[30,17,17,30,20,18,17],
  S:[15,16,16,14,1,1,30], T:[31,4,4,4,4,4,4], U:[17,17,17,17,17,17,14],
  V:[17,17,17,17,17,10,4], W:[17,17,17,21,21,21,10], X:[17,17,10,4,10,17,17],
  Y:[17,17,10,4,4,4,4], Z:[31,1,2,4,8,16,31], ' ':[0,0,0,0,0,0,0],
};
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(kind, data) {
  const type = Buffer.from(kind), length = Buffer.alloc(4), crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(Buffer.concat([type, data])));
  return Buffer.concat([length, type, data, crc]);
}
function png(label, index) {
  const width = 640, height = 240, pixels = Buffer.alloc(width * height * 3, 244);
  const rectangle = (x, y, w, h, color) => {
    for (let row = y; row < Math.min(y+h,height); row++) {
      for (let col = x; col < Math.min(x+w,width); col++) {
        const offset = (row*width+col)*3;
        color.forEach((value, channel) => { pixels[offset+channel] = value; });
      }
    }
  };
  const text = (value, y, scale, color) => {
    const start = Math.floor((width - value.length*6*scale)/2);
    [...value].forEach((letter, n) => {
      (font[letter] || font[' ']).forEach((row, r) => {
        for (let c = 0; c < 5; c++) if (row & (1 << (4-c))) rectangle(start+n*6*scale+c*scale,y+r*scale,scale,scale,color);
      });
    });
  };
  rectangle(0,0,width,14,[245,158,11]);
  text('DEMO FIXTURE',40,5,[25,38,55]);
  text(label,115,3,[25,38,55]);
  text('NOT A FIELD PHOTO',180,3,[100,55,8]);
  const raw = Buffer.alloc((width*3+1)*height);
  for (let row = 0; row < height; row++) pixels.copy(raw,row*(width*3+1)+1,row*width*3,(row+1)*width*3);
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width,0);header.writeUInt32BE(height,4);header[8]=8;header[9]=2;
  const metadata = Buffer.from(`Description\0Manually authored demo placeholder ${index+1}: ${label}. Not a field photo or model evidence.`);
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('tEXt',metadata),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);
}
await mkdir(destination,{recursive:true,mode:0o700});
for (const [index,label] of labels.entries()) {
  const key = `30000000-0000-4000-8000-${String(index+1).padStart(12,'0')}.png`;
  await writeFile(resolve(destination,key),png(label,index),{mode:0o600});
  console.log(`${key}  ${label}`);
}
console.log(`Wrote ${labels.length} labeled demo PNGs to ${destination}`);

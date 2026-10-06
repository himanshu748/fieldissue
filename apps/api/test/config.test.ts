import { expect,it } from 'vitest';
import { readConfig } from '../src/config.js';
import { observationInputSchema } from '@fieldissue/shared';
it('rejects production mock mode and missing provider secrets',()=>{expect(()=>readConfig({NODE_ENV:'production',AI_MOCK_MODE:'true',DATABASE_URL:'postgresql://localhost/a',INTERNAL_SERVICE_TOKEN:'private-test-token-123'})).toThrow();});
it('rejects missing, blank and whitespace geolocation',()=>{for(const latitude of [undefined,'',' '])expect(observationInputSchema.safeParse({latitude,longitude:77}).success).toBe(false);});

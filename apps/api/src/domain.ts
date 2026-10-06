import type { Status } from '@fieldissue/shared';
const transitions:Record<Status,readonly Status[]>={OPEN:['ACKNOWLEDGED','IN_PROGRESS','RESOLVED','REJECTED'],ACKNOWLEDGED:['IN_PROGRESS','RESOLVED','REJECTED'],IN_PROGRESS:['RESOLVED','REJECTED'],RESOLVED:[],REJECTED:[]};
export function canTransition(from:Status,to:Status){return from===to||transitions[from].includes(to);}

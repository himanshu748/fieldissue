-- Fictional, manually authored development data. These are not real reports,
-- Gemma results, model evaluation, or evidence of actual municipal repairs.
-- IDs and image keys match scripts/seed-media.mjs. Run that script before seed.
-- Relative /media URLs use the real API route independently of host/port.
CREATE TEMP TABLE fieldissue_demo_issues (
  number integer, title text, description text, category issue_category,
  severity issue_severity, status issue_status, latitude double precision,
  longitude double precision, note text, objects jsonb, conditions jsonb
) ON COMMIT DROP;

INSERT INTO fieldissue_demo_issues VALUES
 (1, 'Broken bench beside the park walking loop',
  '[DEMO FIXTURE] Two seat slats were missing and a third had a splintered edge. The fictional follow-up records replaced slats and a manually confirmed resolution.',
  'INFRASTRUCTURE','MEDIUM','RESOLVED',12.9762,77.5929,
  '[DEMO FIXTURE, BEFORE] Bench at the east end of the walking loop has two missing seat slats and a splintered edge. The metal frame remains upright. This note is manually authored; the PNG is a labeled placeholder.',
  '["park bench","seat slats","metal frame"]','["two seat slats missing","splintered seat edge","frame upright"]'),
 (2, 'Pothole in the bicycle lane near a junction',
  '[DEMO FIXTURE] A roughly 50 cm wide pothole lies within the marked bicycle lane. Rainwater obscures its depth and cyclists must move toward traffic.',
  'INFRASTRUCTURE','HIGH','OPEN',12.9731,77.5962,
  '[DEMO FIXTURE] About 50 cm wide pothole in the bicycle lane on the approach to the junction. Standing water obscures the bottom. Nearby lane markings remain visible; depth has not been measured.',
  '["pothole","bicycle lane","standing water"]','["water pooled in pothole","bicycle lane surface broken"]'),
 (3, 'Overflowing litter bin beside a bus shelter',
  '[DEMO FIXTURE] Food wrappers and a tied refuse bag sit around a full bin. The shelter entrance is still passable.',
  'CLEANLINESS','MEDIUM','ACKNOWLEDGED',12.9714,77.5950,
  '[DEMO FIXTURE] Litter bin next to the bus shelter is full. Wrappers and one tied bag are on the pavement around its base. No claim about who left them or any health impact is made.',
  '["litter bin","food wrappers","refuse bag","bus shelter"]','["bin full","loose litter around base"]'),
 (4, 'Graffiti on the low wall along the footpath',
  '[DEMO FIXTURE] Spray-painted marks cover part of a low retaining wall. The footpath and public notices are unobstructed.',
  'ENVIRONMENT','LOW','OPEN',12.9748,77.5907,
  '[DEMO FIXTURE] New spray-painted marks on the low retaining wall along the path. Wall appears intact and the path remains clear. The text and its author are not identified.',
  '["retaining wall","paint marks","footpath"]','["paint marks on wall","footpath clear"]'),
 (5, 'Bent pedestrian direction sign at the park gate',
  '[DEMO FIXTURE] The sign panel is bent and its lower mounting bracket is loose. It is below head height and the arrow is difficult to read.',
  'SIGNAGE','MEDIUM','IN_PROGRESS',12.9753,77.5944,
  '[DEMO FIXTURE] Direction sign at the park gate has a bent panel and one loose lower bracket. The post is upright. The direction arrow is partly folded out of view.',
  '["direction sign","sign post","mounting bracket"]','["panel bent","lower bracket loose","post upright"]'),
 (6, 'Building materials block the dropped-kerb approach',
  '[DEMO FIXTURE] Stacked paving slabs narrow the dropped-kerb approach to about 40 cm. A wheelchair cannot pass along the normal route.',
  'ACCESSIBILITY','HIGH','OPEN',12.9709,77.5973,
  '[DEMO FIXTURE] Paving slabs and two cones occupy the dropped-kerb approach. The remaining gap is approximately 40 cm, estimated on site in this fictional note. No safe alternative route has been checked.',
  '["paving slabs","traffic cones","dropped kerb"]','["approach obstructed","narrow remaining gap"]'),
 (7, 'Streetlight dark along the evening walking route',
  '[DEMO FIXTURE] One lamp was dark at 20:00 while adjacent lamps were lit. No electrical testing or fault diagnosis has been carried out.',
  'LIGHTING','HIGH','ACKNOWLEDGED',12.9780,77.5919,
  '[DEMO FIXTURE] At 20:00 one streetlight beside the walking route was dark while the two neighboring lamps were on. The pole appears upright. This observation does not establish an electrical fault cause.',
  '["streetlight","lamp pole","walking route"]','["lamp dark in evening","neighboring lamps lit","pole upright"]');

INSERT INTO issues(id,public_id,title,description,category,severity,status,latitude,longitude,created_at,updated_at,resolved_at)
SELECT ('10000000-0000-4000-8000-' || lpad(number::text,12,'0'))::uuid,
       'FI-' || (900000+number)::text, title,description,category,severity,status,latitude,longitude,
       '2026-09-28T06:00:00Z'::timestamptz + number * interval '10 minutes',
       CASE WHEN number=1 THEN '2026-09-30T10:05:00Z'::timestamptz
            WHEN status IN ('ACKNOWLEDGED','IN_PROGRESS') THEN '2026-09-28T06:00:00Z'::timestamptz + number * interval '10 minutes' + interval '5 minutes'
            ELSE '2026-09-28T06:00:00Z'::timestamptz + number * interval '10 minutes' END,
       CASE WHEN number=1 THEN '2026-09-30T10:05:00Z'::timestamptz ELSE NULL END
FROM fieldissue_demo_issues
ON CONFLICT(id) DO NOTHING;

INSERT INTO observations(id,issue_id,note,media_url,storage_key,mime_type,latitude,longitude,captured_at,created_at,ai_analysis)
SELECT ('20000000-0000-4000-8000-' || lpad(d.number::text,12,'0'))::uuid,
       i.id,d.note,'/media/30000000-0000-4000-8000-' || lpad(d.number::text,12,'0') || '.png',
       '30000000-0000-4000-8000-' || lpad(d.number::text,12,'0') || '.png','image/png',
       d.latitude,d.longitude,i.created_at,i.created_at,
       jsonb_build_object('objects',d.objects,'conditions',d.conditions,
         'suggestedCategory',d.category,'suggestedSeverity',d.severity,'evidence',d.conditions,
         'confidence',0,'model','seed-fixture','modelVersion','manually-authored-demo-v1')
FROM fieldissue_demo_issues d JOIN issues i ON i.id=('10000000-0000-4000-8000-' || lpad(d.number::text,12,'0'))::uuid
ON CONFLICT(id) DO NOTHING;

INSERT INTO observations(id,issue_id,note,media_url,storage_key,mime_type,latitude,longitude,captured_at,created_at,ai_analysis)
VALUES ('20000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000001',
 '[DEMO FIXTURE, AFTER] Both missing seat slats have been replaced and the splintered edge is absent. The metal frame remains upright. This fictional manual repair note and labeled PNG are not Gemma output or a real inspection.',
 '/media/30000000-0000-4000-8000-000000000008.png','30000000-0000-4000-8000-000000000008.png','image/png',
 12.9762,77.5929,'2026-09-30T10:00:00Z','2026-09-30T10:00:00Z',
 '{"objects":["park bench","seat slats","metal frame"],"conditions":["seat slats intact","frame upright"],"suggestedCategory":"INFRASTRUCTURE","suggestedSeverity":"LOW","evidence":["seat slats intact","splintered edge absent"],"confidence":0,"model":"seed-fixture","modelVersion":"manually-authored-demo-v1"}')
ON CONFLICT(id) DO NOTHING;

INSERT INTO evidence_diffs(id,issue_id,before_observation_id,after_observation_id,summary,removed,added,unchanged,recommended_status,confidence,model,model_version,created_at)
VALUES ('50000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',
 '20000000-0000-4000-8000-000000000001','20000000-0000-4000-8000-000000000008',
 '[DEMO FIXTURE] Manually authored before/after comparison: missing slats and the splintered edge were replaced in the fictional repair narrative. Confidence is zero; this is not model inference. Resolution is a separate manual demo event.',
 '["two seat slats missing","splintered seat edge"]','["seat slats intact"]','["frame upright"]',
 'OPEN',0,'seed-fixture','manually-authored-demo-v1','2026-09-30T10:01:00Z')
ON CONFLICT(id) DO NOTHING;

INSERT INTO issue_events(id,issue_id,event_type,payload,created_at)
SELECT ('40000000-0000-4000-8000-' || lpad(d.number::text,12,'0'))::uuid,i.id,'ISSUE_CREATED',
       jsonb_build_object('source','seed-fixture','note','Fictional manually authored demo issue; initial status OPEN','initialStatus','OPEN','observationId','20000000-0000-4000-8000-' || lpad(d.number::text,12,'0')),
       i.created_at
FROM fieldissue_demo_issues d JOIN issues i ON i.id=('10000000-0000-4000-8000-' || lpad(d.number::text,12,'0'))::uuid
ON CONFLICT(id) DO NOTHING;

INSERT INTO issue_events(id,issue_id,event_type,payload,created_at)
SELECT ('40000000-0000-4000-8000-' || lpad((100+d.number)::text,12,'0'))::uuid,i.id,'STATUS_CHANGED',
       jsonb_build_object('source','seed-fixture','from','OPEN','to',d.status,'note','Manually authored demo status change'),
       i.created_at + interval '5 minutes'
FROM fieldissue_demo_issues d JOIN issues i ON i.id=('10000000-0000-4000-8000-' || lpad(d.number::text,12,'0'))::uuid
WHERE d.status IN ('ACKNOWLEDGED','IN_PROGRESS')
ON CONFLICT(id) DO NOTHING;

INSERT INTO issue_events(id,issue_id,event_type,payload,created_at) VALUES
 ('40000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000001','OBSERVATION_ADDED',
  '{"source":"seed-fixture","observationId":"20000000-0000-4000-8000-000000000008","note":"Fictional manual repair follow-up"}','2026-09-30T10:00:00Z'),
 ('40000000-0000-4000-8000-000000000009','10000000-0000-4000-8000-000000000001','DIFF_GENERATED',
  '{"source":"seed-fixture","diffId":"50000000-0000-4000-8000-000000000001","confidence":0,"model":"seed-fixture","note":"Manually authored fixture, not model inference"}','2026-09-30T10:01:00Z'),
 ('40000000-0000-4000-8000-000000000010','10000000-0000-4000-8000-000000000001','STATUS_CHANGED',
  '{"source":"seed-fixture","from":"OPEN","to":"RESOLVED","note":"Explicit manual demo resolution after the fictional repair"}','2026-09-30T10:05:00Z'),
 ('40000000-0000-4000-8000-000000000011','10000000-0000-4000-8000-000000000001','ISSUE_RESOLVED',
  '{"source":"seed-fixture","note":"Manually marked repaired in this fictional development scenario; no real inspection or Gemma decision"}','2026-09-30T10:05:01Z')
ON CONFLICT(id) DO NOTHING;

-- Avoid colliding with explicitly assigned demo human-readable IDs. Never rewind.
SELECT setval('issue_public_seq',greatest((SELECT last_value FROM issue_public_seq),
  (SELECT max(substring(public_id FROM 4)::bigint) FROM issues WHERE public_id ~ '^FI-[0-9]+$')),true);

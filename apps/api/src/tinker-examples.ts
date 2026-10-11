// Generated from reviewed evaluation evidence by scripts/generate-tinker-examples.mjs.
export const tinkerExamples = {
  recordedAt: "2026-10-11T08:05:39.524451+00:00",
  model: "Qwen/Qwen3-8B",
  modelVersion:
    "tinker://cb2e8a82-058b-574a-a436-a14540bb1f3e:train:1/sampler_weights/fieldissue-v3-lr0.0001-e2",
  evidenceUrl:
    "https://github.com/himanshu748/fieldissue/blob/main/docs/verification/tinker-evaluation-2026-10-11.json",
  summary: [
    {
      slice: "synthetic",
      model: "zero_shot",
      n: 204,
      severityAccuracy: 0.5637254901960784,
      schemaRate: 0.8088235294117647,
      categoryAccuracy: 0.5441176470588235,
      costlyErrorRate: 0.2107843137254902,
      ci95: [0.4950980392156863, 0.6323529411764706],
      macroF1: 0.6129053760179082,
    },
    {
      slice: "synthetic",
      model: "few_shot",
      n: 204,
      severityAccuracy: 0.7794117647058824,
      schemaRate: 1,
      categoryAccuracy: 0.7107843137254902,
      costlyErrorRate: 0.00980392156862745,
      ci95: [0.7254901960784313, 0.8382352941176471],
      macroF1: 0.7620222290276969,
    },
    {
      slice: "synthetic",
      model: "fine_tuned_seed42",
      n: 204,
      severityAccuracy: 0.8725490196078431,
      schemaRate: 1,
      categoryAccuracy: 0.8333333333333334,
      costlyErrorRate: 0,
      ci95: [0.8284313725490197, 0.9166666666666666],
      macroF1: 0.8707408831295388,
    },
    {
      slice: "synthetic",
      model: "fine_tuned_seed1729",
      n: 204,
      severityAccuracy: 0.8774509803921569,
      schemaRate: 0.9901960784313726,
      categoryAccuracy: 0.8431372549019608,
      costlyErrorRate: 0.00980392156862745,
      ci95: [0.8333333333333334, 0.9215686274509803],
      macroF1: 0.880455944108175,
    },
    {
      slice: "public-source",
      model: "zero_shot",
      n: 30,
      severityAccuracy: 0.5333333333333333,
      schemaRate: 0.9333333333333333,
      categoryAccuracy: 0.7333333333333333,
      costlyErrorRate: 0.06666666666666667,
      ci95: [0.36666666666666664, 0.7],
      macroF1: 0.28273809523809523,
    },
    {
      slice: "public-source",
      model: "few_shot",
      n: 30,
      severityAccuracy: 0.5,
      schemaRate: 1,
      categoryAccuracy: 0.8333333333333334,
      costlyErrorRate: 0.03333333333333333,
      ci95: [0.3333333333333333, 0.6666666666666666],
      macroF1: 0.2962962962962963,
    },
    {
      slice: "public-source",
      model: "fine_tuned_seed42",
      n: 30,
      severityAccuracy: 0.7666666666666667,
      schemaRate: 1,
      categoryAccuracy: 0.6666666666666666,
      costlyErrorRate: 0,
      ci95: [0.6, 0.9],
      macroF1: 0.38552631578947366,
    },
    {
      slice: "public-source",
      model: "fine_tuned_seed1729",
      n: 30,
      severityAccuracy: 0.7333333333333333,
      schemaRate: 0.9666666666666667,
      categoryAccuracy: 0.6666666666666666,
      costlyErrorRate: 0.03333333333333333,
      ci95: [0.5666666666666667, 0.8666666666666667],
      macroF1: 0.3904761904761905,
    },
  ],
  samples: [
    {
      id: "v3-test-trail-0-5-0",
      note: "Encountered this on my return: ravine footpath has scattered twigs without making the dirt track harder to walk. Please record the facts.",
      target: {
        category: "TRAIL",
        severity: "LOW",
        object: "ravine_footpath",
        condition: "minor_wear",
        evidence: [
          "ravine footpath has scattered twigs without making the dirt track harder to walk",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "footpath",
        condition: "debris_present",
        evidence: [
          "ravine footpath has scattered twigs without making the dirt track harder to walk",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "ravine_footpath",
        condition: "minor_wear",
        evidence: [
          "ravine footpath has scattered twigs without making the dirt track harder to walk",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "ravine_footpath",
        condition: "minor_wear",
        evidence: [
          "ravine footpath has scattered twigs without making the dirt track harder to walk",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "trail",\n  "object": "dirt_track",\n  "condition": "uneven_surface",\n  "severity": "low",\n  "evidence": [\n    "scattered twigs",\n    "dirt track"\n  ]\n}',
        few_shot:
          '{"category": "TRAIL", "severity": "LOW", "object": "footpath", "condition": "debris_present", "evidence": ["ravine footpath has scattered twigs without making the dirt track harder to walk"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "LOW", "object": "ravine_footpath", "condition": "minor_wear", "evidence": ["ravine footpath has scattered twigs without making the dirt track harder to walk"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "LOW", "object": "ravine_footpath", "condition": "minor_wear", "evidence": ["ravine footpath has scattered twigs without making the dirt track harder to walk"]}',
      },
    },
    {
      id: "v3-test-cleanliness-3-5-2",
      note: "Maintenance desk zara dekho. sarvajanik aangan aag mein ghira hai, visitor isi waqt dhuen se nikal nahi paa raha.",
      target: {
        category: "CLEANLINESS",
        severity: "CRITICAL",
        object: "public_courtyard",
        condition: "immediate_danger",
        evidence: [
          "public courtyard is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "building",
        condition: "smoke",
        severity: "CRITICAL",
        evidence: [
          "sarvajanik aangan aag mein ghira hai",
          "visitor isi waqt dhuen se nikal nahi paa raha",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "public_building",
        condition: "fire_trapped",
        evidence: [
          "public building is surrounded by fire, visitor cannot escape from smoke at this time",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "public_garden",
        condition: "immediate_danger",
        evidence: [
          "public garden is trapped in a fire and a visitor cannot escape the smoke right now",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "public_area",
        condition: "immediate_danger",
        evidence: [
          "public area is trapped in a fire and a visitor cannot escape the smoke right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "building", "condition": "smoke", "severity": "CRITICAL", "evidence": ["sarvajanik aangan aag mein ghira hai", "visitor isi waqt dhuen se nikal nahi paa raha"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "public_building", "condition": "fire_trapped", "evidence": ["public building is surrounded by fire, visitor cannot escape from smoke at this time"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "public_garden", "condition": "immediate_danger", "evidence": ["public garden is trapped in a fire and a visitor cannot escape the smoke right now"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "public_area", "condition": "immediate_danger", "evidence": ["public area is trapped in a fire and a visitor cannot escape the smoke right now"]}',
      },
    },
    {
      id: "v3-test-safety-3-6-0",
      note: "Encountered this on my return: emergency hatch has a person caught inside while an active lethal hazard continues. Please record the facts.",
      target: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "emergency_hatch",
        condition: "immediate_danger",
        evidence: [
          "emergency hatch has a person caught inside while an active lethal hazard continues",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "emergency_hatch",
        condition: "person_caught",
        severity: "CRITICAL",
        evidence: [
          "emergency hatch has a person caught inside",
          "active lethal hazard continues",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "emergency_hatch",
        condition: "immediate_danger",
        evidence: [
          "emergency hatch has a person caught inside while an active lethal hazard continues",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "fire_exit",
        condition: "immediate_danger",
        evidence: [
          "fire exit has a person trapped inside with an active lethal hazard continuing",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "emergency_hatch",
        condition: "immediate_danger",
        evidence: [
          "emergency hatch has a person caught inside while an active lethal hazard continues",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "emergency_hatch", "condition": "person_caught", "severity": "CRITICAL", "evidence": ["emergency hatch has a person caught inside", "active lethal hazard continues"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "emergency_hatch", "condition": "immediate_danger", "evidence": ["emergency hatch has a person caught inside while an active lethal hazard continues"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "fire_exit", "condition": "immediate_danger", "evidence": ["fire exit has a person trapped inside with an active lethal hazard continuing"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "emergency_hatch", "condition": "immediate_danger", "evidence": ["emergency hatch has a person caught inside while an active lethal hazard continues"]}',
      },
    },
    {
      id: "v3-test-safety-1-5-0",
      note: "Maintenance desk, can you look at this? construction shaft needs its outer guard repaired; there are no sparks or other reported hazards.",
      target: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "construction_shaft",
        condition: "maintenance_needed",
        evidence: [
          "construction shaft needs its outer guard repaired; there are no sparks or other reported hazards",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "construction_shaft",
        condition: "damaged",
        severity: "MEDIUM",
        evidence: ["construction shaft needs its outer guard repaired"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "construction_shaft",
        condition: "maintenance_needed",
        evidence: [
          "construction shaft needs its outer guard repaired; no sparks or other reported hazards",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "construction_shaft",
        condition: "maintenance_needed",
        evidence: [
          "construction shaft needs its outer guard repaired; there are no sparks or other reported hazards",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "construction_shaft",
        condition: "maintenance_needed",
        evidence: [
          "construction shaft needs its outer guard repaired; there are no sparks or other reported hazards",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "construction_shaft",\n  "condition": "damaged",\n  "severity": "MEDIUM",\n  "evidence": [\n    "construction shaft needs its outer guard repaired"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "construction_shaft", "condition": "maintenance_needed", "evidence": ["construction shaft needs its outer guard repaired; no sparks or other reported hazards"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "construction_shaft", "condition": "maintenance_needed", "evidence": ["construction shaft needs its outer guard repaired; there are no sparks or other reported hazards"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "construction_shaft", "condition": "maintenance_needed", "evidence": ["construction shaft needs its outer guard repaired; there are no sparks or other reported hazards"]}',
      },
    },
    {
      id: "v3-test-other-0-5-0",
      note: "Encountered this on my return: public timer has a small cosmetic blemish that does not affect its service. Please record the facts.",
      target: {
        category: "OTHER",
        severity: "LOW",
        object: "public_timer",
        condition: "minor_wear",
        evidence: [
          "public timer has a small cosmetic blemish that does not affect its service",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "OTHER",
        object: "public_timer",
        condition: "cosmetic_blemish",
        severity: "LOW",
        evidence: [
          "public timer has a small cosmetic blemish",
          "does not affect its service",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "public_timer",
        condition: "cosmetic_wear",
        evidence: [
          "public timer has a small cosmetic blemish that does not affect its service",
        ],
      },
      fineTunedPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "public_timer",
        condition: "minor_wear",
        evidence: [
          "public timer has a small cosmetic blemish that does not affect its service",
        ],
      },
      secondSeedPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "public_timer",
        condition: "minor_wear",
        evidence: [
          "public timer has a small cosmetic blemish that does not affect its service",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "OTHER",\n  "object": "public_timer",\n  "condition": "cosmetic_blemish",\n  "severity": "LOW",\n  "evidence": [\n    "public timer has a small cosmetic blemish",\n    "does not affect its service"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "public_timer", "condition": "cosmetic_wear", "evidence": ["public timer has a small cosmetic blemish that does not affect its service"]}',
        fine_tuned_seed42:
          '{"category": "OTHER", "severity": "LOW", "object": "public_timer", "condition": "minor_wear", "evidence": ["public timer has a small cosmetic blemish that does not affect its service"]}',
        fine_tuned_seed1729:
          '{"category": "OTHER", "severity": "LOW", "object": "public_timer", "condition": "minor_wear", "evidence": ["public timer has a small cosmetic blemish that does not affect its service"]}',
      },
    },
    {
      id: "v3-test-safety-3-5-1",
      note: "देखभाल कार्यालय, इसे देखें। निर्माण गड्ढा के अंदर व्यक्ति फंसा है और जानलेवा खतरा अभी जारी है।",
      target: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "construction_shaft",
        condition: "immediate_danger",
        evidence: [
          "construction shaft has a person caught inside while an active lethal hazard continues",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "construction_site",
        condition: "person_trapped",
        severity: "CRITICAL",
        evidence: [
          "निर्माण गड्ढा के अंदर व्यक्ति फंसा है",
          "जानलेवा खतरा अभी जारी है",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "construction_cave",
        condition: "immediate_danger",
        evidence: [
          "person is trapped inside construction hole and life-threatening danger is ongoing",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "maintenance_cabinet",
        condition: "immediate_danger",
        evidence: [
          "maintenance cabinet has a construction trench with someone trapped and a continuing danger is ongoing",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "maintenance_office",
        condition: "immediate_danger",
        evidence: [
          "maintenance office has a construction trench with someone trapped and an immediate danger is ongoing",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "construction_site", "condition": "person_trapped", "severity": "CRITICAL", "evidence": ["निर्माण गड्ढा के अंदर व्यक्ति फंसा है", "जानलेवा खतरा अभी जारी है"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "construction_cave", "condition": "immediate_danger", "evidence": ["person is trapped inside construction hole and life-threatening danger is ongoing"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "maintenance_cabinet", "condition": "immediate_danger", "evidence": ["maintenance cabinet has a construction trench with someone trapped and a continuing danger is ongoing"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "maintenance_office", "condition": "immediate_danger", "evidence": ["maintenance office has a construction trench with someone trapped and an immediate danger is ongoing"]}',
      },
    },
    {
      id: "v3-test-trail-2-5-2",
      note: "Vaapas aate hue mila: beehad ki pagdandi par landslip poora hiking route block karta, sabko return karna padta. Facts note karo.",
      target: {
        category: "TRAIL",
        severity: "HIGH",
        object: "ravine_footpath",
        condition: "major_obstruction",
        evidence: [
          "ravine footpath has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "TRAIL",
        object: "hiking_route",
        condition: "blocked",
        severity: "HIGH",
        evidence: [
          "landslide completely blocks hiking route",
          "hikers have to return",
        ],
      },
      fewShotPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "hiking_path",
        condition: "major_obstruction",
        evidence: [
          "landslide completely blocks the hiking route, forcing everyone to return",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "hiking_trail",
        condition: "major_obstruction",
        evidence: [
          "hiking trail has a landslip across its whole route making walkers have to turn back",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "hiking_route",
        condition: "major_obstruction",
        evidence: [
          "hiking route has a landslip across its whole route making it unusable and forcing hikers to return",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "TRAIL", "object": "hiking_route", "condition": "blocked", "severity": "HIGH", "evidence": ["landslide completely blocks hiking route", "hikers have to return"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "HIGH", "object": "hiking_path", "condition": "major_obstruction", "evidence": ["landslide completely blocks the hiking route, forcing everyone to return"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "HIGH", "object": "hiking_trail", "condition": "major_obstruction", "evidence": ["hiking trail has a landslip across its whole route making walkers have to turn back"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "HIGH", "object": "hiking_route", "condition": "major_obstruction", "evidence": ["hiking route has a landslip across its whole route making it unusable and forcing hikers to return"]}',
      },
    },
    {
      id: "v3-test-accessibility-3-5-0",
      note: "Maintenance desk, can you look at this? mobility boardwalk is tipping into a steep drop with a disabled visitor still on it.",
      target: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "mobility_boardwalk",
        condition: "immediate_danger",
        evidence: [
          "mobility boardwalk is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "mobility_boardwalk",
        condition: "immediate_danger",
        evidence: [
          "mobility boardwalk is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "mobility_boardwalk",
        condition: "immediate_danger",
        evidence: [
          "mobility boardwalk is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "mobility_boardwalk",
        condition: "immediate_danger",
        evidence: [
          "mobility boardwalk is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "safety", "object": "mobility_boardwalk", "condition": "tipping", "severity": "critical", "evidence": ["mobility boardwalk is tipping into a steep drop", "disabled visitor still on it"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "CRITICAL", "object": "mobility_boardwalk", "condition": "immediate_danger", "evidence": ["mobility boardwalk is tipping into a steep drop with a disabled visitor still on it"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "CRITICAL", "object": "mobility_boardwalk", "condition": "immediate_danger", "evidence": ["mobility boardwalk is tipping into a steep drop with a disabled visitor still on it"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "CRITICAL", "object": "mobility_boardwalk", "condition": "immediate_danger", "evidence": ["mobility boardwalk is tipping into a steep drop with a disabled visitor still on it"]}',
      },
    },
    {
      id: "v3-test-environment-0-5-2",
      note: "Vaapas aate hue mila: muhane ka kinara ke kuch patte idhar udhar hain, habitat ko nuksaan nahi. Facts note karo.",
      target: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "estuary_edge",
        condition: "minor_wear",
        evidence: [
          "estuary edge has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "ENVIRONMENT",
        object: "tree",
        condition: "branch_drop",
        severity: "LOW",
        evidence: ["patte idhar udhar hain"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "tree_leaves",
        condition: "scattered",
        evidence: [
          "tree leaves are scattered here and there, no damage to habitat",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "wetland_edge",
        condition: "minor_wear",
        evidence: [
          "wetland edge has some loose vegetation; the habitat is not harmed",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "stream_bank",
        condition: "minor_wear",
        evidence: [
          "stream bank has loose loose vegetation; the habitat is not damaged",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ENVIRONMENT", "object": "tree", "condition": "branch_drop", "severity": "LOW", "evidence": ["patte idhar udhar hain"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "tree_leaves", "condition": "scattered", "evidence": ["tree leaves are scattered here and there, no damage to habitat"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "wetland_edge", "condition": "minor_wear", "evidence": ["wetland edge has some loose vegetation; the habitat is not harmed"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "stream_bank", "condition": "minor_wear", "evidence": ["stream bank has loose loose vegetation; the habitat is not damaged"]}',
      },
    },
    {
      id: "v3-test-trail-1-6-2",
      note: "Vaapas aate hue mila: maidan ka kachcha track mein rain se shallow ruts hain, earth path fix chahiye par open hai. Facts note karo.",
      target: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "moorland_track",
        condition: "maintenance_needed",
        evidence: [
          "moorland track has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "track",
        condition: "surface_damage",
        evidence: [
          "track has shallow ruts from rain, earth path needs fixing but is open",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "walking_track",
        condition: "maintenance_needed",
        evidence: [
          "unpaved walking track has shallow ruts from rain needing earth path repair; it remains passable",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "outdoor_track",
        condition: "maintenance_needed",
        evidence: [
          "outdoor track has loose ruts from rain needing earth repair but remains passable; note the facts",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "trail", "object": "track", "condition": "potholes", "severity": "high", "evidence": ["rain se shallow ruts hain", "earth path fix chahiye par open hai"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "track", "condition": "surface_damage", "evidence": ["track has shallow ruts from rain, earth path needs fixing but is open"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "walking_track", "condition": "maintenance_needed", "evidence": ["unpaved walking track has shallow ruts from rain needing earth path repair; it remains passable"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "outdoor_track", "condition": "maintenance_needed", "evidence": ["outdoor track has loose ruts from rain needing earth repair but remains passable; note the facts"]}',
      },
    },
    {
      id: "v3-test-cleanliness-0-6-0",
      note: "Maintenance desk, can you look at this? canal steps has just two wrappers at its foot, away from people's way.",
      target: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "canal_steps",
        condition: "minor_wear",
        evidence: [
          "canal steps has just two wrappers at its foot, away from people's way",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "canal_steps",
        condition: "minor_wear",
        evidence: [
          "canal steps has just two wrappers at its foot, away from people's way",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "canal_steps",
        condition: "minor_wear",
        evidence: [
          "canal steps has just two wrappers at its foot, away from people's way",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "canal_steps",
        condition: "minor_wear",
        evidence: [
          "canal steps has just two wrappers at its foot, away from people's way",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "cleanliness",\n  "object": "waste_bin",\n  "condition": "overflowing",\n  "severity": "low",\n  "evidence": [\n    "two wrappers at its foot",\n    "away from people\'s way"\n  ]\n}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "canal_steps", "condition": "minor_wear", "evidence": ["canal steps has just two wrappers at its foot, away from people\'s way"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "canal_steps", "condition": "minor_wear", "evidence": ["canal steps has just two wrappers at its foot, away from people\'s way"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "canal_steps", "condition": "minor_wear", "evidence": ["canal steps has just two wrappers at its foot, away from people\'s way"]}',
      },
    },
    {
      id: "v3-test-cleanliness-1-5-0",
      note: "Maintenance desk, can you look at this? public courtyard is surrounded by uncollected bags giving off a smell, with clear space to walk.",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "public_courtyard",
        condition: "maintenance_needed",
        evidence: [
          "public courtyard is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_area",
        condition: "uncollected_waste",
        evidence: [
          "public courtyard is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "public_courtyard",
        condition: "maintenance_needed",
        evidence: [
          "public courtyard is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "public_courtyard",
        condition: "maintenance_needed",
        evidence: [
          "public courtyard is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "cleanliness", "object": "waste_bin", "condition": "overflowing", "severity": "medium", "evidence": ["uncollected bags", "giving off a smell"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "public_area", "condition": "uncollected_waste", "evidence": ["public courtyard is surrounded by uncollected bags giving off a smell, with clear space to walk"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "public_courtyard", "condition": "maintenance_needed", "evidence": ["public courtyard is surrounded by uncollected bags giving off a smell, with clear space to walk"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "public_courtyard", "condition": "maintenance_needed", "evidence": ["public courtyard is surrounded by uncollected bags giving off a smell, with clear space to walk"]}',
      },
    },
    {
      id: "v3-test-signage-2-6-1",
      note: "देखभाल कार्यालय, इसे देखें। वैकल्पिक मार्ग पट्ट गलत मोड़ से खतरनाक निर्माण क्षेत्र भेजता है।",
      target: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "detour_panel",
        condition: "major_obstruction",
        evidence: [
          "detour panel gives the wrong diversion into a hazardous works area",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "road",
        condition: "dangerous_turn",
        severity: "HIGH",
        evidence: [
          "वैकल्पिक मार्ग पट्ट गलत मोड़ से खतरनाक निर्माण क्षेत्र भेजता है",
        ],
      },
      fewShotPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "alternative_path",
        condition: "hazardous_construction",
        evidence: [
          "alternative path sends to dangerous construction area from wrong turn",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "maintenance_office",
        condition: "major_obstruction",
        evidence: [
          "maintenance office has a dangerous construction site being sent off a misdirected alternative route",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "maintenance_office",
        condition: "major_obstruction",
        evidence: [
          "maintenance office has an unsafe construction site that misdirects an alternative route",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "road", "condition": "dangerous_turn", "severity": "HIGH", "evidence": ["वैकल्पिक मार्ग पट्ट गलत मोड़ से खतरनाक निर्माण क्षेत्र भेजता है"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "HIGH", "object": "alternative_path", "condition": "hazardous_construction", "evidence": ["alternative path sends to dangerous construction area from wrong turn"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "maintenance_office", "condition": "major_obstruction", "evidence": ["maintenance office has a dangerous construction site being sent off a misdirected alternative route"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "maintenance_office", "condition": "major_obstruction", "evidence": ["maintenance office has an unsafe construction site that misdirects an alternative route"]}',
      },
    },
    {
      id: "v3-test-accessibility-3-6-2",
      note: "Vaapas aate hue mila: sugam underpass steep drop ki taraf palat raha, disabled visitor abhi us par hai. Facts note karo.",
      target: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "accessible_underpass",
        condition: "immediate_danger",
        evidence: [
          "accessible underpass is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "underpass",
        condition: "steep_drop",
        severity: "HIGH",
        evidence: [
          "sugam underpass steep drop ki taraf palat raha",
          "disabled visitor abhi us par hai",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "underpass",
        condition: "steep_drop",
        evidence: [
          "underpass has a steep drop towards the side, disabled visitor is currently there",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_underpass",
        condition: "major_obstruction",
        evidence: [
          "accessible underpass turns sharply toward a steep drop with a disabled visitor on it right now",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "accessible_underpass",
        condition: "immediate_danger",
        evidence: [
          "accessible underpass has a sudden steep drop toward the edge and a disabled visitor is on it right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "ACCESSIBILITY",\n  "object": "underpass",\n  "condition": "steep_drop",\n  "severity": "HIGH",\n  "evidence": [\n    "sugam underpass steep drop ki taraf palat raha",\n    "disabled visitor abhi us par hai"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "underpass", "condition": "steep_drop", "evidence": ["underpass has a steep drop towards the side, disabled visitor is currently there"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_underpass", "condition": "major_obstruction", "evidence": ["accessible underpass turns sharply toward a steep drop with a disabled visitor on it right now"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "CRITICAL", "object": "accessible_underpass", "condition": "immediate_danger", "evidence": ["accessible underpass has a sudden steep drop toward the edge and a disabled visitor is on it right now"]}',
      },
    },
    {
      id: "v3-test-safety-1-6-1",
      note: "वापसी पर यह मिला: आपात दरवाजा के बाहरी रक्षक की मरम्मत चाहिए; चिंगारी या दूसरा खतरा नहीं बताया। तथ्य दर्ज करें।",
      target: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "emergency_hatch",
        condition: "maintenance_needed",
        evidence: [
          "emergency hatch needs its outer guard repaired; there are no sparks or other reported hazards",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "emergency_door",
        condition: "repair_required",
        severity: "HIGH",
        evidence: ["आपात दरवाजा के बाहरी रक्षक की मरम्मत चाहिए"],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "emergency_door",
        condition: "maintenance_needed",
        evidence: [
          "emergency door external guardian needs repair; no fire or other danger is stated",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "fire_exit",
        condition: "maintenance_needed",
        evidence: [
          "fire exit has a faulty protective casing; no fire or other danger is reported",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "fire_exit",
        condition: "maintenance_needed",
        evidence: [
          "fire exit has a faulty protective casing; no fire or other danger is reported",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "emergency_door", "condition": "repair_required", "severity": "HIGH", "evidence": ["आपात दरवाजा के बाहरी रक्षक की मरम्मत चाहिए"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "emergency_door", "condition": "maintenance_needed", "evidence": ["emergency door external guardian needs repair; no fire or other danger is stated"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "fire_exit", "condition": "maintenance_needed", "evidence": ["fire exit has a faulty protective casing; no fire or other danger is reported"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "fire_exit", "condition": "maintenance_needed", "evidence": ["fire exit has a faulty protective casing; no fire or other danger is reported"]}',
      },
    },
    {
      id: "v3-test-accessibility-0-6-1",
      note: "देखभाल कार्यालय, इसे देखें। सुगम भूमिगत मार्ग का लेप घिसा है, चलने के सहायक साधन बिना दिक्कत निकलते हैं।",
      target: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "accessible_underpass",
        condition: "minor_wear",
        evidence: [
          "accessible underpass has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "walkway",
        condition: "damaged_surface",
        severity: "HIGH",
        evidence: [
          "सुगम भूमिगत मार्ग का लेप घिसा है",
          "चलने के सहायक साधन बिना दिक्कत निकलते हैं",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "tactile_path",
        condition: "minor_wear",
        evidence: [
          "tactile path is worn out, walking aids exit without difficulty",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "accessible_path",
        condition: "minor_wear",
        evidence: [
          "accessible path has a worn surface; its usable route remains available",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "accessible_underground_path",
        condition: "minor_wear",
        evidence: [
          "accessible underground path has a worn surface; no walkers are obstructed",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "walkway", "condition": "damaged_surface", "severity": "HIGH", "evidence": ["सुगम भूमिगत मार्ग का लेप घिसा है", "चलने के सहायक साधन बिना दिक्कत निकलते हैं"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "tactile_path", "condition": "minor_wear", "evidence": ["tactile path is worn out, walking aids exit without difficulty"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "accessible_path", "condition": "minor_wear", "evidence": ["accessible path has a worn surface; its usable route remains available"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "accessible_underground_path", "condition": "minor_wear", "evidence": ["accessible underground path has a worn surface; no walkers are obstructed"]}',
      },
    },
    {
      id: "v3-test-infrastructure-3-5-1",
      note: "देखभाल कार्यालय, इसे देखें। पैदल मंच बिखर रहा है और पैदल यात्री अभी खाली हिस्से में गिर रहे हैं।",
      target: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "pedestrian_platform",
        condition: "immediate_danger",
        evidence: [
          "pedestrian platform is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "footpath",
        condition: "broken",
        severity: "HIGH",
        evidence: [
          "footpath is broken",
          "pedestrians are falling into empty spaces",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "pedestrian_bridge",
        condition: "structural_damage",
        evidence: [
          "pedestrian bridge is collapsing and pedestrians are falling into empty sections",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "stair",
        condition: "immediate_danger",
        evidence: [
          "stair has a loose platform and walkers are falling off the exposed edge now",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "stair",
        condition: "immediate_danger",
        evidence: [
          "stair has structural failure and walkers are falling off it right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "footpath", "condition": "broken", "severity": "HIGH", "evidence": ["footpath is broken", "pedestrians are falling into empty spaces"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "pedestrian_bridge", "condition": "structural_damage", "evidence": ["pedestrian bridge is collapsing and pedestrians are falling into empty sections"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "stair", "condition": "immediate_danger", "evidence": ["stair has a loose platform and walkers are falling off the exposed edge now"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "stair", "condition": "immediate_danger", "evidence": ["stair has structural failure and walkers are falling off it right now"]}',
      },
    },
    {
      id: "v3-test-signage-0-6-2",
      note: "Maintenance desk zara dekho. doosre raste ka panel ke corner par scratch hai, har direction samajh aati hai.",
      target: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "detour_panel",
        condition: "minor_wear",
        evidence: [
          "detour panel has a scratched corner; every direction can still be understood",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "panel",
        condition: "scratch",
        severity: "LOW",
        evidence: ["scratch hai", "har direction samajh aati hai"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "sign_board",
        condition: "minor_damage",
        evidence: [
          "sign board has a scratch at the corner, but is understood from all directions",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "exit_sign",
        condition: "maintenance_needed",
        evidence: [
          "exit sign has a corner scratch; its message is still visible in all directions",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "direction_sign",
        condition: "maintenance_needed",
        evidence: [
          "direction sign has a corner scratch; its message is still visible in all directions",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "panel", "condition": "scratch", "severity": "LOW", "evidence": ["scratch hai", "har direction samajh aati hai"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "sign_board", "condition": "minor_damage", "evidence": ["sign board has a scratch at the corner, but is understood from all directions"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "exit_sign", "condition": "maintenance_needed", "evidence": ["exit sign has a corner scratch; its message is still visible in all directions"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "direction_sign", "condition": "maintenance_needed", "evidence": ["direction sign has a corner scratch; its message is still visible in all directions"]}',
      },
    },
    {
      id: "v3-test-other-1-5-1",
      note: "देखभाल कार्यालय, इसे देखें। सार्वजनिक टाइमर आगंतुकों के लिए काम नहीं करता; सेवा चाहिए, खतरा नहीं बताया गया।",
      target: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "public_timer",
        condition: "maintenance_needed",
        evidence: [
          "public timer no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "public_timer",
        condition: "malfunctioning",
        severity: "MEDIUM",
        evidence: ["सार्वजनिक टाइमर आगंतुकों के लिए काम नहीं करता"],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "public_timer",
        condition: "maintenance_needed",
        evidence: [
          "public timer is not working for visitors; service is required, no danger is stated",
        ],
      },
      fineTunedPrediction: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "maintenance_office",
        condition: "maintenance_needed",
        evidence: [
          "maintenance office has a public timer that no longer works; service is needed but no danger is stated",
        ],
      },
      secondSeedPrediction: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "maintenance_office",
        condition: "maintenance_needed",
        evidence: [
          "maintenance office has a public timer that no longer works; service is needed, no danger is stated",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "public_timer", "condition": "malfunctioning", "severity": "MEDIUM", "evidence": ["सार्वजनिक टाइमर आगंतुकों के लिए काम नहीं करता"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "public_timer", "condition": "maintenance_needed", "evidence": ["public timer is not working for visitors; service is required, no danger is stated"]}',
        fine_tuned_seed42:
          '{"category": "OTHER", "severity": "MEDIUM", "object": "maintenance_office", "condition": "maintenance_needed", "evidence": ["maintenance office has a public timer that no longer works; service is needed but no danger is stated"]}',
        fine_tuned_seed1729:
          '{"category": "OTHER", "severity": "MEDIUM", "object": "maintenance_office", "condition": "maintenance_needed", "evidence": ["maintenance office has a public timer that no longer works; service is needed, no danger is stated"]}',
      },
    },
    {
      id: "v3-test-lighting-1-5-0",
      note: "Maintenance desk, can you look at this? quayside beacon stays unlit after dusk; repair is needed but no dangerous consequence is described.",
      target: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "quayside_beacon",
        condition: "maintenance_needed",
        evidence: [
          "quayside beacon stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "beacon",
        condition: "unlit",
        severity: "MEDIUM",
        evidence: [
          "quayside beacon stays unlit after dusk",
          "repair is needed",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "beacon",
        condition: "maintenance_needed",
        evidence: [
          "quayside beacon stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "quayside_beacon",
        condition: "maintenance_needed",
        evidence: [
          "quayside beacon stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "quayside_beacon",
        condition: "maintenance_needed",
        evidence: [
          "quayside beacon stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "beacon", "condition": "unlit", "severity": "MEDIUM", "evidence": ["quayside beacon stays unlit after dusk", "repair is needed"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "beacon", "condition": "maintenance_needed", "evidence": ["quayside beacon stays unlit after dusk; repair is needed but no dangerous consequence is described"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "quayside_beacon", "condition": "maintenance_needed", "evidence": ["quayside beacon stays unlit after dusk; repair is needed but no dangerous consequence is described"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "quayside_beacon", "condition": "maintenance_needed", "evidence": ["quayside beacon stays unlit after dusk; repair is needed but no dangerous consequence is described"]}',
      },
    },
    {
      id: "v3-test-cleanliness-3-6-0",
      note: "Encountered this on my return: canal steps is engulfed in flames and a visitor cannot escape the smoke at this moment. Please record the facts.",
      target: {
        category: "CLEANLINESS",
        severity: "CRITICAL",
        object: "canal_steps",
        condition: "immediate_danger",
        evidence: [
          "canal steps is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "canal_steps",
        condition: "fire",
        severity: "CRITICAL",
        evidence: [
          "canal steps is engulfed in flames",
          "visitor cannot escape the smoke",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "canal_steps",
        condition: "fire",
        evidence: [
          "canal steps is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "canal_steps",
        condition: "immediate_danger",
        evidence: [
          "canal steps is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "canal_steps",
        condition: "immediate_danger",
        evidence: [
          "canal steps is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "canal_steps",\n  "condition": "fire",\n  "severity": "CRITICAL",\n  "evidence": [\n    "canal steps is engulfed in flames",\n    "visitor cannot escape the smoke"\n  ]\n}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "canal_steps", "condition": "fire", "evidence": ["canal steps is engulfed in flames and a visitor cannot escape the smoke at this moment"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "canal_steps", "condition": "immediate_danger", "evidence": ["canal steps is engulfed in flames and a visitor cannot escape the smoke at this moment"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "canal_steps", "condition": "immediate_danger", "evidence": ["canal steps is engulfed in flames and a visitor cannot escape the smoke at this moment"]}',
      },
    },
    {
      id: "v3-test-environment-0-6-1",
      note: "देखभाल कार्यालय, इसे देखें। वन क्षेत्र के कुछ पत्ते अस्तव्यस्त हैं, आसपास के आवास को नुकसान नहीं।",
      target: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "woodland",
        condition: "minor_wear",
        evidence: [
          "woodland has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "tree",
        condition: "overgrown",
        severity: "LOW",
        evidence: ["कुछ पत्ते अस्तव्यस्त हैं"],
      },
      fewShotPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "tree_leaves",
        condition: "disorderly",
        evidence: [
          "some tree leaves are scattered, no damage to surrounding residences",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "forest_area",
        condition: "minor_wear",
        evidence: [
          "forest area has some loose leaves; no nearby dwellings are damaged",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "forest_area",
        condition: "minor_wear",
        evidence: [
          "forest area has some loose leaves; no nearby dwellings are damaged",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "tree", "condition": "overgrown", "severity": "LOW", "evidence": ["कुछ पत्ते अस्तव्यस्त हैं"]}',
        few_shot:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "tree_leaves", "condition": "disorderly", "evidence": ["some tree leaves are scattered, no damage to surrounding residences"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "forest_area", "condition": "minor_wear", "evidence": ["forest area has some loose leaves; no nearby dwellings are damaged"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "forest_area", "condition": "minor_wear", "evidence": ["forest area has some loose leaves; no nearby dwellings are damaged"]}',
      },
    },
    {
      id: "v3-test-trail-0-6-0",
      note: "Maintenance desk, can you look at this? moorland track has scattered twigs without making the dirt track harder to walk.",
      target: {
        category: "TRAIL",
        severity: "LOW",
        object: "moorland_track",
        condition: "minor_wear",
        evidence: [
          "moorland track has scattered twigs without making the dirt track harder to walk",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "trail",
        condition: "minor_obstruction",
        evidence: [
          "moorland track has scattered twigs without making the dirt track harder to walk",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "moorland_track",
        condition: "minor_wear",
        evidence: [
          "moorland track has scattered twigs without making the dirt track harder to walk",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "moorland_track",
        condition: "minor_wear",
        evidence: [
          "moorland track has scattered twigs without making the dirt track harder to walk",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "trail",\n  "object": "track",\n  "condition": "obstructed",\n  "severity": "low",\n  "evidence": [\n    "scattered twigs",\n    "dirt track harder to walk"\n  ]\n}',
        few_shot:
          '{"category": "TRAIL", "severity": "LOW", "object": "trail", "condition": "minor_obstruction", "evidence": ["moorland track has scattered twigs without making the dirt track harder to walk"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "LOW", "object": "moorland_track", "condition": "minor_wear", "evidence": ["moorland track has scattered twigs without making the dirt track harder to walk"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "LOW", "object": "moorland_track", "condition": "minor_wear", "evidence": ["moorland track has scattered twigs without making the dirt track harder to walk"]}',
      },
    },
    {
      id: "v3-test-signage-1-6-0",
      note: "Encountered this on my return: detour panel has lost its text, leaving visitors without the posted directions. Please record the facts.",
      target: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "detour_panel",
        condition: "maintenance_needed",
        evidence: [
          "detour panel has lost its text, leaving visitors without the posted directions",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "detour_panel",
        condition: "missing_text",
        severity: "HIGH",
        evidence: [
          "detour panel has lost its text",
          "visitors without the posted directions",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "detour_sign",
        condition: "missing_text",
        evidence: [
          "detour panel has lost its text, leaving visitors without the posted directions",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "direction_board",
        condition: "maintenance_needed",
        evidence: [
          "direction board has lost its text, leaving visitors without the posted directions",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "direction_sign",
        condition: "maintenance_needed",
        evidence: [
          "direction sign has lost its text, leaving visitors without the posted directions",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "detour_panel",\n  "condition": "missing_text",\n  "severity": "HIGH",\n  "evidence": [\n    "detour panel has lost its text",\n    "visitors without the posted directions"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "detour_sign", "condition": "missing_text", "evidence": ["detour panel has lost its text, leaving visitors without the posted directions"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "direction_board", "condition": "maintenance_needed", "evidence": ["direction board has lost its text, leaving visitors without the posted directions"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "direction_sign", "condition": "maintenance_needed", "evidence": ["direction sign has lost its text, leaving visitors without the posted directions"]}',
      },
    },
    {
      id: "v3-test-accessibility-0-6-2",
      note: "Maintenance desk zara dekho. sugam underpass ki coating ghisi hai, mobility aids bina dikkat nikalte hain.",
      target: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "accessible_underpass",
        condition: "minor_wear",
        evidence: [
          "accessible underpass has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "underpass",
        condition: "coating_missing",
        severity: "MEDIUM",
        evidence: [
          "coating ghisi hai",
          "mobility aids bina dikkat nikalte hain",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "underpass",
        condition: "surface_condition",
        evidence: [
          "sugam underpass coating is damaged, mobility aids can pass without difficulty",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_underpass",
        condition: "maintenance_needed",
        evidence: [
          "accessible underpass has a worn coating; mobility aids pass without difficulty",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_underpass",
        condition: "maintenance_needed",
        evidence: [
          "accessible underpass has a worn coating; mobility aids pass without difficulty",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "underpass", "condition": "coating_missing", "severity": "MEDIUM", "evidence": ["coating ghisi hai", "mobility aids bina dikkat nikalte hain"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "underpass", "condition": "surface_condition", "evidence": ["sugam underpass coating is damaged, mobility aids can pass without difficulty"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "accessible_underpass", "condition": "maintenance_needed", "evidence": ["accessible underpass has a worn coating; mobility aids pass without difficulty"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "accessible_underpass", "condition": "maintenance_needed", "evidence": ["accessible underpass has a worn coating; mobility aids pass without difficulty"]}',
      },
    },
    {
      id: "v3-test-environment-3-6-0",
      note: "Encountered this on my return: woodland is being swept away in a flash flood carrying people with it. Please record the facts.",
      target: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "woodland",
        condition: "immediate_danger",
        evidence: [
          "woodland is being swept away in a flash flood carrying people with it",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "woodland",
        condition: "immediate_danger",
        evidence: [
          "woodland is being swept away in a flash flood carrying people with it",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "woodland",
        condition: "immediate_danger",
        evidence: [
          "woodland is being swept away in a flash flood carrying people with it",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "woodland",
        condition: "immediate_danger",
        evidence: [
          "woodland is being swept away in a flash flood carrying people with it",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "safety",\n  "object": "unknown",\n  "condition": "unspecified",\n  "severity": "critical",\n  "evidence": [\n    "woodland is being swept away in a flash flood",\n    "carrying people with it"\n  ]\n}',
        few_shot:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "woodland", "condition": "immediate_danger", "evidence": ["woodland is being swept away in a flash flood carrying people with it"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "woodland", "condition": "immediate_danger", "evidence": ["woodland is being swept away in a flash flood carrying people with it"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "woodland", "condition": "immediate_danger", "evidence": ["woodland is being swept away in a flash flood carrying people with it"]}',
      },
    },
    {
      id: "v3-test-safety-2-6-2",
      note: "Maintenance desk zara dekho. aapat darwaza ka barrier hat gaya, passerby ko serious fall ka risk hai.",
      target: {
        category: "SAFETY",
        severity: "HIGH",
        object: "emergency_hatch",
        condition: "major_obstruction",
        evidence: [
          "emergency hatch has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "barrier",
        condition: "missing",
        severity: "HIGH",
        evidence: [
          "aapat darwaza ka barrier hat gaya",
          "passerby ko serious fall ka risk hai",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "emergency_exit",
        condition: "obstruction",
        evidence: [
          "barrier at emergency exit has fallen, passerby is at risk of serious fall",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fire_exit",
        condition: "major_obstruction",
        evidence: [
          "fire exit has a fallen obstruction that puts passersby at serious falling danger",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fire_exit",
        condition: "major_obstruction",
        evidence: [
          "fire exit has a fallen obstruction that puts passersby at serious falling danger",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "barrier", "condition": "missing", "severity": "HIGH", "evidence": ["aapat darwaza ka barrier hat gaya", "passerby ko serious fall ka risk hai"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "emergency_exit", "condition": "obstruction", "evidence": ["barrier at emergency exit has fallen, passerby is at risk of serious fall"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "HIGH", "object": "fire_exit", "condition": "major_obstruction", "evidence": ["fire exit has a fallen obstruction that puts passersby at serious falling danger"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "HIGH", "object": "fire_exit", "condition": "major_obstruction", "evidence": ["fire exit has a fallen obstruction that puts passersby at serious falling danger"]}',
      },
    },
    {
      id: "v3-test-lighting-3-6-0",
      note: "Encountered this on my return: subway illumination failed as a child stepped over an invisible edge and is falling now. Please record the facts.",
      target: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "subway_illumination",
        condition: "immediate_danger",
        evidence: [
          "subway illumination failed as a child stepped over an invisible edge and is falling now",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "subway_light",
        condition: "immediate_danger",
        evidence: [
          "subway illumination failed as a child stepped over an invisible edge and is falling now",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "subway_lamp",
        condition: "immediate_danger",
        evidence: [
          "subway illumination failed as a child stepped over an invisible edge and is falling now",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "subway_light",
        condition: "immediate_danger",
        evidence: [
          "subway illumination failed as a child stepped over an invisible edge and is falling now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "safety", "object": "subway", "condition": "inadequate_lighting", "severity": "critical", "evidence": ["subway illumination failed", "child stepped over an invisible edge", "falling now"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "subway_light", "condition": "immediate_danger", "evidence": ["subway illumination failed as a child stepped over an invisible edge and is falling now"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "subway_lamp", "condition": "immediate_danger", "evidence": ["subway illumination failed as a child stepped over an invisible edge and is falling now"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "subway_light", "condition": "immediate_danger", "evidence": ["subway illumination failed as a child stepped over an invisible edge and is falling now"]}',
      },
    },
    {
      id: "v3-test-lighting-1-5-1",
      note: "देखभाल कार्यालय, इसे देखें। घाट की रोशनी शाम के बाद नहीं जलता; सुधार चाहिए पर खतरनाक परिणाम नहीं बताया।",
      target: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "quayside_beacon",
        condition: "maintenance_needed",
        evidence: [
          "quayside beacon stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "lamp",
        condition: "not functioning",
        severity: "LOW",
        evidence: ["घाट की रोशनी शाम के बाद नहीं जलता"],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "street_light",
        condition: "maintenance_needed",
        evidence: [
          "street light does not work after evening; repair is needed but no dangerous consequences are stated",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "stair_light",
        condition: "maintenance_needed",
        evidence: [
          "stair light does not illuminate after dusk and needs repair without a stated hazardous consequence",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "stair_light",
        condition: "maintenance_needed",
        evidence: [
          "stair light does not illuminate after dusk and needs repair without a stated hazardous consequence",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "lamp", "condition": "not functioning", "severity": "LOW", "evidence": ["घाट की रोशनी शाम के बाद नहीं जलता"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "street_light", "condition": "maintenance_needed", "evidence": ["street light does not work after evening; repair is needed but no dangerous consequences are stated"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "stair_light", "condition": "maintenance_needed", "evidence": ["stair light does not illuminate after dusk and needs repair without a stated hazardous consequence"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "stair_light", "condition": "maintenance_needed", "evidence": ["stair light does not illuminate after dusk and needs repair without a stated hazardous consequence"]}',
      },
    },
    {
      id: "v3-test-trail-3-5-2",
      note: "Maintenance desk zara dekho. beehad ki pagdandi cliff se crumble ho raha, walkers ka group usi section par hai.",
      target: {
        category: "TRAIL",
        severity: "CRITICAL",
        object: "ravine_footpath",
        condition: "immediate_danger",
        evidence: [
          "ravine footpath is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "cliff",
        condition: "crumbling",
        severity: "HIGH",
        evidence: [
          "cliff se crumble ho raha",
          "walkers ka group usi section par hai",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "slope",
        condition: "unstable",
        evidence: [
          "slope is crumbling from the cliff, walker group is on that section",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "cliff_edge",
        condition: "major_obstruction",
        evidence: [
          "cliff edge has a crumbling edge with walkers using the same section",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "maintenance_desk",
        condition: "immediate_danger",
        evidence: [
          "maintenance desk needs urgent inspection; a major structural failure is crumbling off a cliff and walkers are using that section right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "cliff", "condition": "crumbling", "severity": "HIGH", "evidence": ["cliff se crumble ho raha", "walkers ka group usi section par hai"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "slope", "condition": "unstable", "evidence": ["slope is crumbling from the cliff, walker group is on that section"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "cliff_edge", "condition": "major_obstruction", "evidence": ["cliff edge has a crumbling edge with walkers using the same section"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "maintenance_desk", "condition": "immediate_danger", "evidence": ["maintenance desk needs urgent inspection; a major structural failure is crumbling off a cliff and walkers are using that section right now"]}',
      },
    },
    {
      id: "v3-test-other-0-6-0",
      note: "Maintenance desk, can you look at this? queue display has a small cosmetic blemish that does not affect its service.",
      target: {
        category: "OTHER",
        severity: "LOW",
        object: "queue_display",
        condition: "minor_wear",
        evidence: [
          "queue display has a small cosmetic blemish that does not affect its service",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "OTHER",
        object: "queue_display",
        condition: "cosmetic_blemish",
        severity: "LOW",
        evidence: ["small cosmetic blemish", "does not affect its service"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "queue_display",
        condition: "cosmetic_wear",
        evidence: [
          "queue display has a small cosmetic blemish that does not affect its service",
        ],
      },
      fineTunedPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "queue_display",
        condition: "minor_wear",
        evidence: [
          "queue display has a small cosmetic blemish that does not affect its service",
        ],
      },
      secondSeedPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "queue_display",
        condition: "minor_wear",
        evidence: [
          "queue display has a small cosmetic blemish that does not affect its service",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "OTHER", "object": "queue_display", "condition": "cosmetic_blemish", "severity": "LOW", "evidence": ["small cosmetic blemish", "does not affect its service"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "queue_display", "condition": "cosmetic_wear", "evidence": ["queue display has a small cosmetic blemish that does not affect its service"]}',
        fine_tuned_seed42:
          '{"category": "OTHER", "severity": "LOW", "object": "queue_display", "condition": "minor_wear", "evidence": ["queue display has a small cosmetic blemish that does not affect its service"]}',
        fine_tuned_seed1729:
          '{"category": "OTHER", "severity": "LOW", "object": "queue_display", "condition": "minor_wear", "evidence": ["queue display has a small cosmetic blemish that does not affect its service"]}',
      },
    },
    {
      id: "v3-test-accessibility-1-5-0",
      note: "Maintenance desk, can you look at this? mobility boardwalk has uneven patches that need smoothing; a chair can still get through.",
      target: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "mobility_boardwalk",
        condition: "maintenance_needed",
        evidence: [
          "mobility boardwalk has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "mobility_boardwalk",
        condition: "uneven_surface",
        evidence: [
          "mobility boardwalk has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "mobility_boardwalk",
        condition: "maintenance_needed",
        evidence: [
          "mobility boardwalk has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "mobility_boardwalk",
        condition: "maintenance_needed",
        evidence: [
          "mobility boardwalk has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "accessibility",\n  "object": "boardwalk",\n  "condition": "uneven",\n  "severity": "medium",\n  "evidence": [\n    "mobility boardwalk has uneven patches",\n    "a chair can still get through"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "mobility_boardwalk", "condition": "uneven_surface", "evidence": ["mobility boardwalk has uneven patches that need smoothing; a chair can still get through"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "mobility_boardwalk", "condition": "maintenance_needed", "evidence": ["mobility boardwalk has uneven patches that need smoothing; a chair can still get through"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "mobility_boardwalk", "condition": "maintenance_needed", "evidence": ["mobility boardwalk has uneven patches that need smoothing; a chair can still get through"]}',
      },
    },
    {
      id: "v3-test-signage-3-5-0",
      note: "Maintenance desk, can you look at this? evacuation marker sends a crowd into a burning passage they are entering at this instant.",
      target: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "evacuation_marker",
        condition: "immediate_danger",
        evidence: [
          "evacuation marker sends a crowd into a burning passage they are entering at this instant",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "evacuation_marker",
        condition: "misleading",
        severity: "CRITICAL",
        evidence: [
          "evacuation marker sends a crowd into a burning passage",
          "they are entering at this instant",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "evacuation_sign",
        condition: "immediate_danger",
        evidence: [
          "evacuation marker sends a crowd into a burning passage they are entering at this instant",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "exit_sign",
        condition: "immediate_danger",
        evidence: [
          "exit sign misdirects a crowd into a burning passage they are entering at this instant",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "exit_sign",
        condition: "immediate_danger",
        evidence: [
          "exit sign sends a crowd into a burning passage they are entering at this instant",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "evacuation_marker",\n  "condition": "misleading",\n  "severity": "CRITICAL",\n  "evidence": [\n    "evacuation marker sends a crowd into a burning passage",\n    "they are entering at this instant"\n  ]\n}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "evacuation_sign", "condition": "immediate_danger", "evidence": ["evacuation marker sends a crowd into a burning passage they are entering at this instant"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "CRITICAL", "object": "exit_sign", "condition": "immediate_danger", "evidence": ["exit sign misdirects a crowd into a burning passage they are entering at this instant"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "CRITICAL", "object": "exit_sign", "condition": "immediate_danger", "evidence": ["exit sign sends a crowd into a burning passage they are entering at this instant"]}',
      },
    },
    {
      id: "v3-test-other-1-5-0",
      note: "Maintenance desk, can you look at this? public timer no longer works for visitors; it needs servicing without any danger being reported.",
      target: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "public_timer",
        condition: "maintenance_needed",
        evidence: [
          "public timer no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "timer",
        condition: "malfunctioning",
        severity: "LOW",
        evidence: [
          "public timer no longer works for visitors",
          "needs servicing",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "public_timer",
        condition: "malfunctioning",
        evidence: [
          "public timer no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      fineTunedPrediction: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "public_timer",
        condition: "maintenance_needed",
        evidence: [
          "public timer no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      secondSeedPrediction: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "public_timer",
        condition: "maintenance_needed",
        evidence: [
          "public timer no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "timer",\n  "condition": "malfunctioning",\n  "severity": "LOW",\n  "evidence": [\n    "public timer no longer works for visitors",\n    "needs servicing"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "public_timer", "condition": "malfunctioning", "evidence": ["public timer no longer works for visitors; it needs servicing without any danger being reported"]}',
        fine_tuned_seed42:
          '{"category": "OTHER", "severity": "MEDIUM", "object": "public_timer", "condition": "maintenance_needed", "evidence": ["public timer no longer works for visitors; it needs servicing without any danger being reported"]}',
        fine_tuned_seed1729:
          '{"category": "OTHER", "severity": "MEDIUM", "object": "public_timer", "condition": "maintenance_needed", "evidence": ["public timer no longer works for visitors; it needs servicing without any danger being reported"]}',
      },
    },
    {
      id: "v3-test-signage-0-6-1",
      note: "देखभाल कार्यालय, इसे देखें। वैकल्पिक मार्ग पट्ट के कोने पर खरोंच है; हर दिशा अभी समझ आती है।",
      target: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "detour_panel",
        condition: "minor_wear",
        evidence: [
          "detour panel has a scratched corner; every direction can still be understood",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "sign",
        condition: "damaged",
        severity: "LOW",
        evidence: ["वैकल्पिक मार्ग पट्ट के कोने पर खरोंच है"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "alternative_path",
        condition: "minor_damage",
        evidence: [
          "alternative path edge has scratches; all directions are still understandable",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "maintenance_station",
        condition: "minor_wear",
        evidence: [
          "maintenance station has a corner scratch; all directions remain readable now",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "maintenance_station",
        condition: "minor_wear",
        evidence: [
          "maintenance station has a corner scratch; all directions remain visible now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "sign", "condition": "damaged", "severity": "LOW", "evidence": ["वैकल्पिक मार्ग पट्ट के कोने पर खरोंच है"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "alternative_path", "condition": "minor_damage", "evidence": ["alternative path edge has scratches; all directions are still understandable"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "maintenance_station", "condition": "minor_wear", "evidence": ["maintenance station has a corner scratch; all directions remain readable now"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "maintenance_station", "condition": "minor_wear", "evidence": ["maintenance station has a corner scratch; all directions remain visible now"]}',
      },
    },
    {
      id: "v3-test-signage-2-5-1",
      note: "वापसी पर यह मिला: निकासी चिह्न गलत मोड़ से खतरनाक निर्माण क्षेत्र भेजता है। तथ्य दर्ज करें।",
      target: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "evacuation_marker",
        condition: "major_obstruction",
        evidence: [
          "evacuation marker gives the wrong diversion into a hazardous works area",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "sign",
        condition: "misleading",
        severity: "MEDIUM",
        evidence: ["निकासी चिह्न गलत मोड़ से खतरनाक निर्माण क्षेत्र भेजता है"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "signage",
        condition: "misleading",
        evidence: [
          "signage directs to dangerous construction area from wrong turn",
          "record the facts",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "exit_sign",
        condition: "major_obstruction",
        evidence: [
          "exit sign misdirects walkers toward a dangerous construction zone; the misdirection is a major obstruction",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "exit_sign",
        condition: "major_obstruction",
        evidence: [
          "exit sign misdirects into a dangerous construction zone; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "sign", "condition": "misleading", "severity": "MEDIUM", "evidence": ["निकासी चिह्न गलत मोड़ से खतरनाक निर्माण क्षेत्र भेजता है"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "signage", "condition": "misleading", "evidence": ["signage directs to dangerous construction area from wrong turn", "record the facts"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "exit_sign", "condition": "major_obstruction", "evidence": ["exit sign misdirects walkers toward a dangerous construction zone; the misdirection is a major obstruction"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "exit_sign", "condition": "major_obstruction", "evidence": ["exit sign misdirects into a dangerous construction zone; record the fact"]}',
      },
    },
    {
      id: "v3-test-trail-3-5-1",
      note: "देखभाल कार्यालय, इसे देखें। बीहड़ की पगडंडी चट्टान से टूटकर गिर रहा है और यात्रियों का समूह उस हिस्से पर है।",
      target: {
        category: "TRAIL",
        severity: "CRITICAL",
        object: "ravine_footpath",
        condition: "immediate_danger",
        evidence: [
          "ravine footpath is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "rock_face",
        condition: "falling",
        severity: "HIGH",
        evidence: [
          "बीहड़ की पगडंडी चट्टान से टूटकर गिर रहा है",
          "यात्रियों का समूह उस हिस्से पर है",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fence",
        condition: "structural_damage",
        evidence: [
          "fence is breaking off from the rock and falling; a group of travelers is on that section",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "stair_walk",
        condition: "major_obstruction",
        evidence: [
          "stair walk has a loose rock falling off the cliff with walkers nearby",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "stair_walk",
        condition: "major_obstruction",
        evidence: [
          "stair walk is giving way off a rock and a group of walkers is on that section right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "rock_face", "condition": "falling", "severity": "HIGH", "evidence": ["बीहड़ की पगडंडी चट्टान से टूटकर गिर रहा है", "यात्रियों का समूह उस हिस्से पर है"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "fence", "condition": "structural_damage", "evidence": ["fence is breaking off from the rock and falling; a group of travelers is on that section"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "stair_walk", "condition": "major_obstruction", "evidence": ["stair walk has a loose rock falling off the cliff with walkers nearby"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "stair_walk", "condition": "major_obstruction", "evidence": ["stair walk is giving way off a rock and a group of walkers is on that section right now"]}',
      },
    },
    {
      id: "v3-test-trail-2-6-1",
      note: "देखभाल कार्यालय, इसे देखें। खुले मैदान का कच्चा मार्ग पर भूस्खलन से पूरा भ्रमण मार्ग बंद है और सबको लौटना पड़ता है।",
      target: {
        category: "TRAIL",
        severity: "HIGH",
        object: "moorland_track",
        condition: "major_obstruction",
        evidence: [
          "moorland track has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "TRAIL",
        object: "trail",
        condition: "blocked",
        severity: "HIGH",
        evidence: ["भूस्खलन से पूरा भ्रमण मार्ग बंद है", "सबको लौटना पड़ता है"],
      },
      fewShotPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "unpaved_path",
        condition: "complete_closure",
        evidence: [
          "unpaved path is completely closed due to landslip, forcing everyone to return",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "walking_trail",
        condition: "major_obstruction",
        evidence: [
          "unpaved walking trail has a landslip making the whole hiking route unusable and forcing everyone to turn back",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "walking_track",
        condition: "major_obstruction",
        evidence: [
          "unpaved walking track has a landslip blocking the whole route and forcing everyone to turn back",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "TRAIL", "object": "trail", "condition": "blocked", "severity": "HIGH", "evidence": ["भूस्खलन से पूरा भ्रमण मार्ग बंद है", "सबको लौटना पड़ता है"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "HIGH", "object": "unpaved_path", "condition": "complete_closure", "evidence": ["unpaved path is completely closed due to landslip, forcing everyone to return"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "HIGH", "object": "walking_trail", "condition": "major_obstruction", "evidence": ["unpaved walking trail has a landslip making the whole hiking route unusable and forcing everyone to turn back"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "HIGH", "object": "walking_track", "condition": "major_obstruction", "evidence": ["unpaved walking track has a landslip blocking the whole route and forcing everyone to turn back"]}',
      },
    },
    {
      id: "v3-test-environment-1-5-1",
      note: "देखभाल कार्यालय, इसे देखें। मुहाने का किनारा में पौधे खराब और पानी गंदा है; बड़े खतरे का संकेत नहीं।",
      target: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "estuary_edge",
        condition: "maintenance_needed",
        evidence: [
          "estuary edge shows damaged plants and dirty water; nothing indicates a major hazard",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "ENVIRONMENT",
        object: "municipal_office",
        condition: "poor_maintenance",
        severity: "LOW",
        evidence: ["मुहाने का किनारा में पौधे खराब", "पानी गंदा है"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "drainage",
        condition: "poor_condition",
        evidence: [
          "plants at the entrance edge are damaged and water is dirty; no indication of major danger",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "maintenance_office",
        condition: "maintenance_needed",
        evidence: [
          "maintenance office has a damaged edge with vegetation and contaminated water; no major danger is indicated",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "maintenance_station",
        condition: "maintenance_needed",
        evidence: [
          "maintenance station has a damaged edge with contaminated water; no major danger is indicated",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ENVIRONMENT", "object": "municipal_office", "condition": "poor_maintenance", "severity": "LOW", "evidence": ["मुहाने का किनारा में पौधे खराब", "पानी गंदा है"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "drainage", "condition": "poor_condition", "evidence": ["plants at the entrance edge are damaged and water is dirty; no indication of major danger"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "maintenance_office", "condition": "maintenance_needed", "evidence": ["maintenance office has a damaged edge with vegetation and contaminated water; no major danger is indicated"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "maintenance_station", "condition": "maintenance_needed", "evidence": ["maintenance station has a damaged edge with contaminated water; no major danger is indicated"]}',
      },
    },
    {
      id: "v3-test-environment-0-6-0",
      note: "Maintenance desk, can you look at this? woodland has a few disturbed leaves with no damage to the surrounding habitat.",
      target: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "woodland",
        condition: "minor_wear",
        evidence: [
          "woodland has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "woodland",
        condition: "minor_disturbance",
        evidence: [
          "woodland has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "woodland",
        condition: "minor_wear",
        evidence: [
          "woodland has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "woodland",
        condition: "minor_wear",
        evidence: [
          "woodland has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "environment", "object": "woodland", "condition": "disturbed", "severity": "low", "evidence": ["few disturbed leaves", "no damage to the surrounding habitat"]}',
        few_shot:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "woodland", "condition": "minor_disturbance", "evidence": ["woodland has a few disturbed leaves with no damage to the surrounding habitat"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "woodland", "condition": "minor_wear", "evidence": ["woodland has a few disturbed leaves with no damage to the surrounding habitat"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "woodland", "condition": "minor_wear", "evidence": ["woodland has a few disturbed leaves with no damage to the surrounding habitat"]}',
      },
    },
    {
      id: "v3-test-cleanliness-0-6-2",
      note: "Maintenance desk zara dekho. nahar ki seedhiyan ke paas bas do wrappers hain, chalne mein nahi aate.",
      target: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "canal_steps",
        condition: "minor_wear",
        evidence: [
          "canal steps has just two wrappers at its foot, away from people's way",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "waste_bin",
        condition: "overflowing",
        severity: "LOW",
        evidence: ["do wrappers hain", "chalne mein nahi aate"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "waste_bin",
        condition: "minor_wear",
        evidence: [
          "there are two wrappers near the drainage channels, not affecting movement",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "drain_cover",
        condition: "maintenance_needed",
        evidence: [
          "drain covers have a couple of loose wrappers beside them; walkers are not affected",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "drain_cover",
        condition: "maintenance_needed",
        evidence: [
          "drain cover has two loose wrappers beside it; walkers avoid it",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "waste_bin", "condition": "overflowing", "severity": "LOW", "evidence": ["do wrappers hain", "chalne mein nahi aate"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "waste_bin", "condition": "minor_wear", "evidence": ["there are two wrappers near the drainage channels, not affecting movement"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "drain_cover", "condition": "maintenance_needed", "evidence": ["drain covers have a couple of loose wrappers beside them; walkers are not affected"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "drain_cover", "condition": "maintenance_needed", "evidence": ["drain cover has two loose wrappers beside it; walkers avoid it"]}',
      },
    },
    {
      id: "v3-test-accessibility-1-6-1",
      note: "वापसी पर यह मिला: सुगम भूमिगत मार्ग के टेढ़े हिस्से समतल करने हैं, कुर्सी फिर भी निकल जाती है। तथ्य दर्ज करें।",
      target: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_underpass",
        condition: "maintenance_needed",
        evidence: [
          "accessible underpass has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "ramp",
        condition: "uneven",
        severity: "HIGH",
        evidence: [
          "सुगम भूमिगत मार्ग के टेढ़े हिस्से",
          "कुर्सी फिर भी निकल जाती है",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "tactile_path",
        condition: "uneven_surface",
        evidence: [
          "tactile path has uneven sections that need to be made flat, wheelchair still can pass",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_path",
        condition: "maintenance_needed",
        evidence: [
          "accessible path has a crooked section needing flattening; a wheelchair still passes",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_underground_path",
        condition: "maintenance_needed",
        evidence: [
          "accessible underground path has a crooked section needing resurfacing; a wheelchair still passes",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "ramp", "condition": "uneven", "severity": "HIGH", "evidence": ["सुगम भूमिगत मार्ग के टेढ़े हिस्से", "कुर्सी फिर भी निकल जाती है"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "tactile_path", "condition": "uneven_surface", "evidence": ["tactile path has uneven sections that need to be made flat, wheelchair still can pass"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "accessible_path", "condition": "maintenance_needed", "evidence": ["accessible path has a crooked section needing flattening; a wheelchair still passes"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "accessible_underground_path", "condition": "maintenance_needed", "evidence": ["accessible underground path has a crooked section needing resurfacing; a wheelchair still passes"]}',
      },
    },
    {
      id: "v3-test-safety-0-5-1",
      note: "वापसी पर यह मिला: निर्माण गड्ढा अव्यवस्थित दिखता है, पर रक्षक सही है और कोई खतरा खुला नहीं। तथ्य दर्ज करें।",
      target: {
        category: "SAFETY",
        severity: "LOW",
        object: "construction_shaft",
        condition: "minor_wear",
        evidence: [
          "construction shaft looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "construction_site",
        condition: "unsecured",
        severity: "LOW",
        evidence: [
          "construction site looks disorganized",
          "guard is present",
          "no open danger",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "construction_site",
        condition: "disorderly_appearance",
        evidence: [
          "construction pit appears disorganized, but guard is present and no open danger",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "construction_cavity",
        condition: "maintenance_needed",
        evidence: [
          "construction cavity seems untidy with no visible danger and a guardian is properly in place; record the fact",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "construction_cavity",
        condition: "maintenance_needed",
        evidence: [
          "construction cavity is untidy but has a guard and no exposed danger; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "construction_site", "condition": "unsecured", "severity": "LOW", "evidence": ["construction site looks disorganized", "guard is present", "no open danger"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "construction_site", "condition": "disorderly_appearance", "evidence": ["construction pit appears disorganized, but guard is present and no open danger"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "construction_cavity", "condition": "maintenance_needed", "evidence": ["construction cavity seems untidy with no visible danger and a guardian is properly in place; record the fact"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "construction_cavity", "condition": "maintenance_needed", "evidence": ["construction cavity is untidy but has a guard and no exposed danger; record the fact"]}',
      },
    },
    {
      id: "v3-test-trail-2-5-1",
      note: "वापसी पर यह मिला: बीहड़ की पगडंडी पर भूस्खलन से पूरा भ्रमण मार्ग बंद है और सबको लौटना पड़ता है। तथ्य दर्ज करें।",
      target: {
        category: "TRAIL",
        severity: "HIGH",
        object: "ravine_footpath",
        condition: "major_obstruction",
        evidence: [
          "ravine footpath has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "TRAIL",
        object: "trail",
        condition: "blocked",
        severity: "HIGH",
        evidence: ["भूस्खलन से पूरा भ्रमण मार्ग बंद है", "सबको लौटना पड़ता है"],
      },
      fewShotPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "trail_path",
        condition: "complete_closure",
        evidence: [
          "entire trail path is closed due to landslide; everyone has to return",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "walking_trail",
        condition: "major_obstruction",
        evidence: [
          "walking trail has a landslide making the whole hiking route unusable and everyone has to turn back; the fact is recorded",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "walking_track",
        condition: "major_obstruction",
        evidence: [
          "walking track has a landslip making the whole hiking route unusable and forcing everyone to turn back; the fact is recorded",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "TRAIL", "object": "trail", "condition": "blocked", "severity": "HIGH", "evidence": ["भूस्खलन से पूरा भ्रमण मार्ग बंद है", "सबको लौटना पड़ता है"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "HIGH", "object": "trail_path", "condition": "complete_closure", "evidence": ["entire trail path is closed due to landslide; everyone has to return"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "HIGH", "object": "walking_trail", "condition": "major_obstruction", "evidence": ["walking trail has a landslide making the whole hiking route unusable and everyone has to turn back; the fact is recorded"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "HIGH", "object": "walking_track", "condition": "major_obstruction", "evidence": ["walking track has a landslip making the whole hiking route unusable and forcing everyone to turn back; the fact is recorded"]}',
      },
    },
    {
      id: "v3-test-accessibility-3-6-0",
      note: "Encountered this on my return: accessible underpass is tipping into a steep drop with a disabled visitor still on it. Please record the facts.",
      target: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "accessible_underpass",
        condition: "immediate_danger",
        evidence: [
          "accessible underpass is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "underpass",
        condition: "immediate_danger",
        evidence: [
          "accessible underpass is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "accessible_underpass",
        condition: "immediate_danger",
        evidence: [
          "accessible underpass is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "accessible_underpass",
        condition: "immediate_danger",
        evidence: [
          "accessible underpass is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "safety",\n  "object": "underpass",\n  "condition": "tipping",\n  "severity": "critical",\n  "evidence": [\n    "accessible underpass is tipping into a steep drop",\n    "disabled visitor still on it"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "CRITICAL", "object": "underpass", "condition": "immediate_danger", "evidence": ["accessible underpass is tipping into a steep drop with a disabled visitor still on it"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "CRITICAL", "object": "accessible_underpass", "condition": "immediate_danger", "evidence": ["accessible underpass is tipping into a steep drop with a disabled visitor still on it"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "CRITICAL", "object": "accessible_underpass", "condition": "immediate_danger", "evidence": ["accessible underpass is tipping into a steep drop with a disabled visitor still on it"]}',
      },
    },
    {
      id: "v3-test-lighting-2-6-1",
      note: "देखभाल कार्यालय, इसे देखें। भूमिगत रोशनी पूरा पार का रास्ता अंधेरा करता है जो खुले गहरे किनारे के पास है।",
      target: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "subway_illumination",
        condition: "major_obstruction",
        evidence: [
          "subway illumination has blacked out the entire crossing beside an unguarded drop",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "underground_lamp",
        condition: "failing",
        severity: "HIGH",
        evidence: ["भूमिगत रोशनी पूरा पार का रास्ता अंधेरा करता है"],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "underground_lighting",
        condition: "poor_illumination",
        evidence: [
          "underground lighting is making the entire cross path dark, near the open deep edge",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "underground_light",
        condition: "major_obstruction",
        evidence: [
          "underground lighting blinds the whole crossing route beside an unprotected deep edge",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "underground_light",
        condition: "major_obstruction",
        evidence: [
          "underground light has gone out and leaves the whole crossing in darkness beside an unprotected deep edge",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "underground_lamp", "condition": "failing", "severity": "HIGH", "evidence": ["भूमिगत रोशनी पूरा पार का रास्ता अंधेरा करता है"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "underground_lighting", "condition": "poor_illumination", "evidence": ["underground lighting is making the entire cross path dark, near the open deep edge"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "underground_light", "condition": "major_obstruction", "evidence": ["underground lighting blinds the whole crossing route beside an unprotected deep edge"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "underground_light", "condition": "major_obstruction", "evidence": ["underground light has gone out and leaves the whole crossing in darkness beside an unprotected deep edge"]}',
      },
    },
    {
      id: "v3-test-cleanliness-3-6-2",
      note: "Vaapas aate hue mila: nahar ki seedhiyan aag mein ghira hai, visitor isi waqt dhuen se nikal nahi paa raha. Facts note karo.",
      target: {
        category: "CLEANLINESS",
        severity: "CRITICAL",
        object: "canal_steps",
        condition: "immediate_danger",
        evidence: [
          "canal steps is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "exit_sign",
        condition: "obstructed",
        severity: "HIGH",
        evidence: [
          "nahar ki seedhiyan aag mein ghira hai",
          "visitor isi waqt dhuen se nikal nahi paa raha",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "drainage_system",
        condition: "obstructed",
        evidence: [
          "drainage channels are surrounded by fire, visitor cannot escape from smoke at this time",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "stream_bank",
        condition: "immediate_danger",
        evidence: [
          "stream bank is engulfed in a burning fire and a visitor cannot escape the smoke right now",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "riverside",
        condition: "immediate_danger",
        evidence: [
          "riverside has been engulfed in a fire and a visitor cannot escape the smoke right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "exit_sign",\n  "condition": "obstructed",\n  "severity": "HIGH",\n  "evidence": [\n    "nahar ki seedhiyan aag mein ghira hai",\n    "visitor isi waqt dhuen se nikal nahi paa raha"\n  ]\n}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "drainage_system", "condition": "obstructed", "evidence": ["drainage channels are surrounded by fire, visitor cannot escape from smoke at this time"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "stream_bank", "condition": "immediate_danger", "evidence": ["stream bank is engulfed in a burning fire and a visitor cannot escape the smoke right now"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "riverside", "condition": "immediate_danger", "evidence": ["riverside has been engulfed in a fire and a visitor cannot escape the smoke right now"]}',
      },
    },
    {
      id: "v3-test-environment-1-5-0",
      note: "Maintenance desk, can you look at this? estuary edge shows damaged plants and dirty water; nothing indicates a major hazard.",
      target: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "estuary_edge",
        condition: "maintenance_needed",
        evidence: [
          "estuary edge shows damaged plants and dirty water; nothing indicates a major hazard",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "estuary",
        condition: "pollution",
        evidence: [
          "estuary edge shows damaged plants and dirty water; nothing indicates a major hazard",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "estuary_edge",
        condition: "maintenance_needed",
        evidence: [
          "estuary edge has damaged vegetation and contaminated water; no major hazard is apparent",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "estuary_edge",
        condition: "maintenance_needed",
        evidence: [
          "estuary edge has damaged vegetation and contaminated water; no major hazard is apparent",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "environment",\n  "object": "water",\n  "condition": "dirty",\n  "severity": "low",\n  "evidence": [\n    "dirty water"\n  ]\n}',
        few_shot:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "estuary", "condition": "pollution", "evidence": ["estuary edge shows damaged plants and dirty water; nothing indicates a major hazard"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "estuary_edge", "condition": "maintenance_needed", "evidence": ["estuary edge has damaged vegetation and contaminated water; no major hazard is apparent"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "estuary_edge", "condition": "maintenance_needed", "evidence": ["estuary edge has damaged vegetation and contaminated water; no major hazard is apparent"]}',
      },
    },
    {
      id: "v3-test-cleanliness-2-6-1",
      note: "देखभाल कार्यालय, इसे देखें। नहर की सीढ़ियां पर घुटनों जितना कचरा एकमात्र रास्ते पर फैला है।",
      target: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "canal_steps",
        condition: "major_obstruction",
        evidence: [
          "canal steps has a knee-high pile of refuse across the sole way through",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "steps",
        condition: "covered_with_waste",
        severity: "HIGH",
        evidence: [
          "नहर की सीढ़ियां पर घुटनों जितना कचरा एकमात्र रास्ते पर फैला है",
        ],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "steps",
        condition: "debris_present",
        evidence: ["steps have debris as much as knee-high on the only path"],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "canal_stair",
        condition: "major_obstruction",
        evidence: ["canal stair has loose debris across the only passage"],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "canal_stair",
        condition: "major_obstruction",
        evidence: [
          "canal stair has loose debris across the only passage, as deep as a knee",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "steps", "condition": "covered_with_waste", "severity": "HIGH", "evidence": ["नहर की सीढ़ियां पर घुटनों जितना कचरा एकमात्र रास्ते पर फैला है"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "steps", "condition": "debris_present", "evidence": ["steps have debris as much as knee-high on the only path"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "canal_stair", "condition": "major_obstruction", "evidence": ["canal stair has loose debris across the only passage"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "canal_stair", "condition": "major_obstruction", "evidence": ["canal stair has loose debris across the only passage, as deep as a knee"]}',
      },
    },
    {
      id: "v3-test-other-0-5-1",
      note: "वापसी पर यह मिला: सार्वजनिक टाइमर पर छोटा बाहरी दाग है जो सेवा पर असर नहीं डालता। तथ्य दर्ज करें।",
      target: {
        category: "OTHER",
        severity: "LOW",
        object: "public_timer",
        condition: "minor_wear",
        evidence: [
          "public timer has a small cosmetic blemish that does not affect its service",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "OTHER",
        object: "unknown",
        condition: "unspecified",
        severity: "LOW",
        evidence: ["छोटा बाहरी दाग"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "public_timer",
        condition: "minor_damage",
        evidence: [
          "public timer has a small external mark that does not affect service",
        ],
      },
      fineTunedPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "public_timer",
        condition: "minor_wear",
        evidence: [
          "public timer has a small external scratch that does not affect its service",
        ],
      },
      secondSeedPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "public_timer",
        condition: "minor_wear",
        evidence: [
          "public timer has a small external scratch that does not affect its service",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "OTHER", "object": "unknown", "condition": "unspecified", "severity": "LOW", "evidence": ["छोटा बाहरी दाग"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "public_timer", "condition": "minor_damage", "evidence": ["public timer has a small external mark that does not affect service"]}',
        fine_tuned_seed42:
          '{"category": "OTHER", "severity": "LOW", "object": "public_timer", "condition": "minor_wear", "evidence": ["public timer has a small external scratch that does not affect its service"]}',
        fine_tuned_seed1729:
          '{"category": "OTHER", "severity": "LOW", "object": "public_timer", "condition": "minor_wear", "evidence": ["public timer has a small external scratch that does not affect its service"]}',
      },
    },
    {
      id: "v3-test-lighting-1-5-2",
      note: "Maintenance desk zara dekho. ghat ki roshni shaam baad nahi jalta, repair chahiye, dangerous consequence nahi bataya.",
      target: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "quayside_beacon",
        condition: "maintenance_needed",
        evidence: [
          "quayside beacon stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "lamp",
        condition: "not_working",
        severity: "MEDIUM",
        evidence: ["ghat ki roshni shaam baad nahi jalta", "repair chahiye"],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "street_light",
        condition: "maintenance_needed",
        evidence: [
          "street light does not work after evening, needs repair, no dangerous consequence stated",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "stair_light",
        condition: "maintenance_needed",
        evidence: [
          "stair light does not work after dusk and needs repair; no dangerous consequence is stated",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "stair_light",
        condition: "maintenance_needed",
        evidence: [
          "stair light does not work after dusk and needs repair; no dangerous consequence is stated",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "lamp", "condition": "not_working", "severity": "MEDIUM", "evidence": ["ghat ki roshni shaam baad nahi jalta", "repair chahiye"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "street_light", "condition": "maintenance_needed", "evidence": ["street light does not work after evening, needs repair, no dangerous consequence stated"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "stair_light", "condition": "maintenance_needed", "evidence": ["stair light does not work after dusk and needs repair; no dangerous consequence is stated"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "stair_light", "condition": "maintenance_needed", "evidence": ["stair light does not work after dusk and needs repair; no dangerous consequence is stated"]}',
      },
    },
    {
      id: "v3-test-safety-2-5-0",
      note: "Encountered this on my return: construction shaft has lost its barrier so a passerby could suffer a serious fall. Please record the facts.",
      target: {
        category: "SAFETY",
        severity: "HIGH",
        object: "construction_shaft",
        condition: "major_obstruction",
        evidence: [
          "construction shaft has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "construction_shaft",
        condition: "unprotected",
        severity: "HIGH",
        evidence: [
          "construction shaft has lost its barrier",
          "passerby could suffer a serious fall",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "construction_shaft",
        condition: "barrier_missing",
        evidence: [
          "construction shaft has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "construction_shaft",
        condition: "major_obstruction",
        evidence: [
          "construction shaft has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "construction_shaft",
        condition: "major_obstruction",
        evidence: [
          "construction shaft has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "construction_shaft", "condition": "unprotected", "severity": "HIGH", "evidence": ["construction shaft has lost its barrier", "passerby could suffer a serious fall"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "construction_shaft", "condition": "barrier_missing", "evidence": ["construction shaft has lost its barrier so a passerby could suffer a serious fall"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "construction_shaft", "condition": "major_obstruction", "evidence": ["construction shaft has lost its barrier so a passerby could suffer a serious fall"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "construction_shaft", "condition": "major_obstruction", "evidence": ["construction shaft has lost its barrier so a passerby could suffer a serious fall"]}',
      },
    },
    {
      id: "v3-test-safety-0-5-2",
      note: "Vaapas aate hue mila: construction ka gaddha untidy dikhta hai, guard intact hai, dangerous cheez exposed nahi. Facts note karo.",
      target: {
        category: "SAFETY",
        severity: "LOW",
        object: "construction_shaft",
        condition: "minor_wear",
        evidence: [
          "construction shaft looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "construction_site",
        condition: "untidy",
        severity: "MEDIUM",
        evidence: ["construction ka gaddha untidy dikhta hai"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "construction_site",
        condition: "untidy",
        evidence: [
          "construction site has an untidy pile",
          "guard is intact",
          "no dangerous item is exposed",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "construction_site",
        condition: "maintenance_needed",
        evidence: [
          "construction site has an untidy exposed excavation with intact guard; no dangerous item is exposed",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "construction_site",
        condition: "minor_wear",
        evidence: [
          "construction site has an untidy pile; the guard is intact and no dangerous item is exposed",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "construction_site", "condition": "untidy", "severity": "MEDIUM", "evidence": ["construction ka gaddha untidy dikhta hai"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "construction_site", "condition": "untidy", "evidence": ["construction site has an untidy pile", "guard is intact", "no dangerous item is exposed"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "construction_site", "condition": "maintenance_needed", "evidence": ["construction site has an untidy exposed excavation with intact guard; no dangerous item is exposed"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "construction_site", "condition": "minor_wear", "evidence": ["construction site has an untidy pile; the guard is intact and no dangerous item is exposed"]}',
      },
    },
    {
      id: "v3-test-infrastructure-1-5-0",
      note: "Maintenance desk, can you look at this? pedestrian platform has cracks that need patching, but passing over it is still possible.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "pedestrian_platform",
        condition: "maintenance_needed",
        evidence: [
          "pedestrian platform has cracks that need patching, but passing over it is still possible",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "pedestrian_platform",
        condition: "cracked",
        severity: "MEDIUM",
        evidence: ["pedestrian platform has cracks that need patching"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "pedestrian_platform",
        condition: "surface_damage",
        evidence: [
          "pedestrian platform has cracks that need patching, but passing over it is still possible",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "pedestrian_platform",
        condition: "maintenance_needed",
        evidence: [
          "pedestrian platform has cracks that need patching, but passing over it is still possible",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "pedestrian_platform",
        condition: "maintenance_needed",
        evidence: [
          "pedestrian platform has cracks that need patching, but passing over it is still possible",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "pedestrian_platform",\n  "condition": "cracked",\n  "severity": "MEDIUM",\n  "evidence": [\n    "pedestrian platform has cracks that need patching"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "pedestrian_platform", "condition": "surface_damage", "evidence": ["pedestrian platform has cracks that need patching, but passing over it is still possible"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "pedestrian_platform", "condition": "maintenance_needed", "evidence": ["pedestrian platform has cracks that need patching, but passing over it is still possible"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "pedestrian_platform", "condition": "maintenance_needed", "evidence": ["pedestrian platform has cracks that need patching, but passing over it is still possible"]}',
      },
    },
    {
      id: "v3-test-infrastructure-2-6-2",
      note: "Maintenance desk zara dekho. sadak ki puliya alag toot gaya, paidal crossing ki jagah nahi bachi.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "road_culvert",
        condition: "major_obstruction",
        evidence: [
          "road culvert has split apart, leaving no usable crossing for pedestrians",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "bridge",
        condition: "broken",
        severity: "HIGH",
        evidence: [
          "sadak ki puliya alag toot gaya",
          "paidal crossing ki jagah nahi bachi",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "bridge_pillar",
        condition: "major_damage",
        evidence: [
          "bridge pillar has broken off, no pedestrian crossing area remains",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "stair_well",
        condition: "major_obstruction",
        evidence: [
          "stair well has a loose structural beam; the pedestrian crossing is unusable",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "street_culvert",
        condition: "major_obstruction",
        evidence: [
          "street culvert has given way and no pedestrian crossing remains",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "INFRASTRUCTURE", "object": "bridge", "condition": "broken", "severity": "HIGH", "evidence": ["sadak ki puliya alag toot gaya", "paidal crossing ki jagah nahi bachi"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "bridge_pillar", "condition": "major_damage", "evidence": ["bridge pillar has broken off, no pedestrian crossing area remains"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "stair_well", "condition": "major_obstruction", "evidence": ["stair well has a loose structural beam; the pedestrian crossing is unusable"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "street_culvert", "condition": "major_obstruction", "evidence": ["street culvert has given way and no pedestrian crossing remains"]}',
      },
    },
    {
      id: "v3-test-cleanliness-2-5-0",
      note: "Encountered this on my return: public courtyard has a knee-high pile of refuse across the sole way through. Please record the facts.",
      target: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "public_courtyard",
        condition: "major_obstruction",
        evidence: [
          "public courtyard has a knee-high pile of refuse across the sole way through",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "public_courtyard",
        condition: "obstruction",
        evidence: [
          "public courtyard has a knee-high pile of refuse across the sole way through",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "public_courtyard",
        condition: "major_obstruction",
        evidence: [
          "public courtyard has a knee-high pile of refuse across the sole way through",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "public_courtyard",
        condition: "major_obstruction",
        evidence: [
          "public courtyard has a knee-high pile of refuse across the sole way through",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "cleanliness", "object": "waste_bin", "condition": "overflowing", "severity": "HIGH", "evidence": ["knee-high pile of refuse", "across the sole way through"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "public_courtyard", "condition": "obstruction", "evidence": ["public courtyard has a knee-high pile of refuse across the sole way through"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "public_courtyard", "condition": "major_obstruction", "evidence": ["public courtyard has a knee-high pile of refuse across the sole way through"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "public_courtyard", "condition": "major_obstruction", "evidence": ["public courtyard has a knee-high pile of refuse across the sole way through"]}',
      },
    },
    {
      id: "v3-test-infrastructure-0-5-0",
      note: "Encountered this on my return: pedestrian platform shows chipped paint while all parts remain solid and usable. Please record the facts.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "pedestrian_platform",
        condition: "minor_wear",
        evidence: [
          "pedestrian platform shows chipped paint while all parts remain solid and usable",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "pedestrian_platform",
        condition: "cosmetic_damage",
        evidence: [
          "pedestrian platform shows chipped paint while all parts remain solid and usable",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "stair_well",
        condition: "minor_wear",
        evidence: [
          "stair_well has chipped paint while all parts remain solid and usable",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "pedestrian_platform",
        condition: "minor_wear",
        evidence: [
          "pedestrian platform shows chipped paint while all parts remain solid and usable",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "cleanliness",\n  "object": "pedestrian_platform",\n  "condition": "chipped_paint",\n  "severity": "low",\n  "evidence": [\n    "pedestrian platform shows chipped paint",\n    "all parts remain solid and usable"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "pedestrian_platform", "condition": "cosmetic_damage", "evidence": ["pedestrian platform shows chipped paint while all parts remain solid and usable"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "stair_well", "condition": "minor_wear", "evidence": ["stair_well has chipped paint while all parts remain solid and usable"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "pedestrian_platform", "condition": "minor_wear", "evidence": ["pedestrian platform shows chipped paint while all parts remain solid and usable"]}',
      },
    },
    {
      id: "v3-test-lighting-3-6-2",
      note: "Vaapas aate hue mila: underground roshni fail hua, bachcha invisible edge paar karke abhi gir raha. Facts note karo.",
      target: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "subway_illumination",
        condition: "immediate_danger",
        evidence: [
          "subway illumination failed as a child stepped over an invisible edge and is falling now",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "public_lamp",
        condition: "failed",
        severity: "HIGH",
        evidence: [
          "underground roshni fail hua",
          "bachcha invisible edge paar karke abhi gir raha",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "underground_lighting",
        condition: "major_obstruction",
        evidence: [
          "underground lighting failed, child is crossing invisible edge and is about to fall",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "underground_light",
        condition: "immediate_danger",
        evidence: [
          "underground light has failed and a child is walking toward an unseen edge and is falling now; note the facts",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "underground_light",
        condition: "immediate_danger",
        evidence: [
          "underground light has failed and a child is walking toward an unseen edge and is falling now; note the facts",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "public_lamp", "condition": "failed", "severity": "HIGH", "evidence": ["underground roshni fail hua", "bachcha invisible edge paar karke abhi gir raha"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "underground_lighting", "condition": "major_obstruction", "evidence": ["underground lighting failed, child is crossing invisible edge and is about to fall"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "underground_light", "condition": "immediate_danger", "evidence": ["underground light has failed and a child is walking toward an unseen edge and is falling now; note the facts"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "underground_light", "condition": "immediate_danger", "evidence": ["underground light has failed and a child is walking toward an unseen edge and is falling now; note the facts"]}',
      },
    },
    {
      id: "v3-test-signage-1-5-0",
      note: "Maintenance desk, can you look at this? evacuation marker has lost its text, leaving visitors without the posted directions.",
      target: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "evacuation_marker",
        condition: "maintenance_needed",
        evidence: [
          "evacuation marker has lost its text, leaving visitors without the posted directions",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "evacuation_marker",
        condition: "missing_text",
        severity: "HIGH",
        evidence: [
          "evacuation marker has lost its text",
          "visitors without the posted directions",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "evacuation_sign",
        condition: "missing_text",
        evidence: [
          "evacuation marker has lost its text, leaving visitors without the posted directions",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "exit_sign",
        condition: "maintenance_needed",
        evidence: [
          "exit sign has lost its text, leaving visitors without the posted directions",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "evacuation_marker",
        condition: "maintenance_needed",
        evidence: [
          "evacuation marker has lost its text, leaving visitors without the posted directions",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "evacuation_marker",\n  "condition": "missing_text",\n  "severity": "HIGH",\n  "evidence": [\n    "evacuation marker has lost its text",\n    "visitors without the posted directions"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "evacuation_sign", "condition": "missing_text", "evidence": ["evacuation marker has lost its text, leaving visitors without the posted directions"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "exit_sign", "condition": "maintenance_needed", "evidence": ["exit sign has lost its text, leaving visitors without the posted directions"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "evacuation_marker", "condition": "maintenance_needed", "evidence": ["evacuation marker has lost its text, leaving visitors without the posted directions"]}',
      },
    },
    {
      id: "v3-test-signage-1-5-1",
      note: "देखभाल कार्यालय, इसे देखें। निकासी चिह्न के शब्द मिट गए हैं, आगंतुकों को लिखी दिशा नहीं मिलती।",
      target: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "evacuation_marker",
        condition: "maintenance_needed",
        evidence: [
          "evacuation marker has lost its text, leaving visitors without the posted directions",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "sign",
        condition: "missing_text",
        severity: "MEDIUM",
        evidence: [
          "निकासी चिह्न के शब्द मिट गए हैं",
          "आगंतुकों को लिखी दिशा नहीं मिलती",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "signage",
        condition: "incomplete_information",
        evidence: [
          "directional signage words have faded, visitors do not get written directions",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "exit_sign",
        condition: "maintenance_needed",
        evidence: [
          "exit sign has faded wording and no written direction is visible to visitors",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "exit_sign",
        condition: "maintenance_needed",
        evidence: [
          "exit sign has faded and no written direction is visible to visitors",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "sign", "condition": "missing_text", "severity": "MEDIUM", "evidence": ["निकासी चिह्न के शब्द मिट गए हैं", "आगंतुकों को लिखी दिशा नहीं मिलती"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "signage", "condition": "incomplete_information", "evidence": ["directional signage words have faded, visitors do not get written directions"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "exit_sign", "condition": "maintenance_needed", "evidence": ["exit sign has faded wording and no written direction is visible to visitors"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "exit_sign", "condition": "maintenance_needed", "evidence": ["exit sign has faded and no written direction is visible to visitors"]}',
      },
    },
    {
      id: "v3-test-lighting-0-5-1",
      note: "वापसी पर यह मिला: घाट की रोशनी थोड़ा झिलमिलाता है पर आसपास की रोशनी से पार का रास्ता साफ दिखता है। तथ्य दर्ज करें।",
      target: {
        category: "LIGHTING",
        severity: "LOW",
        object: "quayside_beacon",
        condition: "minor_wear",
        evidence: [
          "quayside beacon flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "lamp",
        condition: "flickering",
        severity: "LOW",
        evidence: ["घाट की रोशनी थोड़ा झिलमिलाता है"],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "street_light",
        condition: "flickering",
        evidence: [
          "street light flickers slightly but the path across is clearly visible from surrounding lights",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "bridge_light",
        condition: "minor_wear",
        evidence: [
          "bridge light is slightly flickering but the passage across remains clearly visible beside it; record the fact",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "bridge_light",
        condition: "minor_wear",
        evidence: [
          "bridge light is slightly flickering but the passage across it remains clearly illuminated by surrounding lights; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "lamp", "condition": "flickering", "severity": "LOW", "evidence": ["घाट की रोशनी थोड़ा झिलमिलाता है"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "LOW", "object": "street_light", "condition": "flickering", "evidence": ["street light flickers slightly but the path across is clearly visible from surrounding lights"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "LOW", "object": "bridge_light", "condition": "minor_wear", "evidence": ["bridge light is slightly flickering but the passage across remains clearly visible beside it; record the fact"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "LOW", "object": "bridge_light", "condition": "minor_wear", "evidence": ["bridge light is slightly flickering but the passage across it remains clearly illuminated by surrounding lights; record the fact"]}',
      },
    },
    {
      id: "v3-test-trail-3-6-1",
      note: "वापसी पर यह मिला: खुले मैदान का कच्चा मार्ग चट्टान से टूटकर गिर रहा है और यात्रियों का समूह उस हिस्से पर है। तथ्य दर्ज करें।",
      target: {
        category: "TRAIL",
        severity: "CRITICAL",
        object: "moorland_track",
        condition: "immediate_danger",
        evidence: [
          "moorland track is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "TRAIL",
        object: "path",
        condition: "collapsing",
        severity: "HIGH",
        evidence: [
          "खुले मैदान का कच्चा मार्ग चट्टान से टूटकर गिर रहा है",
          "यात्रियों का समूह उस हिस्से पर है",
        ],
      },
      fewShotPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "unpaved_path",
        condition: "structural_damage",
        evidence: [
          "unpaved path is breaking off due to rock and a group of travelers is on that section",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "open_field_trail",
        condition: "major_obstruction",
        evidence: [
          "unpaved open field trail is giving way off a rock and a group of walkers is on that section; record the fact",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "open_field_trail",
        condition: "major_obstruction",
        evidence: [
          "unpaved open field trail is collapsing into a rock face and a group of walkers is on that section right now; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "TRAIL", "object": "path", "condition": "collapsing", "severity": "HIGH", "evidence": ["खुले मैदान का कच्चा मार्ग चट्टान से टूटकर गिर रहा है", "यात्रियों का समूह उस हिस्से पर है"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "HIGH", "object": "unpaved_path", "condition": "structural_damage", "evidence": ["unpaved path is breaking off due to rock and a group of travelers is on that section"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "HIGH", "object": "open_field_trail", "condition": "major_obstruction", "evidence": ["unpaved open field trail is giving way off a rock and a group of walkers is on that section; record the fact"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "HIGH", "object": "open_field_trail", "condition": "major_obstruction", "evidence": ["unpaved open field trail is collapsing into a rock face and a group of walkers is on that section right now; record the fact"]}',
      },
    },
    {
      id: "v3-test-safety-0-6-0",
      note: "Maintenance desk, can you look at this? emergency hatch looks untidy, although its guard is intact and nothing dangerous is exposed.",
      target: {
        category: "SAFETY",
        severity: "LOW",
        object: "emergency_hatch",
        condition: "minor_wear",
        evidence: [
          "emergency hatch looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "emergency_hatch",
        condition: "untidy",
        severity: "LOW",
        evidence: [
          "emergency hatch looks untidy",
          "guard is intact",
          "nothing dangerous is exposed",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "emergency_hatch",
        condition: "cosmetic_issue",
        evidence: [
          "emergency hatch looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "LOW",
        object: "emergency_hatch",
        condition: "minor_wear",
        evidence: [
          "maintenance desk, can you look at this? emergency hatch looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "LOW",
        object: "emergency_hatch",
        condition: "minor_wear",
        evidence: [
          "emergency hatch looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "emergency_hatch", "condition": "untidy", "severity": "LOW", "evidence": ["emergency hatch looks untidy", "guard is intact", "nothing dangerous is exposed"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "emergency_hatch", "condition": "cosmetic_issue", "evidence": ["emergency hatch looks untidy, although its guard is intact and nothing dangerous is exposed"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "LOW", "object": "emergency_hatch", "condition": "minor_wear", "evidence": ["maintenance desk, can you look at this? emergency hatch looks untidy, although its guard is intact and nothing dangerous is exposed"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "LOW", "object": "emergency_hatch", "condition": "minor_wear", "evidence": ["emergency hatch looks untidy, although its guard is intact and nothing dangerous is exposed"]}',
      },
    },
    {
      id: "v3-test-environment-0-6-2",
      note: "Maintenance desk zara dekho. van ka ilaaka ke kuch patte idhar udhar hain, habitat ko nuksaan nahi.",
      target: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "woodland",
        condition: "minor_wear",
        evidence: [
          "woodland has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "OTHER",
        object: "unknown",
        condition: "unspecified",
        severity: "LOW",
        evidence: [
          "Maintenance desk zara dekho",
          "van ka ilaaka ke kuch patte idhar udhar hain",
          "habitat ko nuksaan nahi",
        ],
      },
      fewShotPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "unknown",
        condition: "unspecified",
        evidence: [
          "van area has some leaves scattered here and there, no damage to habitat",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "tree",
        condition: "minor_wear",
        evidence: ["tree has a few loose leaves; the habitat is not harmed"],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "forest_area",
        condition: "minor_wear",
        evidence: [
          "forest area has some loose leaves; the habitat is not harmed",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "OTHER", "object": "unknown", "condition": "unspecified", "severity": "LOW", "evidence": ["Maintenance desk zara dekho", "van ka ilaaka ke kuch patte idhar udhar hain", "habitat ko nuksaan nahi"]}',
        few_shot:
          '{"category": "OTHER", "severity": "LOW", "object": "unknown", "condition": "unspecified", "evidence": ["van area has some leaves scattered here and there, no damage to habitat"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "tree", "condition": "minor_wear", "evidence": ["tree has a few loose leaves; the habitat is not harmed"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "forest_area", "condition": "minor_wear", "evidence": ["forest area has some loose leaves; the habitat is not harmed"]}',
      },
    },
    {
      id: "v3-test-trail-3-6-0",
      note: "Encountered this on my return: moorland track is crumbling down a cliff while a group of walkers is on that section. Please record the facts.",
      target: {
        category: "TRAIL",
        severity: "CRITICAL",
        object: "moorland_track",
        condition: "immediate_danger",
        evidence: [
          "moorland track is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "moorland_track",
        condition: "structural_damage",
        evidence: [
          "moorland track is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "moorland_track",
        condition: "major_obstruction",
        evidence: [
          "moorland track is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "moorland_track",
        condition: "major_obstruction",
        evidence: [
          "moorland track is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "trail",\n  "object": "track",\n  "condition": "crumbling",\n  "severity": "high",\n  "evidence": [\n    "moorland track is crumbling down a cliff",\n    "group of walkers is on that section"\n  ]\n}',
        few_shot:
          '{"category": "TRAIL", "severity": "HIGH", "object": "moorland_track", "condition": "structural_damage", "evidence": ["moorland track is crumbling down a cliff while a group of walkers is on that section"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "HIGH", "object": "moorland_track", "condition": "major_obstruction", "evidence": ["moorland track is crumbling down a cliff while a group of walkers is on that section"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "HIGH", "object": "moorland_track", "condition": "major_obstruction", "evidence": ["moorland track is crumbling down a cliff while a group of walkers is on that section"]}',
      },
    },
    {
      id: "v3-test-safety-3-5-0",
      note: "Maintenance desk, can you look at this? construction shaft has a person caught inside while an active lethal hazard continues.",
      target: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "construction_shaft",
        condition: "immediate_danger",
        evidence: [
          "construction shaft has a person caught inside while an active lethal hazard continues",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "construction_shaft",
        condition: "person_caught",
        severity: "CRITICAL",
        evidence: [
          "construction shaft has a person caught inside",
          "active lethal hazard continues",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "construction_shaft",
        condition: "immediate_danger",
        evidence: [
          "construction shaft has a person caught inside while an active lethal hazard continues",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "construction_shaft",
        condition: "immediate_danger",
        evidence: [
          "construction shaft has a person caught inside while an active lethal hazard continues",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "construction_shaft",
        condition: "immediate_danger",
        evidence: [
          "construction shaft has a person caught inside while an active lethal hazard continues",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "construction_shaft", "condition": "person_caught", "severity": "CRITICAL", "evidence": ["construction shaft has a person caught inside", "active lethal hazard continues"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "construction_shaft", "condition": "immediate_danger", "evidence": ["construction shaft has a person caught inside while an active lethal hazard continues"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "construction_shaft", "condition": "immediate_danger", "evidence": ["construction shaft has a person caught inside while an active lethal hazard continues"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "construction_shaft", "condition": "immediate_danger", "evidence": ["construction shaft has a person caught inside while an active lethal hazard continues"]}',
      },
    },
    {
      id: "v3-test-accessibility-2-5-1",
      note: "वापसी पर यह मिला: सुगम लकड़ी मार्ग का अवरोध बंद है; व्हीलचेयर किसी भी मार्ग से सुविधा नहीं पहुंच सकती। तथ्य दर्ज करें।",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "mobility_boardwalk",
        condition: "major_obstruction",
        evidence: [
          "mobility boardwalk has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "path",
        condition: "blocked",
        severity: "HIGH",
        evidence: [
          "सुगम लकड़ी मार्ग का अवरोध बंद है",
          "व्हीलचेयर किसी भी मार्ग से सुविधा नहीं पहुंच सकती",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "tactile_path",
        condition: "major_obstruction",
        evidence: [
          "tactile path is blocked; wheelchair cannot access any path",
          "record the facts",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_path",
        condition: "major_obstruction",
        evidence: [
          "accessible path is obstructed and no route is available for wheelchair users",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_path",
        condition: "major_obstruction",
        evidence: [
          "accessible path is obstructed and no wheelchair route is available",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "path", "condition": "blocked", "severity": "HIGH", "evidence": ["सुगम लकड़ी मार्ग का अवरोध बंद है", "व्हीलचेयर किसी भी मार्ग से सुविधा नहीं पहुंच सकती"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "tactile_path", "condition": "major_obstruction", "evidence": ["tactile path is blocked; wheelchair cannot access any path", "record the facts"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_path", "condition": "major_obstruction", "evidence": ["accessible path is obstructed and no route is available for wheelchair users"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_path", "condition": "major_obstruction", "evidence": ["accessible path is obstructed and no wheelchair route is available"]}',
      },
    },
    {
      id: "v3-test-cleanliness-2-5-2",
      note: "Vaapas aate hue mila: sarvajanik aangan par ghutnon tak waste ka dher hai, wahi ek rasta tha. Facts note karo.",
      target: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "public_courtyard",
        condition: "major_obstruction",
        evidence: [
          "public courtyard has a knee-high pile of refuse across the sole way through",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "waste_disposal",
        condition: "accumulation",
        evidence: [
          "waste is piled up to the gutter on the public courtyard, which was the only path",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "public_area",
        condition: "major_obstruction",
        evidence: [
          "public area has a heap of dumped waste blocking the only passage",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "public_area",
        condition: "major_obstruction",
        evidence: [
          "public area has a dumped pile of waste blocking the only passage",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "cleanliness", "object": "waste_bin", "condition": "overflowing", "severity": "high", "evidence": ["waste ka dher hai", "ek rasta tha"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "waste_disposal", "condition": "accumulation", "evidence": ["waste is piled up to the gutter on the public courtyard, which was the only path"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "public_area", "condition": "major_obstruction", "evidence": ["public area has a heap of dumped waste blocking the only passage"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "public_area", "condition": "major_obstruction", "evidence": ["public area has a dumped pile of waste blocking the only passage"]}',
      },
    },
    {
      id: "v3-test-environment-3-6-2",
      note: "Vaapas aate hue mila: van ka ilaaka flash flood mein beh raha aur log saath mein beh rahe. Facts note karo.",
      target: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "woodland",
        condition: "immediate_danger",
        evidence: [
          "woodland is being swept away in a flash flood carrying people with it",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "ENVIRONMENT",
        object: "area",
        condition: "flooded",
        severity: "CRITICAL",
        evidence: [
          "van ka ilaaka flash flood mein beh raha",
          "log saath mein beh rahe",
        ],
      },
      fewShotPrediction: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "vehicle_area",
        condition: "flooded",
        evidence: ["vehicle area is flooded and people are also flooded"],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "forest_area",
        condition: "immediate_danger",
        evidence: [
          "forest area is being washed away by a flash flood and people are being swept with it",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "forest_area",
        condition: "immediate_danger",
        evidence: [
          "forest area is being washed away by a flash flood and people are being swept with it",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ENVIRONMENT", "object": "area", "condition": "flooded", "severity": "CRITICAL", "evidence": ["van ka ilaaka flash flood mein beh raha", "log saath mein beh rahe"]}',
        few_shot:
          '{"category": "ENVIRONMENT", "severity": "HIGH", "object": "vehicle_area", "condition": "flooded", "evidence": ["vehicle area is flooded and people are also flooded"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "forest_area", "condition": "immediate_danger", "evidence": ["forest area is being washed away by a flash flood and people are being swept with it"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "forest_area", "condition": "immediate_danger", "evidence": ["forest area is being washed away by a flash flood and people are being swept with it"]}',
      },
    },
    {
      id: "v3-test-signage-0-6-0",
      note: "Maintenance desk, can you look at this? detour panel has a scratched corner; every direction can still be understood.",
      target: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "detour_panel",
        condition: "minor_wear",
        evidence: [
          "detour panel has a scratched corner; every direction can still be understood",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "detour_panel",
        condition: "scratched",
        severity: "LOW",
        evidence: [
          "detour panel has a scratched corner",
          "every direction can still be understood",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "detour_sign",
        condition: "minor_damage",
        evidence: [
          "detour panel has a scratched corner; every direction can still be understood",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "direction_board",
        condition: "minor_wear",
        evidence: [
          "direction board has a scratched corner; every direction can still be understood",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "direction_board",
        condition: "minor_wear",
        evidence: [
          "direction board has a scratched corner; every direction can still be understood",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "detour_panel",\n  "condition": "scratched",\n  "severity": "LOW",\n  "evidence": [\n    "detour panel has a scratched corner",\n    "every direction can still be understood"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "detour_sign", "condition": "minor_damage", "evidence": ["detour panel has a scratched corner; every direction can still be understood"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "direction_board", "condition": "minor_wear", "evidence": ["direction board has a scratched corner; every direction can still be understood"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "direction_board", "condition": "minor_wear", "evidence": ["direction board has a scratched corner; every direction can still be understood"]}',
      },
    },
    {
      id: "v3-test-signage-0-5-2",
      note: "Vaapas aate hue mila: evacuation marker ke corner par scratch hai, har direction samajh aati hai. Facts note karo.",
      target: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "evacuation_marker",
        condition: "minor_wear",
        evidence: [
          "evacuation marker has a scratched corner; every direction can still be understood",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "evacuation_marker",
        condition: "damaged",
        severity: "LOW",
        evidence: [
          "evacuation marker ke corner par scratch hai",
          "har direction samajh aati hai",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "evacuation_marker",
        condition: "minor_damage",
        evidence: [
          "evacuation marker has a scratch at the corner, but understanding in all directions is possible",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "exit_sign",
        condition: "minor_wear",
        evidence: [
          "exit sign has a corner scratch; all directions are still readable",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "exit_sign",
        condition: "minor_wear",
        evidence: [
          "exit sign has a corner scratch; its direction is still clear",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "evacuation_marker", "condition": "damaged", "severity": "LOW", "evidence": ["evacuation marker ke corner par scratch hai", "har direction samajh aati hai"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "evacuation_marker", "condition": "minor_damage", "evidence": ["evacuation marker has a scratch at the corner, but understanding in all directions is possible"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "exit_sign", "condition": "minor_wear", "evidence": ["exit sign has a corner scratch; all directions are still readable"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "exit_sign", "condition": "minor_wear", "evidence": ["exit sign has a corner scratch; its direction is still clear"]}',
      },
    },
    {
      id: "v3-test-lighting-1-6-1",
      note: "वापसी पर यह मिला: भूमिगत रोशनी शाम के बाद नहीं जलता; सुधार चाहिए पर खतरनाक परिणाम नहीं बताया। तथ्य दर्ज करें।",
      target: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "subway_illumination",
        condition: "maintenance_needed",
        evidence: [
          "subway illumination stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "underground_lighting",
        condition: "not_functioning",
        severity: "MEDIUM",
        evidence: ["भूमिगत रोशनी शाम के बाद नहीं जलता"],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "underground_lighting",
        condition: "maintenance_needed",
        evidence: [
          "underground lighting does not work after evening; repair is needed but no dangerous consequences are stated",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "underground_light",
        condition: "maintenance_needed",
        evidence: [
          "underground light does not illuminate after dusk; repair is needed without a stated hazardous consequence",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "underground_light",
        condition: "maintenance_needed",
        evidence: [
          "underground light does not illuminate after dusk; it needs repair without a stated hazardous consequence",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "underground_lighting", "condition": "not_functioning", "severity": "MEDIUM", "evidence": ["भूमिगत रोशनी शाम के बाद नहीं जलता"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "underground_lighting", "condition": "maintenance_needed", "evidence": ["underground lighting does not work after evening; repair is needed but no dangerous consequences are stated"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "underground_light", "condition": "maintenance_needed", "evidence": ["underground light does not illuminate after dusk; repair is needed without a stated hazardous consequence"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "underground_light", "condition": "maintenance_needed", "evidence": ["underground light does not illuminate after dusk; it needs repair without a stated hazardous consequence"]}',
      },
    },
    {
      id: "v3-test-cleanliness-1-6-1",
      note: "वापसी पर यह मिला: नहर की सीढ़ियां के चारों ओर बिना उठे थैले बदबू दे रहे हैं, चलने की जगह खुली है। तथ्य दर्ज करें।",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "canal_steps",
        condition: "maintenance_needed",
        evidence: [
          "canal steps is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "steps",
        condition: "overgrown",
        severity: "MEDIUM",
        evidence: [
          "नहर की सीढ़ियां के चारों ओर बिना उठे थैले बदबू दे रहे हैं",
          "चलने की जगह खुली है",
        ],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "drainage_steps",
        condition: "uncovered_waste",
        evidence: [
          "steps around the drain have uncovered bags emitting bad odor",
          "pathway is open",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "canal_stair",
        condition: "maintenance_needed",
        evidence: [
          "canal stair has unraised loose bags emitting a bad smell with an exposed passage",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "drain_stair",
        condition: "maintenance_needed",
        evidence: [
          "drain stair has loose unsecured sacks emitting an offensive smell; the passage remains passable",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "steps", "condition": "overgrown", "severity": "MEDIUM", "evidence": ["नहर की सीढ़ियां के चारों ओर बिना उठे थैले बदबू दे रहे हैं", "चलने की जगह खुली है"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "drainage_steps", "condition": "uncovered_waste", "evidence": ["steps around the drain have uncovered bags emitting bad odor", "pathway is open"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "canal_stair", "condition": "maintenance_needed", "evidence": ["canal stair has unraised loose bags emitting a bad smell with an exposed passage"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "drain_stair", "condition": "maintenance_needed", "evidence": ["drain stair has loose unsecured sacks emitting an offensive smell; the passage remains passable"]}',
      },
    },
    {
      id: "v3-test-cleanliness-0-5-2",
      note: "Vaapas aate hue mila: sarvajanik aangan ke paas bas do wrappers hain, chalne mein nahi aate. Facts note karo.",
      target: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_courtyard",
        condition: "minor_wear",
        evidence: [
          "public courtyard has just two wrappers at its foot, away from people's way",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "waste_bin",
        condition: "minor_wear",
        evidence: [
          "two wrappers are found near public area, not affecting movement",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_area",
        condition: "minor_wear",
        evidence: [
          "public area has two loose wrappers beside it; walkers are unaffected",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_area",
        condition: "minor_wear",
        evidence: [
          "public area has two loose wrappers beside it, without obstructing passage",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "cleanliness", "object": "waste_bin", "condition": "overflowing", "severity": "low", "evidence": ["do wrappers hain", "chalne mein nahi aate"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "waste_bin", "condition": "minor_wear", "evidence": ["two wrappers are found near public area, not affecting movement"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "public_area", "condition": "minor_wear", "evidence": ["public area has two loose wrappers beside it; walkers are unaffected"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "public_area", "condition": "minor_wear", "evidence": ["public area has two loose wrappers beside it, without obstructing passage"]}',
      },
    },
    {
      id: "v3-test-other-0-6-1",
      note: "देखभाल कार्यालय, इसे देखें। कतार का प्रदर्शन पर छोटा बाहरी दाग है जो सेवा पर असर नहीं डालता।",
      target: {
        category: "OTHER",
        severity: "LOW",
        object: "queue_display",
        condition: "minor_wear",
        evidence: [
          "queue display has a small cosmetic blemish that does not affect its service",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "OTHER",
        object: "unknown",
        condition: "unspecified",
        severity: "LOW",
        evidence: ["छोटा बाहरी दाग"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "sign",
        condition: "minor_damage",
        evidence: [
          "sign has a small external stain that does not affect service",
        ],
      },
      fineTunedPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "maintenance_office",
        condition: "minor_wear",
        evidence: [
          "maintenance office has a minor external mark on its visible surface without service impact",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "maintenance_station",
        condition: "minor_wear",
        evidence: [
          "maintenance station has a minor cosmetic scratch that does not affect service",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "OTHER", "object": "unknown", "condition": "unspecified", "severity": "LOW", "evidence": ["छोटा बाहरी दाग"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "sign", "condition": "minor_damage", "evidence": ["sign has a small external stain that does not affect service"]}',
        fine_tuned_seed42:
          '{"category": "OTHER", "severity": "LOW", "object": "maintenance_office", "condition": "minor_wear", "evidence": ["maintenance office has a minor external mark on its visible surface without service impact"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "maintenance_station", "condition": "minor_wear", "evidence": ["maintenance station has a minor cosmetic scratch that does not affect service"]}',
      },
    },
    {
      id: "v3-test-accessibility-2-5-2",
      note: "Vaapas aate hue mila: sugam lakdi ka rasta ka barrier locked hai, wheelchair kisi bhi route se facility nahi pahunch sakti. Facts note karo.",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "mobility_boardwalk",
        condition: "major_obstruction",
        evidence: [
          "mobility boardwalk has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "barrier",
        condition: "blocked",
        severity: "HIGH",
        evidence: [
          "sugam lakdi ka rasta ka barrier locked hai",
          "wheelchair kisi bhi route se facility nahi pahunch sakti",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "access_path",
        condition: "major_obstruction",
        evidence: [
          "access path barrier is locked, wheelchair cannot reach facility from any route",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_path",
        condition: "major_obstruction",
        evidence: [
          "accessible path has a locked obstruction preventing wheelchair access from any route",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_path",
        condition: "major_obstruction",
        evidence: [
          "accessible path has a locked obstruction making the facility unusable for any route; no alternative is available",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "barrier", "condition": "blocked", "severity": "HIGH", "evidence": ["sugam lakdi ka rasta ka barrier locked hai", "wheelchair kisi bhi route se facility nahi pahunch sakti"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "access_path", "condition": "major_obstruction", "evidence": ["access path barrier is locked, wheelchair cannot reach facility from any route"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_path", "condition": "major_obstruction", "evidence": ["accessible path has a locked obstruction preventing wheelchair access from any route"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_path", "condition": "major_obstruction", "evidence": ["accessible path has a locked obstruction making the facility unusable for any route; no alternative is available"]}',
      },
    },
    {
      id: "v3-test-signage-3-5-2",
      note: "Maintenance desk zara dekho. evacuation marker bheed ko burning passage mein bhejta hai, log isi instant ghus rahe.",
      target: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "evacuation_marker",
        condition: "immediate_danger",
        evidence: [
          "evacuation marker sends a crowd into a burning passage they are entering at this instant",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "evacuation_marker",
        condition: "improper_placement",
        evidence: [
          "evacuation marker directs crowd into burning passage, people are entering at this moment",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "fire_exit",
        condition: "immediate_danger",
        evidence: [
          "fire exit directs a crowd into a burning passage; people are following it now",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "fire_exit",
        condition: "immediate_danger",
        evidence: [
          "fire exit directs a crowd into a burning passage and people are following it right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "safety",\n  "object": "evacuation_marker",\n  "condition": "misplaced",\n  "severity": "high",\n  "evidence": [\n    "evacuation marker bheed ko burning passage mein bhejta hai",\n    "log isi instant ghus rahe"\n  ]\n}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "evacuation_marker", "condition": "improper_placement", "evidence": ["evacuation marker directs crowd into burning passage, people are entering at this moment"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "fire_exit", "condition": "immediate_danger", "evidence": ["fire exit directs a crowd into a burning passage; people are following it now"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "fire_exit", "condition": "immediate_danger", "evidence": ["fire exit directs a crowd into a burning passage and people are following it right now"]}',
      },
    },
    {
      id: "v3-test-trail-2-6-2",
      note: "Maintenance desk zara dekho. maidan ka kachcha track par landslip poora hiking route block karta, sabko return karna padta.",
      target: {
        category: "TRAIL",
        severity: "HIGH",
        object: "moorland_track",
        condition: "major_obstruction",
        evidence: [
          "moorland track has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "mud_track",
        condition: "major_obstruction",
        evidence: [
          "mud track has a landslip blocking the entire hiking route, forcing everyone to return",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "walking_track",
        condition: "major_obstruction",
        evidence: [
          "unpaved walking track has a landslip blocking the whole hiking route; hikers have to turn back",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "forest_track",
        condition: "major_obstruction",
        evidence: [
          "forest track has a landslip blocking the whole hiking route and forcing hikers to return",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "trail", "object": "track", "condition": "blocked", "severity": "high", "evidence": ["landslide completely blocks hiking route", "hiking route blocked"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "HIGH", "object": "mud_track", "condition": "major_obstruction", "evidence": ["mud track has a landslip blocking the entire hiking route, forcing everyone to return"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "HIGH", "object": "walking_track", "condition": "major_obstruction", "evidence": ["unpaved walking track has a landslip blocking the whole hiking route; hikers have to turn back"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "HIGH", "object": "forest_track", "condition": "major_obstruction", "evidence": ["forest track has a landslip blocking the whole hiking route and forcing hikers to return"]}',
      },
    },
    {
      id: "v3-test-infrastructure-0-6-0",
      note: "Maintenance desk, can you look at this? road culvert shows chipped paint while all parts remain solid and usable.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "road_culvert",
        condition: "minor_wear",
        evidence: [
          "road culvert shows chipped paint while all parts remain solid and usable",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "road_culvert",
        condition: "chipped_paint",
        severity: "LOW",
        evidence: [
          "road culvert shows chipped paint",
          "all parts remain solid and usable",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "road_culvert",
        condition: "cosmetic_damage",
        evidence: [
          "road culvert shows chipped paint while all parts remain solid and usable",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "road_culvert",
        condition: "minor_wear",
        evidence: [
          "road culvert shows chipped paint while all parts remain solid and usable",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "road_culvert",
        condition: "minor_wear",
        evidence: [
          "road culvert shows chipped paint while all parts remain solid and usable",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "road_culvert",\n  "condition": "chipped_paint",\n  "severity": "LOW",\n  "evidence": [\n    "road culvert shows chipped paint",\n    "all parts remain solid and usable"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "road_culvert", "condition": "cosmetic_damage", "evidence": ["road culvert shows chipped paint while all parts remain solid and usable"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "road_culvert", "condition": "minor_wear", "evidence": ["road culvert shows chipped paint while all parts remain solid and usable"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "road_culvert", "condition": "minor_wear", "evidence": ["road culvert shows chipped paint while all parts remain solid and usable"]}',
      },
    },
    {
      id: "v3-test-environment-2-5-2",
      note: "Vaapas aate hue mila: muhane ka kinara mein storm damage hai, heavy unstable mass walkway par hai. Facts note karo.",
      target: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "estuary_edge",
        condition: "major_obstruction",
        evidence: [
          "estuary edge has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "walkway",
        condition: "unstable",
        severity: "HIGH",
        evidence: ["storm damage", "heavy unstable mass walkway par hai"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "building_facade",
        condition: "structural_damage",
        evidence: [
          "storm damage is present on the building facade, heavy unstable mass is on the walkway",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "public_stair",
        condition: "major_obstruction",
        evidence: [
          "public stair has a storm-damaged edge with a heavy unstable mass across the walkway",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "public_stair",
        condition: "major_obstruction",
        evidence: [
          "public stair has a storm-damaged edge with a heavy unstable mass across the walkway",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "walkway", "condition": "unstable", "severity": "HIGH", "evidence": ["storm damage", "heavy unstable mass walkway par hai"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "building_facade", "condition": "structural_damage", "evidence": ["storm damage is present on the building facade, heavy unstable mass is on the walkway"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "public_stair", "condition": "major_obstruction", "evidence": ["public stair has a storm-damaged edge with a heavy unstable mass across the walkway"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "public_stair", "condition": "major_obstruction", "evidence": ["public stair has a storm-damaged edge with a heavy unstable mass across the walkway"]}',
      },
    },
    {
      id: "v3-test-lighting-2-6-0",
      note: "Maintenance desk, can you look at this? subway illumination has blacked out the entire crossing beside an unguarded drop.",
      target: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "subway_illumination",
        condition: "major_obstruction",
        evidence: [
          "subway illumination has blacked out the entire crossing beside an unguarded drop",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "public_lamp",
        condition: "failed",
        severity: "HIGH",
        evidence: ["subway illumination has blacked out", "unguarded drop"],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "subway_illumination",
        condition: "complete_failure",
        evidence: [
          "subway illumination has blacked out the entire crossing beside an unguarded drop",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "subway_light",
        condition: "immediate_danger",
        evidence: [
          "subway lighting has blacked out the entire crossing beside an unguarded drop",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "subway_light",
        condition: "immediate_danger",
        evidence: [
          "subway light has gone out leaving an unprotected drop beside the whole crossing",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "LIGHTING",\n  "object": "public_lamp",\n  "condition": "failed",\n  "severity": "HIGH",\n  "evidence": [\n    "subway illumination has blacked out",\n    "unguarded drop"\n  ]\n}',
        few_shot:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "subway_illumination", "condition": "complete_failure", "evidence": ["subway illumination has blacked out the entire crossing beside an unguarded drop"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "subway_light", "condition": "immediate_danger", "evidence": ["subway lighting has blacked out the entire crossing beside an unguarded drop"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "subway_light", "condition": "immediate_danger", "evidence": ["subway light has gone out leaving an unprotected drop beside the whole crossing"]}',
      },
    },
    {
      id: "v3-test-environment-1-5-2",
      note: "Maintenance desk zara dekho. muhane ka kinara mein plants damaged aur paani dirty hai, major hazard ka signal nahi.",
      target: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "estuary_edge",
        condition: "maintenance_needed",
        evidence: [
          "estuary edge shows damaged plants and dirty water; nothing indicates a major hazard",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "area",
        condition: "dirty_water",
        severity: "MEDIUM",
        evidence: ["paani dirty hai"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "planting_area",
        condition: "damage_and_pollution",
        evidence: ["plants damaged and water is dirty, no major hazard signal"],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "pond_edge",
        condition: "maintenance_needed",
        evidence: [
          "pond edge has damaged vegetation and contaminated water; no major hazard is reported",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "pond_edge",
        condition: "maintenance_needed",
        evidence: [
          "pond edge has damaged vegetation and contaminated water, without a major hazard being present",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "area", "condition": "dirty_water", "severity": "MEDIUM", "evidence": ["paani dirty hai"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "planting_area", "condition": "damage_and_pollution", "evidence": ["plants damaged and water is dirty, no major hazard signal"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "pond_edge", "condition": "maintenance_needed", "evidence": ["pond edge has damaged vegetation and contaminated water; no major hazard is reported"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "pond_edge", "condition": "maintenance_needed", "evidence": ["pond edge has damaged vegetation and contaminated water, without a major hazard being present"]}',
      },
    },
    {
      id: "v3-test-environment-3-5-1",
      note: "देखभाल कार्यालय, इसे देखें। मुहाने का किनारा अचानक बाढ़ में बह रहा है और लोग उसके साथ बह रहे हैं।",
      target: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "estuary_edge",
        condition: "immediate_danger",
        evidence: [
          "estuary edge is being swept away in a flash flood carrying people with it",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "flooded_entrance",
        condition: "flooding",
        severity: "CRITICAL",
        evidence: [
          "मुहाने का किनारा अचानक बाढ़ में बह रहा है",
          "लोग उसके साथ बह रहे हैं",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "flooded_entryway",
        condition: "imminent_hazard",
        evidence: [
          "entryway edge is suddenly flooding and people are being swept away",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "entrance",
        condition: "immediate_danger",
        evidence: [
          "entrance has a suddenly flooded edge with people being swept into it",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "entrance",
        condition: "immediate_danger",
        evidence: [
          "entrance has a sudden flood and people are being swept with it",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "flooded_entrance", "condition": "flooding", "severity": "CRITICAL", "evidence": ["मुहाने का किनारा अचानक बाढ़ में बह रहा है", "लोग उसके साथ बह रहे हैं"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "flooded_entryway", "condition": "imminent_hazard", "evidence": ["entryway edge is suddenly flooding and people are being swept away"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "entrance", "condition": "immediate_danger", "evidence": ["entrance has a suddenly flooded edge with people being swept into it"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "entrance", "condition": "immediate_danger", "evidence": ["entrance has a sudden flood and people are being swept with it"]}',
      },
    },
    {
      id: "v3-test-signage-0-5-1",
      note: "वापसी पर यह मिला: निकासी चिह्न के कोने पर खरोंच है; हर दिशा अभी समझ आती है। तथ्य दर्ज करें।",
      target: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "evacuation_marker",
        condition: "minor_wear",
        evidence: [
          "evacuation marker has a scratched corner; every direction can still be understood",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "sign",
        condition: "damaged",
        severity: "LOW",
        evidence: ["खरोंच है"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "signage",
        condition: "minor_damage",
        evidence: [
          "exits sign corner has a scratch; all directions are still understandable",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "exit_sign",
        condition: "minor_wear",
        evidence: [
          "exit sign has a corner scratch; all directions remain visible now; record the fact",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "exit_sign",
        condition: "minor_wear",
        evidence: [
          "exit sign has a corner scratch; all directions are still visible now; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "sign", "condition": "damaged", "severity": "LOW", "evidence": ["खरोंच है"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "signage", "condition": "minor_damage", "evidence": ["exits sign corner has a scratch; all directions are still understandable"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "exit_sign", "condition": "minor_wear", "evidence": ["exit sign has a corner scratch; all directions remain visible now; record the fact"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "exit_sign", "condition": "minor_wear", "evidence": ["exit sign has a corner scratch; all directions are still visible now; record the fact"]}',
      },
    },
    {
      id: "v3-test-other-1-5-2",
      note: "Maintenance desk zara dekho. public timer visitors ke liye kaam nahi karta, servicing chahiye, khatra nahi bataya.",
      target: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "public_timer",
        condition: "maintenance_needed",
        evidence: [
          "public timer no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "public_timer",
        condition: "malfunctioning",
        severity: "MEDIUM",
        evidence: [
          "public timer visitors ke liye kaam nahi karta",
          "servicing chahiye",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "public_timer",
        condition: "maintenance_needed",
        evidence: [
          "public timer is not working for visitors, needs servicing, no danger stated",
        ],
      },
      fineTunedPrediction: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "maintenance_desk",
        condition: "maintenance_needed",
        evidence: [
          "maintenance desk needs attention; the public timer is unusable for visitors and no danger is stated",
        ],
      },
      secondSeedPrediction: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "maintenance_desk",
        condition: "maintenance_needed",
        evidence: [
          "maintenance desk needs servicing and does not work for visitors; no danger is stated",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "public_timer", "condition": "malfunctioning", "severity": "MEDIUM", "evidence": ["public timer visitors ke liye kaam nahi karta", "servicing chahiye"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "public_timer", "condition": "maintenance_needed", "evidence": ["public timer is not working for visitors, needs servicing, no danger stated"]}',
        fine_tuned_seed42:
          '{"category": "OTHER", "severity": "MEDIUM", "object": "maintenance_desk", "condition": "maintenance_needed", "evidence": ["maintenance desk needs attention; the public timer is unusable for visitors and no danger is stated"]}',
        fine_tuned_seed1729:
          '{"category": "OTHER", "severity": "MEDIUM", "object": "maintenance_desk", "condition": "maintenance_needed", "evidence": ["maintenance desk needs servicing and does not work for visitors; no danger is stated"]}',
      },
    },
    {
      id: "v3-test-cleanliness-2-5-1",
      note: "वापसी पर यह मिला: सार्वजनिक आंगन पर घुटनों जितना कचरा एकमात्र रास्ते पर फैला है। तथ्य दर्ज करें।",
      target: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "public_courtyard",
        condition: "major_obstruction",
        evidence: [
          "public courtyard has a knee-high pile of refuse across the sole way through",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "public_area",
        condition: "littering",
        evidence: [
          "public area has litter scattered on the only path, as much as knee-high",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "public_garden",
        condition: "major_obstruction",
        evidence: [
          "public garden has a pile of waste as large as a knee covering the only passage; the fact is recorded",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "public_garden",
        condition: "major_obstruction",
        evidence: [
          "public garden has loose waste covering the only passage, with no usable route left",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "cleanliness", "object": "waste_bin", "condition": "overflowing", "severity": "HIGH", "evidence": ["kachra ekamata raste par phila hai", "sarvajanik angan par ghutnon jitna kachra"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "public_area", "condition": "littering", "evidence": ["public area has litter scattered on the only path, as much as knee-high"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "public_garden", "condition": "major_obstruction", "evidence": ["public garden has a pile of waste as large as a knee covering the only passage; the fact is recorded"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "public_garden", "condition": "major_obstruction", "evidence": ["public garden has loose waste covering the only passage, with no usable route left"]}',
      },
    },
    {
      id: "v3-test-accessibility-3-5-2",
      note: "Maintenance desk zara dekho. sugam lakdi ka rasta steep drop ki taraf palat raha, disabled visitor abhi us par hai.",
      target: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "mobility_boardwalk",
        condition: "immediate_danger",
        evidence: [
          "mobility boardwalk is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "path",
        condition: "steep_drop",
        severity: "HIGH",
        evidence: [
          "sugam lakdi ka rasta steep drop ki taraf palat raha",
          "disabled visitor abhi us par hai",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "tactile_path",
        condition: "major_obstruction",
        evidence: [
          "tactile path is turning towards a steep drop, disabled visitor is currently on it",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_path",
        condition: "major_obstruction",
        evidence: [
          "accessible wooden path has a steep drop and a walker is on it now",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_path",
        condition: "major_obstruction",
        evidence: [
          "accessible wooden path has a steep drop and a walker is on it now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "ACCESSIBILITY",\n  "object": "path",\n  "condition": "steep_drop",\n  "severity": "HIGH",\n  "evidence": [\n    "sugam lakdi ka rasta steep drop ki taraf palat raha",\n    "disabled visitor abhi us par hai"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "tactile_path", "condition": "major_obstruction", "evidence": ["tactile path is turning towards a steep drop, disabled visitor is currently on it"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_path", "condition": "major_obstruction", "evidence": ["accessible wooden path has a steep drop and a walker is on it now"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_path", "condition": "major_obstruction", "evidence": ["accessible wooden path has a steep drop and a walker is on it now"]}',
      },
    },
    {
      id: "v3-test-signage-3-6-2",
      note: "Vaapas aate hue mila: doosre raste ka panel bheed ko burning passage mein bhejta hai, log isi instant ghus rahe. Facts note karo.",
      target: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "detour_panel",
        condition: "immediate_danger",
        evidence: [
          "detour panel sends a crowd into a burning passage they are entering at this instant",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "panel",
        condition: "blocking_passage",
        severity: "HIGH",
        evidence: [
          "doosre raste ka panel bheed ko burning passage mein bhejta hai",
          "log isi instant ghus rahe",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "sign_board",
        condition: "misleading_information",
        evidence: [
          "sign board directs crowd into burning passage, people are entering this instant",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "exit_sign",
        condition: "immediate_danger",
        evidence: [
          "exit sign directs walkers into a burning passage with people entering it now",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "exit_sign",
        condition: "immediate_danger",
        evidence: [
          "exit sign directs a crowd into a burning passage and people are using it right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "panel",\n  "condition": "blocking_passage",\n  "severity": "HIGH",\n  "evidence": [\n    "doosre raste ka panel bheed ko burning passage mein bhejta hai",\n    "log isi instant ghus rahe"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "sign_board", "condition": "misleading_information", "evidence": ["sign board directs crowd into burning passage, people are entering this instant"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "CRITICAL", "object": "exit_sign", "condition": "immediate_danger", "evidence": ["exit sign directs walkers into a burning passage with people entering it now"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "CRITICAL", "object": "exit_sign", "condition": "immediate_danger", "evidence": ["exit sign directs a crowd into a burning passage and people are using it right now"]}',
      },
    },
    {
      id: "v3-test-accessibility-2-6-1",
      note: "देखभाल कार्यालय, इसे देखें। सुगम भूमिगत मार्ग का अवरोध बंद है; व्हीलचेयर किसी भी मार्ग से सुविधा नहीं पहुंच सकती।",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_underpass",
        condition: "major_obstruction",
        evidence: [
          "accessible underpass has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "subway_entrance",
        condition: "obstructed",
        severity: "HIGH",
        evidence: [
          "सुगम भूमिगत मार्ग का अवरोध बंद है",
          "व्हीलचेयर किसी भी मार्ग से सुविधा नहीं पहुंच सकती",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "underground_path",
        condition: "major_obstruction",
        evidence: [
          "accessible underground path is blocked; wheelchair cannot access any path",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_path",
        condition: "major_obstruction",
        evidence: [
          "accessible path has a major obstruction; no wheelchair user can use any route",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_underground_path",
        condition: "major_obstruction",
        evidence: [
          "accessible underground path has a major obstruction; no wheelchair user can use it",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "subway_entrance", "condition": "obstructed", "severity": "HIGH", "evidence": ["सुगम भूमिगत मार्ग का अवरोध बंद है", "व्हीलचेयर किसी भी मार्ग से सुविधा नहीं पहुंच सकती"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "underground_path", "condition": "major_obstruction", "evidence": ["accessible underground path is blocked; wheelchair cannot access any path"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_path", "condition": "major_obstruction", "evidence": ["accessible path has a major obstruction; no wheelchair user can use any route"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_underground_path", "condition": "major_obstruction", "evidence": ["accessible underground path has a major obstruction; no wheelchair user can use it"]}',
      },
    },
    {
      id: "v3-test-cleanliness-0-5-0",
      note: "Encountered this on my return: public courtyard has just two wrappers at its foot, away from people's way. Please record the facts.",
      target: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_courtyard",
        condition: "minor_wear",
        evidence: [
          "public courtyard has just two wrappers at its foot, away from people's way",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_courtyard",
        condition: "minor_wear",
        evidence: [
          "public courtyard has just two wrappers at its foot, away from people's way",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_courtyard",
        condition: "minor_wear",
        evidence: [
          "public courtyard has just two wrappers at its foot, away from people's way",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_courtyard",
        condition: "minor_wear",
        evidence: [
          "public courtyard has just two wrappers at its foot, away from people's way",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "cleanliness", "object": "waste_bin", "condition": "overflowing", "severity": "LOW", "evidence": ["public courtyard has just two wrappers at its foot", "away from people\'s way"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "public_courtyard", "condition": "minor_wear", "evidence": ["public courtyard has just two wrappers at its foot, away from people\'s way"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "public_courtyard", "condition": "minor_wear", "evidence": ["public courtyard has just two wrappers at its foot, away from people\'s way"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "public_courtyard", "condition": "minor_wear", "evidence": ["public courtyard has just two wrappers at its foot, away from people\'s way"]}',
      },
    },
    {
      id: "v3-test-infrastructure-2-5-2",
      note: "Vaapas aate hue mila: paidal platform alag toot gaya, paidal crossing ki jagah nahi bachi. Facts note karo.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "pedestrian_platform",
        condition: "major_obstruction",
        evidence: [
          "pedestrian platform has split apart, leaving no usable crossing for pedestrians",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "pedestrian_crossing",
        condition: "missing",
        severity: "HIGH",
        evidence: [
          "paidal platform alag toot gaya",
          "paidal crossing ki jagah nahi bachi",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "pedestrian_platform",
        condition: "major_obstruction",
        evidence: [
          "pedestrian platform separated and broken, no pedestrian crossing remains",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "footbridge",
        condition: "major_obstruction",
        evidence: [
          "footbridge has a broken platform with no usable pedestrian crossing remains",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "footbridge",
        condition: "major_obstruction",
        evidence: [
          "footbridge has a major structural failure and no pedestrian crossing remains",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "pedestrian_crossing",\n  "condition": "missing",\n  "severity": "HIGH",\n  "evidence": [\n    "paidal platform alag toot gaya",\n    "paidal crossing ki jagah nahi bachi"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "pedestrian_platform", "condition": "major_obstruction", "evidence": ["pedestrian platform separated and broken, no pedestrian crossing remains"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "footbridge", "condition": "major_obstruction", "evidence": ["footbridge has a broken platform with no usable pedestrian crossing remains"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "footbridge", "condition": "major_obstruction", "evidence": ["footbridge has a major structural failure and no pedestrian crossing remains"]}',
      },
    },
    {
      id: "v3-test-other-1-6-2",
      note: "Vaapas aate hue mila: queue display visitors ke liye kaam nahi karta, servicing chahiye, khatra nahi bataya. Facts note karo.",
      target: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "queue_display",
        condition: "maintenance_needed",
        evidence: [
          "queue display no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "queue_display",
        condition: "malfunctioning",
        severity: "MEDIUM",
        evidence: [
          "queue display visitors ke liye kaam nahi karta",
          "servicing chahiye",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "queue_display",
        condition: "maintenance_needed",
        evidence: [
          "queue display is not working for visitors, needs servicing, no danger stated",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "queue_display",
        condition: "maintenance_needed",
        evidence: [
          "queue display is unusable for visitors and needs servicing; no danger is stated",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "queue_display",
        condition: "maintenance_needed",
        evidence: [
          "queue display is not working for visitors and needs servicing; no danger is stated",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "queue_display",\n  "condition": "malfunctioning",\n  "severity": "MEDIUM",\n  "evidence": [\n    "queue display visitors ke liye kaam nahi karta",\n    "servicing chahiye"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "queue_display", "condition": "maintenance_needed", "evidence": ["queue display is not working for visitors, needs servicing, no danger stated"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "queue_display", "condition": "maintenance_needed", "evidence": ["queue display is unusable for visitors and needs servicing; no danger is stated"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "queue_display", "condition": "maintenance_needed", "evidence": ["queue display is not working for visitors and needs servicing; no danger is stated"]}',
      },
    },
    {
      id: "v3-test-cleanliness-0-6-1",
      note: "देखभाल कार्यालय, इसे देखें। नहर की सीढ़ियां के पास सिर्फ दो खाली पैकेट हैं जो चलने में नहीं आते।",
      target: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "canal_steps",
        condition: "minor_wear",
        evidence: [
          "canal steps has just two wrappers at its foot, away from people's way",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "waste_bin",
        condition: "empty",
        severity: "LOW",
        evidence: [
          "नहर की सीढ़ियां के पास सिर्फ दो खाली पैकेट हैं जो चलने में नहीं आते",
        ],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "waste_bin",
        condition: "minor_wear",
        evidence: [
          "two empty packets near the steps of the canal are not usable for walking",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "drain_curb",
        condition: "minor_wear",
        evidence: [
          "drain curb has only two empty packages beside its steps that don't obstruct passage",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "maintenance_office",
        condition: "minor_wear",
        evidence: [
          "maintenance office has only two empty packages beside its steps that are unusable",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "waste_bin", "condition": "empty", "severity": "LOW", "evidence": ["नहर की सीढ़ियां के पास सिर्फ दो खाली पैकेट हैं जो चलने में नहीं आते"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "waste_bin", "condition": "minor_wear", "evidence": ["two empty packets near the steps of the canal are not usable for walking"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "drain_curb", "condition": "minor_wear", "evidence": ["drain curb has only two empty packages beside its steps that don\'t obstruct passage"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "maintenance_office", "condition": "minor_wear", "evidence": ["maintenance office has only two empty packages beside its steps that are unusable"]}',
      },
    },
    {
      id: "v3-test-accessibility-0-6-0",
      note: "Maintenance desk, can you look at this? accessible underpass has a scuffed coating, yet mobility aids move over it without trouble.",
      target: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "accessible_underpass",
        condition: "minor_wear",
        evidence: [
          "accessible underpass has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "underpass",
        condition: "cosmetic_damage",
        evidence: [
          "accessible underpass has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "accessible_underpass",
        condition: "minor_wear",
        evidence: [
          "accessible underpass has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "accessible_underpass",
        condition: "minor_wear",
        evidence: [
          "accessible underpass has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "accessibility",\n  "object": "underpass",\n  "condition": "scuffed_coating",\n  "severity": "low",\n  "evidence": [\n    "accessible underpass has a scuffed coating",\n    "mobility aids move over it without trouble"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "underpass", "condition": "cosmetic_damage", "evidence": ["accessible underpass has a scuffed coating, yet mobility aids move over it without trouble"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "accessible_underpass", "condition": "minor_wear", "evidence": ["accessible underpass has a scuffed coating, yet mobility aids move over it without trouble"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "accessible_underpass", "condition": "minor_wear", "evidence": ["accessible underpass has a scuffed coating, yet mobility aids move over it without trouble"]}',
      },
    },
    {
      id: "v3-test-accessibility-0-5-1",
      note: "वापसी पर यह मिला: सुगम लकड़ी मार्ग का लेप घिसा है, चलने के सहायक साधन बिना दिक्कत निकलते हैं। तथ्य दर्ज करें।",
      target: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "mobility_boardwalk",
        condition: "minor_wear",
        evidence: [
          "mobility boardwalk has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "TRAIL",
        object: "path_surface",
        condition: "deteriorated",
        severity: "HIGH",
        evidence: [
          "सुगम लकड़ी मार्ग का लेप घिसा है",
          "चलने के सहायक साधन बिना दिक्कत निकलते हैं",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "tactile_path",
        condition: "minor_wear",
        evidence: [
          "tactile path is worn out, walking aids can exit without difficulty",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "accessible_walking_path",
        condition: "minor_wear",
        evidence: [
          "accessible walking path has a worn surface; its helpful route remains usable without difficulty; record the fact",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "accessible_walking_path",
        condition: "minor_wear",
        evidence: [
          "accessible walking path has a worn surface; its usable route remains intact without difficulty",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "TRAIL", "object": "path_surface", "condition": "deteriorated", "severity": "HIGH", "evidence": ["सुगम लकड़ी मार्ग का लेप घिसा है", "चलने के सहायक साधन बिना दिक्कत निकलते हैं"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "tactile_path", "condition": "minor_wear", "evidence": ["tactile path is worn out, walking aids can exit without difficulty"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "accessible_walking_path", "condition": "minor_wear", "evidence": ["accessible walking path has a worn surface; its helpful route remains usable without difficulty; record the fact"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "accessible_walking_path", "condition": "minor_wear", "evidence": ["accessible walking path has a worn surface; its usable route remains intact without difficulty"]}',
      },
    },
    {
      id: "v3-test-infrastructure-0-6-1",
      note: "देखभाल कार्यालय, इसे देखें। सड़क की पुलिया पर रंग उखड़ा है, सभी हिस्से मजबूत और काम के हैं।",
      target: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "road_culvert",
        condition: "minor_wear",
        evidence: [
          "road culvert shows chipped paint while all parts remain solid and usable",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "street_sign",
        condition: "peeling",
        severity: "LOW",
        evidence: ["पुलिया पर रंग उखड़ा है"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "street_sign",
        condition: "minor_damage",
        evidence: [
          "street sign has faded color, all parts are strong and functional",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "street_curb",
        condition: "minor_wear",
        evidence: [
          "street curb has faded paint; all parts remain intact and usable",
        ],
      },
      secondSeedPrediction: null,
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "street_sign", "condition": "peeling", "severity": "LOW", "evidence": ["पुलिया पर रंग उखड़ा है"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "street_sign", "condition": "minor_damage", "evidence": ["street sign has faded color, all parts are strong and functional"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "street_curb", "condition": "minor_wear", "evidence": ["street curb has faded paint; all parts remain intact and usable"]}',
        fine_tuned_seed1729:
          '{"category": "MAINTENANCE", "severity": "LOW", "object": "street_curb", "condition": "minor_wear", "evidence": ["street curb has faded paint; all parts remain intact and functional"]}',
      },
    },
    {
      id: "v3-test-safety-1-5-2",
      note: "Maintenance desk zara dekho. construction ka gaddha ka outer guard repair chahiye, sparks ya doosra hazard nahi bataya.",
      target: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "construction_shaft",
        condition: "maintenance_needed",
        evidence: [
          "construction shaft needs its outer guard repaired; there are no sparks or other reported hazards",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "construction_site",
        condition: "inadequate_protection",
        severity: "MEDIUM",
        evidence: [
          "construction ka gaddha ka outer guard repair chahiye",
          "sparks ya doosra hazard nahi bataya",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "construction_site",
        condition: "maintenance_needed",
        evidence: [
          "construction site's outer guard needs repair, no sparks or other hazards mentioned",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "construction_cage",
        condition: "maintenance_needed",
        evidence: [
          "construction cage has a damaged outer guard needing repair; no sparks or other hazard is reported",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "construction_cage",
        condition: "maintenance_needed",
        evidence: [
          "construction cage has an unprotected exposed edge needing repair; no sparks or other hazard is reported",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "construction_site",\n  "condition": "inadequate_protection",\n  "severity": "MEDIUM",\n  "evidence": [\n    "construction ka gaddha ka outer guard repair chahiye",\n    "sparks ya doosra hazard nahi bataya"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "construction_site", "condition": "maintenance_needed", "evidence": ["construction site\'s outer guard needs repair, no sparks or other hazards mentioned"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "construction_cage", "condition": "maintenance_needed", "evidence": ["construction cage has a damaged outer guard needing repair; no sparks or other hazard is reported"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "construction_cage", "condition": "maintenance_needed", "evidence": ["construction cage has an unprotected exposed edge needing repair; no sparks or other hazard is reported"]}',
      },
    },
    {
      id: "v3-test-environment-2-5-0",
      note: "Encountered this on my return: estuary edge has storm damage leaving a heavy unstable mass over the walkway. Please record the facts.",
      target: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "estuary_edge",
        condition: "major_obstruction",
        evidence: [
          "estuary edge has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "walkway",
        condition: "unstable",
        severity: "HIGH",
        evidence: ["storm damage", "heavy unstable mass", "over the walkway"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "estuary_edge",
        condition: "structural_damage",
        evidence: [
          "estuary edge has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "estuary_edge",
        condition: "major_obstruction",
        evidence: [
          "estuary edge has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "estuary_edge",
        condition: "major_obstruction",
        evidence: [
          "estuary edge has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "walkway",\n  "condition": "unstable",\n  "severity": "HIGH",\n  "evidence": [\n    "storm damage",\n    "heavy unstable mass",\n    "over the walkway"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "estuary_edge", "condition": "structural_damage", "evidence": ["estuary edge has storm damage leaving a heavy unstable mass over the walkway"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "HIGH", "object": "estuary_edge", "condition": "major_obstruction", "evidence": ["estuary edge has storm damage leaving a heavy unstable mass over the walkway"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "HIGH", "object": "estuary_edge", "condition": "major_obstruction", "evidence": ["estuary edge has storm damage leaving a heavy unstable mass over the walkway"]}',
      },
    },
    {
      id: "v3-test-lighting-2-5-1",
      note: "वापसी पर यह मिला: घाट की रोशनी पूरा पार का रास्ता अंधेरा करता है जो खुले गहरे किनारे के पास है। तथ्य दर्ज करें।",
      target: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "quayside_beacon",
        condition: "major_obstruction",
        evidence: [
          "quayside beacon has blacked out the entire crossing beside an unguarded drop",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "lamp",
        condition: "malfunctioning",
        severity: "HIGH",
        evidence: [
          "घाट की रोशनी पूरा पार का रास्ता अंधेरा करता है",
          "खुले गहरे किनारे के पास है",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "street_light",
        condition: "major_obstruction",
        evidence: [
          "street light creates darkness over the entire crossing path near the open deep edge",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "bridge_light",
        condition: "major_obstruction",
        evidence: [
          "bridge light leaves the whole crossing in darkness beside an unprotected deep edge",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "bridge_light",
        condition: "major_obstruction",
        evidence: [
          "bridge light leaves the whole crossing in darkness beside an unprotected deep edge; the danger is recorded",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "lamp", "condition": "malfunctioning", "severity": "HIGH", "evidence": ["घाट की रोशनी पूरा पार का रास्ता अंधेरा करता है", "खुले गहरे किनारे के पास है"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "street_light", "condition": "major_obstruction", "evidence": ["street light creates darkness over the entire crossing path near the open deep edge"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "bridge_light", "condition": "major_obstruction", "evidence": ["bridge light leaves the whole crossing in darkness beside an unprotected deep edge"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "bridge_light", "condition": "major_obstruction", "evidence": ["bridge light leaves the whole crossing in darkness beside an unprotected deep edge; the danger is recorded"]}',
      },
    },
    {
      id: "v3-test-safety-2-5-2",
      note: "Vaapas aate hue mila: construction ka gaddha ka barrier hat gaya, passerby ko serious fall ka risk hai. Facts note karo.",
      target: {
        category: "SAFETY",
        severity: "HIGH",
        object: "construction_shaft",
        condition: "major_obstruction",
        evidence: [
          "construction shaft has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "barrier",
        condition: "missing",
        severity: "HIGH",
        evidence: [
          "construction ka gaddha ka barrier hat gaya",
          "passerby ko serious fall ka risk hai",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "construction_site",
        condition: "barrier_missing",
        evidence: [
          "construction site barrier has fallen, passerby is at risk of serious fall",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "construction_barrier",
        condition: "major_obstruction",
        evidence: [
          "construction barrier has given way leaving a passerby exposed to a serious fall hazard",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "construction_barrier",
        condition: "major_obstruction",
        evidence: [
          "construction barrier has given way leaving a passerby exposed to a serious fall",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "barrier", "condition": "missing", "severity": "HIGH", "evidence": ["construction ka gaddha ka barrier hat gaya", "passerby ko serious fall ka risk hai"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "construction_site", "condition": "barrier_missing", "evidence": ["construction site barrier has fallen, passerby is at risk of serious fall"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "construction_barrier", "condition": "major_obstruction", "evidence": ["construction barrier has given way leaving a passerby exposed to a serious fall hazard"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "construction_barrier", "condition": "major_obstruction", "evidence": ["construction barrier has given way leaving a passerby exposed to a serious fall"]}',
      },
    },
    {
      id: "v3-test-cleanliness-3-5-1",
      note: "देखभाल कार्यालय, इसे देखें। सार्वजनिक आंगन आग में घिरा है और एक आगंतुक इसी वक्त धुएं से नहीं निकल पा रहा।",
      target: {
        category: "CLEANLINESS",
        severity: "CRITICAL",
        object: "public_courtyard",
        condition: "immediate_danger",
        evidence: [
          "public courtyard is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "public_area",
        condition: "fire_hazard",
        severity: "CRITICAL",
        evidence: [
          "सार्वजनिक आंगन आग में घिरा है",
          "एक आगंतुक इसी वक्त धुएं से नहीं निकल पा रहा",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "public_area",
        condition: "fire_hazard",
        evidence: [
          "public area is engulfed in fire and a visitor is unable to escape from smoke at this moment",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "public_garden",
        condition: "immediate_danger",
        evidence: [
          "public garden is engulfed in fire and a visitor is trapped and unable to escape the smoke now",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "public_garden",
        condition: "immediate_danger",
        evidence: [
          "public garden is engulfed in a fire and a visitor is trapped and unable to escape the smoke right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "public_area", "condition": "fire_hazard", "severity": "CRITICAL", "evidence": ["सार्वजनिक आंगन आग में घिरा है", "एक आगंतुक इसी वक्त धुएं से नहीं निकल पा रहा"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "public_area", "condition": "fire_hazard", "evidence": ["public area is engulfed in fire and a visitor is unable to escape from smoke at this moment"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "public_garden", "condition": "immediate_danger", "evidence": ["public garden is engulfed in fire and a visitor is trapped and unable to escape the smoke now"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "public_garden", "condition": "immediate_danger", "evidence": ["public garden is engulfed in a fire and a visitor is trapped and unable to escape the smoke right now"]}',
      },
    },
    {
      id: "v3-test-lighting-0-6-1",
      note: "देखभाल कार्यालय, इसे देखें। भूमिगत रोशनी थोड़ा झिलमिलाता है पर आसपास की रोशनी से पार का रास्ता साफ दिखता है।",
      target: {
        category: "LIGHTING",
        severity: "LOW",
        object: "subway_illumination",
        condition: "minor_wear",
        evidence: [
          "subway illumination flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "underground_lighting",
        condition: "flickering",
        severity: "LOW",
        evidence: ["भूमिगत रोशनी थोड़ा झिलमिलाता है"],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "underground_lighting",
        condition: "flickering",
        evidence: [
          "underground lighting is flickering but the path is clearly visible from surrounding lighting",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "underground_light",
        condition: "minor_wear",
        evidence: [
          "underground light is slightly flickering but the passage remains clearly illuminated by surrounding lighting",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "underground_light",
        condition: "minor_wear",
        evidence: [
          "underground light is slightly flickering but the passage remains clearly illuminated by surrounding lighting",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "underground_lighting", "condition": "flickering", "severity": "LOW", "evidence": ["भूमिगत रोशनी थोड़ा झिलमिलाता है"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "LOW", "object": "underground_lighting", "condition": "flickering", "evidence": ["underground lighting is flickering but the path is clearly visible from surrounding lighting"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "LOW", "object": "underground_light", "condition": "minor_wear", "evidence": ["underground light is slightly flickering but the passage remains clearly illuminated by surrounding lighting"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "LOW", "object": "underground_light", "condition": "minor_wear", "evidence": ["underground light is slightly flickering but the passage remains clearly illuminated by surrounding lighting"]}',
      },
    },
    {
      id: "v3-test-safety-0-6-1",
      note: "देखभाल कार्यालय, इसे देखें। आपात दरवाजा अव्यवस्थित दिखता है, पर रक्षक सही है और कोई खतरा खुला नहीं।",
      target: {
        category: "SAFETY",
        severity: "LOW",
        object: "emergency_hatch",
        condition: "minor_wear",
        evidence: [
          "emergency hatch looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "emergency_door",
        condition: "misaligned",
        severity: "LOW",
        evidence: ["आपात दरवाजा अव्यवस्थित दिखता है"],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "LOW",
        object: "emergency_door",
        condition: "misaligned",
        evidence: [
          "emergency door appears misaligned, but guard is present and no danger is open",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "fire_exit",
        condition: "maintenance_needed",
        evidence: [
          "fire exit seems misaligned but the guardian is intact and no exposed danger exists",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "LOW",
        object: "fire_exit",
        condition: "minor_wear",
        evidence: [
          "fire exit seems untidy, with a guardian still in place and no exposed danger",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "emergency_door", "condition": "misaligned", "severity": "LOW", "evidence": ["आपात दरवाजा अव्यवस्थित दिखता है"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "LOW", "object": "emergency_door", "condition": "misaligned", "evidence": ["emergency door appears misaligned, but guard is present and no danger is open"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "fire_exit", "condition": "maintenance_needed", "evidence": ["fire exit seems misaligned but the guardian is intact and no exposed danger exists"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "LOW", "object": "fire_exit", "condition": "minor_wear", "evidence": ["fire exit seems untidy, with a guardian still in place and no exposed danger"]}',
      },
    },
    {
      id: "v3-test-accessibility-1-6-2",
      note: "Vaapas aate hue mila: sugam underpass ke uneven patches smooth karne hain, chair phir bhi nikal jaati. Facts note karo.",
      target: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_underpass",
        condition: "maintenance_needed",
        evidence: [
          "accessible underpass has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "underpass",
        condition: "uneven_surface",
        severity: "HIGH",
        evidence: [
          "sugam underpass ke uneven patches",
          "chair phir bhi nikal jaati",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "underpass",
        condition: "uneven_surface",
        evidence: [
          "sugam underpass has uneven patches that need smoothing, wheelchair still gets stuck",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "accessible_underpass",
        condition: "maintenance_needed",
        evidence: [
          "accessible underpass has uneven patches needing smoothing; wheelchair passage remains usable",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_underpass",
        condition: "maintenance_needed",
        evidence: [
          "accessible underpass has uneven patches needing smoothing; a wheelchair still goes off the edge",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "underpass",\n  "condition": "uneven_surface",\n  "severity": "HIGH",\n  "evidence": [\n    "sugam underpass ke uneven patches",\n    "chair phir bhi nikal jaati"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "underpass", "condition": "uneven_surface", "evidence": ["sugam underpass has uneven patches that need smoothing, wheelchair still gets stuck"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "accessible_underpass", "condition": "maintenance_needed", "evidence": ["accessible underpass has uneven patches needing smoothing; wheelchair passage remains usable"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "accessible_underpass", "condition": "maintenance_needed", "evidence": ["accessible underpass has uneven patches needing smoothing; a wheelchair still goes off the edge"]}',
      },
    },
    {
      id: "v3-test-lighting-1-6-2",
      note: "Vaapas aate hue mila: underground roshni shaam baad nahi jalta, repair chahiye, dangerous consequence nahi bataya. Facts note karo.",
      target: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "subway_illumination",
        condition: "maintenance_needed",
        evidence: [
          "subway illumination stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "lamp",
        condition: "faulty",
        severity: "MEDIUM",
        evidence: [
          "underground roshni shaam baad nahi jalta",
          "repair chahiye",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "underground_light",
        condition: "maintenance_needed",
        evidence: [
          "underground light does not turn on after dark, needs repair, no dangerous consequence stated",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "underground_light",
        condition: "maintenance_needed",
        evidence: [
          "underground light does not work after dusk and needs repair; no dangerous consequence is stated",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "underground_light",
        condition: "maintenance_needed",
        evidence: [
          "underground light does not work after dark and needs repair; no dangerous consequence is stated",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "lamp", "condition": "faulty", "severity": "MEDIUM", "evidence": ["underground roshni shaam baad nahi jalta", "repair chahiye"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "underground_light", "condition": "maintenance_needed", "evidence": ["underground light does not turn on after dark, needs repair, no dangerous consequence stated"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "underground_light", "condition": "maintenance_needed", "evidence": ["underground light does not work after dusk and needs repair; no dangerous consequence is stated"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "underground_light", "condition": "maintenance_needed", "evidence": ["underground light does not work after dark and needs repair; no dangerous consequence is stated"]}',
      },
    },
    {
      id: "v3-test-environment-2-6-1",
      note: "देखभाल कार्यालय, इसे देखें। वन क्षेत्र में तूफान का नुकसान है और भारी अस्थिर चीज पैदल रास्ते पर है।",
      target: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "woodland",
        condition: "major_obstruction",
        evidence: [
          "woodland has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "ENVIRONMENT",
        object: "unknown",
        condition: "unspecified",
        severity: "HIGH",
        evidence: [
          "heavy unstable object on footpath",
          "storm damage in forest area",
        ],
      },
      fewShotPrediction: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "forest_area",
        condition: "debris_on_path",
        evidence: [
          "storm damage in the forest area; heavy unstable objects on footpath",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "forest_area",
        condition: "major_obstruction",
        evidence: [
          "forest area has storm damage with a major unstable object across the pedestrian route",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "forest_area",
        condition: "major_obstruction",
        evidence: [
          "forest area has storm damage and a major unstable object across the pedestrian route",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ENVIRONMENT", "object": "unknown", "condition": "unspecified", "severity": "HIGH", "evidence": ["heavy unstable object on footpath", "storm damage in forest area"]}',
        few_shot:
          '{"category": "ENVIRONMENT", "severity": "HIGH", "object": "forest_area", "condition": "debris_on_path", "evidence": ["storm damage in the forest area; heavy unstable objects on footpath"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "HIGH", "object": "forest_area", "condition": "major_obstruction", "evidence": ["forest area has storm damage with a major unstable object across the pedestrian route"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "HIGH", "object": "forest_area", "condition": "major_obstruction", "evidence": ["forest area has storm damage and a major unstable object across the pedestrian route"]}',
      },
    },
    {
      id: "v3-test-infrastructure-3-5-2",
      note: "Maintenance desk zara dekho. paidal platform bikhar raha hai aur pedestrians abhi gap mein gir rahe.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "pedestrian_platform",
        condition: "immediate_danger",
        evidence: [
          "pedestrian platform is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "pedestrian_path",
        condition: "cracked",
        severity: "HIGH",
        evidence: [
          "paidal platform bikhar raha hai",
          "pedestrians abhi gap mein gir rahe",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "pedestrian_platform",
        condition: "major_obstruction",
        evidence: [
          "pedestrian platform is broken and pedestrians are falling into the gap",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "footbridge",
        condition: "immediate_danger",
        evidence: [
          "footbridge has a loose platform and walkers are falling into the gap now",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "footbridge",
        condition: "immediate_danger",
        evidence: [
          "footbridge has structural failure and walkers are falling into an unprotected gap now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "pedestrian_path", "condition": "cracked", "severity": "HIGH", "evidence": ["paidal platform bikhar raha hai", "pedestrians abhi gap mein gir rahe"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "pedestrian_platform", "condition": "major_obstruction", "evidence": ["pedestrian platform is broken and pedestrians are falling into the gap"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "footbridge", "condition": "immediate_danger", "evidence": ["footbridge has a loose platform and walkers are falling into the gap now"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "footbridge", "condition": "immediate_danger", "evidence": ["footbridge has structural failure and walkers are falling into an unprotected gap now"]}',
      },
    },
    {
      id: "v3-test-cleanliness-3-6-1",
      note: "वापसी पर यह मिला: नहर की सीढ़ियां आग में घिरा है और एक आगंतुक इसी वक्त धुएं से नहीं निकल पा रहा। तथ्य दर्ज करें।",
      target: {
        category: "CLEANLINESS",
        severity: "CRITICAL",
        object: "canal_steps",
        condition: "immediate_danger",
        evidence: [
          "canal steps is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "stairs",
        condition: "on_fire",
        severity: "CRITICAL",
        evidence: [
          "नहर की सीढ़ियां आग में घिरा है",
          "एक आगंतुक इसी वक्त धुएं से निकल पा रहा",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "stairs",
        condition: "immediate_danger",
        evidence: [
          "stairs are engulfed in fire and a visitor is unable to escape the smoke at this moment",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "canal_stair",
        condition: "immediate_danger",
        evidence: [
          "canal stair is engulfed in flames and a visitor is trapped and unable to escape the smoke right now; the fact is recorded",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "canal_stair",
        condition: "immediate_danger",
        evidence: [
          "canal stair is engulfed in flames and a visitor is trapped and unable to escape right now; the fact is recorded",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "stairs", "condition": "on_fire", "severity": "CRITICAL", "evidence": ["नहर की सीढ़ियां आग में घिरा है", "एक आगंतुक इसी वक्त धुएं से निकल पा रहा"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "stairs", "condition": "immediate_danger", "evidence": ["stairs are engulfed in fire and a visitor is unable to escape the smoke at this moment"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "canal_stair", "condition": "immediate_danger", "evidence": ["canal stair is engulfed in flames and a visitor is trapped and unable to escape the smoke right now; the fact is recorded"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "canal_stair", "condition": "immediate_danger", "evidence": ["canal stair is engulfed in flames and a visitor is trapped and unable to escape right now; the fact is recorded"]}',
      },
    },
    {
      id: "v3-test-trail-1-5-0",
      note: "Maintenance desk, can you look at this? ravine footpath has shallow ruts from rain; the earth path needs maintenance but is open.",
      target: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "ravine_footpath",
        condition: "maintenance_needed",
        evidence: [
          "ravine footpath has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "footpath",
        condition: "maintenance_needed",
        evidence: [
          "ravine footpath has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "ravine_footpath",
        condition: "maintenance_needed",
        evidence: [
          "ravine footpath has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "ravine_footpath",
        condition: "maintenance_needed",
        evidence: [
          "ravine footpath has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "trail",\n  "object": "footpath",\n  "condition": "shallow_ruts",\n  "severity": "medium",\n  "evidence": [\n    "ravine footpath has shallow ruts from rain",\n    "the earth path needs maintenance"\n  ]\n}',
        few_shot:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "footpath", "condition": "maintenance_needed", "evidence": ["ravine footpath has shallow ruts from rain; the earth path needs maintenance but is open"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "ravine_footpath", "condition": "maintenance_needed", "evidence": ["ravine footpath has shallow ruts from rain; the earth path needs maintenance but is open"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "ravine_footpath", "condition": "maintenance_needed", "evidence": ["ravine footpath has shallow ruts from rain; the earth path needs maintenance but is open"]}',
      },
    },
    {
      id: "v3-test-lighting-2-5-2",
      note: "Vaapas aate hue mila: ghat ki roshni poori crossing blackout hai, bina guard ke deep drop ke paas. Facts note karo.",
      target: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "quayside_beacon",
        condition: "major_obstruction",
        evidence: [
          "quayside beacon has blacked out the entire crossing beside an unguarded drop",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "public_lamp",
        condition: "non_functioning",
        severity: "HIGH",
        evidence: [
          "roshni poori",
          "blackout hai",
          "bina guard ke deep drop ke paas",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "bridge_lighting",
        condition: "complete_blackout",
        evidence: [
          "bridge lighting is completely blacked out near deep drop without guard",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "stair_well",
        condition: "major_obstruction",
        evidence: [
          "stair well has a major obstruction with no guard rail and a deep drop beside it; the whole passage is unlit",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "stair_light",
        condition: "major_obstruction",
        evidence: [
          "stair light has a complete crossing blackout with no guard rail beside it; no safe alternative is available",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "public_lamp", "condition": "non_functioning", "severity": "HIGH", "evidence": ["roshni poori", "blackout hai", "bina guard ke deep drop ke paas"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "bridge_lighting", "condition": "complete_blackout", "evidence": ["bridge lighting is completely blacked out near deep drop without guard"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "stair_well", "condition": "major_obstruction", "evidence": ["stair well has a major obstruction with no guard rail and a deep drop beside it; the whole passage is unlit"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "stair_light", "condition": "major_obstruction", "evidence": ["stair light has a complete crossing blackout with no guard rail beside it; no safe alternative is available"]}',
      },
    },
    {
      id: "v3-test-cleanliness-2-6-2",
      note: "Maintenance desk zara dekho. nahar ki seedhiyan par ghutnon tak waste ka dher hai, wahi ek rasta tha.",
      target: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "canal_steps",
        condition: "major_obstruction",
        evidence: [
          "canal steps has a knee-high pile of refuse across the sole way through",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "waste_bin",
        condition: "excessive_accumulation",
        evidence: [
          "excessive waste accumulation on the banks of the canal, which was the only path",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "drain_covers",
        condition: "maintenance_needed",
        evidence: [
          "drain covers have a heap of dumped waste; that was the only passage",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "drain_cover",
        condition: "maintenance_needed",
        evidence: [
          "drain covers have a heap of dumped waste, leaving no passage",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "cleanliness", "object": "waste_bin", "condition": "overflowing", "severity": "high", "evidence": ["waste ka dher hai", "ek rasta tha"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "waste_bin", "condition": "excessive_accumulation", "evidence": ["excessive waste accumulation on the banks of the canal, which was the only path"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "drain_covers", "condition": "maintenance_needed", "evidence": ["drain covers have a heap of dumped waste; that was the only passage"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "drain_cover", "condition": "maintenance_needed", "evidence": ["drain covers have a heap of dumped waste, leaving no passage"]}',
      },
    },
    {
      id: "v3-test-accessibility-2-6-2",
      note: "Maintenance desk zara dekho. sugam underpass ka barrier locked hai, wheelchair kisi bhi route se facility nahi pahunch sakti.",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_underpass",
        condition: "major_obstruction",
        evidence: [
          "accessible underpass has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "barrier",
        condition: "locked",
        severity: "HIGH",
        evidence: ["wheelchair kisi bhi route se facility nahi pahunch sakti"],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "barrier",
        condition: "major_obstruction",
        evidence: [
          "sugam underpass barrier is locked, wheelchair user cannot access facility from any route",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_underpass",
        condition: "major_obstruction",
        evidence: [
          "accessible underpass has a locked barrier making the facility unusable for any route",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_underpass",
        condition: "major_obstruction",
        evidence: [
          "accessible underpass has a locked barrier making the facility inaccessible to wheelchair users from any route",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "barrier", "condition": "locked", "severity": "HIGH", "evidence": ["wheelchair kisi bhi route se facility nahi pahunch sakti"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "barrier", "condition": "major_obstruction", "evidence": ["sugam underpass barrier is locked, wheelchair user cannot access facility from any route"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_underpass", "condition": "major_obstruction", "evidence": ["accessible underpass has a locked barrier making the facility unusable for any route"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_underpass", "condition": "major_obstruction", "evidence": ["accessible underpass has a locked barrier making the facility inaccessible to wheelchair users from any route"]}',
      },
    },
    {
      id: "v3-test-lighting-2-5-0",
      note: "Encountered this on my return: quayside beacon has blacked out the entire crossing beside an unguarded drop. Please record the facts.",
      target: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "quayside_beacon",
        condition: "major_obstruction",
        evidence: [
          "quayside beacon has blacked out the entire crossing beside an unguarded drop",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "beacon",
        condition: "non_functioning",
        severity: "HIGH",
        evidence: [
          "quayside beacon has blacked out the entire crossing",
          "unguarded drop",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "quayside_beacon",
        condition: "malfunctioning",
        evidence: [
          "quayside beacon has blacked out the entire crossing beside an unguarded drop",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "quayside_beacon",
        condition: "immediate_danger",
        evidence: [
          "quayside beacon has blacked out the entire crossing beside an unguarded drop",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "quayside_beacon",
        condition: "immediate_danger",
        evidence: [
          "quayside beacon has blacked out the entire crossing beside an unguarded drop",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "LIGHTING",\n  "object": "beacon",\n  "condition": "non_functioning",\n  "severity": "HIGH",\n  "evidence": [\n    "quayside beacon has blacked out the entire crossing",\n    "unguarded drop"\n  ]\n}',
        few_shot:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "quayside_beacon", "condition": "malfunctioning", "evidence": ["quayside beacon has blacked out the entire crossing beside an unguarded drop"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "quayside_beacon", "condition": "immediate_danger", "evidence": ["quayside beacon has blacked out the entire crossing beside an unguarded drop"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "quayside_beacon", "condition": "immediate_danger", "evidence": ["quayside beacon has blacked out the entire crossing beside an unguarded drop"]}',
      },
    },
    {
      id: "v3-test-trail-3-5-0",
      note: "Maintenance desk, can you look at this? ravine footpath is crumbling down a cliff while a group of walkers is on that section.",
      target: {
        category: "TRAIL",
        severity: "CRITICAL",
        object: "ravine_footpath",
        condition: "immediate_danger",
        evidence: [
          "ravine footpath is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "footpath",
        condition: "structural_damage",
        evidence: [
          "ravine footpath is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "ravine_footpath",
        condition: "major_obstruction",
        evidence: [
          "ravine footpath is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "ravine_footpath",
        condition: "major_obstruction",
        evidence: [
          "ravine footpath is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "trail", "object": "footpath", "condition": "crumbling", "severity": "high", "evidence": ["ravine footpath is crumbling down a cliff", "group of walkers is on that section"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "HIGH", "object": "footpath", "condition": "structural_damage", "evidence": ["ravine footpath is crumbling down a cliff while a group of walkers is on that section"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "HIGH", "object": "ravine_footpath", "condition": "major_obstruction", "evidence": ["ravine footpath is crumbling down a cliff while a group of walkers is on that section"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "HIGH", "object": "ravine_footpath", "condition": "major_obstruction", "evidence": ["ravine footpath is crumbling down a cliff while a group of walkers is on that section"]}',
      },
    },
    {
      id: "v3-test-signage-2-6-0",
      note: "Maintenance desk, can you look at this? detour panel gives the wrong diversion into a hazardous works area.",
      target: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "detour_panel",
        condition: "major_obstruction",
        evidence: [
          "detour panel gives the wrong diversion into a hazardous works area",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "detour_panel",
        condition: "incorrect_diversion",
        severity: "HIGH",
        evidence: [
          "detour panel gives the wrong diversion into a hazardous works area",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "detour_sign",
        condition: "incorrect_direction",
        evidence: [
          "detour panel gives the wrong diversion into a hazardous works area",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "route_sign",
        condition: "major_obstruction",
        evidence: [
          "route sign gives the wrong diversion into a hazardous works area",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "direction_board",
        condition: "major_obstruction",
        evidence: [
          "direction board gives the wrong diversion into a hazardous works area",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "detour_panel", "condition": "incorrect_diversion", "severity": "HIGH", "evidence": ["detour panel gives the wrong diversion into a hazardous works area"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "detour_sign", "condition": "incorrect_direction", "evidence": ["detour panel gives the wrong diversion into a hazardous works area"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "route_sign", "condition": "major_obstruction", "evidence": ["route sign gives the wrong diversion into a hazardous works area"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "direction_board", "condition": "major_obstruction", "evidence": ["direction board gives the wrong diversion into a hazardous works area"]}',
      },
    },
    {
      id: "v3-test-accessibility-2-5-0",
      note: "Encountered this on my return: mobility boardwalk has a locked barrier; a wheelchair cannot get to the facility by any route. Please record the facts.",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "mobility_boardwalk",
        condition: "major_obstruction",
        evidence: [
          "mobility boardwalk has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "mobility_boardwalk",
        condition: "major_obstruction",
        evidence: [
          "mobility boardwalk has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "mobility_boardwalk",
        condition: "major_obstruction",
        evidence: [
          "mobility boardwalk has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "mobility_boardwalk",
        condition: "major_obstruction",
        evidence: [
          "mobility boardwalk has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "accessibility",\n  "object": "mobility_boardwalk",\n  "condition": "blocked_access",\n  "severity": "high",\n  "evidence": [\n    "locked barrier",\n    "wheelchair cannot get to the facility by any route"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "mobility_boardwalk", "condition": "major_obstruction", "evidence": ["mobility boardwalk has a locked barrier; a wheelchair cannot get to the facility by any route"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "mobility_boardwalk", "condition": "major_obstruction", "evidence": ["mobility boardwalk has a locked barrier; a wheelchair cannot get to the facility by any route"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "mobility_boardwalk", "condition": "major_obstruction", "evidence": ["mobility boardwalk has a locked barrier; a wheelchair cannot get to the facility by any route"]}',
      },
    },
    {
      id: "v3-test-signage-1-5-2",
      note: "Maintenance desk zara dekho. evacuation marker ka text mit gaya, visitors ko posted direction nahi milti.",
      target: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "evacuation_marker",
        condition: "maintenance_needed",
        evidence: [
          "evacuation marker has lost its text, leaving visitors without the posted directions",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "evacuation_marker",
        condition: "missing_text",
        severity: "HIGH",
        evidence: [
          "evacuation marker ka text mit gaya",
          "visitors ko posted direction nahi milti",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "evacuation_marker",
        condition: "missing_text",
        evidence: [
          "evacuation marker text is missing, visitors are not getting posted directions",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "exit_sign",
        condition: "maintenance_needed",
        evidence: [
          "exit sign has no visible text and no visible direction is available for visitors",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "exit_sign",
        condition: "maintenance_needed",
        evidence: [
          "exit sign has no visible text and no visible direction is available for visitors",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "evacuation_marker", "condition": "missing_text", "severity": "HIGH", "evidence": ["evacuation marker ka text mit gaya", "visitors ko posted direction nahi milti"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "evacuation_marker", "condition": "missing_text", "evidence": ["evacuation marker text is missing, visitors are not getting posted directions"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "exit_sign", "condition": "maintenance_needed", "evidence": ["exit sign has no visible text and no visible direction is available for visitors"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "exit_sign", "condition": "maintenance_needed", "evidence": ["exit sign has no visible text and no visible direction is available for visitors"]}',
      },
    },
    {
      id: "v3-test-cleanliness-1-6-2",
      note: "Vaapas aate hue mila: nahar ki seedhiyan ke aas paas uncollected bags badboo de rahe, walking space clear hai. Facts note karo.",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "canal_steps",
        condition: "maintenance_needed",
        evidence: [
          "canal steps is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "bag",
        condition: "uncollected",
        severity: "LOW",
        evidence: ["uncollected bags", "badboo de rahe"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "trash_bags",
        condition: "uncollected",
        evidence: [
          "bags are uncollected near the canal banks, walking space is clear",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "stream_bank",
        condition: "minor_wear",
        evidence: [
          "stream bank has uncollected bags causing a smell; the walking space remains clear",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "drain_curb",
        condition: "minor_wear",
        evidence: [
          "drain curb has uncollected bags beside it; the walking space remains clear",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "bag", "condition": "uncollected", "severity": "LOW", "evidence": ["uncollected bags", "badboo de rahe"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "trash_bags", "condition": "uncollected", "evidence": ["bags are uncollected near the canal banks, walking space is clear"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "stream_bank", "condition": "minor_wear", "evidence": ["stream bank has uncollected bags causing a smell; the walking space remains clear"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "drain_curb", "condition": "minor_wear", "evidence": ["drain curb has uncollected bags beside it; the walking space remains clear"]}',
      },
    },
    {
      id: "v3-test-cleanliness-2-6-0",
      note: "Maintenance desk, can you look at this? canal steps has a knee-high pile of refuse across the sole way through.",
      target: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "canal_steps",
        condition: "major_obstruction",
        evidence: [
          "canal steps has a knee-high pile of refuse across the sole way through",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "canal_steps",
        condition: "obstruction",
        evidence: [
          "canal steps has a knee-high pile of refuse across the sole way through",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "canal_steps",
        condition: "major_obstruction",
        evidence: [
          "canal steps has a knee-high pile of refuse across the sole way through",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "canal_steps",
        condition: "major_obstruction",
        evidence: [
          "canal steps has a knee-high pile of refuse across the sole way through",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "cleanliness", "object": "refuse", "condition": "obstructing_path", "severity": "high", "evidence": ["knee-high pile of refuse", "across the sole way through"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "canal_steps", "condition": "obstruction", "evidence": ["canal steps has a knee-high pile of refuse across the sole way through"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "canal_steps", "condition": "major_obstruction", "evidence": ["canal steps has a knee-high pile of refuse across the sole way through"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "canal_steps", "condition": "major_obstruction", "evidence": ["canal steps has a knee-high pile of refuse across the sole way through"]}',
      },
    },
    {
      id: "v3-test-infrastructure-0-5-2",
      note: "Vaapas aate hue mila: paidal platform ka paint utra hai, saare parts solid aur usable hain. Facts note karo.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "pedestrian_platform",
        condition: "minor_wear",
        evidence: [
          "pedestrian platform shows chipped paint while all parts remain solid and usable",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "platform",
        condition: "damaged",
        severity: "LOW",
        evidence: [
          "paidal platform ka paint utra hai",
          "saare parts solid aur usable hain",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "pedestrian_platform",
        condition: "cosmetic_damage",
        evidence: [
          "pedestrian platform paint has peeled off, all parts are solid and usable",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "stair_well",
        condition: "minor_wear",
        evidence: [
          "stair well has worn paint; all parts remain solid and usable",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "stair_well",
        condition: "minor_wear",
        evidence: [
          "stair well has chipped paint; all parts remain solid and usable",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "ACCESSIBILITY",\n  "object": "platform",\n  "condition": "damaged",\n  "severity": "LOW",\n  "evidence": [\n    "paidal platform ka paint utra hai",\n    "saare parts solid aur usable hain"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "pedestrian_platform", "condition": "cosmetic_damage", "evidence": ["pedestrian platform paint has peeled off, all parts are solid and usable"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "stair_well", "condition": "minor_wear", "evidence": ["stair well has worn paint; all parts remain solid and usable"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "stair_well", "condition": "minor_wear", "evidence": ["stair well has chipped paint; all parts remain solid and usable"]}',
      },
    },
    {
      id: "v3-test-other-0-6-2",
      note: "Maintenance desk zara dekho. queue display par chhota cosmetic daag hai, service par asar nahi.",
      target: {
        category: "OTHER",
        severity: "LOW",
        object: "queue_display",
        condition: "minor_wear",
        evidence: [
          "queue display has a small cosmetic blemish that does not affect its service",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "OTHER",
        object: "unknown",
        condition: "unspecified",
        severity: "LOW",
        evidence: [
          "queue display par chhota cosmetic daag hai",
          "service par asar nahi",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "queue_display",
        condition: "cosmetic_damage",
        evidence: [
          "queue display has a small cosmetic stain, no effect on service",
        ],
      },
      fineTunedPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "maintenance_desk",
        condition: "minor_wear",
        evidence: [
          "maintenance desk has a minor cosmetic stain on the queue display; service is unaffected",
        ],
      },
      secondSeedPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "maintenance_desk",
        condition: "minor_wear",
        evidence: [
          "maintenance desk has a minor cosmetic mark; it still works normally",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "OTHER",\n  "object": "unknown",\n  "condition": "unspecified",\n  "severity": "LOW",\n  "evidence": [\n    "queue display par chhota cosmetic daag hai",\n    "service par asar nahi"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "queue_display", "condition": "cosmetic_damage", "evidence": ["queue display has a small cosmetic stain, no effect on service"]}',
        fine_tuned_seed42:
          '{"category": "OTHER", "severity": "LOW", "object": "maintenance_desk", "condition": "minor_wear", "evidence": ["maintenance desk has a minor cosmetic stain on the queue display; service is unaffected"]}',
        fine_tuned_seed1729:
          '{"category": "OTHER", "severity": "LOW", "object": "maintenance_desk", "condition": "minor_wear", "evidence": ["maintenance desk has a minor cosmetic mark; it still works normally"]}',
      },
    },
    {
      id: "v3-test-environment-2-6-0",
      note: "Maintenance desk, can you look at this? woodland has storm damage leaving a heavy unstable mass over the walkway.",
      target: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "woodland",
        condition: "major_obstruction",
        evidence: [
          "woodland has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "walkway",
        condition: "unstable",
        severity: "HIGH",
        evidence: ["storm damage", "heavy unstable mass"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "woodland_area",
        condition: "structural_damage",
        evidence: [
          "woodland has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "woodland",
        condition: "major_obstruction",
        evidence: [
          "woodland has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "woodland",
        condition: "major_obstruction",
        evidence: [
          "woodland has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "walkway",\n  "condition": "unstable",\n  "severity": "HIGH",\n  "evidence": [\n    "storm damage",\n    "heavy unstable mass"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "woodland_area", "condition": "structural_damage", "evidence": ["woodland has storm damage leaving a heavy unstable mass over the walkway"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "HIGH", "object": "woodland", "condition": "major_obstruction", "evidence": ["woodland has storm damage leaving a heavy unstable mass over the walkway"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "HIGH", "object": "woodland", "condition": "major_obstruction", "evidence": ["woodland has storm damage leaving a heavy unstable mass over the walkway"]}',
      },
    },
    {
      id: "v3-test-trail-3-6-2",
      note: "Vaapas aate hue mila: maidan ka kachcha track cliff se crumble ho raha, walkers ka group usi section par hai. Facts note karo.",
      target: {
        category: "TRAIL",
        severity: "CRITICAL",
        object: "moorland_track",
        condition: "immediate_danger",
        evidence: [
          "moorland track is crumbling down a cliff while a group of walkers is on that section",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "unpaved_track",
        condition: "structural_damage",
        evidence: [
          "unpaved track is crumbling from the cliff, walkers' group is on that section",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "walking_track",
        condition: "major_obstruction",
        evidence: [
          "unpaved walking track is crumbling off a cliff with walkers using that section right now",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "walking_track",
        condition: "major_obstruction",
        evidence: [
          "unpaved walking track is crumbling off a cliff and walkers are using that section right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "trail", "object": "track", "condition": "crumbling", "severity": "high", "evidence": ["maidan ka kachcha track cliff se crumble ho raha", "walkers ka group usi section par hai"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "HIGH", "object": "unpaved_track", "condition": "structural_damage", "evidence": ["unpaved track is crumbling from the cliff, walkers\' group is on that section"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "HIGH", "object": "walking_track", "condition": "major_obstruction", "evidence": ["unpaved walking track is crumbling off a cliff with walkers using that section right now"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "HIGH", "object": "walking_track", "condition": "major_obstruction", "evidence": ["unpaved walking track is crumbling off a cliff and walkers are using that section right now"]}',
      },
    },
    {
      id: "v3-test-cleanliness-0-5-1",
      note: "वापसी पर यह मिला: सार्वजनिक आंगन के पास सिर्फ दो खाली पैकेट हैं जो चलने में नहीं आते। तथ्य दर्ज करें।",
      target: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_courtyard",
        condition: "minor_wear",
        evidence: [
          "public courtyard has just two wrappers at its foot, away from people's way",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "waste_bin",
        condition: "minor_wear",
        evidence: [
          "public yard has only two empty packets that do not function in walking",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_garden",
        condition: "minor_wear",
        evidence: [
          "public garden has only two empty unusable packages beside it; the rest is normal",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_garden",
        condition: "minor_wear",
        evidence: [
          "public garden has only two empty packages that don't obstruct passage; no maintenance is needed",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "cleanliness", "object": "waste_bin", "condition": "not_functioning", "severity": "low", "evidence": ["सिर्फ दो खाली पैकेट हैं जो चलने में नहीं आते"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "waste_bin", "condition": "minor_wear", "evidence": ["public yard has only two empty packets that do not function in walking"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "public_garden", "condition": "minor_wear", "evidence": ["public garden has only two empty unusable packages beside it; the rest is normal"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "public_garden", "condition": "minor_wear", "evidence": ["public garden has only two empty packages that don\'t obstruct passage; no maintenance is needed"]}',
      },
    },
    {
      id: "v3-test-signage-2-5-0",
      note: "Encountered this on my return: evacuation marker gives the wrong diversion into a hazardous works area. Please record the facts.",
      target: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "evacuation_marker",
        condition: "major_obstruction",
        evidence: [
          "evacuation marker gives the wrong diversion into a hazardous works area",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "evacuation_marker",
        condition: "incorrect_direction",
        severity: "HIGH",
        evidence: [
          "evacuation marker gives the wrong diversion",
          "diversion into a hazardous works area",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "evacuation_sign",
        condition: "incorrect_direction",
        evidence: [
          "evacuation marker gives the wrong diversion into a hazardous works area",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "exit_sign",
        condition: "major_obstruction",
        evidence: [
          "exit sign gives the wrong diversion into a hazardous works area",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "evacuation_marker",
        condition: "major_obstruction",
        evidence: [
          "evacuation marker gives the wrong diversion into a hazardous works area",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "evacuation_marker",\n  "condition": "incorrect_direction",\n  "severity": "HIGH",\n  "evidence": [\n    "evacuation marker gives the wrong diversion",\n    "diversion into a hazardous works area"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "evacuation_sign", "condition": "incorrect_direction", "evidence": ["evacuation marker gives the wrong diversion into a hazardous works area"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "exit_sign", "condition": "major_obstruction", "evidence": ["exit sign gives the wrong diversion into a hazardous works area"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "evacuation_marker", "condition": "major_obstruction", "evidence": ["evacuation marker gives the wrong diversion into a hazardous works area"]}',
      },
    },
    {
      id: "v3-test-signage-2-5-2",
      note: "Vaapas aate hue mila: evacuation marker galat diversion se hazardous work area mein bhejta hai. Facts note karo.",
      target: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "evacuation_marker",
        condition: "major_obstruction",
        evidence: [
          "evacuation marker gives the wrong diversion into a hazardous works area",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "evacuation_marker",
        condition: "misleading",
        severity: "HIGH",
        evidence: [
          "evacuation marker galat diversion se hazardous work area mein bhejta hai",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "evacuation_marker",
        condition: "misleading_direction",
        evidence: [
          "evacuation marker sends people to hazardous work area due to incorrect diversion",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "exit_sign",
        condition: "major_obstruction",
        evidence: ["exit sign misdirects walkers into a hazardous work area"],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "exit_sign",
        condition: "major_obstruction",
        evidence: ["exit sign misdirects into a hazardous work area"],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "evacuation_marker",\n  "condition": "misleading",\n  "severity": "HIGH",\n  "evidence": [\n    "evacuation marker galat diversion se hazardous work area mein bhejta hai"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "evacuation_marker", "condition": "misleading_direction", "evidence": ["evacuation marker sends people to hazardous work area due to incorrect diversion"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "exit_sign", "condition": "major_obstruction", "evidence": ["exit sign misdirects walkers into a hazardous work area"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "exit_sign", "condition": "major_obstruction", "evidence": ["exit sign misdirects into a hazardous work area"]}',
      },
    },
    {
      id: "v3-test-safety-2-6-0",
      note: "Maintenance desk, can you look at this? emergency hatch has lost its barrier so a passerby could suffer a serious fall.",
      target: {
        category: "SAFETY",
        severity: "HIGH",
        object: "emergency_hatch",
        condition: "major_obstruction",
        evidence: [
          "emergency hatch has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "emergency_hatch",
        condition: "unprotected",
        severity: "CRITICAL",
        evidence: [
          "emergency hatch has lost its barrier",
          "passerby could suffer a serious fall",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "emergency_hatch",
        condition: "missing_barrier",
        evidence: [
          "emergency hatch has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "emergency_hatch",
        condition: "major_obstruction",
        evidence: [
          "emergency hatch has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "emergency_hatch",
        condition: "major_obstruction",
        evidence: [
          "emergency hatch has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "emergency_hatch", "condition": "unprotected", "severity": "CRITICAL", "evidence": ["emergency hatch has lost its barrier", "passerby could suffer a serious fall"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "emergency_hatch", "condition": "missing_barrier", "evidence": ["emergency hatch has lost its barrier so a passerby could suffer a serious fall"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "HIGH", "object": "emergency_hatch", "condition": "major_obstruction", "evidence": ["emergency hatch has lost its barrier so a passerby could suffer a serious fall"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "HIGH", "object": "emergency_hatch", "condition": "major_obstruction", "evidence": ["emergency hatch has lost its barrier so a passerby could suffer a serious fall"]}',
      },
    },
    {
      id: "v3-test-safety-0-5-0",
      note: "Encountered this on my return: construction shaft looks untidy, although its guard is intact and nothing dangerous is exposed. Please record the facts.",
      target: {
        category: "SAFETY",
        severity: "LOW",
        object: "construction_shaft",
        condition: "minor_wear",
        evidence: [
          "construction shaft looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "construction_shaft",
        condition: "untidy",
        severity: "LOW",
        evidence: [
          "construction shaft looks untidy",
          "guard is intact",
          "nothing dangerous is exposed",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "construction_shaft",
        condition: "untidy_appearance",
        evidence: [
          "construction shaft looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "construction_shaft",
        condition: "minor_wear",
        evidence: [
          "construction shaft looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "construction_shaft",
        condition: "minor_wear",
        evidence: [
          "construction shaft looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "CLEANLINESS",\n  "object": "construction_shaft",\n  "condition": "untidy",\n  "severity": "LOW",\n  "evidence": [\n    "construction shaft looks untidy",\n    "guard is intact",\n    "nothing dangerous is exposed"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "construction_shaft", "condition": "untidy_appearance", "evidence": ["construction shaft looks untidy, although its guard is intact and nothing dangerous is exposed"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "construction_shaft", "condition": "minor_wear", "evidence": ["construction shaft looks untidy, although its guard is intact and nothing dangerous is exposed"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "construction_shaft", "condition": "minor_wear", "evidence": ["construction shaft looks untidy, although its guard is intact and nothing dangerous is exposed"]}',
      },
    },
    {
      id: "v3-test-safety-3-6-2",
      note: "Vaapas aate hue mila: aapat darwaza ke andar person phansa hai, jaanleva hazard abhi jaari hai. Facts note karo.",
      target: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "emergency_hatch",
        condition: "immediate_danger",
        evidence: [
          "emergency hatch has a person caught inside while an active lethal hazard continues",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "person",
        condition: "trapped",
        severity: "CRITICAL",
        evidence: ["person phansa hai", "jaanleva hazard abhi jaari hai"],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "emergency_exit",
        condition: "immediate_danger",
        evidence: [
          "person is trapped inside the emergency exit, life-threatening hazard is ongoing",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "fire_exit",
        condition: "immediate_danger",
        evidence: [
          "fire exit has a trapped person with an active life-threatening hazard right now. note the facts",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "fire_exit",
        condition: "immediate_danger",
        evidence: [
          "fire exit has a trapped person and an active life-threatening hazard right now; note the facts",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "person", "condition": "trapped", "severity": "CRITICAL", "evidence": ["person phansa hai", "jaanleva hazard abhi jaari hai"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "emergency_exit", "condition": "immediate_danger", "evidence": ["person is trapped inside the emergency exit, life-threatening hazard is ongoing"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "fire_exit", "condition": "immediate_danger", "evidence": ["fire exit has a trapped person with an active life-threatening hazard right now. note the facts"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "fire_exit", "condition": "immediate_danger", "evidence": ["fire exit has a trapped person and an active life-threatening hazard right now; note the facts"]}',
      },
    },
    {
      id: "v3-test-infrastructure-1-5-1",
      note: "देखभाल कार्यालय, इसे देखें। पैदल मंच में दरारों पर पैबंद चाहिए, इसके ऊपर से निकल सकते हैं।",
      target: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "pedestrian_platform",
        condition: "maintenance_needed",
        evidence: [
          "pedestrian platform has cracks that need patching, but passing over it is still possible",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "footbridge",
        condition: "cracks",
        severity: "MEDIUM",
        evidence: ["दरारों पर पैबंद चाहिए", "इसके ऊपर से निकल सकते हैं"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "pedestrian_bridge",
        condition: "minor_damage",
        evidence: [
          "pedestrian bridge has cracks where people can step through",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "stair",
        condition: "maintenance_needed",
        evidence: [
          "stair has visible structural cracks needing repair; walkers can pass over them",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "stair",
        condition: "maintenance_needed",
        evidence: [
          "stair has structural cracks needing repair; walkers can pass over them",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "INFRASTRUCTURE", "object": "footbridge", "condition": "cracks", "severity": "MEDIUM", "evidence": ["दरारों पर पैबंद चाहिए", "इसके ऊपर से निकल सकते हैं"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "pedestrian_bridge", "condition": "minor_damage", "evidence": ["pedestrian bridge has cracks where people can step through"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "stair", "condition": "maintenance_needed", "evidence": ["stair has visible structural cracks needing repair; walkers can pass over them"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "stair", "condition": "maintenance_needed", "evidence": ["stair has structural cracks needing repair; walkers can pass over them"]}',
      },
    },
    {
      id: "v3-test-environment-1-6-2",
      note: "Vaapas aate hue mila: van ka ilaaka mein plants damaged aur paani dirty hai, major hazard ka signal nahi. Facts note karo.",
      target: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "woodland",
        condition: "maintenance_needed",
        evidence: [
          "woodland shows damaged plants and dirty water; nothing indicates a major hazard",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "ENVIRONMENT",
        object: "area",
        condition: "polluted",
        severity: "MEDIUM",
        evidence: ["paani dirty hai"],
      },
      fewShotPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "planting_area",
        condition: "minor_damage",
        evidence: ["plants damaged and water is dirty, no major hazard signal"],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "forest_area",
        condition: "maintenance_needed",
        evidence: [
          "forest area has damaged vegetation and contaminated water; no major hazard is reported",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "forest_area",
        condition: "maintenance_needed",
        evidence: [
          "forest area has damaged vegetation and contaminated water; no major hazard is present",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ENVIRONMENT", "object": "area", "condition": "polluted", "severity": "MEDIUM", "evidence": ["paani dirty hai"]}',
        few_shot:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "planting_area", "condition": "minor_damage", "evidence": ["plants damaged and water is dirty, no major hazard signal"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "forest_area", "condition": "maintenance_needed", "evidence": ["forest area has damaged vegetation and contaminated water; no major hazard is reported"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "forest_area", "condition": "maintenance_needed", "evidence": ["forest area has damaged vegetation and contaminated water; no major hazard is present"]}',
      },
    },
    {
      id: "v3-test-safety-2-5-1",
      note: "वापसी पर यह मिला: निर्माण गड्ढा का अवरोध हट गया है जिससे राहगीर को गंभीर गिरावट का खतरा है। तथ्य दर्ज करें।",
      target: {
        category: "SAFETY",
        severity: "HIGH",
        object: "construction_shaft",
        condition: "major_obstruction",
        evidence: [
          "construction shaft has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "construction_hole",
        condition: "obstruction_removed",
        severity: "HIGH",
        evidence: [
          "construction hole obstruction removed",
          "serious fall risk",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "construction_cave",
        condition: "obstruction_removed",
        evidence: [
          "construction cave obstruction has been removed, creating a serious risk of falling",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "construction_cavity",
        condition: "major_obstruction",
        evidence: [
          "construction cavity has had its obstructing excavation removed leaving walkers with a serious drop hazard; the danger is still present",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "construction_cavity",
        condition: "major_obstruction",
        evidence: [
          "construction cavity has been cleared and walkers face a serious fall hazard; the obstruction is gone and the danger remains",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "construction_hole", "condition": "obstruction_removed", "severity": "HIGH", "evidence": ["construction hole obstruction removed", "serious fall risk"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "construction_cave", "condition": "obstruction_removed", "evidence": ["construction cave obstruction has been removed, creating a serious risk of falling"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "construction_cavity", "condition": "major_obstruction", "evidence": ["construction cavity has had its obstructing excavation removed leaving walkers with a serious drop hazard; the danger is still present"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "construction_cavity", "condition": "major_obstruction", "evidence": ["construction cavity has been cleared and walkers face a serious fall hazard; the obstruction is gone and the danger remains"]}',
      },
    },
    {
      id: "v3-test-signage-3-6-1",
      note: "वापसी पर यह मिला: वैकल्पिक मार्ग पट्ट भीड़ को जलते गलियारे भेजता है जिसमें वे इसी क्षण घुस रहे हैं। तथ्य दर्ज करें।",
      target: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "detour_panel",
        condition: "immediate_danger",
        evidence: [
          "detour panel sends a crowd into a burning passage they are entering at this instant",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "alternative_route",
        condition: "crowd_management_issue",
        severity: "MEDIUM",
        evidence: [
          "वैकल्पिक मार्ग पट्ट भीड़ को जलते गलियारे भेजता है",
          "वे इसी क्षण घुस रहे हैं",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "alternative_path",
        condition: "major_obstruction",
        evidence: [
          "alternative path sends crowd into burning alleyways where they are entering at this moment",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "exit_sign",
        condition: "immediate_danger",
        evidence: [
          "exit sign misdirects walkers onto a burning passage with people entering it now; record the fact",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "alternative_route",
        condition: "immediate_danger",
        evidence: [
          "alternative route directs a crowd into a burning passage that they are entering right now; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "INFRASTRUCTURE", "object": "alternative_route", "condition": "crowd_management_issue", "severity": "MEDIUM", "evidence": ["वैकल्पिक मार्ग पट्ट भीड़ को जलते गलियारे भेजता है", "वे इसी क्षण घुस रहे हैं"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "alternative_path", "condition": "major_obstruction", "evidence": ["alternative path sends crowd into burning alleyways where they are entering at this moment"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "CRITICAL", "object": "exit_sign", "condition": "immediate_danger", "evidence": ["exit sign misdirects walkers onto a burning passage with people entering it now; record the fact"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "CRITICAL", "object": "alternative_route", "condition": "immediate_danger", "evidence": ["alternative route directs a crowd into a burning passage that they are entering right now; record the fact"]}',
      },
    },
    {
      id: "v3-test-infrastructure-0-5-1",
      note: "वापसी पर यह मिला: पैदल मंच पर रंग उखड़ा है, सभी हिस्से मजबूत और काम के हैं। तथ्य दर्ज करें।",
      target: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "pedestrian_platform",
        condition: "minor_wear",
        evidence: [
          "pedestrian platform shows chipped paint while all parts remain solid and usable",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "TRAIL",
        object: "painted_surface",
        condition: "peeling",
        severity: "LOW",
        evidence: ["पैदल मंच पर रंग उखड़ा है"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "pedestrian_platform",
        condition: "cosmetic_damage",
        evidence: [
          "pedestrian platform has faded color, all parts are strong and functional",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "stair",
        condition: "minor_wear",
        evidence: [
          "stair has faded paint; all parts remain intact and usable; record the fact",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "tactile_pavement",
        condition: "minor_wear",
        evidence: [
          "tactile pavement has faded but all its parts remain intact and usable; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "TRAIL", "object": "painted_surface", "condition": "peeling", "severity": "LOW", "evidence": ["पैदल मंच पर रंग उखड़ा है"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "pedestrian_platform", "condition": "cosmetic_damage", "evidence": ["pedestrian platform has faded color, all parts are strong and functional"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "stair", "condition": "minor_wear", "evidence": ["stair has faded paint; all parts remain intact and usable; record the fact"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "tactile_pavement", "condition": "minor_wear", "evidence": ["tactile pavement has faded but all its parts remain intact and usable; record the fact"]}',
      },
    },
    {
      id: "v3-test-infrastructure-3-5-0",
      note: "Maintenance desk, can you look at this? pedestrian platform is breaking apart while pedestrians are dropping into the gap.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "pedestrian_platform",
        condition: "immediate_danger",
        evidence: [
          "pedestrian platform is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "pedestrian_platform",
        condition: "breaking_apart",
        severity: "HIGH",
        evidence: [
          "pedestrian platform is breaking apart",
          "pedestrians are dropping into the gap",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "pedestrian_platform",
        condition: "structural_failure",
        evidence: [
          "pedestrian platform is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "stair_well",
        condition: "major_obstruction",
        evidence: [
          "stair well is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "pedestrian_platform",
        condition: "major_obstruction",
        evidence: [
          "pedestrian platform is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "pedestrian_platform",\n  "condition": "breaking_apart",\n  "severity": "HIGH",\n  "evidence": [\n    "pedestrian platform is breaking apart",\n    "pedestrians are dropping into the gap"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "pedestrian_platform", "condition": "structural_failure", "evidence": ["pedestrian platform is breaking apart while pedestrians are dropping into the gap"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "stair_well", "condition": "major_obstruction", "evidence": ["stair well is breaking apart while pedestrians are dropping into the gap"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "pedestrian_platform", "condition": "major_obstruction", "evidence": ["pedestrian platform is breaking apart while pedestrians are dropping into the gap"]}',
      },
    },
    {
      id: "v3-test-accessibility-0-5-2",
      note: "Vaapas aate hue mila: sugam lakdi ka rasta ki coating ghisi hai, mobility aids bina dikkat nikalte hain. Facts note karo.",
      target: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "mobility_boardwalk",
        condition: "minor_wear",
        evidence: [
          "mobility boardwalk has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "path",
        condition: "slippery",
        severity: "MEDIUM",
        evidence: [
          "sugam lakdi ka rasta ki coating ghisi hai",
          "mobility aids bina dikkat nikalte hain",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "smooth_wooden_path",
        condition: "surface_damage",
        evidence: [
          "smooth wooden path coating is chipped, mobility aids can pass without difficulty",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "accessible_path",
        condition: "minor_wear",
        evidence: [
          "accessible path has a worn coating; mobility aids pass without difficulty",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "accessible_path",
        condition: "minor_wear",
        evidence: [
          "accessible path has a worn coating; mobility aids pass without difficulty",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "path", "condition": "slippery", "severity": "MEDIUM", "evidence": ["sugam lakdi ka rasta ki coating ghisi hai", "mobility aids bina dikkat nikalte hain"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "smooth_wooden_path", "condition": "surface_damage", "evidence": ["smooth wooden path coating is chipped, mobility aids can pass without difficulty"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "accessible_path", "condition": "minor_wear", "evidence": ["accessible path has a worn coating; mobility aids pass without difficulty"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "accessible_path", "condition": "minor_wear", "evidence": ["accessible path has a worn coating; mobility aids pass without difficulty"]}',
      },
    },
    {
      id: "v3-test-infrastructure-3-6-0",
      note: "Encountered this on my return: road culvert is breaking apart while pedestrians are dropping into the gap. Please record the facts.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "road_culvert",
        condition: "immediate_danger",
        evidence: [
          "road culvert is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "road_culvert",
        condition: "breaking_apart",
        severity: "HIGH",
        evidence: [
          "road culvert is breaking apart",
          "pedestrians are dropping into the gap",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "road_culvert",
        condition: "structural_failure",
        evidence: [
          "road culvert is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "road_culvert",
        condition: "major_obstruction",
        evidence: [
          "road culvert is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "road_culvert",
        condition: "major_obstruction",
        evidence: [
          "road culvert is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "road_culvert",\n  "condition": "breaking_apart",\n  "severity": "HIGH",\n  "evidence": [\n    "road culvert is breaking apart",\n    "pedestrians are dropping into the gap"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "road_culvert", "condition": "structural_failure", "evidence": ["road culvert is breaking apart while pedestrians are dropping into the gap"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "road_culvert", "condition": "major_obstruction", "evidence": ["road culvert is breaking apart while pedestrians are dropping into the gap"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "road_culvert", "condition": "major_obstruction", "evidence": ["road culvert is breaking apart while pedestrians are dropping into the gap"]}',
      },
    },
    {
      id: "v3-test-signage-1-6-2",
      note: "Vaapas aate hue mila: doosre raste ka panel ka text mit gaya, visitors ko posted direction nahi milti. Facts note karo.",
      target: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "detour_panel",
        condition: "maintenance_needed",
        evidence: [
          "detour panel has lost its text, leaving visitors without the posted directions",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "direction_sign",
        condition: "missing_text",
        severity: "HIGH",
        evidence: [
          "doosre raste ka panel ka text mit gaya",
          "visitors ko posted direction nahi milti",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "signage_panel",
        condition: "missing_text",
        evidence: [
          "second route panel text is missing, visitors are not getting posted directions",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "direction_board",
        condition: "maintenance_needed",
        evidence: [
          "direction board has faded text so visitors cannot follow the posted route",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "direction_board",
        condition: "maintenance_needed",
        evidence: [
          "direction board has a missing panel and no visible route information is available for visitors",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "direction_sign", "condition": "missing_text", "severity": "HIGH", "evidence": ["doosre raste ka panel ka text mit gaya", "visitors ko posted direction nahi milti"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "signage_panel", "condition": "missing_text", "evidence": ["second route panel text is missing, visitors are not getting posted directions"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "direction_board", "condition": "maintenance_needed", "evidence": ["direction board has faded text so visitors cannot follow the posted route"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "direction_board", "condition": "maintenance_needed", "evidence": ["direction board has a missing panel and no visible route information is available for visitors"]}',
      },
    },
    {
      id: "v3-test-signage-3-6-0",
      note: "Encountered this on my return: detour panel sends a crowd into a burning passage they are entering at this instant. Please record the facts.",
      target: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "detour_panel",
        condition: "immediate_danger",
        evidence: [
          "detour panel sends a crowd into a burning passage they are entering at this instant",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "detour_panel",
        condition: "dangerous_directive",
        severity: "HIGH",
        evidence: [
          "detour panel sends a crowd into a burning passage",
          "crowd entering a burning passage at this instant",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "detour_sign",
        condition: "immediate_danger",
        evidence: [
          "detour panel sends a crowd into a burning passage they are entering at this instant",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "direction_board",
        condition: "immediate_danger",
        evidence: [
          "direction board sends a crowd into a burning passage they are entering at this instant",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "direction_board",
        condition: "immediate_danger",
        evidence: [
          "direction board sends a crowd into a burning passage they are entering at this instant",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "detour_panel",\n  "condition": "dangerous_directive",\n  "severity": "HIGH",\n  "evidence": [\n    "detour panel sends a crowd into a burning passage",\n    "crowd entering a burning passage at this instant"\n  ]\n}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "detour_sign", "condition": "immediate_danger", "evidence": ["detour panel sends a crowd into a burning passage they are entering at this instant"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "CRITICAL", "object": "direction_board", "condition": "immediate_danger", "evidence": ["direction board sends a crowd into a burning passage they are entering at this instant"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "CRITICAL", "object": "direction_board", "condition": "immediate_danger", "evidence": ["direction board sends a crowd into a burning passage they are entering at this instant"]}',
      },
    },
    {
      id: "v3-test-infrastructure-3-6-1",
      note: "वापसी पर यह मिला: सड़क की पुलिया बिखर रहा है और पैदल यात्री अभी खाली हिस्से में गिर रहे हैं। तथ्य दर्ज करें।",
      target: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "road_culvert",
        condition: "immediate_danger",
        evidence: [
          "road culvert is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "street_pavement",
        condition: "cracked",
        severity: "HIGH",
        evidence: [
          "road curb is broken",
          "pedestrians are falling into empty space",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "street_pulley",
        condition: "dangerous_condition",
        evidence: [
          "street pulley is broken and pedestrians are falling into empty space; facts recorded",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "curb",
        condition: "immediate_danger",
        evidence: [
          "curb has given way and walkers are falling off the exposed edge right now; record the fact",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "street_curb",
        condition: "immediate_danger",
        evidence: [
          "street curb is collapsing and walkers are falling off the exposed edge right now; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "street_pavement", "condition": "cracked", "severity": "HIGH", "evidence": ["road curb is broken", "pedestrians are falling into empty space"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "street_pulley", "condition": "dangerous_condition", "evidence": ["street pulley is broken and pedestrians are falling into empty space; facts recorded"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "curb", "condition": "immediate_danger", "evidence": ["curb has given way and walkers are falling off the exposed edge right now; record the fact"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "street_curb", "condition": "immediate_danger", "evidence": ["street curb is collapsing and walkers are falling off the exposed edge right now; record the fact"]}',
      },
    },
    {
      id: "v3-test-signage-3-5-1",
      note: "देखभाल कार्यालय, इसे देखें। निकासी चिह्न भीड़ को जलते गलियारे भेजता है जिसमें वे इसी क्षण घुस रहे हैं।",
      target: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "evacuation_marker",
        condition: "immediate_danger",
        evidence: [
          "evacuation marker sends a crowd into a burning passage they are entering at this instant",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "sign",
        condition: "obscured",
        severity: "MEDIUM",
        evidence: [
          "निकासी चिह्न भीड़ को जलते गलियारे भेजता है",
          "वे इसी क्षण घुस रहे हैं",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "signage",
        condition: "confusing",
        evidence: [
          "signage directs crowd into burning alleyway where they are entering at the same time",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "exit_sign",
        condition: "immediate_danger",
        evidence: [
          "exit sign misdirects a crowd into a burning passage with people entering it right now",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "CRITICAL",
        object: "exit_sign",
        condition: "immediate_danger",
        evidence: [
          "exit sign directs a crowd into a burning passage that they are entering right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "sign", "condition": "obscured", "severity": "MEDIUM", "evidence": ["निकासी चिह्न भीड़ को जलते गलियारे भेजता है", "वे इसी क्षण घुस रहे हैं"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "signage", "condition": "confusing", "evidence": ["signage directs crowd into burning alleyway where they are entering at the same time"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "CRITICAL", "object": "exit_sign", "condition": "immediate_danger", "evidence": ["exit sign misdirects a crowd into a burning passage with people entering it right now"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "CRITICAL", "object": "exit_sign", "condition": "immediate_danger", "evidence": ["exit sign directs a crowd into a burning passage that they are entering right now"]}',
      },
    },
    {
      id: "v3-test-lighting-1-6-0",
      note: "Encountered this on my return: subway illumination stays unlit after dusk; repair is needed but no dangerous consequence is described. Please record the facts.",
      target: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "subway_illumination",
        condition: "maintenance_needed",
        evidence: [
          "subway illumination stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "subway_illumination",
        condition: "unlit",
        severity: "LOW",
        evidence: [
          "subway illumination stays unlit after dusk",
          "repair is needed",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "subway_lamp",
        condition: "maintenance_needed",
        evidence: [
          "subway illumination stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "subway_light",
        condition: "maintenance_needed",
        evidence: [
          "subway illumination stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "subway_light",
        condition: "maintenance_needed",
        evidence: [
          "subway illumination stays unlit after dusk; repair is needed but no dangerous consequence is described",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "subway_illumination", "condition": "unlit", "severity": "LOW", "evidence": ["subway illumination stays unlit after dusk", "repair is needed"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "subway_lamp", "condition": "maintenance_needed", "evidence": ["subway illumination stays unlit after dusk; repair is needed but no dangerous consequence is described"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "subway_light", "condition": "maintenance_needed", "evidence": ["subway illumination stays unlit after dusk; repair is needed but no dangerous consequence is described"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "subway_light", "condition": "maintenance_needed", "evidence": ["subway illumination stays unlit after dusk; repair is needed but no dangerous consequence is described"]}',
      },
    },
    {
      id: "v3-test-other-1-6-1",
      note: "वापसी पर यह मिला: कतार का प्रदर्शन आगंतुकों के लिए काम नहीं करता; सेवा चाहिए, खतरा नहीं बताया गया। तथ्य दर्ज करें।",
      target: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "queue_display",
        condition: "maintenance_needed",
        evidence: [
          "queue display no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "OTHER",
        object: "unknown",
        condition: "unspecified",
        severity: "LOW",
        evidence: [
          "वापसी पर यह मिला",
          "कतार का प्रदर्शन आगंतुकों के लिए काम नहीं करता",
          "सेवा चाहिए, खतरा नहीं बताया गया",
        ],
      },
      fewShotPrediction: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "unknown",
        condition: "unspecified",
        evidence: [
          "katar performance is not working for visitors; service is required, no danger is stated",
        ],
      },
      fineTunedPrediction: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "qatar_show",
        condition: "maintenance_needed",
        evidence: [
          "qatar show does not serve visitors; service is needed, no danger is stated",
        ],
      },
      secondSeedPrediction: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "qatar_exhibit",
        condition: "maintenance_needed",
        evidence: [
          "qatar exhibit does not serve visitors; service is needed, no danger is stated",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "OTHER", "object": "unknown", "condition": "unspecified", "severity": "LOW", "evidence": ["वापसी पर यह मिला", "कतार का प्रदर्शन आगंतुकों के लिए काम नहीं करता", "सेवा चाहिए, खतरा नहीं बताया गया"]}',
        few_shot:
          '{"category": "OTHER", "severity": "MEDIUM", "object": "unknown", "condition": "unspecified", "evidence": ["katar performance is not working for visitors; service is required, no danger is stated"]}',
        fine_tuned_seed42:
          '{"category": "OTHER", "severity": "MEDIUM", "object": "qatar_show", "condition": "maintenance_needed", "evidence": ["qatar show does not serve visitors; service is needed, no danger is stated"]}',
        fine_tuned_seed1729:
          '{"category": "OTHER", "severity": "MEDIUM", "object": "qatar_exhibit", "condition": "maintenance_needed", "evidence": ["qatar exhibit does not serve visitors; service is needed, no danger is stated"]}',
      },
    },
    {
      id: "v3-test-environment-3-6-1",
      note: "वापसी पर यह मिला: वन क्षेत्र अचानक बाढ़ में बह रहा है और लोग उसके साथ बह रहे हैं। तथ्य दर्ज करें।",
      target: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "woodland",
        condition: "immediate_danger",
        evidence: [
          "woodland is being swept away in a flash flood carrying people with it",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "forest_area",
        condition: "flooding",
        severity: "CRITICAL",
        evidence: [
          "वन क्षेत्र अचानक बाढ़ में बह रहा है",
          "लोग उसके साथ बह रहे हैं",
        ],
      },
      fewShotPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "forest_area",
        condition: "flooded_with_people",
        evidence: [
          "forest area is flooding suddenly and people are being swept away",
          "facts recorded",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "forest_area",
        condition: "immediate_danger",
        evidence: [
          "forest area is being swept by a sudden flood and people are being swept with it; the danger is being reported now",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "forest_area",
        condition: "immediate_danger",
        evidence: [
          "forest area is being swept by a sudden flood and people are being swept with it; record the facts",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "forest_area", "condition": "flooding", "severity": "CRITICAL", "evidence": ["वन क्षेत्र अचानक बाढ़ में बह रहा है", "लोग उसके साथ बह रहे हैं"]}',
        few_shot:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "forest_area", "condition": "flooded_with_people", "evidence": ["forest area is flooding suddenly and people are being swept away", "facts recorded"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "forest_area", "condition": "immediate_danger", "evidence": ["forest area is being swept by a sudden flood and people are being swept with it; the danger is being reported now"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "forest_area", "condition": "immediate_danger", "evidence": ["forest area is being swept by a sudden flood and people are being swept with it; record the facts"]}',
      },
    },
    {
      id: "v3-test-trail-0-5-2",
      note: "Vaapas aate hue mila: beehad ki pagdandi par chhoti twigs hain, dirt track par chalna mushkil nahi. Facts note karo.",
      target: {
        category: "TRAIL",
        severity: "LOW",
        object: "ravine_footpath",
        condition: "minor_wear",
        evidence: [
          "ravine footpath has scattered twigs without making the dirt track harder to walk",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "path",
        condition: "debris",
        severity: "LOW",
        evidence: [
          "beehad ki pagdandi par chhoti twigs hain",
          "dirt track par chalna mushkil nahi",
        ],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "path",
        condition: "minor_obstruction",
        evidence: [
          "beehad ki pagdandi par chhoti twigs hain",
          "dirt track par chalna mushkil nahi",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "forest_trail",
        condition: "minor_wear",
        evidence: [
          "forest trail has a few loose twigs across the track; walkers can still use the unpaved route",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "forest_track",
        condition: "minor_wear",
        evidence: [
          "forest track has a few loose twigs across it; walkers can still use the dirt track",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "CLEANLINESS",\n  "object": "path",\n  "condition": "debris",\n  "severity": "LOW",\n  "evidence": [\n    "beehad ki pagdandi par chhoti twigs hain",\n    "dirt track par chalna mushkil nahi"\n  ]\n}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "path", "condition": "minor_obstruction", "evidence": ["beehad ki pagdandi par chhoti twigs hain", "dirt track par chalna mushkil nahi"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "LOW", "object": "forest_trail", "condition": "minor_wear", "evidence": ["forest trail has a few loose twigs across the track; walkers can still use the unpaved route"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "LOW", "object": "forest_track", "condition": "minor_wear", "evidence": ["forest track has a few loose twigs across it; walkers can still use the dirt track"]}',
      },
    },
    {
      id: "v3-test-environment-2-5-1",
      note: "वापसी पर यह मिला: मुहाने का किनारा में तूफान का नुकसान है और भारी अस्थिर चीज पैदल रास्ते पर है। तथ्य दर्ज करें।",
      target: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "estuary_edge",
        condition: "major_obstruction",
        evidence: [
          "estuary edge has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "pedestrian_path",
        condition: "obstructed",
        severity: "HIGH",
        evidence: [
          "heavy unstable object on pedestrian path",
          "storm damage at entrance edge",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "sidewalk",
        condition: "obstruction",
        evidence: [
          "edge of entrance has damage from storm; heavy unstable object on pedestrian path",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "entrance_walkway",
        condition: "major_obstruction",
        evidence: [
          "entrance walkway has a storm-damaged edge with a major unstable object across the pedestrian route; the danger is recorded",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "entrance_wing",
        condition: "major_obstruction",
        evidence: [
          "entrance wing has a storm-damaged edge with a loose heavy object across the pedestrian route; the danger is recorded",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "pedestrian_path", "condition": "obstructed", "severity": "HIGH", "evidence": ["heavy unstable object on pedestrian path", "storm damage at entrance edge"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "sidewalk", "condition": "obstruction", "evidence": ["edge of entrance has damage from storm; heavy unstable object on pedestrian path"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "entrance_walkway", "condition": "major_obstruction", "evidence": ["entrance walkway has a storm-damaged edge with a major unstable object across the pedestrian route; the danger is recorded"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "entrance_wing", "condition": "major_obstruction", "evidence": ["entrance wing has a storm-damaged edge with a loose heavy object across the pedestrian route; the danger is recorded"]}',
      },
    },
    {
      id: "v3-test-environment-3-5-0",
      note: "Maintenance desk, can you look at this? estuary edge is being swept away in a flash flood carrying people with it.",
      target: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "estuary_edge",
        condition: "immediate_danger",
        evidence: [
          "estuary edge is being swept away in a flash flood carrying people with it",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "estuary_edge",
        condition: "immediate_danger",
        evidence: [
          "estuary edge is being swept away in a flash flood carrying people with it",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "estuary_edge",
        condition: "immediate_danger",
        evidence: [
          "estuary edge is being swept away in a flash flood carrying people with it",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "estuary_edge",
        condition: "immediate_danger",
        evidence: [
          "estuary edge is being swept away in a flash flood carrying people with it",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "safety",\n  "object": "estuary_edge",\n  "condition": "unstable",\n  "severity": "critical",\n  "evidence": [\n    "estuary edge is being swept away",\n    "flash flood carrying people with it"\n  ]\n}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "estuary_edge", "condition": "immediate_danger", "evidence": ["estuary edge is being swept away in a flash flood carrying people with it"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "estuary_edge", "condition": "immediate_danger", "evidence": ["estuary edge is being swept away in a flash flood carrying people with it"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "estuary_edge", "condition": "immediate_danger", "evidence": ["estuary edge is being swept away in a flash flood carrying people with it"]}',
      },
    },
    {
      id: "v3-test-infrastructure-0-6-2",
      note: "Maintenance desk zara dekho. sadak ki puliya ka paint utra hai, saare parts solid aur usable hain.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "road_culvert",
        condition: "minor_wear",
        evidence: [
          "road culvert shows chipped paint while all parts remain solid and usable",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "paint",
        condition: "peeling",
        severity: "LOW",
        evidence: ["sadak ki puliya ka paint utra hai"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "road_sign",
        condition: "minor_wear",
        evidence: [
          "road sign's paint has faded, all parts are solid and usable",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "bridge",
        condition: "minor_wear",
        evidence: [
          "bridge has chipped paint; all parts remain solid and usable",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "parking_stall",
        condition: "minor_wear",
        evidence: [
          "parking stall has a chipped paint coating; all its parts remain solid and usable",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "paint", "condition": "peeling", "severity": "LOW", "evidence": ["sadak ki puliya ka paint utra hai"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "road_sign", "condition": "minor_wear", "evidence": ["road sign\'s paint has faded, all parts are solid and usable"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "bridge", "condition": "minor_wear", "evidence": ["bridge has chipped paint; all parts remain solid and usable"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "parking_stall", "condition": "minor_wear", "evidence": ["parking stall has a chipped paint coating; all its parts remain solid and usable"]}',
      },
    },
    {
      id: "v3-test-accessibility-1-5-2",
      note: "Maintenance desk zara dekho. sugam lakdi ka rasta ke uneven patches smooth karne hain, chair phir bhi nikal jaati.",
      target: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "mobility_boardwalk",
        condition: "maintenance_needed",
        evidence: [
          "mobility boardwalk has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "path",
        condition: "uneven",
        severity: "MEDIUM",
        evidence: ["sugam lakdi ka rasta ke uneven patches"],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "tactile_path",
        condition: "uneven_surface",
        evidence: [
          "tactile path has uneven patches needing smoothing, wheelchair still can pass",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "walking_path",
        condition: "maintenance_needed",
        evidence: [
          "pavement has uneven patches needing smoothing; a chair still slides off it",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "walking_stool",
        condition: "maintenance_needed",
        evidence: [
          "walking stool has uneven patches needing smoothing; a chair still slips off it",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "path",\n  "condition": "uneven",\n  "severity": "MEDIUM",\n  "evidence": [\n    "sugam lakdi ka rasta ke uneven patches"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "tactile_path", "condition": "uneven_surface", "evidence": ["tactile path has uneven patches needing smoothing, wheelchair still can pass"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "walking_path", "condition": "maintenance_needed", "evidence": ["pavement has uneven patches needing smoothing; a chair still slides off it"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "walking_stool", "condition": "maintenance_needed", "evidence": ["walking stool has uneven patches needing smoothing; a chair still slips off it"]}',
      },
    },
    {
      id: "v3-test-trail-2-5-0",
      note: "Encountered this on my return: ravine footpath has a landslip blocking the full hiking route, forcing everyone to turn back. Please record the facts.",
      target: {
        category: "TRAIL",
        severity: "HIGH",
        object: "ravine_footpath",
        condition: "major_obstruction",
        evidence: [
          "ravine footpath has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "footpath",
        condition: "obstruction",
        evidence: [
          "ravine footpath has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "ravine_footpath",
        condition: "major_obstruction",
        evidence: [
          "ravine footpath has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "ravine_footpath",
        condition: "major_obstruction",
        evidence: [
          "ravine footpath has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "trail", "object": "footpath", "condition": "blocked", "severity": "high", "evidence": ["ravine footpath has a landslip blocking the full hiking route", "forcing everyone to turn back"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "HIGH", "object": "footpath", "condition": "obstruction", "evidence": ["ravine footpath has a landslip blocking the full hiking route, forcing everyone to turn back"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "HIGH", "object": "ravine_footpath", "condition": "major_obstruction", "evidence": ["ravine footpath has a landslip blocking the full hiking route, forcing everyone to turn back"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "HIGH", "object": "ravine_footpath", "condition": "major_obstruction", "evidence": ["ravine footpath has a landslip blocking the full hiking route, forcing everyone to turn back"]}',
      },
    },
    {
      id: "v3-test-lighting-3-6-1",
      note: "वापसी पर यह मिला: भूमिगत रोशनी बंद हुआ जब बच्चा अदृश्य किनारे के पार गया और अभी गिर रहा है। तथ्य दर्ज करें।",
      target: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "subway_illumination",
        condition: "immediate_danger",
        evidence: [
          "subway illumination failed as a child stepped over an invisible edge and is falling now",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "public_lamp",
        condition: "failed",
        severity: "HIGH",
        evidence: [
          "भूमिगत रोशनी बंद हुआ",
          "बच्चा अदृश्य किनारे के पार गया",
          "अभी गिर रहा है",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "underground_lighting",
        condition: "malfunction",
        evidence: [
          "underground lighting failed when child crossed the invisible edge and is still falling",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "underground_light",
        condition: "immediate_danger",
        evidence: [
          "underground lighting has failed and a child has gone off an unseen edge and is falling now; record the fact",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "underground_light",
        condition: "immediate_danger",
        evidence: [
          "underground light has failed and a child is falling off an unseen edge and is falling now; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "public_lamp", "condition": "failed", "severity": "HIGH", "evidence": ["भूमिगत रोशनी बंद हुआ", "बच्चा अदृश्य किनारे के पार गया", "अभी गिर रहा है"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "underground_lighting", "condition": "malfunction", "evidence": ["underground lighting failed when child crossed the invisible edge and is still falling"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "underground_light", "condition": "immediate_danger", "evidence": ["underground lighting has failed and a child has gone off an unseen edge and is falling now; record the fact"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "underground_light", "condition": "immediate_danger", "evidence": ["underground light has failed and a child is falling off an unseen edge and is falling now; record the fact"]}',
      },
    },
    {
      id: "v3-test-safety-3-5-2",
      note: "Maintenance desk zara dekho. construction ka gaddha ke andar person phansa hai, jaanleva hazard abhi jaari hai.",
      target: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "construction_shaft",
        condition: "immediate_danger",
        evidence: [
          "construction shaft has a person caught inside while an active lethal hazard continues",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "construction_site",
        condition: "person_trapped",
        severity: "CRITICAL",
        evidence: [
          "construction ka gaddha ke andar person phansa hai",
          "jaanleva hazard abhi jaari hai",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "construction_site",
        condition: "immediate_danger",
        evidence: [
          "construction site has a pit where a person is trapped, life-threatening hazard is ongoing",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "construction_site",
        condition: "immediate_danger",
        evidence: [
          "construction site has a deep excavation with a person trapped inside; there is an immediate danger",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "construction_ditch",
        condition: "immediate_danger",
        evidence: [
          "construction ditch has a trapped person and an active life-threatening hazard right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "construction_site", "condition": "person_trapped", "severity": "CRITICAL", "evidence": ["construction ka gaddha ke andar person phansa hai", "jaanleva hazard abhi jaari hai"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "construction_site", "condition": "immediate_danger", "evidence": ["construction site has a pit where a person is trapped, life-threatening hazard is ongoing"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "construction_site", "condition": "immediate_danger", "evidence": ["construction site has a deep excavation with a person trapped inside; there is an immediate danger"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "construction_ditch", "condition": "immediate_danger", "evidence": ["construction ditch has a trapped person and an active life-threatening hazard right now"]}',
      },
    },
    {
      id: "v3-test-trail-0-6-2",
      note: "Maintenance desk zara dekho. maidan ka kachcha track par chhoti twigs hain, dirt track par chalna mushkil nahi.",
      target: {
        category: "TRAIL",
        severity: "LOW",
        object: "moorland_track",
        condition: "minor_wear",
        evidence: [
          "moorland track has scattered twigs without making the dirt track harder to walk",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "TRAIL",
        object: "track",
        condition: "obstructed",
        severity: "LOW",
        evidence: ["chhoti twigs hain", "dirt track par chalna mushkil nahi"],
      },
      fewShotPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "dirt_track",
        condition: "minor_obstruction",
        evidence: [
          "dirt track has small twigs, walking on dirt track is not difficult",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "walking_track",
        condition: "minor_wear",
        evidence: [
          "walking track has a few loose twigs across it; the unpaved track remains passable",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "forest_track",
        condition: "minor_wear",
        evidence: [
          "forest track has a few loose twigs; walkers can use the unpaved track normally",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "TRAIL", "object": "track", "condition": "obstructed", "severity": "LOW", "evidence": ["chhoti twigs hain", "dirt track par chalna mushkil nahi"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "LOW", "object": "dirt_track", "condition": "minor_obstruction", "evidence": ["dirt track has small twigs, walking on dirt track is not difficult"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "LOW", "object": "walking_track", "condition": "minor_wear", "evidence": ["walking track has a few loose twigs across it; the unpaved track remains passable"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "LOW", "object": "forest_track", "condition": "minor_wear", "evidence": ["forest track has a few loose twigs; walkers can use the unpaved track normally"]}',
      },
    },
    {
      id: "v3-test-signage-2-6-2",
      note: "Maintenance desk zara dekho. doosre raste ka panel galat diversion se hazardous work area mein bhejta hai.",
      target: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "detour_panel",
        condition: "major_obstruction",
        evidence: [
          "detour panel gives the wrong diversion into a hazardous works area",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "sign",
        condition: "misleading",
        severity: "HIGH",
        evidence: [
          "doosre raste ka panel galat diversion se hazardous work area mein bhejta hai",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "signage",
        condition: "incorrect_diversion",
        evidence: [
          "signage sends pedestrians to a hazardous work area via incorrect diversion",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "exit_sign",
        condition: "major_obstruction",
        evidence: ["exit sign misdirects walkers into a hazardous work area"],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "HIGH",
        object: "exit_sign",
        condition: "major_obstruction",
        evidence: [
          "exit sign misdirects walkers into a hazardous work area without a safe alternative",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "sign",\n  "condition": "misleading",\n  "severity": "HIGH",\n  "evidence": [\n    "doosre raste ka panel galat diversion se hazardous work area mein bhejta hai"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "signage", "condition": "incorrect_diversion", "evidence": ["signage sends pedestrians to a hazardous work area via incorrect diversion"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "exit_sign", "condition": "major_obstruction", "evidence": ["exit sign misdirects walkers into a hazardous work area"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "HIGH", "object": "exit_sign", "condition": "major_obstruction", "evidence": ["exit sign misdirects walkers into a hazardous work area without a safe alternative"]}',
      },
    },
    {
      id: "v3-test-lighting-0-5-2",
      note: "Vaapas aate hue mila: ghat ki roshni briefly flicker hota hai, paas ki roshni se crossing clear dikhti hai. Facts note karo.",
      target: {
        category: "LIGHTING",
        severity: "LOW",
        object: "quayside_beacon",
        condition: "minor_wear",
        evidence: [
          "quayside beacon flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "lamp",
        condition: "flickering",
        severity: "LOW",
        evidence: ["roshni briefly flicker hota hai"],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "street_light",
        condition: "intermittent_failure",
        evidence: [
          "street light briefly flickers, crossing is clearly visible from nearby lighting",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "stair_light",
        condition: "minor_wear",
        evidence: [
          "stair light briefly flickers; the nearby lighting makes the crossing clearly visible",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "stair_light",
        condition: "minor_wear",
        evidence: [
          "stair light briefly flickers, with a visible crossing illuminated by nearby light",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "lamp", "condition": "flickering", "severity": "LOW", "evidence": ["roshni briefly flicker hota hai"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "LOW", "object": "street_light", "condition": "intermittent_failure", "evidence": ["street light briefly flickers, crossing is clearly visible from nearby lighting"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "LOW", "object": "stair_light", "condition": "minor_wear", "evidence": ["stair light briefly flickers; the nearby lighting makes the crossing clearly visible"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "LOW", "object": "stair_light", "condition": "minor_wear", "evidence": ["stair light briefly flickers, with a visible crossing illuminated by nearby light"]}',
      },
    },
    {
      id: "v3-test-safety-3-6-1",
      note: "वापसी पर यह मिला: आपात दरवाजा के अंदर व्यक्ति फंसा है और जानलेवा खतरा अभी जारी है। तथ्य दर्ज करें।",
      target: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "emergency_hatch",
        condition: "immediate_danger",
        evidence: [
          "emergency hatch has a person caught inside while an active lethal hazard continues",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "emergency_door",
        condition: "trapped_person",
        severity: "CRITICAL",
        evidence: ["व्यक्ति फंसा है", "जानलेवा खतरा अभी जारी है"],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "emergency_door",
        condition: "immediate_danger",
        evidence: [
          "person is trapped inside emergency door and life-threatening danger is ongoing",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "fire_exit",
        condition: "immediate_danger",
        evidence: [
          "fire exit has a trapped person with an ongoing life-threatening danger; the fact is recorded",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "fire_exit",
        condition: "immediate_danger",
        evidence: [
          "fire exit has a trapped person and an ongoing life-threatening danger; the fact is recorded",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "emergency_door", "condition": "trapped_person", "severity": "CRITICAL", "evidence": ["व्यक्ति फंसा है", "जानलेवा खतरा अभी जारी है"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "emergency_door", "condition": "immediate_danger", "evidence": ["person is trapped inside emergency door and life-threatening danger is ongoing"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "fire_exit", "condition": "immediate_danger", "evidence": ["fire exit has a trapped person with an ongoing life-threatening danger; the fact is recorded"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "fire_exit", "condition": "immediate_danger", "evidence": ["fire exit has a trapped person and an ongoing life-threatening danger; the fact is recorded"]}',
      },
    },
    {
      id: "v3-test-trail-1-6-1",
      note: "वापसी पर यह मिला: खुले मैदान का कच्चा मार्ग में बारिश की छोटी लीक है; मिट्टी मार्ग सुधारना है पर खुला है। तथ्य दर्ज करें।",
      target: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "moorland_track",
        condition: "maintenance_needed",
        evidence: [
          "moorland track has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "TRAIL",
        object: "path",
        condition: "water_leak",
        severity: "MEDIUM",
        evidence: [
          "खुले मैदान का कच्चा मार्ग में बारिश की छोटी लीक है",
          "मिट्टी मार्ग सुधारना है पर खुला है",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "unpaved_path",
        condition: "minor_damage",
        evidence: [
          "unpaved path has a small leak from rain; soil path needs repair but is open",
          "fact recorded",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "open_trail",
        condition: "maintenance_needed",
        evidence: [
          "open unpaved trail has a minor leaking watercourse needing repair; the unpaved route remains passable",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "open_trail",
        condition: "maintenance_needed",
        evidence: [
          "unpaved open trail has a minor leaking fault; the earth route needs repair and remains passable; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "TRAIL", "object": "path", "condition": "water_leak", "severity": "MEDIUM", "evidence": ["खुले मैदान का कच्चा मार्ग में बारिश की छोटी लीक है", "मिट्टी मार्ग सुधारना है पर खुला है"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "unpaved_path", "condition": "minor_damage", "evidence": ["unpaved path has a small leak from rain; soil path needs repair but is open", "fact recorded"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "open_trail", "condition": "maintenance_needed", "evidence": ["open unpaved trail has a minor leaking watercourse needing repair; the unpaved route remains passable"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "open_trail", "condition": "maintenance_needed", "evidence": ["unpaved open trail has a minor leaking fault; the earth route needs repair and remains passable; record the fact"]}',
      },
    },
    {
      id: "v3-test-environment-0-5-1",
      note: "वापसी पर यह मिला: मुहाने का किनारा के कुछ पत्ते अस्तव्यस्त हैं, आसपास के आवास को नुकसान नहीं। तथ्य दर्ज करें।",
      target: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "estuary_edge",
        condition: "minor_wear",
        evidence: [
          "estuary edge has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "tree_branches",
        condition: "overgrown",
        severity: "LOW",
        evidence: ["मुहाने का किनारा के कुछ पत्ते अस्तव्यस्त हैं"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "curb",
        condition: "minor_wear",
        evidence: [
          "some leaves are scattered at the edge of the entrance, no damage to surrounding housing",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "forest_edge",
        condition: "minor_wear",
        evidence: [
          "forest edge has a few loose leaves; no nearby dwellings are damaged; record the fact",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "entrance_edge",
        condition: "minor_wear",
        evidence: [
          "entrance edge has a few loose leaves; no nearby property is damaged; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "tree_branches", "condition": "overgrown", "severity": "LOW", "evidence": ["मुहाने का किनारा के कुछ पत्ते अस्तव्यस्त हैं"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "curb", "condition": "minor_wear", "evidence": ["some leaves are scattered at the edge of the entrance, no damage to surrounding housing"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "forest_edge", "condition": "minor_wear", "evidence": ["forest edge has a few loose leaves; no nearby dwellings are damaged; record the fact"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "entrance_edge", "condition": "minor_wear", "evidence": ["entrance edge has a few loose leaves; no nearby property is damaged; record the fact"]}',
      },
    },
    {
      id: "v3-test-cleanliness-1-6-0",
      note: "Encountered this on my return: canal steps is surrounded by uncollected bags giving off a smell, with clear space to walk. Please record the facts.",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "canal_steps",
        condition: "maintenance_needed",
        evidence: [
          "canal steps is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "canal_steps",
        condition: "uncollected_waste",
        evidence: [
          "canal steps is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "canal_steps",
        condition: "maintenance_needed",
        evidence: [
          "canal steps is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "canal_steps",
        condition: "maintenance_needed",
        evidence: [
          "canal steps is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "cleanliness", "object": "waste_bin", "condition": "overflowing", "severity": "medium", "evidence": ["uncollected bags", "giving off a smell"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "canal_steps", "condition": "uncollected_waste", "evidence": ["canal steps is surrounded by uncollected bags giving off a smell, with clear space to walk"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "canal_steps", "condition": "maintenance_needed", "evidence": ["canal steps is surrounded by uncollected bags giving off a smell, with clear space to walk"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "canal_steps", "condition": "maintenance_needed", "evidence": ["canal steps is surrounded by uncollected bags giving off a smell, with clear space to walk"]}',
      },
    },
    {
      id: "v3-test-environment-3-5-2",
      note: "Maintenance desk zara dekho. muhane ka kinara flash flood mein beh raha aur log saath mein beh rahe.",
      target: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "estuary_edge",
        condition: "immediate_danger",
        evidence: [
          "estuary edge is being swept away in a flash flood carrying people with it",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "flood_water",
        condition: "imminent_hazard",
        evidence: [
          "muhane ka kinara flash flood mein beh raha aur log saath mein beh rahe",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "stream_bank",
        condition: "immediate_danger",
        evidence: [
          "stream bank is being washed away and people are being swept with it",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "stream_bank",
        condition: "immediate_danger",
        evidence: [
          "stream bank is being washed away and people are being swept with it right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "FLOODING", "object": "area", "condition": "flooded", "severity": "CRITICAL", "evidence": ["muhane ka kinara flash flood mein beh raha", "log saath mein beh rahe"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "flood_water", "condition": "imminent_hazard", "evidence": ["muhane ka kinara flash flood mein beh raha aur log saath mein beh rahe"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "stream_bank", "condition": "immediate_danger", "evidence": ["stream bank is being washed away and people are being swept with it"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "stream_bank", "condition": "immediate_danger", "evidence": ["stream bank is being washed away and people are being swept with it right now"]}',
      },
    },
    {
      id: "v3-test-environment-1-6-1",
      note: "वापसी पर यह मिला: वन क्षेत्र में पौधे खराब और पानी गंदा है; बड़े खतरे का संकेत नहीं। तथ्य दर्ज करें।",
      target: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "woodland",
        condition: "maintenance_needed",
        evidence: [
          "woodland shows damaged plants and dirty water; nothing indicates a major hazard",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "ENVIRONMENT",
        object: "water_source",
        condition: "contaminated",
        severity: "LOW",
        evidence: ["पानी गंदा है"],
      },
      fewShotPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "vegetation_water",
        condition: "poor_condition",
        evidence: [
          "trees are damaged and water is dirty; no indication of major danger",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "forest_area",
        condition: "maintenance_needed",
        evidence: [
          "forest area has damaged vegetation and contaminated water; no major danger is indicated",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "forest_area",
        condition: "maintenance_needed",
        evidence: [
          "forest area has damaged vegetation and contaminated water; no major danger is indicated",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ENVIRONMENT", "object": "water_source", "condition": "contaminated", "severity": "LOW", "evidence": ["पानी गंदा है"]}',
        few_shot:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "vegetation_water", "condition": "poor_condition", "evidence": ["trees are damaged and water is dirty; no indication of major danger"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "forest_area", "condition": "maintenance_needed", "evidence": ["forest area has damaged vegetation and contaminated water; no major danger is indicated"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "forest_area", "condition": "maintenance_needed", "evidence": ["forest area has damaged vegetation and contaminated water; no major danger is indicated"]}',
      },
    },
    {
      id: "v3-test-signage-1-6-1",
      note: "वापसी पर यह मिला: वैकल्पिक मार्ग पट्ट के शब्द मिट गए हैं, आगंतुकों को लिखी दिशा नहीं मिलती। तथ्य दर्ज करें।",
      target: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "detour_panel",
        condition: "maintenance_needed",
        evidence: [
          "detour panel has lost its text, leaving visitors without the posted directions",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "sign",
        condition: "missing",
        severity: "MEDIUM",
        evidence: [
          "वैकल्पिक मार्ग पट्ट के शब्द मिट गए हैं",
          "आगंतुकों को लिखी दिशा नहीं मिलती",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "alternative_route_sign",
        condition: "missing_information",
        evidence: [
          "alternative route sign words have faded, visitors do not get written directions",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "alternative_route",
        condition: "maintenance_needed",
        evidence: [
          "alternative route sign has faded and no written direction is visible for walkers",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "alternative_route",
        condition: "maintenance_needed",
        evidence: [
          "alternative route has faded wording and no written direction is available for walkers",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "sign", "condition": "missing", "severity": "MEDIUM", "evidence": ["वैकल्पिक मार्ग पट्ट के शब्द मिट गए हैं", "आगंतुकों को लिखी दिशा नहीं मिलती"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "alternative_route_sign", "condition": "missing_information", "evidence": ["alternative route sign words have faded, visitors do not get written directions"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "alternative_route", "condition": "maintenance_needed", "evidence": ["alternative route sign has faded and no written direction is visible for walkers"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "alternative_route", "condition": "maintenance_needed", "evidence": ["alternative route has faded wording and no written direction is available for walkers"]}',
      },
    },
    {
      id: "v3-test-lighting-3-5-0",
      note: "Maintenance desk, can you look at this? quayside beacon failed as a child stepped over an invisible edge and is falling now.",
      target: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "quayside_beacon",
        condition: "immediate_danger",
        evidence: [
          "quayside beacon failed as a child stepped over an invisible edge and is falling now",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "beacon",
        condition: "failed",
        severity: "CRITICAL",
        evidence: [
          "quayside beacon failed",
          "child stepped over an invisible edge",
          "child is falling now",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "quayside_beacon",
        condition: "immediate_danger",
        evidence: [
          "quayside beacon failed as a child stepped over an invisible edge and is falling now",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "quayside_light",
        condition: "immediate_danger",
        evidence: [
          "quayside beacon has failed and a child has stepped over an invisible edge and is falling now",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "quayside_beacon",
        condition: "immediate_danger",
        evidence: [
          "quayside beacon has failed and a child has stepped over an invisible edge and is falling now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "beacon",\n  "condition": "failed",\n  "severity": "CRITICAL",\n  "evidence": [\n    "quayside beacon failed",\n    "child stepped over an invisible edge",\n    "child is falling now"\n  ]\n}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "quayside_beacon", "condition": "immediate_danger", "evidence": ["quayside beacon failed as a child stepped over an invisible edge and is falling now"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "quayside_light", "condition": "immediate_danger", "evidence": ["quayside beacon has failed and a child has stepped over an invisible edge and is falling now"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "quayside_beacon", "condition": "immediate_danger", "evidence": ["quayside beacon has failed and a child has stepped over an invisible edge and is falling now"]}',
      },
    },
    {
      id: "v3-test-accessibility-1-6-0",
      note: "Encountered this on my return: accessible underpass has uneven patches that need smoothing; a chair can still get through. Please record the facts.",
      target: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_underpass",
        condition: "maintenance_needed",
        evidence: [
          "accessible underpass has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "underpass",
        condition: "uneven_surface",
        severity: "MEDIUM",
        evidence: [
          "accessible underpass has uneven patches",
          "a chair can still get through",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "underpass",
        condition: "uneven_surface",
        evidence: [
          "accessible underpass has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_underpass",
        condition: "maintenance_needed",
        evidence: [
          "accessible underpass has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_underpass",
        condition: "maintenance_needed",
        evidence: [
          "accessible underpass has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "ACCESSIBILITY",\n  "object": "underpass",\n  "condition": "uneven_surface",\n  "severity": "MEDIUM",\n  "evidence": [\n    "accessible underpass has uneven patches",\n    "a chair can still get through"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "underpass", "condition": "uneven_surface", "evidence": ["accessible underpass has uneven patches that need smoothing; a chair can still get through"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "accessible_underpass", "condition": "maintenance_needed", "evidence": ["accessible underpass has uneven patches that need smoothing; a chair can still get through"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "accessible_underpass", "condition": "maintenance_needed", "evidence": ["accessible underpass has uneven patches that need smoothing; a chair can still get through"]}',
      },
    },
    {
      id: "v3-test-signage-0-5-0",
      note: "Encountered this on my return: evacuation marker has a scratched corner; every direction can still be understood. Please record the facts.",
      target: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "evacuation_marker",
        condition: "minor_wear",
        evidence: [
          "evacuation marker has a scratched corner; every direction can still be understood",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "evacuation_marker",
        condition: "damaged",
        severity: "LOW",
        evidence: [
          "evacuation marker has a scratched corner",
          "every direction can still be understood",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "evacuation_sign",
        condition: "minor_damage",
        evidence: [
          "evacuation marker has a scratched corner; every direction can still be understood",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "exit_sign",
        condition: "minor_wear",
        evidence: [
          "exit sign has a scratched corner; every direction can still be understood",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "evacuation_marker",
        condition: "minor_wear",
        evidence: [
          "evacuation marker has a scratched corner; every direction can still be understood",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "evacuation_marker",\n  "condition": "damaged",\n  "severity": "LOW",\n  "evidence": [\n    "evacuation marker has a scratched corner",\n    "every direction can still be understood"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "evacuation_sign", "condition": "minor_damage", "evidence": ["evacuation marker has a scratched corner; every direction can still be understood"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "exit_sign", "condition": "minor_wear", "evidence": ["exit sign has a scratched corner; every direction can still be understood"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "evacuation_marker", "condition": "minor_wear", "evidence": ["evacuation marker has a scratched corner; every direction can still be understood"]}',
      },
    },
    {
      id: "v3-test-cleanliness-1-5-2",
      note: "Maintenance desk zara dekho. sarvajanik aangan ke aas paas uncollected bags badboo de rahe, walking space clear hai.",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "public_courtyard",
        condition: "maintenance_needed",
        evidence: [
          "public courtyard is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "uncollected_bags",
        condition: "odor",
        severity: "LOW",
        evidence: ["uncollected bags badboo de rahe"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "waste_bin",
        condition: "uncollected_waste",
        evidence: [
          "uncollected bags are causing bad smell, walking space is clear",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_area",
        condition: "minor_wear",
        evidence: [
          "public area has uncollected bags with an unpleasant smell; the walking space remains clear",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "public_area",
        condition: "minor_wear",
        evidence: [
          "public area has uncollected bags with an unpleasant smell; the walking space remains clear",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "uncollected_bags", "condition": "odor", "severity": "LOW", "evidence": ["uncollected bags badboo de rahe"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "waste_bin", "condition": "uncollected_waste", "evidence": ["uncollected bags are causing bad smell, walking space is clear"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "public_area", "condition": "minor_wear", "evidence": ["public area has uncollected bags with an unpleasant smell; the walking space remains clear"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "public_area", "condition": "minor_wear", "evidence": ["public area has uncollected bags with an unpleasant smell; the walking space remains clear"]}',
      },
    },
    {
      id: "v3-test-safety-1-5-1",
      note: "देखभाल कार्यालय, इसे देखें। निर्माण गड्ढा के बाहरी रक्षक की मरम्मत चाहिए; चिंगारी या दूसरा खतरा नहीं बताया।",
      target: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "construction_shaft",
        condition: "maintenance_needed",
        evidence: [
          "construction shaft needs its outer guard repaired; there are no sparks or other reported hazards",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "construction_site",
        condition: "inadequate_protection",
        severity: "HIGH",
        evidence: ["निर्माण गड्ढा के बाहरी रक्षक की मरम्मत चाहिए"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "construction_site",
        condition: "maintenance_needed",
        evidence: [
          "construction site guard needs repair; no fire or other danger is stated",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "maintenance_cabinet",
        condition: "maintenance_needed",
        evidence: [
          "maintenance cabinet has an unprotected construction excavation needing repair; no fire or other danger is stated",
        ],
      },
      secondSeedPrediction: null,
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "construction_site", "condition": "inadequate_protection", "severity": "HIGH", "evidence": ["निर्माण गड्ढा के बाहरी रक्षक की मरम्मत चाहिए"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "construction_site", "condition": "maintenance_needed", "evidence": ["construction site guard needs repair; no fire or other danger is stated"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "maintenance_cabinet", "condition": "maintenance_needed", "evidence": ["maintenance cabinet has an unprotected construction excavation needing repair; no fire or other danger is stated"]}',
        fine_tuned_seed1729:
          '{"category": "MAINTENANCE", "severity": "MEDIUM", "object": "maintenance_cabinet", "condition": "maintenance_needed", "evidence": ["maintenance cabinet has an unprotected exposed repair hole; no fire or other danger is stated"]}',
      },
    },
    {
      id: "v3-test-safety-1-6-2",
      note: "Vaapas aate hue mila: aapat darwaza ka outer guard repair chahiye, sparks ya doosra hazard nahi bataya. Facts note karo.",
      target: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "emergency_hatch",
        condition: "maintenance_needed",
        evidence: [
          "emergency hatch needs its outer guard repaired; there are no sparks or other reported hazards",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "apartments_building",
        condition: "structural_damage",
        severity: "MEDIUM",
        evidence: [
          "apartments building outer guard repair chahiye",
          "sparks ya doosra hazard nahi bataya",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "emergency_door",
        condition: "maintenance_needed",
        evidence: [
          "emergency door outer guard needs repair, no sparks or other hazard stated",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "fire_exit",
        condition: "maintenance_needed",
        evidence: [
          "fire exit has an unprotected exterior guard needing repair; no sparks or other hazard is reported",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "fire_exit",
        condition: "maintenance_needed",
        evidence: [
          "fire exit has an external guard needing repair; no sparks or other hazard is reported",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "apartments_building", "condition": "structural_damage", "severity": "MEDIUM", "evidence": ["apartments building outer guard repair chahiye", "sparks ya doosra hazard nahi bataya"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "emergency_door", "condition": "maintenance_needed", "evidence": ["emergency door outer guard needs repair, no sparks or other hazard stated"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "fire_exit", "condition": "maintenance_needed", "evidence": ["fire exit has an unprotected exterior guard needing repair; no sparks or other hazard is reported"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "fire_exit", "condition": "maintenance_needed", "evidence": ["fire exit has an external guard needing repair; no sparks or other hazard is reported"]}',
      },
    },
    {
      id: "v3-test-infrastructure-2-5-0",
      note: "Encountered this on my return: pedestrian platform has split apart, leaving no usable crossing for pedestrians. Please record the facts.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "pedestrian_platform",
        condition: "major_obstruction",
        evidence: [
          "pedestrian platform has split apart, leaving no usable crossing for pedestrians",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "pedestrian_platform",
        condition: "split_apart",
        severity: "HIGH",
        evidence: [
          "pedestrian platform has split apart",
          "no usable crossing for pedestrians",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "pedestrian_platform",
        condition: "structural_damage",
        evidence: [
          "pedestrian platform has split apart, leaving no usable crossing for pedestrians",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "crossing",
        condition: "major_obstruction",
        evidence: [
          "crossing has split apart and no usable pedestrian crossing remains",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "pedestrian_platform",
        condition: "major_obstruction",
        evidence: [
          "pedestrian platform has split apart, leaving no usable crossing for pedestrians",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "pedestrian_platform",\n  "condition": "split_apart",\n  "severity": "HIGH",\n  "evidence": [\n    "pedestrian platform has split apart",\n    "no usable crossing for pedestrians"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "pedestrian_platform", "condition": "structural_damage", "evidence": ["pedestrian platform has split apart, leaving no usable crossing for pedestrians"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "crossing", "condition": "major_obstruction", "evidence": ["crossing has split apart and no usable pedestrian crossing remains"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "pedestrian_platform", "condition": "major_obstruction", "evidence": ["pedestrian platform has split apart, leaving no usable crossing for pedestrians"]}',
      },
    },
    {
      id: "v3-test-infrastructure-1-6-1",
      note: "वापसी पर यह मिला: सड़क की पुलिया में दरारों पर पैबंद चाहिए, इसके ऊपर से निकल सकते हैं। तथ्य दर्ज करें।",
      target: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "road_culvert",
        condition: "maintenance_needed",
        evidence: [
          "road culvert has cracks that need patching, but passing over it is still possible",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "street_pavement",
        condition: "cracks",
        severity: "MEDIUM",
        evidence: ["दरारों पर पैबंद चाहिए", "इसके ऊपर से निकल सकते हैं"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "street_pulley",
        condition: "maintenance_needed",
        evidence: [
          "street pulley has cracks and needs to be secured, people can pass over it",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "bridge_cable",
        condition: "major_obstruction",
        evidence: [
          "bridge cable has visible rips needing immediate repair; walkers can pass over it now",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "street_curb",
        condition: "major_obstruction",
        evidence: [
          "street curb has visible cracks needing repair and walkers can pass over it",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "INFRASTRUCTURE", "object": "street_pavement", "condition": "cracks", "severity": "MEDIUM", "evidence": ["दरारों पर पैबंद चाहिए", "इसके ऊपर से निकल सकते हैं"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "street_pulley", "condition": "maintenance_needed", "evidence": ["street pulley has cracks and needs to be secured, people can pass over it"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "bridge_cable", "condition": "major_obstruction", "evidence": ["bridge cable has visible rips needing immediate repair; walkers can pass over it now"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "street_curb", "condition": "major_obstruction", "evidence": ["street curb has visible cracks needing repair and walkers can pass over it"]}',
      },
    },
    {
      id: "v3-test-trail-2-6-0",
      note: "Maintenance desk, can you look at this? moorland track has a landslip blocking the full hiking route, forcing everyone to turn back.",
      target: {
        category: "TRAIL",
        severity: "HIGH",
        object: "moorland_track",
        condition: "major_obstruction",
        evidence: [
          "moorland track has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "moorland_track",
        condition: "obstruction",
        evidence: [
          "moorland track has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "moorland_track",
        condition: "major_obstruction",
        evidence: [
          "moorland track has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "HIGH",
        object: "moorland_track",
        condition: "major_obstruction",
        evidence: [
          "moorland track has a landslip blocking the full hiking route, forcing everyone to turn back",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "trail", "object": "moorland_track", "condition": "blocked", "severity": "high", "evidence": ["landslip blocking the full hiking route", "forcing everyone to turn back"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "HIGH", "object": "moorland_track", "condition": "obstruction", "evidence": ["moorland track has a landslip blocking the full hiking route, forcing everyone to turn back"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "HIGH", "object": "moorland_track", "condition": "major_obstruction", "evidence": ["moorland track has a landslip blocking the full hiking route, forcing everyone to turn back"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "HIGH", "object": "moorland_track", "condition": "major_obstruction", "evidence": ["moorland track has a landslip blocking the full hiking route, forcing everyone to turn back"]}',
      },
    },
    {
      id: "v3-test-infrastructure-2-6-1",
      note: "देखभाल कार्यालय, इसे देखें। सड़क की पुलिया अलग टूट गया है, पैदल पार करने की जगह नहीं बची।",
      target: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "road_culvert",
        condition: "major_obstruction",
        evidence: [
          "road culvert has split apart, leaving no usable crossing for pedestrians",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "street_pulley",
        condition: "broken",
        severity: "HIGH",
        evidence: [
          "सड़क की पुलिया अलग टूट गया है",
          "पैदल पार करने की जगह नहीं बची",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "street_pulley",
        condition: "major_obstruction",
        evidence: [
          "street pulley has broken off, leaving no place to cross on foot",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "bridge_curb",
        condition: "major_obstruction",
        evidence: [
          "bridge curb has given way leaving no pedestrian crossing available",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "street_curb",
        condition: "major_obstruction",
        evidence: [
          "street curb has a major structural failure leaving no safe pedestrian crossing",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "street_pulley", "condition": "broken", "severity": "HIGH", "evidence": ["सड़क की पुलिया अलग टूट गया है", "पैदल पार करने की जगह नहीं बची"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "street_pulley", "condition": "major_obstruction", "evidence": ["street pulley has broken off, leaving no place to cross on foot"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "bridge_curb", "condition": "major_obstruction", "evidence": ["bridge curb has given way leaving no pedestrian crossing available"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "street_curb", "condition": "major_obstruction", "evidence": ["street curb has a major structural failure leaving no safe pedestrian crossing"]}',
      },
    },
    {
      id: "v3-test-environment-2-6-2",
      note: "Maintenance desk zara dekho. van ka ilaaka mein storm damage hai, heavy unstable mass walkway par hai.",
      target: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "woodland",
        condition: "major_obstruction",
        evidence: [
          "woodland has storm damage leaving a heavy unstable mass over the walkway",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "walkway",
        condition: "unstable",
        severity: "HIGH",
        evidence: ["storm damage", "heavy unstable mass walkway par hai"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "walkway",
        condition: "structural_damage",
        evidence: ["storm damage in van area, heavy unstable mass on walkway"],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "forest_trail",
        condition: "major_obstruction",
        evidence: [
          "forest trail has storm damage with a heavy unstable mass across the walkway",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "HIGH",
        object: "forest_area",
        condition: "major_obstruction",
        evidence: [
          "forest area has storm damage with a heavy unstable mass across a walkway",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "walkway",\n  "condition": "unstable",\n  "severity": "HIGH",\n  "evidence": [\n    "storm damage",\n    "heavy unstable mass walkway par hai"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "walkway", "condition": "structural_damage", "evidence": ["storm damage in van area, heavy unstable mass on walkway"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "HIGH", "object": "forest_trail", "condition": "major_obstruction", "evidence": ["forest trail has storm damage with a heavy unstable mass across the walkway"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "HIGH", "object": "forest_area", "condition": "major_obstruction", "evidence": ["forest area has storm damage with a heavy unstable mass across a walkway"]}',
      },
    },
    {
      id: "v3-test-lighting-0-5-0",
      note: "Encountered this on my return: quayside beacon flickers briefly but adjacent illumination keeps the crossing clearly visible. Please record the facts.",
      target: {
        category: "LIGHTING",
        severity: "LOW",
        object: "quayside_beacon",
        condition: "minor_wear",
        evidence: [
          "quayside beacon flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "beacon",
        condition: "flickering",
        severity: "LOW",
        evidence: [
          "quayside beacon flickers briefly",
          "adjacent illumination keeps the crossing clearly visible",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "beacon",
        condition: "intermittent_failure",
        evidence: [
          "quayside beacon flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "quayside_lantern",
        condition: "minor_wear",
        evidence: [
          "quayside lantern flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "quayside_beacon",
        condition: "minor_wear",
        evidence: [
          "quayside beacon flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "LIGHTING",\n  "object": "beacon",\n  "condition": "flickering",\n  "severity": "LOW",\n  "evidence": [\n    "quayside beacon flickers briefly",\n    "adjacent illumination keeps the crossing clearly visible"\n  ]\n}',
        few_shot:
          '{"category": "LIGHTING", "severity": "LOW", "object": "beacon", "condition": "intermittent_failure", "evidence": ["quayside beacon flickers briefly but adjacent illumination keeps the crossing clearly visible"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "LOW", "object": "quayside_lantern", "condition": "minor_wear", "evidence": ["quayside lantern flickers briefly but adjacent illumination keeps the crossing clearly visible"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "LOW", "object": "quayside_beacon", "condition": "minor_wear", "evidence": ["quayside beacon flickers briefly but adjacent illumination keeps the crossing clearly visible"]}',
      },
    },
    {
      id: "v3-test-environment-1-6-0",
      note: "Encountered this on my return: woodland shows damaged plants and dirty water; nothing indicates a major hazard. Please record the facts.",
      target: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "woodland",
        condition: "maintenance_needed",
        evidence: [
          "woodland shows damaged plants and dirty water; nothing indicates a major hazard",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "woodland",
        condition: "contamination",
        evidence: [
          "woodland shows damaged plants and dirty water; nothing indicates a major hazard",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "woodland",
        condition: "maintenance_needed",
        evidence: [
          "woodland has damaged vegetation and contaminated water; no major hazard is apparent",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "woodland",
        condition: "maintenance_needed",
        evidence: [
          "woodland has damaged vegetation and contaminated water; no major hazard is apparent",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "environment",\n  "object": "water",\n  "condition": "dirty",\n  "severity": "low",\n  "evidence": [\n    "woodland shows damaged plants",\n    "dirty water"\n  ]\n}',
        few_shot:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "woodland", "condition": "contamination", "evidence": ["woodland shows damaged plants and dirty water; nothing indicates a major hazard"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "woodland", "condition": "maintenance_needed", "evidence": ["woodland has damaged vegetation and contaminated water; no major hazard is apparent"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "woodland", "condition": "maintenance_needed", "evidence": ["woodland has damaged vegetation and contaminated water; no major hazard is apparent"]}',
      },
    },
    {
      id: "v3-test-lighting-3-5-1",
      note: "देखभाल कार्यालय, इसे देखें। घाट की रोशनी बंद हुआ जब बच्चा अदृश्य किनारे के पार गया और अभी गिर रहा है।",
      target: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "quayside_beacon",
        condition: "immediate_danger",
        evidence: [
          "quayside beacon failed as a child stepped over an invisible edge and is falling now",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "lamp",
        condition: "failed",
        severity: "HIGH",
        evidence: [
          "घाट की रोशनी बंद हुआ",
          "बच्चा अदृश्य किनारे के पार गया और अभी गिर रहा है",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "street_light",
        condition: "malfunctioning",
        evidence: [
          "street light is out when a child crossed the invisible edge and is still falling",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "stair_light",
        condition: "immediate_danger",
        evidence: [
          "stair light has failed and a child is falling off an unseen edge right now",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "stair_light",
        condition: "immediate_danger",
        evidence: [
          "stair light has failed and a child is falling off an unseen edge right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "lamp", "condition": "failed", "severity": "HIGH", "evidence": ["घाट की रोशनी बंद हुआ", "बच्चा अदृश्य किनारे के पार गया और अभी गिर रहा है"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "street_light", "condition": "malfunctioning", "evidence": ["street light is out when a child crossed the invisible edge and is still falling"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "stair_light", "condition": "immediate_danger", "evidence": ["stair light has failed and a child is falling off an unseen edge right now"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "stair_light", "condition": "immediate_danger", "evidence": ["stair light has failed and a child is falling off an unseen edge right now"]}',
      },
    },
    {
      id: "v3-test-cleanliness-3-5-0",
      note: "Maintenance desk, can you look at this? public courtyard is engulfed in flames and a visitor cannot escape the smoke at this moment.",
      target: {
        category: "CLEANLINESS",
        severity: "CRITICAL",
        object: "public_courtyard",
        condition: "immediate_danger",
        evidence: [
          "public courtyard is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "public_courtyard",
        condition: "fire",
        severity: "CRITICAL",
        evidence: [
          "public courtyard is engulfed in flames",
          "visitor cannot escape the smoke",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "public_courtyard",
        condition: "fire_emergency",
        evidence: [
          "public courtyard is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "CRITICAL",
        object: "public_courtyard",
        condition: "immediate_danger",
        evidence: [
          "public courtyard is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "public_courtyard",
        condition: "immediate_danger",
        evidence: [
          "public courtyard is engulfed in flames and a visitor cannot escape the smoke at this moment",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "public_courtyard", "condition": "fire", "severity": "CRITICAL", "evidence": ["public courtyard is engulfed in flames", "visitor cannot escape the smoke"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "public_courtyard", "condition": "fire_emergency", "evidence": ["public courtyard is engulfed in flames and a visitor cannot escape the smoke at this moment"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "CRITICAL", "object": "public_courtyard", "condition": "immediate_danger", "evidence": ["public courtyard is engulfed in flames and a visitor cannot escape the smoke at this moment"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "public_courtyard", "condition": "immediate_danger", "evidence": ["public courtyard is engulfed in flames and a visitor cannot escape the smoke at this moment"]}',
      },
    },
    {
      id: "v3-test-trail-1-6-0",
      note: "Encountered this on my return: moorland track has shallow ruts from rain; the earth path needs maintenance but is open. Please record the facts.",
      target: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "moorland_track",
        condition: "maintenance_needed",
        evidence: [
          "moorland track has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "earth_path",
        condition: "maintenance_needed",
        evidence: [
          "moorland track has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "moorland_track",
        condition: "maintenance_needed",
        evidence: [
          "moorland track has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "moorland_track",
        condition: "maintenance_needed",
        evidence: [
          "moorland track has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "trail",\n  "object": "earth_path",\n  "condition": "shallow_ruts",\n  "severity": "medium",\n  "evidence": [\n    "moorland track has shallow ruts from rain",\n    "the earth path needs maintenance but is open"\n  ]\n}',
        few_shot:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "earth_path", "condition": "maintenance_needed", "evidence": ["moorland track has shallow ruts from rain; the earth path needs maintenance but is open"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "moorland_track", "condition": "maintenance_needed", "evidence": ["moorland track has shallow ruts from rain; the earth path needs maintenance but is open"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "MEDIUM", "object": "moorland_track", "condition": "maintenance_needed", "evidence": ["moorland track has shallow ruts from rain; the earth path needs maintenance but is open"]}',
      },
    },
    {
      id: "v3-test-trail-1-5-1",
      note: "देखभाल कार्यालय, इसे देखें। बीहड़ की पगडंडी में बारिश की छोटी लीक है; मिट्टी मार्ग सुधारना है पर खुला है।",
      target: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "ravine_footpath",
        condition: "maintenance_needed",
        evidence: [
          "ravine footpath has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "road",
        condition: "damaged",
        severity: "MEDIUM",
        evidence: [
          "बारिश की छोटी लीक है",
          "मिट्टी मार्ग सुधारना है पर खुला है",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "LOW",
        object: "drainage_system",
        condition: "minor_leak",
        evidence: [
          "drainage system has a small leak due to rain; soil path needs repair but is open",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "hill_path",
        condition: "maintenance_needed",
        evidence: [
          "hill path has a minor leaking drainage; the unpaved route needs repair and remains passable",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "maintenance_station",
        condition: "maintenance_needed",
        evidence: [
          "maintenance station has a minor leaking gutter; the unpaved route is passable but needs repair",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "INFRASTRUCTURE", "object": "road", "condition": "damaged", "severity": "MEDIUM", "evidence": ["बारिश की छोटी लीक है", "मिट्टी मार्ग सुधारना है पर खुला है"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "LOW", "object": "drainage_system", "condition": "minor_leak", "evidence": ["drainage system has a small leak due to rain; soil path needs repair but is open"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "hill_path", "condition": "maintenance_needed", "evidence": ["hill path has a minor leaking drainage; the unpaved route needs repair and remains passable"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "maintenance_station", "condition": "maintenance_needed", "evidence": ["maintenance station has a minor leaking gutter; the unpaved route is passable but needs repair"]}',
      },
    },
    {
      id: "v3-test-accessibility-3-5-1",
      note: "देखभाल कार्यालय, इसे देखें। सुगम लकड़ी मार्ग खड़ी गहराई की ओर झुक रहा है और दिव्यांग आगंतुक उस पर है।",
      target: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "mobility_boardwalk",
        condition: "immediate_danger",
        evidence: [
          "mobility boardwalk is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "path",
        condition: "obstructed",
        severity: "HIGH",
        evidence: [
          "sugam wood path leaning towards deep area",
          "visually impaired visitor on it",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "tactile_path",
        condition: "major_obstruction",
        evidence: [
          "tactile path is leaning towards deep area and disabled visitor is on it",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_path",
        condition: "major_obstruction",
        evidence: [
          "accessible wooden path is leaning into a deep ravine with a visually impaired user on it now",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_walking_path",
        condition: "major_obstruction",
        evidence: [
          "accessible walking path is leaning into a deep ravine and a disabled visitor is on it right now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "path", "condition": "obstructed", "severity": "HIGH", "evidence": ["sugam wood path leaning towards deep area", "visually impaired visitor on it"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "tactile_path", "condition": "major_obstruction", "evidence": ["tactile path is leaning towards deep area and disabled visitor is on it"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_path", "condition": "major_obstruction", "evidence": ["accessible wooden path is leaning into a deep ravine with a visually impaired user on it now"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_walking_path", "condition": "major_obstruction", "evidence": ["accessible walking path is leaning into a deep ravine and a disabled visitor is on it right now"]}',
      },
    },
    {
      id: "v3-test-trail-0-6-1",
      note: "देखभाल कार्यालय, इसे देखें। खुले मैदान का कच्चा मार्ग पर छोटी टहनियां हैं पर कच्चे मार्ग पर चलना मुश्किल नहीं।",
      target: {
        category: "TRAIL",
        severity: "LOW",
        object: "moorland_track",
        condition: "minor_wear",
        evidence: [
          "moorland track has scattered twigs without making the dirt track harder to walk",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "TRAIL",
        object: "trail_surface",
        condition: "uneven_surface",
        severity: "LOW",
        evidence: ["छोटी टहनियां हैं", "कच्चे मार्ग पर चलना मुश्किल नहीं"],
      },
      fewShotPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "unpaved_path",
        condition: "minor_obstruction",
        evidence: ["unpaved path has small bumps but walking is not difficult"],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "forest_trail",
        condition: "minor_wear",
        evidence: [
          "forest trail has minor vegetation growth across it without making it difficult to walk",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "forest_trail",
        condition: "minor_wear",
        evidence: [
          "forest trail has minor vegetation growth across it, but walkers can use it normally",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "TRAIL", "object": "trail_surface", "condition": "uneven_surface", "severity": "LOW", "evidence": ["छोटी टहनियां हैं", "कच्चे मार्ग पर चलना मुश्किल नहीं"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "LOW", "object": "unpaved_path", "condition": "minor_obstruction", "evidence": ["unpaved path has small bumps but walking is not difficult"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "LOW", "object": "forest_trail", "condition": "minor_wear", "evidence": ["forest trail has minor vegetation growth across it without making it difficult to walk"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "LOW", "object": "forest_trail", "condition": "minor_wear", "evidence": ["forest trail has minor vegetation growth across it, but walkers can use it normally"]}',
      },
    },
    {
      id: "v3-test-lighting-2-6-2",
      note: "Maintenance desk zara dekho. underground roshni poori crossing blackout hai, bina guard ke deep drop ke paas.",
      target: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "subway_illumination",
        condition: "major_obstruction",
        evidence: [
          "subway illumination has blacked out the entire crossing beside an unguarded drop",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "lamp_post",
        condition: "non_functioning",
        severity: "HIGH",
        evidence: [
          "underground roshni poori crossing blackout hai",
          "bina guard ke deep drop ke paas",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "underground_lighting",
        condition: "complete_blackout",
        evidence: [
          "underground lighting has a complete blackout near deep drop without a guard",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "HIGH",
        object: "crossing_light",
        condition: "major_obstruction",
        evidence: [
          "crossing light has gone out leaving a deep unprotected drop without a guard",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "underground_light",
        condition: "immediate_danger",
        evidence: [
          "underground light has a major electrical failure leaving a crossing without light and no guard is available beside a deep drop",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "lamp_post", "condition": "non_functioning", "severity": "HIGH", "evidence": ["underground roshni poori crossing blackout hai", "bina guard ke deep drop ke paas"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "underground_lighting", "condition": "complete_blackout", "evidence": ["underground lighting has a complete blackout near deep drop without a guard"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "HIGH", "object": "crossing_light", "condition": "major_obstruction", "evidence": ["crossing light has gone out leaving a deep unprotected drop without a guard"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "underground_light", "condition": "immediate_danger", "evidence": ["underground light has a major electrical failure leaving a crossing without light and no guard is available beside a deep drop"]}',
      },
    },
    {
      id: "v3-test-safety-1-6-0",
      note: "Encountered this on my return: emergency hatch needs its outer guard repaired; there are no sparks or other reported hazards. Please record the facts.",
      target: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "emergency_hatch",
        condition: "maintenance_needed",
        evidence: [
          "emergency hatch needs its outer guard repaired; there are no sparks or other reported hazards",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "emergency_hatch",
        condition: "damaged",
        severity: "MEDIUM",
        evidence: ["emergency hatch needs its outer guard repaired"],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "emergency_hatch",
        condition: "maintenance_needed",
        evidence: [
          "emergency hatch needs its outer guard repaired; no sparks or other reported hazards",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "fire_exit",
        condition: "maintenance_needed",
        evidence: [
          "fire exit needs its outer guard repaired; there are no sparks or other reported hazards",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "fire_exit",
        condition: "maintenance_needed",
        evidence: [
          "fire exit needs its outer guard repaired; there are no sparks or other reported hazards",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "emergency_hatch",\n  "condition": "damaged",\n  "severity": "MEDIUM",\n  "evidence": [\n    "emergency hatch needs its outer guard repaired"\n  ]\n}',
        few_shot:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "emergency_hatch", "condition": "maintenance_needed", "evidence": ["emergency hatch needs its outer guard repaired; no sparks or other reported hazards"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "fire_exit", "condition": "maintenance_needed", "evidence": ["fire exit needs its outer guard repaired; there are no sparks or other reported hazards"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "fire_exit", "condition": "maintenance_needed", "evidence": ["fire exit needs its outer guard repaired; there are no sparks or other reported hazards"]}',
      },
    },
    {
      id: "v3-test-accessibility-2-6-0",
      note: "Maintenance desk, can you look at this? accessible underpass has a locked barrier; a wheelchair cannot get to the facility by any route.",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_underpass",
        condition: "major_obstruction",
        evidence: [
          "accessible underpass has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "underpass_barrier",
        condition: "major_obstruction",
        evidence: [
          "accessible underpass has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_underpass",
        condition: "major_obstruction",
        evidence: [
          "accessible underpass has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_underpass",
        condition: "major_obstruction",
        evidence: [
          "accessible underpass has a locked barrier; a wheelchair cannot get to the facility by any route",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "accessibility",\n  "object": "barrier",\n  "condition": "locked",\n  "severity": "high",\n  "evidence": [\n    "accessible underpass has a locked barrier",\n    "wheelchair cannot get to the facility by any route"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "underpass_barrier", "condition": "major_obstruction", "evidence": ["accessible underpass has a locked barrier; a wheelchair cannot get to the facility by any route"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_underpass", "condition": "major_obstruction", "evidence": ["accessible underpass has a locked barrier; a wheelchair cannot get to the facility by any route"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_underpass", "condition": "major_obstruction", "evidence": ["accessible underpass has a locked barrier; a wheelchair cannot get to the facility by any route"]}',
      },
    },
    {
      id: "v3-test-cleanliness-1-5-1",
      note: "देखभाल कार्यालय, इसे देखें। सार्वजनिक आंगन के चारों ओर बिना उठे थैले बदबू दे रहे हैं, चलने की जगह खुली है।",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "public_courtyard",
        condition: "maintenance_needed",
        evidence: [
          "public courtyard is surrounded by uncollected bags giving off a smell, with clear space to walk",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "CLEANLINESS",
        object: "waste_bin",
        condition: "overflowing",
        severity: "HIGH",
        evidence: ["बिना उठे थैले बदबू दे रहे हैं", "चलने की जगह खुली है"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "waste_bin",
        condition: "odor_emission",
        evidence: [
          "public yard around waste bins emitting bad odor, path is open",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "public_area",
        condition: "maintenance_needed",
        evidence: [
          "public area has uncollected bins emitting an offensive smell with an unpolluted passage",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "public_area",
        condition: "maintenance_needed",
        evidence: [
          "public area has uncollected rubbish without a visible obstruction",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "waste_bin", "condition": "overflowing", "severity": "HIGH", "evidence": ["बिना उठे थैले बदबू दे रहे हैं", "चलने की जगह खुली है"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "waste_bin", "condition": "odor_emission", "evidence": ["public yard around waste bins emitting bad odor, path is open"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "public_area", "condition": "maintenance_needed", "evidence": ["public area has uncollected bins emitting an offensive smell with an unpolluted passage"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "public_area", "condition": "maintenance_needed", "evidence": ["public area has uncollected rubbish without a visible obstruction"]}',
      },
    },
    {
      id: "v3-test-accessibility-0-5-0",
      note: "Encountered this on my return: mobility boardwalk has a scuffed coating, yet mobility aids move over it without trouble. Please record the facts.",
      target: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "mobility_boardwalk",
        condition: "minor_wear",
        evidence: [
          "mobility boardwalk has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "mobility_boardwalk",
        condition: "cosmetic_damage",
        evidence: [
          "mobility boardwalk has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "mobility_boardwalk",
        condition: "minor_wear",
        evidence: [
          "mobility boardwalk has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "LOW",
        object: "mobility_boardwalk",
        condition: "minor_wear",
        evidence: [
          "mobility boardwalk has a scuffed coating, yet mobility aids move over it without trouble",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "accessibility",\n  "object": "mobility_boardwalk",\n  "condition": "scuffed_coating",\n  "severity": "low",\n  "evidence": [\n    "mobility boardwalk has a scuffed coating",\n    "mobility aids move over it without trouble"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "mobility_boardwalk", "condition": "cosmetic_damage", "evidence": ["mobility boardwalk has a scuffed coating, yet mobility aids move over it without trouble"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "mobility_boardwalk", "condition": "minor_wear", "evidence": ["mobility boardwalk has a scuffed coating, yet mobility aids move over it without trouble"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "LOW", "object": "mobility_boardwalk", "condition": "minor_wear", "evidence": ["mobility boardwalk has a scuffed coating, yet mobility aids move over it without trouble"]}',
      },
    },
    {
      id: "v3-test-environment-0-5-0",
      note: "Encountered this on my return: estuary edge has a few disturbed leaves with no damage to the surrounding habitat. Please record the facts.",
      target: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "estuary_edge",
        condition: "minor_wear",
        evidence: [
          "estuary edge has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: null,
      fewShotPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "estuary_edge",
        condition: "minor_disturbance",
        evidence: [
          "estuary edge has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "estuary_edge",
        condition: "minor_wear",
        evidence: [
          "estuary edge has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "LOW",
        object: "estuary_edge",
        condition: "minor_wear",
        evidence: [
          "estuary edge has a few disturbed leaves with no damage to the surrounding habitat",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "environment",\n  "object": "unknown",\n  "condition": "unspecified",\n  "severity": "low",\n  "evidence": [\n    "encountered disturbed leaves",\n    "no damage to surrounding habitat"\n  ]\n}',
        few_shot:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "estuary_edge", "condition": "minor_disturbance", "evidence": ["estuary edge has a few disturbed leaves with no damage to the surrounding habitat"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "estuary_edge", "condition": "minor_wear", "evidence": ["estuary edge has a few disturbed leaves with no damage to the surrounding habitat"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "LOW", "object": "estuary_edge", "condition": "minor_wear", "evidence": ["estuary edge has a few disturbed leaves with no damage to the surrounding habitat"]}',
      },
    },
    {
      id: "v3-test-other-0-5-2",
      note: "Vaapas aate hue mila: public timer par chhota cosmetic daag hai, service par asar nahi. Facts note karo.",
      target: {
        category: "OTHER",
        severity: "LOW",
        object: "public_timer",
        condition: "minor_wear",
        evidence: [
          "public timer has a small cosmetic blemish that does not affect its service",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "OTHER",
        object: "unknown",
        condition: "unspecified",
        severity: "LOW",
        evidence: ["cosmetic daag hai"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "LOW",
        object: "public_timer",
        condition: "cosmetic_damage",
        evidence: [
          "public timer has a small cosmetic stain, no effect on service",
        ],
      },
      fineTunedPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "public_timer",
        condition: "minor_wear",
        evidence: [
          "public timer has a minor cosmetic scratch with no effect on its service; note the facts",
        ],
      },
      secondSeedPrediction: {
        category: "OTHER",
        severity: "LOW",
        object: "public_timer",
        condition: "minor_wear",
        evidence: [
          "public timer has a minor cosmetic scratch with no effect on its service; note the facts",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "OTHER", "object": "unknown", "condition": "unspecified", "severity": "LOW", "evidence": ["cosmetic daag hai"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "LOW", "object": "public_timer", "condition": "cosmetic_damage", "evidence": ["public timer has a small cosmetic stain, no effect on service"]}',
        fine_tuned_seed42:
          '{"category": "OTHER", "severity": "LOW", "object": "public_timer", "condition": "minor_wear", "evidence": ["public timer has a minor cosmetic scratch with no effect on its service; note the facts"]}',
        fine_tuned_seed1729:
          '{"category": "OTHER", "severity": "LOW", "object": "public_timer", "condition": "minor_wear", "evidence": ["public timer has a minor cosmetic scratch with no effect on its service; note the facts"]}',
      },
    },
    {
      id: "v3-test-lighting-0-6-0",
      note: "Maintenance desk, can you look at this? subway illumination flickers briefly but adjacent illumination keeps the crossing clearly visible.",
      target: {
        category: "LIGHTING",
        severity: "LOW",
        object: "subway_illumination",
        condition: "minor_wear",
        evidence: [
          "subway illumination flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "public_lamp",
        condition: "flickering",
        severity: "LOW",
        evidence: [
          "subway illumination flickers briefly",
          "adjacent illumination keeps the crossing clearly visible",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "subway_light",
        condition: "flickering",
        evidence: [
          "subway illumination flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "subway_light",
        condition: "maintenance_needed",
        evidence: [
          "subway light flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "subway_light",
        condition: "maintenance_needed",
        evidence: [
          "subway light flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "LIGHTING",\n  "object": "public_lamp",\n  "condition": "flickering",\n  "severity": "LOW",\n  "evidence": [\n    "subway illumination flickers briefly",\n    "adjacent illumination keeps the crossing clearly visible"\n  ]\n}',
        few_shot:
          '{"category": "LIGHTING", "severity": "LOW", "object": "subway_light", "condition": "flickering", "evidence": ["subway illumination flickers briefly but adjacent illumination keeps the crossing clearly visible"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "subway_light", "condition": "maintenance_needed", "evidence": ["subway light flickers briefly but adjacent illumination keeps the crossing clearly visible"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "subway_light", "condition": "maintenance_needed", "evidence": ["subway light flickers briefly but adjacent illumination keeps the crossing clearly visible"]}',
      },
    },
    {
      id: "v3-test-safety-0-6-2",
      note: "Maintenance desk zara dekho. aapat darwaza untidy dikhta hai, guard intact hai, dangerous cheez exposed nahi.",
      target: {
        category: "SAFETY",
        severity: "LOW",
        object: "emergency_hatch",
        condition: "minor_wear",
        evidence: [
          "emergency hatch looks untidy, although its guard is intact and nothing dangerous is exposed",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "door",
        condition: "untidy",
        severity: "LOW",
        evidence: ["aapat darwaza untidy dikhta hai"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "entrance_door",
        condition: "untidy_appearance",
        evidence: [
          "entrance door appears untidy, guard is intact, no dangerous item is exposed",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "fire_exit",
        condition: "maintenance_needed",
        evidence: [
          "fire exit is untidy; the guard remains intact and no dangerous item is exposed",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "fire_exit",
        condition: "maintenance_needed",
        evidence: [
          "fire exit is untidy; the guard remains intact and no dangerous item is exposed",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "door", "condition": "untidy", "severity": "LOW", "evidence": ["aapat darwaza untidy dikhta hai"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "entrance_door", "condition": "untidy_appearance", "evidence": ["entrance door appears untidy, guard is intact, no dangerous item is exposed"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "fire_exit", "condition": "maintenance_needed", "evidence": ["fire exit is untidy; the guard remains intact and no dangerous item is exposed"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "fire_exit", "condition": "maintenance_needed", "evidence": ["fire exit is untidy; the guard remains intact and no dangerous item is exposed"]}',
      },
    },
    {
      id: "v3-test-trail-1-5-2",
      note: "Maintenance desk zara dekho. beehad ki pagdandi mein rain se shallow ruts hain, earth path fix chahiye par open hai.",
      target: {
        category: "TRAIL",
        severity: "MEDIUM",
        object: "ravine_footpath",
        condition: "maintenance_needed",
        evidence: [
          "ravine footpath has shallow ruts from rain; the earth path needs maintenance but is open",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "path",
        condition: "damaged",
        severity: "HIGH",
        evidence: [
          "rain se shallow ruts hain",
          "earth path fix chahiye par open hai",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "earth_path",
        condition: "maintenance_needed",
        evidence: [
          "rain has caused shallow ruts in the earth path, needs fixing but is open",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "walking_path",
        condition: "maintenance_needed",
        evidence: [
          "walking path has deep erosion with shallow ruts needing earth repair; it remains passable",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "public_path",
        condition: "maintenance_needed",
        evidence: [
          "public path has major erosion with shallow ruts needing repair; it remains passable",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "INFRASTRUCTURE", "object": "path", "condition": "damaged", "severity": "HIGH", "evidence": ["rain se shallow ruts hain", "earth path fix chahiye par open hai"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "earth_path", "condition": "maintenance_needed", "evidence": ["rain has caused shallow ruts in the earth path, needs fixing but is open"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "walking_path", "condition": "maintenance_needed", "evidence": ["walking path has deep erosion with shallow ruts needing earth repair; it remains passable"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "public_path", "condition": "maintenance_needed", "evidence": ["public path has major erosion with shallow ruts needing repair; it remains passable"]}',
      },
    },
    {
      id: "v3-test-trail-0-5-1",
      note: "वापसी पर यह मिला: बीहड़ की पगडंडी पर छोटी टहनियां हैं पर कच्चे मार्ग पर चलना मुश्किल नहीं। तथ्य दर्ज करें।",
      target: {
        category: "TRAIL",
        severity: "LOW",
        object: "ravine_footpath",
        condition: "minor_wear",
        evidence: [
          "ravine footpath has scattered twigs without making the dirt track harder to walk",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "TRAIL",
        object: "trail_surface",
        condition: "uneven_surface",
        severity: "LOW",
        evidence: ["छोटी टहनियां हैं", "कच्चे मार्ग पर चलना मुश्किल नहीं"],
      },
      fewShotPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "dirt_path",
        condition: "minor_obstruction",
        evidence: [
          "dirt path has small stones but walking on the gravel road is not difficult",
        ],
      },
      fineTunedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "walking_trail",
        condition: "minor_wear",
        evidence: [
          "walking trail has minor vegetation without making unpaved passage difficult",
        ],
      },
      secondSeedPrediction: {
        category: "TRAIL",
        severity: "LOW",
        object: "riverside_stone_path",
        condition: "minor_wear",
        evidence: [
          "riverside stone path has minor vegetation without making the unpaved route unusable; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "TRAIL", "object": "trail_surface", "condition": "uneven_surface", "severity": "LOW", "evidence": ["छोटी टहनियां हैं", "कच्चे मार्ग पर चलना मुश्किल नहीं"]}',
        few_shot:
          '{"category": "TRAIL", "severity": "LOW", "object": "dirt_path", "condition": "minor_obstruction", "evidence": ["dirt path has small stones but walking on the gravel road is not difficult"]}',
        fine_tuned_seed42:
          '{"category": "TRAIL", "severity": "LOW", "object": "walking_trail", "condition": "minor_wear", "evidence": ["walking trail has minor vegetation without making unpaved passage difficult"]}',
        fine_tuned_seed1729:
          '{"category": "TRAIL", "severity": "LOW", "object": "riverside_stone_path", "condition": "minor_wear", "evidence": ["riverside stone path has minor vegetation without making the unpaved route unusable; record the fact"]}',
      },
    },
    {
      id: "v3-test-infrastructure-2-6-0",
      note: "Maintenance desk, can you look at this? road culvert has split apart, leaving no usable crossing for pedestrians.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "road_culvert",
        condition: "major_obstruction",
        evidence: [
          "road culvert has split apart, leaving no usable crossing for pedestrians",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "road_culvert",
        condition: "split",
        severity: "CRITICAL",
        evidence: [
          "road culvert has split apart",
          "no usable crossing for pedestrians",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "culvert",
        condition: "major_obstruction",
        evidence: [
          "road culvert has split apart, leaving no usable crossing for pedestrians",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "road_culvert",
        condition: "major_obstruction",
        evidence: [
          "road culvert has split apart, leaving no usable crossing for pedestrians",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "road_culvert",
        condition: "major_obstruction",
        evidence: [
          "road culvert has split apart, leaving no usable crossing for pedestrians",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "INFRASTRUCTURE", "object": "road_culvert", "condition": "split", "severity": "CRITICAL", "evidence": ["road culvert has split apart", "no usable crossing for pedestrians"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "culvert", "condition": "major_obstruction", "evidence": ["road culvert has split apart, leaving no usable crossing for pedestrians"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "road_culvert", "condition": "major_obstruction", "evidence": ["road culvert has split apart, leaving no usable crossing for pedestrians"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "road_culvert", "condition": "major_obstruction", "evidence": ["road culvert has split apart, leaving no usable crossing for pedestrians"]}',
      },
    },
    {
      id: "v3-test-infrastructure-1-5-2",
      note: "Maintenance desk zara dekho. paidal platform mein cracks patch karne hain, upar se pass ho sakte hain.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "pedestrian_platform",
        condition: "maintenance_needed",
        evidence: [
          "pedestrian platform has cracks that need patching, but passing over it is still possible",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "paidal_platform",
        condition: "cracks",
        severity: "MEDIUM",
        evidence: ["paidal platform mein cracks patch karne hain"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "footpath",
        condition: "surface_damage",
        evidence: [
          "footpath has cracks that need patching, people can pass from above",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "footbridge",
        condition: "maintenance_needed",
        evidence: [
          "footbridge has cracks needing patching; walkers can pass over it",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "footbridge",
        condition: "maintenance_needed",
        evidence: [
          "footbridge has cracks needing repair and walkers can pass over it",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "paidal_platform",\n  "condition": "cracks",\n  "severity": "MEDIUM",\n  "evidence": ["paidal platform mein cracks patch karne hain"]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "footpath", "condition": "surface_damage", "evidence": ["footpath has cracks that need patching, people can pass from above"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "footbridge", "condition": "maintenance_needed", "evidence": ["footbridge has cracks needing patching; walkers can pass over it"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "footbridge", "condition": "maintenance_needed", "evidence": ["footbridge has cracks needing repair and walkers can pass over it"]}',
      },
    },
    {
      id: "v3-test-lighting-3-5-2",
      note: "Maintenance desk zara dekho. ghat ki roshni fail hua, bachcha invisible edge paar karke abhi gir raha.",
      target: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "quayside_beacon",
        condition: "immediate_danger",
        evidence: [
          "quayside beacon failed as a child stepped over an invisible edge and is falling now",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "lamp",
        condition: "failed",
        severity: "HIGH",
        evidence: [
          "ghat ki roshni fail hua",
          "bachcha invisible edge paar karke abhi gir raha",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "street_light",
        condition: "immediate_danger",
        evidence: [
          "street light failed, child is crossing invisible edge and is about to fall",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "stair_light",
        condition: "immediate_danger",
        evidence: [
          "stair light has failed and a child is walking off an unseen edge and falling now",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "CRITICAL",
        object: "stair_light",
        condition: "immediate_danger",
        evidence: [
          "stair light has failed and a child is walking off an unseen edge and is falling now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "lamp", "condition": "failed", "severity": "HIGH", "evidence": ["ghat ki roshni fail hua", "bachcha invisible edge paar karke abhi gir raha"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "street_light", "condition": "immediate_danger", "evidence": ["street light failed, child is crossing invisible edge and is about to fall"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "stair_light", "condition": "immediate_danger", "evidence": ["stair light has failed and a child is walking off an unseen edge and falling now"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "CRITICAL", "object": "stair_light", "condition": "immediate_danger", "evidence": ["stair light has failed and a child is walking off an unseen edge and is falling now"]}',
      },
    },
    {
      id: "v3-test-accessibility-3-6-1",
      note: "वापसी पर यह मिला: सुगम भूमिगत मार्ग खड़ी गहराई की ओर झुक रहा है और दिव्यांग आगंतुक उस पर है। तथ्य दर्ज करें।",
      target: {
        category: "ACCESSIBILITY",
        severity: "CRITICAL",
        object: "accessible_underpass",
        condition: "immediate_danger",
        evidence: [
          "accessible underpass is tipping into a steep drop with a disabled visitor still on it",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "walkway",
        condition: "tilted",
        severity: "HIGH",
        evidence: [
          "सुगम भूमिगत मार्ग खड़ी गहराई की ओर झुक रहा है",
          "दिव्यांग आगंतुक उस पर है",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "underground_path",
        condition: "structural_damage",
        evidence: [
          "underground path is leaning towards deep area and disabled visitor is on it; facts recorded",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_underground_path",
        condition: "major_obstruction",
        evidence: [
          "accessible underground path is leaning toward a deep ravine with a visually impaired user on it; the fact is recorded",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "accessible_underground_path",
        condition: "major_obstruction",
        evidence: [
          "accessible underground path is leaning into a deep ravine and a disabled visitor is on it; record the fact",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "walkway", "condition": "tilted", "severity": "HIGH", "evidence": ["सुगम भूमिगत मार्ग खड़ी गहराई की ओर झुक रहा है", "दिव्यांग आगंतुक उस पर है"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "underground_path", "condition": "structural_damage", "evidence": ["underground path is leaning towards deep area and disabled visitor is on it; facts recorded"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_underground_path", "condition": "major_obstruction", "evidence": ["accessible underground path is leaning toward a deep ravine with a visually impaired user on it; the fact is recorded"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "accessible_underground_path", "condition": "major_obstruction", "evidence": ["accessible underground path is leaning into a deep ravine and a disabled visitor is on it; record the fact"]}',
      },
    },
    {
      id: "v3-test-other-1-6-0",
      note: "Encountered this on my return: queue display no longer works for visitors; it needs servicing without any danger being reported. Please record the facts.",
      target: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "queue_display",
        condition: "maintenance_needed",
        evidence: [
          "queue display no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "SIGNAGE",
        object: "queue_display",
        condition: "malfunctioning",
        severity: "LOW",
        evidence: [
          "queue display no longer works for visitors",
          "needs servicing",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "queue_display",
        condition: "maintenance_needed",
        evidence: [
          "queue display no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "visitor_queue",
        condition: "maintenance_needed",
        evidence: [
          "visitor queue display no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "visitor_queue",
        condition: "maintenance_needed",
        evidence: [
          "visitor queue display no longer works for visitors; it needs servicing without any danger being reported",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "queue_display",\n  "condition": "malfunctioning",\n  "severity": "LOW",\n  "evidence": [\n    "queue display no longer works for visitors",\n    "needs servicing"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "queue_display", "condition": "maintenance_needed", "evidence": ["queue display no longer works for visitors; it needs servicing without any danger being reported"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "visitor_queue", "condition": "maintenance_needed", "evidence": ["visitor queue display no longer works for visitors; it needs servicing without any danger being reported"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "visitor_queue", "condition": "maintenance_needed", "evidence": ["visitor queue display no longer works for visitors; it needs servicing without any danger being reported"]}',
      },
    },
    {
      id: "v3-test-accessibility-1-5-1",
      note: "देखभाल कार्यालय, इसे देखें। सुगम लकड़ी मार्ग के टेढ़े हिस्से समतल करने हैं, कुर्सी फिर भी निकल जाती है।",
      target: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "mobility_boardwalk",
        condition: "maintenance_needed",
        evidence: [
          "mobility boardwalk has uneven patches that need smoothing; a chair can still get through",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "TRAIL",
        object: "path",
        condition: "uneven",
        severity: "HIGH",
        evidence: [
          "सुगम लकड़ी मार्ग के टेढ़े हिस्से समतल करने हैं",
          "कुर्सी फिर भी निकल जाती है",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "tactile_path",
        condition: "uneven_surface",
        evidence: [
          "tactile path has uneven sections that need to be made flat, wheelchair still manages to pass",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_path",
        condition: "maintenance_needed",
        evidence: [
          "accessible path has a crooked section needing flattening; a wheelchair still passes",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_path",
        condition: "maintenance_needed",
        evidence: [
          "accessible path has a crooked section needing flattening; a wheelchair user can still pass",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "TRAIL", "object": "path", "condition": "uneven", "severity": "HIGH", "evidence": ["सुगम लकड़ी मार्ग के टेढ़े हिस्से समतल करने हैं", "कुर्सी फिर भी निकल जाती है"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "tactile_path", "condition": "uneven_surface", "evidence": ["tactile path has uneven sections that need to be made flat, wheelchair still manages to pass"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "accessible_path", "condition": "maintenance_needed", "evidence": ["accessible path has a crooked section needing flattening; a wheelchair still passes"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "accessible_path", "condition": "maintenance_needed", "evidence": ["accessible path has a crooked section needing flattening; a wheelchair user can still pass"]}',
      },
    },
    {
      id: "v3-test-safety-2-6-1",
      note: "देखभाल कार्यालय, इसे देखें। आपात दरवाजा का अवरोध हट गया है जिससे राहगीर को गंभीर गिरावट का खतरा है।",
      target: {
        category: "SAFETY",
        severity: "HIGH",
        object: "emergency_hatch",
        condition: "major_obstruction",
        evidence: [
          "emergency hatch has lost its barrier so a passerby could suffer a serious fall",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "emergency_door",
        condition: "obstructed",
        severity: "HIGH",
        evidence: [
          "आपात दरवाजा का अवरोध हट गया है",
          "राहगीर को गंभीर गिरावट का खतरा है",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "emergency_door",
        condition: "obstruction_removed",
        evidence: [
          "emergency door obstruction has been removed causing a serious fall risk for pedestrians",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fire_exit",
        condition: "major_obstruction",
        evidence: [
          "fire exit has an obstruction leaving walkers exposed to a serious fall hazard",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fire_exit",
        condition: "major_obstruction",
        evidence: [
          "fire exit has an obstruction leaving walkers exposed to a serious fall hazard",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "emergency_door", "condition": "obstructed", "severity": "HIGH", "evidence": ["आपात दरवाजा का अवरोध हट गया है", "राहगीर को गंभीर गिरावट का खतरा है"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "emergency_door", "condition": "obstruction_removed", "evidence": ["emergency door obstruction has been removed causing a serious fall risk for pedestrians"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "HIGH", "object": "fire_exit", "condition": "major_obstruction", "evidence": ["fire exit has an obstruction leaving walkers exposed to a serious fall hazard"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "HIGH", "object": "fire_exit", "condition": "major_obstruction", "evidence": ["fire exit has an obstruction leaving walkers exposed to a serious fall hazard"]}',
      },
    },
    {
      id: "v3-test-lighting-0-6-2",
      note: "Maintenance desk zara dekho. underground roshni briefly flicker hota hai, paas ki roshni se crossing clear dikhti hai.",
      target: {
        category: "LIGHTING",
        severity: "LOW",
        object: "subway_illumination",
        condition: "minor_wear",
        evidence: [
          "subway illumination flickers briefly but adjacent illumination keeps the crossing clearly visible",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "LIGHTING",
        object: "lamp",
        condition: "flickering",
        severity: "LOW",
        evidence: [
          "underground roshni briefly flicker hota hai",
          "paas ki roshni se crossing clear dikhti hai",
        ],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "underground_light",
        condition: "intermittent_failure",
        evidence: [
          "underground light briefly flickers, crossing is clearly visible from nearby light",
        ],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "street_light",
        condition: "minor_wear",
        evidence: [
          "underground light briefly flickers; the nearby light makes the crossing clearly visible",
        ],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "LOW",
        object: "underground_light",
        condition: "minor_wear",
        evidence: [
          "underground light briefly flickers; the nearby light makes the crossing clearly visible",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "lamp", "condition": "flickering", "severity": "LOW", "evidence": ["underground roshni briefly flicker hota hai", "paas ki roshni se crossing clear dikhti hai"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "LOW", "object": "underground_light", "condition": "intermittent_failure", "evidence": ["underground light briefly flickers, crossing is clearly visible from nearby light"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "LOW", "object": "street_light", "condition": "minor_wear", "evidence": ["underground light briefly flickers; the nearby light makes the crossing clearly visible"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "LOW", "object": "underground_light", "condition": "minor_wear", "evidence": ["underground light briefly flickers; the nearby light makes the crossing clearly visible"]}',
      },
    },
    {
      id: "v3-test-infrastructure-1-6-2",
      note: "Vaapas aate hue mila: sadak ki puliya mein cracks patch karne hain, upar se pass ho sakte hain. Facts note karo.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "road_culvert",
        condition: "maintenance_needed",
        evidence: [
          "road culvert has cracks that need patching, but passing over it is still possible",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "bridge",
        condition: "cracks",
        severity: "HIGH",
        evidence: ["cracks patch karne hain", "upar se pass ho sakte hain"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "bridge_pavement",
        condition: "repair_required",
        evidence: [
          "bridge pavement has cracks that need patching, people can pass from above",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "bridge",
        condition: "maintenance_needed",
        evidence: [
          "bridge has patched cracks needing repair; walkers can pass over it now",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "bridge",
        condition: "maintenance_needed",
        evidence: [
          "bridge has patched cracks and walkers can pass over it; note the facts",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "INFRASTRUCTURE", "object": "bridge", "condition": "cracks", "severity": "HIGH", "evidence": ["cracks patch karne hain", "upar se pass ho sakte hain"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "bridge_pavement", "condition": "repair_required", "evidence": ["bridge pavement has cracks that need patching, people can pass from above"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "bridge", "condition": "maintenance_needed", "evidence": ["bridge has patched cracks needing repair; walkers can pass over it now"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "bridge", "condition": "maintenance_needed", "evidence": ["bridge has patched cracks and walkers can pass over it; note the facts"]}',
      },
    },
    {
      id: "v3-test-infrastructure-1-6-0",
      note: "Encountered this on my return: road culvert has cracks that need patching, but passing over it is still possible. Please record the facts.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "road_culvert",
        condition: "maintenance_needed",
        evidence: [
          "road culvert has cracks that need patching, but passing over it is still possible",
        ],
      },
      language: "english",
      source: "synthetic",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "road_culvert",
        condition: "cracks",
        severity: "MEDIUM",
        evidence: [
          "road culvert has cracks that need patching",
          "passing over it is still possible",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "road_culvert",
        condition: "cracks_needing_repair",
        evidence: [
          "road culvert has cracks that need patching, but passing over it is still possible",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "road_culvert",
        condition: "maintenance_needed",
        evidence: [
          "road culvert has cracks that need patching, but passing over it is still possible",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "road_culvert",
        condition: "maintenance_needed",
        evidence: [
          "road culvert has cracks that need patching, but passing over it is still possible",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "road_culvert",\n  "condition": "cracks",\n  "severity": "MEDIUM",\n  "evidence": [\n    "road culvert has cracks that need patching",\n    "passing over it is still possible"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "road_culvert", "condition": "cracks_needing_repair", "evidence": ["road culvert has cracks that need patching, but passing over it is still possible"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "road_culvert", "condition": "maintenance_needed", "evidence": ["road culvert has cracks that need patching, but passing over it is still possible"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "road_culvert", "condition": "maintenance_needed", "evidence": ["road culvert has cracks that need patching, but passing over it is still possible"]}',
      },
    },
    {
      id: "v3-test-infrastructure-2-5-1",
      note: "वापसी पर यह मिला: पैदल मंच अलग टूट गया है, पैदल पार करने की जगह नहीं बची। तथ्य दर्ज करें।",
      target: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "pedestrian_platform",
        condition: "major_obstruction",
        evidence: [
          "pedestrian platform has split apart, leaving no usable crossing for pedestrians",
        ],
      },
      language: "hindi",
      source: "synthetic",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "pedestrian_bridge",
        condition: "broken",
        severity: "HIGH",
        evidence: ["pedestrian bridge broken", "no place to cross on foot"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "pedestrian_bridge",
        condition: "major_damage",
        evidence: [
          "pedestrian bridge has a section broken off, no place left for pedestrian crossing",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "stair",
        condition: "major_obstruction",
        evidence: [
          "stair has a major structural failure leaving no passage for walkers; the fact is recorded",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "footbridge",
        condition: "major_obstruction",
        evidence: [
          "footbridge has a major structural failure and no pedestrian passage remains",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "pedestrian_bridge", "condition": "broken", "severity": "HIGH", "evidence": ["pedestrian bridge broken", "no place to cross on foot"]}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "pedestrian_bridge", "condition": "major_damage", "evidence": ["pedestrian bridge has a section broken off, no place left for pedestrian crossing"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "stair", "condition": "major_obstruction", "evidence": ["stair has a major structural failure leaving no passage for walkers; the fact is recorded"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "footbridge", "condition": "major_obstruction", "evidence": ["footbridge has a major structural failure and no pedestrian passage remains"]}',
      },
    },
    {
      id: "v3-test-infrastructure-3-6-2",
      note: "Vaapas aate hue mila: sadak ki puliya bikhar raha hai aur pedestrians abhi gap mein gir rahe. Facts note karo.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "road_culvert",
        condition: "immediate_danger",
        evidence: [
          "road culvert is breaking apart while pedestrians are dropping into the gap",
        ],
      },
      language: "hinglish",
      source: "synthetic",
      basePrediction: {
        category: "SAFETY",
        object: "bridge",
        condition: "collapsing",
        severity: "CRITICAL",
        evidence: [
          "sadak ki puliya bikhar raha hai",
          "pedestrians abhi gap mein gir rahe",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "bridge",
        condition: "structural_failure",
        evidence: [
          "bridge is collapsing and pedestrians are falling into the gap",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "bridge",
        condition: "immediate_danger",
        evidence: [
          "bridge has a loose span and walkers are falling into the gap now",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "CRITICAL",
        object: "bridge",
        condition: "immediate_danger",
        evidence: [
          "bridge has a loose span and walkers are falling into the gap now",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "bridge", "condition": "collapsing", "severity": "CRITICAL", "evidence": ["sadak ki puliya bikhar raha hai", "pedestrians abhi gap mein gir rahe"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "bridge", "condition": "structural_failure", "evidence": ["bridge is collapsing and pedestrians are falling into the gap"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "bridge", "condition": "immediate_danger", "evidence": ["bridge has a loose span and walkers are falling into the gap now"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "CRITICAL", "object": "bridge", "condition": "immediate_danger", "evidence": ["bridge has a loose span and walkers are falling into the gap now"]}',
      },
    },
    {
      id: "boston-311-101006763032",
      note: "Repeat offender parking on the sidewalk, blocking the sidewalk, in front of a no parking sign",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "sidewalk",
        condition: "blocked",
        evidence: [
          "Repeat offender parking on the sidewalk, blocking the sidewalk, in front of a no parking sign",
        ],
      },
      language: "english",
      source: "public-source",
      sourceUrl: "https://311.boston.gov/open311/v2/requests/101006763032.json",
      basePrediction: {
        category: "SAFETY",
        object: "parking",
        condition: "blocking",
        severity: "HIGH",
        evidence: [
          "repeat offender parking on the sidewalk",
          "blocking the sidewalk",
          "in front of a no parking sign",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "sidewalk",
        condition: "obstructed",
        evidence: [
          "repeat offender parking on the sidewalk, blocking the sidewalk, in front of a no parking sign",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "curb",
        condition: "maintenance_needed",
        evidence: [
          "curb has a parked vehicle obstructing the sidewalk in front of a no parking sign",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "sidewalk",
        condition: "major_obstruction",
        evidence: [
          "sidewalk has an illegal parked vehicle blocking it in front of a no parking sign",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "parking",\n  "condition": "blocking",\n  "severity": "HIGH",\n  "evidence": [\n    "repeat offender parking on the sidewalk",\n    "blocking the sidewalk",\n    "in front of a no parking sign"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "sidewalk", "condition": "obstructed", "evidence": ["repeat offender parking on the sidewalk, blocking the sidewalk, in front of a no parking sign"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "curb", "condition": "maintenance_needed", "evidence": ["curb has a parked vehicle obstructing the sidewalk in front of a no parking sign"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "HIGH", "object": "sidewalk", "condition": "major_obstruction", "evidence": ["sidewalk has an illegal parked vehicle blocking it in front of a no parking sign"]}',
      },
    },
    {
      id: "boston-311-f7d6cd77-b443-431a-b274-6179d334e73b",
      note: "Unknown person left trash on our steps",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "steps",
        condition: "dumped_trash",
        evidence: ["Unknown person left trash on our steps"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/f7d6cd77-b443-431a-b274-6179d334e73b.json",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "steps",
        condition: "littering",
        evidence: ["unknown person left trash on our steps"],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "stair_well",
        condition: "maintenance_needed",
        evidence: ["stair well has dumped trash needing cleaning"],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "public_stair",
        condition: "maintenance_needed",
        evidence: ["public stair has dumped trash on it"],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "cleanliness",\n  "object": "steps",\n  "condition": "trash_present",\n  "severity": "low",\n  "evidence": ["unknown person left trash on our steps"]\n}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "steps", "condition": "littering", "evidence": ["unknown person left trash on our steps"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "stair_well", "condition": "maintenance_needed", "evidence": ["stair well has dumped trash needing cleaning"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "public_stair", "condition": "maintenance_needed", "evidence": ["public stair has dumped trash on it"]}',
      },
    },
    {
      id: "boston-311-6ff846e8-43a3-4e4f-904a-bc4fe199e772",
      note: "Bread all over sidewalk",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "sidewalk",
        condition: "litter",
        evidence: ["Bread all over sidewalk"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/6ff846e8-43a3-4e4f-904a-bc4fe199e772.json",
      basePrediction: {
        category: "CLEANLINESS",
        object: "sidewalk",
        condition: "covered_in_food",
        severity: "LOW",
        evidence: ["Bread all over sidewalk"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "sidewalk",
        condition: "spilled_food",
        evidence: ["bread all over sidewalk"],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "sidewalk",
        condition: "maintenance_needed",
        evidence: ["sidewalk has loose loose bread"],
      },
      secondSeedPrediction: null,
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "sidewalk", "condition": "covered_in_food", "severity": "LOW", "evidence": ["Bread all over sidewalk"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "sidewalk", "condition": "spilled_food", "evidence": ["bread all over sidewalk"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "sidewalk", "condition": "maintenance_needed", "evidence": ["sidewalk has loose loose bread"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "sidewalk", "condition": "minor_wear", "evidence": ["sidewalk has loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose loose',
      },
    },
    {
      id: "boston-311-101006763027",
      note: "Car blocking fire hydrant",
      target: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fire_hydrant",
        condition: "blocked",
        evidence: ["Car blocking fire hydrant"],
      },
      language: "english",
      source: "public-source",
      sourceUrl: "https://311.boston.gov/open311/v2/requests/101006763027.json",
      basePrediction: {
        category: "SAFETY",
        object: "car",
        condition: "blocking",
        severity: "HIGH",
        evidence: ["car blocking fire hydrant"],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fire_hydrant",
        condition: "obstructed",
        evidence: ["car blocking fire hydrant"],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fire_hydrant",
        condition: "major_obstruction",
        evidence: ["fire hydrant is blocked by a parked car"],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fire_hydrant",
        condition: "major_obstruction",
        evidence: ["fire hydrant is blocked by a parked car"],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "car", "condition": "blocking", "severity": "HIGH", "evidence": ["car blocking fire hydrant"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "HIGH", "object": "fire_hydrant", "condition": "obstructed", "evidence": ["car blocking fire hydrant"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "HIGH", "object": "fire_hydrant", "condition": "major_obstruction", "evidence": ["fire hydrant is blocked by a parked car"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "HIGH", "object": "fire_hydrant", "condition": "major_obstruction", "evidence": ["fire hydrant is blocked by a parked car"]}',
      },
    },
    {
      id: "boston-311-9a4c4b1d-69bb-498a-ad9a-7994576c8568",
      note: "Gas lighting broken",
      target: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "gas_light",
        condition: "broken",
        evidence: ["Gas lighting broken"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/9a4c4b1d-69bb-498a-ad9a-7994576c8568.json",
      basePrediction: {
        category: "LIGHTING",
        object: "lamp",
        condition: "broken",
        severity: "HIGH",
        evidence: ["Gas lighting broken"],
      },
      fewShotPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "gas_light",
        condition: "broken",
        evidence: ["gas lighting broken"],
      },
      fineTunedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "gas_light",
        condition: "maintenance_needed",
        evidence: ["gas lighting is broken"],
      },
      secondSeedPrediction: {
        category: "LIGHTING",
        severity: "MEDIUM",
        object: "gas_light",
        condition: "maintenance_needed",
        evidence: ["gas light is broken"],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "LIGHTING", "object": "lamp", "condition": "broken", "severity": "HIGH", "evidence": ["Gas lighting broken"]}',
        few_shot:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "gas_light", "condition": "broken", "evidence": ["gas lighting broken"]}',
        fine_tuned_seed42:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "gas_light", "condition": "maintenance_needed", "evidence": ["gas lighting is broken"]}',
        fine_tuned_seed1729:
          '{"category": "LIGHTING", "severity": "MEDIUM", "object": "gas_light", "condition": "maintenance_needed", "evidence": ["gas light is broken"]}',
      },
    },
    {
      id: "boston-311-ad3ed543-6377-43d4-bec5-72058507b6ef",
      note: "Trash is out illegally",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "trash",
        condition: "early_collection",
        evidence: ["Trash is out illegally"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/ad3ed543-6377-43d4-bec5-72058507b6ef.json",
      basePrediction: {
        category: "CLEANLINESS",
        object: "trash_bin",
        condition: "illegal_placement",
        severity: "MEDIUM",
        evidence: ["Trash is out illegally"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "trash",
        condition: "illegal_disposal",
        evidence: ["trash is out illegally"],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "waste_bin",
        condition: "maintenance_needed",
        evidence: ["waste bin has dumped waste outside its normal use"],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "trash_can",
        condition: "maintenance_needed",
        evidence: [
          "trash can has dumped waste outside its normal collection area",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "trash_bin", "condition": "illegal_placement", "severity": "MEDIUM", "evidence": ["Trash is out illegally"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "trash", "condition": "illegal_disposal", "evidence": ["trash is out illegally"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "waste_bin", "condition": "maintenance_needed", "evidence": ["waste bin has dumped waste outside its normal use"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "trash_can", "condition": "maintenance_needed", "evidence": ["trash can has dumped waste outside its normal collection area"]}',
      },
    },
    {
      id: "boston-311-392f1951-5d9c-4ad8-bb3d-070b91179c53",
      note: "No toilet facilities at construction site.",
      target: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "toilet_facilities",
        condition: "missing",
        evidence: ["No toilet facilities at construction site."],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/392f1951-5d9c-4ad8-bb3d-070b91179c53.json",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "toilet_facility",
        condition: "missing",
        severity: "HIGH",
        evidence: ["No toilet facilities at construction site."],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "toilet_facility",
        condition: "missing",
        evidence: ["no toilet facilities at construction site"],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "construction_site",
        condition: "maintenance_needed",
        evidence: ["construction site has no toilet facilities"],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "construction_site",
        condition: "maintenance_needed",
        evidence: ["construction site has no toilet facilities"],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "toilet_facility", "condition": "missing", "severity": "HIGH", "evidence": ["No toilet facilities at construction site."]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "toilet_facility", "condition": "missing", "evidence": ["no toilet facilities at construction site"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "construction_site", "condition": "maintenance_needed", "evidence": ["construction site has no toilet facilities"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "construction_site", "condition": "maintenance_needed", "evidence": ["construction site has no toilet facilities"]}',
      },
    },
    {
      id: "boston-311-4438e679-eb18-4c7c-b2fa-0346c3aad8f7",
      note: "Downed utility lines disconnected from grounding damaged by contractors dangling at child level",
      target: {
        category: "SAFETY",
        severity: "HIGH",
        object: "utility_line",
        condition: "dangling",
        evidence: [
          "Downed utility lines disconnected from grounding damaged by contractors dangling at child level",
        ],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/4438e679-eb18-4c7c-b2fa-0346c3aad8f7.json",
      basePrediction: {
        category: "SAFETY",
        object: "utility_line",
        condition: "damaged",
        severity: "CRITICAL",
        evidence: [
          "downed utility lines disconnected from grounding",
          "damaged by contractors",
          "dangling at child level",
        ],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "utility_lines",
        condition: "immediate_danger",
        evidence: [
          "downed utility lines disconnected from grounding damaged by contractors dangling at child level",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "electrical_cable",
        condition: "immediate_danger",
        evidence: [
          "electrical cable has been disconnected from its grounding and is dangling at child height",
        ],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "CRITICAL",
        object: "electrical_cable",
        condition: "immediate_danger",
        evidence: [
          "electrical cable has been disconnected from its grounding and is dangling at child height with no protective covering",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "utility_line",\n  "condition": "damaged",\n  "severity": "CRITICAL",\n  "evidence": [\n    "downed utility lines disconnected from grounding",\n    "damaged by contractors",\n    "dangling at child level"\n  ]\n}',
        few_shot:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "utility_lines", "condition": "immediate_danger", "evidence": ["downed utility lines disconnected from grounding damaged by contractors dangling at child level"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "electrical_cable", "condition": "immediate_danger", "evidence": ["electrical cable has been disconnected from its grounding and is dangling at child height"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "CRITICAL", "object": "electrical_cable", "condition": "immediate_danger", "evidence": ["electrical cable has been disconnected from its grounding and is dangling at child height with no protective covering"]}',
      },
    },
    {
      id: "boston-311-ad796396-99d9-4727-8a6c-839ab5488855",
      note: "Commercial vehicle blocking sidewalk",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "sidewalk",
        condition: "blocked",
        evidence: ["Commercial vehicle blocking sidewalk"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/ad796396-99d9-4727-8a6c-839ab5488855.json",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "vehicle",
        condition: "blocking",
        severity: "HIGH",
        evidence: ["commercial vehicle blocking sidewalk"],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "sidewalk",
        condition: "obstructed",
        evidence: ["commercial vehicle blocking sidewalk"],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "curb",
        condition: "maintenance_needed",
        evidence: [
          "curb has a parked commercial vehicle obstructing the sidewalk",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "sidewalk",
        condition: "major_obstruction",
        evidence: ["commercial vehicle is blocking a sidewalk"],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "vehicle", "condition": "blocking", "severity": "HIGH", "evidence": ["commercial vehicle blocking sidewalk"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "sidewalk", "condition": "obstructed", "evidence": ["commercial vehicle blocking sidewalk"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "curb", "condition": "maintenance_needed", "evidence": ["curb has a parked commercial vehicle obstructing the sidewalk"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "sidewalk", "condition": "major_obstruction", "evidence": ["commercial vehicle is blocking a sidewalk"]}',
      },
    },
    {
      id: "boston-311-6aac2099-bebc-41c3-9eac-cef7a1c84e03",
      note: "Open overflowing dumpster",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "dumpster",
        condition: "overflowing",
        evidence: ["Open overflowing dumpster"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/6aac2099-bebc-41c3-9eac-cef7a1c84e03.json",
      basePrediction: {
        category: "CLEANLINESS",
        object: "dumpster",
        condition: "overflowing",
        severity: "HIGH",
        evidence: ["open overflowing dumpster"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "dumpster",
        condition: "overflowing",
        evidence: ["open overflowing dumpster"],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "dumpster",
        condition: "maintenance_needed",
        evidence: ["dumpster is overflowing"],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "dumpster",
        condition: "maintenance_needed",
        evidence: ["dumpster is overflowing and needs maintenance"],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "dumpster", "condition": "overflowing", "severity": "HIGH", "evidence": ["open overflowing dumpster"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "dumpster", "condition": "overflowing", "evidence": ["open overflowing dumpster"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "dumpster", "condition": "maintenance_needed", "evidence": ["dumpster is overflowing"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "dumpster", "condition": "maintenance_needed", "evidence": ["dumpster is overflowing and needs maintenance"]}',
      },
    },
    {
      id: "boston-311-101006763014",
      note: "Illegally parked in front of fire hydrant.",
      target: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fire_hydrant",
        condition: "blocked",
        evidence: ["Illegally parked in front of fire hydrant."],
      },
      language: "english",
      source: "public-source",
      sourceUrl: "https://311.boston.gov/open311/v2/requests/101006763014.json",
      basePrediction: {
        category: "SAFETY",
        object: "vehicle",
        condition: "blocking_access",
        severity: "HIGH",
        evidence: ["illegally parked in front of fire hydrant"],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "fire_hydrant",
        condition: "obstructed",
        evidence: ["illegally parked in front of fire hydrant"],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fire_hydrant",
        condition: "major_obstruction",
        evidence: ["fire hydrant has an illegally parked vehicle blocking it"],
      },
      secondSeedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "fire_hydrant",
        condition: "major_obstruction",
        evidence: ["fire hydrant has an illegally parked vehicle blocking it"],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "vehicle",\n  "condition": "blocking_access",\n  "severity": "HIGH",\n  "evidence": [\n    "illegally parked in front of fire hydrant"\n  ]\n}',
        few_shot:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "fire_hydrant", "condition": "obstructed", "evidence": ["illegally parked in front of fire hydrant"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "HIGH", "object": "fire_hydrant", "condition": "major_obstruction", "evidence": ["fire hydrant has an illegally parked vehicle blocking it"]}',
        fine_tuned_seed1729:
          '{"category": "SAFETY", "severity": "HIGH", "object": "fire_hydrant", "condition": "major_obstruction", "evidence": ["fire hydrant has an illegally parked vehicle blocking it"]}',
      },
    },
    {
      id: "boston-311-e07b019c-82aa-43f0-8d3a-e898dcfc3845",
      note: "Pothole that was filled poorly u will make contact to a parked car to avoid it please fix",
      target: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "pothole",
        condition: "hazardous",
        evidence: [
          "Pothole that was filled poorly u will make contact to a parked car to avoid it please fix",
        ],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/e07b019c-82aa-43f0-8d3a-e898dcfc3845.json",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "road_surface",
        condition: "poorly_filled_pothole",
        severity: "HIGH",
        evidence: [
          "pothole that was filled poorly",
          "will make contact to a parked car to avoid it",
        ],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "pavement",
        condition: "poor_repair",
        evidence: [
          "pothole that was filled poorly",
          "you will make contact to a parked car to avoid it please fix",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "pavement",
        condition: "maintenance_needed",
        evidence: [
          "pavement has a poorly repaired pothole that will contact a parked car; it needs repair",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "driveway",
        condition: "maintenance_needed",
        evidence: [
          "driveway has a poorly repaired pothole that has been filled with a parked car to avoid it and needs repair",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "road_surface",\n  "condition": "poorly_filled_pothole",\n  "severity": "HIGH",\n  "evidence": [\n    "pothole that was filled poorly",\n    "will make contact to a parked car to avoid it"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "pavement", "condition": "poor_repair", "evidence": ["pothole that was filled poorly", "you will make contact to a parked car to avoid it please fix"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "pavement", "condition": "maintenance_needed", "evidence": ["pavement has a poorly repaired pothole that will contact a parked car; it needs repair"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "driveway", "condition": "maintenance_needed", "evidence": ["driveway has a poorly repaired pothole that has been filled with a parked car to avoid it and needs repair"]}',
      },
    },
    {
      id: "boston-311-ad252578-70c8-4388-a645-0437041a8913",
      note: "Tree branches are encroaching onto electrical box/pole and need to be trimmed away.",
      target: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "tree_branch",
        condition: "overgrown",
        evidence: [
          "Tree branches are encroaching onto electrical box/pole and need to be trimmed away.",
        ],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/ad252578-70c8-4388-a645-0437041a8913.json",
      basePrediction: {
        category: "SAFETY",
        object: "electrical_box",
        condition: "overgrown",
        severity: "HIGH",
        evidence: ["tree branches encroaching onto electrical box/pole"],
      },
      fewShotPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "tree_branches",
        condition: "obstruction",
        evidence: [
          "tree branches are encroaching onto electrical box/pole and need to be trimmed away",
        ],
      },
      fineTunedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "tree_cable",
        condition: "maintenance_needed",
        evidence: [
          "tree branches are encroaching onto an electrical box or pole and need trimming",
        ],
      },
      secondSeedPrediction: {
        category: "ENVIRONMENT",
        severity: "MEDIUM",
        object: "tree_cable",
        condition: "maintenance_needed",
        evidence: [
          "tree branches are encroaching onto electrical box/pole and need to be trimmed away",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "electrical_box", "condition": "overgrown", "severity": "HIGH", "evidence": ["tree branches encroaching onto electrical box/pole"]}',
        few_shot:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "tree_branches", "condition": "obstruction", "evidence": ["tree branches are encroaching onto electrical box/pole and need to be trimmed away"]}',
        fine_tuned_seed42:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "tree_cable", "condition": "maintenance_needed", "evidence": ["tree branches are encroaching onto an electrical box or pole and need trimming"]}',
        fine_tuned_seed1729:
          '{"category": "ENVIRONMENT", "severity": "MEDIUM", "object": "tree_cable", "condition": "maintenance_needed", "evidence": ["tree branches are encroaching onto electrical box/pole and need to be trimmed away"]}',
      },
    },
    {
      id: "boston-311-5cfc6772-889c-413a-af8a-1da84b4537fe",
      note: "Debris from car accident in curb need to be e swept , hazard to pedestrians and vehicle traffic",
      target: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "road_debris",
        condition: "hazardous",
        evidence: [
          "Debris from car accident in curb need to be e swept , hazard to pedestrians and vehicle traffic",
        ],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/5cfc6772-889c-413a-af8a-1da84b4537fe.json",
      basePrediction: {
        category: "SAFETY",
        object: "curb",
        condition: "debris",
        severity: "HIGH",
        evidence: [
          "debris from car accident in curb",
          "hazard to pedestrians and vehicle traffic",
        ],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "curb",
        condition: "debris_present",
        evidence: [
          "debris from car accident in curb need to be swept, hazard to pedestrians and vehicle traffic",
        ],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "curb_obstruction",
        condition: "major_obstruction",
        evidence: [
          "curb has debris from a car accident needing sweeping; it is a hazard to pedestrians and vehicle traffic",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "curb_debris",
        condition: "major_obstruction",
        evidence: [
          "curb has debris from a car accident needing sweeping; it is a hazard to pedestrians and vehicle traffic",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "curb", "condition": "debris", "severity": "HIGH", "evidence": ["debris from car accident in curb", "hazard to pedestrians and vehicle traffic"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "curb", "condition": "debris_present", "evidence": ["debris from car accident in curb need to be swept, hazard to pedestrians and vehicle traffic"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "HIGH", "object": "curb_obstruction", "condition": "major_obstruction", "evidence": ["curb has debris from a car accident needing sweeping; it is a hazard to pedestrians and vehicle traffic"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "curb_debris", "condition": "major_obstruction", "evidence": ["curb has debris from a car accident needing sweeping; it is a hazard to pedestrians and vehicle traffic"]}',
      },
    },
    {
      id: "boston-311-3ccf72cd-db04-4407-8c8c-4c5a93d1f2fd",
      note: "Latch to the gate at the Brewer Burroughs playground is broken.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "playground_gate",
        condition: "broken_latch",
        evidence: [
          "Latch to the gate at the Brewer Burroughs playground is broken.",
        ],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/3ccf72cd-db04-4407-8c8c-4c5a93d1f2fd.json",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "gate",
        condition: "broken",
        severity: "MEDIUM",
        evidence: [
          "Latch to the gate at the Brewer Burroughs playground is broken",
        ],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "gate_latch",
        condition: "malfunctioning",
        evidence: [
          "latch to the gate at the Brewer Burroughs playground is broken",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "playground_gate",
        condition: "maintenance_needed",
        evidence: ["playground gate has a broken latch"],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "playground_gate",
        condition: "maintenance_needed",
        evidence: ["playground gate has a broken latch"],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "gate",\n  "condition": "broken",\n  "severity": "MEDIUM",\n  "evidence": [\n    "Latch to the gate at the Brewer Burroughs playground is broken"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "gate_latch", "condition": "malfunctioning", "evidence": ["latch to the gate at the Brewer Burroughs playground is broken"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "playground_gate", "condition": "maintenance_needed", "evidence": ["playground gate has a broken latch"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "playground_gate", "condition": "maintenance_needed", "evidence": ["playground gate has a broken latch"]}',
      },
    },
    {
      id: "boston-311-82654af2-a924-499a-b0dc-68ee6eaa5ae5",
      note: "Can the leaves on the sidewalk along Billings Field wall please be cleaned up. Thank you!",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "sidewalk",
        condition: "leaves",
        evidence: [
          "Can the leaves on the sidewalk along Billings Field wall please be cleaned up. Thank you!",
        ],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/82654af2-a924-499a-b0dc-68ee6eaa5ae5.json",
      basePrediction: null,
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "sidewalk",
        condition: "debris_present",
        evidence: [
          "leaves on the sidewalk along Billings Field wall need to be cleaned up",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "sidewalk",
        condition: "maintenance_needed",
        evidence: [
          "sidewalk has accumulated leaves needing cleaning beside the wall of Billings Field",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "sidewalk",
        condition: "minor_wear",
        evidence: ["sidewalk has loose leaves needing cleaning"],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "cleanliness", "object": "sidewalk", "condition": "accumulated_debris", "severity": "low", "evidence": ["leaves on the sidewalk"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "sidewalk", "condition": "debris_present", "evidence": ["leaves on the sidewalk along Billings Field wall need to be cleaned up"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "sidewalk", "condition": "maintenance_needed", "evidence": ["sidewalk has accumulated leaves needing cleaning beside the wall of Billings Field"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "sidewalk", "condition": "minor_wear", "evidence": ["sidewalk has loose leaves needing cleaning"]}',
      },
    },
    {
      id: "boston-311-101006762976",
      note: "Grocery store storing carts in specifically marked disabled parking spot.",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "disabled_parking",
        condition: "blocked",
        evidence: [
          "Grocery store storing carts in specifically marked disabled parking spot.",
        ],
      },
      language: "english",
      source: "public-source",
      sourceUrl: "https://311.boston.gov/open311/v2/requests/101006762976.json",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "parking_spot",
        condition: "blocked",
        severity: "HIGH",
        evidence: [
          "grocery store storing carts in specifically marked disabled parking spot",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "disabled_parking",
        condition: "obstructed",
        evidence: [
          "grocery store storing carts in specifically marked disabled parking spot",
        ],
      },
      fineTunedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "parking_spot",
        condition: "maintenance_needed",
        evidence: [
          "grocery store is storing shopping carts in a marked disabled parking spot",
        ],
      },
      secondSeedPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "accessible_parking",
        condition: "maintenance_needed",
        evidence: [
          "grocery store is storing shopping carts in a marked disabled parking spot",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "ACCESSIBILITY",\n  "object": "parking_spot",\n  "condition": "blocked",\n  "severity": "HIGH",\n  "evidence": [\n    "grocery store storing carts in specifically marked disabled parking spot"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "disabled_parking", "condition": "obstructed", "evidence": ["grocery store storing carts in specifically marked disabled parking spot"]}',
        fine_tuned_seed42:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "parking_spot", "condition": "maintenance_needed", "evidence": ["grocery store is storing shopping carts in a marked disabled parking spot"]}',
        fine_tuned_seed1729:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "accessible_parking", "condition": "maintenance_needed", "evidence": ["grocery store is storing shopping carts in a marked disabled parking spot"]}',
      },
    },
    {
      id: "boston-311-101006762972",
      note: "Car parked in the contraflow bike lane and on the sidewalk in a tow zone.",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "sidewalk",
        condition: "blocked",
        evidence: [
          "Car parked in the contraflow bike lane and on the sidewalk in a tow zone.",
        ],
      },
      language: "english",
      source: "public-source",
      sourceUrl: "https://311.boston.gov/open311/v2/requests/101006762972.json",
      basePrediction: {
        category: "SAFETY",
        object: "car",
        condition: "illegal_parking",
        severity: "HIGH",
        evidence: [
          "car parked in the contraflow bike lane",
          "car parked on the sidewalk",
          "car parked in a tow zone",
        ],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "bike_lane",
        condition: "obstructed",
        evidence: [
          "car parked in the contraflow bike lane and on the sidewalk in a tow zone",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "bike_lane",
        condition: "major_obstruction",
        evidence: [
          "bike lane has a parked car across it and onto the sidewalk in a tow zone",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "bike_lane",
        condition: "major_obstruction",
        evidence: [
          "bike lane has a parked car across it and onto the sidewalk in a tow zone",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SAFETY",\n  "object": "car",\n  "condition": "illegal_parking",\n  "severity": "HIGH",\n  "evidence": [\n    "car parked in the contraflow bike lane",\n    "car parked on the sidewalk",\n    "car parked in a tow zone"\n  ]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "bike_lane", "condition": "obstructed", "evidence": ["car parked in the contraflow bike lane and on the sidewalk in a tow zone"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "bike_lane", "condition": "major_obstruction", "evidence": ["bike lane has a parked car across it and onto the sidewalk in a tow zone"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "bike_lane", "condition": "major_obstruction", "evidence": ["bike lane has a parked car across it and onto the sidewalk in a tow zone"]}',
      },
    },
    {
      id: "boston-311-640315d1-ee1d-4ac7-a375-98f1025fdced",
      note: "Trash outside containers",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "trash_container",
        condition: "spillage",
        evidence: ["Trash outside containers"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/640315d1-ee1d-4ac7-a375-98f1025fdced.json",
      basePrediction: {
        category: "CLEANLINESS",
        object: "waste_bin",
        condition: "overflowing",
        severity: "LOW",
        evidence: ["Trash outside containers"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "waste_bin",
        condition: "minor_wear",
        evidence: ["trash outside containers"],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "waste_bin",
        condition: "minor_wear",
        evidence: ["waste bin has loose loose waste outside its container"],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "trash_container",
        condition: "minor_wear",
        evidence: ["trash container has loose loose waste"],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "waste_bin", "condition": "overflowing", "severity": "LOW", "evidence": ["Trash outside containers"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "waste_bin", "condition": "minor_wear", "evidence": ["trash outside containers"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "waste_bin", "condition": "minor_wear", "evidence": ["waste bin has loose loose waste outside its container"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "trash_container", "condition": "minor_wear", "evidence": ["trash container has loose loose waste"]}',
      },
    },
    {
      id: "boston-311-292dd0b5-6c72-4c0c-9223-b442995f4a18",
      note: "Trash on sidewalk and window",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "sidewalk",
        condition: "litter",
        evidence: ["Trash on sidewalk and window"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/292dd0b5-6c72-4c0c-9223-b442995f4a18.json",
      basePrediction: {
        category: "CLEANLINESS",
        object: "trash",
        condition: "present",
        severity: "LOW",
        evidence: ["Trash on sidewalk", "Trash on window"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "sidewalk",
        condition: "littering",
        evidence: ["trash on sidewalk and window"],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "sidewalk_window",
        condition: "maintenance_needed",
        evidence: [
          "sidewalk and window have accumulated trash needing cleaning",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "sidewalk_window",
        condition: "maintenance_needed",
        evidence: [
          "sidewalk and window have loose loose trash needing collection",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "trash", "condition": "present", "severity": "LOW", "evidence": ["Trash on sidewalk", "Trash on window"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "sidewalk", "condition": "littering", "evidence": ["trash on sidewalk and window"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "sidewalk_window", "condition": "maintenance_needed", "evidence": ["sidewalk and window have accumulated trash needing cleaning"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "sidewalk_window", "condition": "maintenance_needed", "evidence": ["sidewalk and window have loose loose trash needing collection"]}',
      },
    },
    {
      id: "boston-311-101006762953",
      note: "Car parked completely blocking sidewalk",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "sidewalk",
        condition: "blocked",
        evidence: ["Car parked completely blocking sidewalk"],
      },
      language: "english",
      source: "public-source",
      sourceUrl: "https://311.boston.gov/open311/v2/requests/101006762953.json",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "car",
        condition: "blocking_sidewalk",
        severity: "HIGH",
        evidence: ["Car parked completely blocking sidewalk"],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "sidewalk",
        condition: "obstructed",
        evidence: ["car parked completely blocking sidewalk"],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "curb",
        condition: "major_obstruction",
        evidence: ["curb is completely obstructed by a parked car"],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "curb",
        condition: "major_obstruction",
        evidence: ["curb is completely blocked by a parked car"],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "ACCESSIBILITY", "object": "car", "condition": "blocking_sidewalk", "severity": "HIGH", "evidence": ["Car parked completely blocking sidewalk"]}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "HIGH", "object": "sidewalk", "condition": "obstructed", "evidence": ["car parked completely blocking sidewalk"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "curb", "condition": "major_obstruction", "evidence": ["curb is completely obstructed by a parked car"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "curb", "condition": "major_obstruction", "evidence": ["curb is completely blocked by a parked car"]}',
      },
    },
    {
      id: "boston-311-4f64bfd9-cd2e-4460-b952-3312d878a410",
      note: "Needles left behind",
      target: {
        category: "SAFETY",
        severity: "HIGH",
        object: "needles",
        condition: "discarded",
        evidence: ["Needles left behind"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/4f64bfd9-cd2e-4460-b952-3312d878a410.json",
      basePrediction: {
        category: "CLEANLINESS",
        object: "waste_bin",
        condition: "overflowing",
        severity: "HIGH",
        evidence: ["Needles left behind"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "unknown",
        condition: "unspecified",
        evidence: ["needles left behind"],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "HIGH",
        object: "needle",
        condition: "major_obstruction",
        evidence: ["needle has been left behind"],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "needle",
        condition: "maintenance_needed",
        evidence: ["needle has been left behind"],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "waste_bin", "condition": "overflowing", "severity": "HIGH", "evidence": ["Needles left behind"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "unknown", "condition": "unspecified", "evidence": ["needles left behind"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "HIGH", "object": "needle", "condition": "major_obstruction", "evidence": ["needle has been left behind"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "MEDIUM", "object": "needle", "condition": "maintenance_needed", "evidence": ["needle has been left behind"]}',
      },
    },
    {
      id: "boston-311-e38d6681-9bc8-4e9d-b9eb-754405345970",
      note: "Playground gate broken, stuck half open",
      target: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "playground_gate",
        condition: "stuck",
        evidence: ["Playground gate broken, stuck half open"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/e38d6681-9bc8-4e9d-b9eb-754405345970.json",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "playground_gate",
        condition: "broken",
        severity: "HIGH",
        evidence: ["playground gate broken", "stuck half open"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "playground_gate",
        condition: "damaged",
        evidence: ["playground gate broken, stuck half open"],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "playground_gate",
        condition: "maintenance_needed",
        evidence: ["playground gate is broken and stuck half open"],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "playground_gate",
        condition: "maintenance_needed",
        evidence: ["playground gate is broken and stuck half open"],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "playground_gate",\n  "condition": "broken",\n  "severity": "HIGH",\n  "evidence": [\n    "playground gate broken",\n    "stuck half open"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "playground_gate", "condition": "damaged", "evidence": ["playground gate broken, stuck half open"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "playground_gate", "condition": "maintenance_needed", "evidence": ["playground gate is broken and stuck half open"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "playground_gate", "condition": "maintenance_needed", "evidence": ["playground gate is broken and stuck half open"]}',
      },
    },
    {
      id: "boston-311-5e2765f6-8c14-473f-a26b-cf1d282c2807",
      note: "Sidewalk needs to be fixed. All bricks are missing or loose",
      target: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "sidewalk",
        condition: "loose_bricks",
        evidence: [
          "Sidewalk needs to be fixed. All bricks are missing or loose",
        ],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/5e2765f6-8c14-473f-a26b-cf1d282c2807.json",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "sidewalk",
        condition: "damaged",
        severity: "HIGH",
        evidence: ["all bricks are missing or loose"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "sidewalk",
        condition: "substantial_damage",
        evidence: [
          "sidewalk needs to be fixed. All bricks are missing or loose",
        ],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "sidewalk",
        condition: "maintenance_needed",
        evidence: [
          "sidewalk needs to be fixed. all bricks are missing or loose",
        ],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "sidewalk",
        condition: "maintenance_needed",
        evidence: [
          "sidewalk needs to be fixed. all bricks are missing or loose",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "sidewalk",\n  "condition": "damaged",\n  "severity": "HIGH",\n  "evidence": [\n    "all bricks are missing or loose"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "sidewalk", "condition": "substantial_damage", "evidence": ["sidewalk needs to be fixed. All bricks are missing or loose"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "sidewalk", "condition": "maintenance_needed", "evidence": ["sidewalk needs to be fixed. all bricks are missing or loose"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "sidewalk", "condition": "maintenance_needed", "evidence": ["sidewalk needs to be fixed. all bricks are missing or loose"]}',
      },
    },
    {
      id: "boston-311-ea3af066-62e7-440b-a4dc-c45f0f6929f5",
      note: "Tow Zone sign damaged",
      target: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "tow_zone_sign",
        condition: "damaged",
        evidence: ["Tow Zone sign damaged"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/ea3af066-62e7-440b-a4dc-c45f0f6929f5.json",
      basePrediction: {
        category: "SIGNAGE",
        object: "tow_zone_sign",
        condition: "damaged",
        severity: "LOW",
        evidence: ["Tow Zone sign damaged"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "traffic_sign",
        condition: "damaged",
        evidence: ["tow zone sign damaged"],
      },
      fineTunedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "tow_zone_sign",
        condition: "maintenance_needed",
        evidence: ["tow zone sign is damaged"],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "tow_zone_sign",
        condition: "maintenance_needed",
        evidence: ["tow zone sign is damaged"],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SIGNAGE", "object": "tow_zone_sign", "condition": "damaged", "severity": "LOW", "evidence": ["Tow Zone sign damaged"]}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "traffic_sign", "condition": "damaged", "evidence": ["tow zone sign damaged"]}',
        fine_tuned_seed42:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "tow_zone_sign", "condition": "maintenance_needed", "evidence": ["tow zone sign is damaged"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "tow_zone_sign", "condition": "maintenance_needed", "evidence": ["tow zone sign is damaged"]}',
      },
    },
    {
      id: "boston-311-86ecf496-a067-4d6c-9434-198ba80283ad",
      note: "Crosswalk paint is faded, please respray and add signage",
      target: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "crosswalk_marking",
        condition: "faded",
        evidence: ["Crosswalk paint is faded, please respray and add signage"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/86ecf496-a067-4d6c-9434-198ba80283ad.json",
      basePrediction: {
        category: "SIGNAGE",
        object: "crosswalk",
        condition: "faded",
        severity: "MEDIUM",
        evidence: ["crosswalk paint is faded"],
      },
      fewShotPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "crosswalk",
        condition: "visual_degradation",
        evidence: ["crosswalk paint is faded, please respray and add signage"],
      },
      fineTunedPrediction: {
        category: "SAFETY",
        severity: "MEDIUM",
        object: "crosswalk",
        condition: "maintenance_needed",
        evidence: [
          "crosswalk paint is faded and needs respraying with added signage",
        ],
      },
      secondSeedPrediction: {
        category: "SIGNAGE",
        severity: "MEDIUM",
        object: "crosswalk",
        condition: "maintenance_needed",
        evidence: ["crosswalk paint is faded, please respray and add signage"],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "SIGNAGE",\n  "object": "crosswalk",\n  "condition": "faded",\n  "severity": "MEDIUM",\n  "evidence": [\n    "crosswalk paint is faded"\n  ]\n}',
        few_shot:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "crosswalk", "condition": "visual_degradation", "evidence": ["crosswalk paint is faded, please respray and add signage"]}',
        fine_tuned_seed42:
          '{"category": "SAFETY", "severity": "MEDIUM", "object": "crosswalk", "condition": "maintenance_needed", "evidence": ["crosswalk paint is faded and needs respraying with added signage"]}',
        fine_tuned_seed1729:
          '{"category": "SIGNAGE", "severity": "MEDIUM", "object": "crosswalk", "condition": "maintenance_needed", "evidence": ["crosswalk paint is faded, please respray and add signage"]}',
      },
    },
    {
      id: "boston-311-482a6bf8-4c1f-4240-978d-2a9f38299c63",
      note: "Loads of glass in the middle of a sidewalk that can injure wildlife, pets and people",
      target: {
        category: "SAFETY",
        severity: "HIGH",
        object: "glass",
        condition: "hazardous",
        evidence: [
          "Loads of glass in the middle of a sidewalk that can injure wildlife, pets and people",
        ],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/482a6bf8-4c1f-4240-978d-2a9f38299c63.json",
      basePrediction: {
        category: "SAFETY",
        object: "glass",
        condition: "present_on_sidewalk",
        severity: "HIGH",
        evidence: [
          "Loads of glass in the middle of a sidewalk",
          "can injure wildlife, pets and people",
        ],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "sidewalk",
        condition: "foreign_object",
        evidence: [
          "loads of glass in the middle of a sidewalk that can injure wildlife, pets and people",
        ],
      },
      fineTunedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "sidewalk",
        condition: "major_obstruction",
        evidence: [
          "sidewalk has a large accumulation of broken glass that can injure wildlife, pets and people",
        ],
      },
      secondSeedPrediction: {
        category: "CLEANLINESS",
        severity: "HIGH",
        object: "sidewalk",
        condition: "major_obstruction",
        evidence: [
          "sidewalk has loose glass that can injure wildlife, pets and people",
        ],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "SAFETY", "object": "glass", "condition": "present_on_sidewalk", "severity": "HIGH", "evidence": ["Loads of glass in the middle of a sidewalk", "can injure wildlife, pets and people"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "sidewalk", "condition": "foreign_object", "evidence": ["loads of glass in the middle of a sidewalk that can injure wildlife, pets and people"]}',
        fine_tuned_seed42:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "sidewalk", "condition": "major_obstruction", "evidence": ["sidewalk has a large accumulation of broken glass that can injure wildlife, pets and people"]}',
        fine_tuned_seed1729:
          '{"category": "CLEANLINESS", "severity": "HIGH", "object": "sidewalk", "condition": "major_obstruction", "evidence": ["sidewalk has loose glass that can injure wildlife, pets and people"]}',
      },
    },
    {
      id: "boston-311-102bd508-b83f-470f-b55e-56193619c7fb",
      note: "Many potholes. All along this stretch. Thanks.",
      target: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "road",
        condition: "potholes",
        evidence: ["Many potholes. All along this stretch. Thanks."],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/102bd508-b83f-470f-b55e-56193619c7fb.json",
      basePrediction: {
        category: "INFRASTRUCTURE",
        object: "road",
        condition: "potholes",
        severity: "HIGH",
        evidence: ["many potholes", "all along this stretch"],
      },
      fewShotPrediction: {
        category: "INFRASTRUCTURE",
        severity: "HIGH",
        object: "road_surface",
        condition: "substantial_damage",
        evidence: ["many potholes. all along this stretch. thanks."],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "pavement",
        condition: "maintenance_needed",
        evidence: ["pavement has many potholes across its length"],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "pavement",
        condition: "maintenance_needed",
        evidence: ["pavement has many potholes across its length"],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "INFRASTRUCTURE",\n  "object": "road",\n  "condition": "potholes",\n  "severity": "HIGH",\n  "evidence": [\n    "many potholes",\n    "all along this stretch"\n  ]\n}',
        few_shot:
          '{"category": "INFRASTRUCTURE", "severity": "HIGH", "object": "road_surface", "condition": "substantial_damage", "evidence": ["many potholes. all along this stretch. thanks."]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "pavement", "condition": "maintenance_needed", "evidence": ["pavement has many potholes across its length"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "pavement", "condition": "maintenance_needed", "evidence": ["pavement has many potholes across its length"]}',
      },
    },
    {
      id: "boston-311-4867adfc-6b31-48bb-9b70-4465ca4bc206",
      note: "Random broken table discarded on sidewalk. Thanks.",
      target: {
        category: "CLEANLINESS",
        severity: "MEDIUM",
        object: "discarded_table",
        condition: "dumped",
        evidence: ["Random broken table discarded on sidewalk. Thanks."],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/4867adfc-6b31-48bb-9b70-4465ca4bc206.json",
      basePrediction: {
        category: "CLEANLINESS",
        object: "trash_bin",
        condition: "damaged",
        severity: "MEDIUM",
        evidence: ["broken table discarded on sidewalk"],
      },
      fewShotPrediction: {
        category: "CLEANLINESS",
        severity: "LOW",
        object: "furniture",
        condition: "abandoned",
        evidence: ["random broken table discarded on sidewalk"],
      },
      fineTunedPrediction: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "random_table",
        condition: "maintenance_needed",
        evidence: ["random broken table is discarded on a sidewalk"],
      },
      secondSeedPrediction: {
        category: "OTHER",
        severity: "MEDIUM",
        object: "random_table",
        condition: "maintenance_needed",
        evidence: ["random broken table is discarded on a sidewalk"],
      },
      rawOutputs: {
        zero_shot:
          '{"category": "CLEANLINESS", "object": "trash_bin", "condition": "damaged", "severity": "MEDIUM", "evidence": ["broken table discarded on sidewalk"]}',
        few_shot:
          '{"category": "CLEANLINESS", "severity": "LOW", "object": "furniture", "condition": "abandoned", "evidence": ["random broken table discarded on sidewalk"]}',
        fine_tuned_seed42:
          '{"category": "OTHER", "severity": "MEDIUM", "object": "random_table", "condition": "maintenance_needed", "evidence": ["random broken table is discarded on a sidewalk"]}',
        fine_tuned_seed1729:
          '{"category": "OTHER", "severity": "MEDIUM", "object": "random_table", "condition": "maintenance_needed", "evidence": ["random broken table is discarded on a sidewalk"]}',
      },
    },
    {
      id: "boston-311-5d181bf9-fddf-4052-9473-921251a6cac3",
      note: "Sidewalk blocked by overgrowth",
      target: {
        category: "ACCESSIBILITY",
        severity: "HIGH",
        object: "sidewalk",
        condition: "overgrown",
        evidence: ["Sidewalk blocked by overgrowth"],
      },
      language: "english",
      source: "public-source",
      sourceUrl:
        "https://311.boston.gov/open311/v2/requests/5d181bf9-fddf-4052-9473-921251a6cac3.json",
      basePrediction: {
        category: "ACCESSIBILITY",
        object: "sidewalk",
        condition: "blocked",
        severity: "HIGH",
        evidence: ["sidewalk blocked by overgrowth"],
      },
      fewShotPrediction: {
        category: "ACCESSIBILITY",
        severity: "MEDIUM",
        object: "sidewalk",
        condition: "obstructed",
        evidence: ["sidewalk blocked by overgrowth"],
      },
      fineTunedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "sidewalk",
        condition: "maintenance_needed",
        evidence: ["sidewalk is obstructed by vegetation"],
      },
      secondSeedPrediction: {
        category: "INFRASTRUCTURE",
        severity: "MEDIUM",
        object: "sidewalk",
        condition: "maintenance_needed",
        evidence: ["sidewalk is blocked by overgrowth"],
      },
      rawOutputs: {
        zero_shot:
          '{\n  "category": "ACCESSIBILITY",\n  "object": "sidewalk",\n  "condition": "blocked",\n  "severity": "HIGH",\n  "evidence": ["sidewalk blocked by overgrowth"]\n}',
        few_shot:
          '{"category": "ACCESSIBILITY", "severity": "MEDIUM", "object": "sidewalk", "condition": "obstructed", "evidence": ["sidewalk blocked by overgrowth"]}',
        fine_tuned_seed42:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "sidewalk", "condition": "maintenance_needed", "evidence": ["sidewalk is obstructed by vegetation"]}',
        fine_tuned_seed1729:
          '{"category": "INFRASTRUCTURE", "severity": "MEDIUM", "object": "sidewalk", "condition": "maintenance_needed", "evidence": ["sidewalk is blocked by overgrowth"]}',
      },
    },
  ],
};

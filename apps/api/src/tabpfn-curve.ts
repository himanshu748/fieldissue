// Generated from reviewed evidence by scripts/generate-tabpfn-curve.mjs.
export const tabpfnLearningCurve = {
  recordedAt: "2026-10-11T07:45:50.258278+00:00",
  decisionRule:
    "TabPFN is shown in the Lab as useful only if its AUC beats logistic regression at n <= 128.",
  decisionImplementation:
    "Mean paired AUC difference must be positive at all three sizes 32, 64 and 128. Report uncertainty even when this descriptive rule passes.",
  useful: false,
  evidenceUrl:
    "https://github.com/himanshu748/fieldissue/blob/main/docs/verification/tabpfn-learning-curve-2026-10-11.json",
  chartUrl: "/assets/evaluation/tabpfn-learning-curve-2026-10-11.svg",
  confidenceIntervalMethod:
    "Two-sided Student t interval across five training repeats. The same fixed 500 test rows are reused. This does not include test-population uncertainty.",
  points: [
    {
      trainRows: 32,
      summary: {
        majority: {
          accuracy: {
            mean: 0.4976,
            ci95: [0.4931576878316835, 0.5020423121683165],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.5,
            ci95: [0.5, 0.5],
            repeats: 5,
          },
          brierScore: {
            mean: 0.26943125,
            ci95: [0.22918817870467129, 0.30967432129532874],
            repeats: 5,
          },
          logLoss: {
            mean: 0.7384244804864216,
            ci95: [0.6407089844474696, 0.8361399765253736],
            repeats: 5,
          },
        },
        logistic_regression: {
          accuracy: {
            mean: 0.5824,
            ci95: [0.5472190331272049, 0.6175809668727952],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.6354422683051716,
            ci95: [0.5895568063742622, 0.681327730236081],
            repeats: 5,
          },
          brierScore: {
            mean: 0.264979229682607,
            ci95: [0.2484127218691275, 0.2815457374960865],
            repeats: 5,
          },
          logLoss: {
            mean: 0.7696233818305119,
            ci95: [0.6770347584509085, 0.8622120052101153],
            repeats: 5,
          },
        },
        hist_gradient_boosting: {
          accuracy: {
            mean: 0.4976,
            ci95: [0.4931576878316835, 0.5020423121683165],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.5,
            ci95: [0.5, 0.5],
            repeats: 5,
          },
          brierScore: {
            mean: 0.26943125,
            ci95: [0.22918817870467129, 0.30967432129532874],
            repeats: 5,
          },
          logLoss: {
            mean: 0.7384244804864216,
            ci95: [0.6407089844474696, 0.8361399765253736],
            repeats: 5,
          },
        },
        tabpfn: {
          accuracy: {
            mean: 0.518,
            ci95: [0.4917776555194206, 0.5442223444805794],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.5741167434715821,
            ci95: [0.5095317885279145, 0.6387016984152498],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2565005398414603,
            ci95: [0.23866978512544018, 0.27433129455748045],
            repeats: 5,
          },
          logLoss: {
            mean: 0.7110211300317096,
            ci95: [0.662168479632671, 0.7598737804307483],
            repeats: 5,
          },
        },
        oracle: {
          accuracy: {
            mean: 0.68,
            ci95: [0.68, 0.68],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7520561315924219,
            ci95: [0.7520561315924219, 0.7520561315924219],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2024832924701405,
            ci95: [0.2024832924701405, 0.2024832924701405],
            repeats: 5,
          },
          logLoss: {
            mean: 0.5939530805304891,
            ci95: [0.5939530805304891, 0.5939530805304891],
            repeats: 5,
          },
        },
      },
      pairedAucDifferenceVsLogistic: {
        mean: -0.0613255248335894,
        ci95: [-0.09402983961625072, -0.028621210050928082],
        repeats: 5,
      },
    },
    {
      trainRows: 64,
      summary: {
        majority: {
          accuracy: {
            mean: 0.5008,
            ci95: [0.49535930095473396, 0.506240699045266],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.5,
            ci95: [0.5, 0.5],
            repeats: 5,
          },
          brierScore: {
            mean: 0.256590625,
            ci95: [0.24589140616608546, 0.2672898438339146],
            repeats: 5,
          },
          logLoss: {
            mean: 0.7067713484979665,
            ci95: [0.6845423915770699, 0.7290003054188632],
            repeats: 5,
          },
        },
        logistic_regression: {
          accuracy: {
            mean: 0.6188,
            ci95: [0.5774468097465781, 0.6601531902534219],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.6796114951356886,
            ci95: [0.6364305153097283, 0.722792474961649],
            repeats: 5,
          },
          brierScore: {
            mean: 0.23725087887070623,
            ci95: [0.20682170753925597, 0.26768005020215646],
            repeats: 5,
          },
          logLoss: {
            mean: 0.6781915444892588,
            ci95: [0.5944344123805665, 0.7619486765979511],
            repeats: 5,
          },
        },
        hist_gradient_boosting: {
          accuracy: {
            mean: 0.5903999999999999,
            ci95: [0.5584334815426553, 0.6223665184573446],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.6279985919098823,
            ci95: [0.5867449871190504, 0.6692521967007141],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2519285493088039,
            ci95: [0.23323372625071412, 0.2706233723668936],
            repeats: 5,
          },
          logLoss: {
            mean: 0.7080497885633258,
            ci95: [0.6584669334271404, 0.7576326436995112],
            repeats: 5,
          },
        },
        tabpfn: {
          accuracy: {
            mean: 0.562,
            ci95: [0.49202476979268517, 0.6319752302073149],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.6322340629800307,
            ci95: [0.5738900166853689, 0.6905781092746925],
            repeats: 5,
          },
          brierScore: {
            mean: 0.24445124959828543,
            ci95: [0.23229453954045745, 0.2566079596561134],
            repeats: 5,
          },
          logLoss: {
            mean: 0.6819134899888121,
            ci95: [0.6570890421699872, 0.7067379378076369],
            repeats: 5,
          },
        },
        oracle: {
          accuracy: {
            mean: 0.68,
            ci95: [0.68, 0.68],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7520561315924219,
            ci95: [0.7520561315924219, 0.7520561315924219],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2024832924701405,
            ci95: [0.2024832924701405, 0.2024832924701405],
            repeats: 5,
          },
          logLoss: {
            mean: 0.5939530805304891,
            ci95: [0.5939530805304891, 0.5939530805304891],
            repeats: 5,
          },
        },
      },
      pairedAucDifferenceVsLogistic: {
        mean: -0.04737743215565793,
        ci95: [-0.08635755291584232, -0.00839731139547354],
        repeats: 5,
      },
    },
    {
      trainRows: 128,
      summary: {
        majority: {
          accuracy: {
            mean: 0.4976,
            ci95: [0.4931576878316835, 0.5020423121683165],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.5,
            ci95: [0.5, 0.5],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2533005859375,
            ci95: [0.2501830410457356, 0.2564181308292644],
            repeats: 5,
          },
          logLoss: {
            mean: 0.6998075156341854,
            ci95: [0.6934958568210305, 0.7061191744473403],
            repeats: 5,
          },
        },
        logistic_regression: {
          accuracy: {
            mean: 0.6608,
            ci95: [0.6202372867550824, 0.7013627132449177],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7218990015360983,
            ci95: [0.6992348030275387, 0.7445632000446579],
            repeats: 5,
          },
          brierScore: {
            mean: 0.21904604641363537,
            ci95: [0.20614346292254862, 0.23194862990472212],
            repeats: 5,
          },
          logLoss: {
            mean: 0.6329437384090213,
            ci95: [0.6025960423236891, 0.6632914344943535],
            repeats: 5,
          },
        },
        hist_gradient_boosting: {
          accuracy: {
            mean: 0.6168,
            ci95: [0.5897328640044115, 0.6438671359955885],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.6692124295954941,
            ci95: [0.6437210201496644, 0.6947038390413238],
            repeats: 5,
          },
          brierScore: {
            mean: 0.24711009973642326,
            ci95: [0.23480438360464018, 0.25941581586820633],
            repeats: 5,
          },
          logLoss: {
            mean: 0.7178825439597891,
            ci95: [0.6811914336129476, 0.7545736543066306],
            repeats: 5,
          },
        },
        tabpfn: {
          accuracy: {
            mean: 0.6328,
            ci95: [0.6067191440222357, 0.6588808559777644],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7058531746031745,
            ci95: [0.6929876019265513, 0.7187187472797978],
            repeats: 5,
          },
          brierScore: {
            mean: 0.22499551567463366,
            ci95: [0.21790555671170772, 0.2320854746375596],
            repeats: 5,
          },
          logLoss: {
            mean: 0.6408564221374493,
            ci95: [0.6255388537425838, 0.6561739905323148],
            repeats: 5,
          },
        },
        oracle: {
          accuracy: {
            mean: 0.68,
            ci95: [0.68, 0.68],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7520561315924219,
            ci95: [0.7520561315924219, 0.7520561315924219],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2024832924701405,
            ci95: [0.2024832924701405, 0.2024832924701405],
            repeats: 5,
          },
          logLoss: {
            mean: 0.5939530805304891,
            ci95: [0.5939530805304891, 0.5939530805304891],
            repeats: 5,
          },
        },
      },
      pairedAucDifferenceVsLogistic: {
        mean: -0.016045826932923734,
        ci95: [-0.028513716166322714, -0.003577937699524754],
        repeats: 5,
      },
    },
    {
      trainRows: 256,
      summary: {
        majority: {
          accuracy: {
            mean: 0.4976,
            ci95: [0.4931576878316835, 0.5020423121683165],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.5,
            ci95: [0.5, 0.5],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2518685791015625,
            ci95: [0.24914348282175883, 0.2545936753813662],
            repeats: 5,
          },
          logLoss: {
            mean: 0.6969099044489695,
            ci95: [0.6914145476561099, 0.7024052612418291],
            repeats: 5,
          },
        },
        logistic_regression: {
          accuracy: {
            mean: 0.6776,
            ci95: [0.6568675573011625, 0.6983324426988374],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7352374551971326,
            ci95: [0.719499946043344, 0.7509749643509211],
            repeats: 5,
          },
          brierScore: {
            mean: 0.21219386586940375,
            ci95: [0.20451043939034186, 0.21987729234846565],
            repeats: 5,
          },
          logLoss: {
            mean: 0.6155064232736248,
            ci95: [0.5991070249506785, 0.6319058215965712],
            repeats: 5,
          },
        },
        hist_gradient_boosting: {
          accuracy: {
            mean: 0.6012,
            ci95: [0.578946831452563, 0.6234531685474369],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.660853494623656,
            ci95: [0.6514498714966662, 0.6702571177506457],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2590292213127266,
            ci95: [0.25146202844822446, 0.26659641417722874],
            repeats: 5,
          },
          logLoss: {
            mean: 0.7614260000375124,
            ci95: [0.7271387290030658, 0.795713271071959],
            repeats: 5,
          },
        },
        tabpfn: {
          accuracy: {
            mean: 0.654,
            ci95: [0.6375274656090624, 0.6704725343909377],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7240751408090118,
            ci95: [0.7064475659027324, 0.7417027157152912],
            repeats: 5,
          },
          brierScore: {
            mean: 0.21700949590536134,
            ci95: [0.2088255211800684, 0.22519347063065429],
            repeats: 5,
          },
          logLoss: {
            mean: 0.6247377807359611,
            ci95: [0.6087300262767814, 0.6407455351951408],
            repeats: 5,
          },
        },
        oracle: {
          accuracy: {
            mean: 0.68,
            ci95: [0.68, 0.68],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7520561315924219,
            ci95: [0.7520561315924219, 0.7520561315924219],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2024832924701405,
            ci95: [0.2024832924701405, 0.2024832924701405],
            repeats: 5,
          },
          logLoss: {
            mean: 0.5939530805304891,
            ci95: [0.5939530805304891, 0.5939530805304891],
            repeats: 5,
          },
        },
      },
      pairedAucDifferenceVsLogistic: {
        mean: -0.01116231438812081,
        ci95: [-0.028703693572842807, 0.006379064796601188],
        repeats: 5,
      },
    },
    {
      trainRows: 512,
      summary: {
        majority: {
          accuracy: {
            mean: 0.4976,
            ci95: [0.4931576878316835, 0.5020423121683165],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.5,
            ci95: [0.5, 0.5],
            repeats: 5,
          },
          brierScore: {
            mean: 0.25099602661132814,
            ci95: [0.24978754265523326, 0.25220451056742305],
            repeats: 5,
          },
          logLoss: {
            mean: 0.6951447903387863,
            ci95: [0.6927192942754241, 0.6975702864021485],
            repeats: 5,
          },
        },
        logistic_regression: {
          accuracy: {
            mean: 0.68,
            ci95: [0.6659521754706388, 0.6940478245293613],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.747571044546851,
            ci95: [0.7400253705806887, 0.7551167185130132],
            repeats: 5,
          },
          brierScore: {
            mean: 0.20667542982362241,
            ci95: [0.20305151103633243, 0.2102993486109124],
            repeats: 5,
          },
          logLoss: {
            mean: 0.6040258849920914,
            ci95: [0.5969666309919213, 0.6110851389922616],
            repeats: 5,
          },
        },
        hist_gradient_boosting: {
          accuracy: {
            mean: 0.6364,
            ci95: [0.6282768219314215, 0.6445231780685784],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.6787154377880185,
            ci95: [0.6663103352562801, 0.6911205403197568],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2553137828797464,
            ci95: [0.2497104959596143, 0.26091706979987844],
            repeats: 5,
          },
          logLoss: {
            mean: 0.7810545830718404,
            ci95: [0.7610553357481358, 0.801053830395545],
            repeats: 5,
          },
        },
        tabpfn: {
          accuracy: {
            mean: 0.67,
            ci95: [0.6500559230099681, 0.689944076990032],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.744550051203277,
            ci95: [0.7316035093991593, 0.7574965930073947],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2080158266157706,
            ci95: [0.20170258529286553, 0.21432906793867565],
            repeats: 5,
          },
          logLoss: {
            mean: 0.605815568857776,
            ci95: [0.5934007707395068, 0.6182303669760452],
            repeats: 5,
          },
        },
        oracle: {
          accuracy: {
            mean: 0.68,
            ci95: [0.68, 0.68],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7520561315924219,
            ci95: [0.7520561315924219, 0.7520561315924219],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2024832924701405,
            ci95: [0.2024832924701405, 0.2024832924701405],
            repeats: 5,
          },
          logLoss: {
            mean: 0.5939530805304891,
            ci95: [0.5939530805304891, 0.5939530805304891],
            repeats: 5,
          },
        },
      },
      pairedAucDifferenceVsLogistic: {
        mean: -0.0030209933435739744,
        ci95: [-0.009129683068563745, 0.003087696381415795],
        repeats: 5,
      },
    },
    {
      trainRows: 1024,
      summary: {
        majority: {
          accuracy: {
            mean: 0.4976,
            ci95: [0.4931576878316835, 0.5020423121683165],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.5,
            ci95: [0.5, 0.5],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2502010467529297,
            ci95: [0.24990690416276382, 0.2504951893430956],
            repeats: 5,
          },
          logLoss: {
            mean: 0.693549485877563,
            ci95: [0.6929607498738829, 0.6941382218812432],
            repeats: 5,
          },
        },
        logistic_regression: {
          accuracy: {
            mean: 0.6788000000000001,
            ci95: [0.6670730110424017, 0.6905269889575985],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7478110599078341,
            ci95: [0.7439458630864006, 0.7516762567292676],
            repeats: 5,
          },
          brierScore: {
            mean: 0.20525768178570591,
            ci95: [0.2039795651815433, 0.20653579838986852],
            repeats: 5,
          },
          logLoss: {
            mean: 0.6002859026895336,
            ci95: [0.5973556747954554, 0.6032161305836119],
            repeats: 5,
          },
        },
        hist_gradient_boosting: {
          accuracy: {
            mean: 0.6476000000000001,
            ci95: [0.6259936192783931, 0.669206380721607],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.6890360983102919,
            ci95: [0.6712630969460992, 0.7068090996744846],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2464133323208574,
            ci95: [0.23846949031573877, 0.25435717432597604],
            repeats: 5,
          },
          logLoss: {
            mean: 0.7566723528860064,
            ci95: [0.7249913309255287, 0.7883533748464842],
            repeats: 5,
          },
        },
        tabpfn: {
          accuracy: {
            mean: 0.6808000000000001,
            ci95: [0.6728301032153022, 0.6887698967846979],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7508688556067589,
            ci95: [0.747910651725856, 0.7538270594876617],
            repeats: 5,
          },
          brierScore: {
            mean: 0.20463058881415885,
            ci95: [0.20291052479898083, 0.20635065282933687],
            repeats: 5,
          },
          logLoss: {
            mean: 0.5990668127268926,
            ci95: [0.5956915405965961, 0.602442084857189],
            repeats: 5,
          },
        },
        oracle: {
          accuracy: {
            mean: 0.68,
            ci95: [0.68, 0.68],
            repeats: 5,
          },
          rocAuc: {
            mean: 0.7520561315924219,
            ci95: [0.7520561315924219, 0.7520561315924219],
            repeats: 5,
          },
          brierScore: {
            mean: 0.2024832924701405,
            ci95: [0.2024832924701405, 0.2024832924701405],
            repeats: 5,
          },
          logLoss: {
            mean: 0.5939530805304891,
            ci95: [0.5939530805304891, 0.5939530805304891],
            repeats: 5,
          },
        },
      },
      pairedAucDifferenceVsLogistic: {
        mean: 0.0030577956989247036,
        ci95: [0.0009357012308214624, 0.005179890167027945],
        repeats: 5,
      },
    },
  ],
};

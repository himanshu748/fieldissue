"""Generate reproducible synthetic notes using split-specific scenario vocabularies."""

from __future__ import annotations

import json
import random
from collections import Counter

from training import common
from training import independent as data

# Four training objects, one validation object and two reserved test objects per domain.
# Transliteration is assistant authored. These are templates, not collected field notes.
OBJECTS = {
    "CLEANLINESS": [
        ("waste_bin", "waste bin", "कूड़ादान", "kachre ka dabba"),
        ("picnic_area", "picnic area", "पिकनिक जगह", "picnic wali jagah"),
        ("recycling_station", "recycling station", "रीसाइक्लिंग केंद्र", "recycling point"),
        ("market_corner", "market corner", "बाजार का कोना", "bazaar ka kona"),
        ("bus_shelter", "bus shelter", "बस प्रतीक्षालय", "bus ka shelter"),
        ("public_courtyard", "public courtyard", "सार्वजनिक आंगन", "sarvajanik aangan"),
        ("canal_steps", "canal steps", "नहर की सीढ़ियां", "nahar ki seedhiyan"),
    ],
    "INFRASTRUCTURE": [
        ("pavement", "pavement", "पक्की सड़क", "pakki sadak"),
        ("drain_cover", "drain cover", "नाली का ढक्कन", "naali ka dhakkan"),
        ("footbridge", "footbridge", "पैदल पुल", "paidal pul"),
        ("public_stair", "public stair", "सार्वजनिक सीढ़ी", "public seedhi"),
        ("retaining_wall", "retaining wall", "सहारा दीवार", "sahara deewar"),
        ("pedestrian_platform", "pedestrian platform", "पैदल मंच", "paidal platform"),
        ("road_culvert", "road culvert", "सड़क की पुलिया", "sadak ki puliya"),
    ],
    "ACCESSIBILITY": [
        ("wheelchair_ramp", "wheelchair ramp", "व्हीलचेयर रैंप", "wheelchair ramp"),
        ("accessible_gate", "accessible gate", "सुगम प्रवेश द्वार", "sugam gate"),
        ("tactile_path", "tactile path", "स्पर्श मार्ग", "sparsh wala path"),
        ("curb_ramp", "curb ramp", "फुटपाथ रैंप", "footpath ramp"),
        ("accessible_lift", "accessible lift", "सुगम लिफ्ट", "sugam lift"),
        ("mobility_boardwalk", "mobility boardwalk", "सुगम लकड़ी मार्ग", "sugam lakdi ka rasta"),
        ("accessible_underpass", "accessible underpass", "सुगम भूमिगत मार्ग", "sugam underpass"),
    ],
    "SAFETY": [
        ("electrical_cabinet", "electrical cabinet", "बिजली का बॉक्स", "bijli ka box"),
        ("open_manhole", "open manhole", "खुला मैनहोल", "khula manhole"),
        ("fire_exit", "fire exit", "आपात निकास", "emergency nikaas"),
        ("gas_pipe", "gas pipe", "गैस पाइप", "gas ka pipe"),
        ("power_junction", "power junction", "विद्युत जोड़", "bijli ka junction"),
        ("construction_shaft", "construction shaft", "निर्माण गड्ढा", "construction ka gaddha"),
        ("emergency_hatch", "emergency hatch", "आपात दरवाजा", "aapat darwaza"),
    ],
    "ENVIRONMENT": [
        ("tree", "tree", "पेड़", "ped"),
        ("pond", "pond", "तालाब", "taalaab"),
        ("stream_bank", "stream bank", "धारा का किनारा", "dhaara ka kinara"),
        ("flower_bed", "flower bed", "फूलों की क्यारी", "phool ki kyaari"),
        ("wetland", "wetland", "दलदली भूमि", "daldali zameen"),
        ("estuary_edge", "estuary edge", "मुहाने का किनारा", "muhane ka kinara"),
        ("woodland", "woodland", "वन क्षेत्र", "van ka ilaaka"),
    ],
    "SIGNAGE": [
        ("direction_board", "direction board", "दिशा बोर्ड", "disha board"),
        ("exit_sign", "exit sign", "निकास संकेत", "nikaas ka sign"),
        ("crossing_sign", "crossing sign", "पार संकेत", "crossing sign"),
        ("warning_board", "warning board", "चेतावनी बोर्ड", "chetaavni board"),
        ("closure_notice", "closure notice", "बंद रास्ते की सूचना", "band raste ka notice"),
        ("evacuation_marker", "evacuation marker", "निकासी चिह्न", "evacuation marker"),
        ("detour_panel", "detour panel", "वैकल्पिक मार्ग पट्ट", "doosre raste ka panel"),
    ],
    "LIGHTING": [
        ("path_lamp", "path lamp", "रास्ते का दीप", "raste ki light"),
        ("street_light", "street light", "सड़क की बत्ती", "sadak ki batti"),
        ("stair_light", "stair light", "सीढ़ी की बत्ती", "seedhi ki batti"),
        ("park_lantern", "park lantern", "पार्क की लालटेन", "park ki lantern"),
        ("tunnel_light", "tunnel light", "सुरंग की बत्ती", "surang ki light"),
        ("quayside_beacon", "quayside beacon", "घाट की रोशनी", "ghat ki roshni"),
        ("subway_illumination", "subway illumination", "भूमिगत रोशनी", "underground roshni"),
    ],
    "TRAIL": [
        ("forest_trail", "forest trail", "जंगल की पगडंडी", "jungle ki pagdandi"),
        ("hill_track", "hill track", "पहाड़ी कच्चा मार्ग", "pahaadi kachcha rasta"),
        ("riverside_path", "unpaved riverside path", "नदी किनारे कच्चा मार्ग", "nadi ka kachcha path"),
        ("walking_track", "unpaved walking track", "कच्चा पैदल मार्ग", "kachcha walking track"),
        ("ridge_route", "ridge route", "पहाड़ी धार मार्ग", "pahaadi dhaar ka route"),
        ("ravine_footpath", "ravine footpath", "बीहड़ की पगडंडी", "beehad ki pagdandi"),
        ("moorland_track", "moorland track", "खुले मैदान का कच्चा मार्ग", "maidan ka kachcha track"),
    ],
    "OTHER": [
        ("public_clock", "public clock", "सार्वजनिक घड़ी", "public ghadi"),
        ("fountain", "fountain", "फव्वारा", "favvaara"),
        ("notice_service", "public notice service", "सूचना सेवा", "notice seva"),
        ("ticket_machine", "ticket machine", "टिकट मशीन", "ticket ki machine"),
        ("bell", "public bell", "सार्वजनिक घंटी", "public ghanti"),
        ("public_timer", "public timer", "सार्वजनिक टाइमर", "public timer"),
        ("queue_display", "queue display", "कतार का प्रदर्शन", "queue display"),
    ],
}

# Domain facts have different wording in each language. No severity label occurs in a note.
FACTS = {
    "CLEANLINESS": [
        (
            "has a little loose paper; normal use is possible",
            "पर थोड़ा कागज है; सामान्य उपयोग संभव है",
            "par thoda kagaz hai, istemal ho sakta hai",
        ),
        (
            "has accumulated rubbish needing collection; no route is blocked",
            "पर जमा कचरा उठाना है; रास्ता बंद नहीं है",
            "par kachra jama hai, uthana padega, rasta band nahi",
        ),
        (
            "has so much dumped waste that the only passage is unusable",
            "पर कचरे से इकलौता रास्ता पूरी तरह बंद है",
            "par itna kachra hai ki eklauta rasta bilkul band hai",
        ),
        (
            "has burning waste with people trapped beside it right now",
            "पर कचरा जल रहा है और लोग अभी उसमें फंसे हैं",
            "par kachra jal raha, log abhi uske paas phanse hain",
        ),
    ],
    "INFRASTRUCTURE": [
        (
            "has a surface scratch; it remains usable",
            "पर सतह की खरोंच है; उपयोग संभव है",
            "par upar kharoch hai, abhi use kar sakte hain",
        ),
        (
            "has a damaged surface needing repair, without a stated danger",
            "की सतह खराब है और मरम्मत चाहिए; खतरा नहीं बताया गया",
            "ki surface kharab hai, repair chahiye, koi khatra nahi bataya",
        ),
        (
            "has structural damage making the whole route unusable",
            "की टूटफूट से पूरा मार्ग अनुपयोगी है",
            "itna toota hai ki poora route use nahi ho sakta",
        ),
        (
            "is collapsing with people underneath it now",
            "अभी गिर रहा है और लोग नीचे हैं",
            "abhi gir raha hai aur log uske neeche hain",
        ),
    ],
    "ACCESSIBILITY": [
        (
            "has a slightly worn surface; wheelchair passage is still easy",
            "की सतह थोड़ी घिसी है; व्हीलचेयर आराम से निकलती है",
            "thoda ghisa hai, wheelchair aaram se nikalti hai",
        ),
        (
            "is rough and needs repair; wheelchair access remains available",
            "खुरदरा है और मरम्मत चाहिए; व्हीलचेयर आ सकती है",
            "rough hai repair chahiye, wheelchair aa sakti hai",
        ),
        (
            "is obstructed and no wheelchair user can pass; there is no alternative",
            "बंद है और व्हीलचेयर नहीं निकल सकती; दूसरा मार्ग नहीं है",
            "band hai, wheelchair nahi nikal sakti, doosra rasta nahi",
        ),
        (
            "has failed and a wheelchair user is falling toward deep water now",
            "टूट गया है और व्हीलचेयर वाला व्यक्ति अभी गहरे पानी में गिर रहा है",
            "fail ho gaya, wheelchair wala abhi gehre paani mein gir raha",
        ),
    ],
    "SAFETY": [
        (
            "has a worn protective label but remains securely sealed",
            "का सुरक्षा लेबल घिसा है लेकिन वह सुरक्षित बंद है",
            "ka safety label ghisa hai lekin securely band hai",
        ),
        (
            "has a broken protective casing; no exposed danger is reported",
            "का सुरक्षा खोल टूटा है; खुला खतरा नहीं बताया गया",
            "ka protective cover toota hai, khula khatra nahi bataya",
        ),
        (
            "has an unprotected hazard in the pedestrian route, without a current victim",
            "पर पैदल रास्ते में खुला खतरा है; अभी कोई पीड़ित नहीं है",
            "par paidal raste mein khula khatra hai, abhi koi victim nahi",
        ),
        (
            "has a dangerous failure and someone is trapped in immediate danger now",
            "पर खतरनाक खराबी है और कोई व्यक्ति अभी जान के खतरे में फंसा है",
            "par dangerous failure hai, koi abhi jaan ke khatre mein phansa hai",
        ),
    ],
    "ENVIRONMENT": [
        (
            "has minor cosmetic disturbance; vegetation and normal access remain intact",
            "पर मामूली बदलाव है; वनस्पति और सामान्य पहुंच सुरक्षित है",
            "par mamooli badlav hai, paudhe aur access theek hai",
        ),
        (
            "has visible damage or contamination needing maintenance, with no major danger stated",
            "पर नुकसान या गंदगी है और देखभाल चाहिए; बड़ा खतरा नहीं बताया गया",
            "par nuksaan ya gandagi hai, dekhbhal chahiye, bada khatra nahi bataya",
        ),
        (
            "has major environmental damage and a dangerous obstruction across the route",
            "पर भारी पर्यावरण नुकसान और रास्ते में खतरनाक बाधा है",
            "par kaafi environmental nuksaan aur raste mein dangerous rukavat hai",
        ),
        (
            "has suddenly given way and people are being swept into deep water now",
            "अचानक टूट गया है और लोग अभी गहरे पानी में बह रहे हैं",
            "achanak toot gaya, log abhi gehre paani mein beh rahe hain",
        ),
    ],
    "SIGNAGE": [
        (
            "has faded lettering that remains readable",
            "के अक्षर फीके हैं लेकिन पढ़े जा सकते हैं",
            "ke letters fade hain lekin padh sakte hain",
        ),
        (
            "is unreadable and needs replacement; no hazardous consequence is stated",
            "पढ़ा नहीं जा सकता और बदलना है; खतरनाक परिणाम नहीं बताया गया",
            "padh nahi sakte, badalna hai, dangerous consequence nahi bataya",
        ),
        (
            "misdirects walkers onto a closed dangerous route; no one is harmed now",
            "लोगों को बंद खतरनाक मार्ग भेजता है; अभी कोई घायल नहीं है",
            "logon ko band dangerous route par bhejta hai, abhi koi hurt nahi",
        ),
        (
            "points into an active fire and people are following it right now",
            "चलती आग की तरफ दिखाता है और लोग अभी उसी तरफ जा रहे हैं",
            "chalti aag ki taraf dikha raha aur log abhi udhar ja rahe",
        ),
    ],
    "LIGHTING": [
        (
            "is slightly dim; the route is still well illuminated",
            "थोड़ा मंद है; रास्ते में पर्याप्त रोशनी है",
            "thodi dim hai, raste par kaafi roshni hai",
        ),
        (
            "does not illuminate properly and needs repair; no serious hazard is stated",
            "ठीक रोशनी नहीं देता और मरम्मत चाहिए; गंभीर खतरा नहीं बताया गया",
            "theek light nahi deta, repair chahiye, serious hazard nahi bataya",
        ),
        (
            "has failed leaving the only pedestrian route completely dark and unsafe",
            "बंद है जिससे इकलौता पैदल मार्ग पूरा अंधेरा और असुरक्षित है",
            "band hai, eklauta paidal rasta poora andhera aur unsafe hai",
        ),
        (
            "has gone out and a walker is falling off an unseen deep edge now",
            "बंद हो गया है और व्यक्ति अभी अदृश्य गहरे किनारे से गिर रहा है",
            "band ho gaya, walker abhi andhere gehre kinare se gir raha",
        ),
    ],
    "TRAIL": [
        (
            "has a little loose gravel; walkers can use it normally",
            "पर थोड़ा कंकड़ है; सामान्य चलना संभव है",
            "par thoda kankar hai, normally chal sakte hain",
        ),
        (
            "has erosion needing upkeep; the unpaved route remains passable",
            "में कटाव है और रखरखाव चाहिए; कच्चा मार्ग खुला है",
            "mein erosion hai, upkeep chahiye, kachcha rasta khula hai",
        ),
        (
            "is washed out across its width and walkers cannot pass",
            "पूरी चौड़ाई में बह गया है और पैदल नहीं निकल सकते",
            "poori width mein beh gaya, paidal nahi nikal sakte",
        ),
        (
            "is sliding into a ravine with hikers on it right now",
            "अभी खाई में खिसक रहा है और यात्री उस पर हैं",
            "abhi khai mein khisak raha, hikers us par hain",
        ),
    ],
    "OTHER": [
        (
            "seems a little worn but its normal service still works",
            "थोड़ा पुराना दिखता है लेकिन सामान्य सेवा चालू है",
            "thoda purana dikhta hai, normal service abhi chalti hai",
        ),
        (
            "has stopped providing its usual service and needs attention",
            "की सामान्य सेवा बंद है और ध्यान चाहिए",
            "ki normal service band hai, dhyan chahiye",
        ),
    ],
}

INSTRUCTIONS = {
    "train": "Write concise civic maintenance notes. State an object and the reported consequence. Use direct declarative language.",
    "validation": "Write an observation after checking a facility. Use a different object vocabulary and reflective wording.",
    "test": "Write brief messages to a maintenance desk after an unexpected encounter. Avoid training introductions and use reserved objects. Preserve negation and the absence or presence of people.",
}

TEST_FACTS = {
    "CLEANLINESS": [
        (
            "has just two wrappers at its foot, away from people's way",
            "के पास सिर्फ दो खाली पैकेट हैं जो चलने में नहीं आते",
            "ke paas bas do wrappers hain, chalne mein nahi aate",
        ),
        (
            "is surrounded by uncollected bags giving off a smell, with clear space to walk",
            "के चारों ओर बिना उठे थैले बदबू दे रहे हैं, चलने की जगह खुली है",
            "ke aas paas uncollected bags badboo de rahe, walking space clear hai",
        ),
        (
            "has a knee-high pile of refuse across the sole way through",
            "पर घुटनों जितना कचरा एकमात्र रास्ते पर फैला है",
            "par ghutnon tak waste ka dher hai, wahi ek rasta tha",
        ),
        (
            "is engulfed in flames and a visitor cannot escape the smoke at this moment",
            "आग में घिरा है और एक आगंतुक इसी वक्त धुएं से नहीं निकल पा रहा",
            "aag mein ghira hai, visitor isi waqt dhuen se nikal nahi paa raha",
        ),
    ],
    "INFRASTRUCTURE": [
        (
            "shows chipped paint while all parts remain solid and usable",
            "पर रंग उखड़ा है, सभी हिस्से मजबूत और काम के हैं",
            "ka paint utra hai, saare parts solid aur usable hain",
        ),
        (
            "has cracks that need patching, but passing over it is still possible",
            "में दरारों पर पैबंद चाहिए, इसके ऊपर से निकल सकते हैं",
            "mein cracks patch karne hain, upar se pass ho sakte hain",
        ),
        (
            "has split apart, leaving no usable crossing for pedestrians",
            "अलग टूट गया है, पैदल पार करने की जगह नहीं बची",
            "alag toot gaya, paidal crossing ki jagah nahi bachi",
        ),
        (
            "is breaking apart while pedestrians are dropping into the gap",
            "बिखर रहा है और पैदल यात्री अभी खाली हिस्से में गिर रहे हैं",
            "bikhar raha hai aur pedestrians abhi gap mein gir rahe",
        ),
    ],
    "ACCESSIBILITY": [
        (
            "has a scuffed coating, yet mobility aids move over it without trouble",
            "का लेप घिसा है, चलने के सहायक साधन बिना दिक्कत निकलते हैं",
            "ki coating ghisi hai, mobility aids bina dikkat nikalte hain",
        ),
        (
            "has uneven patches that need smoothing; a chair can still get through",
            "के टेढ़े हिस्से समतल करने हैं, कुर्सी फिर भी निकल जाती है",
            "ke uneven patches smooth karne hain, chair phir bhi nikal jaati",
        ),
        (
            "has a locked barrier; a wheelchair cannot get to the facility by any route",
            "का अवरोध बंद है; व्हीलचेयर किसी भी मार्ग से सुविधा नहीं पहुंच सकती",
            "ka barrier locked hai, wheelchair kisi bhi route se facility nahi pahunch sakti",
        ),
        (
            "is tipping into a steep drop with a disabled visitor still on it",
            "खड़ी गहराई की ओर झुक रहा है और दिव्यांग आगंतुक उस पर है",
            "steep drop ki taraf palat raha, disabled visitor abhi us par hai",
        ),
    ],
    "SAFETY": [
        (
            "looks untidy, although its guard is intact and nothing dangerous is exposed",
            "अव्यवस्थित दिखता है, पर रक्षक सही है और कोई खतरा खुला नहीं",
            "untidy dikhta hai, guard intact hai, dangerous cheez exposed nahi",
        ),
        (
            "needs its outer guard repaired; there are no sparks or other reported hazards",
            "के बाहरी रक्षक की मरम्मत चाहिए; चिंगारी या दूसरा खतरा नहीं बताया",
            "ka outer guard repair chahiye, sparks ya doosra hazard nahi bataya",
        ),
        (
            "has lost its barrier so a passerby could suffer a serious fall",
            "का अवरोध हट गया है जिससे राहगीर को गंभीर गिरावट का खतरा है",
            "ka barrier hat gaya, passerby ko serious fall ka risk hai",
        ),
        (
            "has a person caught inside while an active lethal hazard continues",
            "के अंदर व्यक्ति फंसा है और जानलेवा खतरा अभी जारी है",
            "ke andar person phansa hai, jaanleva hazard abhi jaari hai",
        ),
    ],
    "ENVIRONMENT": [
        (
            "has a few disturbed leaves with no damage to the surrounding habitat",
            "के कुछ पत्ते अस्तव्यस्त हैं, आसपास के आवास को नुकसान नहीं",
            "ke kuch patte idhar udhar hain, habitat ko nuksaan nahi",
        ),
        (
            "shows damaged plants and dirty water; nothing indicates a major hazard",
            "में पौधे खराब और पानी गंदा है; बड़े खतरे का संकेत नहीं",
            "mein plants damaged aur paani dirty hai, major hazard ka signal nahi",
        ),
        (
            "has storm damage leaving a heavy unstable mass over the walkway",
            "में तूफान का नुकसान है और भारी अस्थिर चीज पैदल रास्ते पर है",
            "mein storm damage hai, heavy unstable mass walkway par hai",
        ),
        (
            "is being swept away in a flash flood carrying people with it",
            "अचानक बाढ़ में बह रहा है और लोग उसके साथ बह रहे हैं",
            "flash flood mein beh raha aur log saath mein beh rahe",
        ),
    ],
    "SIGNAGE": [
        (
            "has a scratched corner; every direction can still be understood",
            "के कोने पर खरोंच है; हर दिशा अभी समझ आती है",
            "ke corner par scratch hai, har direction samajh aati hai",
        ),
        (
            "has lost its text, leaving visitors without the posted directions",
            "के शब्द मिट गए हैं, आगंतुकों को लिखी दिशा नहीं मिलती",
            "ka text mit gaya, visitors ko posted direction nahi milti",
        ),
        (
            "gives the wrong diversion into a hazardous works area",
            "गलत मोड़ से खतरनाक निर्माण क्षेत्र भेजता है",
            "galat diversion se hazardous work area mein bhejta hai",
        ),
        (
            "sends a crowd into a burning passage they are entering at this instant",
            "भीड़ को जलते गलियारे भेजता है जिसमें वे इसी क्षण घुस रहे हैं",
            "bheed ko burning passage mein bhejta hai, log isi instant ghus rahe",
        ),
    ],
    "LIGHTING": [
        (
            "flickers briefly but adjacent illumination keeps the crossing clearly visible",
            "थोड़ा झिलमिलाता है पर आसपास की रोशनी से पार का रास्ता साफ दिखता है",
            "briefly flicker hota hai, paas ki roshni se crossing clear dikhti hai",
        ),
        (
            "stays unlit after dusk; repair is needed but no dangerous consequence is described",
            "शाम के बाद नहीं जलता; सुधार चाहिए पर खतरनाक परिणाम नहीं बताया",
            "shaam baad nahi jalta, repair chahiye, dangerous consequence nahi bataya",
        ),
        (
            "has blacked out the entire crossing beside an unguarded drop",
            "पूरा पार का रास्ता अंधेरा करता है जो खुले गहरे किनारे के पास है",
            "poori crossing blackout hai, bina guard ke deep drop ke paas",
        ),
        (
            "failed as a child stepped over an invisible edge and is falling now",
            "बंद हुआ जब बच्चा अदृश्य किनारे के पार गया और अभी गिर रहा है",
            "fail hua, bachcha invisible edge paar karke abhi gir raha",
        ),
    ],
    "TRAIL": [
        (
            "has scattered twigs without making the dirt track harder to walk",
            "पर छोटी टहनियां हैं पर कच्चे मार्ग पर चलना मुश्किल नहीं",
            "par chhoti twigs hain, dirt track par chalna mushkil nahi",
        ),
        (
            "has shallow ruts from rain; the earth path needs maintenance but is open",
            "में बारिश की छोटी लीक है; मिट्टी मार्ग सुधारना है पर खुला है",
            "mein rain se shallow ruts hain, earth path fix chahiye par open hai",
        ),
        (
            "has a landslip blocking the full hiking route, forcing everyone to turn back",
            "पर भूस्खलन से पूरा भ्रमण मार्ग बंद है और सबको लौटना पड़ता है",
            "par landslip poora hiking route block karta, sabko return karna padta",
        ),
        (
            "is crumbling down a cliff while a group of walkers is on that section",
            "चट्टान से टूटकर गिर रहा है और यात्रियों का समूह उस हिस्से पर है",
            "cliff se crumble ho raha, walkers ka group usi section par hai",
        ),
    ],
    "OTHER": [
        (
            "has a small cosmetic blemish that does not affect its service",
            "पर छोटा बाहरी दाग है जो सेवा पर असर नहीं डालता",
            "par chhota cosmetic daag hai, service par asar nahi",
        ),
        (
            "no longer works for visitors; it needs servicing without any danger being reported",
            "आगंतुकों के लिए काम नहीं करता; सेवा चाहिए, खतरा नहीं बताया गया",
            "visitors ke liye kaam nahi karta, servicing chahiye, khatra nahi bataya",
        ),
    ],
}

# Introductions and endings are disjoint across splits. They do not encode severity.
FRAMES = {
    "train": [
        [
            "While walking: {body}.",
            "Please inspect this: {body}.",
            "A local maintenance note: {body}.",
            "I noticed that {body}.",
        ],
        [
            "चलते समय देखा: {body}।",
            "कृपया जांचें: {body}।",
            "स्थानीय देखभाल की सूचना: {body}।",
            "मैंने देखा कि {body}।",
        ],
        [
            "Chalte hue dekha: {body}.",
            "Please check karo: {body}.",
            "Local maintenance note: {body}.",
            "Maine dekha ki {body}.",
        ],
    ],
    "validation": [
        [
            "After checking the facility, I can report {body}.",
            "My observation from the inspection is that {body}.",
        ],
        ["जगह जांचने के बाद सूचना है कि {body}।", "निरीक्षण में पाया कि {body}।"],
        ["Jagah check karne ke baad report hai ki {body}.", "Inspection mein mila ki {body}."],
    ],
    "test": [
        [
            "Maintenance desk, can you look at this? {body}.",
            "Encountered this on my return: {body}. Please record the facts.",
        ],
        ["देखभाल कार्यालय, इसे देखें। {body}।", "वापसी पर यह मिला: {body}। तथ्य दर्ज करें।"],
        ["Maintenance desk zara dekho. {body}.", "Vaapas aate hue mila: {body}. Facts note karo."],
    ],
}


def generate() -> dict:
    data.DATASET.mkdir(parents=True, exist_ok=True)
    accepted = {}
    dropped = []
    prior = []
    for split, indices, seed in [
        ("train", range(4), 17011),
        ("validation", [4], 23011),
        ("test", [5, 6], 39011),
    ]:
        rows = []
        for ci, (category, objects) in enumerate(OBJECTS.items()):
            for severity_index, facts in enumerate(
                (TEST_FACTS if split == "test" else FACTS)[category]
            ):
                for oi in indices:
                    for li, language in enumerate(("english", "hindi", "hinglish")):
                        if split == "validation" and li == (ci + severity_index) % 3:
                            continue
                        obj = objects[oi]
                        body = obj[li + 1] + " " + facts[li]
                        frame = FRAMES[split][li][(oi + severity_index) % len(FRAMES[split][li])]
                        note = frame.format(body=body)
                        row = {
                            "id": f"v3-{split}-{category.lower()}-{severity_index}-{oi}-{li}",
                            "note": note,
                            "language": language,
                            "source": "synthetic",
                            "scenarioFamily": obj[0],
                            "target": {
                                "category": category,
                                "severity": common.SEVERITIES[severity_index],
                                "object": obj[0],
                                "condition": [
                                    "minor_wear",
                                    "maintenance_needed",
                                    "major_obstruction",
                                    "immediate_danger",
                                ][severity_index],
                                "evidence": [obj[1] + " " + facts[0]],
                            },
                            "provenance": {
                                "labelSource": "assistant-rubric-v3",
                                "generation": "deterministic-template-bank",
                                "seed": seed,
                                "instruction": INSTRUCTIONS[split],
                            },
                        }
                        matches = [(p["id"], data.similarity(note, p["note"])) for p in prior]
                        worst = max(matches, key=lambda x: x[1], default=(None, 0.0))
                        if (
                            any(data.normalized(note) == data.normalized(p["note"]) for p in prior)
                            or worst[1] >= 0.6
                        ):
                            dropped.append(
                                {
                                    "id": row["id"],
                                    "split": split,
                                    "matchedId": worst[0],
                                    "jaccard": worst[1],
                                }
                            )
                        else:
                            rows.append(row)
        random.Random(seed).shuffle(rows)
        accepted[split] = rows
        prior.extend(rows)
        path = data.DATASET / f"{split}.jsonl"
        path.write_text("".join(json.dumps(x, ensure_ascii=False) + "\n" for x in rows))
    manifest = {
        "kind": "fieldissue-frozen-dataset-v3",
        "generationMethod": "Assistant-authored domain facts combined with split-specific objects and writing frames. No external generation model was used.",
        "limitations": "Template-generated synthetic notes have correlated wording. Lexical deduplication does not prove semantic independence. Note bootstrap intervals do not remove template correlation.",
        "counts": {k: len(v) for k, v in accepted.items()},
        "distributions": {
            k: {
                f: dict(Counter(x[f] if f != "severity" else x["target"]["severity"] for x in v))
                for f in ["language", "severity"]
            }
            for k, v in accepted.items()
        },
        "nearDuplicateThreshold": 0.6,
        "dropped": dropped,
        "sha256": {k: common.dataset_sha256(data.DATASET / f"{k}.jsonl") for k in accepted},
        "fewShotIds": [
            "v3-train-cleanliness-0-0-0",
            "v3-train-lighting-1-1-1",
            "v3-train-accessibility-2-2-2",
            "v3-train-safety-3-3-0",
            "v3-train-infrastructure-1-0-2",
        ],
    }
    public_path = data.DATASET / "public-source.jsonl"
    public_rows = data.load(public_path)
    public_matches = []
    for row in public_rows:
        matches = [(p["id"], data.similarity(row["note"], p["note"])) for p in prior]
        worst = max(matches, key=lambda x: x[1], default=(None, 0.0))
        if worst[1] >= 0.6:
            public_matches.append({"id": row["id"], "matchedId": worst[0], "jaccard": worst[1]})
    if public_matches:
        raise ValueError("Public-source notes overlap frozen synthetic splits")
    manifest["sha256"]["public-source"] = common.dataset_sha256(public_path)
    manifest["publicSourceRows"] = len(public_rows)
    manifest["rubricSha256"] = common.dataset_sha256(data.ROOT / "SEVERITY_RUBRIC.md")
    manifest["publicSourceNearDuplicateDrops"] = public_matches
    common.write_json(data.DATASET / "manifest.json", manifest)
    return manifest


if __name__ == "__main__":
    print(json.dumps(generate()["counts"]))

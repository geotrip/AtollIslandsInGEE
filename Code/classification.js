var n9901 = ee.Image("users/andrew84555/palau/NDSV/19992001_LS7_NDSV_new_palau_clipped"),
    n0203 = ee.Image("users/andrew84555/palau/NDSV/20022003_LS7_NDSV_new_palau_clipped"),
    n0406 = ee.Image("users/andrew84555/palau/NDSV/20042006_LS7_NDSV_new_palau_clipped"),
    n0710 = ee.Image("users/andrew84555/palau/NDSV/20072010_LS7_NDSV_new_palau_clipped"),
    n1113 = ee.Image("users/andrew84555/palau/NDSV/20112013_LS7_NDSV_new_palau_clipped"),
    n14 = ee.Image("users/andrew84555/palau/NDSV/2014_LS8_NDSV_palau_clipped"),
    n15 = ee.Image("users/andrew84555/palau/NDSV/2015_LS8_NDSV_palau_clipped"),
    n16 = ee.Image("users/andrew84555/palau/NDSV/2016_LS8_NDSV_palau_clipped"),
    n17 = ee.Image("users/andrew84555/palau/NDSV/2017_LS8_NDSV_palau_clipped"),
    ps17 = ee.Image("users/andrew84555/palau/PS/LS8_2017_new_median_PS_u8bit_palau_clipped"),
    ps16 = ee.Image("users/andrew84555/palau/PS/LS8_2016_new_median_PS_u8bit_palau_clipped"),
    ps15 = ee.Image("users/andrew84555/palau/PS/LS8_2015_new_median_PS_u8bit_palau_clipped"),
    ps14 = ee.Image("users/andrew84555/palau/PS/LS8_2014_new_median_PS_u8bit_palau_clipped"),
    m9901 = ee.Image("users/andrew84555/palau/full_composite/LS7_19992001_new_median_full_composite_palau_clipped"),
    m0203 = ee.Image("users/andrew84555/palau/full_composite/LS7_20022003_new_median_full_composite_palau_clipped"),
    m0406 = ee.Image("users/andrew84555/palau/full_composite/LS7_20042006_new_median_full_composite_palau_clipped"),
    m0710 = ee.Image("users/andrew84555/palau/full_composite/LS7_20072010_new_median_full_composite_palau_clipped"),
    m1113 = ee.Image("users/andrew84555/palau/full_composite/LS7_20112013_new_median_full_composite_palau_clipped"),
    roi = ee.FeatureCollection("users/andrew84555/ROI/palau_roi_clip"),
    Vg = /* color: #00d637 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[134.71426963738054, 8.091862111997827],
                  [134.71472024866148, 8.089780190692158],
                  [134.71637248988952, 8.090629955648199],
                  [134.71596479424602, 8.092117040390404]]]),
            {
              "class": 1,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.71036434173584, 8.05668046125027],
                  [134.71017122268677, 8.054683343333881],
                  [134.71081495285034, 8.054917049130967],
                  [134.71124410629272, 8.05668046125027]]]),
            {
              "class": 1,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.69923853874207, 8.043188934929729],
                  [134.69871282577515, 8.042551536715873],
                  [134.700129032135, 8.042169097306651],
                  [134.70059037208557, 8.042328447104314]]]),
            {
              "class": 1,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.12414360046387, 3.0110345487049255],
                  [131.12180471420288, 3.0092131630642993],
                  [131.12154722213745, 3.0073060618962657],
                  [131.1251735687256, 3.0102202825595574]]]),
            {
              "class": 1,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.12605333328247, 3.010841696251812],
                  [131.12581729888916, 3.0091488788095924],
                  [131.12729787826538, 3.0091060226376927],
                  [131.12744808197021, 3.0107131279307753]]]),
            {
              "class": 1,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.1225986480713, 3.0031918547634233],
                  [131.12324237823486, 3.0012847430733514],
                  [131.12446546554565, 3.0029132880949954],
                  [131.12444400787354, 3.0041775516349776]]]),
            {
              "class": 1,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.3106026649475, 4.319430820522432],
                  [132.3099160194397, 4.316520860371024],
                  [132.31296300888062, 4.3157291781051015],
                  [132.31285572052002, 4.319302440162839]]]),
            {
              "class": 1,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.30916500091553, 4.311642372740644],
                  [132.30965852737427, 4.309288705226013],
                  [132.31257677078247, 4.310379951979834],
                  [132.31210470199585, 4.31228428079785]]]),
            {
              "class": 1,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.31199741363525, 4.3092459112037425],
                  [132.3112678527832, 4.306357309134199],
                  [132.31201887130737, 4.3062717207574295],
                  [132.31309175491333, 4.30920311717908]]]),
            {
              "class": 1,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.9517982006073, 4.656523376032483],
                  [131.95228099822998, 4.654748265553593],
                  [131.95434093475342, 4.6560100915350295],
                  [131.95318222045898, 4.657025966740022]]]),
            {
              "class": 1,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.2232699394226, 5.325192272858904],
                  [132.2216820716858, 5.321987505425068],
                  [132.22520112991333, 5.318868182419621],
                  [132.22575902938843, 5.325170907797986]]]),
            {
              "class": 1,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.22311973571777, 5.333460495651476],
                  [132.22058773040771, 5.331580392753542],
                  [132.22367763519287, 5.328931147080167],
                  [132.22558736801147, 5.331494933394091]]]),
            {
              "class": 1,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.21917152404785, 5.329999392678375],
                  [132.21967577934265, 5.328183374056044],
                  [132.22159624099731, 5.3266023652371635],
                  [132.22093105316162, 5.329636189383442]]]),
            {
              "class": 1,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.22721815109253, 5.356704927780669],
                  [132.22535133361816, 5.354910352336668],
                  [132.2251582145691, 5.353543053223873],
                  [132.22723960876465, 5.351577555392555],
                  [132.22895622253418, 5.351385278091599],
                  [132.22923517227173, 5.356277648391016]]]),
            {
              "class": 1,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.9495129585266, 4.653657699882672],
                  [131.94942712783813, 4.653016091589525],
                  [131.95077896118164, 4.652716674185934],
                  [131.9509720802307, 4.653465217456128]]]),
            {
              "class": 1,
              "system:index": "14"
            })]),
    Sh = /* color: #cacaca */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[134.7117805480957, 8.102611780870268],
                  [134.70929145812988, 8.102484320058904],
                  [134.7048282623291, 8.10044494158757],
                  [134.69959259033203, 8.092669716406864],
                  [134.7083044052124, 8.088633338156415],
                  [134.71628665924072, 8.102399346162233]]]),
            {
              "class": 3,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.68495845794678, 8.05812551067295],
                  [134.68392848968506, 8.04801238022793],
                  [134.68573093414307, 8.0441880214159],
                  [134.6931552886963, 8.049074695715433],
                  [134.68791961669922, 8.050944364208204]]]),
            {
              "class": 3,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.69070911540416, 8.090587797139115],
                  [134.68822002701165, 8.085574161670964],
                  [134.68864918018198, 8.081495225815582],
                  [134.6875762972527, 8.077076332108826],
                  [134.69448566331198, 8.077926123117248],
                  [134.69645976789548, 8.088888266678754]]]),
            {
              "class": 3,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.6092987060547, 8.201892103607307],
                  [134.6088695526123, 8.198833792087363],
                  [134.61633682250977, 8.184646317263434],
                  [134.62303161621094, 8.187704737821747],
                  [134.6176242828369, 8.202146961838665]]]),
            {
              "class": 3,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.61238861083984, 8.1679945047319],
                  [134.61161613464355, 8.157204438912604],
                  [134.61934089660645, 8.156779627209723],
                  [134.6180534362793, 8.1679945047319]]]),
            {
              "class": 3,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.76714418743825, 2.9342133099121295],
                  [131.7630672454834, 2.929670241836606],
                  [131.76916122436523, 2.924355681620593],
                  [131.7773151397705, 2.933699004546543],
                  [131.77010536193848, 2.9391420970620934]]]),
            {
              "class": 3,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.82409286499023, 2.9577855588998303],
                  [131.83173179626465, 2.942356509310438],
                  [131.8432331085205, 2.947842418133592],
                  [131.83713912963867, 2.961985651938972]]]),
            {
              "class": 3,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.72547340393066, 2.816087529437309],
                  [131.72521591186523, 2.809743711379086],
                  [131.73105239868164, 2.802714034891522],
                  [131.7396354675293, 2.8087149808760357],
                  [131.73362731933594, 2.819173698707601]]]),
            {
              "class": 3,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.81096076965332, 3.01195628921144],
                  [131.8081283569336, 3.010370613813941],
                  [131.805682182312, 3.008313517967578],
                  [131.80400848388672, 3.005999280501066],
                  [131.80383682250977, 3.001585073207475],
                  [131.8198013305664, 3.00784209962269],
                  [131.81975841522217, 3.0093420663761],
                  [131.8182134628296, 3.010927743270698],
                  [131.8161106109619, 3.0119134331499824],
                  [131.81332111358643, 3.0120848573857386]]]),
            {
              "class": 3,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.1300230020945, 3.0177629418778436],
                  [131.1240792274475, 3.0169272460785894],
                  [131.12289905548096, 3.0136273394804802],
                  [131.1288857460022, 3.0133916314833207],
                  [131.13176107406616, 3.0172272370909807]]]),
            {
              "class": 3,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.3054313659668, 4.316414210654439],
                  [132.3050880432129, 4.312220424343523],
                  [132.3071050643921, 4.31239159974824],
                  [132.30770587921143, 4.317056114678447]]]),
            {
              "class": 3,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.31444358825684, 4.317633493511266],
                  [132.31420755386353, 4.313760667271282],
                  [132.31624603271484, 4.313589492175027],
                  [132.3159885406494, 4.317333938595502]]]),
            {
              "class": 3,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.9557785987854, 4.657999233960678],
                  [131.95685148239136, 4.656031645481419],
                  [131.9582462310791, 4.6569298930786704],
                  [131.95661544799805, 4.658405583069494]]]),
            {
              "class": 3,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.7110939025879, 8.071808242885684],
                  [134.70989227294922, 8.068154071208902],
                  [134.71384048461914, 8.06534968449253],
                  [134.71624374389648, 8.068833919604115]]]),
            {
              "class": 3,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.2226047515869, 5.3371569240601255],
                  [132.22105979919434, 5.336387796386097],
                  [132.22050189971924, 5.334208596072902],
                  [132.2241497039795, 5.33617414963881],
                  [132.2232484817505, 5.337071465477302]]]),
            {
              "class": 3,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.71564292907715, 8.079242627479381],
                  [134.71585750579834, 8.075970930886804],
                  [134.71667289733887, 8.077585537713695],
                  [134.71667289733887, 8.080177393063996]]]),
            {
              "class": 3,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.6877908706665, 8.066368135895289],
                  [134.68573093414307, 8.062076547556849],
                  [134.69354152679443, 8.061651635342715]]]),
            {
              "class": 3,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.70602989196777, 8.05175105444771],
                  [134.70319747924805, 8.048606613296988],
                  [134.7048282623291, 8.045207190007966],
                  [134.70929145812988, 8.05022132936901]]]),
            {
              "class": 3,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.6380090713501, 8.168927736145864],
                  [134.63637828826904, 8.164977085813273],
                  [134.6405839920044, 8.16242825840387],
                  [134.64298725128174, 8.168375497052061]]]),
            {
              "class": 3,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.22693920135498, 5.336258940700545],
                  [132.22475051879883, 5.3344215758565365],
                  [132.22608089447021, 5.3327978535081115],
                  [132.2276258468628, 5.3344215758565365]]]),
            {
              "class": 3,
              "system:index": "19"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.7495059967041, 2.9154395395569574],
                  [131.7410945892334, 2.9071247079749707],
                  [131.74701690673828, 2.9030958500041892],
                  [131.7553424835205, 2.911667870980344]]]),
            {
              "class": 3,
              "system:index": "20"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.81310653686523, 2.9855559671478367],
                  [131.8161964416504, 2.973898775512701],
                  [131.82306289672852, 2.977670233371778],
                  [131.8191146850586, 2.987784533832029]]]),
            {
              "class": 3,
              "system:index": "21"
            })]),
    Wt = /* color: #000000 */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[134.61959838867188, 8.294396193564815],
                  [134.6213150024414, 8.269255254502935],
                  [134.6286964416504, 8.271463644534295],
                  [134.64174270629883, 8.297114036683366]]]),
            {
              "class": 0,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.6067237854004, 8.395453286925608],
                  [134.60311889648438, 8.369639509897263],
                  [134.62406158447266, 8.368450676277899],
                  [134.62697982788086, 8.395113643096428]]]),
            {
              "class": 0,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.73092079162598, 8.076312176453284],
                  [134.72139358520508, 8.057446308209919],
                  [134.73057746887207, 8.05464184726206],
                  [134.73426818847656, 8.073337886333146]]]),
            {
              "class": 0,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.73113822937012, 2.9468138122880436],
                  [131.72006607055664, 2.933527568131082],
                  [131.73362731933594, 2.922298425741466],
                  [131.74924850463867, 2.939956415707758]]]),
            {
              "class": 0,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.85155865229353, 2.9373862421154766],
                  [131.8488120565487, 2.9238426605914345],
                  [131.8623733736341, 2.9217853934403846],
                  [131.86477664520544, 2.9360147476110368]]]),
            {
              "class": 0,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.6979217529297, 2.8581800801136357],
                  [131.69363021850586, 2.8441212718021998],
                  [131.70839309692383, 2.8400064661795734],
                  [131.71234130859375, 2.8576657364981517]]]),
            {
              "class": 0,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.7289924621582, 3.0054441574157438],
                  [131.7253875732422, 2.992244332176365],
                  [131.74907684326172, 2.9903586298638136],
                  [131.75199508666992, 3.0044156053316207]]]),
            {
              "class": 0,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.78289413452148, 2.810002233355184],
                  [131.77122116088867, 2.791313492318319],
                  [131.78220748901367, 2.7847980814349302],
                  [131.79628372192383, 2.807087495221701]]]),
            {
              "class": 0,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.1334991455078, 3.018256111887336],
                  [131.13444328308105, 3.0144419378900373],
                  [131.1383056640625, 3.017270427754463]]]),
            {
              "class": 0,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.32053756713867, 4.317398463269267],
                  [132.31929302215576, 4.312562775114409],
                  [132.32272624969482, 4.308968084328772],
                  [132.32439994812012, 4.317141701840627]]]),
            {
              "class": 0,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.9385910068163, 4.657186880125603],
                  [131.93455694050328, 4.652310651851774],
                  [131.93932055876144, 4.64867484537152],
                  [131.9431400441947, 4.656117531630407]]]),
            {
              "class": 0,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.2196865081787, 5.345660661117551],
                  [132.2193431854248, 5.341473234644133],
                  [132.23187446594238, 5.339422239807961],
                  [132.2325611114502, 5.3442078837472495]]]),
            {
              "class": 0,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.23084449768066, 5.330619975752324],
                  [132.23024368286133, 5.324808703136677],
                  [132.2343635559082, 5.324466861859672],
                  [132.23419189453125, 5.331389110655169]]]),
            {
              "class": 0,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.65753555297852, 8.232730089157148],
                  [134.6484375, 8.209793960135409],
                  [134.6645736694336, 8.204526958162587],
                  [134.66903686523438, 8.221347139084326]]]),
            {
              "class": 0,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.7149133682251, 8.05209099256953],
                  [134.71113681793213, 8.045929569842635],
                  [134.71551418304443, 8.044952232111891],
                  [134.716157913208, 8.052006008065824]]]),
            {
              "class": 0,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.71976280212402, 8.039003169024394],
                  [134.71808910369873, 8.034201361617418],
                  [134.72173690795898, 8.032586581760377],
                  [134.7240114212036, 8.039385611418897]]]),
            {
              "class": 0,
              "system:index": "15"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.5382308959961, 8.371505016051126],
                  [134.53393936157227, 8.360635597111948],
                  [134.55059051513672, 8.349086507443175],
                  [134.55934524536133, 8.36674968257932]]]),
            {
              "class": 0,
              "system:index": "16"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.958589553833, 4.650556253543605],
                  [131.95603609085083, 4.648823902180893],
                  [131.96191549301147, 4.646813513778734],
                  [131.96534872055054, 4.649465514293414]]]),
            {
              "class": 0,
              "system:index": "17"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.7487335205078, 2.8583488490622346],
                  [131.7473602294922, 2.8508051207280447],
                  [131.76658630371094, 2.854062645856646],
                  [131.76624298095703, 2.8619492473838832]]]),
            {
              "class": 0,
              "system:index": "18"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.78855895996094, 2.930011776472098],
                  [131.78152084350586, 2.920068388254061],
                  [131.78821563720703, 2.9156109787374023],
                  [131.79662704467773, 2.927440219008861]]]),
            {
              "class": 0,
              "system:index": "19"
            })]),
    Urb = /* color: #ffc82d */ee.FeatureCollection(
        [ee.Feature(
            ee.Geometry.Polygon(
                [[[134.7170054912567, 8.082578197094797],
                  [134.71723079681396, 8.082068328259568],
                  [134.7177028656006, 8.082323262757727],
                  [134.71724152565002, 8.082535708049809]]]),
            {
              "class": 4,
              "system:index": "0"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.71054673194885, 8.062406020196896],
                  [134.7103750705719, 8.061683669755666],
                  [134.71090078353882, 8.061545573200911],
                  [134.7113299369812, 8.062321037859006]]]),
            {
              "class": 4,
              "system:index": "1"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.71258521080017, 8.062969027734479],
                  [134.71234917640686, 8.062480379727917],
                  [134.7127890586853, 8.062544116457897],
                  [134.71267104148865, 8.062884045514869]]]),
            {
              "class": 4,
              "system:index": "2"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.7122848033905, 8.061120660429047],
                  [134.7126603126526, 8.060493913275918],
                  [134.71293926239014, 8.060982563682096]]]),
            {
              "class": 4,
              "system:index": "3"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.71863627433777, 8.083141176518517],
                  [134.71866846084595, 8.082843753524637],
                  [134.71893668174744, 8.082960598298383],
                  [134.7187864780426, 8.083204909988682]]]),
            {
              "class": 4,
              "system:index": "4"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.7175097465515, 8.076704044182396],
                  [134.71741318702698, 8.076395994021555],
                  [134.7177028656006, 8.076587197597325]]]),
            {
              "class": 4,
              "system:index": "5"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.9486117362976, 4.654373994700263],
                  [131.94860100746155, 4.654192205928246],
                  [131.94879412651062, 4.654170819010811],
                  [131.9487726688385, 4.654331220875774]]]),
            {
              "class": 4,
              "system:index": "6"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.94947004318237, 4.656555456301147],
                  [131.9494915008545, 4.656480602338677],
                  [131.9496202468872, 4.656523376032483]]]),
            {
              "class": 4,
              "system:index": "7"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.22014784812927, 5.324967772767676],
                  [132.2201693058014, 5.324818217271061],
                  [132.22034096717834, 5.324818217271061],
                  [132.22033023834229, 5.324989137835654]]]),
            {
              "class": 4,
              "system:index": "8"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[132.21884965896606, 5.326741070882262],
                  [132.21884965896606, 5.326623563334164],
                  [132.21915006637573, 5.326602198323015],
                  [132.21911787986755, 5.326719705875198]]]),
            {
              "class": 4,
              "system:index": "9"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.71683382987976, 8.084256510792683],
                  [134.71679091453552, 8.083831621908985],
                  [134.71710205078125, 8.083874110817492],
                  [134.71701622009277, 8.084245888576037]]]),
            {
              "class": 4,
              "system:index": "10"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[134.7206211090088, 8.080591829456628],
                  [134.7206425666809, 8.079922623184071],
                  [134.72081422805786, 8.079922623184071],
                  [134.72076058387756, 8.080602451769455]]]),
            {
              "class": 4,
              "system:index": "11"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.1206352710724, 3.0056664745356834],
                  [131.12068891525269, 3.005098628308091],
                  [131.12096786499023, 3.0056557604586382]]]),
            {
              "class": 4,
              "system:index": "12"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.12369298934937, 3.006287890823473],
                  [131.12363934516907, 3.0061164656759796],
                  [131.1239719390869, 3.0063307471061202]]]),
            {
              "class": 4,
              "system:index": "13"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.12024903297424, 3.00710215990616],
                  [131.1204743385315, 3.0069307348866263],
                  [131.12039923667908, 3.007134302094319]]]),
            {
              "class": 4,
              "system:index": "14"
            }),
        ee.Feature(
            ee.Geometry.Polygon(
                [[[131.12300634384155, 3.0115056308556682],
                  [131.12263083457947, 3.011280636421042],
                  [131.12289905548096, 3.011216352288315],
                  [131.1231243610382, 3.0115056308556682]]]),
            {
              "class": 4,
              "system:index": "15"
            })]),
    palau_aa = ee.FeatureCollection("users/andrew84555/palau_aa_points");

//Palau classification

// Select the year of the imagery. This just sets the year description in the output correctly.

var year ='2017';
print('Year: '+year);


//Select the image to be classified, and the true- colour image to use as a reference

var toClassify = n17
toClassify = toClassify.clip(roi);

//Map.centerObject(roi)

//Add the current image and image to be classified to the map
var ls7viz = {gamma: 2, bands: 'B3,B2,B1'};
//var ls8viz = {gamma: 2.1}

Map.addLayer(ps17.clip(roi), {gamma: 2.2}, 'ps17',false);
Map.addLayer(ps16.clip(roi), {gamma: 2.2}, 'ps16',false);
Map.addLayer(ps15.clip(roi), {gamma: 2.2}, 'ps15',false);
Map.addLayer(ps14.clip(roi), {gamma: 2.2}, 'ps14',false);

Map.addLayer(m1113.clip(roi), ls7viz, 'm1113',false);
Map.addLayer(m0710.clip(roi), ls7viz, 'm0710',false);
Map.addLayer(m0406.clip(roi), ls7viz, 'm0406',false);
Map.addLayer(m0203.clip(roi), ls7viz, 'm0203',false);
Map.addLayer(m9901.clip(roi), ls7viz, 'm9901',false);


// Produce median training samples
var NDmedian= ee.ImageCollection([
    n9901,n0203,n0406,n0710,n1113,n14,n15,n16,n17
  ]).median()

var NDmedianL8= ee.ImageCollection([
  n14,n15,n16,n17
  ]).median()
  
var NDmedianL7= ee.ImageCollection([
    n9901,n0203,n0406,n0710,n1113
  ]).median()
  

var training = NDmedian.sampleRegions({
	collection: Wt.merge(Sh),
	properties: ['class'],
	scale: 30
});

var training2 = NDmedianL8.sampleRegions({
	collection: Vg,
	properties: ['class'],
	scale: 30
});

var training3 = NDmedianL8.sampleRegions({
	collection: Urb,
	properties: ['class'],
	scale: 30
});


var join = training.merge(training2).merge(training3)

var classifier = ee.Classifier.svm();

// Train the chosen classifier 
var fullClassifier = classifier.train({
  features:join, 
  classProperty: 'class', 
  inputProperties: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8', 'R9', 'R10', 'R11', 'R12', 'R13', 'R14', 'R15']
});

// Classify the images.
var classified = toClassify.classify(fullClassifier);

// var colorbrewer = require('users/gena/packages:colorbrewer')
// var palette = colorbrewer.Palettes.Set2[4]

var palette = ['LIGHTSKYBLUE', 'DARKGREEN', 'LEMONCHIFFON','ORANGE'];

Map.addLayer(classified.clip(roi), {palette: palette, min: 0, max: 4},'classified '+year);

// Create AA points 
var aaPoints = classified.stratifiedSample({
  numPoints: 50, classBand: 'classification', region: roi, dropNulls: true, geometries: true})

Export.table.toDrive({collection: aaPoints, description:'aa_points', folder:'seperate_outputs', fileFormat :'SHP'})


print(palau_aa)
var testing = toClassify.sampleRegions({
	collection: palau_aa,
	properties: ['classifica'],
	scale: 30
});

print(testing)
var validation = testing.classify(fullClassifier);


// Produce an error matrix 
var errorMatrix = validation.errorMatrix('classifica','classification');

// Test the classifiers' accuracy. (data, y, x), this can be done with training samples or points of known ground truth

print('Confusion table:', errorMatrix);
print('Accuracy: (correct/total)', errorMatrix.accuracy());
print('Consumer\'s accuracy (comission) (across):', errorMatrix.consumersAccuracy());
print('Producer\'s accuracy (omission) (down):', errorMatrix.producersAccuracy());



//Export the classified result
Export.image.toAsset({
  image: classified, 
  description: year+'_palau_split_urb_veg_SVM_class',
  assetId: 'palau/class_splitGen/'+year+'_palau_split_urb_veg_class',
  region: roi.geometry().bounds(), 
  scale: 30, 
  maxPixels: 1e13,
  pyramidingPolicy: {".default": "mode"},
});

// ZodiacMap 프로젝트 기반 황도 12궁 별자리 데이터
const ConstellationData = {
    aquarius: {
        name: "물병자리",
        latin: "Aquarius",
        abbreviation: "Aqr",
        stars: [
            // HYG 데이터베이스 기반 주요 별들
            { hip: 109074, ra: 22.0960, dec: -0.3199, mag: 2.91, name: "Sadalsuud" },
            { hip: 110395, ra: 22.3614, dec: -1.3871, mag: 2.96, name: "Sadalmelik" },
            { hip: 110960, ra: 22.4806, dec: -7.7833, mag: 3.27, name: "Ancha" },
            { hip: 112961, ra: 22.8776, dec: -7.5795, mag: 3.65, name: "Albali" },
            { hip: 111497, ra: 22.5894, dec: -15.8208, mag: 2.89, name: "Sadachbia" },
            { hip: 114855, ra: 23.2380, dec: -6.0494, mag: 4.01, name: "Phi Aqr" },
            { hip: 112716, ra: 22.8264, dec: -13.8697, mag: 3.78, name: "Skat" },
            { hip: 110003, ra: 22.2802, dec: -0.0199, mag: 4.01, name: "Eta Aqr" },
            { hip: 102618, ra: 20.7941, dec: -9.4956, mag: 3.77, name: "Iota Aqr" }
        ],
        connections: [
            [109074, 110395], [110395, 110003], [110003, 110960], 
            [110960, 112961], [112961, 114855],
            [110395, 102618],
            [111497, 112716], [112716, 114855]
        ]
    },

    pisces: {
        name: "물고기자리",
        latin: "Pisces",
        abbreviation: "Psc",
        stars: [
            { hip: 9487, ra: 2.0344, dec: 2.7637, mag: 3.79, name: "Alrescha" },
            { hip: 7097, ra: 1.5249, dec: 15.3456, mag: 4.26, name: "Fum al Samakah" },
            { hip: 5586, ra: 1.1935, dec: 7.5850, mag: 3.69, name: "Gamma Psc" },
            { hip: 5742, ra: 1.2290, dec: 3.1874, mag: 4.13, name: "Iota Psc" },
            { hip: 8198, ra: 1.7574, dec: 9.1577, mag: 4.50, name: "Kappa Psc" },
            { hip: 3786, ra: 0.8140, dec: 7.8899, mag: 4.44, name: "Theta Psc" },
            { hip: 6706, ra: 1.4347, dec: 12.4643, mag: 4.94, name: "Mu Psc" },
            { hip: 116771, ra: 23.6656, dec: 5.6263, mag: 4.26, name: "Tau Psc" },
            { hip: 115830, ra: 23.4485, dec: 1.2556, mag: 4.44, name: "Upsilon Psc" },
            { hip: 118268, ra: 23.9884, dec: 6.8632, mag: 4.01, name: "Omega Psc" }
        ],
        connections: [
            // 서쪽 물고기 (큰 원)
            [7097, 8198], [8198, 5586], [5586, 3786], [3786, 5742], [5742, 9487],
            // 동쪽 물고기 (작은 V)
            [9487, 115830], [115830, 116771], [116771, 118268],
            // 연결 줄
            [6706, 7097]
        ]
    },

    aries: {
        name: "양자리",
        latin: "Aries",
        abbreviation: "Ari",
        stars: [
            { hip: 9884, ra: 2.1195, dec: 23.4624, mag: 2.00, name: "Hamal" },
            { hip: 8903, ra: 1.9107, dec: 20.8081, mag: 2.64, name: "Sheratan" },
            { hip: 8832, ra: 1.8920, dec: 19.2939, mag: 4.75, name: "Mesarthim" },
            { hip: 13209, ra: 2.8331, dec: 21.3398, mag: 3.63, name: "Botein" },
            { hip: 14838, ra: 3.1947, dec: 21.0396, mag: 3.88, name: "41 Ari" }
        ],
        connections: [
            [9884, 8903], [8903, 8832],
            [9884, 13209], [13209, 14838]
        ]
    },

    taurus: {
        name: "황소자리",
        latin: "Taurus",
        abbreviation: "Tau",
        stars: [
            { hip: 21421, ra: 4.5987, dec: 16.5092, mag: 0.85, name: "Aldebaran" },
            { hip: 25428, ra: 5.4382, dec: 28.6074, mag: 1.65, name: "Elnath" },
            { hip: 20889, ra: 4.4770, dec: 15.9621, mag: 3.53, name: "Theta2 Tau" },
            { hip: 20455, ra: 4.3820, dec: 17.5426, mag: 3.76, name: "Epsilon Tau" },
            { hip: 20205, ra: 4.3296, dec: 15.6274, mag: 3.41, name: "Gamma Tau" },
            { hip: 26235, ra: 5.6275, dec: 21.1426, mag: 2.87, name: "Zeta Tau" },
            { hip: 18724, ra: 4.0111, dec: 12.4904, mag: 3.47, name: "Lambda Tau" },
            { hip: 25204, ra: 5.4075, dec: 27.6351, mag: 4.28, name: "Kappa1 Tau" }
        ],
        connections: [
            // V자 형태 (히아데스)
            [21421, 20889], [20889, 20205], [20205, 18724],
            [21421, 20455],
            // 뿔
            [21421, 26235], [26235, 25428],
            [26235, 25204]
        ]
    },

    gemini: {
        name: "쌍둥이자리",
        latin: "Gemini",
        abbreviation: "Gem",
        stars: [
            { hip: 36850, ra: 7.5770, dec: 31.8882, mag: 1.93, name: "Castor" },
            { hip: 37826, ra: 7.7553, dec: 28.0261, mag: 1.14, name: "Pollux" },
            { hip: 31681, ra: 6.6288, dec: 16.3993, mag: 2.88, name: "Alhena" },
            { hip: 30343, ra: 6.3832, dec: 22.5137, mag: 3.35, name: "Mebsuta" },
            { hip: 29655, ra: 6.2298, dec: 22.5068, mag: 2.98, name: "Mekbuda" },
            { hip: 35350, ra: 7.3355, dec: 21.9823, mag: 3.53, name: "Propus" },
            { hip: 34088, ra: 7.0682, dec: 20.5703, mag: 3.06, name: "Tejat" },
            { hip: 32362, ra: 6.7326, dec: 25.1310, mag: 3.79, name: "Wasat" }
        ],
        connections: [
            // 카스토르 라인
            [36850, 35350], [35350, 34088], [34088, 30343], [30343, 29655],
            // 폴룩스 라인
            [37826, 32362], [32362, 29655],
            // 발
            [30343, 31681], [32362, 31681]
        ]
    },

    cancer: {
        name: "게자리",
        latin: "Cancer",
        abbreviation: "Cnc",
        stars: [
            { hip: 42806, ra: 8.7211, dec: 21.4685, mag: 4.02, name: "Acubens" },
            { hip: 43103, ra: 8.7777, dec: 9.1857, mag: 3.52, name: "Altarf" },
            { hip: 42911, ra: 8.7444, dec: 21.4693, mag: 4.66, name: "Asellus Borealis" },
            { hip: 42873, ra: 8.7274, dec: 18.2303, mag: 3.94, name: "Asellus Australis" },
            { hip: 44659, ra: 9.0986, dec: 11.8578, mag: 4.02, name: "Iota Cnc" }
        ],
        connections: [
            [42806, 42911], [42911, 42873], [42873, 43103], [43103, 44659]
        ]
    },

    leo: {
        name: "사자자리",
        latin: "Leo",
        abbreviation: "Leo",
        stars: [
            { hip: 49669, ra: 10.1395, dec: 11.9672, mag: 1.35, name: "Regulus" },
            { hip: 57632, ra: 11.8176, dec: 14.5719, mag: 2.14, name: "Denebola" },
            { hip: 50583, ra: 10.3328, dec: 19.8415, mag: 1.98, name: "Algieba" },
            { hip: 54879, ra: 11.2371, dec: 15.4296, mag: 2.56, name: "Zosma" },
            { hip: 50335, ra: 10.2783, dec: 23.4170, mag: 3.52, name: "Algenubi" },
            { hip: 49583, ra: 10.1229, dec: 16.7626, mag: 3.44, name: "Adhafera" },
            { hip: 47908, ra: 9.7641, dec: 23.7743, mag: 3.88, name: "Rasalas" },
            { hip: 54872, ra: 11.2351, dec: 20.5235, mag: 3.34, name: "Chertan" },
            { hip: 48455, ra: 9.8792, dec: 26.0070, mag: 4.31, name: "Alterf" }
        ],
        connections: [
            // 사자 머리 (낫 모양)
            [47908, 50335], [50335, 50583], [50583, 49583], [49583, 49669],
            // 사자 몸통
            [49669, 54872], [54872, 54879], [54879, 57632],
            [54872, 50583],
            // 머리 위
            [48455, 47908]
        ]
    },

    virgo: {
        name: "처녀자리",
        latin: "Virgo",
        abbreviation: "Vir",
        stars: [
            { hip: 65474, ra: 13.4199, dec: -11.1614, mag: 0.97, name: "Spica" },
            { hip: 61941, ra: 12.6943, dec: -1.4495, mag: 3.37, name: "Zavijava" },
            { hip: 60129, ra: 12.3319, dec: -0.6666, mag: 2.83, name: "Porrima" },
            { hip: 63090, ra: 13.0361, dec: 10.9591, mag: 2.83, name: "Vindemiatrix" },
            { hip: 62985, ra: 12.9268, dec: 3.3975, mag: 3.73, name: "Heze" },
            { hip: 57757, ra: 11.8450, dec: 1.7648, mag: 3.89, name: "Zaniah" },
            { hip: 68520, ra: 14.0270, dec: 1.5447, mag: 3.59, name: "Minelauva" },
            { hip: 72220, ra: 14.7703, dec: -5.9995, mag: 4.18, name: "Syrma" }
        ],
        connections: [
            [57757, 60129], [60129, 61941], [61941, 62985], [62985, 63090],
            [60129, 68520], [68520, 65474],
            [68520, 72220]
        ]
    },

    libra: {
        name: "천칭자리",
        latin: "Libra",
        abbreviation: "Lib",
        stars: [
            { hip: 72622, ra: 14.8479, dec: -16.0418, mag: 2.61, name: "Zubenelgenubi" },
            { hip: 74785, ra: 15.2830, dec: -9.3827, mag: 2.75, name: "Zubeneschamali" },
            { hip: 76333, ra: 15.5922, dec: -14.7891, mag: 3.29, name: "Brachium" },
            { hip: 73616, ra: 15.0607, dec: -25.2819, mag: 3.91, name: "Gamma Lib" },
            { hip: 73184, ra: 14.9309, dec: -16.3060, mag: 4.74, name: "Theta Lib" }
        ],
        connections: [
            [72622, 73184], [73184, 73616],
            [72622, 74785], [74785, 76333]
        ]
    },

    scorpius: {
        name: "전갈자리",
        latin: "Scorpius",
        abbreviation: "Sco",
        stars: [
            { hip: 80763, ra: 16.4903, dec: -26.4319, mag: 0.96, name: "Antares" },
            { hip: 78820, ra: 16.0544, dec: -19.8054, mag: 2.62, name: "Graffias" },
            { hip: 78401, ra: 16.0052, dec: -22.6216, mag: 2.29, name: "Dschubba" },
            { hip: 82396, ra: 16.8362, dec: -34.2925, mag: 2.89, name: "Epsilon Sco" },
            { hip: 86228, ra: 17.5596, dec: -37.1038, mag: 2.70, name: "Girtab" },
            { hip: 87073, ra: 17.7084, dec: -37.1028, mag: 1.63, name: "Shaula" },
            { hip: 86670, ra: 17.6215, dec: -42.9977, mag: 2.41, name: "Lesath" },
            { hip: 84143, ra: 17.2025, dec: -43.2391, mag: 1.87, name: "Sargas" },
            { hip: 82514, ra: 16.8644, dec: -38.0473, mag: 3.00, name: "Mu Sco" },
            { hip: 80112, ra: 16.3590, dec: -28.2157, mag: 2.56, name: "Wei" }
        ],
        connections: [
            [78820, 78401], [78401, 80763],
            [80763, 80112], [80112, 82396], [82396, 82514],
            [82514, 86228], [86228, 87073], [87073, 86670], [86670, 84143]
        ]
    },

    sagittarius: {
        name: "궁수자리",
        latin: "Sagittarius",
        abbreviation: "Sgr",
        stars: [
            { hip: 90185, ra: 18.4029, dec: -34.3846, mag: 1.85, name: "Kaus Australis" },
            { hip: 89642, ra: 18.2936, dec: -29.5791, mag: 2.70, name: "Kaus Media" },
            { hip: 88635, ra: 18.0967, dec: -30.4240, mag: 2.82, name: "Kaus Borealis" },
            { hip: 92855, ra: 18.9210, dec: -26.2967, mag: 2.59, name: "Nunki" },
            { hip: 91971, ra: 18.7628, dec: -26.9907, mag: 3.17, name: "Tau Sgr" },
            { hip: 93506, ra: 19.0448, dec: -29.8801, mag: 2.99, name: "Ascella" },
            { hip: 94141, ra: 19.1628, dec: -27.6703, mag: 3.11, name: "Phi Sgr" },
            { hip: 90496, ra: 18.4663, dec: -25.4217, mag: 2.98, name: "Polis" }
        ],
        connections: [
            // 찻주전자 몸통
            [90185, 89642], [89642, 88635], [88635, 92855], [92855, 91971], [91971, 90185],
            // 주둥이
            [88635, 94141], [94141, 93506],
            // 손잡이
            [92855, 93506],
            // 뚜껑
            [88635, 90496]
        ]
    },

    capricornus: {
        name: "염소자리",
        latin: "Capricornus",
        abbreviation: "Cap",
        stars: [
            { hip: 100064, ra: 20.2947, dec: -12.5088, mag: 3.77, name: "Algedi Prima" },
            { hip: 100345, ra: 20.3502, dec: -14.7813, mag: 3.08, name: "Dabih" },
            { hip: 107556, ra: 21.7840, dec: -16.6619, mag: 2.87, name: "Deneb Algedi" },
            { hip: 106985, ra: 21.6192, dec: -16.8341, mag: 3.74, name: "Nashira" },
            { hip: 102978, ra: 20.8641, dec: -18.1040, mag: 3.68, name: "Theta Cap" },
            { hip: 102485, ra: 20.7681, dec: -25.2706, mag: 4.07, name: "Omega Cap" },
            { hip: 104139, ra: 21.0993, dec: -17.2329, mag: 4.11, name: "Iota Cap" }
        ],
        connections: [
            [100064, 100345], [100345, 102485],
            [100064, 106985], [106985, 107556], [106985, 104139],
            [100345, 102978], [102978, 104139]
        ]
    }
};

// HIP 번호를 인덱스로 매핑하는 헬퍼 함수
function processConstellationData() {
    Object.values(ConstellationData).forEach(constellation => {
        // HIP -> 인덱스 매핑 생성
        const hipToIndex = {};
        constellation.stars.forEach((star, index) => {
            hipToIndex[star.hip] = index;
        });
        
        // connections를 인덱스 기반으로 변환
        constellation.connections = constellation.connections.map(conn => {
            return [hipToIndex[conn[0]], hipToIndex[conn[1]]];
        });
    });
}

// 데이터 처리 실행
processConstellationData();

// 별자리 이름 목록
const ConstellationNames = Object.keys(ConstellationData);
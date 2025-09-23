interface FraminghamData {
  gender: string;
  age: number;
  totalCholesterol: number;
  hdlCholesterol: number;
  systolicBp: number;
  isSmoker: boolean;
  isOnHypertensionTreatment: boolean;
}

const framinghamRiskTables = {
  men: {
    age: {
      20: -9,
      21: -9,
      22: -9,
      23: -9,
      24: -9,
      25: -9,
      26: -9,
      27: -9,
      28: -9,
      29: -9,
      30: -9,
      31: -9,
      32: -9,
      33: -9,
      34: -9,
      35: -4,
      36: -4,
      37: -4,
      38: -4,
      39: -4,
      40: 0,
      41: 0,
      42: 0,
      43: 0,
      44: 0,
      45: 3,
      46: 3,
      47: 3,
      48: 3,
      49: 3,
      50: 6,
      51: 6,
      52: 6,
      53: 6,
      54: 6,
      55: 8,
      56: 8,
      57: 8,
      58: 8,
      59: 8,
      60: 10,
      61: 10,
      62: 10,
      63: 10,
      64: 10,
      65: 11,
      66: 11,
      67: 11,
      68: 11,
      69: 11,
      70: 12,
      71: 12,
      72: 12,
      73: 12,
      74: 12,
      75: 13,
      76: 13,
      77: 13,
      78: 13,
      79: 13,
    },
    totalCholesterol: {
      "<160": 0,
      "160-199": 4,
      "200-239": 7,
      "240-279": 9,
      "≥280": 11,
    },
    hdlCholesterol: {
      "≥60": -1,
      "50-59": 0,
      "40-49": 1,
      "<40": 2,
    },
    systolicBP: {
      untreated: {
        "<120": 0,
        "120-129": 0,
        "130-139": 1,
        "140-159": 1,
        "≥160": 2,
      },
      treated: {
        "<120": 0,
        "120-129": 1,
        "130-139": 2,
        "140-159": 2,
        "≥160": 3,
      },
    },
    smoking: {
      no: 0,
      yes: 4,
    },
  },
  women: {
    age: {
      20: -7,
      21: -7,
      22: -7,
      23: -7,
      24: -7,
      25: -7,
      26: -7,
      27: -7,
      28: -7,
      29: -7,
      30: -7,
      31: -7,
      32: -7,
      33: -7,
      34: -7,
      35: -3,
      36: -3,
      37: -3,
      38: -3,
      39: -3,
      40: 0,
      41: 0,
      42: 0,
      43: 0,
      44: 0,
      45: 3,
      46: 3,
      47: 3,
      48: 3,
      49: 3,
      50: 6,
      51: 6,
      52: 6,
      53: 6,
      54: 6,
      55: 8,
      56: 8,
      57: 8,
      58: 8,
      59: 8,
      60: 10,
      61: 10,
      62: 10,
      63: 10,
      64: 10,
      65: 12,
      66: 12,
      67: 12,
      68: 12,
      69: 12,
      70: 14,
      71: 14,
      72: 14,
      73: 14,
      74: 14,
      75: 16,
      76: 16,
      77: 16,
      78: 16,
      79: 16,
    },
    totalCholesterol: {
      "<160": 0,
      "160-199": 4,
      "200-239": 8,
      "240-279": 11,
      "≥280": 13,
    },
    hdlCholesterol: {
      "≥60": -1,
      "50-59": 0,
      "40-49": 1,
      "<40": 2,
    },
    systolicBP: {
      untreated: {
        "<120": 0,
        "120-129": 1,
        "130-139": 2,
        "140-159": 3,
        "≥160": 4,
      },
      treated: {
        "<120": 0,
        "120-129": 3,
        "130-139": 4,
        "140-159": 5,
        "≥160": 6,
      },
    },
    smoking: {
      no: 0,
      yes: 3,
    },
  },
};

const riskPercentages = {
  men: {
    "-9": "<1",
    "-4": "<1",
    "0": 1,
    "3": 1,
    "6": 2,
    "8": 2,
    "10": 3,
    "11": 4,
    "12": 5,
    "13": 6,
    "14": 8,
    "15": 10,
    "16": 12,
    "17": 16,
    "18": 20,
    "19": 25,
    "20": 30,
    "21": 30,
    "22": 30,
    "23": 30,
    "24": 30,
    "25": 30,
    "26": 30,
    "27": 30,
    "28": 30,
    "29": 30,
  },
  women: {
    "-7": "<1",
    "-3": "<1",
    "0": "<1",
    "3": 1,
    "6": 1,
    "8": 2,
    "10": 3,
    "12": 4,
    "14": 5,
    "15": 6,
    "16": 8,
    "17": 11,
    "18": 14,
    "19": 17,
    "20": 22,
    "21": 27,
    "22": 30,
    "23": 30,
    "24": 30,
    "25": 30,
  },
};

const vascularAgeMap = {
  men: {
    "0": 30,
    "1": 30,
    "2": 35,
    "3": 35,
    "4": 40,
    "5": 45,
    "6": 50,
    "7": 55,
    "8": 60,
    "9": 65,
    "10": 70,
    "11": 70,
    "12": 75,
    "13": 75,
    "14": 80,
    "15": 80,
    "16": 80,
  },
  women: {
    "9": 30,
    "10": 30,
    "11": 30,
    "12": 35,
    "13": 35,
    "14": 40,
    "15": 40,
    "16": 45,
    "17": 50,
    "18": 50,
    "19": 55,
    "20": 60,
    "21": 65,
    "22": 65,
    "23": 70,
    "24": 75,
    "25": 75,
  },
};

export function calculateFraminghamRisk(data: FraminghamData) {
  const genderKey = data.gender === "Laki-laki" ? "men" : "women";
  const genderTables =
    framinghamRiskTables[genderKey as keyof typeof framinghamRiskTables];
  const ageKey = data.age;

  if (!ageKey) return { riskPercentage: "", riskCategory: "", vascularAge: "" };

  let totalPoints = 0;

  // 1. Age
  totalPoints += genderTables.age[ageKey as keyof typeof genderTables.age] || 0;

  // 2. Total Cholesterol
  let cholRange = "";
  if (data.totalCholesterol < 160) cholRange = "<160";
  else if (data.totalCholesterol <= 199) cholRange = "160-199";
  else if (data.totalCholesterol <= 239) cholRange = "200-239";
  else if (data.totalCholesterol <= 279) cholRange = "240-279";
  else cholRange = "≥280";
  totalPoints +=
    genderTables.totalCholesterol[
      cholRange as keyof typeof genderTables.totalCholesterol
    ];

  // 3. HDL Cholesterol
  let hdlRange = "";
  if (data.hdlCholesterol >= 60) hdlRange = "≥60";
  else if (data.hdlCholesterol >= 50) hdlRange = "50-59";
  else if (data.hdlCholesterol >= 40) hdlRange = "40-49";
  else hdlRange = "<40";
  totalPoints +=
    genderTables.hdlCholesterol[
      hdlRange as keyof typeof genderTables.hdlCholesterol
    ];

  // 4. Systolic Blood Pressure
  let bpRange = "";
  if (data.systolicBp < 120) bpRange = "<120";
  else if (data.systolicBp <= 129) bpRange = "120-129";
  else if (data.systolicBp <= 139) bpRange = "130-139";
  else if (data.systolicBp <= 159) bpRange = "140-159";
  else bpRange = "≥160";

  const treatmentStatus = data.isOnHypertensionTreatment
    ? "treated"
    : "untreated";
  totalPoints +=
    genderTables.systolicBP[
      treatmentStatus as keyof typeof genderTables.systolicBP
    ][bpRange as keyof (typeof genderTables.systolicBP)["treated"]];

  // 5. Smoking
  const smokingStatus = data.isSmoker ? "yes" : "no";
  totalPoints +=
    genderTables.smoking[smokingStatus as keyof typeof genderTables.smoking];

  // 6. Calculate Risk Percentage
  let riskPercentage: string | number;
  const genderRiskTable =
    riskPercentages[genderKey as keyof typeof riskPercentages];
  const totalPointsString = String(totalPoints);

  if (genderKey === "men") {
    if (totalPoints < -4) {
      // Men with scores less than -4 get <1%
      riskPercentage = "<1";
    } else if (totalPoints > 29) {
      // Men with scores greater than 29 get >=30%
      riskPercentage = "≥30";
    } else {
      // Find the closest score if it's not a direct key
      const closestKey = Object.keys(genderRiskTable).reduce((prev, curr) => {
        return Math.abs(Number(curr) - totalPoints) <
          Math.abs(Number(prev) - totalPoints)
          ? curr
          : prev;
      });
      riskPercentage =
        genderRiskTable[closestKey as keyof typeof genderRiskTable];
    }
  } else {
    // women
    if (totalPoints < -3) {
      // Women with scores less than -3 get <1%
      riskPercentage = "<1";
    } else if (totalPoints > 24) {
      // Women with scores greater than 24 get >=30%
      riskPercentage = "≥30";
    } else {
      // Find the closest score if it's not a direct key
      const closestKey = Object.keys(genderRiskTable).reduce((prev, curr) => {
        return Math.abs(Number(curr) - totalPoints) <
          Math.abs(Number(prev) - totalPoints)
          ? curr
          : prev;
      });
      riskPercentage =
        genderRiskTable[closestKey as keyof typeof genderRiskTable];
    }
  }

  // 7. Determine Risk Category
  const riskCategory = getRiskCategory(riskPercentage);

  // 8. Determine Vascular Age
  let vascularAge: string | number = data.age;
  const genderVascularMap =
    vascularAgeMap[genderKey as keyof typeof vascularAgeMap];
  const vascularPoints = String(totalPoints);

  // Find the closest score for vascular age
  const closestVascularKey = Object.keys(genderVascularMap).reduce(
    (prev, curr) => {
      return Math.abs(Number(curr) - totalPoints) <
        Math.abs(Number(prev) - totalPoints)
        ? curr
        : prev;
    }
  );
  vascularAge =
    genderVascularMap[closestVascularKey as keyof typeof genderVascularMap];

  return {
    score: totalPoints,
    riskPercentage: String(riskPercentage),
    riskCategory,
    vascularAge: String(vascularAge),
  };
}

function getRiskCategory(riskPercent: string | number) {
  const numericRisk = parseFloat(String(riskPercent).replace(/[<≥]/g, ""));

  if (numericRisk < 10) {
    return "Rendah";
  } else if (numericRisk >= 10 && numericRisk <= 20) {
    return "Sedang";
  } else {
    return "Tinggi";
  }
}

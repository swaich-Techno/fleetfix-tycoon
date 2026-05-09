"use client";

import { useEffect, useMemo, useState } from "react";

const SAVE_KEY = "fleetfix-tycoon-save-v8";

const STARTING_GAME = {
  started: false,
  companyName: "",
  ownerName: "",
  townName: "",
  coins: 500,
  money: 100,
  xp: 0,
  level: 1,
  reputation: 0,
  garageLevel: 1,
  completedJobs: 0,
  totalRevenue: 0,
  townValue: 1200,
  day: 1,
  dayTimer: 60,
  salaryDue: 0,
  technicians: [],
  activeJobs: [],
  dayOffRequests: [],
  ownedBuildings: ["Small Garage", "Parts Store"],
  buildingLevels: {
    "Small Garage": 1,
    "Parts Store": 1,
  },
  parts: {
    Tyre: 8,
    Battery: 6,
    "Engine Oil": 6,
    "Brake Kit": 5,
    "Diagnostic Chip": 4,
    "Tow Hook": 3,
    "Fuel Seal Kit": 0,
    "Hydraulic Hose": 0,
    "ECU Sensor": 0,
    "Air Compressor": 0,
    "Transmission Kit": 0,
  },
};

const SKILLS = [
  "Tyre",
  "Electrical",
  "Engine",
  "Mechanical",
  "Diagnostic",
  "Towing",
];

const TECHNICIAN_NAMES = [
  "Ravi",
  "Aman",
  "Simran",
  "Gurpreet",
  "Iqbal",
  "Karan",
  "Mehak",
  "Arjun",
  "Jaspreet",
  "Kabir",
];

const PARTS = [
  {
    name: "Tyre",
    icon: "🛞",
    cost: 70,
    reorder: 8,
    unlockLevel: 1,
    description: "Basic tyre and puncture jobs.",
  },
  {
    name: "Battery",
    icon: "🔋",
    cost: 110,
    reorder: 6,
    unlockLevel: 1,
    description: "Electrical start and battery jobs.",
  },
  {
    name: "Engine Oil",
    icon: "🛢️",
    cost: 90,
    reorder: 6,
    unlockLevel: 1,
    description: "Engine overheating and service jobs.",
  },
  {
    name: "Brake Kit",
    icon: "🧱",
    cost: 130,
    reorder: 5,
    unlockLevel: 1,
    description: "Brake and mechanical jobs.",
  },
  {
    name: "Diagnostic Chip",
    icon: "💾",
    cost: 160,
    reorder: 4,
    unlockLevel: 5,
    description: "Bus, fleet, and inspection jobs.",
  },
  {
    name: "Tow Hook",
    icon: "🪝",
    cost: 200,
    reorder: 3,
    unlockLevel: 5,
    description: "Towing and roadside rescue jobs.",
  },
  {
    name: "Fuel Seal Kit",
    icon: "⛽",
    cost: 260,
    reorder: 3,
    unlockLevel: 10,
    description: "Fuel leaks and safety jobs.",
  },
  {
    name: "Hydraulic Hose",
    icon: "🔩",
    cost: 340,
    reorder: 2,
    unlockLevel: 10,
    description: "Heavy truck and construction jobs.",
  },
  {
    name: "ECU Sensor",
    icon: "📟",
    cost: 450,
    reorder: 2,
    unlockLevel: 15,
    description: "Advanced diagnostics and electronics.",
  },
  {
    name: "Air Compressor",
    icon: "🌬️",
    cost: 520,
    reorder: 2,
    unlockLevel: 20,
    description: "Trailer, bus, and pneumatic systems.",
  },
  {
    name: "Transmission Kit",
    icon: "⚙️",
    cost: 700,
    reorder: 1,
    unlockLevel: 25,
    description: "Advanced drivetrain and fleet jobs.",
  },
];

const SERVICE_CALLS = [
  {
    id: 1,
    title: "Car Tyre Puncture",
    vehicle: "Small Car",
    problem: "Flat tyre near town road",
    skill: "Tyre",
    partNeeded: "Tyre",
    partQty: 1,
    actualTravelMinutes: 10,
    actualRepairMinutes: 30,
    actualReturnMinutes: 10,
    rewardCoins: 140,
    rewardMoney: 8,
    rewardXp: 40,
    techXp: 45,
    reputation: 1,
    unlockLevel: 1,
    urgency: "Low",
    icon: "🚗",
    mapPoint: "Town Road",
  },
  {
    id: 2,
    title: "Van Battery Dead",
    vehicle: "Delivery Van",
    problem: "Battery not starting near market",
    skill: "Electrical",
    partNeeded: "Battery",
    partQty: 1,
    actualTravelMinutes: 15,
    actualRepairMinutes: 45,
    actualReturnMinutes: 15,
    rewardCoins: 220,
    rewardMoney: 12,
    rewardXp: 60,
    techXp: 70,
    reputation: 2,
    unlockLevel: 1,
    urgency: "Medium",
    icon: "🚐",
    mapPoint: "Market Road",
  },
  {
    id: 3,
    title: "Pickup Engine Heating",
    vehicle: "Pickup Truck",
    problem: "Engine overheating near highway",
    skill: "Engine",
    partNeeded: "Engine Oil",
    partQty: 1,
    actualTravelMinutes: 20,
    actualRepairMinutes: 60,
    actualReturnMinutes: 20,
    rewardCoins: 330,
    rewardMoney: 18,
    rewardXp: 85,
    techXp: 90,
    reputation: 3,
    unlockLevel: 2,
    urgency: "Medium",
    icon: "🛻",
    mapPoint: "Highway",
  },
  {
    id: 4,
    title: "Trailer Brake Issue",
    vehicle: "Trailer",
    problem: "Brake inspection required before delivery",
    skill: "Mechanical",
    partNeeded: "Brake Kit",
    partQty: 1,
    actualTravelMinutes: 25,
    actualRepairMinutes: 90,
    actualReturnMinutes: 25,
    rewardCoins: 470,
    rewardMoney: 25,
    rewardXp: 120,
    techXp: 130,
    reputation: 5,
    unlockLevel: 4,
    urgency: "High",
    icon: "🚛",
    mapPoint: "Transport Yard",
  },
  {
    id: 5,
    title: "Bus Safety Inspection",
    vehicle: "Bus",
    problem: "Passenger bus needs emergency safety check",
    skill: "Diagnostic",
    partNeeded: "Diagnostic Chip",
    partQty: 1,
    actualTravelMinutes: 30,
    actualRepairMinutes: 120,
    actualReturnMinutes: 30,
    rewardCoins: 650,
    rewardMoney: 36,
    rewardXp: 170,
    techXp: 180,
    reputation: 8,
    unlockLevel: 5,
    urgency: "High",
    icon: "🚌",
    mapPoint: "Bus Stand",
  },
  {
    id: 6,
    title: "Broken Trailer Rescue",
    vehicle: "Broken Trailer",
    problem: "Trailer stuck outside city border",
    skill: "Towing",
    partNeeded: "Tow Hook",
    partQty: 1,
    actualTravelMinutes: 45,
    actualRepairMinutes: 180,
    actualReturnMinutes: 45,
    rewardCoins: 1150,
    rewardMoney: 60,
    rewardXp: 300,
    techXp: 310,
    reputation: 18,
    unlockLevel: 7,
    urgency: "Critical",
    icon: "🪝",
    mapPoint: "Outer Road",
  },
  {
    id: 7,
    title: "Truck Fuel Leak",
    vehicle: "Heavy Truck",
    problem: "Fuel leakage detected at transport yard",
    skill: "Mechanical",
    partNeeded: "Fuel Seal Kit",
    partQty: 1,
    actualTravelMinutes: 35,
    actualRepairMinutes: 150,
    actualReturnMinutes: 35,
    rewardCoins: 1250,
    rewardMoney: 72,
    rewardXp: 340,
    techXp: 350,
    reputation: 20,
    unlockLevel: 10,
    urgency: "Critical",
    icon: "🚚",
    mapPoint: "Fuel Yard",
  },
  {
    id: 8,
    title: "Hydraulic Truck Failure",
    vehicle: "Construction Truck",
    problem: "Hydraulic pressure failure at work site",
    skill: "Mechanical",
    partNeeded: "Hydraulic Hose",
    partQty: 1,
    actualTravelMinutes: 40,
    actualRepairMinutes: 200,
    actualReturnMinutes: 40,
    rewardCoins: 1600,
    rewardMoney: 95,
    rewardXp: 450,
    techXp: 460,
    reputation: 28,
    unlockLevel: 12,
    urgency: "Critical",
    icon: "🏗️",
    mapPoint: "Construction Site",
  },
  {
    id: 9,
    title: "Fleet ECU Diagnostic",
    vehicle: "Fleet Van",
    problem: "Advanced sensor and ECU fault",
    skill: "Diagnostic",
    partNeeded: "ECU Sensor",
    partQty: 1,
    actualTravelMinutes: 30,
    actualRepairMinutes: 180,
    actualReturnMinutes: 30,
    rewardCoins: 1800,
    rewardMoney: 120,
    rewardXp: 520,
    techXp: 540,
    reputation: 35,
    unlockLevel: 15,
    urgency: "Contract",
    icon: "📟",
    mapPoint: "Fleet Depot",
  },
  {
    id: 10,
    title: "Bus Air System Repair",
    vehicle: "City Bus",
    problem: "Air pressure and brake compressor issue",
    skill: "Mechanical",
    partNeeded: "Air Compressor",
    partQty: 1,
    actualTravelMinutes: 35,
    actualRepairMinutes: 240,
    actualReturnMinutes: 35,
    rewardCoins: 2300,
    rewardMoney: 150,
    rewardXp: 650,
    techXp: 680,
    reputation: 45,
    unlockLevel: 20,
    urgency: "Contract",
    icon: "🚌",
    mapPoint: "City Bus Depot",
  },
  {
    id: 11,
    title: "Fleet Transmission Repair",
    vehicle: "Heavy Fleet Truck",
    problem: "Transmission system needs urgent replacement",
    skill: "Engine",
    partNeeded: "Transmission Kit",
    partQty: 1,
    actualTravelMinutes: 45,
    actualRepairMinutes: 300,
    actualReturnMinutes: 45,
    rewardCoins: 3200,
    rewardMoney: 220,
    rewardXp: 850,
    techXp: 900,
    reputation: 60,
    unlockLevel: 25,
    urgency: "Contract",
    icon: "🚛",
    mapPoint: "Regional Fleet Hub",
  },
];

const BUILDINGS = [
  {
    name: "Tow Yard",
    cost: 1400,
    unlockLevel: 6,
    icon: "🚚",
    description: "Unlocks advanced rescue and towing jobs.",
  },
  {
    name: "Training Center",
    cost: 2200,
    unlockLevel: 8,
    icon: "🎓",
    description: "Improves technician growth and skill quality.",
  },
  {
    name: "Fuel Station",
    cost: 3000,
    unlockLevel: 10,
    icon: "⛽",
    description: "Raises town value and service capacity.",
  },
  {
    name: "Dispatch Office",
    cost: 4200,
    unlockLevel: 14,
    icon: "📡",
    description: "Prepares your company for multi-city work.",
  },
];

const TABS = [
  { id: "town", label: "Town", icon: "🏙️" },
  { id: "calls", label: "Calls", icon: "🚨" },
  { id: "jobs", label: "Jobs", icon: "⏱️" },
  { id: "team", label: "Team", icon: "👨‍🔧" },
  { id: "parts", label: "Parts", icon: "🏪" },
  { id: "build", label: "Build", icon: "🏗️" },
];

function createId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getGameSeconds(actualMinutes) {
  return Math.max(5, Math.ceil(actualMinutes * 10));
}

function getXpNeeded(level) {
  return level * 180;
}

function getLevelUpMoneyCost(level) {
  return 80 + level * 45;
}

function getTechnicianXpNeeded(level) {
  return level * 120;
}

function getSalaryForLevel(level, isOwner) {
  if (isOwner) return 0;

  const baseSalary = 100;

  if (level <= 5) {
    return baseSalary;
  }

  return Math.round(baseSalary * Math.pow(1.015, level - 5));
}

function getBasicPickupEquipment() {
  return {
    Tyre: 2,
    Battery: 1,
    "Engine Oil": 1,
    "Brake Kit": 1,
    "Diagnostic Chip": 1,
    "Tow Hook": 1,
    "Fuel Seal Kit": 0,
    "Hydraulic Hose": 0,
    "ECU Sensor": 0,
    "Air Compressor": 0,
    "Transmission Kit": 0,
  };
}

function createTechnician(name, isOwner = false) {
  const level = 1;

  return {
    id: createId(),
    name,
    skill: isOwner ? "All-Rounder" : SKILLS[Math.floor(Math.random() * SKILLS.length)],
    level,
    xp: 0,
    energy: 100,
    morale: 100,
    status: "Free",
    currentJobId: null,
    isOwner,
    salary: getSalaryForLevel(level, isOwner),
    daysOffTaken: 0,
    avatar: isOwner ? "👑" : ["👨‍🔧", "👩‍🔧", "🧰", "🔧"][Math.floor(Math.random() * 4)],
    pickupEquipment: getBasicPickupEquipment(),
  };
}

function normalizeTechnician(tech) {
  const level = tech.level || 1;

  return {
    ...tech,
    level,
    xp: tech.xp || 0,
    morale: tech.morale ?? 100,
    salary: getSalaryForLevel(level, tech.isOwner),
    daysOffTaken: tech.daysOffTaken ?? 0,
    avatar: tech.avatar || (tech.isOwner ? "👑" : "👨‍🔧"),
    pickupEquipment: {
      ...getBasicPickupEquipment(),
      ...(tech.pickupEquipment || {}),
    },
  };
}

function getAvailableParts(level) {
  return PARTS.filter((part) => part.unlockLevel <= level);
}

function getLockedParts(level) {
  return PARTS.filter((part) => part.unlockLevel > level);
}

function getRandomServiceCalls(level) {
  const available = SERVICE_CALLS.filter((call) => call.unlockLevel <= level);
  return [...available].sort(() => Math.random() - 0.5).slice(0, 4);
}

function getLockedServiceCalls(level) {
  return SERVICE_CALLS.filter((call) => call.unlockLevel > level).slice(0, 4);
}

function getCompanyRank(rep) {
  if (rep >= 400) return "National Fleet Empire";
  if (rep >= 180) return "Regional Fleet Leader";
  if (rep >= 65) return "Trusted Fleet Partner";
  if (rep >= 18) return "Growing Garage";
  return "Small Town Garage";
}

function getUrgencyStyle(urgency) {
  if (urgency === "Critical") return { background: "#fee2e2", color: "#991b1b" };
  if (urgency === "High") return { background: "#ffedd5", color: "#9a3412" };
  if (urgency === "Medium") return { background: "#fef3c7", color: "#92400e" };
  if (urgency === "Contract") return { background: "#dbeafe", color: "#1d4ed8" };
  return { background: "#dcfce7", color: "#166534" };
}

function getJobPhaseLabel(job) {
  if (job.needsSupport && !job.supportAssigned) return "Paused: extra issue found";
  if (job.needsSupport && job.supportAssigned && job.supportRemaining > 0) {
    return "Backup resolving extra issue";
  }
  if (job.phase === "travel") return "Travelling to job";
  if (job.phase === "repair") return "Repairing vehicle";
  if (job.phase === "return") return "Returning to garage";
  return "Working";
}

function getVehiclePosition(job) {
  const total = job.phaseTotal || 1;
  const done = total - job.phaseRemaining;
  const progress = Math.max(0, Math.min(1, done / total));

  if (job.phase === "travel") return 10 + progress * 55;
  if (job.phase === "repair") return 65;
  if (job.phase === "return") return 65 - progress * 55;

  return 10;
}

function formatEta(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function Home() {
  const [game, setGame] = useState(STARTING_GAME);
  const [setup, setSetup] = useState({
    companyName: "",
    ownerName: "",
    townName: "",
  });
  const [availableCalls, setAvailableCalls] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("town");
  const [renameId, setRenameId] = useState("");
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    const saved =
      localStorage.getItem(SAVE_KEY) ||
      localStorage.getItem("fleetfix-tycoon-save-v7") ||
      localStorage.getItem("fleetfix-tycoon-save-v6") ||
      localStorage.getItem("fleetfix-tycoon-save-v5") ||
      localStorage.getItem("fleetfix-tycoon-save-v4") ||
      localStorage.getItem("fleetfix-tycoon-save-v3") ||
      localStorage.getItem("fleetfix-tycoon-save-v2") ||
      localStorage.getItem("fleetfix-tycoon-save");

    if (saved) {
      const parsed = JSON.parse(saved);
      const safeLevel = parsed.level || 1;

      setGame({
        ...STARTING_GAME,
        ...parsed,
        money: parsed.money ?? 100,
        ownedBuildings: Array.from(
          new Set([...(parsed.ownedBuildings || []), "Small Garage", "Parts Store"])
        ),
        buildingLevels: {
          "Small Garage": 1,
          "Parts Store": 1,
          ...(parsed.buildingLevels || {}),
        },
        parts: {
          ...STARTING_GAME.parts,
          ...(parsed.parts || {}),
        },
        technicians:
          safeLevel < 5
            ? (parsed.technicians || []).map(normalizeTechnician).filter((tech) => tech.isOwner)
            : (parsed.technicians || []).map(normalizeTechnician),
        activeJobs: [],
        dayOffRequests: parsed.dayOffRequests || [],
      });

      if (parsed.started) setAvailableCalls(getRandomServiceCalls(safeLevel));
    }
  }, []);

  useEffect(() => {
    if (game.started) {
      localStorage.setItem(SAVE_KEY, JSON.stringify(game));
    }
  }, [game]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGame((currentGame) => {
        if (!currentGame.started) return currentGame;

        let updated = { ...currentGame };
        let notes = [];

        updated.dayTimer -= 1;

        if (updated.dayTimer <= 0) {
          const totalSalary = updated.technicians.reduce(
            (sum, tech) => sum + (tech.isOwner ? 0 : getSalaryForLevel(tech.level || 1, tech.isOwner)),
            0
          );

          updated.day += 1;
          updated.dayTimer = 60;
          updated.salaryDue += totalSalary;

          updated.technicians = updated.technicians.map((tech) => {
            if (tech.status === "Day Off") {
              return {
                ...tech,
                salary: getSalaryForLevel(tech.level || 1, tech.isOwner),
                status: "Free",
                energy: 100,
                morale: Math.min(100, tech.morale + 14),
              };
            }

            if (!tech.isOwner && updated.salaryDue > 0) {
              return {
                ...tech,
                salary: getSalaryForLevel(tech.level || 1, tech.isOwner),
                morale: Math.max(35, tech.morale - 3),
              };
            }

            return {
              ...tech,
              salary: getSalaryForLevel(tech.level || 1, tech.isOwner),
            };
          });

          notes.push(`Day ${updated.day} started. Salary due increased by ${totalSalary} coins.`);
        }

        if (updated.activeJobs.length > 0) {
          updated.activeJobs = updated.activeJobs
            .map((job) => {
              let nextJob = { ...job };

              const issueChance =
                job.urgency === "Critical" ? 0.035 :
                job.urgency === "High" ? 0.022 :
                0.01;

              if (
                job.phase === "repair" &&
                !job.extraIssueChecked &&
                !job.needsSupport &&
                Math.random() < issueChance
              ) {
                return {
                  ...nextJob,
                  extraIssueChecked: true,
                  needsSupport: true,
                  supportAssigned: false,
                  issueText:
                    job.urgency === "Critical"
                      ? "Major hidden fault discovered. Backup technician required."
                      : "Additional issue found. Backup can speed up resolution.",
                };
              }

              if (job.needsSupport && !job.supportAssigned) {
                return nextJob;
              }

              if (job.needsSupport && job.supportAssigned && job.supportRemaining > 0) {
                return {
                  ...nextJob,
                  supportRemaining: job.supportRemaining - 1,
                };
              }

              if (job.needsSupport && job.supportAssigned && job.supportRemaining <= 0) {
                nextJob.needsSupport = false;
                nextJob.supportResolved = true;
              }

              nextJob.phaseRemaining = nextJob.phaseRemaining - 1;

              if (nextJob.phaseRemaining <= 0) {
                if (nextJob.phase === "travel") {
                  nextJob.phase = "repair";
                  nextJob.phaseRemaining = nextJob.repairTimeFinal;
                  nextJob.phaseTotal = nextJob.repairTimeFinal;

                  updated.technicians = updated.technicians.map((tech) =>
                    tech.id === nextJob.technicianId
                      ? { ...tech, status: "Repairing" }
                      : tech
                  );
                } else if (nextJob.phase === "repair") {
                  nextJob.phase = "return";
                  nextJob.phaseRemaining = nextJob.returnTime;
                  nextJob.phaseTotal = nextJob.returnTime;

                  updated.technicians = updated.technicians.map((tech) =>
                    tech.id === nextJob.technicianId
                      ? { ...tech, status: "Returning" }
                      : tech
                  );
                } else if (nextJob.phase === "return") {
                  nextJob.completed = true;
                }
              }

              return nextJob;
            })
            .filter((job) => {
              if (!job.completed) return true;

              const technician = updated.technicians.find(
                (tech) => tech.id === job.technicianId
              );

              const supportTech = updated.technicians.find(
                (tech) => tech.id === job.supportTechnicianId
              );

              updated.coins += job.rewardCoins;
              updated.money += job.rewardMoney;
              updated.xp += job.rewardXp;
              updated.reputation += job.reputation;
              updated.completedJobs += 1;
              updated.totalRevenue += job.rewardCoins;
              updated.townValue += Math.floor(job.rewardCoins * 0.12);

              updated.technicians = updated.technicians.map((tech) => {
                if (tech.id === job.technicianId) {
                  const newEnergy = Math.max(0, tech.energy - 14);
                  let newLevel = tech.level || 1;
                  let newXp = (tech.xp || 0) + job.techXp;

                  while (newXp >= getTechnicianXpNeeded(newLevel)) {
                    newXp -= getTechnicianXpNeeded(newLevel);
                    newLevel += 1;
                  }

                  if (
                    newEnergy <= 35 &&
                    !tech.isOwner &&
                    !updated.dayOffRequests.some((req) => req.technicianId === tech.id)
                  ) {
                    updated.dayOffRequests = [
                      ...updated.dayOffRequests,
                      {
                        id: createId(),
                        technicianId: tech.id,
                        technicianName: tech.name,
                        reason: "Low energy after repeated repair work.",
                      },
                    ];
                  }

                  return {
                    ...tech,
                    status: "Free",
                    currentJobId: null,
                    energy: newEnergy,
                    morale: Math.max(45, tech.morale - 2),
                    xp: newXp,
                    level: newLevel,
                    salary: getSalaryForLevel(newLevel, tech.isOwner),
                  };
                }

                if (tech.id === job.supportTechnicianId) {
                  const supportXp = 35;
                  let newLevel = tech.level || 1;
                  let newXp = (tech.xp || 0) + supportXp;

                  while (newXp >= getTechnicianXpNeeded(newLevel)) {
                    newXp -= getTechnicianXpNeeded(newLevel);
                    newLevel += 1;
                  }

                  return {
                    ...tech,
                    status: "Free",
                    currentJobId: null,
                    energy: Math.max(0, tech.energy - 6),
                    morale: Math.max(45, tech.morale - 1),
                    xp: newXp,
                    level: newLevel,
                    salary: getSalaryForLevel(newLevel, tech.isOwner),
                  };
                }

                return tech;
              });

              notes.push(
                `${technician?.name || "Technician"} returned from ${job.title}. Earned ${job.rewardCoins} coins, ${job.rewardMoney} money, ${job.rewardXp} company XP, and ${job.techXp} technician XP.`
              );

              if (supportTech) {
                notes.push(`${supportTech.name} helped with the extra issue and earned support XP.`);
              }

              return false;
            });
        }

        if (notes.length > 0) {
          setMessage(notes.join(" "));
          setAvailableCalls(getRandomServiceCalls(updated.level));
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const freeTechnicians = useMemo(() => {
    return game.technicians.filter((tech) => tech.status === "Free" && tech.energy > 0);
  }, [game.technicians]);

  const totalDailySalary = useMemo(() => {
    return game.technicians.reduce(
      (sum, tech) => sum + (tech.isOwner ? 0 : getSalaryForLevel(tech.level || 1, tech.isOwner)),
      0
    );
  }, [game.technicians]);

  const companyRank = getCompanyRank(game.reputation);
  const lockedCalls = getLockedServiceCalls(game.level);
  const availableParts = getAvailableParts(game.level);
  const lockedParts = getLockedParts(game.level);
  const levelUpReady = game.xp >= getXpNeeded(game.level);
  const levelUpCost = getLevelUpMoneyCost(game.level);

  function startGame() {
    if (!setup.companyName.trim() || !setup.ownerName.trim() || !setup.townName.trim()) {
      setMessage("Please fill company name, owner name, and town name.");
      return;
    }

    const owner = createTechnician(setup.ownerName.trim(), true);

    const newGame = {
      ...STARTING_GAME,
      started: true,
      companyName: setup.companyName.trim(),
      ownerName: setup.ownerName.trim(),
      townName: setup.townName.trim(),
      technicians: [owner],
    };

    setGame(newGame);
    setAvailableCalls(getRandomServiceCalls(1));
    setMessage(
      `Welcome to ${setup.companyName}. You are the owner-technician. Hire your first technician after Company Level 5.`
    );
  }

  function levelUpCompany() {
    if (!levelUpReady) {
      setMessage(`You need ${getXpNeeded(game.level) - game.xp} more Company XP to level up.`);
      return;
    }

    if (game.money < levelUpCost) {
      setMessage(`You need ${levelUpCost} money to complete company level approval.`);
      return;
    }

    const newLevel = game.level + 1;

    setGame((current) => ({
      ...current,
      level: newLevel,
      xp: current.xp - getXpNeeded(current.level),
      money: current.money - levelUpCost,
      coins: current.coins + 120,
    }));

    setAvailableCalls(getRandomServiceCalls(newLevel));
    setMessage(
      `Company upgraded to Level ${newLevel}. New jobs, parts, or buildings may now be available.`
    );
  }

  function ensurePickupEquipment(tech, call) {
    const pickupStock = tech.pickupEquipment?.[call.partNeeded] || 0;

    if (pickupStock >= call.partQty) {
      return {
        ok: true,
        updatedParts: { ...game.parts },
        loadedMessage: "Pickup equipment used.",
      };
    }

    const missing = call.partQty - pickupStock;
    const shopStock = game.parts[call.partNeeded] || 0;

    if (shopStock < missing) {
      return {
        ok: false,
        updatedParts: { ...game.parts },
        loadedMessage: `Not enough ${call.partNeeded} in Parts Store or pickup.`,
      };
    }

    return {
      ok: true,
      updatedParts: {
        ...game.parts,
        [call.partNeeded]: shopStock - missing,
      },
      loadedMessage: `Loaded ${missing} ${call.partNeeded} from Parts Store into pickup.`,
    };
  }

  function dispatchTechnician(call, technicianId) {
    const tech = game.technicians.find((item) => item.id === technicianId);
    if (!tech) return;

    const equipmentCheck = ensurePickupEquipment(tech, call);

    if (!equipmentCheck.ok) {
      setMessage(equipmentCheck.loadedMessage);
      setActiveTab("parts");
      return;
    }

    const skillMatch = tech.skill === call.skill || tech.skill === "All-Rounder";
    const moraleBonus = tech.morale >= 80 ? 0.9 : 1;

    const travelTime = getGameSeconds(call.actualTravelMinutes);
    const repairTimeBase = getGameSeconds(call.actualRepairMinutes);
    const returnTime = getGameSeconds(call.actualReturnMinutes);

    const repairTimeFinal = skillMatch
      ? Math.max(8, Math.floor(repairTimeBase * 0.7 * moraleBonus))
      : Math.max(8, Math.floor(repairTimeBase * moraleBonus));

    const activeJob = {
      ...call,
      jobId: createId(),
      technicianId: tech.id,
      technicianName: tech.name,
      phase: "travel",
      phaseRemaining: travelTime,
      phaseTotal: travelTime,
      travelTime,
      repairTimeFinal,
      returnTime,
      skillMatch,
      extraIssueChecked: false,
      needsSupport: false,
      supportAssigned: false,
      supportRemaining: 0,
    };

    setGame((current) => ({
      ...current,
      parts: equipmentCheck.updatedParts,
      activeJobs: [...current.activeJobs, activeJob],
      technicians: current.technicians.map((item) => {
        if (item.id !== tech.id) return item;

        const currentPickupStock = item.pickupEquipment?.[call.partNeeded] || 0;
        const updatedPickupStock =
          currentPickupStock >= call.partQty
            ? currentPickupStock - call.partQty
            : 0;

        return {
          ...item,
          status: "Travelling",
          currentJobId: activeJob.jobId,
          pickupEquipment: {
            ...item.pickupEquipment,
            [call.partNeeded]: updatedPickupStock,
          },
        };
      }),
    }));

    setAvailableCalls((calls) => calls.filter((item) => item.id !== call.id));
    setActiveTab("jobs");
    setMessage(
      `${tech.name} is travelling to ${call.mapPoint}. ETA ${formatEta(travelTime)}. ${equipmentCheck.loadedMessage}`
    );
  }

  function sendBackup(jobId, technicianId) {
    const backupTech = game.technicians.find((tech) => tech.id === technicianId);
    const job = game.activeJobs.find((item) => item.jobId === jobId);

    if (!backupTech || !job) return;

    if (backupTech.id === job.technicianId) {
      setMessage("Main technician is already working on this job.");
      return;
    }

    const supportTime = job.urgency === "Critical" ? 90 : 45;

    setGame((current) => ({
      ...current,
      activeJobs: current.activeJobs.map((item) =>
        item.jobId === jobId
          ? {
              ...item,
              supportAssigned: true,
              supportTechnicianId: backupTech.id,
              supportTechnicianName: backupTech.name,
              supportRemaining: supportTime,
            }
          : item
      ),
      technicians: current.technicians.map((tech) =>
        tech.id === backupTech.id
          ? {
              ...tech,
              status: "Supporting",
              currentJobId: jobId,
            }
          : tech
      ),
    }));

    setMessage(`${backupTech.name} is going as backup. Extra issue ETA: ${formatEta(supportTime)}.`);
  }

  function refreshCalls() {
    setAvailableCalls(getRandomServiceCalls(game.level));
    setMessage("New service calls received.");
  }

  function buyPart(part, qty) {
    if (game.level < part.unlockLevel) {
      setMessage(`${part.name} unlocks at Company Level ${part.unlockLevel}.`);
      return;
    }

    const cost = part.cost * qty;

    if (game.coins < cost) {
      setMessage(`You need ${cost} coins to buy ${qty} ${part.name}.`);
      return;
    }

    setGame((current) => ({
      ...current,
      coins: current.coins - cost,
      parts: {
        ...current.parts,
        [part.name]: (current.parts[part.name] || 0) + qty,
      },
    }));

    setMessage(`Parts Store purchased ${qty} ${part.name} for ${cost} coins.`);
  }

  function autoRestock() {
    let totalCost = 0;
    const newParts = { ...game.parts };

    availableParts.forEach((part) => {
      const stock = newParts[part.name] || 0;
      if (stock < part.reorder) {
        const qty = part.reorder - stock;
        totalCost += qty * part.cost;
        newParts[part.name] = part.reorder;
      }
    });

    if (totalCost === 0) {
      setMessage("All unlocked parts are already above reorder level.");
      return;
    }

    if (game.coins < totalCost) {
      setMessage(`Auto restock needs ${totalCost} coins.`);
      return;
    }

    setGame((current) => ({
      ...current,
      coins: current.coins - totalCost,
      parts: newParts,
    }));

    setMessage(`Parts Store auto-restocked unlocked low parts for ${totalCost} coins.`);
  }

  function loadPickupEquipment(technicianId) {
    const tech = game.technicians.find((item) => item.id === technicianId);
    if (!tech) return;

    const newParts = { ...game.parts };
    const targetEquipment = getBasicPickupEquipment();
    const newEquipment = { ...(tech.pickupEquipment || {}) };

    availableParts.forEach((part) => {
      const target = targetEquipment[part.name] || 0;
      const current = newEquipment[part.name] || 0;

      if (current < target) {
        const needed = target - current;
        const available = newParts[part.name] || 0;
        const loading = Math.min(needed, available);

        if (loading > 0) {
          newParts[part.name] -= loading;
          newEquipment[part.name] = current + loading;
        }
      }
    });

    setGame((current) => ({
      ...current,
      parts: newParts,
      technicians: current.technicians.map((item) =>
        item.id === technicianId
          ? {
              ...item,
              pickupEquipment: newEquipment,
            }
          : item
      ),
    }));

    setMessage(`${tech.name}'s pickup equipment was loaded from the Parts Store.`);
  }

  function hireTechnician() {
    if (game.level < 5) {
      setMessage("First additional technician unlocks at Company Level 5.");
      return;
    }

    const cost = 700 + game.technicians.length * 350;

    if (game.coins < cost) {
      setMessage(`You need ${cost} coins to hire a technician.`);
      return;
    }

    const name = TECHNICIAN_NAMES[Math.floor(Math.random() * TECHNICIAN_NAMES.length)];
    const newTech = createTechnician(name);

    setGame((current) => ({
      ...current,
      coins: current.coins - cost,
      technicians: [...current.technicians, newTech],
    }));

    setMessage(`${newTech.name} joined as ${newTech.skill} technician. Salary: 100 coins/day.`);
  }

  function paySalaries() {
    if (game.salaryDue <= 0) {
      setMessage("No salary is due right now.");
      return;
    }

    if (game.coins < game.salaryDue) {
      setMessage(`You need ${game.salaryDue} coins to pay salaries.`);
      return;
    }

    setGame((current) => ({
      ...current,
      coins: current.coins - current.salaryDue,
      salaryDue: 0,
      technicians: current.technicians.map((tech) => ({
        ...tech,
        salary: getSalaryForLevel(tech.level || 1, tech.isOwner),
        morale: Math.min(100, tech.morale + 15),
      })),
    }));

    setMessage("Salaries paid. Technician morale improved.");
  }

  function approveDayOff(requestId) {
    const request = game.dayOffRequests.find((item) => item.id === requestId);
    if (!request) return;

    setGame((current) => ({
      ...current,
      dayOffRequests: current.dayOffRequests.filter((item) => item.id !== requestId),
      technicians: current.technicians.map((tech) =>
        tech.id === request.technicianId
          ? {
              ...tech,
              status: "Day Off",
              energy: 100,
              morale: Math.min(100, tech.morale + 18),
              daysOffTaken: tech.daysOffTaken + 1,
            }
          : tech
      ),
    }));

    setMessage(`${request.technicianName} is on day off.`);
  }

  function denyDayOff(requestId) {
    const request = game.dayOffRequests.find((item) => item.id === requestId);
    if (!request) return;

    setGame((current) => ({
      ...current,
      dayOffRequests: current.dayOffRequests.filter((item) => item.id !== requestId),
      technicians: current.technicians.map((tech) =>
        tech.id === request.technicianId
          ? { ...tech, morale: Math.max(20, tech.morale - 12) }
          : tech
      ),
    }));

    setMessage(`${request.technicianName}'s day off was denied. Morale decreased.`);
  }

  function restTechnicians() {
    setGame((current) => ({
      ...current,
      technicians: current.technicians.map((tech) =>
        tech.status === "Free"
          ? {
              ...tech,
              energy: 100,
              morale: Math.min(100, tech.morale + 5),
            }
          : tech
      ),
    }));

    setMessage("Free technicians rested.");
  }

  function upgradeGarage() {
    const cost = game.garageLevel * 1000;

    if (game.coins < cost) {
      setMessage(`You need ${cost} coins to upgrade garage.`);
      return;
    }

    setGame((current) => ({
      ...current,
      coins: current.coins - cost,
      garageLevel: current.garageLevel + 1,
      townValue: current.townValue + 500,
      buildingLevels: {
        ...current.buildingLevels,
        "Small Garage": current.garageLevel + 1,
      },
    }));

    setMessage(`Garage upgraded to Level ${game.garageLevel + 1}.`);
  }

  function buyBuilding(building) {
    if (game.level < building.unlockLevel) {
      setMessage(`${building.name} unlocks at Company Level ${building.unlockLevel}.`);
      return;
    }

    if (game.ownedBuildings.includes(building.name)) {
      setMessage(`You already own ${building.name}.`);
      return;
    }

    if (game.coins < building.cost) {
      setMessage(`You need ${building.cost} coins to build ${building.name}.`);
      return;
    }

    setGame((current) => ({
      ...current,
      coins: current.coins - building.cost,
      ownedBuildings: [...current.ownedBuildings, building.name],
      buildingLevels: {
        ...current.buildingLevels,
        [building.name]: 1,
      },
      townValue: current.townValue + building.cost,
    }));

    setMessage(`${building.name} built.`);
  }

  function startRename(tech) {
    setRenameId(tech.id);
    setRenameValue(tech.name);
  }

  function saveRename() {
    if (!renameValue.trim()) {
      setMessage("Name cannot be empty.");
      return;
    }

    setGame((current) => ({
      ...current,
      technicians: current.technicians.map((tech) =>
        tech.id === renameId ? { ...tech, name: renameValue.trim() } : tech
      ),
    }));

    setRenameId("");
    setRenameValue("");
    setMessage("Technician renamed.");
  }

  function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem("fleetfix-tycoon-save-v7");
    localStorage.removeItem("fleetfix-tycoon-save-v6");
    localStorage.removeItem("fleetfix-tycoon-save-v5");
    localStorage.removeItem("fleetfix-tycoon-save-v4");
    localStorage.removeItem("fleetfix-tycoon-save-v3");
    localStorage.removeItem("fleetfix-tycoon-save-v2");
    localStorage.removeItem("fleetfix-tycoon-save");

    setGame(STARTING_GAME);
    setSetup({
      companyName: "",
      ownerName: "",
      townName: "",
    });
    setAvailableCalls([]);
    setActiveTab("town");
    setMessage("Game reset.");
  }

  if (!game.started) {
    return (
      <main style={styles.startPage}>
        <section style={styles.startCard}>
          <div style={styles.logo}>🛠️🚛</div>
          <h1 style={styles.title}>FleetFix Tycoon</h1>
          <p style={styles.subtitle}>
            Start alone as the owner-technician. Complete jobs, earn coins and money,
            unlock new parts, and grow your fleet service empire.
          </p>

          <div style={styles.formGrid}>
            <InputBox
              label="Company Name"
              placeholder="MFS Fleet Repairs"
              value={setup.companyName}
              onChange={(value) => setSetup({ ...setup, companyName: value })}
            />
            <InputBox
              label="Owner Name"
              placeholder="Harkirat"
              value={setup.ownerName}
              onChange={(value) => setSetup({ ...setup, ownerName: value })}
            />
            <InputBox
              label="Town Name"
              placeholder="Punjab"
              value={setup.townName}
              onChange={(value) => setSetup({ ...setup, townName: value })}
            />
          </div>

          {message && <div style={styles.message}>📢 {message}</div>}

          <button style={styles.mainButton} onClick={startGame}>
            Start Repair Empire
          </button>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.gamePage}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>🛠️ {game.companyName}</h1>
          <p style={styles.smallText}>
            Owner: {game.ownerName} • Town: {game.townName}
          </p>
          <p style={styles.rankText}>🏆 {companyRank}</p>
        </div>

        <div style={styles.statsGrid}>
          <Stat label="Coins" value={`🪙 ${game.coins}`} />
          <Stat label="Money" value={`💵 ${game.money}`} />
          <Stat label="Company XP" value={`${game.xp}/${getXpNeeded(game.level)}`} />
          <Stat label="Company Level" value={game.level} />
          <Stat label="Rep" value={`⭐ ${game.reputation}`} />
          <Stat label="Day" value={`${game.day} / ${game.dayTimer}s`} />
          <Stat label="Salary Due" value={`🧾 ${game.salaryDue}`} />
        </div>
      </header>

      <section style={styles.navBar}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            style={activeTab === tab.id ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </section>

      <section style={styles.content}>
        {message && <div style={styles.message}>📢 {message}</div>}

        {levelUpReady && (
          <div style={styles.levelUpBox}>
            <div>
              <b>Company Level-Up Ready</b>
              <p style={styles.smallText}>
                Spend 💵 {levelUpCost} money to upgrade from Level {game.level} to Level {game.level + 1}.
              </p>
            </div>
            <button style={styles.greenSmallButton} onClick={levelUpCompany}>
              Level Up Company
            </button>
          </div>
        )}

        {activeTab === "town" && (
          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🏙️ {game.townName} Service Town</h2>
                <p style={styles.smallText}>
                  Coins run operations. Money grows your company level and unlocks advanced work.
                </p>
              </div>
              <button style={styles.dangerButton} onClick={resetGame}>
                Reset
              </button>
            </div>

            <div style={styles.empireStats}>
              <MiniStat title="Company Rank" value={companyRank} />
              <MiniStat title="Town Value" value={`🏙️ ${game.townValue}`} />
              <MiniStat title="Daily Salary" value={`🧾 ${totalDailySalary}`} />
              <MiniStat title="Next Hire" value={game.level >= 5 ? "Unlocked" : "Level 5"} />
            </div>

            <div style={styles.unlockBox}>
              <b>Unlock System:</b>
              <p>Level 1: Owner works alone, basic parts and jobs</p>
              <p>Level 5: First technician, Diagnostic Chip, Tow Hook</p>
              <p>Level 10: Fuel Seal Kit, Hydraulic Hose, Fuel Station</p>
              <p>Level 15: ECU Sensor and advanced fleet diagnostics</p>
              <p>Level 20: Air Compressor and city bus jobs</p>
              <p>Level 25: Transmission Kit and regional fleet jobs</p>
            </div>

            <div style={styles.gameMap}>
              <div style={styles.skyGlow} />

              <Building style={styles.garageBuilding} icon="🏚️" title={`Garage Lvl ${game.garageLevel}`} />
              <Building style={styles.partsBuilding} icon="🏪" title="Parts Store" />
              <Building style={styles.roadsideBuilding} icon="🚨" title="Call Center" />
              <Building style={styles.yardBuilding} icon="🅿️" title="Service Yard" />
              <Building style={styles.emptyBuilding} icon="🌵" title="Expansion Land" />

              <div style={styles.roadMain} />
              <div style={styles.roadLineOne} />
              <div style={styles.roadLineTwo} />
              <div style={styles.roadLineThree} />

              {game.activeJobs.map((job, index) => (
                <div
                  key={job.jobId}
                  style={{
                    ...styles.movingVehicle,
                    left: `${getVehiclePosition(job)}%`,
                    top: `${58 + index * 7}%`,
                  }}
                >
                  <PickupTruck />
                  <div style={styles.vehicleLabel}>{job.technicianName}</div>
                </div>
              ))}

              {game.activeJobs.length === 0 && (
                <div style={styles.mapHint}>
                  Dispatch a technician to see the red-white service pickup moving.
                </div>
              )}
            </div>
          </Panel>
        )}

        {activeTab === "calls" && (
          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🚨 Service Calls</h2>
                <p style={styles.smallText}>
                  Jobs unlock with company level and require matching parts.
                </p>
              </div>

              <button style={styles.darkButton} onClick={refreshCalls}>
                Refresh Calls
              </button>
            </div>

            <div style={styles.cardsGrid}>
              {availableCalls.map((call) => {
                const travel = getGameSeconds(call.actualTravelMinutes);
                const repair = getGameSeconds(call.actualRepairMinutes);
                const back = getGameSeconds(call.actualReturnMinutes);

                return (
                  <div key={call.id} style={styles.callCard}>
                    <div style={styles.callTop}>
                      <div style={styles.cardIcon}>{call.icon}</div>
                      <span style={{ ...styles.urgencyBadge, ...getUrgencyStyle(call.urgency) }}>
                        {call.urgency}
                      </span>
                    </div>

                    <h3 style={styles.cardTitle}>{call.title}</h3>
                    <p style={styles.smallText}>{call.problem}</p>

                    <div style={styles.infoList}>
                      <p><b>Unlock Level:</b> {call.unlockLevel}</p>
                      <p><b>Location:</b> {call.mapPoint}</p>
                      <p><b>Skill:</b> {call.skill}</p>
                      <p><b>Parts:</b> {call.partQty} {call.partNeeded}</p>
                      <p>
                        <b>Game ETA:</b> Go {formatEta(travel)} • Repair {formatEta(repair)} • Return {formatEta(back)}
                      </p>
                      <p><b>Reward:</b> 🪙 {call.rewardCoins} • 💵 {call.rewardMoney} • Company XP {call.rewardXp}</p>
                    </div>

                    <div style={styles.buttonStack}>
                      {freeTechnicians.length === 0 ? (
                        <div style={styles.warningBox}>No free technicians.</div>
                      ) : (
                        freeTechnicians.map((tech) => {
                          const match = tech.skill === call.skill || tech.skill === "All-Rounder";
                          return (
                            <button
                              key={tech.id}
                              style={match ? styles.greenSmallButton : styles.orangeSmallButton}
                              onClick={() => dispatchTechnician(call, tech.id)}
                            >
                              Send {tech.name} {match ? "⚡" : ""}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {lockedCalls.length > 0 && (
              <>
                <h3 style={styles.subTitle}>🔒 Locked Future Jobs</h3>
                <div style={styles.cardsGrid}>
                  {lockedCalls.map((call) => (
                    <div key={call.id} style={styles.lockedCallCard}>
                      <div style={styles.cardIcon}>🔒</div>
                      <h3 style={styles.cardTitle}>{call.title}</h3>
                      <p style={styles.smallText}>Requires {call.partNeeded}</p>
                      <p style={styles.smallText}>Unlocks at Company Level {call.unlockLevel}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Panel>
        )}

        {activeTab === "jobs" && (
          <Panel>
            <h2 style={styles.sectionTitle}>⏱️ Active Jobs with ETA</h2>
            <p style={styles.smallText}>
              Jobs include travel, repair, return, and possible extra issues.
            </p>

            <div style={styles.cardsGrid}>
              {game.activeJobs.length === 0 ? (
                <EmptyBox text="No active jobs. Dispatch a technician from service calls." />
              ) : (
                game.activeJobs.map((job) => {
                  const progress =
                    ((job.phaseTotal - job.phaseRemaining) / job.phaseTotal) * 100;

                  const backupOptions = freeTechnicians.filter(
                    (tech) => tech.id !== job.technicianId
                  );

                  return (
                    <div key={job.jobId} style={job.needsSupport ? styles.issueJobCard : styles.jobCard}>
                      <div style={styles.jobTop}>
                        <div>
                          <h3 style={styles.cardTitle}>{job.icon} {job.title}</h3>
                          <p style={styles.smallText}>Technician: {job.technicianName}</p>
                          <p style={styles.smallText}>Location: {job.mapPoint}</p>
                          <p style={styles.phaseText}>{getJobPhaseLabel(job)}</p>
                          {job.skillMatch && <p style={styles.bonusText}>⚡ Skill match bonus</p>}
                          {job.needsSupport && (
                            <div style={styles.warningBox}>
                              {job.issueText}
                            </div>
                          )}
                          {job.supportAssigned && (
                            <p style={styles.bonusText}>
                              Backup: {job.supportTechnicianName} • Extra ETA {formatEta(job.supportRemaining)}
                            </p>
                          )}
                        </div>

                        <span style={styles.timerBadge}>
                          {job.needsSupport && !job.supportAssigned
                            ? "Paused"
                            : formatEta(job.phaseRemaining)}
                        </span>
                      </div>

                      <div style={styles.progressOuter}>
                        <div style={{ ...styles.progressInner, width: `${progress}%` }} />
                      </div>

                      {job.needsSupport && !job.supportAssigned && (
                        <div style={styles.buttonStack}>
                          {backupOptions.length === 0 ? (
                            <div style={styles.warningBox}>No free backup technician available.</div>
                          ) : (
                            backupOptions.map((tech) => (
                              <button
                                key={tech.id}
                                style={styles.greenSmallButton}
                                onClick={() => sendBackup(job.jobId, tech.id)}
                              >
                                Send {tech.name} as Backup
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Panel>
        )}

        {activeTab === "team" && (
          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>👨‍🔧 Technician Team</h2>
                <p style={styles.smallText}>
                  Owner has no salary. First additional technician unlocks at Company Level 5.
                </p>
              </div>

              <button style={styles.mainButtonSmall} onClick={paySalaries}>
                Pay Salaries — 🧾 {game.salaryDue}
              </button>
            </div>

            {game.dayOffRequests.length > 0 && (
              <div style={styles.dayOffBox}>
                <h3 style={styles.cardTitle}>🌴 Day Off Requests</h3>

                {game.dayOffRequests.map((request) => (
                  <div key={request.id} style={styles.requestRow}>
                    <div>
                      <b>{request.technicianName}</b>
                      <p style={styles.smallText}>{request.reason}</p>
                    </div>

                    <div style={styles.requestButtons}>
                      <button style={styles.greenSmallButton} onClick={() => approveDayOff(request.id)}>
                        Approve
                      </button>
                      <button style={styles.dangerSmallButton} onClick={() => denyDayOff(request.id)}>
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.cardsGrid}>
              {game.technicians.map((tech) => (
                <div key={tech.id} style={styles.techCard}>
                  <div style={styles.techAvatar}>{tech.avatar}</div>

                  <div style={styles.jobTop}>
                    <h3 style={styles.cardTitle}>
                      {tech.isOwner ? "👑" : "🔧"} {tech.name}
                    </h3>

                    <span style={styles.statusBadge}>{tech.status}</span>
                  </div>

                  <p style={styles.smallText}>Skill: {tech.skill}</p>
                  <p style={styles.smallText}>
                    Tech Level: {tech.level} • XP {tech.xp || 0}/{getTechnicianXpNeeded(tech.level || 1)}
                  </p>
                  <p style={styles.smallText}>
                    Salary/day: 🧾 {getSalaryForLevel(tech.level || 1, tech.isOwner)}
                    {tech.isOwner ? " (Owner)" : ""}
                  </p>
                  <p style={styles.smallText}>Days off: {tech.daysOffTaken}</p>

                  <Bar label="Energy" value={tech.energy} color="#16a34a" />
                  <Bar label="Morale" value={tech.morale} color="#2563eb" />

                  <div style={styles.pickupBox}>
                    <b>Pickup Equipment</b>
                    {availableParts.map((part) => (
                      <span key={part.name}>
                        {part.icon} {part.name}: {tech.pickupEquipment?.[part.name] || 0}
                      </span>
                    ))}
                    <button style={styles.lightSmallButton} onClick={() => loadPickupEquipment(tech.id)}>
                      Load Pickup from Parts Store
                    </button>
                  </div>

                  {renameId === tech.id ? (
                    <div style={styles.renameBox}>
                      <input
                        style={styles.input}
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                      />
                      <button style={styles.greenSmallButton} onClick={saveRename}>
                        Save
                      </button>
                    </div>
                  ) : (
                    <button style={styles.lightSmallButton} onClick={() => startRename(tech)}>
                      Rename
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={styles.actionRow}>
              <button style={game.level >= 5 ? styles.darkFullButton : styles.lockedFullButton} onClick={hireTechnician}>
                {game.level >= 5
                  ? `Hire Technician — 🪙 ${700 + game.technicians.length * 350}`
                  : "Hire Technician Locked Until Company Level 5"}
              </button>

              <button style={styles.lightFullButton} onClick={restTechnicians}>
                Rest Free Technicians
              </button>
            </div>
          </Panel>
        )}

        {activeTab === "parts" && (
          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🏪 Parts Store Management</h2>
                <p style={styles.smallText}>
                  New parts unlock every 5 company levels. Advanced jobs require advanced parts.
                </p>
              </div>

              <button style={styles.mainButtonSmall} onClick={autoRestock}>
                Auto Restock Unlocked Parts
              </button>
            </div>

            <div style={styles.cardsGrid}>
              {availableParts.map((part) => {
                const stock = game.parts[part.name] || 0;
                const low = stock < part.reorder;

                return (
                  <div key={part.name} style={low ? styles.lowPartCard : styles.partCard}>
                    <div style={styles.partIcon}>{part.icon}</div>
                    <h3 style={styles.cardTitle}>{part.name}</h3>
                    <p style={styles.smallText}>{part.description}</p>
                    <p style={styles.smallText}>Store Stock: <b>{stock}</b></p>
                    <p style={styles.smallText}>Reorder Level: {part.reorder}</p>
                    <p style={styles.smallText}>Cost: 🪙 {part.cost} each</p>

                    {low && <div style={styles.warningBox}>Low stock</div>}

                    <div style={styles.partButtons}>
                      <button style={styles.orangeSmallButton} onClick={() => buyPart(part, 1)}>
                        Buy 1
                      </button>
                      <button style={styles.darkButton} onClick={() => buyPart(part, 5)}>
                        Buy 5
                      </button>
                      <button style={styles.greenSmallButton} onClick={() => buyPart(part, 10)}>
                        Buy 10
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {lockedParts.length > 0 && (
              <>
                <h3 style={styles.subTitle}>🔒 Locked Future Parts</h3>
                <div style={styles.cardsGrid}>
                  {lockedParts.map((part) => (
                    <div key={part.name} style={styles.lockedCallCard}>
                      <div style={styles.partIcon}>🔒</div>
                      <h3 style={styles.cardTitle}>{part.name}</h3>
                      <p style={styles.smallText}>{part.description}</p>
                      <p style={styles.smallText}>Unlocks at Company Level {part.unlockLevel}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Panel>
        )}

        {activeTab === "build" && (
          <Panel>
            <h2 style={styles.sectionTitle}>🏗️ Build & Upgrade</h2>
            <p style={styles.smallText}>
              Company levels unlock new business facilities.
            </p>

            <button style={styles.mainButton} onClick={upgradeGarage}>
              Upgrade Garage — 🪙 {game.garageLevel * 1000}
            </button>

            <div style={styles.buildingList}>
              {BUILDINGS.map((building) => {
                const owned = game.ownedBuildings.includes(building.name);
                const locked = game.level < building.unlockLevel;

                return (
                  <div key={building.name} style={styles.buildingCard}>
                    <div style={styles.buildingIcon}>{locked ? "🔒" : building.icon}</div>

                    <div style={{ flex: 1 }}>
                      <h3 style={styles.cardTitle}>{building.name}</h3>
                      <p style={styles.smallText}>{building.description}</p>
                      <p style={styles.smallText}>
                        Unlock Level: {building.unlockLevel} • Cost: 🪙 {building.cost}
                      </p>

                      <button
                        style={owned ? styles.ownedButton : locked ? styles.lockedButton : styles.darkButton}
                        onClick={() => buyBuilding(building)}
                        disabled={owned}
                      >
                        {owned ? "Owned" : locked ? `Locked until Level ${building.unlockLevel}` : "Build"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}
      </section>
    </main>
  );
}

function InputBox({ label, placeholder, value, onChange }) {
  return (
    <label style={styles.inputLabel}>
      <span>{label}</span>
      <input
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Stat({ label, value }) {
  return (
    <div style={styles.statBox}>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

function MiniStat({ title, value }) {
  return (
    <div style={styles.miniStat}>
      <p style={styles.statLabel}>{title}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

function Panel({ children }) {
  return <div style={styles.panel}>{children}</div>;
}

function EmptyBox({ text }) {
  return <div style={styles.emptyBox}>{text}</div>;
}

function Building({ icon, title, style }) {
  return (
    <div style={{ ...styles.mapBuilding, ...style }}>
      <div style={styles.mapBuildingIcon}>{icon}</div>
      <div style={styles.mapBuildingTitle}>{title}</div>
    </div>
  );
}

function PickupTruck() {
  return (
    <div style={styles.realPickup}>
      <div style={styles.pickupShadow} />
      <div style={styles.pickupBed} />
      <div style={styles.pickupCabReal} />
      <div style={styles.pickupHood} />
      <div style={styles.pickupWindowFront} />
      <div style={styles.pickupWindowSide} />
      <div style={styles.pickupRedStripe} />
      <div style={styles.pickupServiceBox} />
      <div style={styles.pickupLightBar} />
      <div style={styles.pickupHeadlight} />
      <div style={styles.pickupTailLight} />
      <div style={styles.pickupWheelBack}>
        <div style={styles.pickupWheelInner} />
      </div>
      <div style={styles.pickupWheelFront}>
        <div style={styles.pickupWheelInner} />
      </div>
    </div>
  );
}

function Bar({ label, value, color }) {
  return (
    <div style={styles.barBlock}>
      <div style={styles.barLabel}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div style={styles.barOuter}>
        <div style={{ ...styles.barInner, width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

const styles = {
  startPage: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #fff7ed, #fed7aa, #9a3412)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "Arial, sans-serif",
    color: "#1c1917",
  },
  startCard: {
    width: "100%",
    maxWidth: 780,
    background: "rgba(255,255,255,0.95)",
    border: "1px solid #fed7aa",
    borderRadius: 32,
    padding: 30,
    boxShadow: "0 30px 70px rgba(67,20,7,0.32)",
    textAlign: "center",
  },
  logo: { fontSize: 66, marginBottom: 10 },
  title: { fontSize: 48, margin: "0 0 12px", fontWeight: 900 },
  subtitle: {
    color: "#57534e",
    fontSize: 17,
    lineHeight: 1.6,
    maxWidth: 660,
    margin: "0 auto 24px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    textAlign: "left",
  },
  inputLabel: { display: "grid", gap: 6, fontWeight: 800 },
  input: {
    border: "1px solid #d6d3d1",
    borderRadius: 14,
    padding: "12px 13px",
    fontSize: 15,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  gamePage: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fff7ed, #f5f5f4 45%, #e7e5e4)",
    color: "#1c1917",
    fontFamily: "Arial, sans-serif",
    paddingBottom: 32,
  },
  header: {
    background: "rgba(255,255,255,0.96)",
    borderBottom: "1px solid #fed7aa",
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
    boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
  },
  headerTitle: { margin: 0, fontSize: 25, fontWeight: 900 },
  rankText: { margin: "6px 0 0", fontWeight: 900, color: "#9a3412" },
  smallText: {
    margin: "6px 0",
    color: "#57534e",
    fontSize: 14,
    lineHeight: 1.45,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
    gap: 8,
    minWidth: 320,
    flex: 1,
    maxWidth: 950,
  },
  statBox: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: 15,
    padding: "9px 10px",
  },
  statLabel: {
    margin: 0,
    color: "#78716c",
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: 900,
  },
  statValue: { margin: "4px 0 0", fontSize: 16, fontWeight: 900 },
  navBar: {
    maxWidth: 1180,
    margin: "14px auto 0",
    padding: "0 16px",
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: 8,
  },
  navButton: {
    border: "1px solid #d6d3d1",
    background: "white",
    color: "#44403c",
    borderRadius: 16,
    padding: "11px 6px",
    fontWeight: 900,
    cursor: "pointer",
    display: "grid",
    gap: 4,
  },
  navButtonActive: {
    border: "1px solid #ea580c",
    background: "#ffedd5",
    color: "#9a3412",
    borderRadius: 16,
    padding: "11px 6px",
    fontWeight: 900,
    cursor: "pointer",
    display: "grid",
    gap: 4,
  },
  content: { maxWidth: 1180, margin: "0 auto", padding: 16, display: "grid", gap: 14 },
  message: {
    background: "#ffedd5",
    border: "1px solid #fdba74",
    color: "#7c2d12",
    borderRadius: 18,
    padding: 14,
    fontWeight: 800,
    lineHeight: 1.4,
  },
  levelUpBox: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
    background: "#ecfccb",
    border: "1px solid #bef264",
    color: "#365314",
    borderRadius: 18,
    padding: 14,
  },
  panel: {
    background: "rgba(255,255,255,0.94)",
    border: "1px solid #fed7aa",
    borderRadius: 28,
    padding: 20,
    boxShadow: "0 18px 40px rgba(67,20,7,0.08)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
  },
  sectionTitle: { margin: 0, fontSize: 24, fontWeight: 900 },
  subTitle: { margin: "24px 0 12px", fontSize: 20, fontWeight: 900 },
  empireStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 10,
    marginBottom: 18,
  },
  miniStat: {
    background: "#fff7ed",
    border: "1px solid #fed7aa",
    borderRadius: 16,
    padding: 12,
  },
  unlockBox: {
    background: "#f0f9ff",
    border: "1px solid #7dd3fc",
    color: "#075985",
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 1.45,
  },
  gameMap: {
    position: "relative",
    height: 430,
    borderRadius: 30,
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #facc15 0%, #fdba74 42%, #a8a29e 100%)",
    boxShadow: "inset 0 0 45px rgba(120,53,15,0.2)",
  },
  skyGlow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.55), transparent 28%)",
  },
  roadMain: {
    position: "absolute",
    left: "5%",
    right: "5%",
    top: "58%",
    height: 74,
    background: "#292524",
    borderRadius: 999,
    transform: "skewY(-4deg)",
    boxShadow: "0 18px 26px rgba(0,0,0,0.25)",
  },
  roadLineOne: {
    position: "absolute",
    left: "18%",
    top: "66%",
    width: 70,
    height: 8,
    background: "#fde68a",
    borderRadius: 99,
    transform: "skewY(-4deg)",
  },
  roadLineTwo: {
    position: "absolute",
    left: "44%",
    top: "66%",
    width: 70,
    height: 8,
    background: "#fde68a",
    borderRadius: 99,
    transform: "skewY(-4deg)",
  },
  roadLineThree: {
    position: "absolute",
    left: "70%",
    top: "66%",
    width: 70,
    height: 8,
    background: "#fde68a",
    borderRadius: 99,
    transform: "skewY(-4deg)",
  },
  mapBuilding: {
    position: "absolute",
    width: 130,
    minHeight: 96,
    borderRadius: 22,
    background: "linear-gradient(135deg, #ffffff, #fed7aa)",
    border: "2px solid rgba(255,255,255,0.8)",
    boxShadow: "10px 16px 0 rgba(67,20,7,0.2), 0 20px 28px rgba(0,0,0,0.16)",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    padding: 10,
    transform: "perspective(700px) rotateX(10deg)",
    zIndex: 2,
  },
  garageBuilding: { left: "6%", top: "14%" },
  partsBuilding: { left: "28%", top: "12%" },
  roadsideBuilding: { right: "29%", top: "12%" },
  yardBuilding: { right: "8%", top: "16%" },
  emptyBuilding: { right: "10%", bottom: "9%", opacity: 0.85 },
  mapBuildingIcon: { fontSize: 34 },
  mapBuildingTitle: { fontSize: 13, fontWeight: 900 },
  movingVehicle: {
    position: "absolute",
    zIndex: 5,
    transition: "left 0.6s linear, top 0.6s linear",
    transform: "translate(-50%, -50%)",
  },
  realPickup: {
    position: "relative",
    width: 104,
    height: 52,
    filter: "drop-shadow(0 12px 10px rgba(0,0,0,0.35))",
  },
  pickupShadow: {
    position: "absolute",
    left: 8,
    right: 8,
    bottom: 0,
    height: 12,
    background: "rgba(0,0,0,0.28)",
    borderRadius: "50%",
    filter: "blur(5px)",
  },
  pickupBed: {
    position: "absolute",
    left: 4,
    bottom: 13,
    width: 48,
    height: 24,
    background: "linear-gradient(180deg, #ffffff, #e7e5e4)",
    border: "3px solid #991b1b",
    borderRadius: "8px 4px 4px 8px",
    boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.08)",
  },
  pickupCabReal: {
    position: "absolute",
    left: 48,
    bottom: 13,
    width: 34,
    height: 32,
    background: "linear-gradient(180deg, #ffffff, #f5f5f4)",
    border: "3px solid #991b1b",
    borderRadius: "10px 10px 4px 4px",
    boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.08)",
  },
  pickupHood: {
    position: "absolute",
    left: 78,
    bottom: 13,
    width: 22,
    height: 22,
    background: "linear-gradient(180deg, #ffffff, #e7e5e4)",
    borderTop: "3px solid #991b1b",
    borderRight: "3px solid #991b1b",
    borderBottom: "3px solid #991b1b",
    borderRadius: "4px 10px 8px 4px",
  },
  pickupWindowFront: {
    position: "absolute",
    left: 66,
    bottom: 31,
    width: 12,
    height: 11,
    background: "linear-gradient(135deg, #0f172a, #38bdf8)",
    borderRadius: "3px",
    border: "1px solid #0f172a",
  },
  pickupWindowSide: {
    position: "absolute",
    left: 52,
    bottom: 31,
    width: 12,
    height: 11,
    background: "linear-gradient(135deg, #0f172a, #38bdf8)",
    borderRadius: "3px",
    border: "1px solid #0f172a",
  },
  pickupRedStripe: {
    position: "absolute",
    left: 8,
    bottom: 25,
    width: 84,
    height: 6,
    background: "#dc2626",
    borderRadius: 99,
    boxShadow: "0 1px 0 rgba(255,255,255,0.5)",
  },
  pickupServiceBox: {
    position: "absolute",
    left: 12,
    bottom: 19,
    width: 28,
    height: 12,
    background: "rgba(255,255,255,0.75)",
    border: "1px solid #78716c",
    borderRadius: 3,
  },
  pickupLightBar: {
    position: "absolute",
    left: 58,
    bottom: 45,
    width: 20,
    height: 5,
    background: "linear-gradient(90deg, #dc2626, #f97316)",
    borderRadius: 99,
    boxShadow: "0 0 8px rgba(249,115,22,0.8)",
  },
  pickupHeadlight: {
    position: "absolute",
    right: 1,
    bottom: 23,
    width: 6,
    height: 6,
    background: "#fde68a",
    borderRadius: "50%",
    boxShadow: "0 0 8px #fde68a",
  },
  pickupTailLight: {
    position: "absolute",
    left: 2,
    bottom: 22,
    width: 5,
    height: 8,
    background: "#ef4444",
    borderRadius: 3,
  },
  pickupWheelBack: {
    position: "absolute",
    left: 18,
    bottom: 5,
    width: 18,
    height: 18,
    background: "#111827",
    borderRadius: "50%",
    border: "3px solid #57534e",
    display: "grid",
    placeItems: "center",
  },
  pickupWheelFront: {
    position: "absolute",
    right: 16,
    bottom: 5,
    width: 18,
    height: 18,
    background: "#111827",
    borderRadius: "50%",
    border: "3px solid #57534e",
    display: "grid",
    placeItems: "center",
  },
  pickupWheelInner: {
    width: 7,
    height: 7,
    background: "#d6d3d1",
    borderRadius: "50%",
  },
  vehicleLabel: {
    marginTop: 4,
    background: "#1c1917",
    color: "white",
    borderRadius: 99,
    padding: "4px 8px",
    fontSize: 11,
    fontWeight: 900,
    whiteSpace: "nowrap",
    textAlign: "center",
  },
  mapHint: {
    position: "absolute",
    left: "50%",
    bottom: 22,
    transform: "translateX(-50%)",
    background: "rgba(255,255,255,0.9)",
    borderRadius: 18,
    padding: "12px 16px",
    color: "#7c2d12",
    fontWeight: 900,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
    gap: 14,
  },
  callCard: {
    background: "#fffaf5",
    border: "1px solid #fed7aa",
    borderRadius: 22,
    padding: 16,
    boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
  },
  lockedCallCard: {
    background: "#f5f5f4",
    border: "1px solid #d6d3d1",
    borderRadius: 22,
    padding: 16,
    opacity: 0.8,
  },
  jobCard: {
    background: "#fffaf5",
    border: "1px solid #fed7aa",
    borderRadius: 22,
    padding: 16,
  },
  issueJobCard: {
    background: "#fff1f2",
    border: "2px solid #fb7185",
    borderRadius: 22,
    padding: 16,
  },
  techCard: {
    background: "#fffaf5",
    border: "1px solid #fed7aa",
    borderRadius: 22,
    padding: 16,
  },
  partCard: {
    background: "#fffaf5",
    border: "1px solid #fed7aa",
    borderRadius: 22,
    padding: 16,
  },
  lowPartCard: {
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    borderRadius: 22,
    padding: 16,
  },
  cardIcon: { fontSize: 42 },
  partIcon: { fontSize: 42 },
  callTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  urgencyBadge: { borderRadius: 999, padding: "6px 10px", fontWeight: 900, fontSize: 12 },
  cardTitle: { margin: "6px 0", fontSize: 17, fontWeight: 900 },
  infoList: { marginTop: 10, fontSize: 14, color: "#44403c" },
  buttonStack: { display: "grid", gap: 8, marginTop: 12 },
  orangeSmallButton: {
    background: "#ea580c",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 900,
    cursor: "pointer",
  },
  greenSmallButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 900,
    cursor: "pointer",
  },
  dangerSmallButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 900,
    cursor: "pointer",
  },
  darkButton: {
    background: "#1c1917",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  lightSmallButton: {
    marginTop: 10,
    background: "white",
    color: "#1c1917",
    border: "1px solid #d6d3d1",
    borderRadius: 12,
    padding: "10px 12px",
    fontWeight: 900,
    cursor: "pointer",
  },
  mainButton: {
    width: "100%",
    marginTop: 16,
    background: "#ea580c",
    color: "white",
    border: "none",
    borderRadius: 16,
    padding: "14px 18px",
    fontWeight: 900,
    fontSize: 16,
    cursor: "pointer",
  },
  mainButtonSmall: {
    background: "#ea580c",
    color: "white",
    border: "none",
    borderRadius: 14,
    padding: "11px 14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  darkFullButton: {
    width: "100%",
    background: "#1c1917",
    color: "white",
    border: "none",
    borderRadius: 16,
    padding: "13px 14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  lockedFullButton: {
    width: "100%",
    background: "#e7e5e4",
    color: "#78716c",
    border: "none",
    borderRadius: 16,
    padding: "13px 14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  lightFullButton: {
    width: "100%",
    background: "white",
    color: "#1c1917",
    border: "1px solid #d6d3d1",
    borderRadius: 16,
    padding: "13px 14px",
    fontWeight: 900,
    cursor: "pointer",
  },
  dangerButton: {
    background: "white",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: 12,
    padding: "9px 12px",
    fontWeight: 900,
    cursor: "pointer",
  },
  warningBox: {
    background: "#fee2e2",
    color: "#991b1b",
    borderRadius: 12,
    padding: 10,
    fontWeight: 900,
    fontSize: 14,
    marginTop: 8,
  },
  emptyBox: {
    border: "1px dashed #d6d3d1",
    borderRadius: 18,
    padding: 18,
    color: "#78716c",
    background: "#fafaf9",
  },
  jobTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  phaseText: { color: "#ea580c", fontWeight: 900, margin: "6px 0" },
  timerBadge: {
    background: "#ffedd5",
    color: "#c2410c",
    borderRadius: 999,
    padding: "6px 10px",
    fontWeight: 900,
    fontSize: 13,
  },
  progressOuter: {
    height: 12,
    background: "#e7e5e4",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 14,
  },
  progressInner: {
    height: "100%",
    background: "#ea580c",
    borderRadius: 999,
    transition: "width 0.3s ease",
  },
  bonusText: { color: "#15803d", fontWeight: 900, margin: "4px 0", fontSize: 13 },
  techAvatar: {
    width: 58,
    height: 58,
    borderRadius: 18,
    background: "#ffedd5",
    display: "grid",
    placeItems: "center",
    fontSize: 32,
    marginBottom: 8,
  },
  statusBadge: {
    background: "#ffedd5",
    color: "#9a3412",
    borderRadius: 999,
    padding: "5px 9px",
    fontWeight: 900,
    fontSize: 12,
  },
  pickupBox: {
    marginTop: 12,
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: 14,
    padding: 10,
    display: "grid",
    gap: 4,
    fontSize: 13,
  },
  barBlock: { marginTop: 10 },
  barLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 12,
    fontWeight: 900,
    color: "#57534e",
    marginBottom: 4,
  },
  barOuter: { height: 10, background: "#e7e5e4", borderRadius: 999, overflow: "hidden" },
  barInner: { height: "100%", borderRadius: 999 },
  renameBox: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 8,
    marginTop: 10,
  },
  actionRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 10,
    marginTop: 16,
  },
  dayOffBox: {
    background: "#f0f9ff",
    border: "1px solid #7dd3fc",
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
  },
  requestRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    borderTop: "1px solid #bae6fd",
    paddingTop: 10,
    marginTop: 10,
    flexWrap: "wrap",
  },
  requestButtons: { display: "flex", gap: 8 },
  partButtons: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 },
  buildingList: { display: "grid", gap: 12, marginTop: 16 },
  buildingCard: {
    background: "#fffaf5",
    border: "1px solid #fed7aa",
    borderRadius: 18,
    padding: 14,
    display: "flex",
    gap: 12,
  },
  buildingIcon: { fontSize: 34 },
  ownedButton: {
    background: "#dcfce7",
    color: "#166534",
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "not-allowed",
  },
  lockedButton: {
    background: "#e7e5e4",
    color: "#78716c",
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 900,
    cursor: "pointer",
  },
};

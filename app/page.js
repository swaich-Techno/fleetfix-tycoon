"use client";

import { useEffect, useMemo, useState } from "react";

const SAVE_KEY = "fleetfix-tycoon-save-v12";

const STARTING_GAME = {
  started: false,
  companyName: "",
  ownerName: "",
  townName: "",
  countryName: "",
  coins: 500,
  money: 100,
  xp: 0,
  level: 1,
  reputation: 0,
  day: 1,
  dayTimer: 180,
  salaryDue: 0,
  completedJobs: 0,
  totalRevenue: 0,
  worldValue: 1200,
  storageBase: 35,
  yardLevel: 1,
  trainingLevel: 1,
  partShopLevel: 1,
  activeAreaId: "area-1",
  technicians: [],
  activeJobs: [],
  dayOffRequests: [],
  signedContracts: [],
  friends: [],
  club: null,
  clubEvent: null,
  googlePlayLinked: false,
  googlePlayName: "",
  parts: {
    Tyre: 8,
    Battery: 6,
    "Engine Oil": 6,
    "Brake Kit": 5,
    "Bulb Pack": 6,
    "7-Way Plug": 4,
    "Landing Leg Pin": 3,
    "Diagnostic Chip": 0,
    "Tow Hook": 0,
    "Fuel Seal Kit": 0,
    "Hydraulic Hose": 0,
    "ECU Sensor": 0,
    "Air Compressor": 0,
    "Transmission Kit": 0,
  },
  worldAreas: [
    {
      id: "area-1",
      name: "Starter Valley",
      unlocked: true,
      landSlots: 10,
      theme: "Small repair town",
      tiles: [
        {
          id: "garage",
          type: "Garage",
          icon: "🏚️",
          level: 1,
          status: "complete",
          family: false,
          value: 500,
        },
        {
          id: "parts-store",
          type: "Parts Store",
          icon: "🏪",
          level: 1,
          status: "complete",
          family: false,
          value: 400,
        },
        {
          id: "clinic",
          type: "Clinic",
          icon: "🏥",
          level: 1,
          status: "complete",
          family: false,
          value: 300,
        },
        {
          id: "main-road",
          type: "Road",
          icon: "🛣️",
          level: 1,
          status: "complete",
          family: false,
          value: 100,
        },
      ],
    },
  ],
};

const SKILLS = ["Tyre", "Electrical", "Engine", "Mechanical", "Diagnostic", "Towing"];

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
  "Jordan",
  "Miguel",
  "Noah",
  "Ava",
  "Leo",
];

const FRIEND_NAMES = [
  "RoadKing Repairs",
  "Highway Heroes",
  "Diesel Doctors",
  "QuickFix Crew",
  "Tow Titans",
  "City Truck Pros",
  "Trailer Masters",
  "Garage Legends",
];

const PARTS = [
  { name: "Tyre", icon: "🛞", cost: 70, sell: 42, reorder: 8, unlockLevel: 1 },
  { name: "Battery", icon: "🔋", cost: 110, sell: 66, reorder: 6, unlockLevel: 1 },
  { name: "Engine Oil", icon: "🛢️", cost: 90, sell: 54, reorder: 6, unlockLevel: 1 },
  { name: "Brake Kit", icon: "🧱", cost: 130, sell: 78, reorder: 5, unlockLevel: 1 },
  { name: "Bulb Pack", icon: "💡", cost: 45, sell: 27, reorder: 6, unlockLevel: 1 },
  { name: "7-Way Plug", icon: "🔌", cost: 80, sell: 48, reorder: 4, unlockLevel: 1 },
  { name: "Landing Leg Pin", icon: "🦵", cost: 95, sell: 57, reorder: 3, unlockLevel: 1 },
  { name: "Diagnostic Chip", icon: "💾", cost: 160, sell: 96, reorder: 4, unlockLevel: 5 },
  { name: "Tow Hook", icon: "🪝", cost: 200, sell: 120, reorder: 3, unlockLevel: 5 },
  { name: "Fuel Seal Kit", icon: "⛽", cost: 260, sell: 156, reorder: 3, unlockLevel: 10 },
  { name: "Hydraulic Hose", icon: "🔩", cost: 340, sell: 204, reorder: 2, unlockLevel: 10 },
  { name: "ECU Sensor", icon: "📟", cost: 450, sell: 270, reorder: 2, unlockLevel: 15 },
  { name: "Air Compressor", icon: "🌬️", cost: 520, sell: 312, reorder: 2, unlockLevel: 20 },
  { name: "Transmission Kit", icon: "⚙️", cost: 700, sell: 420, reorder: 1, unlockLevel: 25 },
];

const JOB_TEMPLATES = [
  { id: 101, title: "Jump Start", skill: "Electrical", partNeeded: "Battery", partQty: 0, travel: 8, repair: 12, back: 8, coins: 80, money: 5, xp: 25, techXp: 25, rep: 1, unlock: 1, urgency: "Low", icon: "🔋" },
  { id: 102, title: "Trailer 7-Way Plug Issue", skill: "Electrical", partNeeded: "7-Way Plug", partQty: 1, travel: 12, repair: 18, back: 10, coins: 130, money: 8, xp: 35, techXp: 40, rep: 1, unlock: 1, urgency: "Low", icon: "🔌" },
  { id: 103, title: "Landing Leg Issue", skill: "Mechanical", partNeeded: "Landing Leg Pin", partQty: 1, travel: 12, repair: 22, back: 10, coins: 150, money: 9, xp: 40, techXp: 45, rep: 1, unlock: 1, urgency: "Low", icon: "🦵" },
  { id: 104, title: "Trailer Light Change", skill: "Electrical", partNeeded: "Bulb Pack", partQty: 1, travel: 10, repair: 15, back: 10, coins: 110, money: 7, xp: 30, techXp: 35, rep: 1, unlock: 1, urgency: "Low", icon: "💡" },
  { id: 1, title: "Car Tyre Puncture", skill: "Tyre", partNeeded: "Tyre", partQty: 1, travel: 10, repair: 30, back: 10, coins: 140, money: 8, xp: 40, techXp: 45, rep: 1, unlock: 1, urgency: "Low", icon: "🚗" },
  { id: 2, title: "Van Battery Dead", skill: "Electrical", partNeeded: "Battery", partQty: 1, travel: 15, repair: 45, back: 15, coins: 220, money: 12, xp: 60, techXp: 70, rep: 2, unlock: 1, urgency: "Medium", icon: "🚐" },
  { id: 3, title: "Pickup Engine Heating", skill: "Engine", partNeeded: "Engine Oil", partQty: 1, travel: 20, repair: 60, back: 20, coins: 330, money: 18, xp: 85, techXp: 90, rep: 3, unlock: 2, urgency: "Medium", icon: "🛻" },
  { id: 4, title: "Trailer Brake Issue", skill: "Mechanical", partNeeded: "Brake Kit", partQty: 1, travel: 25, repair: 90, back: 25, coins: 470, money: 25, xp: 120, techXp: 130, rep: 5, unlock: 4, urgency: "High", icon: "🚛" },
  { id: 5, title: "Bus Safety Inspection", skill: "Diagnostic", partNeeded: "Diagnostic Chip", partQty: 1, travel: 30, repair: 120, back: 30, coins: 650, money: 36, xp: 170, techXp: 180, rep: 8, unlock: 5, urgency: "High", icon: "🚌" },
  { id: 6, title: "Broken Trailer Rescue", skill: "Towing", partNeeded: "Tow Hook", partQty: 1, travel: 45, repair: 180, back: 45, coins: 1150, money: 60, xp: 300, techXp: 310, rep: 18, unlock: 7, urgency: "Critical", icon: "🪝" },
  { id: 7, title: "Truck Fuel Leak", skill: "Mechanical", partNeeded: "Fuel Seal Kit", partQty: 1, travel: 35, repair: 150, back: 35, coins: 1250, money: 72, xp: 340, techXp: 350, rep: 20, unlock: 10, urgency: "Critical", icon: "🚚" },
  { id: 8, title: "Hydraulic Truck Failure", skill: "Mechanical", partNeeded: "Hydraulic Hose", partQty: 1, travel: 40, repair: 200, back: 40, coins: 1600, money: 95, xp: 450, techXp: 460, rep: 28, unlock: 12, urgency: "Critical", icon: "🏗️" },
  { id: 9, title: "Fleet ECU Diagnostic", skill: "Diagnostic", partNeeded: "ECU Sensor", partQty: 1, travel: 30, repair: 180, back: 30, coins: 1800, money: 120, xp: 520, techXp: 540, rep: 35, unlock: 15, urgency: "Contract", icon: "📟" },
  { id: 10, title: "Bus Air System Repair", skill: "Mechanical", partNeeded: "Air Compressor", partQty: 1, travel: 35, repair: 240, back: 35, coins: 2300, money: 150, xp: 650, techXp: 680, rep: 45, unlock: 20, urgency: "Contract", icon: "🚌" },
  { id: 11, title: "Fleet Transmission Repair", skill: "Engine", partNeeded: "Transmission Kit", partQty: 1, travel: 45, repair: 300, back: 45, coins: 3200, money: 220, xp: 850, techXp: 900, rep: 60, unlock: 25, urgency: "Contract", icon: "🚛" },
];

const TOWN_BUILDINGS = [
  { type: "Road", icon: "🛣️", costCoins: 120, costMoney: 0, unlockLevel: 1, value: 100, buildTime: 18, family: false, description: "Required for planned town expansion." },
  { type: "Family House", icon: "🏠", costCoins: 380, costMoney: 20, unlockLevel: 2, value: 360, buildTime: 35, family: true, description: "Homes for technicians and families." },
  { type: "Park", icon: "🌳", costCoins: 600, costMoney: 35, unlockLevel: 3, value: 520, buildTime: 45, family: true, description: "Improves town happiness and family area." },
  { type: "School", icon: "🏫", costCoins: 1000, costMoney: 70, unlockLevel: 5, value: 900, buildTime: 70, family: true, description: "Township-style education building." },
  { type: "Gym", icon: "🏋️", costCoins: 900, costMoney: 55, unlockLevel: 6, value: 760, buildTime: 55, family: false, description: "Helps technician fitness and morale." },
  { type: "Hospital", icon: "🏥", costCoins: 1300, costMoney: 90, unlockLevel: 7, value: 1200, buildTime: 85, family: false, description: "Handles rare technician incidents." },
  { type: "Fire Station", icon: "🚒", costCoins: 1500, costMoney: 100, unlockLevel: 8, value: 1350, buildTime: 90, family: false, description: "Safety building for bigger towns." },
  { type: "Community Center", icon: "🏛️", costCoins: 1700, costMoney: 120, unlockLevel: 10, value: 1600, buildTime: 105, family: true, description: "Boosts town prestige." },
  { type: "Warehouse", icon: "🏭", costCoins: 1800, costMoney: 150, unlockLevel: 10, value: 2000, buildTime: 110, family: false, description: "Increases storage capacity." },
  { type: "Fuel Station", icon: "⛽", costCoins: 2200, costMoney: 170, unlockLevel: 12, value: 2300, buildTime: 120, family: false, description: "Supports fleet movement." },
  { type: "Training Academy", icon: "🎓", costCoins: 2500, costMoney: 210, unlockLevel: 15, value: 2800, buildTime: 140, family: false, description: "Supports technician training." },
  { type: "Apartment Block", icon: "🏢", costCoins: 3200, costMoney: 260, unlockLevel: 18, value: 3500, buildTime: 160, family: true, description: "Housing for a bigger workforce." },
  { type: "Mall", icon: "🏬", costCoins: 4200, costMoney: 350, unlockLevel: 21, value: 5000, buildTime: 190, family: true, description: "Big city lifestyle building." },
  { type: "Airport Road", icon: "🛫", costCoins: 6000, costMoney: 550, unlockLevel: 30, value: 8000, buildTime: 240, family: false, description: "Late-game global expansion support." },
];

const TABS = [
  { id: "town", label: "Town", icon: "🏙️" },
  { id: "calls", label: "Calls", icon: "🚨" },
  { id: "jobs", label: "Jobs", icon: "⏱️" },
  { id: "team", label: "Team", icon: "👨‍🔧" },
  { id: "market", label: "Market", icon: "🛒" },
  { id: "contracts", label: "Contracts", icon: "📄" },
  { id: "globe", label: "Globe", icon: "🌍" },
  { id: "upgrades", label: "Upgrades", icon: "⬆️" },
];

function createId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getGameSeconds(actualMinutes) {
  return Math.max(6, Math.ceil(actualMinutes));
}

function getXpNeeded(level) {
  return level * 180;
}

function getTechnicianXpNeeded(level) {
  return level * 120;
}

function getSalaryForLevel(level, isOwner) {
  if (isOwner) return 0;
  if (level <= 5) return 100;
  return Math.round(100 * Math.pow(1.015, level - 5));
}

function getBasicPickupEquipment() {
  return {
    Tyre: 2,
    Battery: 1,
    "Engine Oil": 1,
    "Brake Kit": 1,
    "Bulb Pack": 2,
    "7-Way Plug": 1,
    "Landing Leg Pin": 1,
    "Diagnostic Chip": 1,
    "Tow Hook": 1,
    "Fuel Seal Kit": 0,
    "Hydraulic Hose": 0,
    "ECU Sensor": 0,
    "Air Compressor": 0,
    "Transmission Kit": 0,
  };
}

function createTechnician(name, isOwner = false, areaId = "area-1") {
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
    hospitalDays: 0,
    truckLevel: 1,
    assignedAreaId: areaId,
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
    hospitalDays: tech.hospitalDays ?? 0,
    truckLevel: tech.truckLevel || 1,
    assignedAreaId: tech.assignedAreaId || "area-1",
    avatar: tech.avatar || (tech.isOwner ? "👑" : "👨‍🔧"),
    status: ["Travelling", "Repairing", "Returning", "Supporting"].includes(tech.status)
      ? "Free"
      : tech.status || "Free",
    currentJobId: null,
    energy: Math.max(tech.energy || 0, 50),
    pickupEquipment: { ...getBasicPickupEquipment(), ...(tech.pickupEquipment || {}) },
  };
}

function getArea(game, areaId) {
  return game.worldAreas.find((area) => area.id === areaId) || game.worldAreas[0];
}

function getActiveArea(game) {
  return getArea(game, game.activeAreaId);
}

function getAreaNames(game) {
  return game.worldAreas.filter((area) => area.unlocked).map((area) => area.name);
}

function getStorageCapacity(game) {
  const warehouseBonus = game.worldAreas.reduce(
    (sum, area) =>
      sum +
      area.tiles.filter((tile) => tile.type === "Warehouse" && tile.status === "complete").length * 35,
    0
  );

  return game.storageBase + game.level * 5 + game.partShopLevel * 15 + warehouseBonus;
}

function getInventoryUsed(parts) {
  return Object.values(parts).reduce((sum, qty) => sum + qty, 0);
}

function getAvailableParts(level) {
  return PARTS.filter((part) => part.unlockLevel <= level);
}

function getLockedParts(level) {
  return PARTS.filter((part) => part.unlockLevel > level);
}

function getServicePoints(game) {
  const activeArea = getActiveArea(game);
  const base = activeArea.name;
  const completedTiles = activeArea.tiles.filter((tile) => tile.status === "complete");

  const points = [
    `${base} Main Road`,
    `${base} Service Yard`,
    `${base} Market Street`,
    `${base} Industrial Lane`,
  ];

  completedTiles.forEach((tile) => {
    if (tile.type === "School") points.push(`${base} School Road`);
    if (tile.type === "Park") points.push(`${base} Park Gate`);
    if (tile.type === "Gym") points.push(`${base} Gym Parking`);
    if (tile.type === "Hospital") points.push(`${base} Hospital Road`);
    if (tile.type === "Warehouse") points.push(`${base} Warehouse Zone`);
    if (tile.type === "Mall") points.push(`${base} Mall Parking`);
    if (tile.type === "Fuel Station") points.push(`${base} Fuel Plaza`);
  });

  return Array.from(new Set(points));
}

function makeServiceCall(template, game, index) {
  const points = getServicePoints(game);
  const area = getActiveArea(game);
  const mapPoint = points[(game.day + index + Math.floor(Math.random() * points.length)) % points.length];

  const noPaymentChance = game.day % 30 === 0 || game.day % 17 === 0 ? 0.18 : 0.025;
  const noPayment = Math.random() < noPaymentChance;

  return {
    id: `${template.id}-${createId()}`,
    title: noPayment ? `${template.title} — No Payment Risk` : template.title,
    problem: noPayment
      ? "Customer may not pay. Complete it for reputation and town trust."
      : `${template.title} request received from ${mapPoint}.`,
    skill: template.skill,
    partNeeded: template.partNeeded,
    partQty: template.partQty,
    actualTravelMinutes: template.travel,
    actualRepairMinutes: template.repair,
    actualReturnMinutes: template.back,
    rewardCoins: noPayment ? 0 : template.coins + Math.floor(game.level * 8),
    rewardMoney: noPayment ? 0 : template.money + Math.floor(game.level * 2),
    rewardXp: template.xp,
    techXp: template.techXp,
    reputation: noPayment ? template.rep + 2 : template.rep,
    unlockLevel: template.unlock,
    urgency: noPayment ? "Charity" : template.urgency,
    icon: template.icon,
    mapPoint,
    areaId: area.id,
    noPayment,
    approvedExtraIssue: false,
  };
}

function getRandomServiceCalls(game) {
  const available = JOB_TEMPLATES.filter((call) => call.unlock <= game.level);
  return [...available]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6)
    .map((template, index) => makeServiceCall(template, game, index));
}

function getLockedServiceCalls(level) {
  return JOB_TEMPLATES.filter((call) => call.unlock > level).slice(0, 5);
}

function getCompanyRank(rep) {
  if (rep >= 2000) return "Global Repair Empire";
  if (rep >= 1000) return "Continental Fleet Authority";
  if (rep >= 400) return "National Fleet Empire";
  if (rep >= 180) return "Regional Fleet Leader";
  if (rep >= 65) return "Trusted Fleet Partner";
  if (rep >= 18) return "Growing Garage";
  return "Small Town Garage";
}

function getUrgencyStyle(urgency) {
  if (urgency === "Charity") return { background: "#fef9c3", color: "#854d0e" };
  if (urgency === "Critical") return { background: "#fee2e2", color: "#991b1b" };
  if (urgency === "High") return { background: "#ffedd5", color: "#9a3412" };
  if (urgency === "Medium") return { background: "#fef3c7", color: "#92400e" };
  if (urgency === "Contract") return { background: "#dbeafe", color: "#1d4ed8" };
  return { background: "#dcfce7", color: "#166534" };
}

function getJobPhaseLabel(job) {
  if (job.pendingApproval) return "Waiting: approve extra issue";
  if (job.needsSupport && !job.supportAssigned) return "Paused: technician energy below 20%";
  if (job.needsSupport && job.supportAssigned && job.supportRemaining > 0) return "Backup resolving issue";
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
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function generateContracts(level) {
  const base = [
    { id: "local-delivery", name: "Local Delivery Company", unlockLevel: 2, cost: 80, coin: 5, money: 0 },
    { id: "market-fleet", name: "Market Fleet Partner", unlockLevel: 5, cost: 160, coin: 8, money: 5 },
    { id: "bus-depot", name: "City Bus Depot", unlockLevel: 10, cost: 350, coin: 12, money: 8 },
    { id: "regional-logistics", name: "Regional Logistics Group", unlockLevel: 15, cost: 700, coin: 18, money: 12 },
    { id: "new-area-contract", name: "New Area Government Contract", unlockLevel: 21, cost: 1000, coin: 22, money: 15 },
  ];

  const endless = Array.from({ length: 24 }, (_, i) => {
    const n = i + 1;
    const unlock = 25 + n * 5;
    return {
      id: `global-contract-${unlock}`,
      name: `Global Fleet Contract L${unlock}`,
      unlockLevel: unlock,
      cost: 1200 + n * 420,
      coin: 22 + n * 2,
      money: 15 + n,
    };
  });

  return [...base, ...endless].filter((contract) => contract.unlockLevel <= level + 20);
}

function getContractBonuses(signedContracts, level) {
  const contracts = generateContracts(level);
  const signed = contracts.filter((contract) => signedContracts.includes(contract.id));

  return signed.reduce(
    (total, contract) => ({
      coinBonusPercent: total.coinBonusPercent + contract.coin,
      moneyBonusPercent: total.moneyBonusPercent + contract.money,
    }),
    { coinBonusPercent: 0, moneyBonusPercent: 0 }
  );
}

function getMaxTechnicians(game) {
  if (game.level < 5) return 1;
  if (game.level < 21) return 2;

  const unlockedAreas = game.worldAreas.filter((area) => area.unlocked).length;
  return 2 + unlockedAreas * 2 + Math.floor((game.level - 21) / 5);
}

function getNextAreaCost(game) {
  const unlockedCount = game.worldAreas.filter((area) => area.unlocked).length;
  return {
    coins: 6000 + unlockedCount * 3500,
    money: 700 + unlockedCount * 450,
  };
}

function getNextAreaName(game) {
  const names = [
    "Riverbend County",
    "Highway Desert",
    "Snowfield District",
    "Coastal Port",
    "Mountain Pass",
    "Metro Island",
    "Northern Frontier",
    "Cargo Bay City",
    "Sunrise Plains",
    "Global Hub",
  ];

  const index = game.worldAreas.length - 1;
  return names[index] || `World Area ${game.worldAreas.length + 1}`;
}

export default function Home() {
  const [game, setGame] = useState(STARTING_GAME);
  const [setup, setSetup] = useState({
    companyName: "",
    ownerName: "",
    townName: "",
    countryName: "",
  });
  const [availableCalls, setAvailableCalls] = useState([]);
  const [message, setMessage] = useState("");
  const [popup, setPopup] = useState(null);
  const [activeTab, setActiveTab] = useState("town");
  const [renameId, setRenameId] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [ribbonTile, setRibbonTile] = useState(null);

  useEffect(() => {
    const saved =
      localStorage.getItem(SAVE_KEY) ||
      localStorage.getItem("fleetfix-tycoon-save-v11") ||
      localStorage.getItem("fleetfix-tycoon-save-v10") ||
      localStorage.getItem("fleetfix-tycoon-save-v9") ||
      localStorage.getItem("fleetfix-tycoon-save-v8") ||
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

      const normalized = {
        ...STARTING_GAME,
        ...parsed,
        countryName: parsed.countryName || "My Country",
        signedContracts: parsed.signedContracts || [],
        friends: parsed.friends || [],
        club: parsed.club || null,
        clubEvent: parsed.clubEvent || null,
        worldAreas: parsed.worldAreas || STARTING_GAME.worldAreas,
        activeAreaId: parsed.activeAreaId || "area-1",
        yardLevel: parsed.yardLevel || 1,
        trainingLevel: parsed.trainingLevel || 1,
        partShopLevel: parsed.partShopLevel || 1,
        storageBase: parsed.storageBase || 35,
        parts: { ...STARTING_GAME.parts, ...(parsed.parts || {}) },
        technicians:
          safeLevel < 5
            ? (parsed.technicians || []).map(normalizeTechnician).filter((tech) => tech.isOwner)
            : (parsed.technicians || []).map(normalizeTechnician).slice(0, safeLevel < 21 ? 2 : 999),
        activeJobs: [],
        dayOffRequests: parsed.dayOffRequests || [],
      };

      setGame(normalized);
      if (parsed.started) setAvailableCalls(getRandomServiceCalls(normalized));
    }
  }, []);

  useEffect(() => {
    if (game.started) localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  }, [game]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGame((currentGame) => {
        if (!currentGame.started) return currentGame;

        let updated = { ...currentGame };
        let notes = [];

        updated.dayTimer -= 1;

        updated.worldAreas = updated.worldAreas.map((area) => ({
          ...area,
          tiles: area.tiles.map((tile) => {
            if (tile.status !== "building") return tile;

            const remaining = Math.max(0, (tile.remaining || 0) - 1);

            if (remaining <= 0) {
              notes.push(`${tile.type} construction finished. Cut the ribbon to open it.`);
              return {
                ...tile,
                remaining: 0,
                status: "readyRibbon",
              };
            }

            return {
              ...tile,
              remaining,
            };
          }),
        }));

        if (updated.dayTimer <= 0) {
          const totalSalary = updated.technicians.reduce(
            (sum, tech) => sum + (tech.isOwner ? 0 : getSalaryForLevel(tech.level || 1, tech.isOwner)),
            0
          );

          updated.day += 1;
          updated.dayTimer = 180;
          updated.salaryDue += totalSalary;

          updated.technicians = updated.technicians.map((tech) => {
            if (tech.status === "Hospital") {
              const newDays = Math.max(0, (tech.hospitalDays || 0) - 1);

              return {
                ...tech,
                hospitalDays: newDays,
                status: newDays <= 0 ? "Free" : "Hospital",
                energy: newDays <= 0 ? 80 : tech.energy,
                morale: newDays <= 0 ? Math.min(100, tech.morale + 8) : tech.morale,
              };
            }

            if (tech.status === "Day Off") {
              return {
                ...tech,
                status: "Free",
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

          if (updated.day % 7 === 1 && updated.day > 1) {
            updated.technicians = updated.technicians.map((tech) =>
              tech.status === "Hospital" ? tech : { ...tech, energy: 100 }
            );
            notes.push("Weekly reset: all available technicians recovered energy.");
          }

          notes.push(`Day ${updated.day} started. Salary due increased by ${totalSalary} coins.`);
        }

        if (updated.activeJobs.length > 0) {
          updated.activeJobs = updated.activeJobs
            .map((job) => {
              let nextJob = { ...job };

              if (job.pendingApproval) return nextJob;

              const mainTech = updated.technicians.find((tech) => tech.id === job.technicianId);
              const freeBackupExists = updated.technicians.some(
                (tech) => tech.id !== job.technicianId && tech.status === "Free" && tech.energy > 0
              );

              const issueChance = job.urgency === "Critical" ? 0.035 : job.urgency === "High" ? 0.022 : 0.012;

              if (job.phase === "repair" && !job.extraIssueChecked && Math.random() < issueChance) {
                const lowEnergy = (mainTech?.energy || 100) < 20;

                if (lowEnergy && freeBackupExists) {
                  notes.push(`${job.technicianName} found an extra issue but energy is below 20%. Backup is required.`);

                  return {
                    ...nextJob,
                    extraIssueChecked: true,
                    needsSupport: true,
                    supportAssigned: false,
                    issueText: "Technician energy is below 20%. Send backup to continue safely.",
                  };
                }

                notes.push(`${job.technicianName} reported an extra issue on ${job.title}. Waiting for your approval.`);

                return {
                  ...nextJob,
                  extraIssueChecked: true,
                  pendingApproval: true,
                  issueText: "Extra issue found. Approve additional repair time to continue.",
                  extraIssueTime: job.urgency === "Critical" ? 50 : job.urgency === "High" ? 35 : 22,
                };
              }

              if (job.needsSupport && !job.supportAssigned) return nextJob;

              if (job.needsSupport && job.supportAssigned && job.supportRemaining > 0) {
                return { ...nextJob, supportRemaining: job.supportRemaining - 1 };
              }

              if (job.needsSupport && job.supportAssigned && job.supportRemaining <= 0) {
                nextJob.needsSupport = false;
                nextJob.supportResolved = true;
              }

              nextJob.phaseRemaining -= 1;

              if (nextJob.phaseRemaining <= 0) {
                if (nextJob.phase === "travel") {
                  nextJob.phase = "repair";
                  nextJob.phaseRemaining = nextJob.repairTimeFinal;
                  nextJob.phaseTotal = nextJob.repairTimeFinal;

                  updated.technicians = updated.technicians.map((tech) =>
                    tech.id === nextJob.technicianId ? { ...tech, status: "Repairing" } : tech
                  );
                } else if (nextJob.phase === "repair") {
                  nextJob.phase = "return";
                  nextJob.phaseRemaining = nextJob.returnTime;
                  nextJob.phaseTotal = nextJob.returnTime;

                  updated.technicians = updated.technicians.map((tech) =>
                    tech.id === nextJob.technicianId ? { ...tech, status: "Returning" } : tech
                  );
                } else if (nextJob.phase === "return") {
                  nextJob.completed = true;
                }
              }

              return nextJob;
            })
            .filter((job) => {
              if (!job.completed) return true;

              const technician = updated.technicians.find((tech) => tech.id === job.technicianId);
              const supportTech = updated.technicians.find((tech) => tech.id === job.supportTechnicianId);
              const bonuses = getContractBonuses(updated.signedContracts || [], updated.level);
              const bonusCoins = Math.round(job.rewardCoins * (bonuses.coinBonusPercent / 100));
              const bonusMoney = Math.round(job.rewardMoney * (bonuses.moneyBonusPercent / 100));

              updated.coins += job.rewardCoins + bonusCoins;
              updated.money += job.rewardMoney + bonusMoney;
              updated.xp += job.rewardXp;
              updated.reputation += job.reputation;
              updated.completedJobs += 1;
              updated.totalRevenue += job.rewardCoins + bonusCoins;
              updated.worldValue += Math.floor((job.rewardCoins + bonusCoins) * 0.12);

              const hospitalChance = job.urgency === "Critical" ? 0.012 : job.urgency === "High" ? 0.006 : 0.002;
              let incidentTechId = null;

              if (Math.random() < hospitalChance && technician) {
                incidentTechId = technician.id;
                const medicalCost = job.urgency === "Critical" ? 160 : 90;
                updated.coins = Math.max(0, updated.coins - medicalCost);
                notes.push(`Rare incident: ${technician.name} had a minor injury and went to the clinic for 2 days. Medical cost: ${medicalCost} coins.`);
              }

              updated.technicians = updated.technicians.map((tech) => {
                if (tech.id === job.technicianId) {
                  if (tech.id === incidentTechId) {
                    return {
                      ...tech,
                      status: "Hospital",
                      hospitalDays: 2,
                      currentJobId: null,
                      energy: 20,
                      morale: Math.max(40, tech.morale - 8),
                    };
                  }

                  const energyLoss = Math.max(5, 15 - (tech.truckLevel || 1));
                  let newLevel = tech.level || 1;
                  let newXp = (tech.xp || 0) + job.techXp;

                  while (newXp >= getTechnicianXpNeeded(newLevel)) {
                    newXp -= getTechnicianXpNeeded(newLevel);
                    newLevel += 1;
                  }

                  return {
                    ...tech,
                    status: "Free",
                    currentJobId: null,
                    energy: Math.max(0, tech.energy - energyLoss),
                    morale: Math.max(45, tech.morale - 2),
                    xp: newXp,
                    level: newLevel,
                    salary: getSalaryForLevel(newLevel, tech.isOwner),
                  };
                }

                if (tech.id === job.supportTechnicianId) {
                  let newLevel = tech.level || 1;
                  let newXp = (tech.xp || 0) + 35;

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

              notes.push(`${technician?.name || "Technician"} returned from ${job.title}. Earned ${job.rewardCoins + bonusCoins} coins, ${job.rewardMoney + bonusMoney} money, ${job.rewardXp} company XP, and ${job.techXp} technician XP.`);

              if (supportTech) notes.push(`${supportTech.name} helped with the extra issue and earned support XP.`);

              return false;
            });
        }

        updated.technicians.forEach((tech) => {
          if (
            !tech.isOwner &&
            tech.status === "Free" &&
            !updated.dayOffRequests.some((request) => request.technicianId === tech.id) &&
            Math.random() < 0.0015
          ) {
            const reasons = [
              "I need one day off for family work.",
              "I have personal work tomorrow. Can I take a day off?",
              "I need to visit home for important work.",
              "I need one rest day because of personal plans.",
            ];

            const request = {
              id: createId(),
              technicianId: tech.id,
              technicianName: tech.name,
              reason: reasons[Math.floor(Math.random() * reasons.length)],
            };

            updated.dayOffRequests = [...updated.dayOffRequests, request];
            setPopup({ title: `${tech.name} is asking for day off`, text: request.reason });
          }
        });

        while (updated.xp >= getXpNeeded(updated.level)) {
          updated.xp -= getXpNeeded(updated.level);
          updated.level += 1;
          updated.coins += 150 + updated.level * 8;
          updated.money += 25 + Math.floor(updated.level * 1.5);

          notes.push(`Company level up! You reached Level ${updated.level}. New jobs, buildings, contracts, storage and globe expansion may now be available.`);
        }

        if (updated.clubEvent) {
          if (updated.clubEvent.remaining > 0) {
            updated.clubEvent = { ...updated.clubEvent, remaining: updated.clubEvent.remaining - 1 };
          } else {
            updated.coins += updated.clubEvent.rewardCoins;
            updated.money += updated.clubEvent.rewardMoney;
            updated.reputation += updated.clubEvent.rewardRep;
            notes.push(`Club event completed! Earned ${updated.clubEvent.rewardCoins} coins, ${updated.clubEvent.rewardMoney} money, and ${updated.clubEvent.rewardRep} reputation.`);
            updated.clubEvent = null;
          }
        }

        if (notes.length > 0) {
          setMessage(notes.join(" "));
          setAvailableCalls(getRandomServiceCalls(updated));
        }

        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const activeArea = getActiveArea(game);
  const unlockedAreas = game.worldAreas.filter((area) => area.unlocked);
  const availableParts = getAvailableParts(game.level);
  const lockedParts = getLockedParts(game.level);
  const lockedCalls = getLockedServiceCalls(game.level);
  const contracts = generateContracts(game.level);
  const contractBonuses = getContractBonuses(game.signedContracts || [], game.level);
  const companyRank = getCompanyRank(game.reputation);
  const storageCapacity = getStorageCapacity(game);
  const inventoryUsed = getInventoryUsed(game.parts);
  const freeTechnicians = game.technicians.filter((tech) => tech.status === "Free" && tech.energy > 0);
  const totalDailySalary = game.technicians.reduce((sum, tech) => sum + (tech.isOwner ? 0 : getSalaryForLevel(tech.level || 1, tech.isOwner)), 0);
  const maxTechnicians = getMaxTechnicians(game);

  function startGame() {
    if (!setup.companyName.trim() || !setup.ownerName.trim() || !setup.townName.trim() || !setup.countryName.trim()) {
      setMessage("Please fill company name, owner name, town name, and country/world name.");
      return;
    }

    const owner = createTechnician(setup.ownerName.trim(), true, "area-1");

    const newGame = {
      ...STARTING_GAME,
      started: true,
      companyName: setup.companyName.trim(),
      ownerName: setup.ownerName.trim(),
      townName: setup.townName.trim(),
      countryName: setup.countryName.trim(),
      technicians: [owner],
      worldAreas: [
        {
          ...STARTING_GAME.worldAreas[0],
          name: setup.townName.trim(),
        },
      ],
    };

    setGame(newGame);
    setAvailableCalls(getRandomServiceCalls(newGame));
    setMessage(`Welcome to ${setup.companyName}. Your repair country ${setup.countryName} begins with ${setup.townName}.`);
  }

  function ensurePickupEquipment(tech, call) {
    if (call.partQty <= 0) {
      return {
        ok: true,
        updatedParts: { ...game.parts },
        loadedMessage: "No part consumed for this minor service.",
      };
    }

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
      updatedParts: { ...game.parts, [call.partNeeded]: shopStock - missing },
      loadedMessage: `Loaded ${missing} ${call.partNeeded} from Parts Store into pickup.`,
    };
  }

  function dispatchTechnician(call, technicianId) {
    const tech = game.technicians.find((item) => item.id === technicianId);
    if (!tech) return;

    if (tech.status === "Hospital") {
      setMessage(`${tech.name} is in clinic and cannot work.`);
      return;
    }

    const equipmentCheck = ensurePickupEquipment(tech, call);

    if (!equipmentCheck.ok) {
      setMessage(equipmentCheck.loadedMessage);
      setActiveTab("market");
      return;
    }

    const skillMatch = tech.skill === call.skill || tech.skill === "All-Rounder";
    const moraleBonus = tech.morale >= 80 ? 0.9 : 1;
    const truckSpeed = 1 - Math.min(0.35, ((tech.truckLevel || 1) - 1) * 0.04);
    const areaBonus = tech.assignedAreaId === call.areaId ? 0.78 : 1;

    const travelTime = Math.max(4, Math.floor(getGameSeconds(call.actualTravelMinutes) * truckSpeed * areaBonus));
    const repairTimeBase = getGameSeconds(call.actualRepairMinutes);
    const returnTime = Math.max(4, Math.floor(getGameSeconds(call.actualReturnMinutes) * truckSpeed * areaBonus));
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
      pendingApproval: false,
    };

    setGame((current) => ({
      ...current,
      parts: equipmentCheck.updatedParts,
      activeJobs: [...current.activeJobs, activeJob],
      technicians: current.technicians.map((item) => {
        if (item.id !== tech.id) return item;

        const currentPickupStock = item.pickupEquipment?.[call.partNeeded] || 0;

        return {
          ...item,
          status: "Travelling",
          currentJobId: activeJob.jobId,
          pickupEquipment: {
            ...item.pickupEquipment,
            [call.partNeeded]: currentPickupStock >= call.partQty ? currentPickupStock - call.partQty : 0,
          },
        };
      }),
    }));

    setAvailableCalls((calls) => calls.filter((item) => item.id !== call.id));
    setActiveTab("jobs");
    setMessage(`${tech.name} is travelling to ${call.mapPoint}. ETA ${formatEta(travelTime)}. ${equipmentCheck.loadedMessage}`);
  }

  function approveExtraIssue(jobId) {
    setGame((current) => ({
      ...current,
      activeJobs: current.activeJobs.map((job) =>
        job.jobId === jobId
          ? {
              ...job,
              pendingApproval: false,
              approvedExtraIssue: true,
              issueText: "Extra issue approved. Technician is continuing repair.",
              phaseRemaining: job.phaseRemaining + (job.extraIssueTime || 25),
              phaseTotal: job.phaseTotal + (job.extraIssueTime || 25),
            }
          : job
      ),
    }));

    setMessage("Extra issue approved. Repair continues.");
  }

  function declineExtraIssue(jobId) {
    setGame((current) => ({
      ...current,
      activeJobs: current.activeJobs.map((job) =>
        job.jobId === jobId
          ? {
              ...job,
              pendingApproval: false,
              issueText: "Extra issue declined. Technician will finish only the original repair.",
            }
          : job
      ),
    }));

    setMessage("Extra issue declined. Technician continues original repair only.");
  }

  function sendBackup(jobId, technicianId) {
    const backupTech = game.technicians.find((tech) => tech.id === technicianId);
    const job = game.activeJobs.find((item) => item.jobId === jobId);
    if (!backupTech || !job) return;

    const supportTime = job.urgency === "Critical" ? 45 : 30;

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
        tech.id === backupTech.id ? { ...tech, status: "Supporting", currentJobId: jobId } : tech
      ),
    }));

    setMessage(`${backupTech.name} is going as backup. Extra issue ETA: ${formatEta(supportTime)}.`);
  }

  function refreshCalls() {
    setAvailableCalls(getRandomServiceCalls(game));
    setMessage("New service calls received from your planned area.");
  }

  function buildTownTile(building) {
    if (game.level < building.unlockLevel) {
      setMessage(`${building.type} unlocks at Level ${building.unlockLevel}.`);
      return;
    }

    const area = getActiveArea(game);

    if (area.tiles.length >= area.landSlots) {
      setMessage("No free land slots in this area. Expand the area from Globe or upgrade Yard.");
      return;
    }

    if (game.coins < building.costCoins || game.money < building.costMoney) {
      setMessage(`Need ${building.costCoins} coins and ${building.costMoney} money.`);
      return;
    }

    const newTile = {
      id: createId(),
      type: building.type,
      icon: building.icon,
      level: 1,
      status: "building",
      remaining: building.buildTime,
      totalTime: building.buildTime,
      family: building.family,
      value: building.value,
    };

    setGame((current) => ({
      ...current,
      coins: current.coins - building.costCoins,
      money: current.money - building.costMoney,
      worldAreas: current.worldAreas.map((areaItem) =>
        areaItem.id === current.activeAreaId
          ? {
              ...areaItem,
              tiles: [...areaItem.tiles, newTile],
            }
          : areaItem
      ),
    }));

    setMessage(`${building.type} construction started. Build time: ${formatEta(building.buildTime)}.`);
  }

  function cutRibbon(areaId, tileId) {
    let openedTile = null;

    setGame((current) => ({
      ...current,
      worldValue:
        current.worldValue +
        (current.worldAreas
          .find((area) => area.id === areaId)
          ?.tiles.find((tile) => tile.id === tileId)?.value || 0),
      worldAreas: current.worldAreas.map((area) =>
        area.id === areaId
          ? {
              ...area,
              tiles: area.tiles.map((tile) => {
                if (tile.id !== tileId) return tile;
                openedTile = tile;
                return {
                  ...tile,
                  status: "complete",
                  ribbonCut: true,
                };
              }),
            }
          : area
      ),
    }));

    if (openedTile) {
      setRibbonTile(openedTile);
      setMessage(`Ribbon cutting complete! ${openedTile.type} is now open.`);
      setTimeout(() => setRibbonTile(null), 2600);
    }
  }

  function buyPart(part, qty) {
    if (game.level < part.unlockLevel) {
      setMessage(`${part.name} unlocks at Company Level ${part.unlockLevel}.`);
      return;
    }

    if (inventoryUsed + qty > storageCapacity) {
      setMessage(`Storage full. Upgrade Parts Store or build Warehouse. Capacity: ${inventoryUsed}/${storageCapacity}.`);
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
      parts: { ...current.parts, [part.name]: (current.parts[part.name] || 0) + qty },
    }));

    setMessage(`Marketplace purchase: ${qty} ${part.name} for ${cost} coins.`);
  }

  function sellPart(part, qty) {
    const stock = game.parts[part.name] || 0;

    if (stock < qty) {
      setMessage(`Not enough ${part.name} to sell.`);
      return;
    }

    const earnings = part.sell * qty;

    setGame((current) => ({
      ...current,
      coins: current.coins + earnings,
      parts: { ...current.parts, [part.name]: Math.max(0, (current.parts[part.name] || 0) - qty) },
    }));

    setMessage(`Sold ${qty} ${part.name} for ${earnings} coins.`);
  }

  function autoRestock() {
    let totalCost = 0;
    let totalQty = 0;
    const newParts = { ...game.parts };

    availableParts.forEach((part) => {
      const stock = newParts[part.name] || 0;
      if (stock < part.reorder) {
        const qty = part.reorder - stock;
        totalQty += qty;
        totalCost += qty * part.cost;
        newParts[part.name] = part.reorder;
      }
    });

    if (totalCost === 0) {
      setMessage("All unlocked parts are already above reorder level.");
      return;
    }

    if (inventoryUsed + totalQty > storageCapacity) {
      setMessage("Not enough storage for auto restock.");
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

    setMessage(`Parts Store auto-restocked for ${totalCost} coins.`);
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
        item.id === technicianId ? { ...item, pickupEquipment: newEquipment } : item
      ),
    }));

    setMessage(`${tech.name}'s pickup equipment was loaded from the Parts Store.`);
  }

  function hireTechnician() {
    if (game.level < 5) {
      setMessage("First technician unlocks at Company Level 5.");
      return;
    }

    if (game.technicians.length >= maxTechnicians) {
      if (game.level < 21) {
        setMessage("From Level 5 to Level 20, only owner + first technician are allowed. Expand globally at Level 21.");
      } else {
        setMessage("Technician capacity full. Expand globe areas or level up more.");
      }
      return;
    }

    const cost = 700 + game.technicians.length * 350;

    if (game.coins < cost) {
      setMessage(`You need ${cost} coins to hire a technician.`);
      return;
    }

    const name = TECHNICIAN_NAMES[Math.floor(Math.random() * TECHNICIAN_NAMES.length)];
    const newTech = createTechnician(name, false, game.activeAreaId);

    setGame((current) => ({
      ...current,
      coins: current.coins - cost,
      technicians: [...current.technicians, newTech],
    }));

    setMessage(`${newTech.name} joined as ${newTech.skill} technician.`);
  }

  function trainTechnician(techId) {
    const tech = game.technicians.find((item) => item.id === techId);
    if (!tech) return;

    const cost = 60 + (tech.level || 1) * 12;

    if (game.money < cost) {
      setMessage(`Training needs ${cost} money.`);
      return;
    }

    setGame((current) => ({
      ...current,
      money: current.money - cost,
      technicians: current.technicians.map((item) =>
        item.id === techId
          ? { ...item, xp: (item.xp || 0) + 70 + current.trainingLevel * 20, morale: Math.min(100, item.morale + 3) }
          : item
      ),
    }));

    setMessage(`${tech.name} completed training and gained experience.`);
  }

  function assignTechnicianArea(techId, areaId) {
    setGame((current) => ({
      ...current,
      technicians: current.technicians.map((tech) =>
        tech.id === techId ? { ...tech, assignedAreaId: areaId } : tech
      ),
    }));

    const areaName = getArea(game, areaId)?.name || "new area";
    setMessage(`Technician assigned to ${areaName}.`);
  }

  function upgradeTruck(techId) {
    const tech = game.technicians.find((item) => item.id === techId);
    if (!tech) return;

    const cost = 90 + (tech.truckLevel || 1) * 75;

    if (game.money < cost) {
      setMessage(`Truck upgrade needs ${cost} money.`);
      return;
    }

    setGame((current) => ({
      ...current,
      money: current.money - cost,
      technicians: current.technicians.map((item) =>
        item.id === techId ? { ...item, truckLevel: (item.truckLevel || 1) + 1 } : item
      ),
    }));

    setMessage(`${tech.name}'s pickup upgraded. Travel time and energy loss improve.`);
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
      technicians: current.technicians.map((tech) => ({ ...tech, morale: Math.min(100, tech.morale + 15) })),
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
          ? { ...tech, status: "Day Off", morale: Math.min(100, tech.morale + 18), daysOffTaken: tech.daysOffTaken + 1 }
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
        tech.id === request.technicianId ? { ...tech, morale: Math.max(20, tech.morale - 12) } : tech
      ),
    }));

    setMessage(`${request.technicianName}'s day off was denied. Morale decreased.`);
  }

  function signContract(contract) {
    if (game.level < contract.unlockLevel) {
      setMessage(`${contract.name} unlocks at Company Level ${contract.unlockLevel}.`);
      return;
    }

    if (game.signedContracts?.includes(contract.id)) {
      setMessage(`${contract.name} is already signed.`);
      return;
    }

    if (game.money < contract.cost) {
      setMessage(`You need ${contract.cost} money to sign ${contract.name}.`);
      return;
    }

    setGame((current) => ({
      ...current,
      money: current.money - contract.cost,
      signedContracts: [...(current.signedContracts || []), contract.id],
    }));

    setMessage(`${contract.name} signed. Future jobs will earn better rewards.`);
  }

  function upgradeYard() {
    const cost = 150 + game.yardLevel * 120;

    if (game.money < cost) {
      setMessage(`Yard upgrade needs ${cost} money.`);
      return;
    }

    setGame((current) => ({
      ...current,
      money: current.money - cost,
      yardLevel: current.yardLevel + 1,
      worldAreas: current.worldAreas.map((area) =>
        area.id === current.activeAreaId ? { ...area, landSlots: area.landSlots + 2 } : area
      ),
      worldValue: current.worldValue + 400,
    }));

    setMessage("Yard upgraded. Active area land slots increased.");
  }

  function upgradePartShop() {
    const cost = 120 + game.partShopLevel * 110;

    if (game.money < cost) {
      setMessage(`Parts Store upgrade needs ${cost} money.`);
      return;
    }

    setGame((current) => ({
      ...current,
      money: current.money - cost,
      partShopLevel: current.partShopLevel + 1,
      storageBase: current.storageBase + 15,
      worldValue: current.worldValue + 300,
    }));

    setMessage("Parts Store upgraded. Inventory storage increased.");
  }

  function upgradeTraining() {
    const cost = 140 + game.trainingLevel * 130;

    if (game.money < cost) {
      setMessage(`Training upgrade needs ${cost} money.`);
      return;
    }

    setGame((current) => ({
      ...current,
      money: current.money - cost,
      trainingLevel: current.trainingLevel + 1,
      worldValue: current.worldValue + 350,
    }));

    setMessage("Training upgraded. Technician training gives more XP.");
  }

  function expandToNewArea() {
    if (game.level < 21) {
      setMessage("Globe expansion unlocks at Company Level 21.");
      return;
    }

    const cost = getNextAreaCost(game);

    if (game.coins < cost.coins || game.money < cost.money) {
      setMessage(`New area needs ${cost.coins} coins and ${cost.money} money.`);
      return;
    }

    const newAreaName = getNextAreaName(game);
    const newAreaId = `area-${game.worldAreas.length + 1}`;

    const newArea = {
      id: newAreaId,
      name: newAreaName,
      unlocked: true,
      landSlots: 8,
      theme: "New service territory",
      tiles: [
        {
          id: `${newAreaId}-road`,
          type: "Road",
          icon: "🛣️",
          level: 1,
          status: "complete",
          family: false,
          value: 100,
        },
        {
          id: `${newAreaId}-field`,
          type: "Expansion Field",
          icon: "🌍",
          level: 1,
          status: "complete",
          family: false,
          value: 200,
        },
      ],
    };

    setGame((current) => ({
      ...current,
      coins: current.coins - cost.coins,
      money: current.money - cost.money,
      activeAreaId: newAreaId,
      worldAreas: [...current.worldAreas, newArea],
      worldValue: current.worldValue + 1000,
    }));

    setAvailableCalls(getRandomServiceCalls({ ...game, activeAreaId: newAreaId, worldAreas: [...game.worldAreas, newArea] }));
    setMessage(`${newAreaName} unlocked! Your repair company is now growing across the globe.`);
  }

  function switchArea(areaId) {
    setGame((current) => ({ ...current, activeAreaId: areaId }));
    const nextGame = { ...game, activeAreaId: areaId };
    setAvailableCalls(getRandomServiceCalls(nextGame));
    setMessage(`Switched to ${getArea(game, areaId)?.name || "area"}.`);
  }

  function addFriend() {
    const available = FRIEND_NAMES.filter((friend) => !game.friends.includes(friend));

    if (available.length === 0) {
      setMessage("No more suggested friends right now.");
      return;
    }

    const friend = available[Math.floor(Math.random() * available.length)];

    setGame((current) => ({ ...current, friends: [...current.friends, friend] }));
    setMessage(`${friend} added as in-game friend.`);
  }

  function createClub() {
    if (game.level < 5) {
      setMessage("Clubs unlock at Company Level 5.");
      return;
    }

    if (game.club) {
      setMessage("You already have a club.");
      return;
    }

    if (game.money < 120) {
      setMessage("You need 120 money to create a club.");
      return;
    }

    setGame((current) => ({
      ...current,
      money: current.money - 120,
      club: {
        name: `${current.companyName} Club`,
        members: [current.companyName, ...current.friends.slice(0, 4)],
        level: 1,
      },
    }));

    setMessage("Club created. You can start team events.");
  }

  function startClubEvent() {
    if (!game.club) {
      setMessage("Create a club first.");
      return;
    }

    if (game.clubEvent) {
      setMessage("A club event is already running.");
      return;
    }

    const scale = Math.max(1, Math.floor(game.level / 5));

    setGame((current) => ({
      ...current,
      clubEvent: {
        name: `Highway Rescue Event L${scale}`,
        remaining: 120 + scale * 20,
        rewardCoins: 500 + scale * 180,
        rewardMoney: 80 + scale * 25,
        rewardRep: 10 + scale * 4,
      },
    }));

    setMessage("Club event started.");
  }

  function linkGooglePlay() {
    if (!googleName.trim()) {
      setMessage("Enter your Google Play name first.");
      return;
    }

    setGame((current) => ({
      ...current,
      googlePlayLinked: true,
      googlePlayName: googleName.trim(),
    }));

    setMessage("Google Play restore prototype linked. Real sync needs Firebase or Play Games Services later.");
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
    [
      SAVE_KEY,
      "fleetfix-tycoon-save-v11",
      "fleetfix-tycoon-save-v10",
      "fleetfix-tycoon-save-v9",
      "fleetfix-tycoon-save-v8",
      "fleetfix-tycoon-save-v7",
      "fleetfix-tycoon-save-v6",
      "fleetfix-tycoon-save-v5",
      "fleetfix-tycoon-save-v4",
      "fleetfix-tycoon-save-v3",
      "fleetfix-tycoon-save-v2",
      "fleetfix-tycoon-save",
    ].forEach((key) => localStorage.removeItem(key));

    setGame(STARTING_GAME);
    setSetup({ companyName: "", ownerName: "", townName: "", countryName: "" });
    setAvailableCalls([]);
    setActiveTab("town");
    setMessage("Game reset.");
  }

  if (!game.started) {
    return (
      <main style={styles.startPage}>
        <section style={styles.startCard}>
          <div style={styles.logo}>🛠️🌍</div>
          <h1 style={styles.title}>FleetFix Tycoon</h1>
          <p style={styles.subtitle}>
            Build your own repair country, design Township-style towns, complete repair calls, train technicians,
            cut ribbons for new buildings, and expand across the globe from Level 21.
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
              label="First Town Name"
              placeholder="Phoenix Valley"
              value={setup.townName}
              onChange={(value) => setSetup({ ...setup, townName: value })}
            />
            <InputBox
              label="Country / World Name"
              placeholder="Repair Nation"
              value={setup.countryName}
              onChange={(value) => setSetup({ ...setup, countryName: value })}
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
      {popup && (
        <div style={styles.popupOverlay}>
          <div style={styles.popupCard}>
            <h3 style={styles.cardTitle}>💭 {popup.title}</h3>
            <p style={styles.smallText}>{popup.text}</p>
            <button style={styles.mainButtonSmall} onClick={() => setPopup(null)}>
              Okay
            </button>
          </div>
        </div>
      )}

      {ribbonTile && (
        <div style={styles.ribbonOverlay}>
          <div style={styles.ribbonCard}>
            <div style={styles.ribbonEmoji}>🎀✂️</div>
            <h2 style={styles.sectionTitle}>Ribbon Cutting!</h2>
            <p style={styles.smallText}>{ribbonTile.icon} {ribbonTile.type} is now open.</p>
          </div>
        </div>
      )}

      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>🛠️ {game.companyName}</h1>
          <p style={styles.smallText}>
            Owner: {game.ownerName} • Country: {game.countryName} • Active Area: {activeArea.name}
          </p>
          <p style={styles.rankText}>🏆 {companyRank}</p>
        </div>

        <div style={styles.statsGrid}>
          <Stat label="Coins" value={`🪙 ${game.coins}`} />
          <Stat label="Money" value={`💵 ${game.money}`} />
          <Stat label="XP" value={`${game.xp}/${getXpNeeded(game.level)}`} />
          <Stat label="Level" value={game.level} />
          <Stat label="Rep" value={`⭐ ${game.reputation}`} />
          <Stat label="Day" value={`${game.day} / ${game.dayTimer}s`} />
          <Stat label="Storage" value={`${inventoryUsed}/${storageCapacity}`} />
          <Stat label="Techs" value={`${game.technicians.length}/${maxTechnicians}`} />
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

        {activeTab === "town" && (
          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🏙️ {activeArea.name}</h2>
                <p style={styles.smallText}>
                  Township-style planned town. Buildings take time, then open with ribbon cutting.
                </p>
              </div>

              <button style={styles.dangerButton} onClick={resetGame}>Reset</button>
            </div>

            <div style={styles.empireStats}>
              <MiniStat title="World Value" value={`🏙️ ${game.worldValue}`} />
              <MiniStat title="Land Slots" value={`${activeArea.tiles.length}/${activeArea.landSlots}`} />
              <MiniStat title="Daily Salary" value={`🧾 ${totalDailySalary}`} />
              <MiniStat title="Contract Bonus" value={`🪙 +${contractBonuses.coinBonusPercent}% / 💵 +${contractBonuses.moneyBonusPercent}%`} />
            </div>

            <div style={styles.townGrid}>
              {activeArea.tiles.map((tile) => {
                const progress =
                  tile.status === "building"
                    ? Math.round(100 - ((tile.remaining || 0) / (tile.totalTime || 1)) * 100)
                    : 100;

                return (
                  <div
                    key={tile.id}
                    style={
                      tile.status === "building"
                        ? styles.townTileBuilding
                        : tile.status === "readyRibbon"
                        ? styles.townTileRibbon
                        : styles.townTile
                    }
                  >
                    <div style={styles.tileIcon}>{tile.icon}</div>
                    <b>{tile.type}</b>
                    <span>Lvl {tile.level}</span>

                    {tile.status === "building" && (
                      <>
                        <span>Building: {formatEta(tile.remaining || 0)}</span>
                        <div style={styles.progressOuter}>
                          <div style={{ ...styles.progressInner, width: `${progress}%` }} />
                        </div>
                      </>
                    )}

                    {tile.status === "readyRibbon" && (
                      <button style={styles.greenSmallButton} onClick={() => cutRibbon(activeArea.id, tile.id)}>
                        🎀 Cut Ribbon
                      </button>
                    )}

                    {tile.status === "complete" && <small>Open</small>}
                    {tile.family && <small>Family friendly</small>}
                  </div>
                );
              })}
            </div>

            <h3 style={styles.subTitle}>Construct Buildings</h3>

            <div style={styles.cardsGrid}>
              {TOWN_BUILDINGS.map((building) => (
                <div key={building.type} style={styles.partCard}>
                  <div style={styles.partIcon}>{building.icon}</div>
                  <h3 style={styles.cardTitle}>{building.type}</h3>
                  <p style={styles.smallText}>{building.description}</p>
                  <p style={styles.smallText}>Unlock Level: {building.unlockLevel}</p>
                  <p style={styles.smallText}>Build Time: {formatEta(building.buildTime)}</p>
                  <p style={styles.smallText}>Cost: 🪙 {building.costCoins} • 💵 {building.costMoney}</p>
                  <button
                    style={game.level >= building.unlockLevel ? styles.darkButton : styles.lockedButton}
                    onClick={() => buildTownTile(building)}
                  >
                    Start Construction
                  </button>
                </div>
              ))}
            </div>

            <h3 style={styles.subTitle}>2.5D Town Preview</h3>

            <div style={styles.gameMap}>
              <div style={styles.skyGlow} />
              <Building style={styles.garageBuilding} icon="🏚️" title="Garage" />
              <Building style={styles.partsBuilding} icon="🏪" title="Parts Store" />
              <Building style={styles.roadsideBuilding} icon="🚨" title="Call Center" />
              <Building style={styles.yardBuilding} icon="🏥" title="Clinic" />
              <Building style={styles.emptyBuilding} icon="🌍" title="Expansion" />
              <div style={styles.roadMain} />
              <div style={styles.roadLineOne} />
              <div style={styles.roadLineTwo} />
              <div style={styles.roadLineThree} />

              {game.activeJobs.map((job, index) => (
                <div
                  key={job.jobId}
                  style={{ ...styles.movingVehicle, left: `${getVehiclePosition(job)}%`, top: `${58 + index * 7}%` }}
                >
                  <PickupTruck />
                  <div style={styles.vehicleLabel}>{job.technicianName}</div>
                </div>
              ))}

              {game.activeJobs.length === 0 && (
                <div style={styles.mapHint}>Dispatch a technician to see service pickup movement.</div>
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
                  Requests come from roads, schools, parks, gyms, hospitals, warehouses, malls and your designed areas.
                </p>
              </div>
              <button style={styles.darkButton} onClick={refreshCalls}>Refresh Calls</button>
            </div>

            <div style={styles.cardsGrid}>
              {availableCalls.map((call) => {
                const travel = getGameSeconds(call.actualTravelMinutes);
                const repair = getGameSeconds(call.actualRepairMinutes);
                const back = getGameSeconds(call.actualReturnMinutes);

                return (
                  <div key={call.id} style={call.noPayment ? styles.charityCard : styles.callCard}>
                    <div style={styles.callTop}>
                      <div style={styles.cardIcon}>{call.icon}</div>
                      <span style={{ ...styles.urgencyBadge, ...getUrgencyStyle(call.urgency) }}>
                        {call.urgency}
                      </span>
                    </div>

                    <h3 style={styles.cardTitle}>{call.title}</h3>
                    <p style={styles.smallText}>{call.problem}</p>

                    <div style={styles.infoList}>
                      <p><b>Location:</b> {call.mapPoint}</p>
                      <p><b>Skill:</b> {call.skill}</p>
                      <p><b>Parts:</b> {call.partQty} {call.partNeeded}</p>
                      <p><b>ETA:</b> Go {formatEta(travel)} • Repair {formatEta(repair)} • Return {formatEta(back)}</p>
                      <p><b>Reward:</b> 🪙 {call.rewardCoins} • 💵 {call.rewardMoney} • XP {call.rewardXp}</p>
                    </div>

                    <div style={styles.buttonStack}>
                      {freeTechnicians.length === 0 ? (
                        <div style={styles.warningBox}>No free technicians.</div>
                      ) : (
                        freeTechnicians.map((tech) => (
                          <button
                            key={tech.id}
                            style={tech.skill === call.skill || tech.skill === "All-Rounder" ? styles.greenSmallButton : styles.orangeSmallButton}
                            onClick={() => dispatchTechnician(call, tech.id)}
                          >
                            Send {tech.name} {tech.assignedAreaId === call.areaId ? "📍" : ""}
                          </button>
                        ))
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
                      <p style={styles.smallText}>Unlocks at Level {call.unlock}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Panel>
        )}

        {activeTab === "jobs" && (
          <Panel>
            <h2 style={styles.sectionTitle}>⏱️ Active Jobs</h2>
            <p style={styles.smallText}>Technicians report extra issues. You approve before they continue.</p>

            <div style={styles.cardsGrid}>
              {game.activeJobs.length === 0 ? (
                <EmptyBox text="No active jobs. Dispatch a technician from service calls." />
              ) : (
                game.activeJobs.map((job) => {
                  const progress = ((job.phaseTotal - job.phaseRemaining) / job.phaseTotal) * 100;
                  const backupOptions = freeTechnicians.filter((tech) => tech.id !== job.technicianId);

                  return (
                    <div key={job.jobId} style={job.pendingApproval || job.needsSupport ? styles.issueJobCard : styles.jobCard}>
                      <div style={styles.jobTop}>
                        <div>
                          <h3 style={styles.cardTitle}>{job.icon} {job.title}</h3>
                          <p style={styles.smallText}>Technician: {job.technicianName}</p>
                          <p style={styles.smallText}>Location: {job.mapPoint}</p>
                          <p style={styles.phaseText}>{getJobPhaseLabel(job)}</p>
                          {job.skillMatch && <p style={styles.bonusText}>⚡ Skill match bonus</p>}
                          {job.issueText && <div style={styles.warningBox}>{job.issueText}</div>}
                          {job.supportAssigned && <p style={styles.bonusText}>Support: {job.supportTechnicianName} • ETA {formatEta(job.supportRemaining)}</p>}
                        </div>

                        <span style={styles.timerBadge}>
                          {job.pendingApproval ? "Approval" : job.needsSupport && !job.supportAssigned ? "Paused" : formatEta(job.phaseRemaining)}
                        </span>
                      </div>

                      <div style={styles.progressOuter}>
                        <div style={{ ...styles.progressInner, width: `${progress}%` }} />
                      </div>

                      {job.pendingApproval && (
                        <div style={styles.actionRow}>
                          <button style={styles.greenSmallButton} onClick={() => approveExtraIssue(job.jobId)}>Approve Extra Issue</button>
                          <button style={styles.dangerSmallButton} onClick={() => declineExtraIssue(job.jobId)}>Decline</button>
                        </div>
                      )}

                      {job.needsSupport && !job.supportAssigned && (
                        <div style={styles.buttonStack}>
                          {backupOptions.length === 0 ? (
                            <div style={styles.warningBox}>No backup technician available.</div>
                          ) : (
                            backupOptions.map((tech) => (
                              <button key={tech.id} style={styles.greenSmallButton} onClick={() => sendBackup(job.jobId, tech.id)}>
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
                <h2 style={styles.sectionTitle}>👨‍🔧 Technicians</h2>
                <p style={styles.smallText}>
                  Rule: Level 1–4 owner only. Level 5–20 owner + first technician only. Level 21 unlocks global workforce.
                </p>
              </div>
              <button style={styles.mainButtonSmall} onClick={paySalaries}>Pay Salaries — 🧾 {game.salaryDue}</button>
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
                      <button style={styles.greenSmallButton} onClick={() => approveDayOff(request.id)}>Approve</button>
                      <button style={styles.dangerSmallButton} onClick={() => denyDayOff(request.id)}>Deny</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.cardsGrid}>
              {game.technicians.map((tech) => (
                <div key={tech.id} style={tech.status === "Hospital" ? styles.hospitalTechCard : styles.techCard}>
                  <div style={styles.techAvatar}>{tech.avatar}</div>
                  <div style={styles.jobTop}>
                    <h3 style={styles.cardTitle}>{tech.isOwner ? "👑" : "🔧"} {tech.name}</h3>
                    <span style={styles.statusBadge}>{tech.status}</span>
                  </div>

                  <p style={styles.smallText}>Skill: {tech.skill}</p>
                  <p style={styles.smallText}>Assigned Area: {getArea(game, tech.assignedAreaId)?.name}</p>
                  <p style={styles.smallText}>Truck Level: {tech.truckLevel}</p>
                  <p style={styles.smallText}>Tech Level: {tech.level} • XP {tech.xp || 0}/{getTechnicianXpNeeded(tech.level || 1)}</p>
                  <p style={styles.smallText}>Salary/day: 🧾 {getSalaryForLevel(tech.level || 1, tech.isOwner)} {tech.isOwner ? "(Owner)" : ""}</p>

                  {tech.status === "Hospital" && <p style={styles.warningBox}>Clinic recovery: {tech.hospitalDays} day(s)</p>}

                  <Bar label="Energy" value={tech.energy} color="#16a34a" />
                  <Bar label="Morale" value={tech.morale} color="#2563eb" />

                  <div style={styles.pickupBox}>
                    <b>Pickup Equipment</b>
                    {availableParts.map((part) => (
                      <span key={part.name}>{part.icon} {part.name}: {tech.pickupEquipment?.[part.name] || 0}</span>
                    ))}
                    <button style={styles.lightSmallButton} onClick={() => loadPickupEquipment(tech.id)}>Load Pickup</button>
                  </div>

                  <select style={styles.input} value={tech.assignedAreaId} onChange={(e) => assignTechnicianArea(tech.id, e.target.value)}>
                    {unlockedAreas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}
                  </select>

                  <div style={styles.actionRow}>
                    <button style={styles.greenSmallButton} onClick={() => trainTechnician(tech.id)}>Train 💵</button>
                    <button style={styles.orangeSmallButton} onClick={() => upgradeTruck(tech.id)}>Upgrade Pickup 💵</button>
                  </div>

                  {renameId === tech.id ? (
                    <div style={styles.renameBox}>
                      <input style={styles.input} value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
                      <button style={styles.greenSmallButton} onClick={saveRename}>Save</button>
                    </div>
                  ) : (
                    <button style={styles.lightSmallButton} onClick={() => startRename(tech)}>Rename</button>
                  )}
                </div>
              ))}
            </div>

            <div style={styles.actionRow}>
              <button style={game.level >= 5 ? styles.darkFullButton : styles.lockedFullButton} onClick={hireTechnician}>
                {game.level < 5
                  ? "Hire Technician Locked Until Level 5"
                  : game.technicians.length >= maxTechnicians
                  ? `Technician Limit Reached ${game.technicians.length}/${maxTechnicians}`
                  : `Hire Technician — 🪙 ${700 + game.technicians.length * 350}`}
              </button>
            </div>
          </Panel>
        )}

        {activeTab === "market" && (
          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🛒 Parts Marketplace</h2>
                <p style={styles.smallText}>Buy for your self-operated shop or sell extra inventory.</p>
              </div>
              <button style={styles.mainButtonSmall} onClick={autoRestock}>Auto Restock</button>
            </div>

            <div style={styles.empireStats}>
              <MiniStat title="Storage Used" value={`${inventoryUsed}/${storageCapacity}`} />
              <MiniStat title="Parts Store Level" value={game.partShopLevel} />
              <MiniStat title="Warehouse Bonus" value={`+${game.worldAreas.reduce((sum, area) => sum + area.tiles.filter((tile) => tile.type === "Warehouse" && tile.status === "complete").length * 35, 0)}`} />
            </div>

            <div style={styles.cardsGrid}>
              {availableParts.map((part) => {
                const stock = game.parts[part.name] || 0;
                const low = stock < part.reorder;

                return (
                  <div key={part.name} style={low ? styles.lowPartCard : styles.partCard}>
                    <div style={styles.partIcon}>{part.icon}</div>
                    <h3 style={styles.cardTitle}>{part.name}</h3>
                    <p style={styles.smallText}>Stock: <b>{stock}</b> • Reorder: {part.reorder}</p>
                    <p style={styles.smallText}>Buy: 🪙 {part.cost} • Sell: 🪙 {part.sell}</p>
                    {low && <div style={styles.warningBox}>Low stock</div>}
                    <div style={styles.partButtons}>
                      <button style={styles.orangeSmallButton} onClick={() => buyPart(part, 1)}>Buy 1</button>
                      <button style={styles.darkButton} onClick={() => buyPart(part, 5)}>Buy 5</button>
                      <button style={styles.greenSmallButton} onClick={() => buyPart(part, 10)}>Buy 10</button>
                      <button style={styles.lightSmallButton} onClick={() => sellPart(part, 1)}>Sell 1</button>
                      <button style={styles.lightSmallButton} onClick={() => sellPart(part, 5)}>Sell 5</button>
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
                      <p style={styles.smallText}>Unlocks at Level {part.unlockLevel}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Panel>
        )}

        {activeTab === "contracts" && (
          <Panel>
            <h2 style={styles.sectionTitle}>📄 Endless Company Contracts</h2>
            <p style={styles.smallText}>Use money to sign contracts. More contracts keep unlocking as levels rise.</p>

            <div style={styles.cardsGrid}>
              {contracts.map((contract) => {
                const signed = game.signedContracts?.includes(contract.id);
                const locked = game.level < contract.unlockLevel;

                return (
                  <div key={contract.id} style={signed ? styles.contractSignedCard : styles.contractCard}>
                    <div style={styles.cardIcon}>{locked ? "🔒" : "📄"}</div>
                    <h3 style={styles.cardTitle}>{contract.name}</h3>
                    <p style={styles.smallText}>Unlock Level: {contract.unlockLevel}</p>
                    <p style={styles.smallText}>Cost: 💵 {contract.cost}</p>
                    <p style={styles.smallText}>Bonus: +{contract.coin}% coins, +{contract.money}% money</p>
                    <button
                      style={signed ? styles.ownedButton : locked ? styles.lockedButton : styles.darkButton}
                      disabled={signed}
                      onClick={() => signContract(contract)}
                    >
                      {signed ? "Signed" : locked ? `Locked until Level ${contract.unlockLevel}` : "Sign Contract"}
                    </button>
                  </div>
                );
              })}
            </div>
          </Panel>
        )}

        {activeTab === "globe" && (
          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🌍 Globe Expansion</h2>
                <p style={styles.smallText}>
                  At Level 21, expand beyond your first town. Each new area becomes another planned service town.
                </p>
              </div>
              <button style={game.level >= 21 ? styles.greenSmallButton : styles.lockedButton} onClick={expandToNewArea}>
                {game.level >= 21 ? "Expand to New Area" : "Unlocks at Level 21"}
              </button>
            </div>

            <div style={styles.empireStats}>
              <MiniStat title="Country" value={game.countryName} />
              <MiniStat title="Unlocked Areas" value={unlockedAreas.length} />
              <MiniStat title="Next Area Coins" value={`🪙 ${getNextAreaCost(game).coins}`} />
              <MiniStat title="Next Area Money" value={`💵 ${getNextAreaCost(game).money}`} />
            </div>

            <div style={styles.globeMap}>
              {game.worldAreas.map((area, index) => (
                <button
                  key={area.id}
                  style={area.id === game.activeAreaId ? styles.globeNodeActive : styles.globeNode}
                  onClick={() => switchArea(area.id)}
                >
                  <span style={styles.globeEmoji}>{area.unlocked ? "🌍" : "🔒"}</span>
                  <b>{area.name}</b>
                  <small>{area.tiles.length}/{area.landSlots} slots</small>
                  <small>Area {index + 1}</small>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {activeTab === "upgrades" && (
          <Panel>
            <h2 style={styles.sectionTitle}>⬆️ Business Upgrades</h2>
            <p style={styles.smallText}>Use money to upgrade yards, storage, training, pickup trucks and workforce systems.</p>

            <div style={styles.cardsGrid}>
              <div style={styles.contractCard}>
                <h3 style={styles.cardTitle}>🚚 Yard Level {game.yardLevel}</h3>
                <p style={styles.smallText}>Increases active area land slots.</p>
                <button style={styles.greenSmallButton} onClick={upgradeYard}>
                  Upgrade Yard 💵 {150 + game.yardLevel * 120}
                </button>
              </div>

              <div style={styles.contractCard}>
                <h3 style={styles.cardTitle}>🏪 Parts Store Level {game.partShopLevel}</h3>
                <p style={styles.smallText}>Increases inventory storage.</p>
                <button style={styles.greenSmallButton} onClick={upgradePartShop}>
                  Upgrade Parts Store 💵 {120 + game.partShopLevel * 110}
                </button>
              </div>

              <div style={styles.contractCard}>
                <h3 style={styles.cardTitle}>🎓 Training Level {game.trainingLevel}</h3>
                <p style={styles.smallText}>Training gives more technician experience.</p>
                <button style={styles.greenSmallButton} onClick={upgradeTraining}>
                  Upgrade Training 💵 {140 + game.trainingLevel * 130}
                </button>
              </div>

              <div style={styles.contractCard}>
                <h3 style={styles.cardTitle}>🤝 Friends & Clubs</h3>
                <p style={styles.smallText}>Prototype multiplayer systems for later backend integration.</p>
                <input
                  style={styles.input}
                  placeholder="Google Play name"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                />
                <button style={styles.greenSmallButton} onClick={linkGooglePlay}>
                  Link Restore Prototype
                </button>
                <button style={styles.darkButton} onClick={addFriend}>
                  Add In-Game Friend
                </button>
                <button style={game.level >= 5 ? styles.orangeSmallButton : styles.lockedButton} onClick={createClub}>
                  Create Club
                </button>
                <button style={game.club ? styles.darkButton : styles.lockedButton} onClick={startClubEvent}>
                  Start Club Event
                </button>

                {game.friends.length > 0 && (
                  <div style={styles.friendList}>
                    {game.friends.map((friend) => <span key={friend}>🤝 {friend}</span>)}
                  </div>
                )}

                {game.clubEvent && (
                  <div style={styles.warningBox}>
                    {game.clubEvent.name} • Remaining {formatEta(game.clubEvent.remaining)}
                  </div>
                )}
              </div>
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
      <input style={styles.input} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
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
      <div style={styles.pickupWheelBack}><div style={styles.pickupWheelInner} /></div>
      <div style={styles.pickupWheelFront}><div style={styles.pickupWheelInner} /></div>
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
    maxWidth: 880,
    background: "rgba(255,255,255,0.95)",
    border: "1px solid #fed7aa",
    borderRadius: 32,
    padding: 30,
    boxShadow: "0 30px 70px rgba(67,20,7,0.32)",
    textAlign: "center",
  },
  logo: { fontSize: 66, marginBottom: 10 },
  title: { fontSize: 48, margin: "0 0 12px", fontWeight: 900 },
  subtitle: { color: "#57534e", fontSize: 17, lineHeight: 1.6, maxWidth: 760, margin: "0 auto 24px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, textAlign: "left" },
  inputLabel: { display: "grid", gap: 6, fontWeight: 800 },
  input: {
    border: "1px solid #d6d3d1",
    borderRadius: 14,
    padding: "12px 13px",
    fontSize: 15,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    marginTop: 8,
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
  smallText: { margin: "6px 0", color: "#57534e", fontSize: 14, lineHeight: 1.45 },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
    gap: 8,
    minWidth: 320,
    flex: 1,
    maxWidth: 1050,
  },
  statBox: { background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 15, padding: "9px 10px" },
  statLabel: { margin: 0, color: "#78716c", fontSize: 11, textTransform: "uppercase", fontWeight: 900 },
  statValue: { margin: "4px 0 0", fontSize: 16, fontWeight: 900 },
  navBar: {
    maxWidth: 1180,
    margin: "14px auto 0",
    padding: "0 16px",
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
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
  popupOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 999, display: "grid", placeItems: "center", padding: 20 },
  popupCard: { width: "100%", maxWidth: 420, background: "white", borderRadius: 24, border: "1px solid #fed7aa", padding: 20, boxShadow: "0 30px 70px rgba(0,0,0,0.35)" },
  ribbonOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.38)", zIndex: 1000, display: "grid", placeItems: "center", padding: 20 },
  ribbonCard: { width: "100%", maxWidth: 420, background: "linear-gradient(135deg,#fff7ed,#ffffff)", borderRadius: 28, padding: 26, textAlign: "center", boxShadow: "0 35px 80px rgba(0,0,0,0.4)", border: "2px solid #fdba74" },
  ribbonEmoji: { fontSize: 70, animation: "none" },
  panel: { background: "rgba(255,255,255,0.94)", border: "1px solid #fed7aa", borderRadius: 28, padding: 20, boxShadow: "0 18px 40px rgba(67,20,7,0.08)" },
  sectionHeader: { display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", marginBottom: 14, flexWrap: "wrap" },
  sectionTitle: { margin: 0, fontSize: 24, fontWeight: 900 },
  subTitle: { margin: "24px 0 12px", fontSize: 20, fontWeight: 900 },
  empireStats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 18 },
  miniStat: { background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 16, padding: 12 },
  townGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 12, marginBottom: 18 },
  townTile: { background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: 18, padding: 12, display: "grid", gap: 4, textAlign: "center" },
  townTileBuilding: { background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 18, padding: 12, display: "grid", gap: 4, textAlign: "center" },
  townTileRibbon: { background: "#ecfccb", border: "2px solid #84cc16", borderRadius: 18, padding: 12, display: "grid", gap: 4, textAlign: "center" },
  tileIcon: { fontSize: 34 },
  gameMap: { position: "relative", height: 430, borderRadius: 30, overflow: "hidden", background: "linear-gradient(135deg, #facc15 0%, #fdba74 42%, #a8a29e 100%)", boxShadow: "inset 0 0 45px rgba(120,53,15,0.2)" },
  skyGlow: { position: "absolute", inset: 0, background: "radial-gradient(circle at 25% 20%, rgba(255,255,255,0.55), transparent 28%)" },
  roadMain: { position: "absolute", left: "5%", right: "5%", top: "58%", height: 74, background: "#292524", borderRadius: 999, transform: "skewY(-4deg)", boxShadow: "0 18px 26px rgba(0,0,0,0.25)" },
  roadLineOne: { position: "absolute", left: "18%", top: "66%", width: 70, height: 8, background: "#fde68a", borderRadius: 99, transform: "skewY(-4deg)" },
  roadLineTwo: { position: "absolute", left: "44%", top: "66%", width: 70, height: 8, background: "#fde68a", borderRadius: 99, transform: "skewY(-4deg)" },
  roadLineThree: { position: "absolute", left: "70%", top: "66%", width: 70, height: 8, background: "#fde68a", borderRadius: 99, transform: "skewY(-4deg)" },
  mapBuilding: { position: "absolute", width: 130, minHeight: 96, borderRadius: 22, background: "linear-gradient(135deg, #ffffff, #fed7aa)", border: "2px solid rgba(255,255,255,0.8)", boxShadow: "10px 16px 0 rgba(67,20,7,0.2), 0 20px 28px rgba(0,0,0,0.16)", display: "grid", placeItems: "center", textAlign: "center", padding: 10, transform: "perspective(700px) rotateX(10deg)", zIndex: 2 },
  garageBuilding: { left: "6%", top: "14%" },
  partsBuilding: { left: "28%", top: "12%" },
  roadsideBuilding: { right: "29%", top: "12%" },
  yardBuilding: { right: "8%", top: "16%" },
  emptyBuilding: { right: "10%", bottom: "9%", opacity: 0.85 },
  mapBuildingIcon: { fontSize: 34 },
  mapBuildingTitle: { fontSize: 13, fontWeight: 900 },
  movingVehicle: { position: "absolute", zIndex: 5, transition: "left 0.6s linear, top 0.6s linear", transform: "translate(-50%, -50%)" },
  realPickup: { position: "relative", width: 104, height: 52, filter: "drop-shadow(0 12px 10px rgba(0,0,0,0.35))" },
  pickupShadow: { position: "absolute", left: 8, right: 8, bottom: 0, height: 12, background: "rgba(0,0,0,0.28)", borderRadius: "50%", filter: "blur(5px)" },
  pickupBed: { position: "absolute", left: 4, bottom: 13, width: 48, height: 24, background: "linear-gradient(180deg, #ffffff, #e7e5e4)", border: "3px solid #991b1b", borderRadius: "8px 4px 4px 8px", boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.08)" },
  pickupCabReal: { position: "absolute", left: 48, bottom: 13, width: 34, height: 32, background: "linear-gradient(180deg, #ffffff, #f5f5f4)", border: "3px solid #991b1b", borderRadius: "10px 10px 4px 4px", boxShadow: "inset 0 -4px 0 rgba(0,0,0,0.08)" },
  pickupHood: { position: "absolute", left: 78, bottom: 13, width: 22, height: 22, background: "linear-gradient(180deg, #ffffff, #e7e5e4)", borderTop: "3px solid #991b1b", borderRight: "3px solid #991b1b", borderBottom: "3px solid #991b1b", borderRadius: "4px 10px 8px 4px" },
  pickupWindowFront: { position: "absolute", left: 66, bottom: 31, width: 12, height: 11, background: "linear-gradient(135deg, #0f172a, #38bdf8)", borderRadius: "3px", border: "1px solid #0f172a" },
  pickupWindowSide: { position: "absolute", left: 52, bottom: 31, width: 12, height: 11, background: "linear-gradient(135deg, #0f172a, #38bdf8)", borderRadius: "3px", border: "1px solid #0f172a" },
  pickupRedStripe: { position: "absolute", left: 8, bottom: 25, width: 84, height: 6, background: "#dc2626", borderRadius: 99 },
  pickupServiceBox: { position: "absolute", left: 12, bottom: 19, width: 28, height: 12, background: "rgba(255,255,255,0.75)", border: "1px solid #78716c", borderRadius: 3 },
  pickupLightBar: { position: "absolute", left: 58, bottom: 45, width: 20, height: 5, background: "linear-gradient(90deg, #dc2626, #f97316)", borderRadius: 99, boxShadow: "0 0 8px rgba(249,115,22,0.8)" },
  pickupHeadlight: { position: "absolute", right: 1, bottom: 23, width: 6, height: 6, background: "#fde68a", borderRadius: "50%", boxShadow: "0 0 8px #fde68a" },
  pickupTailLight: { position: "absolute", left: 2, bottom: 22, width: 5, height: 8, background: "#ef4444", borderRadius: 3 },
  pickupWheelBack: { position: "absolute", left: 18, bottom: 5, width: 18, height: 18, background: "#111827", borderRadius: "50%", border: "3px solid #57534e", display: "grid", placeItems: "center" },
  pickupWheelFront: { position: "absolute", right: 16, bottom: 5, width: 18, height: 18, background: "#111827", borderRadius: "50%", border: "3px solid #57534e", display: "grid", placeItems: "center" },
  pickupWheelInner: { width: 7, height: 7, background: "#d6d3d1", borderRadius: "50%" },
  vehicleLabel: { marginTop: 4, background: "#1c1917", color: "white", borderRadius: 99, padding: "4px 8px", fontSize: 11, fontWeight: 900, whiteSpace: "nowrap", textAlign: "center" },
  mapHint: { position: "absolute", left: "50%", bottom: 22, transform: "translateX(-50%)", background: "rgba(255,255,255,0.9)", borderRadius: 18, padding: "12px 16px", color: "#7c2d12", fontWeight: 900 },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))", gap: 14 },
  callCard: { background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: 22, padding: 16, boxShadow: "0 10px 22px rgba(0,0,0,0.06)" },
  charityCard: { background: "#fef9c3", border: "1px solid #facc15", borderRadius: 22, padding: 16, boxShadow: "0 10px 22px rgba(0,0,0,0.06)" },
  lockedCallCard: { background: "#f5f5f4", border: "1px solid #d6d3d1", borderRadius: 22, padding: 16, opacity: 0.8 },
  contractCard: { background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: 22, padding: 16, boxShadow: "0 10px 22px rgba(0,0,0,0.06)" },
  contractSignedCard: { background: "#ecfccb", border: "1px solid #bef264", borderRadius: 22, padding: 16, boxShadow: "0 10px 22px rgba(0,0,0,0.06)" },
  jobCard: { background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: 22, padding: 16 },
  issueJobCard: { background: "#fff1f2", border: "2px solid #fb7185", borderRadius: 22, padding: 16 },
  techCard: { background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: 22, padding: 16 },
  hospitalTechCard: { background: "#eff6ff", border: "2px solid #93c5fd", borderRadius: 22, padding: 16 },
  partCard: { background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: 22, padding: 16 },
  lowPartCard: { background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 22, padding: 16 },
  cardIcon: { fontSize: 42 },
  partIcon: { fontSize: 42 },
  callTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  urgencyBadge: { borderRadius: 999, padding: "6px 10px", fontWeight: 900, fontSize: 12 },
  cardTitle: { margin: "6px 0", fontSize: 17, fontWeight: 900 },
  infoList: { marginTop: 10, fontSize: 14, color: "#44403c" },
  buttonStack: { display: "grid", gap: 8, marginTop: 12 },
  orangeSmallButton: { background: "#ea580c", color: "white", border: "none", borderRadius: 12, padding: "10px 12px", fontWeight: 900, cursor: "pointer" },
  greenSmallButton: { background: "#16a34a", color: "white", border: "none", borderRadius: 12, padding: "10px 12px", fontWeight: 900, cursor: "pointer" },
  dangerSmallButton: { background: "#dc2626", color: "white", border: "none", borderRadius: 12, padding: "10px 12px", fontWeight: 900, cursor: "pointer" },
  darkButton: { background: "#1c1917", color: "white", border: "none", borderRadius: 12, padding: "10px 14px", fontWeight: 900, cursor: "pointer", marginTop: 8 },
  lightSmallButton: { marginTop: 10, background: "white", color: "#1c1917", border: "1px solid #d6d3d1", borderRadius: 12, padding: "10px 12px", fontWeight: 900, cursor: "pointer" },
  mainButton: { width: "100%", marginTop: 16, background: "#ea580c", color: "white", border: "none", borderRadius: 16, padding: "14px 18px", fontWeight: 900, fontSize: 16, cursor: "pointer" },
  mainButtonSmall: { background: "#ea580c", color: "white", border: "none", borderRadius: 14, padding: "11px 14px", fontWeight: 900, cursor: "pointer" },
  darkFullButton: { width: "100%", background: "#1c1917", color: "white", border: "none", borderRadius: 16, padding: "13px 14px", fontWeight: 900, cursor: "pointer" },
  lockedFullButton: { width: "100%", background: "#e7e5e4", color: "#78716c", border: "none", borderRadius: 16, padding: "13px 14px", fontWeight: 900, cursor: "pointer" },
  dangerButton: { background: "white", color: "#dc2626", border: "1px solid #fecaca", borderRadius: 12, padding: "9px 12px", fontWeight: 900, cursor: "pointer" },
  warningBox: { background: "#fee2e2", color: "#991b1b", borderRadius: 12, padding: 10, fontWeight: 900, fontSize: 14, marginTop: 8 },
  emptyBox: { border: "1px dashed #d6d3d1", borderRadius: 18, padding: 18, color: "#78716c", background: "#fafaf9" },
  jobTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  phaseText: { color: "#ea580c", fontWeight: 900, margin: "6px 0" },
  timerBadge: { background: "#ffedd5", color: "#c2410c", borderRadius: 999, padding: "6px 10px", fontWeight: 900, fontSize: 13 },
  progressOuter: { height: 12, background: "#e7e5e4", borderRadius: 999, overflow: "hidden", marginTop: 8 },
  progressInner: { height: "100%", background: "#ea580c", borderRadius: 999, transition: "width 0.3s ease" },
  bonusText: { color: "#15803d", fontWeight: 900, margin: "4px 0", fontSize: 13 },
  techAvatar: { width: 58, height: 58, borderRadius: 18, background: "#ffedd5", display: "grid", placeItems: "center", fontSize: 32, marginBottom: 8 },
  statusBadge: { background: "#ffedd5", color: "#9a3412", borderRadius: 999, padding: "5px 9px", fontWeight: 900, fontSize: 12 },
  pickupBox: { marginTop: 12, background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 14, padding: 10, display: "grid", gap: 4, fontSize: 13 },
  barBlock: { marginTop: 10 },
  barLabel: { display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 900, color: "#57534e", marginBottom: 4 },
  barOuter: { height: 10, background: "#e7e5e4", borderRadius: 999, overflow: "hidden" },
  barInner: { height: "100%", borderRadius: 999 },
  renameBox: { display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginTop: 10 },
  actionRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10, marginTop: 12 },
  dayOffBox: { background: "#f0f9ff", border: "1px solid #7dd3fc", borderRadius: 20, padding: 14, marginBottom: 16 },
  requestRow: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", borderTop: "1px solid #bae6fd", paddingTop: 10, marginTop: 10, flexWrap: "wrap" },
  requestButtons: { display: "flex", gap: 8 },
  partButtons: { display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 },
  ownedButton: { background: "#dcfce7", color: "#166534", border: "none", borderRadius: 12, padding: "10px 14px", fontWeight: 900, cursor: "not-allowed" },
  lockedButton: { background: "#e7e5e4", color: "#78716c", border: "none", borderRadius: 12, padding: "10px 14px", fontWeight: 900, cursor: "pointer", marginTop: 8 },
  globeMap: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 },
  globeNode: { background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: 22, padding: 16, display: "grid", gap: 6, cursor: "pointer", textAlign: "center" },
  globeNodeActive: { background: "#ecfccb", border: "2px solid #84cc16", borderRadius: 22, padding: 16, display: "grid", gap: 6, cursor: "pointer", textAlign: "center" },
  globeEmoji: { fontSize: 40 },
};

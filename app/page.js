"use client";

import { useEffect, useState } from "react";

const SAVE_KEY = "fleetfix-v16-playable-early-game";

const WEATHER = [
  { name: "Clear Day", icon: "☀️", travel: 1, repair: 1, accident: 1, rating: 0.1, text: "Perfect service day. Normal travel and repair. Rating +0.1." },
  { name: "Rain", icon: "🌧️", travel: 1.15, repair: 1.06, accident: 1.1, rating: 0, text: "Travel is slower and repair takes slightly longer." },
  { name: "Storm", icon: "⛈️", travel: 1.25, repair: 1.12, accident: 1.25, rating: 0, text: "Slow travel, longer repairs, higher accident risk." },
  { name: "Heatwave", icon: "🔥", travel: 1.05, repair: 1.1, accident: 1.05, rating: 0, text: "Repair work takes longer because of heat." },
  { name: "Winter Morning", icon: "❄️", travel: 1.12, repair: 1.08, accident: 1.1, rating: 0, text: "Travel and repairs are slower because of cold." },
  { name: "Fog", icon: "🌫️", travel: 1.2, repair: 1.04, accident: 1.2, rating: 0, text: "Travel is slow and risky." },
];

const EVENTS = [
  { name: "Truckers Festival", icon: "🚛", bonus: 1.1, text: "Truck and trailer jobs pay 10% more." },
  { name: "Inspection Week", icon: "📋", bonus: 1.15, text: "Inspection jobs pay 15% more." },
  { name: "Emergency Roadside Day", icon: "🚨", bonus: 1.2, text: "Emergency jobs pay 20% more." },
  { name: "School Bus Safety Week", icon: "🚌", bonus: 1.15, text: "Bus jobs pay 15% more." },
];

const TRAITS = [
  { name: "Hard Worker", text: "Repair speed +8%", repair: 0.92, travel: 1, rating: 0, issue: 1, accident: 1 },
  { name: "Fast Driver", text: "Travel speed +10%", repair: 1, travel: 0.9, rating: 0, issue: 1, accident: 1 },
  { name: "Careful", text: "Lower accident risk", repair: 1, travel: 1, rating: 0.1, issue: 1, accident: 0.65 },
  { name: "Friendly", text: "Customer rating +0.4", repair: 1, travel: 1, rating: 0.4, issue: 1, accident: 1 },
  { name: "Expert Mechanic", text: "Extra issue risk lower", repair: 0.96, travel: 1, rating: 0.1, issue: 0.7, accident: 1 },
  { name: "Moody", text: "Morale drops faster", repair: 1, travel: 1, rating: -0.1, issue: 1, accident: 1 },
];

const TECH_NAMES = ["Ravi", "Aman", "Simran", "Gurpreet", "Iqbal", "Karan", "Mehak", "Arjun", "Jaspreet", "Kabir", "Jordan", "Miguel", "Noah", "Ava", "Leo", "Zara"];

const FRIENDS = ["RoadKing Repairs", "Highway Heroes", "Diesel Doctors", "QuickFix Crew", "Tow Titans", "City Truck Pros", "Trailer Masters", "Garage Legends"];

const PARTS = [
  part("Tyre", "🛞", 70, 1),
  part("Battery", "🔋", 110, 1),
  part("Engine Oil", "🛢️", 90, 1),
  part("Brake Kit", "▣", 130, 1, "BRAKE KIT"),
  part("Bulb Pack", "💡", 45, 1),
  part("7-Way Plug", "🔌", 80, 1),
  part("Landing Leg Pin", "🚛", 95, 1, "Trailer Leg"),
  part("Generator Fuse", "⚡", 120, 3),
  part("Inspection Seal", "📋", 60, 3),
  part("Diagnostic Chip", "💾", 160, 5),
  part("Tow Hook", "🪝", 200, 5),
  part("Fuel Seal Kit", "⛽", 260, 10),
  part("Hydraulic Hose", "🔩", 340, 10),
  part("ECU Sensor", "📟", 450, 15),
  part("Air Compressor", "🌬️", 520, 20),
  part("Transmission Kit", "⚙️", 700, 25),
  part("Rail Brake Module", "🚆", 950, 35),
  part("Marine Pump", "🚢", 1100, 45),
  part("Aircraft Sensor", "✈️", 1400, 55),
  part("Government Security Kit", "🛡️", 1800, 65),
];

const TOOLS = [
  { name: "Electrical Scanner", icon: "📡", cost: 90, unlock: 3, skill: "Electrical", bonus: 0.9 },
  { name: "Hydraulic Jack", icon: "🧰", cost: 120, unlock: 5, skill: "Mechanical", bonus: 0.92 },
  { name: "Diagnostic Laptop", icon: "💻", cost: 170, unlock: 8, skill: "Diagnostic", bonus: 0.88 },
  { name: "Tow Cable", icon: "🪢", cost: 160, unlock: 8, skill: "Towing", bonus: 0.9 },
  { name: "Air Compressor Tool", icon: "🌬️", cost: 260, unlock: 18, skill: "Mechanical", bonus: 0.9 },
  { name: "Premium Tool Chest", icon: "🧰", cost: 480, unlock: 25, skill: "All", bonus: 0.88 },
];

const VEHICLES = [
  { type: "Service Bike", icon: "🏍️", cost: 120, unlock: 2, speed: 1.22, fuel: 1, storage: 2 },
  { type: "White/Red Pickup", icon: "🛻", cost: 250, unlock: 3, speed: 1.08, fuel: 3, storage: 6 },
  { type: "Tow Truck", icon: "🚚", cost: 600, unlock: 10, speed: 0.95, fuel: 5, storage: 9 },
  { type: "Mobile Workshop Van", icon: "🚐", cost: 900, unlock: 15, speed: 0.98, fuel: 5, storage: 12 },
  { type: "Heavy Recovery Truck", icon: "🚛", cost: 1600, unlock: 25, speed: 0.85, fuel: 8, storage: 16 },
  { type: "Emergency Response Truck", icon: "🚨", cost: 2200, unlock: 35, speed: 1.2, fuel: 7, storage: 10 },
  { type: "Electric Service Van", icon: "🔌", cost: 3200, unlock: 45, speed: 1.1, fuel: 0, storage: 12 },
];

const JOBS = [
  job("Jump Start", "Car", "Electrical", "Battery", 0, 8, 12, 8, 80, 5, 25, 25, 1, "Low", "🔋", "Cable Order", "Normal"),
  job("Trailer 7-Way Plug Issue", "Trailer", "Electrical", "7-Way Plug", 1, 12, 18, 10, 130, 8, 35, 40, 1, "Low", "🔌", "Match Wires", "Fleet"),
  job("Trailer Landing Leg Repair", "Trailer", "Mechanical", "Landing Leg Pin", 1, 12, 22, 10, 150, 9, 40, 45, 1, "Low", "🚛", "Align Pin", "Fleet"),
  job("Trailer Light Change", "Trailer", "Electrical", "Bulb Pack", 1, 10, 15, 10, 110, 7, 30, 35, 1, "Low", "💡", "Select Bulb", "Normal"),
  job("Car Tyre Puncture", "Car", "Tyre", "Tyre", 1, 10, 30, 10, 140, 8, 40, 45, 1, "Low", "🚗", "Pressure Meter", "Normal"),
  job("Van Battery Dead", "Van", "Electrical", "Battery", 1, 15, 45, 15, 220, 12, 60, 70, 1, "Medium", "🚐", "Cable Order", "Normal"),
  job("Pickup Engine Heating", "Pickup", "Engine", "Engine Oil", 1, 20, 60, 20, 330, 18, 85, 90, 2, "Medium", "🛻", "Choose Part", "Angry"),
  job("Generator Inspection", "Generator", "Inspection", "Inspection Seal", 1, 15, 35, 15, 260, 20, 65, 70, 3, "Medium", "🔌", "Checklist", "Government"),
  job("Generator Fuse Replacement", "Generator", "Electrical", "Generator Fuse", 1, 15, 28, 15, 240, 16, 60, 65, 3, "Medium", "⚡", "Fuse Match", "Normal"),
  job("Trailer Brake Issue", "Trailer", "Mechanical", "Brake Kit", 1, 25, 90, 25, 470, 25, 120, 130, 4, "High", "▣", "Brake Fit", "Fleet"),
  job("Bus Safety Inspection", "Bus", "Diagnostic", "Diagnostic Chip", 1, 30, 120, 30, 650, 36, 170, 180, 5, "High", "🚌", "Checklist", "Government"),
  job("Broken Trailer Rescue", "Trailer", "Towing", "Tow Hook", 1, 45, 180, 45, 1150, 60, 300, 310, 7, "Critical", "🪝", "Tow Setup", "Emergency"),
  job("Truck Fuel Leak", "Heavy Truck", "Mechanical", "Fuel Seal Kit", 1, 35, 150, 35, 1250, 72, 340, 350, 10, "Critical", "🚚", "Seal Fit", "Emergency"),
  job("Hydraulic Truck Failure", "Construction Truck", "Mechanical", "Hydraulic Hose", 1, 40, 200, 40, 1600, 95, 450, 460, 12, "Critical", "🏗️", "Pressure Balance", "Fleet"),
  job("Fleet ECU Diagnostic", "Fleet Van", "Diagnostic", "ECU Sensor", 1, 30, 180, 30, 1800, 120, 520, 540, 15, "Contract", "📟", "Scan Codes", "Fleet"),
  job("Bus Air System Repair", "City Bus", "Mechanical", "Air Compressor", 1, 35, 240, 35, 2300, 150, 650, 680, 20, "Contract", "🚌", "Air Pressure", "Government"),
  job("Fleet Transmission Repair", "Heavy Fleet Truck", "Engine", "Transmission Kit", 1, 45, 300, 45, 3200, 220, 850, 900, 25, "Contract", "🚛", "Gear Timing", "Fleet"),
  job("Train Brake Module Service", "Train", "Diagnostic", "Rail Brake Module", 1, 60, 420, 60, 5200, 420, 1250, 1300, 35, "Government", "🚆", "Brake Sync", "Government"),
  job("Ship Emergency Pump Service", "Ship", "Mechanical", "Marine Pump", 1, 70, 500, 70, 7000, 620, 1600, 1700, 45, "Contract", "🚢", "Pump Flow", "Fleet"),
  job("Aircraft Ground Sensor Inspection", "Aeroplane", "Diagnostic", "Aircraft Sensor", 1, 80, 560, 80, 9300, 850, 2100, 2200, 55, "Government", "✈️", "Sensor Check", "Government"),
  job("Government Convoy Inspection", "Government Convoy", "Inspection", "Government Security Kit", 1, 90, 620, 90, 12000, 1200, 2600, 2700, 65, "Government", "🚔", "Security Checklist", "Government"),
  job("Warplane Ground Support Service", "Warplane", "Diagnostic", "Aircraft Sensor", 1, 95, 680, 95, 15000, 1600, 3300, 3400, 75, "Government", "🛩️", "Aviation Inspection", "Government"),
];

const BUILDINGS = [
  building("Road", "🛣️", 120, 0, 1, 100, 18, false, 1, "Required for town growth.", "road"),
  building("Tree Decoration", "🌲", 80, 0, 1, 50, 10, false, 2, "Decoration. No ribbon cutting.", "decoration"),
  building("Flower Garden", "🌸", 100, 0, 1, 60, 12, false, 3, "Decoration. No ribbon cutting.", "decoration"),
  building("Owner House", "🏡", 320, 15, 1, 300, 30, true, 3, "Owner family home.", "building"),
  building("Family House", "🏠", 380, 20, 2, 360, 35, true, 3, "Homes for technicians and families.", "building"),
  building("Park", "🌳", 600, 35, 3, 520, 45, true, 5, "Improves town happiness.", "building"),
  building("School", "🏫", 1000, 70, 5, 900, 70, true, 7, "Education for families.", "building"),
  building("Gym", "🏋️", 900, 55, 6, 760, 55, false, 4, "Improves fitness and morale.", "building"),
  building("Hospital", "🏥", 1300, 90, 7, 1200, 85, false, 6, "Handles rare technician incidents.", "building"),
  building("Fire Station", "🚒", 1500, 100, 8, 1350, 90, false, 4, "Safety building.", "building"),
  building("Community Center", "🏛️", 1700, 120, 10, 1600, 105, true, 8, "Boosts town prestige.", "building"),
  building("Warehouse", "🏭", 1800, 150, 10, 2000, 110, false, 1, "Increases storage capacity.", "building"),
  building("Fuel Station", "⛽", 2200, 170, 12, 2300, 120, false, 2, "Supports fuel system.", "building"),
  building("Training Academy", "🎓", 2500, 210, 15, 2800, 140, false, 5, "Supports technician training.", "building"),
  building("Apartment Block", "🏢", 3200, 260, 18, 3500, 160, true, 7, "Housing for bigger workforce.", "building"),
  building("Mall", "🏬", 4200, 350, 21, 5000, 190, true, 9, "Big city lifestyle building.", "building"),
  building("Airport Road", "🛫", 6000, 550, 30, 8000, 240, false, 3, "Global support road. No ribbon cutting.", "road"),
  building("Rail Yard", "🚆", 9000, 800, 35, 12000, 300, false, 2, "Supports train jobs.", "building"),
  building("Port Dock", "🚢", 12000, 1100, 45, 16000, 360, false, 2, "Supports ship jobs.", "building"),
  building("Air Base", "✈️", 16000, 1600, 55, 22000, 420, false, 2, "Supports aviation jobs.", "building"),
];

const TABS = [
  ["town", "🏙️", "Town"],
  ["calls", "🚨", "Calls"],
  ["jobs", "⏱️", "Jobs"],
  ["team", "👨‍🔧", "Team"],
  ["garage", "🏚️", "Garage"],
  ["market", "🛒", "Market"],
  ["contracts", "📄", "Contracts"],
  ["globe", "🌍", "Globe"],
  ["events", "🎁", "Events"],
];

const DAILY_REWARDS = [
  { label: "Coins", coins: 300 },
  { label: "Parts Pack", parts: { Tyre: 2, Battery: 1, "Bulb Pack": 2 } },
  { label: "Money", money: 80 },
  { label: "Technician XP", techXp: 120 },
  { label: "Rare Tool", tool: "Electrical Scanner" },
  { label: "Fuel", fuel: 50 },
  { label: "Premium Reward", money: 180, coins: 600 },
];

const MINI_GAME_REPAIR_BONUS = 0.88;
const MINI_GAME_COIN_BONUS = 1.08;

function unlockForLevel(level) {
  if (level === 2) return { level, icon: "🏍️", title: "Service Bike unlocked", text: "You can now buy a Service Bike in the Garage for faster early jobs." };
  if (level === 3) return { level, icon: "🛻", title: "White/Red Pickup unlocked", text: "The first pickup is now available in the Garage with better part storage." };
  if (level === 5) return { level, icon: "👨‍🔧", title: "First Technician unlocked", text: "You can now hire your first technician from the Team tab." };
  return null;
}

function miniGameType(job) {
  const key = `${job?.title || ""} ${job?.miniGame || ""} ${job?.partNeeded || ""}`.toLowerCase();
  if (key.includes("jump") || key.includes("cable") || key.includes("battery")) return "jump";
  if (key.includes("tyre") || key.includes("tire") || key.includes("pressure")) return "tyre";
  if (key.includes("light") || key.includes("bulb")) return "light";
  return "light";
}

function part(name, icon, cost, unlockLevel, label = "") {
  return { name, icon, label, cost, sell: Math.round(cost * 0.6), reorder: unlockLevel < 5 ? 5 : 2, unlockLevel };
}

function job(title, vehicle, skill, partNeeded, partQty, travel, repair, back, coins, money, xp, techXp, rep, unlock, urgency, icon, miniGame, customer) {
  return { title, vehicle, skill, partNeeded, partQty, travel, repair, back, coins, money, xp, techXp, rep, unlock, urgency, icon, miniGame, customer };
}

function building(type, icon, costCoins, costMoney, unlockLevel, value, buildTime, family, happiness, description, category) {
  return { type, icon, costCoins, costMoney, unlockLevel, value, buildTime, family, happiness, description, category };
}

function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function xpNeed(level) {
  return level * 180;
}

function techXpNeed(level) {
  return level * 120;
}

function salaryFor(level, isOwner) {
  if (isOwner) return 0;
  if (level <= 5) return 10;
  return Math.round(10 * Math.pow(1.015, level - 5));
}

function startParts() {
  return {
    Tyre: 4,
    Battery: 3,
    "Engine Oil": 3,
    "Brake Kit": 2,
    "Bulb Pack": 3,
    "7-Way Plug": 2,
    "Landing Leg Pin": 2,
    "Generator Fuse": 0,
    "Inspection Seal": 0,
    "Diagnostic Chip": 0,
    "Tow Hook": 0,
    "Fuel Seal Kit": 0,
    "Hydraulic Hose": 0,
    "ECU Sensor": 0,
    "Air Compressor": 0,
    "Transmission Kit": 0,
    "Rail Brake Module": 0,
    "Marine Pump": 0,
    "Aircraft Sensor": 0,
    "Government Security Kit": 0,
  };
}

function pickupEquipment() {
  return {
    Tyre: 1,
    Battery: 1,
    "Engine Oil": 1,
    "Brake Kit": 1,
    "Bulb Pack": 2,
    "7-Way Plug": 1,
    "Landing Leg Pin": 1,
    "Generator Fuse": 1,
    "Inspection Seal": 1,
    "Diagnostic Chip": 1,
    "Tow Hook": 1,
  };
}

function createTechnician(name, isOwner = false, areaId = "area-1") {
  const trait = isOwner ? TRAITS[0] : pick(TRAITS);
  return {
    id: newId(),
    name,
    isOwner,
    skill: isOwner ? "All-Rounder" : pick(["Tyre", "Electrical", "Engine", "Mechanical", "Diagnostic", "Towing", "Inspection"]),
    trait,
    uniform: "Classic Red",
    level: 1,
    xp: 0,
    energy: 100,
    morale: 100,
    loyalty: isOwner ? 100 : 70,
    status: "Free",
    salary: 0,
    currentJobId: null,
    hospitalDays: 0,
    assignedAreaId: areaId,
    avatar: isOwner ? "👑" : pick(["👨‍🔧", "👩‍🔧", "🧰", "🔧"]),
    pickupEquipment: pickupEquipment(),
  };
}

function newGame(companyName, ownerName, townName, countryName) {
  const owner = createTechnician(ownerName, true);

  return {
    started: true,
    shopRepaired: false,
    starterIntroDone: false,
    companyName,
    ownerName,
    townName,
    countryName,
    coins: 120,
    money: 20,
    fuel: 60,
    xp: 0,
    level: 1,
    reputation: 0,
    ratingTotal: 0,
    ratingCount: 0,
    day: 1,
    dayTimer: 180,
    salaryDue: 0,
    completedJobs: 0,
    totalRevenue: 0,
    worldValue: 300,
    storageBase: 20,
    yardLevel: 1,
    trainingLevel: 1,
    partShopLevel: 1,
    builderTeams: 1,
    dispatchManager: false,
    insurance: { technicians: false, vehicles: false, parts: false },
    activeAreaId: "area-1",
    activeJobs: [],
    dayOffRequests: [],
    signedContracts: [],
    friends: [],
    club: null,
    clubEvent: null,
    googlePlayLinked: false,
    googlePlayName: "",
    lastLoginClaimDay: 0,
    loginStreak: 0,
    achievements: [],
    milestoneClaimed: [],
    dailyMissions: createDailyMissions(),
    weather: WEATHER[0],
    festivalEvent: null,
    competitors: [
      { id: "rival-1", name: "Quick Wrench Co.", jobsTaken: 0 },
      { id: "rival-2", name: "Metro Fleet Fix", jobsTaken: 0 },
    ],
    tools: {
      "Basic Tool Kit": 1,
      "Electrical Scanner": 0,
      "Hydraulic Jack": 0,
      "Diagnostic Laptop": 0,
      "Tow Cable": 0,
      "Air Compressor Tool": 0,
      "Premium Tool Chest": 0,
    },
    vehicles: [],
    technicians: [owner],
    parts: startParts(),
    worldAreas: [
      {
        id: "area-1",
        name: townName,
        unlocked: true,
        landSlots: 8,
        tiles: [
          { id: "broken-shop", type: "Broken Shop", icon: "🏚️", level: 1, status: "broken", category: "building", family: false, value: 100 },
          { id: "road", type: "Road", icon: "🛣️", level: 1, status: "complete", category: "road", family: false, value: 100 },
        ],
      },
    ],
  };
}

function normalizeGame(game) {
  const safe = {
    ...newGame(game.companyName || "FleetFix", game.ownerName || "Owner", game.townName || "Starter Town", game.countryName || "Repair Nation"),
    ...game,
  };

  safe.parts = { ...startParts(), ...(game.parts || {}) };
  safe.weather = game.weather?.repair ? game.weather : WEATHER[0];
  safe.dailyMissions = game.dailyMissions?.length ? game.dailyMissions : createDailyMissions();
  safe.insurance = { technicians: false, vehicles: false, parts: false, ...(game.insurance || {}) };
  safe.activeJobs = [];
  safe.vehicles = game.vehicles || [];
  safe.shopRepaired = game.shopRepaired ?? false;

  safe.worldAreas = (game.worldAreas || []).map((area) => ({
    ...area,
    tiles: (area.tiles || []).map((tile) => ({
      ...tile,
      category: tile.category || guessTileCategory(tile.type),
      status: ["building"].includes(tile.status) ? "complete" : tile.status,
    })),
  }));

  safe.technicians = (game.technicians || []).map((t) => ({
    ...createTechnician(t.name || "Tech", t.isOwner, t.assignedAreaId || "area-1"),
    ...t,
    salary: salaryFor(t.level || 1, t.isOwner),
    status: ["Travelling", "Repairing", "Returning", "Supporting"].includes(t.status) ? "Free" : t.status || "Free",
    currentJobId: null,
    pickupEquipment: { ...pickupEquipment(), ...(t.pickupEquipment || {}) },
  }));

  return safe;
}

function guessTileCategory(type) {
  if (type === "Road" || type === "Airport Road") return "road";
  if (type.includes("Tree") || type.includes("Flower") || type.includes("Decoration") || type === "Expansion Field") return "decoration";
  return "building";
}

function isRibbonBuilding(tile) {
  return tile.category === "building" && !tile.type.includes("Road") && !["Broken Shop", "Expansion Field"].includes(tile.type);
}

function averageRating(game) {
  return game.ratingCount ? game.ratingTotal / game.ratingCount : 0;
}

function getActiveArea(game) {
  return game.worldAreas.find((a) => a.id === game.activeAreaId) || game.worldAreas[0];
}

function completedBuildings(game, type) {
  return game.worldAreas.reduce((sum, area) => sum + area.tiles.filter((t) => t.type === type && t.status === "complete").length, 0);
}

function townHappiness(game) {
  const base = 40;
  const buildingPoints = game.worldAreas.reduce((sum, area) => {
    return (
      sum +
      area.tiles.reduce((s, tile) => {
        if (tile.status !== "complete") return s;
        const data = BUILDINGS.find((b) => b.type === tile.type);
        return s + (data?.happiness || 1);
      }, 0)
    );
  }, 0);

  const completeCount = game.worldAreas.reduce((sum, area) => sum + area.tiles.filter((t) => t.status === "complete").length, 0);
  const roadNeed = Math.ceil(completeCount / 3);
  const roadPenaltyValue = Math.max(0, roadNeed - completedBuildings(game, "Road")) * 5;
  const salaryPenalty = game.salaryDue > 0 ? 3 : 0;

  return Math.max(0, Math.min(100, base + buildingPoints - roadPenaltyValue - salaryPenalty));
}

function roadPenalty(game) {
  const area = getActiveArea(game);
  const complete = area.tiles.filter((t) => t.status === "complete").length;
  const roads = area.tiles.filter((t) => t.type === "Road" && t.status === "complete").length;
  return Math.max(0, Math.ceil(complete / 3) - roads);
}

function inventoryUsed(parts) {
  return Object.values(parts).reduce((sum, qty) => sum + qty, 0);
}

function storageCapacity(game) {
  return game.storageBase + game.level * 5 + game.partShopLevel * 15 + completedBuildings(game, "Warehouse") * 35;
}

function maxTechnicians(game) {
  if (game.level < 5) return 1;
  if (game.level < 21) return 2;
  return 3 + Math.floor((game.level - 21) / 10);
}

function servicePoints(game) {
  const area = getActiveArea(game);
  const points = [
    `${area.name} Main Road`,
    `${area.name} Service Yard`,
    `${area.name} Market Street`,
    `${area.name} Industrial Lane`,
    `${area.name} Truck Stop`,
  ];

  area.tiles.forEach((tile) => {
    if (tile.status !== "complete") return;
    if (tile.type === "School") points.push(`${area.name} School Road`);
    if (tile.type === "Park") points.push(`${area.name} Park Gate`);
    if (tile.type === "Gym") points.push(`${area.name} Gym Parking`);
    if (tile.type === "Hospital") points.push(`${area.name} Hospital Road`);
    if (tile.type === "Warehouse") points.push(`${area.name} Warehouse Zone`);
    if (tile.type === "Mall") points.push(`${area.name} Mall Parking`);
    if (tile.type === "Fuel Station") points.push(`${area.name} Fuel Plaza`);
    if (tile.type === "Rail Yard") points.push(`${area.name} Rail Yard`);
    if (tile.type === "Port Dock") points.push(`${area.name} Port Dock`);
    if (tile.type === "Air Base") points.push(`${area.name} Air Base`);
  });

  return [...new Set(points)];
}

function starterJobs() {
  return [
    {
      id: newId(),
      title: "First Roadside Jump Start",
      vehicle: "Car",
      skill: "All-Rounder",
      partNeeded: "Battery",
      partQty: 0,
      travel: 5,
      repair: 10,
      back: 5,
      coins: 90,
      money: 10,
      xp: 45,
      techXp: 45,
      rep: 2,
      unlock: 1,
      urgency: "Starter",
      icon: "🔋",
      miniGame: "Cable Order",
      customer: "Normal",
      areaId: "area-1",
      mapPoint: "Near Broken Shop Road",
      noPay: false,
      rewardCoins: 90,
      rewardMoney: 10,
      problem: "First customer needs a jump start. Owner will walk 5 seconds to the job.",
    },
    {
      id: newId(),
      title: "Loose Trailer Light",
      vehicle: "Trailer",
      skill: "All-Rounder",
      partNeeded: "Bulb Pack",
      partQty: 0,
      travel: 6,
      repair: 12,
      back: 6,
      coins: 100,
      money: 12,
      xp: 50,
      techXp: 50,
      rep: 2,
      unlock: 1,
      urgency: "Starter",
      icon: "💡",
      miniGame: "Select Bulb",
      customer: "Normal",
      areaId: "area-1",
      mapPoint: "Small Town Street",
      noPay: false,
      rewardCoins: 100,
      rewardMoney: 12,
      problem: "A trailer light is loose. Owner can walk there and repair it.",
    },
  ];
}

function makeCalls(game) {
  if (!game.shopRepaired) return [];

  if (game.level === 1) {
    return starterJobs();
  }

  const availableJobs = JOBS.filter((j) => j.unlock <= game.level);
  const safeJobs = availableJobs.length > 0 ? availableJobs : JOBS.filter((j) => j.unlock <= 1);
  const points = servicePoints(game);
  const area = getActiveArea(game);

  return [...safeJobs]
    .sort(() => Math.random() - 0.5)
    .slice(0, 8)
    .map((template, index) => {
      const point = points[(game.day + index + Math.floor(Math.random() * points.length)) % points.length];
      const noPay = Math.random() < (game.day % 17 === 0 || game.day % 30 === 0 ? 0.16 : 0.02);
      const eventBonus = game.festivalEvent?.bonus || 1;
      const customerBonus = template.customer === "Government" ? 1.25 : template.customer === "Fleet" ? 1.12 : template.customer === "Emergency" ? 1.2 : 1;

      return {
        id: newId(),
        ...template,
        areaId: area.id,
        mapPoint: point,
        noPay,
        rewardCoins: noPay ? 0 : Math.round((template.coins + game.level * 8) * eventBonus * customerBonus),
        rewardMoney: noPay ? 0 : Math.round((template.money + game.level * 2) * eventBonus * customerBonus),
        problem: noPay ? "Customer may not pay. Complete it for reputation and trust." : `${template.customer} customer request received from ${point}.`,
      };
    });
}

function createDailyMissions() {
  const all = [
    { id: "job", name: "Complete 3 jobs", type: "job", target: 3, progress: 0, done: false, coins: 250, money: 30 },
    { id: "dispatch", name: "Dispatch 4 times", type: "dispatch", target: 4, progress: 0, done: false, coins: 200, money: 20 },
    { id: "rating", name: "Get 2 high ratings", type: "rating", target: 2, progress: 0, done: false, coins: 300, money: 40 },
    { id: "train", name: "Train 1 technician", type: "train", target: 1, progress: 0, done: false, coins: 120, money: 20 },
    { id: "build", name: "Start 1 construction", type: "build", target: 1, progress: 0, done: false, coins: 180, money: 25 },
    { id: "contract", name: "Sign 1 contract", type: "contract", target: 1, progress: 0, done: false, coins: 250, money: 60 },
  ];

  return [...all].sort(() => Math.random() - 0.5).slice(0, 3);
}

function updateMission(missions, type, amount = 1) {
  return missions.map((m) => {
    if (m.type !== type || m.done) return m;
    const progress = Math.min(m.target, m.progress + amount);
    return { ...m, progress, done: progress >= m.target };
  });
}

function contracts(level) {
  const base = [
    { id: "local", name: "Local Delivery Company", unlock: 2, cost: 80, coin: 5, money: 0, chance: 70 },
    { id: "market", name: "Market Fleet Partner", unlock: 5, cost: 160, coin: 8, money: 5, chance: 65 },
    { id: "bus", name: "City Bus Depot", unlock: 10, cost: 350, coin: 12, money: 8, chance: 60 },
    { id: "regional", name: "Regional Logistics Group", unlock: 15, cost: 700, coin: 18, money: 12, chance: 55 },
    { id: "govfleet", name: "Government Vehicle Fleet", unlock: 25, cost: 1200, coin: 20, money: 16, chance: 50 },
    { id: "rail", name: "National Rail Service", unlock: 35, cost: 2200, coin: 25, money: 20, chance: 45 },
    { id: "port", name: "Port Authority Ship Service", unlock: 45, cost: 3600, coin: 30, money: 25, chance: 40 },
    { id: "aviation", name: "Aviation Ground Support", unlock: 55, cost: 5200, coin: 36, money: 30, chance: 35 },
    { id: "convoy", name: "PM Convoy Inspection", unlock: 65, cost: 7400, coin: 42, money: 36, chance: 30 },
    { id: "warplane", name: "Government Warplane Ground Service", unlock: 75, cost: 10000, coin: 50, money: 45, chance: 25 },
  ];

  const endless = Array.from({ length: 20 }, (_, i) => ({
    id: `global-${80 + i * 10}`,
    name: `Global Mega Fleet Contract L${80 + i * 10}`,
    unlock: 80 + i * 10,
    cost: 12000 + i * 1800,
    coin: 50 + i * 3,
    money: 45 + i * 2,
    chance: Math.max(15, 30 - i),
  }));

  return [...base, ...endless].filter((c) => c.unlock <= level + 30);
}

function contractBonus(game) {
  const data = contracts(game.level);
  return game.signedContracts.reduce(
    (sum, id) => {
      const c = data.find((x) => x.id === id);
      if (!c) return sum;
      return { coin: sum.coin + c.coin, money: sum.money + c.money };
    },
    { coin: 0, money: 0 }
  );
}

function nextAreaCost(game) {
  const count = game.worldAreas.length;
  return { coins: 6000 + count * 3500, money: 700 + count * 450 };
}

function nextAreaName(game) {
  const names = ["Riverbend County", "Highway Desert", "Snowfield District", "Coastal Port", "Mountain Pass", "Metro Island", "Northern Frontier", "Cargo Bay City", "Sunrise Plains", "Global Hub"];
  return names[game.worldAreas.length - 1] || `World Area ${game.worldAreas.length + 1}`;
}

function milestones(level) {
  return [
    { level: 2, name: "Service Bike Unlock", coins: 100, money: 30 },
    { level: 3, name: "Pickup Unlock", coins: 180, money: 45 },
    { level: 5, name: "First Technician", coins: 400, money: 60 },
    { level: 10, name: "Fuel System", coins: 700, money: 90 },
    { level: 15, name: "Advanced Diagnostics", coins: 1100, money: 140 },
    { level: 20, name: "Heavy Fleet Jobs", coins: 1800, money: 220 },
    { level: 21, name: "Globe Expansion", coins: 2500, money: 350 },
    { level: 30, name: "Airport Road Path", coins: 3500, money: 500 },
    { level: 50, name: "International Contracts", coins: 7000, money: 1200 },
    { level: 75, name: "Government Aviation Service", coins: 10000, money: 2500 },
  ].filter((m) => m.level <= level);
}

function rank(rep) {
  if (rep >= 4000) return "Global Repair Empire";
  if (rep >= 2000) return "Continental Fleet Authority";
  if (rep >= 1000) return "National Fleet Empire";
  if (rep >= 400) return "State Fleet Leader";
  if (rep >= 180) return "Regional Fleet Leader";
  if (rep >= 65) return "Trusted Fleet Partner";
  if (rep >= 18) return "Growing Garage";
  return "Broken Shop Starter";
}

function time(seconds) {
  if (seconds < 60) return `${seconds}s`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

function toolBonus(game, call) {
  let bonus = 1;
  TOOLS.forEach((tool) => {
    if ((game.tools[tool.name] || 0) > 0 && (tool.skill === call.skill || tool.skill === "All")) {
      bonus *= tool.bonus;
    }
  });
  return bonus;
}

function ratingFor(job, tech, game) {
  let rating = 3.2;
  if (job.skillMatch) rating += 0.6;
  if (tech?.energy > 50) rating += 0.3;
  if (tech?.morale > 70) rating += 0.2;
  rating += tech?.trait?.rating || 0;
  rating += game.weather?.rating || 0;
  if (job.approvedExtraIssue) rating += 0.25;
  if (job.declinedExtraIssue) rating -= 0.35;
  if (job.miniGameBonus) rating += 0.25;
  if (job.noPay) rating += 0.15;
  if (townHappiness(game) >= 70) rating += 0.2;
  rating -= roadPenalty(game) * 0.12;
  return Math.max(1, Math.min(5, rating));
}

function reviewText(rating, job) {
  if (job.noPay) return "Customer could not pay, but your town trust improved.";
  if (rating >= 4.6) return "Great service! Technician reached fast and handled everything professionally.";
  if (rating >= 4) return "Good job. Repair completed well and customer is satisfied.";
  if (rating >= 3) return "Repair was completed, but it could have been faster.";
  return "Customer was unhappy. Improve speed, parts readiness, morale, and skill matching.";
}

function vehiclePosition(job) {
  const total = job.phaseTotal || 1;
  const done = total - job.phaseRemaining;
  const progress = Math.max(0, Math.min(1, done / total));
  if (job.phase === "travel") return 10 + progress * 55;
  if (job.phase === "repair") return 65;
  if (job.phase === "return") return 65 - progress * 55;
  return 10;
}

export default function Home() {
  const [game, setGame] = useState(null);
  const [setup, setSetup] = useState({ companyName: "", ownerName: "", townName: "", countryName: "" });
  const [tab, setTab] = useState("town");
  const [calls, setCalls] = useState([]);
  const [message, setMessage] = useState("");
  const [review, setReview] = useState(null);
  const [unlockPopup, setUnlockPopup] = useState(null);
  const [miniJobId, setMiniJobId] = useState(null);
  const [ribbon, setRibbon] = useState(null);
  const [dayOffPopup, setDayOffPopup] = useState(null);
  const [renameId, setRenameId] = useState("");
  const [renameValue, setRenameValue] = useState("");
  const [googleName, setGoogleName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const parsed = normalizeGame(JSON.parse(saved));
      setGame(parsed);
      setCalls(makeCalls(parsed));
    }
  }, []);

  useEffect(() => {
    if (game?.started) localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  }, [game]);

  useEffect(() => {
    if (!game?.activeJobs?.length) {
      if (miniJobId) setMiniJobId(null);
      return;
    }

    const pending = game.activeJobs.find((job) => job.pendingMiniGame);

    if (pending && pending.jobId !== miniJobId) {
      setMiniJobId(pending.jobId);
    }

    if (!pending && miniJobId) {
      setMiniJobId(null);
    }
  }, [game, miniJobId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setGame((current) => {
        if (!current?.started) return current;

        let g = { ...current };
        let notes = [];

        g.dayTimer -= 1;

        g.worldAreas = g.worldAreas.map((area) => ({
          ...area,
          tiles: area.tiles.map((tile) => {
            if (tile.status !== "building") return tile;

            const remaining = Math.max(0, tile.remaining - 1);

            if (remaining <= 0) {
              if (isRibbonBuilding(tile)) {
                notes.push(`${tile.type} construction finished. Cut the ribbon to open it.`);
                return { ...tile, remaining: 0, status: "readyRibbon" };
              }

              notes.push(`${tile.type} construction finished.`);
              return { ...tile, remaining: 0, status: "complete" };
            }

            return { ...tile, remaining };
          }),
        }));

        if (g.dayTimer <= 0) {
          const salaryDue = g.technicians.reduce((sum, t) => sum + salaryFor(t.level, t.isOwner), 0);

          g.day += 1;
          g.dayTimer = 180;
          g.salaryDue += salaryDue;
          g.weather = pick(WEATHER);
          g.festivalEvent = Math.random() < 0.22 ? pick(EVENTS) : null;

          g.technicians = g.technicians.map((t) => {
            if (t.status === "Hospital") {
              const days = Math.max(0, t.hospitalDays - 1);
              return { ...t, hospitalDays: days, status: days <= 0 ? "Free" : "Hospital", energy: days <= 0 ? 80 : t.energy };
            }

            if (t.status === "Day Off") {
              return { ...t, status: "Free", morale: Math.min(100, t.morale + 14), loyalty: Math.min(100, t.loyalty + 3) };
            }

            if (!t.isOwner && g.salaryDue > 0) {
              return { ...t, morale: Math.max(35, t.morale - 3), loyalty: Math.max(0, t.loyalty - 2) };
            }

            return t;
          });

          if (g.day % 7 === 1 && g.day > 1) {
            g.technicians = g.technicians.map((t) => (t.status === "Hospital" ? t : { ...t, energy: 100 }));
            notes.push("Weekly energy reset completed.");
          }

          if (g.day % 2 === 1) g.dailyMissions = createDailyMissions();

          notes.push(`Day ${g.day} started. Weather: ${g.weather.icon} ${g.weather.name}. Salary due +${salaryDue} coins.`);
        }

        g = processJobs(g, notes);

        g.technicians.forEach((tech) => {
          const chance = townHappiness(g) > 70 ? 0.0007 : 0.0015;

          if (!tech.isOwner && tech.status === "Free" && !g.dayOffRequests.some((r) => r.technicianId === tech.id) && Math.random() < chance) {
            const request = {
              id: newId(),
              technicianId: tech.id,
              technicianName: tech.name,
              reason: pick(["I need one day off for family work.", "I have personal work tomorrow. Can I take a day off?", "I need to visit home for important work.", "I need one rest day because of personal plans."]),
            };

            g.dayOffRequests = [...g.dayOffRequests, request];
            setDayOffPopup(request);
          }
        });

        while (g.xp >= xpNeed(g.level)) {
          g.xp -= xpNeed(g.level);
          g.level += 1;
          g.coins += 150 + g.level * 8;
          g.money += 25 + Math.floor(g.level * 1.5);
          const unlock = unlockForLevel(g.level);
          if (unlock) setUnlockPopup(unlock);
          notes.push(`Company level up! Reached Level ${g.level}.`);
        }

        g = checkAchievements(g, notes);

        if (notes.length) {
          setMessage(notes.join(" "));
          setCalls(makeCalls(g));
        }

        return g;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function processJobs(g, notes) {
    g.activeJobs = g.activeJobs
      .map((job) => {
        if (job.pendingApproval || job.pendingMiniGame) return job;

        const tech = g.technicians.find((t) => t.id === job.technicianId);
        const backupAvailable = g.technicians.some((t) => t.id !== job.technicianId && t.status === "Free" && t.energy > 0);

        const issueChance = (job.urgency === "Critical" ? 0.035 : job.urgency === "High" ? 0.022 : 0.012) * (tech?.trait?.issue || 1);

        if (job.phase === "repair" && !job.extraIssueChecked && Math.random() < issueChance) {
          if ((tech?.energy || 100) < 20 && backupAvailable) {
            notes.push(`${job.technicianName} found an extra issue but energy is below 20%. Backup is required.`);
            return { ...job, extraIssueChecked: true, needsSupport: true, issueText: "Energy below 20%. Send backup to continue safely." };
          }

          notes.push(`${job.technicianName} reported an extra issue on ${job.title}.`);

          return {
            ...job,
            extraIssueChecked: true,
            pendingApproval: true,
            issueText: "Extra issue found. Approve additional repair time to continue.",
            extraIssueTime: job.urgency === "Critical" ? 50 : job.urgency === "High" ? 35 : 22,
          };
        }

        if (job.needsSupport && !job.supportAssigned) return job;

        if (job.needsSupport && job.supportAssigned && job.supportRemaining > 0) {
          return { ...job, supportRemaining: job.supportRemaining - 1 };
        }

        if (job.needsSupport && job.supportAssigned && job.supportRemaining <= 0) {
          job = { ...job, needsSupport: false, supportResolved: true };
        }

        let next = { ...job, phaseRemaining: job.phaseRemaining - 1 };

        if (next.phaseRemaining <= 0) {
          if (next.phase === "travel") {
            next.phase = "repair";
            next.phaseRemaining = next.repairTime;
            next.phaseTotal = next.repairTime;
            if (next.miniGame && !next.miniGamePlayed) {
              next.pendingMiniGame = true;
              next.issueText = `${next.technicianName} arrived. Complete or skip the mini-game to continue repair.`;
              notes.push(`${next.technicianName} arrived at ${next.mapPoint}. Mini-game ready: ${next.miniGame}.`);
            }
            g.technicians = g.technicians.map((t) => (t.id === next.technicianId ? { ...t, status: "Repairing" } : t));
          } else if (next.phase === "repair") {
            next.phase = "return";
            next.phaseRemaining = next.returnTime;
            next.phaseTotal = next.returnTime;
            g.technicians = g.technicians.map((t) => (t.id === next.technicianId ? { ...t, status: "Returning" } : t));
          } else {
            next.completed = true;
          }
        }

        return next;
      })
      .filter((job) => {
        if (!job.completed) return true;

        const tech = g.technicians.find((t) => t.id === job.technicianId);
        const rating = ratingFor(job, tech, g);
        const stars = "⭐".repeat(Math.max(1, Math.round(rating)));
        const bonus = contractBonus(g);

        const coinEarned = Math.round(job.rewardCoins * (1 + bonus.coin / 100));
        const moneyEarned = Math.round(job.rewardMoney * (1 + bonus.money / 100));

        g.coins += coinEarned;
        g.money += moneyEarned;
        g.xp += job.xp;
        g.reputation += Math.round(job.rep + Math.max(0, rating - 3));
        g.ratingTotal += rating;
        g.ratingCount += 1;
        g.completedJobs += 1;
        g.totalRevenue += coinEarned;
        g.worldValue += Math.floor(coinEarned * 0.12);
        g.dailyMissions = updateMission(g.dailyMissions, "job");

        if (rating >= 4.5) g.dailyMissions = updateMission(g.dailyMissions, "rating");

        const accidentChance = (job.urgency === "Critical" ? 0.012 : job.urgency === "High" ? 0.006 : 0.002) * (g.weather?.accident || 1) * (tech?.trait?.accident || 1) * (g.insurance.technicians ? 0.55 : 1);
        const accident = Math.random() < accidentChance;

        g.technicians = g.technicians.map((t) => {
          if (t.id !== job.technicianId) return t;

          if (accident) {
            const medicalCost = Math.round((job.urgency === "Critical" ? 160 : 90) * (g.insurance.technicians ? 0.35 : 1));
            g.coins = Math.max(0, g.coins - medicalCost);
            notes.push(`${t.name} had a minor incident and went to clinic for 2 days. Medical cost: ${medicalCost} coins.`);

            return {
              ...t,
              status: "Hospital",
              hospitalDays: 2,
              energy: 20,
              morale: Math.max(40, t.morale - 8),
              loyalty: Math.max(0, t.loyalty - 3),
              currentJobId: null,
            };
          }

          let newLevel = t.level;
          let newXp = t.xp + job.techXp;

          while (newXp >= techXpNeed(newLevel)) {
            newXp -= techXpNeed(newLevel);
            newLevel += 1;
          }

          return {
            ...t,
            status: "Free",
            currentJobId: null,
            energy: Math.max(0, t.energy - Math.max(5, 15 - (t.truckLevel || 1))),
            morale: Math.max(45, t.morale - 2),
            loyalty: Math.min(100, Math.max(0, t.loyalty + (rating >= 4 ? 2 : -2))),
            xp: newXp,
            level: newLevel,
            salary: salaryFor(newLevel, t.isOwner),
          };
        });

        notes.push(`${tech?.name || "Technician"} completed ${job.title}. Rating ${stars}. Earned 🪙 ${coinEarned}, 💵 ${moneyEarned}.`);
        setReview({
          stars,
          text: reviewText(rating, job),
          jobTitle: job.title,
          technicianName: tech?.name || job.technicianName || "Technician",
          coins: coinEarned,
          money: moneyEarned,
          xp: job.xp,
          rating: rating.toFixed(1),
          techXp: job.techXp,
          miniGameBonus: job.miniGameBonus,
        });

        return false;
      });

    return g;
  }

  function startGame() {
    if (!setup.companyName || !setup.ownerName || !setup.townName || !setup.countryName) {
      setMessage("Fill company name, owner name, town name and country/world name.");
      return;
    }

    const g = newGame(setup.companyName, setup.ownerName, setup.townName, setup.countryName);
    setGame(g);
    setCalls([]);
    setMessage(`${setup.ownerName} entered a broken shop in ${setup.townName}. Repair the shop for free to start your business.`);
  }

  function repairBrokenShop() {
    setGame((g) => {
      const updated = {
        ...g,
        shopRepaired: true,
        starterIntroDone: true,
        worldValue: g.worldValue + 400,
        worldAreas: g.worldAreas.map((area) =>
          area.id === g.activeAreaId
            ? {
                ...area,
                tiles: area.tiles.map((tile) =>
                  tile.id === "broken-shop"
                    ? {
                        ...tile,
                        type: "Small Repair Shop",
                        icon: "🔧",
                        status: "complete",
                        category: "building",
                        value: 500,
                      }
                    : tile
                ),
              }
            : area
        ),
      };

      setCalls(starterJobs());
      return updated;
    });

    setMessage("You repaired the broken shop for free. First service call is now available.");
    setTab("calls");
  }

  function dispatch(call, techId) {
    const tech = game.technicians.find((t) => t.id === techId);
    const assignedVehicle = game.vehicles.find((v) => v.assignedTechnicianId === techId);

    const isWalking = !assignedVehicle;
    const vehicle = assignedVehicle || {
      id: "walking",
      name: "Walking",
      type: "Walking",
      icon: "🚶",
      level: 1,
      speed: 1,
      fuelUse: 0,
      storage: 0,
    };

    if (!tech || tech.status !== "Free") return setMessage("Technician is not free.");
    if (tech.loyalty < 18 && call.urgency === "Critical" && !tech.isOwner) return setMessage(`${tech.name} refused this critical job due to low loyalty.`);
    if (!isWalking && game.fuel < vehicle.fuelUse) return setMessage("Not enough fuel. Buy fuel in Market.");

    if (isWalking && call.urgency !== "Starter" && call.urgency !== "Low" && game.level < 2) {
      return setMessage("Before Level 2, owner can only walk to starter/simple jobs. Buy Service Bike at Level 2.");
    }

    const pickupStock = tech.pickupEquipment?.[call.partNeeded] || 0;
    const shopStock = game.parts[call.partNeeded] || 0;

    let newParts = { ...game.parts };
    let newPickup = { ...tech.pickupEquipment };

    if (call.partQty > 0) {
      if (pickupStock >= call.partQty) {
        newPickup[call.partNeeded] = pickupStock - call.partQty;
      } else {
        const missing = call.partQty - pickupStock;

        if (shopStock < missing) {
          setTab("market");
          return setMessage(`Not enough ${call.partNeeded}. Buy parts first.`);
        }

        newParts[call.partNeeded] = shopStock - missing;
        newPickup[call.partNeeded] = 0;
      }
    }

    const skillMatch = tech.skill === call.skill || tech.skill === "All-Rounder";
    const weatherTravel = game.weather?.travel || 1;
    const weatherRepair = game.weather?.repair || 1;
    const areaBonus = tech.assignedAreaId === call.areaId ? 0.78 : 1;
    const road = 1 + roadPenalty(game) * 0.08;
    const walkingStarter = vehicle.type === "Walking";

    const travelTime = walkingStarter ? 5 : Math.max(4, Math.floor((call.travel * weatherTravel * areaBonus * tech.trait.travel * road) / vehicle.speed));
    const repairTime = Math.max(8, Math.floor(call.repair * weatherRepair * (skillMatch ? 0.7 : 1) * tech.trait.repair * toolBonus(game, call)));
    const returnTime = walkingStarter ? 5 : Math.max(4, Math.floor((call.back * weatherTravel * areaBonus * tech.trait.travel * road) / vehicle.speed));

    const activeJob = {
      ...call,
      jobId: newId(),
      technicianId: tech.id,
      technicianName: tech.name,
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      vehicleIcon: vehicle.icon,
      phase: "travel",
      phaseRemaining: travelTime,
      phaseTotal: travelTime,
      travelTime,
      repairTime,
      returnTime,
      skillMatch,
      extraIssueChecked: false,
      pendingApproval: false,
      pendingMiniGame: false,
      miniGamePlayed: false,
      miniGameResult: "waiting",
      miniGameBonus: false,
      needsSupport: false,
      supportAssigned: false,
      supportRemaining: 0,
    };

    setGame((g) => ({
      ...g,
      fuel: Math.max(0, g.fuel - vehicle.fuelUse),
      parts: newParts,
      activeJobs: [...g.activeJobs, activeJob],
      dailyMissions: updateMission(g.dailyMissions, "dispatch"),
      technicians: g.technicians.map((t) =>
        t.id === tech.id ? { ...t, status: "Travelling", currentJobId: activeJob.jobId, pickupEquipment: newPickup } : t
      ),
    }));

    setCalls((old) => {
      const next = old.filter((c) => c.id !== call.id);
      return next.length ? next : makeCalls({ ...game, shopRepaired: true });
    });

    setTab("jobs");
    setMessage(`${tech.name} dispatched to ${call.mapPoint} by ${vehicle.name}. Mini-game will open after arrival.`);
  }

  function completeMiniGame(jobId, success, result = success ? "success" : "failed") {
    setGame((g) => ({
      ...g,
      activeJobs: g.activeJobs.map((job) => {
        if (job.jobId !== jobId) return job;

        const boostedRepair = success ? Math.max(6, Math.floor(job.repairTime * MINI_GAME_REPAIR_BONUS)) : job.repairTime;
        const repairSaved = job.repairTime - boostedRepair;
        const isRepairPhase = job.phase === "repair";
        const phaseRemaining = success && isRepairPhase ? Math.max(1, job.phaseRemaining - repairSaved) : job.phaseRemaining;
        const phaseTotal = success && isRepairPhase ? boostedRepair : job.phaseTotal;
        const issueText =
          result === "success"
            ? "Mini-game success! Repair time -12%, coins +8%, and customer rating improved."
            : result === "skipped"
            ? "Mini-game skipped. Normal repair continues with no bonus."
            : "Mini-game failed. Job continues normally with no bonus.";

        return {
          ...job,
          pendingMiniGame: false,
          miniGamePlayed: true,
          miniGameResult: result,
          miniGameBonus: success,
          repairTime: boostedRepair,
          phaseRemaining,
          phaseTotal,
          rewardCoins: success ? Math.round(job.rewardCoins * MINI_GAME_COIN_BONUS) : job.rewardCoins,
          issueText,
        };
      }),
    }));

    setMessage(
      success
        ? "Mini-game success! Repair time -12%, coins +8%, and rating bonus applied."
        : result === "skipped"
        ? "Mini-game skipped. Job continues normally."
        : "Mini-game failed. Job continues normally."
    );
  }

  function approveExtra(jobId) {
    setGame((g) => ({
      ...g,
      activeJobs: g.activeJobs.map((job) =>
        job.jobId === jobId
          ? {
              ...job,
              pendingApproval: false,
              approvedExtraIssue: true,
              phaseRemaining: job.phaseRemaining + job.extraIssueTime,
              phaseTotal: job.phaseTotal + job.extraIssueTime,
              issueText: "Extra issue approved. Repair continues.",
            }
          : job
      ),
    }));
  }

  function declineExtra(jobId) {
    setGame((g) => ({
      ...g,
      activeJobs: g.activeJobs.map((job) =>
        job.jobId === jobId
          ? { ...job, pendingApproval: false, declinedExtraIssue: true, issueText: "Extra issue declined. Original repair continues." }
          : job
      ),
    }));
  }

  function sendBackup(jobId, techId) {
    const backup = game.technicians.find((t) => t.id === techId);
    if (!backup) return;

    setGame((g) => ({
      ...g,
      activeJobs: g.activeJobs.map((job) =>
        job.jobId === jobId
          ? { ...job, supportAssigned: true, supportTechnicianId: backup.id, supportTechnicianName: backup.name, supportRemaining: 30 }
          : job
      ),
      technicians: g.technicians.map((t) => (t.id === backup.id ? { ...t, status: "Supporting", currentJobId: jobId } : t)),
    }));
  }

  function buildTile(b) {
    const area = getActiveArea(game);
    const activeConstruction = area.tiles.filter((t) => t.status === "building").length;

    if (game.level < b.unlockLevel) return setMessage(`${b.type} unlocks at Level ${b.unlockLevel}.`);
    if (activeConstruction >= game.builderTeams) return setMessage(`All builder teams are busy: ${activeConstruction}/${game.builderTeams}.`);
    if (area.tiles.length >= area.landSlots) return setMessage("No free land slots. Upgrade yard or expand globe.");
    if (b.category !== "road" && roadPenalty(game) > 1) return setMessage("Road connection weak. Build more roads first.");
    if (game.coins < b.costCoins || game.money < b.costMoney) return setMessage(`Need 🪙 ${b.costCoins} and 💵 ${b.costMoney}.`);

    const finalTime = Math.ceil(b.buildTime * (roadPenalty(game) > 0 ? 1.1 + roadPenalty(game) * 0.05 : 1));

    const tile = {
      id: newId(),
      type: b.type,
      icon: b.icon,
      level: 1,
      status: "building",
      category: b.category,
      remaining: finalTime,
      totalTime: finalTime,
      family: b.family,
      value: b.value,
    };

    setGame((g) => ({
      ...g,
      coins: g.coins - b.costCoins,
      money: g.money - b.costMoney,
      dailyMissions: updateMission(g.dailyMissions, "build"),
      worldAreas: g.worldAreas.map((a) => (a.id === g.activeAreaId ? { ...a, tiles: [...a.tiles, tile] } : a)),
    }));

    setMessage(`${b.type} construction started. Time: ${time(finalTime)}.`);
  }

  function cutRibbon(areaId, tileId) {
    let opened = null;

    setGame((g) => ({
      ...g,
      worldAreas: g.worldAreas.map((area) =>
        area.id === areaId
          ? {
              ...area,
              tiles: area.tiles.map((tile) => {
                if (tile.id !== tileId) return tile;
                opened = tile;
                return { ...tile, status: "complete", ribbonCut: true };
              }),
            }
          : area
      ),
      worldValue: g.worldValue + (g.worldAreas.find((a) => a.id === areaId)?.tiles.find((t) => t.id === tileId)?.value || 0),
    }));

    if (opened) {
      setRibbon(opened);
      setMessage(`Ribbon cutting complete! ${opened.type} is now open.`);
      setTimeout(() => setRibbon(null), 2500);
    }
  }

  function buyPart(p, qty) {
    if (game.level < p.unlockLevel) return setMessage(`${p.name} unlocks at Level ${p.unlockLevel}.`);
    if (inventoryUsed(game.parts) + qty > storageCapacity(game)) return setMessage("Storage full. Build Warehouse or upgrade Parts Store.");

    const cost = p.cost * qty;
    if (game.coins < cost) return setMessage(`Need ${cost} coins.`);

    setGame((g) => ({
      ...g,
      coins: g.coins - cost,
      parts: { ...g.parts, [p.name]: (g.parts[p.name] || 0) + qty },
    }));
  }

  function sellPart(p, qty) {
    if ((game.parts[p.name] || 0) < qty) return setMessage(`Not enough ${p.name}.`);

    setGame((g) => ({
      ...g,
      coins: g.coins + p.sell * qty,
      parts: { ...g.parts, [p.name]: (g.parts[p.name] || 0) - qty },
    }));
  }

  function autoRestock() {
    let cost = 0;
    let qty = 0;
    const next = { ...game.parts };

    PARTS.filter((p) => p.unlockLevel <= game.level).forEach((p) => {
      const stock = next[p.name] || 0;
      if (stock < p.reorder) {
        const add = p.reorder - stock;
        qty += add;
        cost += add * p.cost;
        next[p.name] = p.reorder;
      }
    });

    if (cost === 0) return setMessage("All unlocked parts are above reorder level.");
    if (inventoryUsed(game.parts) + qty > storageCapacity(game)) return setMessage("Not enough storage for auto restock.");
    if (game.coins < cost) return setMessage(`Auto restock needs ${cost} coins.`);

    setGame((g) => ({ ...g, coins: g.coins - cost, parts: next }));
    setMessage(`Auto restocked for ${cost} coins.`);
  }

  function loadPickup(techId) {
    const tech = game.technicians.find((t) => t.id === techId);
    const parts = { ...game.parts };
    const equipment = { ...tech.pickupEquipment };
    const target = pickupEquipment();

    PARTS.filter((p) => p.unlockLevel <= game.level).forEach((p) => {
      const need = Math.max(0, (target[p.name] || 0) - (equipment[p.name] || 0));
      const available = parts[p.name] || 0;
      const loading = Math.min(need, available);

      if (loading > 0) {
        parts[p.name] -= loading;
        equipment[p.name] = (equipment[p.name] || 0) + loading;
      }
    });

    setGame((g) => ({
      ...g,
      parts,
      technicians: g.technicians.map((t) => (t.id === techId ? { ...t, pickupEquipment: equipment } : t)),
    }));
  }

  function hireTechnician() {
    if (game.level < 5) return setMessage("First technician unlocks at Level 5.");

    if (game.technicians.length >= maxTechnicians(game)) {
      return setMessage(game.level < 21 ? "Level 5–20 allows owner + first technician only." : "New technician slot unlocks every 10 levels after Level 21.");
    }

    const cost = 700 + game.technicians.length * 350;
    if (game.coins < cost) return setMessage(`Need ${cost} coins.`);

    const tech = createTechnician(pick(TECH_NAMES), false, game.activeAreaId);

    setGame((g) => ({
      ...g,
      coins: g.coins - cost,
      technicians: [...g.technicians, tech],
    }));

    setMessage(`${tech.name} joined. Skill: ${tech.skill}. Trait: ${tech.trait.name}. Salary: 10 coins/day.`);
  }

  function trainTech(id) {
    const tech = game.technicians.find((t) => t.id === id);
    const cost = 60 + tech.level * 12;

    if (game.money < cost) return setMessage(`Training needs ${cost} money.`);

    setGame((g) => ({
      ...g,
      money: g.money - cost,
      dailyMissions: updateMission(g.dailyMissions, "train"),
      technicians: g.technicians.map((t) =>
        t.id === id
          ? { ...t, xp: t.xp + 70 + g.trainingLevel * 20, morale: Math.min(100, t.morale + 3), loyalty: Math.min(100, t.loyalty + 3) }
          : t
      ),
    }));
  }

  function upgradeTruck(id) {
    const tech = game.technicians.find((t) => t.id === id);
    const cost = 90 + (tech.truckLevel || 1) * 75;

    if (game.money < cost) return setMessage(`Truck upgrade needs ${cost} money.`);

    setGame((g) => ({
      ...g,
      money: g.money - cost,
      technicians: g.technicians.map((t) => (t.id === id ? { ...t, truckLevel: (t.truckLevel || 1) + 1, loyalty: Math.min(100, t.loyalty + 2) } : t)),
    }));
  }

  function changeUniform(id) {
    const uniforms = ["Classic Red", "Blue Pro", "Safety Yellow", "Black Elite", "Green Eco"];

    setGame((g) => ({
      ...g,
      technicians: g.technicians.map((t) => {
        if (t.id !== id) return t;
        const index = uniforms.indexOf(t.uniform);
        return { ...t, uniform: uniforms[(index + 1) % uniforms.length], morale: Math.min(100, t.morale + 1) };
      }),
    }));
  }

  function paySalaries() {
    if (game.salaryDue <= 0) return setMessage("No salary due.");
    if (game.coins < game.salaryDue) return setMessage(`Need ${game.salaryDue} coins.`);

    setGame((g) => ({
      ...g,
      coins: g.coins - g.salaryDue,
      salaryDue: 0,
      technicians: g.technicians.map((t) => ({ ...t, morale: Math.min(100, t.morale + 15), loyalty: Math.min(100, t.loyalty + 4) })),
    }));
  }

  function approveDayOff(requestId) {
    const request = game.dayOffRequests.find((r) => r.id === requestId);

    setGame((g) => ({
      ...g,
      dayOffRequests: g.dayOffRequests.filter((r) => r.id !== requestId),
      technicians: g.technicians.map((t) =>
        t.id === request.technicianId
          ? { ...t, status: "Day Off", morale: Math.min(100, t.morale + 18), loyalty: Math.min(100, t.loyalty + 5) }
          : t
      ),
    }));
  }

  function denyDayOff(requestId) {
    const request = game.dayOffRequests.find((r) => r.id === requestId);

    setGame((g) => ({
      ...g,
      dayOffRequests: g.dayOffRequests.filter((r) => r.id !== requestId),
      technicians: g.technicians.map((t) =>
        t.id === request.technicianId ? { ...t, morale: Math.max(20, t.morale - 12), loyalty: Math.max(0, t.loyalty - 6) } : t
      ),
    }));
  }

  function buyTool(tool) {
    if (game.level < tool.unlock) return setMessage(`${tool.name} unlocks at Level ${tool.unlock}.`);
    if (game.money < tool.cost) return setMessage(`Need ${tool.cost} money.`);

    setGame((g) => ({
      ...g,
      money: g.money - tool.cost,
      tools: { ...g.tools, [tool.name]: (g.tools[tool.name] || 0) + 1 },
    }));
  }

  function buyVehicle(vehicle) {
    if (game.level < vehicle.unlock) return setMessage(`${vehicle.type} unlocks at Level ${vehicle.unlock}.`);
    if (game.money < vehicle.cost) return setMessage(`Need ${vehicle.cost} money.`);

    const owner = game.technicians.find((t) => t.isOwner);
    const alreadyAssignedOwner = game.vehicles.some((v) => v.assignedTechnicianId === owner?.id);

    const v = {
      id: newId(),
      name: vehicle.type,
      type: vehicle.type,
      icon: vehicle.icon,
      level: 1,
      speed: vehicle.speed,
      fuelUse: vehicle.fuel,
      storage: vehicle.storage,
      assignedTechnicianId: alreadyAssignedOwner ? null : owner?.id || null,
    };

    setGame((g) => ({ ...g, money: g.money - vehicle.cost, vehicles: [...g.vehicles, v] }));
    setMessage(`${vehicle.type} purchased.${alreadyAssignedOwner ? " Assign it from Garage." : " Assigned to owner."}`);
  }

  function assignVehicle(vehicleId, techId) {
    setGame((g) => ({
      ...g,
      vehicles: g.vehicles.map((v) => {
        if (v.id === vehicleId) return { ...v, assignedTechnicianId: techId || null };
        if (techId && v.assignedTechnicianId === techId) return { ...v, assignedTechnicianId: null };
        return v;
      }),
    }));
  }

  function negotiate(contract, mode) {
    if (game.level < contract.unlock) return setMessage(`${contract.name} unlocks at Level ${contract.unlock}.`);
    if (game.signedContracts.includes(contract.id)) return setMessage("Already signed.");

    const costMultiplier = mode === "safe" ? 0.9 : mode === "aggressive" ? 1.15 : 1;
    const chanceBonus = mode === "safe" ? 20 : mode === "aggressive" ? -18 : 0;
    const cost = Math.round(contract.cost * costMultiplier);
    const chance = Math.max(10, Math.min(95, contract.chance + chanceBonus + Math.floor(townHappiness(game) / 10) + Math.floor(averageRating(game) * 5)));

    if (game.money < cost) return setMessage(`Need ${cost} money.`);

    if (Math.random() * 100 > chance) {
      setGame((g) => ({ ...g, money: Math.max(0, g.money - Math.round(cost * 0.15)), reputation: Math.max(0, g.reputation - 1) }));
      return setMessage(`Negotiation failed. Success chance was ${chance}%.`);
    }

    setGame((g) => ({
      ...g,
      money: g.money - cost,
      signedContracts: [...g.signedContracts, contract.id],
      dailyMissions: updateMission(g.dailyMissions, "contract"),
    }));

    setMessage(`${contract.name} signed with ${mode} negotiation.`);
  }

  function expandArea() {
    if (game.level < 21) return setMessage("Globe expansion unlocks at Level 21.");

    const cost = nextAreaCost(game);
    if (game.coins < cost.coins || game.money < cost.money) return setMessage(`Need 🪙 ${cost.coins} and 💵 ${cost.money}.`);

    const areaId = `area-${game.worldAreas.length + 1}`;
    const areaName = nextAreaName(game);

    const area = {
      id: areaId,
      name: areaName,
      unlocked: true,
      landSlots: 8,
      tiles: [
        { id: `${areaId}-road`, type: "Road", icon: "🛣️", level: 1, status: "complete", category: "road", family: false, value: 100 },
        { id: `${areaId}-field`, type: "Expansion Field", icon: "🌍", level: 1, status: "complete", category: "decoration", family: false, value: 200 },
      ],
    };

    setGame((g) => ({
      ...g,
      coins: g.coins - cost.coins,
      money: g.money - cost.money,
      activeAreaId: areaId,
      worldAreas: [...g.worldAreas, area],
      worldValue: g.worldValue + 1000,
    }));

    setMessage(`${areaName} unlocked. Level 21 gives one new tech slot; after that, one new slot every 10 levels.`);
  }

  function switchArea(areaId) {
    setGame((g) => ({ ...g, activeAreaId: areaId }));
    setCalls(makeCalls({ ...game, activeAreaId: areaId }));
  }

  function claimDailyReward() {
    if (game.lastLoginClaimDay === game.day) return setMessage("Daily reward already claimed for this game day.");

    const streak = game.loginStreak + 1;
    const reward = DAILY_REWARDS[(streak - 1) % DAILY_REWARDS.length];

    setGame((g) => ({
      ...g,
      lastLoginClaimDay: g.day,
      loginStreak: streak,
      coins: g.coins + (reward.coins || 0),
      money: g.money + (reward.money || 0),
      fuel: Math.min(200, g.fuel + (reward.fuel || 0)),
      tools: reward.tool ? { ...g.tools, [reward.tool]: (g.tools[reward.tool] || 0) + 1 } : g.tools,
      parts: reward.parts ? addParts(g.parts, reward.parts) : g.parts,
      technicians: reward.techXp ? g.technicians.map((t) => ({ ...t, xp: t.xp + reward.techXp })) : g.technicians,
    }));

    setMessage(`Daily reward claimed: ${reward.label}. Streak: ${streak}.`);
  }

  function addParts(parts, add) {
    const next = { ...parts };
    Object.entries(add).forEach(([key, value]) => {
      next[key] = (next[key] || 0) + value;
    });
    return next;
  }

  function claimMission(missionId) {
    const mission = game.dailyMissions.find((m) => m.id === missionId);
    if (!mission?.done || mission.claimed) return;

    setGame((g) => ({
      ...g,
      coins: g.coins + mission.coins,
      money: g.money + mission.money,
      dailyMissions: g.dailyMissions.map((m) => (m.id === missionId ? { ...m, claimed: true } : m)),
    }));
  }

  function claimMilestone(m) {
    if (game.milestoneClaimed.includes(m.level)) return;

    setGame((g) => ({
      ...g,
      coins: g.coins + m.coins,
      money: g.money + m.money,
      milestoneClaimed: [...g.milestoneClaimed, m.level],
    }));
  }

  function checkAchievements(g, notes) {
    const achievements = [
      { id: "shop-repair", name: "Shop Repaired", condition: g.shopRepaired, coins: 50, money: 10 },
      { id: "first-repair", name: "First Repair", condition: g.completedJobs >= 1, coins: 100, money: 0 },
      { id: "ten-jobs", name: "10 Jobs Completed", condition: g.completedJobs >= 10, coins: 500, money: 0 },
      { id: "hundred-jobs", name: "100 Jobs Completed", condition: g.completedJobs >= 100, coins: 3000, money: 300 },
      { id: "first-bike", name: "First Service Bike", condition: g.vehicles.some((v) => v.type === "Service Bike"), coins: 150, money: 20 },
      { id: "first-pickup", name: "First Pickup", condition: g.vehicles.some((v) => v.type === "White/Red Pickup"), coins: 200, money: 30 },
      { id: "first-tech", name: "First Technician Hired", condition: g.technicians.length >= 2, coins: 400, money: 0 },
      { id: "first-contract", name: "First Contract Signed", condition: g.signedContracts.length >= 1, coins: 0, money: 100 },
      { id: "hospital-built", name: "Healthcare Builder", condition: completedBuildings(g, "Hospital") >= 1, coins: 700, money: 0 },
      { id: "global-unlock", name: "First Global Area", condition: g.worldAreas.length >= 2, coins: 0, money: 300 },
      { id: "five-star", name: "5-Star Garage", condition: averageRating(g) >= 4.8 && g.ratingCount >= 5, coins: 0, money: 200 },
    ];

    achievements.forEach((a) => {
      if (!g.achievements.includes(a.id) && a.condition) {
        g.achievements = [...g.achievements, a.id];
        g.coins += a.coins;
        g.money += a.money;
        notes.push(`Achievement unlocked: ${a.name}.`);
      }
    });

    return g;
  }

  function addFriend() {
    const available = FRIENDS.filter((f) => !game.friends.includes(f));
    if (!available.length) return setMessage("No more suggested friends.");

    const friend = pick(available);
    setGame((g) => ({ ...g, friends: [...g.friends, friend] }));
  }

  function createClub() {
    if (game.level < 5) return setMessage("Clubs unlock at Level 5.");
    if (game.club) return setMessage("Club already created.");
    if (game.money < 120) return setMessage("Need 120 money.");

    setGame((g) => ({
      ...g,
      money: g.money - 120,
      club: { name: `${g.companyName} Club`, members: [g.companyName, ...g.friends.slice(0, 4)], level: 1 },
    }));
  }

  function startClubEvent() {
    if (!game.club) return setMessage("Create a club first.");
    if (game.clubEvent) return setMessage("Club event already running.");

    const scale = Math.max(1, Math.floor(game.level / 5));

    setGame((g) => ({
      ...g,
      clubEvent: {
        name: `Highway Rescue Event L${scale}`,
        remaining: 120 + scale * 20,
        rewardCoins: 500 + scale * 180,
        rewardMoney: 80 + scale * 25,
        rewardRep: 10 + scale * 4,
      },
    }));
  }

  function buyInsurance(type) {
    const cost = type === "technicians" ? 250 : type === "vehicles" ? 300 : 180;
    if (game.money < cost) return setMessage(`Insurance needs ${cost} money.`);

    setGame((g) => ({
      ...g,
      money: g.money - cost,
      insurance: { ...g.insurance, [type]: true },
    }));
  }

  function hireBuilder() {
    const cost = 400 + game.builderTeams * 300;
    if (game.money < cost) return setMessage(`Builder team needs ${cost} money.`);

    setGame((g) => ({ ...g, money: g.money - cost, builderTeams: g.builderTeams + 1 }));
  }

  function hireDispatchManager() {
    if (game.level < 15) return setMessage("Dispatch manager unlocks at Level 15.");
    if (game.dispatchManager) return setMessage("Dispatch manager already hired.");
    if (game.money < 500) return setMessage("Need 500 money.");

    setGame((g) => ({ ...g, money: g.money - 500, dispatchManager: true }));
  }

  function upgradeYard() {
    const cost = 150 + game.yardLevel * 120;
    if (game.money < cost) return setMessage(`Need ${cost} money.`);

    setGame((g) => ({
      ...g,
      money: g.money - cost,
      yardLevel: g.yardLevel + 1,
      worldAreas: g.worldAreas.map((a) => (a.id === g.activeAreaId ? { ...a, landSlots: a.landSlots + 2 } : a)),
    }));
  }

  function upgradePartShop() {
    const cost = 120 + game.partShopLevel * 110;
    if (game.money < cost) return setMessage(`Need ${cost} money.`);

    setGame((g) => ({ ...g, money: g.money - cost, partShopLevel: g.partShopLevel + 1, storageBase: g.storageBase + 15 }));
  }

  function upgradeTraining() {
    const cost = 140 + game.trainingLevel * 130;
    if (game.money < cost) return setMessage(`Need ${cost} money.`);

    setGame((g) => ({ ...g, money: g.money - cost, trainingLevel: g.trainingLevel + 1 }));
  }

  function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    setGame(null);
    setCalls([]);
    setSetup({ companyName: "", ownerName: "", townName: "", countryName: "" });
    setMessage("Game reset.");
  }

  if (!game?.started) {
    return (
      <main style={styles.startPage}>
        <section style={styles.startCard}>
          <div style={styles.logo}>🛠️🌍</div>
          <h1 style={styles.title}>FleetFix Tycoon</h1>
          <p style={styles.subtitle}>
            Start with a broken shop, repair it for free, walk to your first service call, buy a house, unlock service bike at Level 2, pickup at Level 3, and hire your first technician at Level 5.
          </p>

          <div style={styles.formGrid}>
            <Input label="Company Name" value={setup.companyName} set={(v) => setSetup({ ...setup, companyName: v })} placeholder="MFS Fleet Repairs" />
            <Input label="Owner Name" value={setup.ownerName} set={(v) => setSetup({ ...setup, ownerName: v })} placeholder="Harkirat" />
            <Input label="First Town Name" value={setup.townName} set={(v) => setSetup({ ...setup, townName: v })} placeholder="Phoenix Valley" />
            <Input label="Country / World Name" value={setup.countryName} set={(v) => setSetup({ ...setup, countryName: v })} placeholder="Repair Nation" />
          </div>

          {message && <div style={styles.message}>📢 {message}</div>}

          <button style={styles.mainButton} onClick={startGame}>
            Enter Broken Shop
          </button>
        </section>
      </main>
    );
  }

  const active = getActiveArea(game);
  const freeTechs = game.technicians.filter((t) => t.status === "Free" && t.energy > 0);
  const availableParts = PARTS.filter((p) => p.unlockLevel <= game.level);
  const locked = PARTS.filter((p) => p.unlockLevel > game.level).slice(0, 8);
  const bonus = contractBonus(game);
  const activeMiniJob = miniJobId ? game.activeJobs.find((job) => job.jobId === miniJobId && job.pendingMiniGame) : null;

  return (
    <main style={styles.page}>
      {activeMiniJob && (
        <MiniGameModal
          job={activeMiniJob}
          onFinish={(success, result) => {
            completeMiniGame(activeMiniJob.jobId, success, result);
            setMiniJobId(null);
          }}
        />
      )}

      {review && (
        <Overlay>
          <h3>🎉 Job Complete</h3>
          <p style={styles.smallText}>
            {review.technicianName} finished {review.jobTitle}
          </p>
          <div style={styles.bigStars}>{review.stars}</div>
          <div style={styles.rewardGrid}>
            <Mini label="Coins Earned" value={`🪙 ${review.coins}`} />
            <Mini label="Money Earned" value={`💵 ${review.money}`} />
            <Mini label="XP Earned" value={`XP ${review.xp}`} />
            <Mini label="Rating" value={`⭐ ${review.rating}`} />
            <Mini label="Technician XP" value={`+${review.techXp}`} />
          </div>
          {review.miniGameBonus && <div style={styles.tip}>Mini-game bonus applied: repair time -12%, coins +8%, rating improved.</div>}
          <p>{review.text}</p>
          <button style={styles.mainButtonSmall} onClick={() => setReview(null)}>
            Collect
          </button>
        </Overlay>
      )}

      {unlockPopup && !review && !activeMiniJob && (
        <Overlay>
          <div style={styles.ribbonEmoji}>{unlockPopup.icon}</div>
          <h2>Level {unlockPopup.level} Unlock</h2>
          <h3>{unlockPopup.title}</h3>
          <p>{unlockPopup.text}</p>
          <button style={styles.mainButtonSmall} onClick={() => setUnlockPopup(null)}>
            Great
          </button>
        </Overlay>
      )}

      {dayOffPopup && (
        <Overlay>
          <h3>💭 {dayOffPopup.technicianName} asks for day off</h3>
          <p>{dayOffPopup.reason}</p>
          <button
            style={styles.greenButton}
            onClick={() => {
              approveDayOff(dayOffPopup.id);
              setDayOffPopup(null);
            }}
          >
            Approve
          </button>
          <button
            style={styles.dangerButton}
            onClick={() => {
              denyDayOff(dayOffPopup.id);
              setDayOffPopup(null);
            }}
          >
            Deny
          </button>
        </Overlay>
      )}

      {ribbon && (
        <Overlay>
          <div style={styles.ribbonEmoji}>🎀✂️</div>
          <h2>Ribbon Cutting!</h2>
          <p>
            {ribbon.icon} {ribbon.type} is now open.
          </p>
          <button style={styles.mainButtonSmall} onClick={() => setRibbon(null)}>
            Open
          </button>
        </Overlay>
      )}

      <header style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>🛠️ {game.companyName}</h1>
          <p style={styles.smallText}>
            Owner: {game.ownerName} • Country: {game.countryName} • Area: {active.name}
          </p>
          <p style={styles.rank}>
            🏆 {rank(game.reputation)} • ⭐ {averageRating(game).toFixed(1)} Rating • 😊 {townHappiness(game)} Happiness
          </p>
        </div>

        <div style={styles.statsGrid}>
          <Stat label="Coins" value={`🪙 ${game.coins}`} />
          <Stat label="Money" value={`💵 ${game.money}`} />
          <Stat label="Fuel" value={`⛽ ${game.fuel}`} />
          <Stat label="XP" value={`${game.xp}/${xpNeed(game.level)}`} />
          <Stat label="Level" value={game.level} />
          <Stat label="Rep" value={`⭐ ${game.reputation}`} />
          <Stat label="Day" value={`${game.day} / ${game.dayTimer}s`} />
          <Stat label="Techs" value={`${game.technicians.length}/${maxTechnicians(game)}`} />
        </div>
      </header>

      <nav style={styles.nav}>
        {TABS.map(([id, icon, label]) => (
          <button key={id} style={tab === id ? styles.navActive : styles.navButton} onClick={() => setTab(id)}>
            <span>{icon}</span>
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <section style={styles.content}>
        {message && <div style={styles.message}>📢 {message}</div>}

        {tab === "town" && (
          <Panel>
            <Top
              title={`🏙️ ${active.name}`}
              text="Begin with a broken shop. Roads and decorations complete without ribbon. Ribbon cutting is only for buildings."
              action={
                <button style={styles.dangerButton} onClick={resetGame}>
                  Reset
                </button>
              }
            />

            {!game.shopRepaired && (
              <div style={styles.message}>
                🏚️ Your first shop is broken. Repair it for free to start your repair business.
                <br />
                <button style={styles.greenButton} onClick={repairBrokenShop}>
                  Repair Broken Shop for Free
                </button>
              </div>
            )}

            <div style={styles.statLine}>
              <Mini label="World Value" value={`🏙️ ${game.worldValue}`} />
              <Mini label="Land" value={`${active.tiles.length}/${active.landSlots}`} />
              <Mini label="Builders" value={`${active.tiles.filter((t) => t.status === "building").length}/${game.builderTeams}`} />
              <Mini label="Road Penalty" value={roadPenalty(game)} />
              <Mini label="Storage" value={`${inventoryUsed(game.parts)}/${storageCapacity(game)}`} />
            </div>

            <div style={styles.tileGrid}>
              {active.tiles.map((tile) => {
                const progress = tile.status === "building" ? Math.round(100 - (tile.remaining / tile.totalTime) * 100) : 100;

                return (
                  <div key={tile.id} style={tile.status === "broken" ? styles.tileBroken : tile.status === "building" ? styles.tileBuilding : tile.status === "readyRibbon" ? styles.tileRibbon : styles.tile}>
                    <div style={styles.tileIcon}>{tile.icon}</div>
                    <b>{tile.type}</b>
                    <small>{tile.category || guessTileCategory(tile.type)}</small>
                    {tile.status === "broken" && <small>Needs free repair</small>}
                    {tile.status === "building" && (
                      <>
                        <small>Building: {time(tile.remaining)}</small>
                        <Bar value={progress} />
                      </>
                    )}
                    {tile.status === "readyRibbon" && (
                      <button style={styles.greenButton} onClick={() => cutRibbon(active.id, tile.id)}>
                        🎀 Cut Ribbon
                      </button>
                    )}
                    {tile.status === "complete" && <small>Open</small>}
                  </div>
                );
              })}
            </div>

            <h3>Construct Buildings, Roads & Decorations</h3>
            <div style={styles.cards}>
              {BUILDINGS.map((b) => (
                <Card key={b.type}>
                  <div style={styles.cardIcon}>{b.icon}</div>
                  <h3>{b.type}</h3>
                  <p>{b.description}</p>
                  <p>
                    Type: {b.category} • Unlock L{b.unlockLevel} • Time {time(b.buildTime)}
                  </p>
                  <p>
                    Cost 🪙 {b.costCoins} • 💵 {b.costMoney} • 😊 +{b.happiness}
                  </p>
                  <button style={game.level >= b.unlockLevel ? styles.darkButton : styles.lockedButton} onClick={() => buildTile(b)}>
                    Start Construction
                  </button>
                </Card>
              ))}
            </div>

            <h3>2.5D Town Preview</h3>
            <div style={styles.map}>
              <MapBuilding icon={game.shopRepaired ? "🔧" : "🏚️"} title={game.shopRepaired ? "Repair Shop" : "Broken Shop"} style={{ left: "6%", top: "14%" }} />
              <MapBuilding icon="🛣️" title="Main Road" style={{ left: "28%", top: "12%" }} />
              <MapBuilding icon="🚨" title="Call Spot" style={{ right: "29%", top: "12%" }} />
              <MapBuilding icon="🏡" title="Future House" style={{ right: "8%", top: "16%" }} />
              <MapBuilding icon="🌍" title="Expansion" style={{ right: "10%", bottom: "9%" }} />
              <div style={styles.road} />
              <div style={styles.roadMark1} />
              <div style={styles.roadMark2} />
              <div style={styles.roadMark3} />

              {game.activeJobs.map((job, index) => (
                <div key={job.jobId} style={{ ...styles.vehicleMove, left: `${vehiclePosition(job)}%`, top: `${58 + index * 7}%` }}>
                  {job.vehicleName === "Walking" ? <div style={styles.walker}>🚶</div> : <Pickup />}
                  <div style={styles.vehicleLabel}>{job.technicianName}</div>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {tab === "calls" && (
          <Panel>
            <Top
              title="🚨 Service Calls"
              text="After shop repair, jobs are always available. Weather affects travel, repair and return time only."
              action={
                <button style={styles.darkButton} onClick={() => setCalls(makeCalls(game))}>
                  Refresh Calls
                </button>
              }
            />

            {!game.shopRepaired && (
              <div style={styles.warn}>
                No service calls yet. Go to Town and repair the broken shop for free first.
              </div>
            )}

            <div style={styles.eventStrip}>
              <span>
                {game.weather.icon} Weather: <b>{game.weather.name}</b> — {game.weather.text}
              </span>
              <span>
                Weather Time Effect: Travel x{game.weather.travel}, Repair x{game.weather.repair}, Accident x{game.weather.accident}
              </span>
              {game.festivalEvent && (
                <span>
                  {game.festivalEvent.icon} Event: <b>{game.festivalEvent.name}</b> — {game.festivalEvent.text}
                </span>
              )}
            </div>

            {game.dispatchManager && <div style={styles.tip}>📡 Dispatch Manager Tip: match skill + assigned area + available fuel for best rating.</div>}

            <div style={styles.cards}>
              {calls.map((call) => (
                <Card key={call.id} special={call.noPay}>
                  <div style={styles.cardTop}>
                    <PartIcon icon={call.icon} label={call.icon === "▣" ? "BRAKE KIT" : ""} />
                    <span style={urgencyStyle(call.urgency)}>{call.urgency}</span>
                  </div>
                  <h3>{call.title}</h3>
                  <p>{call.problem}</p>
                  <p>
                    <b>Customer:</b> {call.customer}
                  </p>
                  <p>
                    <b>Vehicle:</b> {call.vehicle}
                  </p>
                  <p>
                    <b>Location:</b> {call.mapPoint}
                  </p>
                  <p>
                    <b>Skill:</b> {call.skill}
                  </p>
                  <p>
                    <b>Parts:</b> {call.partQty} {call.partNeeded}
                  </p>
                  <p>
                    <b>Mini-game:</b> {call.miniGame}
                  </p>
                  <p>
                    <b>Reward:</b> 🪙 {call.rewardCoins} • 💵 {call.rewardMoney} • XP {call.xp}
                  </p>

                  <div style={styles.stack}>
                    {freeTechs.length === 0 ? (
                      <div style={styles.warn}>No free technicians.</div>
                    ) : (
                      freeTechs.map((tech) => (
                        <button
                          key={tech.id}
                          style={tech.skill === call.skill || tech.skill === "All-Rounder" ? styles.greenButton : styles.orangeButton}
                          onClick={() => dispatch(call, tech.id)}
                        >
                          Send {tech.name} {game.vehicles.find((v) => v.assignedTechnicianId === tech.id)?.icon || "🚶"}
                        </button>
                      ))
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Panel>
        )}

        {tab === "jobs" && (
          <Panel>
            <Top title="⏱️ Active Jobs" text="Owner starts by walking. Bike unlocks Level 2. Pickup unlocks Level 3. Weather affects timing only." />

            <div style={styles.cards}>
              {game.activeJobs.length === 0 ? (
                <div style={styles.empty}>No active jobs. Dispatch from service calls.</div>
              ) : (
                game.activeJobs.map((job) => {
                  const progress = Math.round(((job.phaseTotal - job.phaseRemaining) / job.phaseTotal) * 100);
                  const backups = freeTechs.filter((t) => t.id !== job.technicianId);

                  return (
                    <Card key={job.jobId} issue={job.pendingMiniGame || job.pendingApproval || job.needsSupport}>
                      <div style={styles.cardTop}>
                        <h3>
                          {job.icon} {job.title}
                        </h3>
                        <span style={styles.timer}>{job.pendingMiniGame ? "Mini" : job.pendingApproval ? "Approval" : job.needsSupport ? "Backup" : time(job.phaseRemaining)}</span>
                      </div>
                      <p>Technician: {job.technicianName}</p>
                      <p>Travel Mode: {job.vehicleIcon || "🚶"} {job.vehicleName}</p>
                      <p>Location: {job.mapPoint}</p>
                      <p>
                        Travel: {time(job.travelTime)} • Repair: {time(job.repairTime)} • Return: {time(job.returnTime)}
                      </p>
                      <p style={styles.phase}>{job.pendingMiniGame ? `Mini-game: ${job.miniGame}` : job.pendingApproval ? "Waiting for extra issue approval" : job.needsSupport ? "Backup required" : job.phase}</p>
                      {job.issueText && <div style={styles.warn}>{job.issueText}</div>}
                      <Bar value={progress} />

                      {job.pendingMiniGame && (
                        <div style={styles.tip}>Playable mini-game is open. Finish it or skip inside the modal to continue repair.</div>
                      )}

                      {job.pendingApproval && (
                        <div style={styles.actions}>
                          <button style={styles.greenButton} onClick={() => approveExtra(job.jobId)}>
                            Approve Extra Issue
                          </button>
                          <button style={styles.dangerButton} onClick={() => declineExtra(job.jobId)}>
                            Decline
                          </button>
                        </div>
                      )}

                      {job.needsSupport && !job.supportAssigned && (
                        <div style={styles.stack}>
                          {backups.length === 0 ? (
                            <div style={styles.warn}>No backup technician available.</div>
                          ) : (
                            backups.map((t) => (
                              <button key={t.id} style={styles.greenButton} onClick={() => sendBackup(job.jobId, t.id)}>
                                Send {t.name} as Backup
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </Panel>
        )}

        {tab === "team" && (
          <Panel>
            <Top
              title="👨‍🔧 Technicians"
              text="L1–4 owner only. L5–20 owner + first technician. L21 unlocks one area + one tech. Then one new tech slot every 10 levels."
              action={
                <button style={styles.mainButtonSmall} onClick={paySalaries}>
                  Pay Salaries 🧾 {game.salaryDue}
                </button>
              }
            />

            {game.dayOffRequests.length > 0 && (
              <div style={styles.notice}>
                <h3>🌴 Day Off Requests</h3>
                {game.dayOffRequests.map((r) => (
                  <div key={r.id} style={styles.row}>
                    <div>
                      <b>{r.technicianName}</b>
                      <p>{r.reason}</p>
                    </div>
                    <div>
                      <button style={styles.greenButton} onClick={() => approveDayOff(r.id)}>
                        Approve
                      </button>
                      <button style={styles.dangerButton} onClick={() => denyDayOff(r.id)}>
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={styles.cards}>
              {game.technicians.map((tech) => (
                <Card key={tech.id} blue={tech.status === "Hospital"}>
                  <div style={styles.avatar}>{tech.avatar}</div>
                  <div style={styles.cardTop}>
                    <h3>
                      {tech.isOwner ? "👑" : "🔧"} {tech.name}
                    </h3>
                    <span style={styles.badge}>{tech.status}</span>
                  </div>
                  <p>Skill: {tech.skill}</p>
                  <p>
                    Trait: {tech.trait.name} — {tech.trait.text}
                  </p>
                  <p>Uniform: {tech.uniform}</p>
                  <p>Assigned Area: {game.worldAreas.find((a) => a.id === tech.assignedAreaId)?.name}</p>
                  <p>
                    Tech Level: {tech.level} • XP {tech.xp}/{techXpNeed(tech.level)}
                  </p>
                  <p>
                    Salary/day: 🧾 {salaryFor(tech.level, tech.isOwner)} {tech.isOwner ? "(Owner)" : ""}
                  </p>

                  <Meter label="Energy" value={tech.energy} color="#16a34a" />
                  <Meter label="Morale" value={tech.morale} color="#2563eb" />
                  <Meter label="Loyalty" value={tech.loyalty} color="#a855f7" />

                  <div style={styles.pickupBox}>
                    <b>Equipment</b>
                    {availableParts.slice(0, 10).map((p) => (
                      <span key={p.name}>
                        {p.icon} {p.name}: {tech.pickupEquipment[p.name] || 0}
                      </span>
                    ))}
                    <button style={styles.lightButton} onClick={() => loadPickup(tech.id)}>
                      Load Equipment
                    </button>
                  </div>

                  <select
                    style={styles.input}
                    value={tech.assignedAreaId}
                    onChange={(e) =>
                      setGame((g) => ({
                        ...g,
                        technicians: g.technicians.map((t) => (t.id === tech.id ? { ...t, assignedAreaId: e.target.value } : t)),
                      }))
                    }
                  >
                    {game.worldAreas.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>

                  <div style={styles.actions}>
                    <button style={styles.greenButton} onClick={() => trainTech(tech.id)}>
                      Train
                    </button>
                    <button style={styles.orangeButton} onClick={() => upgradeTruck(tech.id)}>
                      Upgrade Pickup Skill
                    </button>
                    <button style={styles.darkButton} onClick={() => changeUniform(tech.id)}>
                      Uniform
                    </button>
                  </div>

                  {renameId === tech.id ? (
                    <div style={styles.actions}>
                      <input style={styles.input} value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
                      <button
                        style={styles.greenButton}
                        onClick={() => {
                          setGame((g) => ({ ...g, technicians: g.technicians.map((t) => (t.id === renameId ? { ...t, name: renameValue } : t)) }));
                          setRenameId("");
                          setRenameValue("");
                        }}
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      style={styles.lightButton}
                      onClick={() => {
                        setRenameId(tech.id);
                        setRenameValue(tech.name);
                      }}
                    >
                      Rename
                    </button>
                  )}
                </Card>
              ))}
            </div>

            <button style={game.level >= 5 ? styles.darkFullButton : styles.lockedFullButton} onClick={hireTechnician}>
              {game.level < 5
                ? "Hire Technician Locked Until Level 5"
                : game.technicians.length >= maxTechnicians(game)
                ? `Technician Limit Reached ${game.technicians.length}/${maxTechnicians(game)}`
                : `Hire Technician — 🪙 ${700 + game.technicians.length * 350}`}
            </button>
          </Panel>
        )}

        {tab === "garage" && (
          <Panel>
            <Top title="🏚️ Garage Interior" text="Owner starts on foot. Service Bike unlocks Level 2. White/Red Pickup unlocks Level 3." />

            <div style={styles.garage}>
              <GarageZone icon="👑" title="Owner Desk" text={game.ownerName} />
              <GarageZone icon="🧰" title="Tool Wall" text={`${Object.values(game.tools).filter((v) => v > 0).length} tool types`} />
              <GarageZone icon="📦" title="Parts Shelf" text={`${inventoryUsed(game.parts)}/${storageCapacity(game)}`} />
              <GarageZone icon="🔧" title="Repair Bay" text={`${game.activeJobs.length} active jobs`} />
              <GarageZone icon="🚗" title="Vehicle Bay" text={`${game.vehicles.length} vehicles`} />
              <GarageZone icon="🚶" title="Current Start" text={game.vehicles.length ? "Vehicle available" : "Owner walking"} />
            </div>

            <h3>Your Vehicles</h3>
            <div style={styles.cards}>
              {game.vehicles.length === 0 && <div style={styles.empty}>No vehicle yet. Owner walks to starter jobs. Buy Service Bike at Level 2.</div>}
              {game.vehicles.map((v) => (
                <Card key={v.id}>
                  <div style={styles.cardIcon}>{v.icon}</div>
                  <h3>{v.name}</h3>
                  <p>
                    Speed {v.speed} • Storage {v.storage} • Fuel/use {v.fuelUse}
                  </p>
                  <select style={styles.input} value={v.assignedTechnicianId || ""} onChange={(e) => assignVehicle(v.id, e.target.value)}>
                    <option value="">Unassigned</option>
                    {game.technicians.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </Card>
              ))}
            </div>

            <h3>Vehicle Shop</h3>
            <div style={styles.cards}>
              {VEHICLES.map((v) => (
                <Card key={v.type}>
                  <div style={styles.cardIcon}>{v.icon}</div>
                  <h3>{v.type}</h3>
                  <p>
                    Unlock L{v.unlock} • 💵 {v.cost}
                  </p>
                  <p>
                    Speed {v.speed} • Storage {v.storage} • Fuel/use {v.fuel}
                  </p>
                  <button style={game.level >= v.unlock ? styles.greenButton : styles.lockedButton} onClick={() => buyVehicle(v)}>
                    {game.level >= v.unlock ? "Buy Vehicle" : `Locked Until L${v.unlock}`}
                  </button>
                </Card>
              ))}
            </div>

            <h3>Tool Shop</h3>
            <div style={styles.cards}>
              {TOOLS.map((tool) => (
                <Card key={tool.name}>
                  <div style={styles.cardIcon}>{tool.icon}</div>
                  <h3>{tool.name}</h3>
                  <p>Owned: {game.tools[tool.name] || 0}</p>
                  <p>
                    Unlock L{tool.unlock} • 💵 {tool.cost}
                  </p>
                  <button style={game.level >= tool.unlock ? styles.darkButton : styles.lockedButton} onClick={() => buyTool(tool)}>
                    Buy Tool
                  </button>
                </Card>
              ))}
            </div>
          </Panel>
        )}

        {tab === "market" && (
          <Panel>
            <Top
              title="🛒 Parts Marketplace"
              text="Buy parts for your self-operated shop or sell extra inventory."
              action={
                <button style={styles.mainButtonSmall} onClick={autoRestock}>
                  Auto Restock
                </button>
              }
            />

            <div style={styles.statLine}>
              <Mini label="Storage" value={`${inventoryUsed(game.parts)}/${storageCapacity(game)}`} />
              <Mini label="Parts Store" value={`Level ${game.partShopLevel}`} />
              <Mini label="Fuel" value={`⛽ ${game.fuel}/200`} />
              <Mini label="Insurance" value={game.insurance.parts ? "Active" : "None"} />
            </div>

            <button
              style={styles.orangeButton}
              onClick={() => {
                if (game.coins < 120) return setMessage("Need 120 coins.");
                setGame((g) => ({ ...g, coins: g.coins - 120, fuel: Math.min(200, g.fuel + 60) }));
              }}
            >
              Emergency Fuel +60 — 🪙 120
            </button>

            <div style={styles.cards}>
              {availableParts.map((p) => {
                const stock = game.parts[p.name] || 0;
                const low = stock < p.reorder;

                return (
                  <Card key={p.name} issue={low}>
                    <PartIcon icon={p.icon} label={p.label} />
                    <h3>{p.name}</h3>
                    <p>
                      Stock: <b>{stock}</b> • Reorder: {p.reorder}
                    </p>
                    <p>
                      Buy 🪙 {p.cost} • Sell 🪙 {p.sell}
                    </p>
                    {low && <div style={styles.warn}>Low stock</div>}
                    <div style={styles.actions}>
                      <button style={styles.orangeButton} onClick={() => buyPart(p, 1)}>
                        Buy 1
                      </button>
                      <button style={styles.darkButton} onClick={() => buyPart(p, 5)}>
                        Buy 5
                      </button>
                      <button style={styles.greenButton} onClick={() => buyPart(p, 10)}>
                        Buy 10
                      </button>
                      <button style={styles.lightButton} onClick={() => sellPart(p, 1)}>
                        Sell 1
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {locked.length > 0 && (
              <>
                <h3>Locked Future Parts</h3>
                <div style={styles.cards}>
                  {locked.map((p) => (
                    <Card key={p.name}>
                      <PartIcon icon={p.icon} label={p.label} />
                      <h3>{p.name}</h3>
                      <p>Unlocks at Level {p.unlockLevel}</p>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </Panel>
        )}

        {tab === "contracts" && (
          <Panel>
            <Top title="📄 Contracts & Negotiation" text="No loan system. No story chapters. Contracts use safe, balanced or aggressive negotiation." />

            <div style={styles.statLine}>
              <Mini label="Coin Bonus" value={`+${bonus.coin}%`} />
              <Mini label="Money Bonus" value={`+${bonus.money}%`} />
              <Mini label="Signed" value={game.signedContracts.length} />
            </div>

            <div style={styles.cards}>
              {contracts(game.level).map((c) => {
                const signed = game.signedContracts.includes(c.id);
                const lockedContract = game.level < c.unlock;

                return (
                  <Card key={c.id} signed={signed}>
                    <div style={styles.cardIcon}>{lockedContract ? "🔒" : "📄"}</div>
                    <h3>{c.name}</h3>
                    <p>
                      Unlock L{c.unlock} • Cost 💵 {c.cost}
                    </p>
                    <p>
                      Bonus: +{c.coin}% coins, +{c.money}% money
                    </p>
                    {signed ? (
                      <button style={styles.ownedButton}>Signed</button>
                    ) : lockedContract ? (
                      <button style={styles.lockedButton}>Locked</button>
                    ) : (
                      <div style={styles.actions}>
                        <button style={styles.greenButton} onClick={() => negotiate(c, "safe")}>
                          Safe
                        </button>
                        <button style={styles.darkButton} onClick={() => negotiate(c, "balanced")}>
                          Balanced
                        </button>
                        <button style={styles.orangeButton} onClick={() => negotiate(c, "aggressive")}>
                          Aggressive
                        </button>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </Panel>
        )}

        {tab === "globe" && (
          <Panel>
            <Top
              title="🌍 Globe Command Screen"
              text="All areas are visible from one screen. Switch active area and deploy from one command center."
              action={
                <button style={game.level >= 21 ? styles.greenButton : styles.lockedButton} onClick={expandArea}>
                  {game.level >= 21 ? "Expand Area" : "Unlocks L21"}
                </button>
              }
            />

            <div style={styles.statLine}>
              <Mini label="Country" value={game.countryName} />
              <Mini label="Areas" value={game.worldAreas.length} />
              <Mini label="Next Coins" value={`🪙 ${nextAreaCost(game).coins}`} />
              <Mini label="Next Money" value={`💵 ${nextAreaCost(game).money}`} />
              <Mini label="Next Tech Slot" value={game.level < 21 ? "Level 21" : "Every 10 levels"} />
            </div>

            <div style={styles.globe}>
              {game.worldAreas.map((area, index) => (
                <button key={area.id} style={area.id === game.activeAreaId ? styles.globeActive : styles.globeNode} onClick={() => switchArea(area.id)}>
                  <span style={styles.globeIcon}>🌍</span>
                  <b>{area.name}</b>
                  <small>
                    {area.tiles.length}/{area.landSlots} slots
                  </small>
                  <small>Area {index + 1}</small>
                </button>
              ))}
            </div>
          </Panel>
        )}

        {tab === "events" && (
          <Panel>
            <Top title="🎁 Events, Achievements & Upgrades" text="Daily rewards, missions, milestones, insurance, builder teams, dispatch manager, friends and clubs." />

            <div style={styles.cards}>
              <Card>
                <h3>🎁 Daily Login</h3>
                <p>Streak: {game.loginStreak}</p>
                <button style={styles.greenButton} onClick={claimDailyReward}>
                  Claim Daily Reward
                </button>
              </Card>

              <Card>
                <h3>👷 Builder Teams</h3>
                <p>Teams: {game.builderTeams}</p>
                <button style={styles.greenButton} onClick={hireBuilder}>
                  Hire Builder 💵 {400 + game.builderTeams * 300}
                </button>
              </Card>

              <Card>
                <h3>📡 Dispatch Manager</h3>
                <p>{game.dispatchManager ? "Hired" : "Unlocks Level 15 • Cost 💵 500"}</p>
                <button style={game.level >= 15 ? styles.greenButton : styles.lockedButton} onClick={hireDispatchManager}>
                  Hire Manager
                </button>
              </Card>

              <Card>
                <h3>🛡️ Insurance</h3>
                <p>Technicians: {game.insurance.technicians ? "Active" : "None"}</p>
                <p>Vehicles: {game.insurance.vehicles ? "Active" : "None"}</p>
                <p>Parts: {game.insurance.parts ? "Active" : "None"}</p>
                <button style={styles.lightButton} onClick={() => buyInsurance("technicians")}>
                  Technician Insurance 💵 250
                </button>
                <button style={styles.lightButton} onClick={() => buyInsurance("vehicles")}>
                  Vehicle Insurance 💵 300
                </button>
                <button style={styles.lightButton} onClick={() => buyInsurance("parts")}>
                  Parts Insurance 💵 180
                </button>
              </Card>

              <Card>
                <h3>⬆️ Business Upgrades</h3>
                <button style={styles.greenButton} onClick={upgradeYard}>
                  Yard 💵 {150 + game.yardLevel * 120}
                </button>
                <button style={styles.greenButton} onClick={upgradePartShop}>
                  Parts Store 💵 {120 + game.partShopLevel * 110}
                </button>
                <button style={styles.greenButton} onClick={upgradeTraining}>
                  Training 💵 {140 + game.trainingLevel * 130}
                </button>
              </Card>

              <Card>
                <h3>🤝 Friends & Clubs</h3>
                <input style={styles.input} placeholder="Google Play name" value={googleName} onChange={(e) => setGoogleName(e.target.value)} />
                <button
                  style={styles.greenButton}
                  onClick={() => {
                    if (!googleName.trim()) return setMessage("Enter Google Play name.");
                    setGame((g) => ({ ...g, googlePlayLinked: true, googlePlayName: googleName }));
                  }}
                >
                  Link Restore Prototype
                </button>
                <button style={styles.darkButton} onClick={addFriend}>
                  Add Friend
                </button>
                <button style={game.level >= 5 ? styles.orangeButton : styles.lockedButton} onClick={createClub}>
                  Create Club
                </button>
                <button style={game.club ? styles.darkButton : styles.lockedButton} onClick={startClubEvent}>
                  Start Club Event
                </button>
                {game.clubEvent && (
                  <div style={styles.warn}>
                    {game.clubEvent.name} • {time(game.clubEvent.remaining)}
                  </div>
                )}
              </Card>
            </div>

            <h3>Daily Missions</h3>
            <div style={styles.cards}>
              {game.dailyMissions.map((m) => (
                <Card key={m.id} signed={m.done}>
                  <h3>{m.name}</h3>
                  <p>
                    {m.progress}/{m.target}
                  </p>
                  <p>
                    Reward: 🪙 {m.coins} • 💵 {m.money}
                  </p>
                  <button style={m.done && !m.claimed ? styles.greenButton : styles.lockedButton} onClick={() => claimMission(m.id)}>
                    {m.claimed ? "Claimed" : m.done ? "Claim" : "In Progress"}
                  </button>
                </Card>
              ))}
            </div>

            <h3>Milestones</h3>
            <div style={styles.cards}>
              {milestones(game.level).map((m) => (
                <Card key={m.level} signed={game.milestoneClaimed.includes(m.level)}>
                  <h3>
                    Level {m.level}: {m.name}
                  </h3>
                  <p>
                    Reward: 🪙 {m.coins} • 💵 {m.money}
                  </p>
                  <button style={game.milestoneClaimed.includes(m.level) ? styles.ownedButton : styles.greenButton} onClick={() => claimMilestone(m)}>
                    {game.milestoneClaimed.includes(m.level) ? "Claimed" : "Claim"}
                  </button>
                </Card>
              ))}
            </div>

            <h3>Achievements</h3>
            <div style={styles.cards}>
              {[
                ["shop-repair", "Shop Repaired"],
                ["first-repair", "First Repair"],
                ["ten-jobs", "10 Jobs Completed"],
                ["hundred-jobs", "100 Jobs Completed"],
                ["first-bike", "First Service Bike"],
                ["first-pickup", "First Pickup"],
                ["first-tech", "First Technician Hired"],
                ["first-contract", "First Contract Signed"],
                ["hospital-built", "Healthcare Builder"],
                ["global-unlock", "First Global Area"],
                ["five-star", "5-Star Garage"],
              ].map(([id, name]) => (
                <Card key={id} signed={game.achievements.includes(id)}>
                  <h3>
                    {game.achievements.includes(id) ? "🏆" : "🔒"} {name}
                  </h3>
                  <p>{game.achievements.includes(id) ? "Unlocked" : "Locked"}</p>
                </Card>
              ))}
            </div>
          </Panel>
        )}
      </section>
    </main>
  );
}

function MiniGameModal({ job, onFinish }) {
  const type = miniGameType(job);
  const [cableStep, setCableStep] = useState(0);
  const [meter, setMeter] = useState(18);
  const [meterDir, setMeterDir] = useState(1);

  useEffect(() => {
    if (type !== "tyre") return undefined;

    const timer = setInterval(() => {
      setMeter((value) => {
        let next = value + meterDir * 5;

        if (next >= 100) {
          next = 100;
          setMeterDir(-1);
        }

        if (next <= 0) {
          next = 0;
          setMeterDir(1);
        }

        return next;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [type, meterDir]);

  const cableOrder = ["Red Cable", "Black Cable", "Ground"];
  const bulbOptions = ["Amber Trailer Bulb", "Cool White Headlamp", "Red Brake Bulb"];
  const correctBulb = job.title.includes("Trailer") ? "Amber Trailer Bulb" : "Cool White Headlamp";
  const greenStart = 42;
  const greenEnd = 58;

  function clickCable(label) {
    if (label !== cableOrder[cableStep]) {
      onFinish(false, "failed");
      return;
    }

    if (cableStep === cableOrder.length - 1) {
      onFinish(true, "success");
      return;
    }

    setCableStep(cableStep + 1);
  }

  function stopMeter() {
    onFinish(meter >= greenStart && meter <= greenEnd, meter >= greenStart && meter <= greenEnd ? "success" : "failed");
  }

  return (
    <Overlay>
      <div style={styles.miniGameHeader}>
        <div style={styles.miniGameIcon}>{type === "jump" ? "🔋" : type === "tyre" ? "🛞" : "💡"}</div>
        <div>
          <h2 style={{ margin: 0 }}>{type === "jump" ? "Jump Start" : type === "tyre" ? "Tyre Puncture" : "Light Change"} Mini-game</h2>
          <p style={styles.smallText}>{job.title}</p>
        </div>
      </div>

      {type === "jump" && (
        <div style={styles.miniGamePanel}>
          <p style={styles.smallText}>Click the cables in the safe order.</p>
          <div style={styles.cableTrack}>
            {cableOrder.map((label, index) => (
              <span key={label} style={index < cableStep ? styles.cableDone : index === cableStep ? styles.cableCurrent : styles.cableWaiting}>
                {label}
              </span>
            ))}
          </div>
          <div style={styles.miniGameChoices}>
            <button style={{ ...styles.miniChoice, borderColor: "#dc2626" }} onClick={() => clickCable("Red Cable")}>
              🔴 Red Cable
            </button>
            <button style={{ ...styles.miniChoice, borderColor: "#1c1917" }} onClick={() => clickCable("Black Cable")}>
              ⚫ Black Cable
            </button>
            <button style={{ ...styles.miniChoice, borderColor: "#16a34a" }} onClick={() => clickCable("Ground")}>
              🟢 Ground
            </button>
          </div>
        </div>
      )}

      {type === "light" && (
        <div style={styles.miniGamePanel}>
          <p style={styles.smallText}>Choose the correct bulb from the parts tray.</p>
          <div style={styles.miniGameChoices}>
            {bulbOptions.map((bulb) => (
              <button key={bulb} style={styles.miniChoice} onClick={() => onFinish(bulb === correctBulb, bulb === correctBulb ? "success" : "failed")}>
                💡 {bulb}
              </button>
            ))}
          </div>
        </div>
      )}

      {type === "tyre" && (
        <div style={styles.miniGamePanel}>
          <p style={styles.smallText}>Stop the moving marker inside the green pressure zone.</p>
          <div style={styles.tyreMeter}>
            <div style={{ ...styles.tyreGreenZone, left: `${greenStart}%`, width: `${greenEnd - greenStart}%` }} />
            <div style={{ ...styles.tyreMarker, left: `${meter}%` }} />
          </div>
          <button style={styles.greenButton} onClick={stopMeter}>
            Stop
          </button>
        </div>
      )}

      <button style={styles.lightButton} onClick={() => onFinish(false, "skipped")}>
        Skip Mini-game
      </button>
      <p style={styles.smallText}>Success gives repair time -12%, coins +8%, and a small rating boost. Fail or skip continues the job normally.</p>
    </Overlay>
  );
}

function Input({ label, value, set, placeholder }) {
  return (
    <label style={styles.inputLabel}>
      <span>{label}</span>
      <input style={styles.input} value={value} placeholder={placeholder} onChange={(e) => set(e.target.value)} />
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

function Mini({ label, value }) {
  return (
    <div style={styles.mini}>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>{value}</p>
    </div>
  );
}

function Top({ title, text, action }) {
  return (
    <div style={styles.top}>
      <div>
        <h2 style={styles.sectionTitle}>{title}</h2>
        {text && <p style={styles.smallText}>{text}</p>}
      </div>
      {action}
    </div>
  );
}

function Panel({ children }) {
  return <div style={styles.panel}>{children}</div>;
}

function Card({ children, special, issue, blue, signed }) {
  return <div style={signed ? styles.signedCard : blue ? styles.blueCard : issue ? styles.issueCard : special ? styles.specialCard : styles.card}>{children}</div>;
}

function Overlay({ children }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.overlayCard}>{children}</div>
    </div>
  );
}

function PartIcon({ icon, label }) {
  if (label) {
    return (
      <div style={styles.brakeIcon}>
        <span>{icon}</span>
        <small>{label}</small>
      </div>
    );
  }

  return <div style={styles.cardIcon}>{icon}</div>;
}

function MapBuilding({ icon, title, style }) {
  return (
    <div style={{ ...styles.mapBuilding, ...style }}>
      <div style={styles.mapBuildingIcon}>{icon}</div>
      <b>{title}</b>
    </div>
  );
}

function Pickup() {
  return (
    <div style={styles.pickup}>
      <div style={styles.pickupShadow} />
      <div style={styles.pickupBed} />
      <div style={styles.pickupCab} />
      <div style={styles.pickupHood} />
      <div style={styles.pickupWindow1} />
      <div style={styles.pickupWindow2} />
      <div style={styles.pickupStripe} />
      <div style={styles.pickupLight} />
      <div style={styles.pickupWheel1} />
      <div style={styles.pickupWheel2} />
    </div>
  );
}

function Bar({ value }) {
  return (
    <div style={styles.progressOuter}>
      <div style={{ ...styles.progressInner, width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function Meter({ label, value, color }) {
  return (
    <div style={styles.meter}>
      <div style={styles.meterLabel}>
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div style={styles.meterOuter}>
        <div style={{ ...styles.meterInner, width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function GarageZone({ icon, title, text }) {
  return (
    <div style={styles.garageZone}>
      <div>{icon}</div>
      <b>{title}</b>
      <small>{text}</small>
    </div>
  );
}

function urgencyStyle(urgency) {
  const base = { borderRadius: 999, padding: "6px 10px", fontWeight: 900, fontSize: 12 };

  if (urgency === "Starter") return { ...base, background: "#fef3c7", color: "#92400e" };
  if (urgency === "Government") return { ...base, background: "#e0e7ff", color: "#3730a3" };
  if (urgency === "Critical") return { ...base, background: "#fee2e2", color: "#991b1b" };
  if (urgency === "High") return { ...base, background: "#ffedd5", color: "#9a3412" };
  if (urgency === "Medium") return { ...base, background: "#fef3c7", color: "#92400e" };
  if (urgency === "Contract") return { ...base, background: "#dbeafe", color: "#1d4ed8" };
  if (urgency === "Charity") return { ...base, background: "#fef9c3", color: "#854d0e" };

  return { ...base, background: "#dcfce7", color: "#166534" };
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
  page: {
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
  rank: { margin: "6px 0 0", fontWeight: 900, color: "#9a3412" },
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
  nav: {
    maxWidth: 1240,
    margin: "14px auto 0",
    padding: "0 16px",
    display: "grid",
    gridTemplateColumns: "repeat(9, 1fr)",
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
  navActive: {
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
  content: { maxWidth: 1240, margin: "0 auto", padding: 16, display: "grid", gap: 14 },
  panel: {
    background: "rgba(255,255,255,0.94)",
    border: "1px solid #fed7aa",
    borderRadius: 28,
    padding: 20,
    boxShadow: "0 18px 40px rgba(67,20,7,0.08)",
  },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 14 },
  sectionTitle: { margin: 0, fontSize: 24, fontWeight: 900 },
  message: {
    background: "#ffedd5",
    border: "1px solid #fdba74",
    color: "#7c2d12",
    borderRadius: 18,
    padding: 14,
    fontWeight: 800,
    lineHeight: 1.4,
    marginBottom: 12,
  },
  statLine: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 18 },
  mini: { background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 16, padding: 12 },
  tileGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(135px, 1fr))", gap: 12, marginBottom: 18 },
  tile: { background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: 18, padding: 12, display: "grid", gap: 4, textAlign: "center" },
  tileBroken: { background: "#fee2e2", border: "2px solid #ef4444", borderRadius: 18, padding: 12, display: "grid", gap: 4, textAlign: "center" },
  tileBuilding: { background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 18, padding: 12, display: "grid", gap: 4, textAlign: "center" },
  tileRibbon: { background: "#ecfccb", border: "2px solid #84cc16", borderRadius: 18, padding: 12, display: "grid", gap: 4, textAlign: "center" },
  tileIcon: { fontSize: 34 },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))", gap: 14 },
  card: { background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: 22, padding: 16, boxShadow: "0 10px 22px rgba(0,0,0,0.06)" },
  specialCard: { background: "#fef9c3", border: "1px solid #facc15", borderRadius: 22, padding: 16 },
  issueCard: { background: "#fff1f2", border: "2px solid #fb7185", borderRadius: 22, padding: 16 },
  blueCard: { background: "#eff6ff", border: "2px solid #93c5fd", borderRadius: 22, padding: 16 },
  signedCard: { background: "#ecfccb", border: "1px solid #bef264", borderRadius: 22, padding: 16 },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 },
  cardIcon: { fontSize: 42 },
  brakeIcon: {
    width: 66,
    height: 54,
    borderRadius: 12,
    background: "#292524",
    color: "white",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    fontSize: 20,
    textAlign: "center",
  },
  stack: { display: "grid", gap: 8, marginTop: 12 },
  actions: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, marginTop: 12 },
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
  mainButton: { width: "100%", marginTop: 16, background: "#ea580c", color: "white", border: "none", borderRadius: 16, padding: "14px 18px", fontWeight: 900, fontSize: 16, cursor: "pointer" },
  mainButtonSmall: { background: "#ea580c", color: "white", border: "none", borderRadius: 14, padding: "11px 14px", fontWeight: 900, cursor: "pointer", margin: 4 },
  greenButton: { background: "#16a34a", color: "white", border: "none", borderRadius: 12, padding: "10px 12px", fontWeight: 900, cursor: "pointer", margin: 4 },
  orangeButton: { background: "#ea580c", color: "white", border: "none", borderRadius: 12, padding: "10px 12px", fontWeight: 900, cursor: "pointer", margin: 4 },
  darkButton: { background: "#1c1917", color: "white", border: "none", borderRadius: 12, padding: "10px 14px", fontWeight: 900, cursor: "pointer", margin: 4 },
  lightButton: { background: "white", color: "#1c1917", border: "1px solid #d6d3d1", borderRadius: 12, padding: "10px 12px", fontWeight: 900, cursor: "pointer", margin: 4 },
  dangerButton: { background: "#dc2626", color: "white", border: "none", borderRadius: 12, padding: "10px 12px", fontWeight: 900, cursor: "pointer", margin: 4 },
  lockedButton: { background: "#e7e5e4", color: "#78716c", border: "none", borderRadius: 12, padding: "10px 14px", fontWeight: 900, cursor: "pointer", margin: 4 },
  ownedButton: { background: "#dcfce7", color: "#166534", border: "none", borderRadius: 12, padding: "10px 14px", fontWeight: 900, cursor: "not-allowed", margin: 4 },
  darkFullButton: { width: "100%", background: "#1c1917", color: "white", border: "none", borderRadius: 16, padding: "13px 14px", fontWeight: 900, cursor: "pointer", marginTop: 12 },
  lockedFullButton: { width: "100%", background: "#e7e5e4", color: "#78716c", border: "none", borderRadius: 16, padding: "13px 14px", fontWeight: 900, cursor: "pointer" },
  warn: { background: "#fee2e2", color: "#991b1b", borderRadius: 12, padding: 10, fontWeight: 900, fontSize: 14, marginTop: 8, marginBottom: 8 },
  tip: { background: "#ecfccb", color: "#365314", border: "1px solid #bef264", borderRadius: 14, padding: 12, marginBottom: 14, fontWeight: 800 },
  eventStrip: { background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 18, padding: 12, display: "grid", gap: 6, marginBottom: 14, color: "#3730a3" },
  empty: { border: "1px dashed #d6d3d1", borderRadius: 18, padding: 18, color: "#78716c", background: "#fafaf9" },
  phase: { color: "#ea580c", fontWeight: 900 },
  timer: { background: "#ffedd5", color: "#c2410c", borderRadius: 999, padding: "6px 10px", fontWeight: 900, fontSize: 13 },
  avatar: { width: 58, height: 58, borderRadius: 18, background: "#ffedd5", display: "grid", placeItems: "center", fontSize: 32, marginBottom: 8 },
  badge: { background: "#ffedd5", color: "#9a3412", borderRadius: 999, padding: "5px 9px", fontWeight: 900, fontSize: 12 },
  pickupBox: { marginTop: 12, background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 14, padding: 10, display: "grid", gap: 4, fontSize: 13 },
  meter: { marginTop: 10 },
  meterLabel: { display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 900, color: "#57534e", marginBottom: 4 },
  meterOuter: { height: 10, background: "#e7e5e4", borderRadius: 999, overflow: "hidden" },
  meterInner: { height: "100%", borderRadius: 999 },
  progressOuter: { height: 12, background: "#e7e5e4", borderRadius: 999, overflow: "hidden", marginTop: 8 },
  progressInner: { height: "100%", background: "#ea580c", borderRadius: 999, transition: "width .3s ease" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 999, display: "grid", placeItems: "center", padding: 20 },
  overlayCard: { width: "100%", maxWidth: 430, background: "white", borderRadius: 24, border: "1px solid #fed7aa", padding: 20, boxShadow: "0 30px 70px rgba(0,0,0,0.35)", textAlign: "center" },
  rewardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, margin: "14px 0", textAlign: "left" },
  miniGameHeader: { display: "flex", alignItems: "center", gap: 12, textAlign: "left", marginBottom: 14 },
  miniGameIcon: { width: 64, height: 64, borderRadius: 18, background: "#ffedd5", display: "grid", placeItems: "center", fontSize: 34, border: "1px solid #fed7aa" },
  miniGamePanel: { background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 18, padding: 14, margin: "12px 0" },
  miniGameChoices: { display: "grid", gap: 10, marginTop: 12 },
  miniChoice: { background: "white", border: "2px solid #fed7aa", borderRadius: 14, padding: "13px 12px", fontWeight: 900, cursor: "pointer", color: "#1c1917", textAlign: "left" },
  cableTrack: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: 10 },
  cableDone: { background: "#dcfce7", color: "#166534", border: "1px solid #86efac", borderRadius: 999, padding: "7px 8px", fontWeight: 900, fontSize: 12 },
  cableCurrent: { background: "#fef3c7", color: "#92400e", border: "1px solid #f59e0b", borderRadius: 999, padding: "7px 8px", fontWeight: 900, fontSize: 12 },
  cableWaiting: { background: "#f5f5f4", color: "#78716c", border: "1px solid #d6d3d1", borderRadius: 999, padding: "7px 8px", fontWeight: 900, fontSize: 12 },
  tyreMeter: { position: "relative", height: 34, background: "linear-gradient(90deg, #fee2e2, #fef3c7, #fee2e2)", border: "1px solid #d6d3d1", borderRadius: 999, overflow: "hidden", margin: "14px 0" },
  tyreGreenZone: { position: "absolute", top: 0, bottom: 0, background: "rgba(22,163,74,0.38)", borderLeft: "2px solid #16a34a", borderRight: "2px solid #16a34a" },
  tyreMarker: { position: "absolute", top: 3, bottom: 3, width: 5, background: "#1c1917", borderRadius: 99, transform: "translateX(-50%)", boxShadow: "0 0 0 3px rgba(255,255,255,0.75)" },
  bigStars: { fontSize: 36, margin: "10px 0" },
  ribbonEmoji: { fontSize: 70 },
  map: { position: "relative", height: 430, borderRadius: 30, overflow: "hidden", background: "linear-gradient(135deg, #facc15 0%, #fdba74 42%, #a8a29e 100%)", boxShadow: "inset 0 0 45px rgba(120,53,15,0.2)" },
  road: { position: "absolute", left: "5%", right: "5%", top: "58%", height: 74, background: "#292524", borderRadius: 999, transform: "skewY(-4deg)", boxShadow: "0 18px 26px rgba(0,0,0,0.25)" },
  roadMark1: { position: "absolute", left: "18%", top: "66%", width: 70, height: 8, background: "#fde68a", borderRadius: 99, transform: "skewY(-4deg)" },
  roadMark2: { position: "absolute", left: "44%", top: "66%", width: 70, height: 8, background: "#fde68a", borderRadius: 99, transform: "skewY(-4deg)" },
  roadMark3: { position: "absolute", left: "70%", top: "66%", width: 70, height: 8, background: "#fde68a", borderRadius: 99, transform: "skewY(-4deg)" },
  mapBuilding: { position: "absolute", width: 130, minHeight: 96, borderRadius: 22, background: "linear-gradient(135deg, #ffffff, #fed7aa)", border: "2px solid rgba(255,255,255,0.8)", boxShadow: "10px 16px 0 rgba(67,20,7,0.2), 0 20px 28px rgba(0,0,0,0.16)", display: "grid", placeItems: "center", textAlign: "center", padding: 10, transform: "perspective(700px) rotateX(10deg)", zIndex: 2 },
  mapBuildingIcon: { fontSize: 34 },
  vehicleMove: { position: "absolute", zIndex: 5, transition: "left 0.6s linear, top 0.6s linear", transform: "translate(-50%, -50%)" },
  vehicleLabel: { marginTop: 4, background: "#1c1917", color: "white", borderRadius: 99, padding: "4px 8px", fontSize: 11, fontWeight: 900, whiteSpace: "nowrap", textAlign: "center" },
  walker: { fontSize: 42, filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.35))" },
  pickup: { position: "relative", width: 104, height: 52, filter: "drop-shadow(0 12px 10px rgba(0,0,0,0.35))" },
  pickupShadow: { position: "absolute", left: 8, right: 8, bottom: 0, height: 12, background: "rgba(0,0,0,0.28)", borderRadius: "50%", filter: "blur(5px)" },
  pickupBed: { position: "absolute", left: 4, bottom: 13, width: 48, height: 24, background: "linear-gradient(180deg, #ffffff, #e7e5e4)", border: "3px solid #991b1b", borderRadius: "8px 4px 4px 8px" },
  pickupCab: { position: "absolute", left: 48, bottom: 13, width: 34, height: 32, background: "linear-gradient(180deg, #ffffff, #f5f5f4)", border: "3px solid #991b1b", borderRadius: "10px 10px 4px 4px" },
  pickupHood: { position: "absolute", left: 78, bottom: 13, width: 22, height: 22, background: "linear-gradient(180deg, #ffffff, #e7e5e4)", borderTop: "3px solid #991b1b", borderRight: "3px solid #991b1b", borderBottom: "3px solid #991b1b", borderRadius: "4px 10px 8px 4px" },
  pickupWindow1: { position: "absolute", left: 66, bottom: 31, width: 12, height: 11, background: "linear-gradient(135deg, #0f172a, #38bdf8)", borderRadius: 3 },
  pickupWindow2: { position: "absolute", left: 52, bottom: 31, width: 12, height: 11, background: "linear-gradient(135deg, #0f172a, #38bdf8)", borderRadius: 3 },
  pickupStripe: { position: "absolute", left: 8, bottom: 25, width: 84, height: 6, background: "#dc2626", borderRadius: 99 },
  pickupLight: { position: "absolute", left: 58, bottom: 45, width: 20, height: 5, background: "linear-gradient(90deg, #dc2626, #f97316)", borderRadius: 99 },
  pickupWheel1: { position: "absolute", left: 18, bottom: 5, width: 18, height: 18, background: "#111827", borderRadius: "50%", border: "3px solid #57534e" },
  pickupWheel2: { position: "absolute", right: 16, bottom: 5, width: 18, height: 18, background: "#111827", borderRadius: "50%", border: "3px solid #57534e" },
  garage: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, background: "#292524", padding: 18, borderRadius: 24, marginTop: 14 },
  garageZone: { minHeight: 120, background: "linear-gradient(135deg,#fff7ed,#d6d3d1)", borderRadius: 18, padding: 14, display: "grid", placeItems: "center", textAlign: "center", fontSize: 30 },
  globe: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 },
  globeNode: { background: "#fffaf5", border: "1px solid #fed7aa", borderRadius: 22, padding: 16, display: "grid", gap: 6, cursor: "pointer", textAlign: "center" },
  globeActive: { background: "#ecfccb", border: "2px solid #84cc16", borderRadius: 22, padding: 16, display: "grid", gap: 6, cursor: "pointer", textAlign: "center" },
  globeIcon: { fontSize: 40 },
  notice: { background: "#f0f9ff", border: "1px solid #7dd3fc", borderRadius: 20, padding: 14, marginBottom: 16 },
  row: { display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", borderTop: "1px solid #bae6fd", paddingTop: 10, marginTop: 10, flexWrap: "wrap" },
};

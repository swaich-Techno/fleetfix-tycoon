"use client";

import { useEffect, useMemo, useState } from "react";

const SAVE_KEY = "fleetfix-tycoon-save-v6";

const STARTING_GAME = {
  started: false,
  companyName: "",
  ownerName: "",
  townName: "",
  coins: 500,
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
    Tyre: 5,
    Battery: 4,
    "Engine Oil": 4,
    "Brake Kit": 3,
    "Diagnostic Chip": 2,
    "Tow Hook": 2,
  },
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
];

const PARTS = [
  { name: "Tyre", icon: "🛞", cost: 70, reorder: 5 },
  { name: "Battery", icon: "🔋", cost: 110, reorder: 4 },
  { name: "Engine Oil", icon: "🛢️", cost: 90, reorder: 5 },
  { name: "Brake Kit", icon: "🧱", cost: 130, reorder: 3 },
  { name: "Diagnostic Chip", icon: "💾", cost: 160, reorder: 3 },
  { name: "Tow Hook", icon: "🪝", cost: 200, reorder: 2 },
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
    travelTime: 8,
    repairTime: 18,
    returnTime: 7,
    rewardCoins: 130,
    rewardXp: 30,
    reputation: 1,
    difficulty: 1,
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
    travelTime: 10,
    repairTime: 25,
    returnTime: 9,
    rewardCoins: 190,
    rewardXp: 45,
    reputation: 2,
    difficulty: 1,
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
    travelTime: 12,
    repairTime: 35,
    returnTime: 10,
    rewardCoins: 260,
    rewardXp: 60,
    reputation: 3,
    difficulty: 2,
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
    travelTime: 14,
    repairTime: 45,
    returnTime: 12,
    rewardCoins: 340,
    rewardXp: 80,
    reputation: 4,
    difficulty: 3,
    urgency: "High",
    icon: "🚛",
    mapPoint: "Transport Yard",
  },
  {
    id: 5,
    title: "Bus Safety Inspection",
    vehicle: "Bus",
    problem: "Passenger bus needs safety check",
    skill: "Diagnostic",
    partNeeded: "Diagnostic Chip",
    partQty: 1,
    travelTime: 16,
    repairTime: 55,
    returnTime: 13,
    rewardCoins: 470,
    rewardXp: 120,
    reputation: 6,
    difficulty: 4,
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
    travelTime: 20,
    repairTime: 70,
    returnTime: 18,
    rewardCoins: 760,
    rewardXp: 190,
    reputation: 10,
    difficulty: 6,
    urgency: "Critical",
    icon: "🪝",
    mapPoint: "Outer Road",
  },
];

const BUILDINGS = [
  {
    name: "Tow Yard",
    cost: 1400,
    unlockLevel: 3,
    icon: "🚚",
    description: "Unlocks advanced rescue and towing jobs.",
  },
  {
    name: "Training Center",
    cost: 2200,
    unlockLevel: 5,
    icon: "🎓",
    description: "Improves technician growth and skill quality.",
  },
  {
    name: "Fuel Station",
    cost: 3000,
    unlockLevel: 7,
    icon: "⛽",
    description: "Raises town value and service capacity.",
  },
  {
    name: "Dispatch Office",
    cost: 4200,
    unlockLevel: 10,
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

function getXpNeeded(level) {
  return level * 150;
}

function getSalaryForLevel(level, isOwner) {
  if (isOwner) return 0;

  const baseSalary = 100;

  if (level <= 5) {
    return baseSalary;
  }

  return Math.round(baseSalary * Math.pow(1.015, level - 5));
}

function createTechnician(name, isOwner = false) {
  const level = 1;

  return {
    id: createId(),
    name,
    skill: isOwner ? "All-Rounder" : SKILLS[Math.floor(Math.random() * SKILLS.length)],
    level,
    energy: 100,
    morale: 100,
    status: "Free",
    currentJobId: null,
    isOwner,
    salary: getSalaryForLevel(level, isOwner),
    daysOffTaken: 0,
    avatar: isOwner ? "👑" : ["👨‍🔧", "👩‍🔧", "🧰", "🔧"][Math.floor(Math.random() * 4)],
  };
}

function normalizeTechnician(tech) {
  const level = tech.level || 1;

  return {
    ...tech,
    level,
    morale: tech.morale ?? 100,
    salary: getSalaryForLevel(level, tech.isOwner),
    daysOffTaken: tech.daysOffTaken ?? 0,
    avatar: tech.avatar || (tech.isOwner ? "👑" : "👨‍🔧"),
  };
}

function getRandomServiceCalls(level) {
  const available = SERVICE_CALLS.filter((call) => call.difficulty <= level + 1);
  return [...available].sort(() => Math.random() - 0.5).slice(0, 4);
}

function getCompanyRank(rep) {
  if (rep >= 100) return "Regional Fleet Leader";
  if (rep >= 40) return "Trusted Fleet Partner";
  if (rep >= 12) return "Growing Garage";
  return "Small Town Garage";
}

function getUrgencyStyle(urgency) {
  if (urgency === "Critical") return { background: "#fee2e2", color: "#991b1b" };
  if (urgency === "High") return { background: "#ffedd5", color: "#9a3412" };
  if (urgency === "Medium") return { background: "#fef3c7", color: "#92400e" };
  return { background: "#dcfce7", color: "#166534" };
}

function getJobPhaseLabel(job) {
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

export default function Home() {
  const [game, setGame] = useState(STARTING_GAME);
  const [setup, setSetup] = useState({
    companyName: "",
    ownerName: "",
    townName: "",
    technicianName: "",
  });
  const [availableCalls, setAvailableCalls] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("town");
  const [renameId, setRenameId] = useState("");
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    const saved =
      localStorage.getItem(SAVE_KEY) ||
      localStorage.getItem("fleetfix-tycoon-save-v5") ||
      localStorage.getItem("fleetfix-tycoon-save-v4") ||
      localStorage.getItem("fleetfix-tycoon-save-v3") ||
      localStorage.getItem("fleetfix-tycoon-save-v2") ||
      localStorage.getItem("fleetfix-tycoon-save");

    if (saved) {
      const parsed = JSON.parse(saved);

      setGame({
        ...STARTING_GAME,
        ...parsed,
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
        technicians: (parsed.technicians || []).map(normalizeTechnician),
        activeJobs: parsed.activeJobs || [],
        dayOffRequests: parsed.dayOffRequests || [],
      });

      if (parsed.started) setAvailableCalls(getRandomServiceCalls(parsed.level || 1));
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
              let nextJob = {
                ...job,
                phaseRemaining: job.phaseRemaining - 1,
              };

              if (nextJob.phaseRemaining <= 0) {
                if (nextJob.phase === "travel") {
                  nextJob.phase = "repair";
                  nextJob.phaseRemaining = nextJob.repairTimeFinal;
                  nextJob.phaseTotal = nextJob.repairTimeFinal;
                } else if (nextJob.phase === "repair") {
                  nextJob.phase = "return";
                  nextJob.phaseRemaining = nextJob.returnTime;
                  nextJob.phaseTotal = nextJob.returnTime;
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

              updated.coins += job.rewardCoins;
              updated.xp += job.rewardXp;
              updated.reputation += job.reputation;
              updated.completedJobs += 1;
              updated.totalRevenue += job.rewardCoins;
              updated.townValue += Math.floor(job.rewardCoins * 0.12);

              updated.technicians = updated.technicians.map((tech) => {
                if (tech.id !== job.technicianId) return tech;

                const newEnergy = Math.max(0, tech.energy - 14);
                const newLevel = tech.level + 1;

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
                  level: newLevel,
                  salary: getSalaryForLevel(newLevel, tech.isOwner),
                };
              });

              notes.push(
                `${technician?.name || "Technician"} returned from ${job.title}. Earned ${job.rewardCoins} coins and ${job.rewardXp} XP.`
              );

              return false;
            });
        }

        while (updated.xp >= getXpNeeded(updated.level)) {
          updated.xp -= getXpNeeded(updated.level);
          updated.level += 1;
          updated.coins += 250;
          notes.push(`Level up! You reached Level ${updated.level} and earned 250 bonus coins.`);
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

  function startGame() {
    if (
      !setup.companyName.trim() ||
      !setup.ownerName.trim() ||
      !setup.townName.trim() ||
      !setup.technicianName.trim()
    ) {
      setMessage("Please fill all fields to start your company.");
      return;
    }

    const owner = createTechnician(setup.ownerName.trim(), true);
    const firstTech = createTechnician(setup.technicianName.trim());

    const newGame = {
      ...STARTING_GAME,
      started: true,
      companyName: setup.companyName.trim(),
      ownerName: setup.ownerName.trim(),
      townName: setup.townName.trim(),
      technicians: [owner, firstTech],
    };

    setGame(newGame);
    setAvailableCalls(getRandomServiceCalls(1));
    setMessage(`Welcome to ${setup.companyName}. Your garage and Parts Store are open.`);
  }

  function hasEnoughParts(call) {
    return (game.parts[call.partNeeded] || 0) >= call.partQty;
  }

  function dispatchTechnician(call, technicianId) {
    const tech = game.technicians.find((item) => item.id === technicianId);

    if (!tech) return;

    if (!hasEnoughParts(call)) {
      setMessage(`Not enough ${call.partNeeded}. Open Parts tab and restock.`);
      setActiveTab("parts");
      return;
    }

    const skillMatch = tech.skill === call.skill || tech.skill === "All-Rounder";
    const moraleBonus = tech.morale >= 80 ? 0.9 : 1;
    const repairTimeFinal = skillMatch
      ? Math.max(8, Math.floor(call.repairTime * 0.7 * moraleBonus))
      : Math.max(8, Math.floor(call.repairTime * moraleBonus));

    const activeJob = {
      ...call,
      jobId: createId(),
      technicianId: tech.id,
      technicianName: tech.name,
      phase: "travel",
      phaseRemaining: call.travelTime,
      phaseTotal: call.travelTime,
      repairTimeFinal,
      skillMatch,
    };

    setGame((current) => ({
      ...current,
      parts: {
        ...current.parts,
        [call.partNeeded]: (current.parts[call.partNeeded] || 0) - call.partQty,
      },
      activeJobs: [...current.activeJobs, activeJob],
      technicians: current.technicians.map((item) =>
        item.id === tech.id
          ? { ...item, status: "Travelling", currentJobId: activeJob.jobId }
          : item
      ),
    }));

    setAvailableCalls((calls) => calls.filter((item) => item.id !== call.id));
    setActiveTab("jobs");
    setMessage(
      `${tech.name} is travelling to ${call.mapPoint}. ETA ${call.travelTime}s. Parts used: ${call.partQty} ${call.partNeeded}.`
    );
  }

  function refreshCalls() {
    setAvailableCalls(getRandomServiceCalls(game.level));
    setMessage("New service calls received.");
  }

  function buyPart(part, qty) {
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

    PARTS.forEach((part) => {
      const stock = newParts[part.name] || 0;
      if (stock < part.reorder) {
        const qty = part.reorder - stock;
        totalCost += qty * part.cost;
        newParts[part.name] = part.reorder;
      }
    });

    if (totalCost === 0) {
      setMessage("All parts are already above reorder level.");
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

    setMessage(`Parts Store auto-restocked low parts for ${totalCost} coins.`);
  }

  function hireTechnician() {
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
      setMessage(`${building.name} unlocks at Level ${building.unlockLevel}.`);
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
      technicianName: "",
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
            Build your repair company, manage technicians, dispatch jobs, stock parts,
            and grow into a fleet service empire.
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
            <InputBox
              label="First Technician Name"
              placeholder="Ravi"
              value={setup.technicianName}
              onChange={(value) => setSetup({ ...setup, technicianName: value })}
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
          <Stat label="XP" value={`${game.xp}/${getXpNeeded(game.level)}`} />
          <Stat label="Level" value={game.level} />
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

        {activeTab === "town" && (
          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🏙️ {game.townName} Service Town</h2>
                <p style={styles.smallText}>
                  Improved 2.5D map with moving job vehicles. True 3D walking will need Unity or Three.js next.
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
              <MiniStat title="Parts Store" value="Owned" />
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
                  <div style={styles.vehicleBubble}>{job.icon}</div>
                  <div style={styles.vehicleLabel}>{job.technicianName}</div>
                </div>
              ))}

              {game.activeJobs.length === 0 && (
                <div style={styles.mapHint}>
                  Dispatch a technician to see vehicle movement and ETA.
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
                  Calls need parts from your self-owned Parts Store.
                </p>
              </div>

              <button style={styles.darkButton} onClick={refreshCalls}>
                Refresh Calls
              </button>
            </div>

            <div style={styles.cardsGrid}>
              {availableCalls.map((call) => (
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
                    <p><b>Location:</b> {call.mapPoint}</p>
                    <p><b>Skill:</b> {call.skill}</p>
                    <p>
                      <b>Parts:</b> {call.partQty} {call.partNeeded}{" "}
                      {hasEnoughParts(call) ? "✅" : "❌"}
                    </p>
                    <p>
                      <b>ETA:</b> Go {call.travelTime}s • Repair {call.repairTime}s • Return {call.returnTime}s
                    </p>
                    <p><b>Reward:</b> 🪙 {call.rewardCoins} • XP {call.rewardXp}</p>
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
              ))}
            </div>
          </Panel>
        )}

        {activeTab === "jobs" && (
          <Panel>
            <h2 style={styles.sectionTitle}>⏱️ Active Jobs with ETA</h2>
            <p style={styles.smallText}>
              Every job includes travelling, repair time, and return to garage.
            </p>

            <div style={styles.cardsGrid}>
              {game.activeJobs.length === 0 ? (
                <EmptyBox text="No active jobs. Dispatch a technician from service calls." />
              ) : (
                game.activeJobs.map((job) => {
                  const progress =
                    ((job.phaseTotal - job.phaseRemaining) / job.phaseTotal) * 100;

                  return (
                    <div key={job.jobId} style={styles.jobCard}>
                      <div style={styles.jobTop}>
                        <div>
                          <h3 style={styles.cardTitle}>{job.icon} {job.title}</h3>
                          <p style={styles.smallText}>Technician: {job.technicianName}</p>
                          <p style={styles.smallText}>Location: {job.mapPoint}</p>
                          <p style={styles.phaseText}>{getJobPhaseLabel(job)}</p>
                          {job.skillMatch && <p style={styles.bonusText}>⚡ Skill match bonus</p>}
                        </div>

                        <span style={styles.timerBadge}>{job.phaseRemaining}s</span>
                      </div>

                      <div style={styles.progressOuter}>
                        <div style={{ ...styles.progressInner, width: `${progress}%` }} />
                      </div>
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
                  New technician salary is 100 coins/day. After Level 5, salary increases by 1.5% per level.
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
                  <p style={styles.smallText}>Level: {tech.level}</p>
                  <p style={styles.smallText}>Salary/day: 🧾 {getSalaryForLevel(tech.level || 1, tech.isOwner)}</p>
                  <p style={styles.smallText}>Days off: {tech.daysOffTaken}</p>

                  <Bar label="Energy" value={tech.energy} color="#16a34a" />
                  <Bar label="Morale" value={tech.morale} color="#2563eb" />

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
              <button style={styles.darkFullButton} onClick={hireTechnician}>
                Hire Technician — 🪙 {700 + game.technicians.length * 350}
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
                  Parts Store is owned by default. Manage stock, reorder levels, and repair supplies here.
                </p>
              </div>

              <button style={styles.mainButtonSmall} onClick={autoRestock}>
                Auto Restock Low Parts
              </button>
            </div>

            <div style={styles.cardsGrid}>
              {PARTS.map((part) => {
                const stock = game.parts[part.name] || 0;
                const low = stock < part.reorder;

                return (
                  <div key={part.name} style={low ? styles.lowPartCard : styles.partCard}>
                    <div style={styles.partIcon}>{part.icon}</div>
                    <h3 style={styles.cardTitle}>{part.name}</h3>
                    <p style={styles.smallText}>Stock: <b>{stock}</b></p>
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
          </Panel>
        )}

        {activeTab === "build" && (
          <Panel>
            <h2 style={styles.sectionTitle}>🏗️ Build & Upgrade</h2>
            <p style={styles.smallText}>
              Parts Store is already owned. Build other facilities as you level up.
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
    maxWidth: 800,
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
  vehicleBubble: {
    width: 56,
    height: 56,
    borderRadius: 18,
    background: "#fff7ed",
    border: "2px solid #fdba74",
    display: "grid",
    placeItems: "center",
    fontSize: 30,
    boxShadow: "0 10px 18px rgba(0,0,0,0.25)",
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
  jobCard: {
    background: "#fffaf5",
    border: "1px solid #fed7aa",
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

"use client";

import { useEffect, useMemo, useState } from "react";

const SAVE_KEY = "fleetfix-tycoon-save-v2";

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
  technicians: [],
  activeJobs: [],
  ownedBuildings: ["Small Garage"],
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

const SERVICE_CALLS = [
  {
    id: 1,
    title: "Car Tyre Puncture",
    vehicle: "Small Car",
    problem: "Flat tyre near town road",
    skill: "Tyre",
    duration: 20,
    rewardCoins: 120,
    rewardXp: 30,
    reputation: 1,
    difficulty: 1,
    icon: "🚗",
  },
  {
    id: 2,
    title: "Van Battery Dead",
    vehicle: "Delivery Van",
    problem: "Battery not starting at market area",
    skill: "Electrical",
    duration: 30,
    rewardCoins: 180,
    rewardXp: 45,
    reputation: 2,
    difficulty: 1,
    icon: "🚐",
  },
  {
    id: 3,
    title: "Pickup Engine Heating",
    vehicle: "Pickup Truck",
    problem: "Engine overheating near highway",
    skill: "Engine",
    duration: 40,
    rewardCoins: 240,
    rewardXp: 60,
    reputation: 3,
    difficulty: 2,
    icon: "🛻",
  },
  {
    id: 4,
    title: "Trailer Brake Issue",
    vehicle: "Trailer",
    problem: "Brake inspection required before delivery",
    skill: "Mechanical",
    duration: 50,
    rewardCoins: 320,
    rewardXp: 80,
    reputation: 4,
    difficulty: 3,
    icon: "🚛",
  },
  {
    id: 5,
    title: "Bus Safety Inspection",
    vehicle: "Bus",
    problem: "Passenger bus needs emergency safety check",
    skill: "Diagnostic",
    duration: 60,
    rewardCoins: 450,
    rewardXp: 120,
    reputation: 6,
    difficulty: 4,
    icon: "🚌",
  },
  {
    id: 6,
    title: "Truck Fuel Leak",
    vehicle: "Heavy Truck",
    problem: "Fuel leakage detected at transport yard",
    skill: "Mechanical",
    duration: 70,
    rewardCoins: 600,
    rewardXp: 150,
    reputation: 8,
    difficulty: 5,
    icon: "🚚",
  },
  {
    id: 7,
    title: "Broken Trailer Rescue",
    vehicle: "Broken Trailer",
    problem: "Trailer is stuck outside city border",
    skill: "Towing",
    duration: 80,
    rewardCoins: 750,
    rewardXp: 190,
    reputation: 10,
    difficulty: 6,
    icon: "🪝",
  },
  {
    id: 8,
    title: "Fleet Contract Inspection",
    vehicle: "Fleet Vehicles",
    problem: "Company wants 5 vehicles inspected",
    skill: "Diagnostic",
    duration: 90,
    rewardCoins: 950,
    rewardXp: 240,
    reputation: 14,
    difficulty: 7,
    icon: "🏢",
  },
];

const BUILDINGS = [
  {
    name: "Parts Store",
    cost: 800,
    unlockLevel: 1,
    description: "Stores parts and improves business value.",
    icon: "🏪",
  },
  {
    name: "Tow Yard",
    cost: 1400,
    unlockLevel: 3,
    description: "Unlocks towing-style rescue missions.",
    icon: "🚚",
  },
  {
    name: "Training Center",
    cost: 2200,
    unlockLevel: 5,
    description: "Helps your technicians grow faster.",
    icon: "🎓",
  },
  {
    name: "Fuel Station",
    cost: 3000,
    unlockLevel: 7,
    description: "Adds a strong town business asset.",
    icon: "⛽",
  },
  {
    name: "Dispatch Office",
    cost: 4200,
    unlockLevel: 10,
    description: "Prepares your empire for multiple cities.",
    icon: "📡",
  },
];

const TABS = [
  { id: "town", label: "Town", icon: "🏜️" },
  { id: "calls", label: "Calls", icon: "🚨" },
  { id: "jobs", label: "Jobs", icon: "⏱️" },
  { id: "team", label: "Team", icon: "👨‍🔧" },
  { id: "build", label: "Build", icon: "🏗️" },
];

function getXpNeeded(level) {
  return level * 150;
}

function getRandomServiceCalls(level) {
  const available = SERVICE_CALLS.filter((call) => call.difficulty <= level + 1);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

function createId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function createTechnician(name, isOwner = false) {
  return {
    id: createId(),
    name,
    skill: isOwner ? "All-Rounder" : SKILLS[Math.floor(Math.random() * SKILLS.length)],
    level: 1,
    energy: 100,
    status: "Free",
    currentJobId: null,
    isOwner,
  };
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
    const savedV2 = localStorage.getItem(SAVE_KEY);
    const savedV1 = localStorage.getItem("fleetfix-tycoon-save");

    const savedGame = savedV2 || savedV1;

    if (savedGame) {
      const parsedGame = JSON.parse(savedGame);
      setGame({
        ...STARTING_GAME,
        ...parsedGame,
        technicians: parsedGame.technicians || [],
        activeJobs: parsedGame.activeJobs || [],
        ownedBuildings: parsedGame.ownedBuildings || ["Small Garage"],
      });

      if (parsedGame.started) {
        setAvailableCalls(getRandomServiceCalls(parsedGame.level || 1));
      }
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
        if (!currentGame.started || currentGame.activeJobs.length === 0) {
          return currentGame;
        }

        let updatedGame = { ...currentGame };
        let completedMessages = [];

        const updatedActiveJobs = updatedGame.activeJobs
          .map((job) => ({
            ...job,
            remainingTime: job.remainingTime - 1,
          }))
          .filter((job) => {
            if (job.remainingTime <= 0) {
              const technician = updatedGame.technicians.find(
                (tech) => tech.id === job.technicianId
              );

              updatedGame.coins += job.rewardCoins;
              updatedGame.xp += job.rewardXp;
              updatedGame.reputation += job.reputation;
              updatedGame.completedJobs += 1;

              updatedGame.technicians = updatedGame.technicians.map((tech) => {
                if (tech.id === job.technicianId) {
                  return {
                    ...tech,
                    status: "Free",
                    currentJobId: null,
                    energy: Math.max(0, tech.energy - 10),
                    level: tech.level + 1,
                  };
                }

                return tech;
              });

              completedMessages.push(
                `${technician?.name || "Technician"} completed ${job.title}. Earned ${job.rewardCoins} coins and ${job.rewardXp} XP.`
              );

              return false;
            }

            return true;
          });

        updatedGame.activeJobs = updatedActiveJobs;

        while (updatedGame.xp >= getXpNeeded(updatedGame.level)) {
          updatedGame.xp -= getXpNeeded(updatedGame.level);
          updatedGame.level += 1;
          updatedGame.coins += 250;
          completedMessages.push(
            `Level up! You reached Level ${updatedGame.level} and earned 250 bonus coins.`
          );
        }

        if (completedMessages.length > 0) {
          setMessage(completedMessages.join(" "));
          setAvailableCalls(getRandomServiceCalls(updatedGame.level));
        }

        return updatedGame;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const freeTechnicians = useMemo(() => {
    return game.technicians.filter(
      (tech) => tech.status === "Free" && tech.energy > 0
    );
  }, [game.technicians]);

  const nextGoal = useMemo(() => {
    if (game.level < 2) return "Complete service calls to reach Level 2.";
    if (game.technicians.length < 3) return "Hire one more technician to grow your team.";
    if (game.garageLevel < 2) return "Upgrade your garage to handle bigger repairs.";
    if (!game.ownedBuildings.includes("Parts Store")) return "Build the Parts Store.";
    if (game.level < 5) return "Reach Level 5 to unlock the Training Center.";
    return "Keep expanding your repair empire and unlock bigger contracts.";
  }, [game]);

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
    const firstTechnician = createTechnician(setup.technicianName.trim());

    const newGame = {
      ...STARTING_GAME,
      started: true,
      companyName: setup.companyName.trim(),
      ownerName: setup.ownerName.trim(),
      townName: setup.townName.trim(),
      technicians: [owner, firstTechnician],
    };

    setGame(newGame);
    setAvailableCalls(getRandomServiceCalls(1));
    setActiveTab("town");
    setMessage(`Welcome to ${setup.companyName}. Your repair empire begins in ${setup.townName}.`);
  }

  function dispatchTechnician(serviceCall, technicianId) {
    const technician = game.technicians.find((tech) => tech.id === technicianId);

    if (!technician) {
      setMessage("No technician selected.");
      return;
    }

    if (technician.status !== "Free") {
      setMessage(`${technician.name} is already working.`);
      return;
    }

    const skillMatch =
      technician.skill === serviceCall.skill || technician.skill === "All-Rounder";

    const boostedDuration = skillMatch
      ? Math.max(8, Math.floor(serviceCall.duration * 0.7))
      : serviceCall.duration;

    const activeJob = {
      ...serviceCall,
      jobId: createId(),
      technicianId,
      technicianName: technician.name,
      remainingTime: boostedDuration,
      totalTime: boostedDuration,
      skillMatch,
    };

    setGame((currentGame) => ({
      ...currentGame,
      activeJobs: [...currentGame.activeJobs, activeJob],
      technicians: currentGame.technicians.map((tech) => {
        if (tech.id === technicianId) {
          return {
            ...tech,
            status: "Working",
            currentJobId: activeJob.jobId,
          };
        }

        return tech;
      }),
    }));

    setAvailableCalls((currentCalls) =>
      currentCalls.filter((call) => call.id !== serviceCall.id)
    );

    setActiveTab("jobs");
    setMessage(
      skillMatch
        ? `${technician.name} is a good skill match. Job time reduced.`
        : `${technician.name} has been dispatched to ${serviceCall.title}.`
    );
  }

  function refreshCalls() {
    setAvailableCalls(getRandomServiceCalls(game.level));
    setMessage("New service calls received from nearby roads.");
  }

  function hireTechnician() {
    const cost = 700 + game.technicians.length * 350;

    if (game.coins < cost) {
      setMessage(`You need ${cost} coins to hire a new technician.`);
      return;
    }

    const randomName =
      TECHNICIAN_NAMES[Math.floor(Math.random() * TECHNICIAN_NAMES.length)];

    const newTechnician = createTechnician(randomName);

    setGame((currentGame) => ({
      ...currentGame,
      coins: currentGame.coins - cost,
      technicians: [...currentGame.technicians, newTechnician],
    }));

    setMessage(`${newTechnician.name} joined as a ${newTechnician.skill} technician.`);
  }

  function upgradeGarage() {
    const cost = game.garageLevel * 1000;

    if (game.coins < cost) {
      setMessage(`You need ${cost} coins to upgrade the garage.`);
      return;
    }

    setGame((currentGame) => ({
      ...currentGame,
      coins: currentGame.coins - cost,
      garageLevel: currentGame.garageLevel + 1,
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

    setGame((currentGame) => ({
      ...currentGame,
      coins: currentGame.coins - building.cost,
      ownedBuildings: [...currentGame.ownedBuildings, building.name],
    }));

    setMessage(`${building.name} has been added to ${game.townName}.`);
  }

  function restTechnicians() {
    setGame((currentGame) => ({
      ...currentGame,
      technicians: currentGame.technicians.map((tech) => ({
        ...tech,
        energy: tech.status === "Free" ? 100 : tech.energy,
      })),
    }));

    setMessage("Free technicians have rested and recovered energy.");
  }

  function startRename(tech) {
    setRenameId(tech.id);
    setRenameValue(tech.name);
  }

  function saveRename() {
    if (!renameValue.trim()) {
      setMessage("Technician name cannot be empty.");
      return;
    }

    setGame((currentGame) => ({
      ...currentGame,
      technicians: currentGame.technicians.map((tech) =>
        tech.id === renameId ? { ...tech, name: renameValue.trim() } : tech
      ),
    }));

    setMessage("Technician renamed successfully.");
    setRenameId("");
    setRenameValue("");
  }

  function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem("fleetfix-tycoon-save");
    setGame(STARTING_GAME);
    setSetup({
      companyName: "",
      ownerName: "",
      townName: "",
      technicianName: "",
    });
    setAvailableCalls([]);
    setMessage("Game reset. Start your repair empire again.");
    setActiveTab("town");
  }

  if (!game.started) {
    return (
      <main style={styles.startPage}>
        <section style={styles.startCard}>
          <div style={styles.logo}>🛠️🚛</div>
          <h1 style={styles.title}>FleetFix Tycoon</h1>
          <p style={styles.subtitle}>
            Build a repair empire from one broken garage. Dispatch technicians,
            answer emergency calls, upgrade your town, and expand your company.
          </p>

          <div style={styles.formGrid}>
            <InputBox
              label="Company Name"
              placeholder="Phoenix Fleet Repairs"
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
              placeholder="Dust Valley"
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
        </div>

        <div style={styles.statsGrid}>
          <Stat label="Coins" value={`🪙 ${game.coins}`} />
          <Stat label="XP" value={`${game.xp}/${getXpNeeded(game.level)}`} />
          <Stat label="Level" value={game.level} />
          <Stat label="Rep" value={`⭐ ${game.reputation}`} />
          <Stat label="Jobs" value={game.completedJobs} />
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
        <div style={styles.messageRow}>
          <div style={styles.guideBox}>
            <b>Next Goal:</b> {nextGoal}
          </div>
          {message && <div style={styles.message}>📢 {message}</div>}
        </div>

        {activeTab === "town" && (
          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🏜️ {game.townName}</h2>
                <p style={styles.smallText}>
                  Township-style repair map. Build your service empire tile by tile.
                </p>
              </div>

              <button style={styles.dangerButton} onClick={resetGame}>
                Reset
              </button>
            </div>

            <div style={styles.mapArea}>
              <TownTile icon="🏚️" title={`Garage Lvl ${game.garageLevel}`} subtitle="Main repair base" owned />
              <TownTile icon="🛣️" title="Main Road" subtitle="Calls arrive here" owned />
              <TownTile icon="🌵" title="Barren Land" subtitle="Clean and expand" owned />
              <TownTile icon="🚧" title="Service Zone" subtitle="Future work area" owned />

              {BUILDINGS.map((building) => (
                <TownTile
                  key={building.name}
                  icon={building.icon}
                  title={building.name}
                  subtitle={
                    game.ownedBuildings.includes(building.name)
                      ? "Built"
                      : game.level >= building.unlockLevel
                      ? `Ready to build: ${building.cost} coins`
                      : `Unlocks at Level ${building.unlockLevel}`
                  }
                  owned={game.ownedBuildings.includes(building.name)}
                  locked={game.level < building.unlockLevel}
                />
              ))}
            </div>
          </Panel>
        )}

        {activeTab === "calls" && (
          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🚨 Service Calls</h2>
                <p style={styles.smallText}>
                  Choose the right technician. Matching skill reduces job time.
                </p>
              </div>

              <button style={styles.darkButton} onClick={refreshCalls}>
                Refresh Calls
              </button>
            </div>

            <div style={styles.cardsGrid}>
              {availableCalls.length === 0 ? (
                <EmptyBox text="No service calls available. Refresh calls or wait for jobs to complete." />
              ) : (
                availableCalls.map((call) => (
                  <div key={call.id} style={styles.callCard}>
                    <div style={styles.cardIcon}>{call.icon}</div>
                    <h3 style={styles.cardTitle}>{call.title}</h3>
                    <p style={styles.smallText}>{call.problem}</p>

                    <div style={styles.infoList}>
                      <p><b>Vehicle:</b> {call.vehicle}</p>
                      <p><b>Skill Needed:</b> {call.skill}</p>
                      <p><b>Base Time:</b> {call.duration}s</p>
                      <p><b>Reward:</b> 🪙 {call.rewardCoins} • XP {call.rewardXp}</p>
                    </div>

                    <div style={styles.buttonStack}>
                      {freeTechnicians.length === 0 ? (
                        <div style={styles.warningBox}>No free technicians.</div>
                      ) : (
                        freeTechnicians.map((tech) => {
                          const match =
                            tech.skill === call.skill || tech.skill === "All-Rounder";

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
                ))
              )}
            </div>
          </Panel>
        )}

        {activeTab === "jobs" && (
          <Panel>
            <h2 style={styles.sectionTitle}>⏱️ Active Jobs</h2>
            <p style={styles.smallText}>Watch dispatched technicians complete repairs.</p>

            <div style={styles.cardsGrid}>
              {game.activeJobs.length === 0 ? (
                <EmptyBox text="No active jobs. Dispatch a technician from service calls." />
              ) : (
                game.activeJobs.map((job) => {
                  const progress =
                    ((job.totalTime - job.remainingTime) / job.totalTime) * 100;

                  return (
                    <div key={job.jobId} style={styles.jobCard}>
                      <div style={styles.jobTop}>
                        <div>
                          <h3 style={styles.cardTitle}>{job.icon} {job.title}</h3>
                          <p style={styles.smallText}>Technician: {job.technicianName}</p>
                          {job.skillMatch && (
                            <p style={styles.bonusText}>⚡ Skill match bonus active</p>
                          )}
                        </div>

                        <span style={styles.timerBadge}>{job.remainingTime}s</span>
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
                <h2 style={styles.sectionTitle}>👨‍🔧 Technicians</h2>
                <p style={styles.smallText}>Hire, rename, and manage your repair team.</p>
              </div>
            </div>

            <div style={styles.cardsGrid}>
              {game.technicians.map((tech) => (
                <div key={tech.id} style={styles.techCard}>
                  <div style={styles.jobTop}>
                    <h3 style={styles.cardTitle}>
                      {tech.isOwner ? "👑" : "🔧"} {tech.name}
                    </h3>

                    <span
                      style={{
                        ...styles.statusBadge,
                        background: tech.status === "Free" ? "#dcfce7" : "#fef3c7",
                        color: tech.status === "Free" ? "#166534" : "#92400e",
                      }}
                    >
                      {tech.status}
                    </span>
                  </div>

                  <p style={styles.smallText}>Skill: {tech.skill}</p>
                  <p style={styles.smallText}>Level: {tech.level}</p>
                  <p style={styles.smallText}>Energy: {tech.energy}%</p>

                  {renameId === tech.id ? (
                    <div style={styles.renameBox}>
                      <input
                        style={styles.input}
                        value={renameValue}
                        onChange={(event) => setRenameValue(event.target.value)}
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

        {activeTab === "build" && (
          <Panel>
            <h2 style={styles.sectionTitle}>🏗️ Build & Upgrade</h2>
            <p style={styles.smallText}>Upgrade your garage and unlock new buildings by level.</p>

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
                        style={
                          owned
                            ? styles.ownedButton
                            : locked
                            ? styles.lockedButton
                            : styles.darkButton
                        }
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
        onChange={(event) => onChange(event.target.value)}
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

function Panel({ children }) {
  return <div style={styles.panel}>{children}</div>;
}

function TownTile({ icon, title, subtitle, owned, locked }) {
  return (
    <div
      style={{
        ...styles.townTile,
        opacity: locked ? 0.55 : 1,
        border: owned ? "2px solid #22c55e" : "1px solid #d6d3d1",
      }}
    >
      <div style={styles.townIcon}>{locked ? "🔒" : icon}</div>
      <h3 style={styles.cardTitle}>{title}</h3>
      <p style={styles.smallText}>{subtitle}</p>
    </div>
  );
}

function EmptyBox({ text }) {
  return <div style={styles.emptyBox}>{text}</div>;
}

const styles = {
  startPage: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fef3c7, #fed7aa, #e7e5e4)",
    color: "#1c1917",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "Arial, sans-serif",
  },
  startCard: {
    width: "100%",
    maxWidth: 780,
    background: "rgba(255,255,255,0.9)",
    border: "1px solid #d6d3d1",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 20px 45px rgba(0,0,0,0.18)",
    textAlign: "center",
  },
  logo: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 48,
    margin: "0 0 12px",
    fontWeight: 900,
  },
  subtitle: {
    color: "#57534e",
    fontSize: 17,
    lineHeight: 1.6,
    maxWidth: 640,
    margin: "0 auto 24px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
    textAlign: "left",
  },
  inputLabel: {
    display: "grid",
    gap: 6,
    fontWeight: 800,
    color: "#292524",
  },
  input: {
    border: "1px solid #d6d3d1",
    borderRadius: 14,
    padding: "12px 13px",
    fontSize: 15,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
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
  gamePage: {
    minHeight: "100vh",
    background: "#f5f5f4",
    color: "#1c1917",
    fontFamily: "Arial, sans-serif",
    paddingBottom: 32,
  },
  header: {
    background: "rgba(255,255,255,0.96)",
    borderBottom: "1px solid #d6d3d1",
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  },
  headerTitle: {
    margin: 0,
    fontSize: 25,
    fontWeight: 900,
  },
  smallText: {
    margin: "6px 0",
    color: "#57534e",
    fontSize: 14,
    lineHeight: 1.45,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(82px, 1fr))",
    gap: 8,
    minWidth: 320,
    flex: 1,
    maxWidth: 620,
  },
  statBox: {
    background: "#fafaf9",
    border: "1px solid #e7e5e4",
    borderRadius: 14,
    padding: "8px 10px",
  },
  statLabel: {
    margin: 0,
    color: "#78716c",
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: 900,
  },
  statValue: {
    margin: "4px 0 0",
    fontSize: 16,
    fontWeight: 900,
  },
  navBar: {
    maxWidth: 1180,
    margin: "14px auto 0",
    padding: "0 16px",
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 8,
  },
  navButton: {
    border: "1px solid #d6d3d1",
    background: "white",
    color: "#44403c",
    borderRadius: 16,
    padding: "11px 8px",
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
    padding: "11px 8px",
    fontWeight: 900,
    cursor: "pointer",
    display: "grid",
    gap: 4,
  },
  content: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: 16,
  },
  messageRow: {
    display: "grid",
    gap: 10,
    marginBottom: 14,
  },
  guideBox: {
    background: "#ecfccb",
    border: "1px solid #bef264",
    color: "#365314",
    borderRadius: 18,
    padding: 14,
    fontWeight: 700,
  },
  panel: {
    background: "white",
    border: "1px solid #d6d3d1",
    borderRadius: 24,
    padding: 20,
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: 14,
    alignItems: "center",
    marginBottom: 14,
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 900,
  },
  mapArea: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 14,
    background: "linear-gradient(135deg, #fde68a, #e7e5e4, #fed7aa)",
    borderRadius: 20,
    padding: 16,
  },
  townTile: {
    minHeight: 120,
    background: "rgba(255,255,255,0.88)",
    borderRadius: 20,
    padding: 14,
    boxSizing: "border-box",
  },
  townIcon: {
    fontSize: 38,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))",
    gap: 14,
  },
  callCard: {
    background: "#fafaf9",
    border: "1px solid #d6d3d1",
    borderRadius: 20,
    padding: 16,
  },
  jobCard: {
    background: "#fafaf9",
    border: "1px solid #d6d3d1",
    borderRadius: 20,
    padding: 16,
  },
  techCard: {
    background: "#fafaf9",
    border: "1px solid #d6d3d1",
    borderRadius: 20,
    padding: 16,
  },
  cardIcon: {
    fontSize: 42,
  },
  cardTitle: {
    margin: "6px 0",
    fontSize: 17,
    fontWeight: 900,
  },
  infoList: {
    marginTop: 10,
    fontSize: 14,
    color: "#44403c",
  },
  buttonStack: {
    display: "grid",
    gap: 8,
    marginTop: 12,
  },
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
  darkButton: {
    background: "#1c1917",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
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
  },
  emptyBox: {
    border: "1px dashed #d6d3d1",
    borderRadius: 18,
    padding: 18,
    color: "#78716c",
    background: "#fafaf9",
  },
  jobTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
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
  bonusText: {
    color: "#15803d",
    fontWeight: 900,
    margin: "4px 0",
    fontSize: 13,
  },
  message: {
    background: "#ffedd5",
    border: "1px solid #fdba74",
    color: "#7c2d12",
    borderRadius: 18,
    padding: 14,
    fontWeight: 800,
    lineHeight: 1.4,
  },
  statusBadge: {
    borderRadius: 999,
    padding: "5px 9px",
    fontWeight: 900,
    fontSize: 12,
  },
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
  buildingList: {
    display: "grid",
    gap: 12,
    marginTop: 16,
  },
  buildingCard: {
    background: "#fafaf9",
    border: "1px solid #d6d3d1",
    borderRadius: 18,
    padding: 14,
    display: "flex",
    gap: 12,
  },
  buildingIcon: {
    fontSize: 34,
  },
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

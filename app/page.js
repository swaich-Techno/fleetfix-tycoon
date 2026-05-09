"use client";

import { useEffect, useMemo, useState } from "react";

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

const SERVICE_CALLS = [
  {
    id: 1,
    title: "Car Tyre Puncture",
    vehicle: "Small Car",
    problem: "Flat tyre on town road",
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
    problem: "Battery not starting",
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
    problem: "Brake system inspection required",
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
    title: "Bus Emergency Inspection",
    vehicle: "Bus",
    problem: "Passenger bus needs safety check",
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
];

const BUILDINGS = [
  {
    name: "Parts Store",
    cost: 800,
    description: "Unlocks better repair supplies.",
    icon: "🏪",
  },
  {
    name: "Tow Yard",
    cost: 1400,
    description: "Prepares your company for towing missions.",
    icon: "🚚",
  },
  {
    name: "Training Center",
    cost: 2000,
    description: "Future upgrade center for technicians.",
    icon: "🎓",
  },
  {
    name: "Fuel Station",
    cost: 2600,
    description: "Adds business value to your town.",
    icon: "⛽",
  },
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
];

const SKILLS = ["Tyre", "Electrical", "Engine", "Mechanical", "Diagnostic"];

function getXpNeeded(level) {
  return level * 150;
}

function getRandomServiceCalls(level) {
  const available = SERVICE_CALLS.filter((call) => call.difficulty <= level + 1);
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

function createTechnician(name, isOwner = false) {
  return {
    id: Math.random().toString(36).slice(2),
    name,
    skill: isOwner
      ? "All-Rounder"
      : SKILLS[Math.floor(Math.random() * SKILLS.length)],
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

  useEffect(() => {
    const savedGame = localStorage.getItem("fleetfix-tycoon-save");

    if (savedGame) {
      const parsedGame = JSON.parse(savedGame);
      setGame(parsedGame);

      if (parsedGame.started) {
        setAvailableCalls(getRandomServiceCalls(parsedGame.level));
      }
    }
  }, []);

  useEffect(() => {
    if (game.started) {
      localStorage.setItem("fleetfix-tycoon-save", JSON.stringify(game));
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
                `${technician?.name || "Technician"} completed ${job.title}. You earned ${job.rewardCoins} coins and ${job.rewardXp} XP.`
              );

              return false;
            }

            return true;
          });

        updatedGame.activeJobs = updatedActiveJobs;

        while (updatedGame.xp >= getXpNeeded(updatedGame.level)) {
          updatedGame.xp -= getXpNeeded(updatedGame.level);
          updatedGame.level += 1;
          updatedGame.coins += 200;
          completedMessages.push(
            `Level up! You reached Level ${updatedGame.level} and earned 200 bonus coins.`
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

  function startGame() {
    if (
      !setup.companyName.trim() ||
      !setup.ownerName.trim() ||
      !setup.townName.trim() ||
      !setup.technicianName.trim()
    ) {
      setMessage(
        "Please fill company name, owner name, town name, and first technician name."
      );
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
    setMessage(
      `Welcome to ${setup.companyName}! Your repair empire begins in ${setup.townName}.`
    );
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

    const activeJob = {
      ...serviceCall,
      jobId: Math.random().toString(36).slice(2),
      technicianId,
      technicianName: technician.name,
      remainingTime: serviceCall.duration,
      totalTime: serviceCall.duration,
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

    setMessage(`${technician.name} has been dispatched to ${serviceCall.title}.`);
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

    setMessage(
      `${newTechnician.name} joined your company as a ${newTechnician.skill} technician.`
    );
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

  function resetGame() {
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
  }

  if (!game.started) {
    return (
      <main style={styles.startPage}>
        <section style={styles.startCard}>
          <div style={styles.logo}>🛠️🚛</div>
          <h1 style={styles.title}>FleetFix Tycoon</h1>
          <p style={styles.subtitle}>
            Start with one broken garage in barren land. Repair vehicles, hire
            technicians, answer emergency calls, and build your repair empire.
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
              onChange={(value) =>
                setSetup({ ...setup, technicianName: value })
              }
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
          <Stat label="Reputation" value={`⭐ ${game.reputation}`} />
          <Stat label="Jobs" value={game.completedJobs} />
        </div>
      </header>

      <section style={styles.layout}>
        <div style={styles.leftColumn}>
          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🏜️ {game.townName}</h2>
                <p style={styles.smallText}>
                  Barren land slowly becoming a repair empire.
                </p>
              </div>

              <button style={styles.dangerButton} onClick={resetGame}>
                Reset
              </button>
            </div>

            <div style={styles.townGrid}>
              <TownTile
                icon="🏚️"
                title={`Garage Lvl ${game.garageLevel}`}
                subtitle="Main repair base"
              />

              {game.ownedBuildings.includes("Parts Store") && (
                <TownTile
                  icon="🏪"
                  title="Parts Store"
                  subtitle="Repair supplies"
                />
              )}

              {game.ownedBuildings.includes("Tow Yard") && (
                <TownTile icon="🚚" title="Tow Yard" subtitle="Recovery area" />
              )}

              {game.ownedBuildings.includes("Training Center") && (
                <TownTile
                  icon="🎓"
                  title="Training Center"
                  subtitle="Skill upgrades"
                />
              )}

              {game.ownedBuildings.includes("Fuel Station") && (
                <TownTile
                  icon="⛽"
                  title="Fuel Station"
                  subtitle="Town business"
                />
              )}

              <TownTile
                icon="🛣️"
                title="Highway"
                subtitle="Service calls arrive"
              />
              <TownTile icon="🌵" title="Empty Land" subtitle="Future expansion" />
              <TownTile icon="🏗️" title="Build Zone" subtitle="Unlock more soon" />
            </div>
          </Panel>

          <Panel>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>🚨 Service Calls</h2>
                <p style={styles.smallText}>
                  Dispatch technicians to roadside problems.
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
                      <p>
                        <b>Vehicle:</b> {call.vehicle}
                      </p>
                      <p>
                        <b>Skill:</b> {call.skill}
                      </p>
                      <p>
                        <b>Time:</b> {call.duration}s
                      </p>
                      <p>
                        <b>Reward:</b> 🪙 {call.rewardCoins} • XP{" "}
                        {call.rewardXp}
                      </p>
                    </div>

                    <div style={styles.buttonStack}>
                      {freeTechnicians.length === 0 ? (
                        <div style={styles.warningBox}>No free technicians.</div>
                      ) : (
                        freeTechnicians.map((tech) => (
                          <button
                            key={tech.id}
                            style={styles.orangeSmallButton}
                            onClick={() => dispatchTechnician(call, tech.id)}
                          >
                            Send {tech.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel>
            <h2 style={styles.sectionTitle}>⏱️ Active Jobs</h2>

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
                          <h3 style={styles.cardTitle}>
                            {job.icon} {job.title}
                          </h3>
                          <p style={styles.smallText}>
                            Technician: {job.technicianName}
                          </p>
                        </div>

                        <span style={styles.timerBadge}>
                          {job.remainingTime}s
                        </span>
                      </div>

                      <div style={styles.progressOuter}>
                        <div
                          style={{
                            ...styles.progressInner,
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Panel>
        </div>

        <aside style={styles.rightColumn}>
          {message && <div style={styles.message}>📢 {message}</div>}

          <Panel>
            <h2 style={styles.sectionTitle}>👨‍🔧 Technicians</h2>
            <p style={styles.smallText}>Manage your repair team.</p>

            <div style={styles.techList}>
              {game.technicians.map((tech) => (
                <div key={tech.id} style={styles.techCard}>
                  <div style={styles.jobTop}>
                    <h3 style={styles.cardTitle}>
                      {tech.isOwner ? "👑" : "🔧"} {tech.name}
                    </h3>

                    <span
                      style={{
                        ...styles.statusBadge,
                        background:
                          tech.status === "Free" ? "#dcfce7" : "#fef3c7",
                        color: tech.status === "Free" ? "#166534" : "#92400e",
                      }}
                    >
                      {tech.status}
                    </span>
                  </div>

                  <p style={styles.smallText}>Skill: {tech.skill}</p>
                  <p style={styles.smallText}>Level: {tech.level}</p>
                  <p style={styles.smallText}>Energy: {tech.energy}%</p>
                </div>
              ))}
            </div>

            <button style={styles.darkFullButton} onClick={hireTechnician}>
              Hire Technician — 🪙 {700 + game.technicians.length * 350}
            </button>

            <button style={styles.lightFullButton} onClick={restTechnicians}>
              Rest Free Technicians
            </button>
          </Panel>

          <Panel>
            <h2 style={styles.sectionTitle}>🏗️ Upgrades</h2>
            <p style={styles.smallText}>Upgrade garage and expand your town.</p>

            <button style={styles.mainButton} onClick={upgradeGarage}>
              Upgrade Garage — 🪙 {game.garageLevel * 1000}
            </button>

            <div style={styles.buildingList}>
              {BUILDINGS.map((building) => {
                const owned = game.ownedBuildings.includes(building.name);

                return (
                  <div key={building.name} style={styles.buildingCard}>
                    <div style={styles.buildingIcon}>{building.icon}</div>

                    <div>
                      <h3 style={styles.cardTitle}>{building.name}</h3>
                      <p style={styles.smallText}>{building.description}</p>

                      <button
                        style={owned ? styles.ownedButton : styles.darkButton}
                        onClick={() => buyBuilding(building)}
                        disabled={owned}
                      >
                        {owned ? "Owned" : `Build — 🪙 ${building.cost}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </aside>
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

function TownTile({ icon, title, subtitle }) {
  return (
    <div style={styles.townTile}>
      <div style={styles.townIcon}>{icon}</div>
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
    maxWidth: 760,
    background: "rgba(255,255,255,0.85)",
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
    maxWidth: 620,
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
    fontWeight: 700,
    color: "#292524",
  },
  input: {
    border: "1px solid #d6d3d1",
    borderRadius: 16,
    padding: "13px 14px",
    fontSize: 15,
    outline: "none",
  },
  mainButton: {
    width: "100%",
    marginTop: 18,
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
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "rgba(255,255,255,0.95)",
    borderBottom: "1px solid #d6d3d1",
    padding: 18,
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    flexWrap: "wrap",
  },
  headerTitle: {
    margin: 0,
    fontSize: 26,
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
    gridTemplateColumns: "repeat(5, minmax(90px, 1fr))",
    gap: 8,
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
    fontWeight: 800,
  },
  statValue: {
    margin: "4px 0 0",
    fontSize: 17,
    fontWeight: 900,
  },
  layout: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: 20,
    display: "grid",
    gridTemplateColumns: "1.45fr 0.8fr",
    gap: 18,
  },
  leftColumn: {
    display: "grid",
    gap: 18,
  },
  rightColumn: {
    display: "grid",
    gap: 18,
    alignContent: "start",
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
  },
  sectionTitle: {
    margin: 0,
    fontSize: 24,
    fontWeight: 900,
  },
  townGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(145px, 1fr))",
    gap: 14,
    background: "linear-gradient(135deg, #fde68a, #e7e5e4, #fed7aa)",
    borderRadius: 20,
    padding: 16,
  },
  townTile: {
    minHeight: 110,
    background: "rgba(255,255,255,0.82)",
    border: "1px solid #d6d3d1",
    borderRadius: 20,
    padding: 14,
  },
  townIcon: {
    fontSize: 38,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
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
  cardIcon: {
    fontSize: 40,
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
    fontWeight: 800,
    cursor: "pointer",
  },
  darkButton: {
    background: "#1c1917",
    color: "white",
    border: "none",
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
  },
  darkFullButton: {
    width: "100%",
    marginTop: 14,
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
    marginTop: 10,
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
    fontWeight: 800,
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
  message: {
    background: "#ffedd5",
    border: "1px solid #fdba74",
    color: "#7c2d12",
    borderRadius: 18,
    padding: 14,
    fontWeight: 800,
    lineHeight: 1.4,
    marginTop: 16,
  },
  techList: {
    display: "grid",
    gap: 10,
    marginTop: 14,
  },
  techCard: {
    background: "#fafaf9",
    border: "1px solid #d6d3d1",
    borderRadius: 18,
    padding: 14,
  },
  statusBadge: {
    borderRadius: 999,
    padding: "5px 9px",
    fontWeight: 900,
    fontSize: 12,
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
};

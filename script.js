let picks = {};

const bracketFlow = {
  r16_1: { next: "qf1", slot: 1 },
  r16_2: { next: "qf1", slot: 2 },
  r16_3: { next: "qf2", slot: 1 },
  r16_4: { next: "qf2", slot: 2 },

  r16_5: { next: "qf3", slot: 1 },
  r16_6: { next: "qf3", slot: 2 },
  r16_7: { next: "qf4", slot: 1 },
  r16_8: { next: "qf4", slot: 2 },

  qf1: { next: "sf1", slot: 1 },
  qf2: { next: "sf1", slot: 2 },

  qf3: { next: "sf2", slot: 1 },
  qf4: { next: "sf2", slot: 2 },

  sf1: { next: "final", slot: 1 },
  sf2: { next: "final", slot: 2 },

  final: { next: "champion", slot: 1 }
};

async function checkLogin() {
  const { data } = await supabaseClient.auth.getUser();

  if (!data.user) {
    window.location.href = "login.html";
    return;
  }

  document.getElementById("welcomeMessage").innerText =
    "Logged in as: " + data.user.email;

  document.getElementById("playerName").value = data.user.email;
}

function pickWinner(matchId, team) {
  if (!team) return;

  picks[matchId] = team;

  const flow = bracketFlow[matchId];

  if (!flow) return;

  if (flow.next === "champion") {
    document.getElementById("champion").innerText = team;
    picks.champion = team;
    return;
  }

  const nextButton = document.getElementById(`${flow.next}_team${flow.slot}`);

  if (nextButton) {
    nextButton.innerText = team;
  }

  clearDownstream(flow.next);
}

function clearDownstream(matchId) {
  const flow = bracketFlow[matchId];

  if (!flow) return;

  delete picks[matchId];

  if (flow.next === "champion") {
    document.getElementById("champion").innerText = "?";
    delete picks.champion;
    return;
  }

  const btn1 = document.getElementById(`${flow.next}_team1`);
  const btn2 = document.getElementById(`${flow.next}_team2`);

  if (btn1) btn1.innerText = "";
  if (btn2) btn2.innerText = "";

  clearDownstream(flow.next);
}

function rebuildBracket() {
  Object.keys(picks).forEach(matchId => {
    if (matchId === "champion") return;

    const team = picks[matchId];
    const flow = bracketFlow[matchId];

    if (!flow) return;

    if (flow.next === "champion") {
      document.getElementById("champion").innerText = team;
    } else {
      const nextButton = document.getElementById(`${flow.next}_team${flow.slot}`);
      if (nextButton) nextButton.innerText = team;
    }
  });

  if (picks.champion) {
    document.getElementById("champion").innerText = picks.champion;
  }
}

async function saveBracket() {
  const playerName = document.getElementById("playerName").value.trim();

  const { data: userData } = await supabaseClient.auth.getUser();

  if (!userData.user) {
    window.location.href = "login.html";
    return;
  }

  const champion = picks.champion || "";

  const { error } = await supabaseClient
    .from("bracket_picks")
    .insert({
      user_id: userData.user.id,
      player_name: playerName,
      picks: picks,
      champion: champion
    });

  if (error) {
    alert(error.message);
    return;
  }

  localStorage.setItem("worldCupBracket", JSON.stringify({
    name: playerName,
    picks: picks
  }));

  alert("Bracket saved successfully!");
}

function loadSavedBracket() {
  const saved = localStorage.getItem("worldCupBracket");

  if (!saved) return;

  const data = JSON.parse(saved);

  picks = data.picks || {};

  rebuildBracket();
}

function resetBracket() {
  if (!confirm("Reset your bracket?")) return;

  localStorage.removeItem("worldCupBracket");
  location.reload();
}

async function logout() {
  await supabaseClient.auth.signOut();
  localStorage.removeItem("worldCupBracket");
  window.location.href = "login.html";
}

window.onload = async function () {
  await checkLogin();
  loadSavedBracket();
};

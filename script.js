let picks = {
  qf1: [],
  qf2: [],
  qf3: [],
  qf4: [],
  sf1: [],
  sf2: [],
  final: [],
  champion: []
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

function addWinner(round, team, spot1, spot2) {
  if (!team) return;

  if (picks[round].length === 0) {
    picks[round][0] = team;
    document.getElementById(spot1).innerText = team;
  } else {
    picks[round][1] = team;
    document.getElementById(spot2).innerText = team;
  }
}

function pickWinner(round, team) {
  if (!team) return;

  if (round === "qf1") addWinner("qf1", team, "qf1a", "qf1b");
  if (round === "qf2") addWinner("qf2", team, "qf2a", "qf2b");
  if (round === "qf3") addWinner("qf3", team, "qf3a", "qf3b");
  if (round === "qf4") addWinner("qf4", team, "qf4a", "qf4b");

  if (round === "sf1") addWinner("sf1", team, "sf1a", "sf1b");
  if (round === "sf2") addWinner("sf2", team, "sf2a", "sf2b");

  if (round === "final") addWinner("final", team, "finala", "finalb");

  if (round === "champion") {
    picks.champion = [team];
    document.getElementById("champion").innerText = team;
  }
}

async function saveBracket() {
  const playerName = document.getElementById("playerName").value.trim();

  const { data: userData } = await supabaseClient.auth.getUser();

  if (!userData.user) {
    window.location.href = "login.html";
    return;
  }

  const champion = picks.champion[0] || "";

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

function loadSavedBracket() {
  const saved = localStorage.getItem("worldCupBracket");

  if (!saved) return;

  const data = JSON.parse(saved);

  picks = {
    qf1: [],
    qf2: [],
    qf3: [],
    qf4: [],
    sf1: [],
    sf2: [],
    final: [],
    champion: [],
    ...data.picks
  };

  if (picks.qf1[0]) document.getElementById("qf1a").innerText = picks.qf1[0];
  if (picks.qf1[1]) document.getElementById("qf1b").innerText = picks.qf1[1];

  if (picks.qf2[0]) document.getElementById("qf2a").innerText = picks.qf2[0];
  if (picks.qf2[1]) document.getElementById("qf2b").innerText = picks.qf2[1];

  if (picks.qf3[0]) document.getElementById("qf3a").innerText = picks.qf3[0];
  if (picks.qf3[1]) document.getElementById("qf3b").innerText = picks.qf3[1];

  if (picks.qf4[0]) document.getElementById("qf4a").innerText = picks.qf4[0];
  if (picks.qf4[1]) document.getElementById("qf4b").innerText = picks.qf4[1];

  if (picks.sf1[0]) document.getElementById("sf1a").innerText = picks.sf1[0];
  if (picks.sf1[1]) document.getElementById("sf1b").innerText = picks.sf1[1];

  if (picks.sf2[0]) document.getElementById("sf2a").innerText = picks.sf2[0];
  if (picks.sf2[1]) document.getElementById("sf2b").innerText = picks.sf2[1];

  if (picks.final[0]) document.getElementById("finala").innerText = picks.final[0];
  if (picks.final[1]) document.getElementById("finalb").innerText = picks.final[1];

  if (picks.champion[0]) document.getElementById("champion").innerText = picks.champion[0];
}

window.onload = async function () {
  await checkLogin();
  loadSavedBracket();
};

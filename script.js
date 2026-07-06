let picks = {
  qf1: [],
  qf2: [],
  sf1: [],
  final: []
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

function pickWinner(round, team) {
  if (!team) return;

  picks[round].push(team);

  if (round === "qf1") {
    if (picks.qf1.length === 1) document.getElementById("qf1a").innerText = team;
    if (picks.qf1.length === 2) document.getElementById("qf1b").innerText = team;
  }

  if (round === "qf2") {
    if (picks.qf2.length === 1) document.getElementById("qf2a").innerText = team;
    if (picks.qf2.length === 2) document.getElementById("qf2b").innerText = team;
  }

  if (round === "sf1") {
    if (picks.sf1.length === 1) document.getElementById("sf1a").innerText = team;
    if (picks.sf1.length === 2) document.getElementById("sf1b").innerText = team;
  }

  if (round === "final") {
    document.getElementById("champion").innerText = team;
    picks.final = [team];
  }
}

async function saveBracket() {
  const playerName = document.getElementById("playerName").value.trim();

  const { data: userData } = await supabaseClient.auth.getUser();

  if (!userData.user) {
    window.location.href = "login.html";
    return;
  }

  const champion = document.getElementById("champion").innerText;

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

window.onload = async function () {
  await checkLogin();

  const saved = localStorage.getItem("worldCupBracket");

  if (!saved) return;

  const data = JSON.parse(saved);

  picks = data.picks;

  if (picks.qf1[0]) document.getElementById("qf1a").innerText = picks.qf1[0];
  if (picks.qf1[1]) document.getElementById("qf1b").innerText = picks.qf1[1];

  if (picks.qf2[0]) document.getElementById("qf2a").innerText = picks.qf2[0];
  if (picks.qf2[1]) document.getElementById("qf2b").innerText = picks.qf2[1];

  if (picks.sf1[0]) document.getElementById("sf1a").innerText = picks.sf1[0];
  if (picks.sf1[1]) document.getElementById("sf1b").innerText = picks.sf1[1];

  if (picks.final[0]) document.getElementById("champion").innerText = picks.final[0];
};

let picks = {
  qf1: [],
  qf2: [],
  sf1: [],
  final: []
};

function pickWinner(round, team) {
  if (!team) return;

  picks[round].push(team);

  if (round === "qf1") {
    if (picks.qf1.length === 1) {
      document.getElementById("qf1a").innerText = team;
    } else if (picks.qf1.length === 2) {
      document.getElementById("qf1b").innerText = team;
    }
  }

  if (round === "qf2") {
    if (picks.qf2.length === 1) {
      document.getElementById("qf2a").innerText = team;
    } else if (picks.qf2.length === 2) {
      document.getElementById("qf2b").innerText = team;
    }
  }

  if (round === "sf1") {
    if (picks.sf1.length === 1) {
      document.getElementById("sf1a").innerText = team;
    } else if (picks.sf1.length === 2) {
      document.getElementById("sf1b").innerText = team;
    }
  }

  if (round === "final") {
    document.getElementById("champion").innerText = team;
    picks.final = [team];
  }
}

async function saveBracket() {
  const name = document.getElementById("playerName").value.trim();

  if (name === "") {
    alert("Please enter your name.");
    return;
  }

  const { data: userData } = await supabaseClient.auth.getUser();

  if (!userData.user) {
    alert("Please login first.");
    return;
  }

  const champion = document.getElementById("champion").innerText;

  const { error } = await supabaseClient
    .from("bracket_picks")
    .insert({
      user_id: userData.user.id,
      player_name: name,
      picks: picks,
      champion: champion
    });

  if (error) {
    alert(error.message);
  } else {
    alert("Bracket saved to Supabase!");
  }
};

  localStorage.setItem("worldCupBracket", JSON.stringify(bracketData));
  alert("Bracket saved!");
}

function resetBracket() {
  localStorage.removeItem("worldCupBracket");
  location.reload();
}
async function signUp() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  document.getElementById("loginMessage").innerText =
    error ? error.message : "Signup successful. Check your email if confirmation is on.";
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  document.getElementById("loginMessage").innerText =
    error ? error.message : "Logged in!";
}

async function logout() {
  await supabaseClient.auth.signOut();
  document.getElementById("loginMessage").innerText = "Logged out.";
}
window.onload = function () {
  const saved = localStorage.getItem("worldCupBracket");

  if (saved) {
    const data = JSON.parse(saved);
    document.getElementById("playerName").value = data.name;
    picks = data.picks;

    if (picks.qf1[0]) document.getElementById("qf1a").innerText = picks.qf1[0];
    if (picks.qf1[1]) document.getElementById("qf1b").innerText = picks.qf1[1];

    if (picks.qf2[0]) document.getElementById("qf2a").innerText = picks.qf2[0];
    if (picks.qf2[1]) document.getElementById("qf2b").innerText = picks.qf2[1];

    if (picks.sf1[0]) document.getElementById("sf1a").innerText = picks.sf1[0];
    if (picks.sf1[1]) document.getElementById("sf1b").innerText = picks.sf1[1];

    if (picks.final[0]) document.getElementById("champion").innerText = picks.final[0];
  }
};

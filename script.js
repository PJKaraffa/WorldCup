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

function saveBracket() {
  const name = document.getElementById("playerName").value.trim();

  if (name === "") {
    alert("Please enter your name.");
    return;
  }

  const bracketData = {
    name: name,
    picks: picks
  };

  localStorage.setItem("worldCupBracket", JSON.stringify(bracketData));
  alert("Bracket saved!");
}

function resetBracket() {
  localStorage.removeItem("worldCupBracket");
  location.reload();
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
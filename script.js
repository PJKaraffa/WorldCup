// ============================================
// WORLD CUP BRACKET
// ============================================

let picks = {
    qf1: [],
    qf2: [],
    sf1: [],
    final: []
};

// ============================================
// PICK WINNER
// ============================================

function pickWinner(round, team) {

    if (!team) return;

    picks[round].push(team);

    switch (round) {

        case "qf1":

            if (picks.qf1.length === 1)
                document.getElementById("qf1a").innerText = team;
            else if (picks.qf1.length === 2)
                document.getElementById("qf1b").innerText = team;

            break;

        case "qf2":

            if (picks.qf2.length === 1)
                document.getElementById("qf2a").innerText = team;
            else if (picks.qf2.length === 2)
                document.getElementById("qf2b").innerText = team;

            break;

        case "sf1":

            if (picks.sf1.length === 1)
                document.getElementById("sf1a").innerText = team;
            else if (picks.sf1.length === 2)
                document.getElementById("sf1b").innerText = team;

            break;

        case "final":

            document.getElementById("champion").innerText = team;
            picks.final = [team];

            break;
    }
}

// ============================================
// SAVE BRACKET
// ============================================

async function saveBracket() {

    const playerName = document.getElementById("playerName").value.trim();

    if (playerName === "") {
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
            player_name: playerName,
            picks: picks,
            champion: champion
        });

    if (error) {
        alert(error.message);
        return;
    }

    // Save locally too
    localStorage.setItem("worldCupBracket", JSON.stringify({
        name: playerName,
        picks: picks
    }));

    alert("Bracket saved successfully!");
}

// ============================================
// RESET
// ============================================

function resetBracket() {

    if (!confirm("Reset your bracket?"))
        return;

    localStorage.removeItem("worldCupBracket");

    location.reload();
}

// ============================================
// SIGN UP
// ============================================

async function signUp() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const { error } = await supabaseClient.auth.signUp({
        email,
        password
    });

    if (error)
        document.getElementById("loginMessage").innerText = error.message;
    else
        document.getElementById("loginMessage").innerText =
            "Account created! Check your email if confirmation is enabled.";
}

// ============================================
// LOGIN
// ============================================

async function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error)
        document.getElementById("loginMessage").innerText = error.message;
    else
        document.getElementById("loginMessage").innerText = "Logged in successfully!";
}

// ============================================
// LOGOUT
// ============================================

async function logout() {

    await supabaseClient.auth.signOut();

    document.getElementById("loginMessage").innerText = "Logged out.";
}

// ============================================
// LOAD SAVED BRACKET
// ============================================

window.onload = function () {

    const saved = localStorage.getItem("worldCupBracket");

    if (!saved) return;

    const data = JSON.parse(saved);

    document.getElementById("playerName").value = data.name;

    picks = data.picks;

    if (picks.qf1[0])
        document.getElementById("qf1a").innerText = picks.qf1[0];

    if (picks.qf1[1])
        document.getElementById("qf1b").innerText = picks.qf1[1];

    if (picks.qf2[0])
        document.getElementById("qf2a").innerText = picks.qf2[0];

    if (picks.qf2[1])
        document.getElementById("qf2b").innerText = picks.qf2[1];

    if (picks.sf1[0])
        document.getElementById("sf1a").innerText = picks.sf1[0];

    if (picks.sf1[1])
        document.getElementById("sf1b").innerText = picks.sf1[1];

    if (picks.final[0])
        document.getElementById("champion").innerText = picks.final[0];
};
async function checkLogin() {
  const { data } = await supabaseClient.auth.getUser();

  if (!data.user) {
    window.location.href = "login.html";
  }
}

checkLogin();

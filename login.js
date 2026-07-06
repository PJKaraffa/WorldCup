async function signUp() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  document.getElementById("loginMessage").innerText =
    error ? error.message : "Account created. Now login.";
}

async function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("loginMessage").innerText = error.message;
    return;
  }

  window.location.href = "index.html";
}

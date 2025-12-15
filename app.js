// gebruikerslijst
const users = [
  { username: "jan", password: "test123" },
  { username: "test123", password: "test" }
];

let isLoggedIn = false;

// rekeningen
let accounts = [
  { name: "Betaalrekening", balance: 1500.00 },
  { name: "Spaarrekening", balance: 3000.00 }
];

const sections = document.querySelectorAll(".section");
const navLogin = document.getElementById("nav-login");
const navLogout = document.getElementById("nav-logout");

const accountsList = document.getElementById("accounts-list");
const createBox = document.getElementById("create-box");
const openCreateBtn = document.getElementById("open-create");
const cancelCreateBtn = document.getElementById("cancel-create");
const createAccountBtn = document.getElementById("create-account");

const accountNameInput = document.getElementById("account-name");
const accountBalanceInput = document.getElementById("account-balance");
const accountError = document.getElementById("account-error");

// verbergt secties
function hideAll() {
  sections.forEach(sec => sec.classList.remove("visible"));
}

function showSection(id) {
  hideAll();
  document.getElementById(id).classList.add("visible");
}

// euro
function euro(amount) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR"
  }).format(amount);
}

// render rekeningen
function renderAccounts() {
  accountsList.innerHTML = "";

  accounts.forEach(acc => {
    const row = document.createElement("div");
    row.className = "account-row";
    row.innerHTML = `
      <span class="acc-name">${acc.name}</span>
      <span class="acc-balance">${euro(acc.balance)}</span>
    `;
    accountsList.appendChild(row);
  });
}

// navbar links
document.querySelectorAll("nav a[data-section]").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();

    const target = link.dataset.section;

    // blokkeer als je niet ingelogd bent

    if (!isLoggedIn && (target === "rekeningen" || target === "overschrijvingen")) {
      showSection("login");
      document.getElementById("login-error").textContent = "Log eerst in om dit te bekijken.";
      return;
    }

    showSection(target);

    if (target === "rekeningen") {
      renderAccounts();
    }
  });
});

// login
document.getElementById("login-btn").addEventListener("click", () => {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();

  const found = users.find(u => u.username === user && u.password === pass);

  if (!found) {
    document.getElementById("login-error").textContent = "Foutieve login";
    return;
  }

  document.getElementById("login-error").textContent = "";
  isLoggedIn = true;

  navLogin.classList.add("hidden");
  navLogout.classList.remove("hidden");

  showSection("rekeningen");
  renderAccounts();
});

// logout
navLogout.addEventListener("click", (e) => {
  e.preventDefault();
  isLoggedIn = false;

  navLogin.classList.remove("hidden");
  navLogout.classList.add("hidden");

  showSection("home");
});

// nieuwe rekening openen/sluiten
openCreateBtn.addEventListener("click", () => {
  createBox.classList.remove("hidden");
  accountError.textContent = "";
});

cancelCreateBtn.addEventListener("click", () => {
  createBox.classList.add("hidden");
  accountError.textContent = "";
  accountNameInput.value = "";
  accountBalanceInput.value = "";
});

// rekening aanmaken
createAccountBtn.addEventListener("click", () => {
  const name = accountNameInput.value.trim();
  const balanceValue = accountBalanceInput.value.trim();

  if (name.length < 2) {
    accountError.textContent = "Geef een geldige rekeningnaam op.";
    return;
  }

  const balance = Number(balanceValue);
  if (Number.isNaN(balance) || balance < 0) {
    accountError.textContent = "Geef een geldig startsaldo op (0 of hoger).";
    return;
  }

  accounts.push({ name, balance: Number(balance.toFixed(2)) });

  // reset + opnieuw renderen
  accountNameInput.value = "";
  accountBalanceInput.value = "";
  accountError.textContent = "";
  createBox.classList.add("hidden");

  renderAccounts();
});
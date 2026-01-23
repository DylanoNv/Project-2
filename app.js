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

// transacties

let transactions = [
  { id: 1, type: "inkomend", datum: "2025-11-01", bedrag: 250.00 },
  { id: 2, type: "uitgaand", datum: "2025-11-03", bedrag: 100.00 },
  { id: 3, type: "inkomend", datum: "2025-11-05", bedrag: 500.00 },
  { id: 4, type: "uitgaand", datum: "2025-11-10", bedrag: 75.00 }
];
let nextTransactionId = 5;

function vandaag() {
  return new Date().toISOString().slice(0, 10);
}


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

// render transacties

const transactionsList = document.getElementById("transactions-list");

function renderTransactions(list) {
  transactionsList.innerHTML = "";
  
  list.forEach(t => {
    const div = document.createElement("div");
    div.className = "transaction-row";

    div.innerHTML = `
    <strong>Type:</strong> ${t.type}<br>
    <strong>Datum:</strong> ${t.datum}<br>
    <strong>Bedrag:</strong> ${euro(t.bedrag)}
    `;

    transactionsList.appendChild(div);
  });
}

// filters
const filterType = document.getElementById("filter-type");
const filterDate = document.getElementById("filter-date");
const filterBtn = document.getElementById("filter-btn");
const resetBtn = document.getElementById("reset-filter-btn");

filterBtn.addEventListener("click", () => {
  let result = transactions;

  // filter op type
  if (filterType.value !== "alle") {
    result = result.filter(t => t.type === filterType.value);
  }

  // filter op datum
  if (filterDate.value !== "") {
    result = result.filter(t => t.datum === filterDate.value);
  }

  renderTransactions(result);
});

resetBtn.addEventListener("click", () => {
  filterType.value = "alle";
  filterDate.value = "";
  renderTransactions(transactions);
});

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

    if (target === "transacties") {
      renderTransactions(transactions);
    }
    // blokkeer als je niet ingelogd bent

    if (!isLoggedIn && (target === "rekeningen" || target === "overschrijvingen" || target === "beleggingen" || target === "transacties")) {
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

  // reset
  accountNameInput.value = "";
  accountBalanceInput.value = "";
  accountError.textContent = "";
  createBox.classList.add("hidden");

  renderAccounts();
});

const fromSelect = document.getElementById("from-account");
const toSelect = document.getElementById("to-account");
const transferAmountInput = document.getElementById("transfer-amount");
const transferBtn = document.getElementById("transfer-btn");
const transferMessage = document.getElementById("transfer-message");
const successVisual = document.getElementById("success-visual");

function fillTransferDropdowns() {
  fromSelect.innerHTML = "";
  toSelect.innerHTML = "";

  accounts.forEach((acc, index) => {
    const opt1 = document.createElement("option");
    opt1.value = index;
    opt1.textContent = `${acc.name} (${euro(acc.balance)})`;
    fromSelect.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = index;
    opt2.textContent = `${acc.name} (${euro(acc.balance)})`;
    toSelect.appendChild(opt2);
  });

  if (accounts.length > 1) {
    toSelect.value = "1";
  }
}

function showTransferMessage(text, type) {
  transferMessage.textContent = text;
  transferMessage.classList.remove("hidden", "success", "error");
  transferMessage.classList.add(type);
}

function hideTransferMessage() {
  transferMessage.classList.add("hidden");
  successVisual.classList.add("hidden");
}

// dropdowns updates bij overschrijvingen
document.querySelectorAll("nav a[data-section]").forEach(link => {
  link.addEventListener("click", () => {
    const target = link.dataset.section;
    if (target === "overschrijvingen" && isLoggedIn) {
      fillTransferDropdowns();
      hideTransferMessage();
      transferAmountInput.value = "";
    }
  });
});

transferBtn.addEventListener("click", () => {
  hideTransferMessage();

  const fromIndex = Number(fromSelect.value);
  const toIndex = Number(toSelect.value);
  const amount = Number(transferAmountInput.value);

  if (accounts.length < 2) {
    showTransferMessage("Je hebt minimaal 2 rekeningen nodig om over te schrijven.", "error");
    return;
  }

  if (fromIndex === toIndex) {
    showTransferMessage("Van en naar rekening mogen niet hetzelfde zijn.", "error");
    return;
  }

  if (Number.isNaN(amount) || amount <= 0) {
    showTransferMessage("Vul een geldig bedrag in (groter dan 0).", "error");
    return;
  }

  if (accounts[fromIndex].balance < amount) {
    showTransferMessage("Onvoldoende saldo op de gekozen rekening.", "error");
    return;
  }

  // overschrijven
  accounts[fromIndex].balance = Number((accounts[fromIndex].balance - amount).toFixed(2));
  accounts[toIndex].balance = Number((accounts[toIndex].balance + amount).toFixed(2));

  renderAccounts();
  fillTransferDropdowns();

  showTransferMessage(`${euro(amount)} is succesvol overgeschreven van ${accounts[fromIndex].name} naar ${accounts[toIndex].name}.`, "success");
  successVisual.classList.remove("hidden");
});


 // beleggen
function investCash() {
  return accounts[0].balance;
}
function setInvestCash(newValue) {
  accounts[0].balance = Number(newValue.toFixed(2));
}

const investCategory = document.getElementById("invest-category");
const investProduct = document.getElementById("invest-product");
const investCashEl = document.getElementById("invest-cash");
const investPriceEl = document.getElementById("invest-price");
const investOwnedEl = document.getElementById("invest-owned");
const investAmount = document.getElementById("invest-amount");
const investBuyBtn = document.getElementById("invest-buy");
const investSellBtn = document.getElementById("invest-sell");
const investMsg = document.getElementById("invest-message");

// producten
const investProducts = {
  Aandelen: [
    { name: "S&P500", price: 120.00 },
    { name: "Tesla", price: 80.00 },
    { name: "Apple", price: 55.00 }
  ],
};

// bezittingen
const holdings = {}; 

function getSelectedProduct() {
  const cat = investCategory.value;
  const prodName = investProduct.value;
  const prod = investProducts[cat].find(p => p.name === prodName);
  return prod;
}

function updateInvestUI() {
  investCashEl.textContent = euro(investCash());

  const prod = getSelectedProduct();
  investPriceEl.textContent = euro(prod.price);

  const owned = holdings[prod.name] ?? 0;
  investOwnedEl.textContent = owned.toFixed(2);
}

function setInvestMessage(text, ok) {
  investMsg.textContent = text;
  investMsg.classList.remove("ok", "bad");
  investMsg.classList.add(ok ? "ok" : "bad");
}

// dropdowns
function fillInvestCategories() {
  investCategory.innerHTML = "";
  Object.keys(investProducts).forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    investCategory.appendChild(opt);
  });
}

function fillInvestProducts() {
  investProduct.innerHTML = "";
  const cat = investCategory.value;
  investProducts[cat].forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = p.name;
    investProduct.appendChild(opt);
  });
  updateInvestUI();
}

fillInvestCategories();
fillInvestProducts();
updateInvestUI();

investCategory.addEventListener("change", () => {
  fillInvestProducts();
  setInvestMessage("", true);
});

investProduct.addEventListener("change", () => {
  updateInvestUI();
  setInvestMessage("", true);
});

// kopen en verkopen
function handleBuySell(isBuy) {
  const prod = getSelectedProduct();
  const amount = Number(investAmount.value);

  if (Number.isNaN(amount) || amount <= 0) {
    setInvestMessage("Vul een geldig bedrag in (groter dan 0).", false);
    return;
  }

  const units = amount / prod.price;

  if (isBuy) {
    if (investCash() < amount) {
      setInvestMessage("Onvoldoende saldo om te kopen.", false);
      return;
    }

    setInvestCash(investCash() - amount);
    holdings[prod.name] = (holdings[prod.name] ?? 0) + units;

    setInvestMessage(`Je hebt ${euro(amount)} geïnvesteerd in ${prod.name}.`, true);
  } else {
    const owned = holdings[prod.name] ?? 0;

    if (owned < units) {
      setInvestMessage("Je hebt niet genoeg eenheden om dit bedrag te verkopen.", false);
      return;
    }

    holdings[prod.name] = owned - units;
    setInvestCash(investCash() + amount);

    setInvestMessage(`Je hebt ${euro(amount)} verkocht van ${prod.name}.`, true);
  }

  renderAccounts();
  updateInvestUI();
  investAmount.value = "";
}

investBuyBtn.addEventListener("click", () => handleBuySell(true));
investSellBtn.addEventListener("click", () => handleBuySell(false));

// inlog waarschuwing
document.querySelectorAll("nav a[data-section]").forEach(link => {
  link.addEventListener("click", () => {
    const target = link.dataset.section;
    if (target === "beleggingen" && isLoggedIn) {
      updateInvestUI();
      setInvestMessage("", true);
      investAmount.value = "";
    }
  });
});

// crypto data
let cryptoList = [
  { name: "Bitcoin", price: 90000 },
  { name: "Ethereum", price: 4800 },
  { name: "Litecoin", price: 250 }
];

// investeringen
const cryptoInvested = {
  Bitcoin: 0,
  Ethereum: 0,
  Litecoin: 0
};

const cryptoOverview = document.getElementById("crypto-overview");
const cryptoSelect = document.getElementById("crypto-select");
const cryptoEurInput = document.getElementById("crypto-eur");
const cryptoBuyBtn = document.getElementById("crypto-buy");
const cryptoSellBtn = document.getElementById("crypto-sell");
const cryptoMessage = document.getElementById("crypto-message");

function fillCryptoSelect() {
  cryptoSelect.innerHTML = "";
  cryptoList.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.name;
    opt.textContent = c.name;
    cryptoSelect.appendChild(opt);
  });
}

function renderCryptoOverview(changeMap = {}) {
  cryptoOverview.innerHTML = "";

  cryptoList.forEach(c => {
    const invested = cryptoInvested[c.name] ?? 0;

    const row = document.createElement("div");
    row.className = "crypto-row";

    if (changeMap[c.name] === "up") row.classList.add("up");
    if (changeMap[c.name] === "down") row.classList.add("down");

    row.innerHTML = `
      <span><strong>${c.name}:</strong> ${euro(invested)} (${c.price} per eenheid)</span>
    `;

    cryptoOverview.appendChild(row);
  });
}

function getSelectedCrypto() {
  const name = cryptoSelect.value;
  return cryptoList.find(c => c.name === name);
}

function setCryptoMsg(text, ok = true) {
  cryptoMessage.textContent = text;
  cryptoMessage.style.color = ok ? "#166534" : "#dc2626";
}

function getCash() {
  return accounts[0].balance;
}
function setCash(v) {
  accounts[0].balance = Number(v.toFixed(2));
}

// kopen
cryptoBuyBtn.addEventListener("click", () => {
  const coin = getSelectedCrypto();
  const amount = Number(cryptoEurInput.value);

  if (Number.isNaN(amount) || amount <= 0) {
    setCryptoMsg("Vul geldig bedrag in.", false);
    return;
  }

  if (getCash() < amount) {
    setCryptoMsg("Niet genoeg saldo.", false);
    return;
  }

  setCash(getCash() - amount);
  cryptoInvested[coin.name] += amount;

  renderAccounts();
  renderCryptoOverview();
  setCryptoMsg(`Je hebt ${euro(amount)} in ${coin.name} geinvesteerd.`, true);
  cryptoEurInput.value = "";
});

// verkopen
cryptoSellBtn.addEventListener("click", () => {
  const coin = getSelectedCrypto();
  const amount = Number(cryptoEurInput.value);

  if (Number.isNaN(amount) || amount <= 0) {
    setCryptoMsg("Vul een geldig bedrag in.", false);
    return;
  }

  if ((cryptoInvested[coin.name] ?? 0) < amount) {
    setCryptoMsg("Je hebt niet genoeg geïnvesteerd om dit bedrag te verkopen.", false);
    return;
  }

  cryptoInvested[coin.name] -= amount;
  setCash(getCash() + amount);

  renderAccounts();
  renderCryptoOverview();
  setCryptoMsg(`Je hebt ${euro(amount)} van ${coin.name} verkocht.`, true);
  cryptoEurInput.value = "";
});

// koers (nep)
function updateCryptoPrices() {
  const changes = {};

  cryptoList = cryptoList.map(c => {
    const old = c.price;

    const factor = 1 + (Math.random() * 0.06 - 0.03);
    const newPrice = Math.max(1, Math.round(old * factor));

    if (newPrice > old) changes[c.name] = "up";
    else if (newPrice < old) changes[c.name] = "down";

    return { ...c, price: newPrice };
  });

  renderCryptoOverview(changes);
}

document.querySelectorAll("nav a[data-section]").forEach(link => {
  link.addEventListener("click", () => {
    const target = link.dataset.section;
    if (target === "crypto" && isLoggedIn) {
      fillCryptoSelect();
      renderCryptoOverview();
      setCryptoMsg("");
      cryptoEurInput.value = "";
    }
  });
});

// koers updates
setInterval(() => {
  const cryptoSection = document.getElementById("crypto");
  if (cryptoSection && cryptoSection.classList.contains("visible")) {
    updateCryptoPrices();
  }
}, 4000);
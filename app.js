// gebruikerlijst
const users = [
    { username: "jan", password: "test123" },
    { username: "anna", password: "bank2025" }
];

const sections = document.querySelectorAll(".section");

// verbergt alle secties
function hideAll() {
    sections.forEach(sec => sec.classList.remove("visible"));
}

// navbar
document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
        e.preventDefault();
        hideAll();
        document.getElementById(link.dataset.section).classList.add("visible");
    });
});

// inlog knoppen
document.getElementById("open-login").addEventListener("click", () => {
    hideAll();
    document.getElementById("login").classList.add("visible");
});

document.getElementById("login-btn").addEventListener("click", () => {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;

    const found = users.find(u => u.username === user && u.password === pass);

    if (!found) {
        document.getElementById("login-error").textContent = "Foutieve login";
        return;
    }

    document.getElementById("login-error").textContent = "";
    alert("Ingelogd!");

    hideAll();
    document.getElementById("home").classList.add("visible");
});

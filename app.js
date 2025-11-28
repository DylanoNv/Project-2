document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll("nav a");
    const sections = document.querySelectorAll(".section");

    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();

            const target = this.getAttribute("data-section");

            sections.forEach(s => s.classList.remove("visible"));
            document.getElementById(target).classList.add("visible");
        });
    });
});

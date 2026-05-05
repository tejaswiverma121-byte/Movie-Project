const dbtn = document.getElementById("themeToggle");

if (dbtn) {
  dbtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    dbtn.textContent =
      document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  });
}
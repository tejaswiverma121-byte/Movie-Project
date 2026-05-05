const btn = document.getElementById("themeToggle");
btn.textContent = "☀️";

btn.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  const isLight = document.body.classList.contains("light-mode");
  btn.textContent = isLight ? "🌙" : "☀️";
});
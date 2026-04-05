const toggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navbar = document.getElementById("navbar");

toggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

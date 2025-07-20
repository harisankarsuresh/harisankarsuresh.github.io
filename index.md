

<link rel="stylesheet" href="assets/custom.css">
<div id="particles-js"></div>

<div class="main-title animated-gradient-border">Harisankar Suresh</div>
<div class="subtitle">Data Scientist & Cell Modeling Engineer | EV Battery Systems | AI Diagnostics</div>
<hr>

<div style="max-width:700px;margin:auto;">
<p>Welcome to my portfolio. I specialize in electric vehicle battery systems, AI-driven diagnostics, and scalable physics-based simulation tools. My work bridges advanced algorithms, real-world deployment, and technical leadership in the battery-AI space.</p>

<div class="section-title">Projects</div>
<ul class="projects-list">
  <li><strong>olabatsim</strong>: Scalable battery simulation platform for EVs</li>
  <li><strong>lime_internal_getter</strong>: Internal state estimation for battery packs</li>
  <li><strong>evolve-ai</strong>: AI-powered diagnostics and life estimation</li>
</ul>
<a href="projects.md">See all projects »</a>

<div class="section-title">About Me</div>
<p>I work at Ola Electric, building next-gen BMS algorithms, degradation models (PDEs, PINNs), and deploying SoH/SoC estimation techniques for real-world fleets. I’m an expert in Python and C, leading tool development and mentoring teams.</p>
<a href="about.md">Read more »</a> | <a href="#">Download Resume</a>

<div class="section-title">Contact</div>
<div class="contact-info">
  <span>Email: <a href="mailto:your.email@domain.com">your.email@domain.com</a></span>
  <span>LinkedIn: <a href="#">linkedin.com/in/harisankarsuresh</a></span>
</div>

<div class="footer">
  <hr>
  <strong>Passionate about EVs, AI, and battery systems. Driving innovation in energy storage.</strong>
</div>
</div>

<script src="assets/particles.min.js"></script>
<script>
// Particle background config
particlesJS('particles-js', {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 800 } },
    color: { value: ["#2979ff", "#ff1744", "#1a237e"] },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 4, random: true },
    line_linked: { enable: true, distance: 120, color: "#2979ff", opacity: 0.4, width: 1 },
    move: { enable: true, speed: 2, direction: "none", random: false, straight: false, out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" },
      resize: true
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 0.7 } },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});
</script>

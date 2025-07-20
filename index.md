


<link rel="stylesheet" href="assets/custom.css">
<div id="particles-js"></div>


<div class="tabbar">
  <div class="tab" onclick="showTab(0)">About</div>
  <div class="tab" onclick="showTab(1)">Projects</div>
  <div class="tab" onclick="showTab(2)">Contact</div>
</div>

<div class="tabcontent">
  <section class="tab-section tab-about">
    <h1 class="main-title">Harisankar Suresh</h1>
    <div class="subtitle">Data Scientist & Cell Modeling Engineer<br><span class="emoji">🔋🚗🤖</span></div>
    <p class="about-text">EV Battery Systems | AI Diagnostics | Physics-based Simulation</p>
    <h2 class="section-title">About Me <span class="emoji">👨‍🔬</span></h2>
    <p>I work at Ola Electric, building next-gen BMS algorithms, degradation models (PDEs, PINNs), and deploying SoH/SoC estimation techniques for real-world fleets.<br>
    Expert in Python <span class="emoji">🐍</span> and C <span class="emoji">💻</span>, leading tool development and mentoring teams.</p>
    <a href="about.md" class="slide-link">Read more »</a> | <a href="#" class="slide-link">Download Resume</a>
  </section>

  <section class="tab-section tab-projects" style="display:none;">
    <h2 class="section-title">Projects <span class="emoji">🛠️📊</span></h2>
    <ul class="projects-list">
      <li><strong>olabatsim</strong> <span class="emoji">🔋</span>: Scalable battery simulation platform for EVs</li>
      <li><strong>lime_internal_getter</strong> <span class="emoji">🧪</span>: Internal state estimation for battery packs</li>
      <li><strong>evolve-ai</strong> <span class="emoji">🤖</span>: AI-powered diagnostics and life estimation</li>
    </ul>
    <div class="plotly-placeholder"> <!-- Placeholder for future Plotly graphs -->
      <span class="emoji">📈</span> <em>Cool graphs coming soon!</em>
    </div>
    <a href="projects.md" class="slide-link">See all projects »</a>
  </section>

  <section class="tab-section tab-contact" style="display:none;">
    <h2 class="section-title">Contact <span class="emoji">✉️</span></h2>
    <div class="contact-info">
      <span>Email: <a href="mailto:your.email@domain.com">your.email@domain.com</a></span>
      <span>LinkedIn: <a href="#">linkedin.com/in/harisankarsuresh</a></span>
    </div>
    <a href="contact.md" class="slide-link">More contact options »</a>
  </section>
</div>

<div class="footer">
  <hr>
  <strong>Passionate about EVs <span class="emoji">🔋</span>, AI <span class="emoji">🤖</span>, and battery systems. Driving innovation in energy storage.</strong>
</div>

<script src="assets/particles.min.js"></script>
<script>
// Particle background config
particlesJS('particles-js', {
  particles: {
    number: { value: 40, density: { enable: true, value_area: 800 } },
    color: { value: ["#2979ff", "#ff1744", "#1a237e"] },
    shape: { type: "circle" },
    opacity: { value: 0.3, random: true },
    size: { value: 3, random: true },
    line_linked: { enable: true, distance: 120, color: "#2979ff", opacity: 0.2, width: 1 },
    move: { enable: true, speed: 1.5, direction: "none", random: false, straight: false, out_mode: "out" }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "grab" },
      onclick: { enable: true, mode: "push" },
      resize: true
    },
    modes: {
      grab: { distance: 140, line_linked: { opacity: 0.5 } },
      push: { particles_nb: 2 }
    }
  },
  retina_detect: true
});

// Tab navigation logic
function showTab(idx) {
  var tabs = document.querySelectorAll('.tab');
  var sections = document.querySelectorAll('.tab-section');
  tabs.forEach(function(t, i) {
    t.classList.toggle('active', i === idx);
  });
  sections.forEach(function(s, i) {
    s.style.display = (i === idx) ? 'block' : 'none';
  });
}
showTab(0);
</script>

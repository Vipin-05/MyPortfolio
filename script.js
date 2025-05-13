// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Highlight active nav link on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${current}`) {
      item.classList.add('active');
    }
  });
});

// Animated Background Dots
const canvas = document.getElementById('bg-dots');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let dots = [];
const dotCount = Math.min(Math.floor(width * height / 9000), 80);

for (let i = 0; i < dotCount; i++) {
  dots.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    radius: Math.random() * 2 + 2
  });
}

let mouse = { x: width/2, y: height/2 };

document.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function drawDots() {
  ctx.clearRect(0, 0, width, height);
  
  dots.forEach(dot => {
    // Update dot position
    dot.x += dot.vx;
    dot.y += dot.vy;
    
    // Bounce off edges
    if (dot.x < 0 || dot.x > width) dot.vx *= -1;
    if (dot.y < 0 || dot.y > height) dot.vy *= -1;
    
    // Draw dot
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(35, 37, 38, 0.3)';
    ctx.fill();
    
    // Connect dots that are close to each other
    dots.forEach(otherDot => {
      if (dot !== otherDot) {
        const distance = Math.hypot(dot.x - otherDot.x, dot.y - otherDot.y);
        if (distance < 120) {
          ctx.beginPath();
          ctx.moveTo(dot.x, dot.y);
          ctx.lineTo(otherDot.x, otherDot.y);
          ctx.strokeStyle = `rgba(35, 37, 38, ${0.4 * (1 - distance/120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });
    
    // Connect dots to mouse cursor
    const mouseDistance = Math.hypot(dot.x - mouse.x, dot.y - mouse.y);
    if (mouseDistance < 150) {
      ctx.beginPath();
      ctx.moveTo(dot.x, dot.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.strokeStyle = `rgba(247, 183, 49, ${2.0 * (1 - mouseDistance/150)})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  });
  
  requestAnimationFrame(drawDots);
}

drawDots();

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

// --- Profile Photo: REMOVE upload/change functionality ---
// (No triggerPhotoUpload or changePhoto functions)
// (No localStorage for profile photo)
// (Your photo will always show as profile.jpg)

// Projects Management
let projects = [];
const defaultProjects = [
  {
    id: 1,
    title: "Bookstore - Where Stories Nestle",
    description: "Full-stack MERN web app for browsing, purchasing, and reviewing books. Secure payments, roles for users/admins/sellers, deployed on Netlify & Render.",
    tech: "React.js, Node.js, Express.js, MongoDB",
    github: "https://github.com/Vipin-05/BookStore-Project-",
    demo: ""
  },
  {
    id: 2,
    title: "Expense Tracker Application",
    description: "Track income and spending efficiently with graphical insights. Built using the MERN stack.",
    tech: "MongoDB, Express.js, React.js, Node.js",
    github: "",
    demo: ""
  },
  {
    id: 3,
    title: "Weather App Widget",
    description: "Dynamic weather widget using OpenWeatherMap API. Real-time updates with JavaScript & CSS.",
    tech: "JavaScript, CSS, OpenWeatherMap API",
    github: "https://github.com/Vipin-05/Weather-App-Widget",
    demo: ""
  }
];

function loadProjects() {
  const savedProjects = localStorage.getItem('projects');
  projects = savedProjects ? JSON.parse(savedProjects) : defaultProjects;
  renderProjects();
}

function saveProjects() {
  localStorage.setItem('projects', JSON.stringify(projects));
}

function renderProjects() {
  const projectList = document.getElementById('project-list');
  projectList.innerHTML = '';
  
  projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    let linksHTML = '';
    if (project.github) {
      linksHTML += `<a href="${project.github}" target="_blank"><i class="fab fa-github"></i> GitHub</a>`;
    }
    if (project.demo) {
      linksHTML += `<a href="${project.demo}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
    }
    
    card.innerHTML = `
      <div class="project-title">${project.title}</div>
      <div class="project-desc">${project.description}</div>
      <div class="project-tech"><i class="fas fa-code"></i> ${project.tech}</div>
      <div class="project-links">${linksHTML}</div>
      <div class="project-actions">
        <button class="edit-btn" onclick="editProject(${project.id})"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" onclick="deleteProject(${project.id})"><i class="fas fa-trash"></i></button>
      </div>
    `;
    
    projectList.appendChild(card);
  });
}

// Toggle edit mode
document.getElementById('toggleEditMode').addEventListener('click', () => {
  document.getElementById('project-form-container').style.display = 'flex';
  document.getElementById('project-form').reset();
  document.getElementById('project-id').value = '';
});

function closeProjectForm() {
  document.getElementById('project-form-container').style.display = 'none';
}

// Save project (Add or Edit)
document.getElementById('project-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const id = document.getElementById('project-id').value;
  const title = document.getElementById('project-title').value;
  const description = document.getElementById('project-desc').value;
  const tech = document.getElementById('project-tech').value;
  const github = document.getElementById('project-github').value;
  const demo = document.getElementById('project-demo').value;
  
  if (id) {
    // Edit existing project
    const index = projects.findIndex(p => p.id == id);
    if (index !== -1) {
      projects[index] = { id: parseInt(id), title, description, tech, github, demo };
    }
  } else {
    // Add new project
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    projects.push({ id: newId, title, description, tech, github, demo });
  }
  
  saveProjects();
  renderProjects();
  closeProjectForm();
});

// Edit project
function editProject(id) {
  const project = projects.find(p => p.id === id);
  if (!project) return;
  
  document.getElementById('project-id').value = project.id;
  document.getElementById('project-title').value = project.title;
  document.getElementById('project-desc').value = project.description;
  document.getElementById('project-tech').value = project.tech;
  document.getElementById('project-github').value = project.github || '';
  document.getElementById('project-demo').value = project.demo || '';
  
  document.getElementById('project-form-container').style.display = 'flex';
}

// Delete project
function deleteProject(id) {
  if (confirm('Are you sure you want to delete this project?')) {
    projects = projects.filter(p => p.id !== id);
    saveProjects();
    renderProjects();
  }
}

// Contact form with EmailJS
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const templateParams = {
    name: this.querySelector('[name="name"]').value,
    email: this.querySelector('[name="email"]').value,
    subject: this.querySelector('[name="subject"]').value,
    message: this.querySelector('[name="message"]').value,
    to_email: 'vrchaudhari07@gmail.com'
  };
  
  // Show loading state
  const submitBtn = this.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';
  
  // Use your actual EmailJS values
  emailjs.send('service_x7ozu2s', 'template_r4gorof', templateParams)
    .then(() => {
      alert('Your message has been sent! I will get back to you soon.');
      this.reset();
    })
    .catch(error => {
      console.error('Error sending email:', error);
      alert('Sorry, there was an error sending your message. Please try again.');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
});

// Load projects on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  loadProjects();
});

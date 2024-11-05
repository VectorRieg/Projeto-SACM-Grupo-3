// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Animação suave para links de navegação
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Somente adicione 'active' ao link atual
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
            
            // Se o href começa com #, então não redirecione
            if (href.startsWith("#")) {
                e.preventDefault(); // Evita redirecionar para seções
            }
        });
    });
});


// Función para mostrar mensaje de confirmación en formularios
function confirmarEnvio(event) {
    event.preventDefault();
    if (confirm('¿Estás seguro de enviar el formulario?')) {
        event.target.submit();
    }
} 
// Desplazamiento suave para enlaces de anclaje
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Mostrar/Ocultar menú en dispositivos móviles
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});
// Validación de formulario
document.querySelector('form').addEventListener('submit', function(e) {
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;

    if (nome === '' || email === '') {
        alert('Por favor, completa todos los campos.');
        e.preventDefault(); // Evita el envío del formulario
    }
});
// Cambio de tema
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});
// Contador de visitas (simulado)
let visitas = localStorage.getItem('visitas') ? parseInt(localStorage.getItem('visitas')) : 0;
visitas++;
localStorage.setItem('visitas', visitas);
document.getElementById('contador-visitas').textContent = `Visitas: ${visitas}`;
// Função para Editar o perfil do usuário
function editProfile() {
    const name = prompt("Digite seu novo nome:", document.getElementById("profile-name").innerText);
    const bio = prompt("Digite sua nova bio:", document.getElementById("profile-bio").innerText);
    const email = prompt("Digite seu novo email:", document.getElementById("profile-email").innerText);
    const phone = prompt("Digite seu novo telefone:", document.getElementById("profile-phone").innerText);
    const location = prompt("Digite sua nova localização:", document.getElementById("profile-location").innerText);

    // Atualizar informações de perfil
    if (name) document.getElementById("profile-name").innerText = name;
    if (bio) document.getElementById("profile-bio").innerText = bio;    
    if (email) document.getElementById("profile-email").innerText = email;
    if (phone) document.getElementById("profile-phone").innerText = phone;
    if (location) document.getElementById("profile-location").innerText = location;

    // Salvar as informações no localStorage
    saveProfileData();
}

// Função para salvar os dados do perfil no localStorage
function saveProfileData() {
    const profileData = {
        name: document.getElementById("profile-name").innerText,
        bio: document.getElementById("profile-bio").innerText,
        email: document.getElementById("profile-email").innerText,
        phone: document.getElementById("profile-phone").innerText,
        location: document.getElementById("profile-location").innerText,
        activities: JSON.parse(localStorage.getItem("profileData"))?.activities || []
    };

    localStorage.setItem("profileData", JSON.stringify(profileData));
}

// Função para editar as atividades recentes
function editActivities() {
    const activities = JSON.parse(localStorage.getItem("profileData"))?.activities || [];
    const newActivity = prompt("Digite uma nova atividade:");

    if (newActivity) {
        activities.push(newActivity);
        localStorage.setItem("profileData", JSON.stringify({
            ...JSON.parse(localStorage.getItem("profileData")),
            activities: activities
        }));
        loadActivities(); // Atualiza a exibição das atividades
    }
}

// Função para remover uma atividade
function removeActivity(index) {
    const activities = JSON.parse(localStorage.getItem("profileData"))?.activities || [];
    activities.splice(index, 1); // Remove a atividade no índice especificado

    localStorage.setItem("profileData", JSON.stringify({
        ...JSON.parse(localStorage.getItem("profileData")),
        activities: activities
    }));
    loadActivities(); // Atualiza a exibição das atividades
}

// Função para carregar o perfil e as atividades do localStorage
function loadProfile() {
    const savedProfile = JSON.parse(localStorage.getItem("profileData"));
    if (savedProfile) {
        document.getElementById("profile-name").innerText = savedProfile.name || "Seu Nome";
        document.getElementById("profile-bio").innerText = savedProfile.bio || "Sua bio aqui.";
        document.getElementById("profile-email").innerText = savedProfile.email || "seuemail@example.com";
        document.getElementById("profile-phone").innerText = savedProfile.phone || "(00) 12345-6789";
        document.getElementById("profile-location").innerText = savedProfile.location || "Sua cidade, país";

        // Carregar atividades
        loadActivities(savedProfile.activities);
    }
}
// Função para sair da conta
function logout() {
    localStorage.removeItem("loggedIn");
    alert("Você saiu da sua conta.");
    window.location.href = "entrar.html";
}
if (window.location.pathname.includes("entrar.html")) {
    document.addEventListener("DOMContentLoaded", populateLoginFields);
}
function loadActivities() {
    const activitiesList = document.querySelector('.profile-activities ul');
    activitiesList.innerHTML = ''; // Limpa a lista atual

    const activities = JSON.parse(localStorage.getItem("profileData"))?.activities || [];
    activities.forEach((activity, index) => {
        const li = document.createElement('li');
        li.innerText = activity;

        // Criar botão para remover a atividade
        const removeBtn = document.createElement('button');
        removeBtn.innerText = "Remover";
        removeBtn.classList.add('remove-btn');  // Adiciona a classe remove-btn para o estilo
        removeBtn.onclick = () => removeActivity(index); // Passa o índice para a função de remover
        li.appendChild(removeBtn); // Adiciona o botão à lista

        activitiesList.appendChild(li);
    });
}


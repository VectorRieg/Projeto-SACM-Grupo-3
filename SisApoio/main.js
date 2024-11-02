// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Animación suave para los enlaces de navegación
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            document.location.href = href;
            
            // Añadir clase activa al enlace actual
            document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Animación para las imágenes al hacer scroll
    const observador = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    // Observar todas las imágenes
    document.querySelectorAll('img').forEach(img => {
        observador.observe(img);
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
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;

    if (nombre === '' || email === '') {
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





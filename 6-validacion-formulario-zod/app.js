import { z } from 'https://cdn.jsdelivr.net/npm/zod@3.25.11/+esm';

// Variables globales
let colorChangeInterval = null;

// Configuración de Zod
const formSchema = z.object({
    name: z.string()
        .min(3, "✧ Mínimo 3 caracteres")
        .max(50, "✧ Máximo 50 caracteres")
        .regex(/^[a-zA-Z\sáéíóúÁÉÍÓÚñÑ]+$/, "✧ Solo letras y espacios"),
    
    email: z.string()
        .email("✧ Correo inválido"),
    
    spell: z.string()
        .min(6, "✧ Mínimo 6 caracteres")
        .regex(/[A-Z]/, "✧ Requiere mayúscula")
        .regex(/[0-9]/, "✧ Requiere número"),
    
    birthday: z.string()
        .refine(val => val && new Date(val) < new Date(), "✧ Fecha debe ser pasada")
});

// Esperar a que se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const elements = {
        form: document.getElementById('magic-form'),
        formContainer: document.getElementById('form-container'),
        portalContainer: document.getElementById('portal-container'),
        welcomeMessage: document.getElementById('welcome-message'),
        closeBtn: document.getElementById('close-portal'),
        errorSpans: document.querySelectorAll('.error')
    };

    //Función para cerrar el portal
    const closePortal = () => {
        console.log('Cerrando portal...');
        
        // Detener animación
        if (colorChangeInterval) {
            clearInterval(colorChangeInterval);
            colorChangeInterval = null;
        }
        
        // Ocultar portal y mostrar formulario
        elements.portalContainer.classList.add('hidden');
        elements.formContainer.classList.remove('hidden');
        
        // Limpiar formulario
        elements.form.reset();
        
        // Limpiar errores
        elements.errorSpans.forEach(el => el.textContent = '');
    };

    //  Conversión HEX a RGB
    const hexToRgb = (hex) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    };

    //  Animación del portal
    const startPortalAnimation = () => {
        const colors = ['#65ddff', '#e53170', '#ff8906', '#a7a9be'];
        let i = 0;
        const portalElements = {
            glow: document.querySelector('.portal-glow'),
            ring: document.querySelector('.portal-ring')
        };

        return setInterval(() => {
            if (portalElements.glow && portalElements.ring) {
                portalElements.glow.style.background = `
                    radial-gradient(circle, 
                    rgba(${hexToRgb(colors[i])},0.8) 0%, 
                    rgba(${hexToRgb(colors[i])},0) 70%)`;
                portalElements.ring.style.borderTopColor = colors[i];
                portalElements.ring.style.borderLeftColor = colors[i];
                i = (i + 1) % colors.length;
            }
        }, 2000);
    };

    //  Mostrar portal mágico
    const showMagicalPortal = (data) => {
        elements.formContainer.classList.add('hidden');
        elements.portalContainer.classList.remove('hidden');
        
        elements.welcomeMessage.innerHTML = `
            <div class="magic-text">¡Bienvenid@!</div>
            <span class="magic-name">${data.name.split(' ')[0]}</span>
            <div class="magic-sub">El portal se ha abierto</div>
            <small>${new Date().toLocaleString()}</small>
        `;
        
        colorChangeInterval = startPortalAnimation();
    };

    // Event Listeners
    elements.closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closePortal();
    });

    // También cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.portalContainer.classList.contains('hidden')) {
            closePortal();
        }
    });

    elements.form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Limpiar errores anteriores
        elements.errorSpans.forEach(el => el.textContent = '');
        
        // Obtener y validar datos
        const formData = new FormData(elements.form);
        const data = Object.fromEntries(formData.entries());
        const result = formSchema.safeParse(data);
        
        if (!result.success) {
            // Mostrar errores
            result.error.issues.forEach(issue => {
                const errorElement = document.getElementById(`${issue.path[0]}-error`);
                if (errorElement) {
                    errorElement.textContent = issue.message;
                }
            });
        } else {
            // Mostrar portal
            showMagicalPortal(data);
        }
    });

    console.log("✨ Sistema mágico inicializado");
});
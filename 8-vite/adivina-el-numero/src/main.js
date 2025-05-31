import './style.css';

// Estado del juego
let numeroSecreto;
let intentos = 0;
let juegoTerminado = false;
let rangoMax = 100;
let record = localStorage.getItem('record') || null;

// Elementos DOM
const inputNumero = document.getElementById('numero');
const botonAdivinar = document.getElementById('adivinar');
const botonReiniciar = document.getElementById('reiniciar');
const mensaje = document.getElementById('mensaje');
const hint = document.getElementById('hint');
const intentosDisplay = document.getElementById('intentos');
const recordDisplay = document.getElementById('record');
const rangoDisplay = document.getElementById('rango');
const difficultyBtns = document.querySelectorAll('.difficulty-btn');

// Inicializar juego
function iniciarJuego() {
    numeroSecreto = Math.floor(Math.random() * rangoMax) + 1;
    intentos = 0;
    juegoTerminado = false;
    mensaje.textContent = '¡Ingresa tu primer número!';
    hint.textContent = '';
    inputNumero.value = '';
    inputNumero.max = rangoMax;
    actualizarStats();
    inputNumero.focus();
}

function actualizarStats() {
    intentosDisplay.textContent = intentos;
    recordDisplay.textContent = record || '-';
    rangoDisplay.textContent = `1-${rangoMax}`;
}

function darPista(numeroJugador) {
    const diferencia = Math.abs(numeroSecreto - numeroJugador);
    const porcentaje = (diferencia / rangoMax) * 100;

    if (porcentaje <= 5) {
        return "🔥 ¡Muy caliente! Estás súper cerca";
    } else if (porcentaje <= 10) {
        return "♨️ Caliente, muy cerca";
    } else if (porcentaje <= 20) {
        return "🌡️ Tibio, te acercas";
    } else if (porcentaje <= 40) {
        return "❄️ Frío, aún lejos";
    } else {
        return "🧊 ¡Muy frío! Estás muy lejos";
    }
}

function procesarIntento() {
    if (juegoTerminado) return;

    const numeroJugador = parseInt(inputNumero.value);

    if (isNaN(numeroJugador) || numeroJugador < 1 || numeroJugador > rangoMax) {
        mensaje.textContent = `Por favor, ingresa un número válido entre 1 y ${rangoMax}.`;
        return;
    }

    intentos++;

    if (numeroJugador === numeroSecreto) {
        juegoTerminado = true;
        mensaje.textContent = `🎉 ¡Felicidades! ¡Adivinaste el número ${numeroSecreto}!`;
        hint.textContent = `Lo lograste en ${intentos} ${intentos === 1 ? 'intento' : 'intentos'}`;
        
        // Actualizar record
        if (!record || intentos < parseInt(record)) {
            record = intentos.toString();
            localStorage.setItem('record', record);
            hint.textContent += ' - ¡Nuevo récord! 🏆';
        }

        // Animación de celebración
        document.querySelector('.container').classList.add('celebration');
        setTimeout(() => {
            document.querySelector('.container').classList.remove('celebration');
        }, 500);

    } else {
        if (numeroJugador < numeroSecreto) {
            mensaje.textContent = '📈 El número es más alto.';
        } else {
            mensaje.textContent = '📉 El número es más bajo.';
        }
        hint.textContent = darPista(numeroJugador);
    }

    actualizarStats();
    inputNumero.value = '';
    inputNumero.focus();
}

// Event listeners
botonAdivinar.addEventListener('click', procesarIntento);

inputNumero.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        procesarIntento();
    }
});

botonReiniciar.addEventListener('click', iniciarJuego);

// Selector de dificultad
difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover clase active de todos los botones
        difficultyBtns.forEach(b => b.classList.remove('active'));
        // Agregar clase active al botón clickeado
        btn.classList.add('active');
        
        rangoMax = parseInt(btn.dataset.range);
        iniciarJuego();
    });
});

// Inicializar el juego al cargar la página
if (record) {
    recordDisplay.textContent = record;
}
iniciarJuego();
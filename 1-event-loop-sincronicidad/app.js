// Referencias a elementos DOM
const orderList = document.getElementById('orderList');
const addOrderBtn = document.getElementById('addOrderBtn');
const addMultipleBtn = document.getElementById('addMultipleBtn');
const clearBtn = document.getElementById('clearBtn');
const eventLog = document.getElementById('eventLog');

// Contadores y estado
let orderId = 1;
let totalOrders = 0;
let processingOrders = 0;
let completedOrders = 0;

// Tipos de bebidas para hacer más realista
const beverages = [
    { name: 'Café Americano', time: 2000 },
    { name: 'Cappuccino', time: 3000 },
    { name: 'Latte', time: 3500 },
    { name: 'Espresso', time: 1500 },
    { name: 'Frappé', time: 4000 },
    { name: 'Mocha', time: 3800 }
];

// Event Listeners
addOrderBtn.addEventListener('click', () => {
    agregarPedidoIndividual();
});

addMultipleBtn.addEventListener('click', () => {
    agregarPedidosMultiples();
});

clearBtn.addEventListener('click', () => {
    limpiarTodo();
});

// Función principal para agregar un pedido individual
function agregarPedidoIndividual() {
    const beverage = beverages[Math.floor(Math.random() * beverages.length)];
    const order = {
        id: orderId++,
        status: 'En Proceso',
        beverage: beverage.name,
        preparationTime: beverage.time,
        startTime: Date.now()
    };

    addOrder(order);
    processOrder(order);
    logEvent(`Nuevo pedido recibido: #${order.id} - ${order.beverage}`);
}

// Función para agregar múltiples pedidos (simular rush hour)
async function agregarPedidosMultiples() {
    logEvent('Rush hour iniciado - agregando múltiples pedidos...');
    
    for (let i = 0; i < 3; i++) {
        agregarPedidoIndividual();
        // Pequeña pausa entre pedidos para mostrar el efecto asincrónico
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}

// Función para agregar pedido al DOM (del código original)
function addOrder(order) {
    const listItem = document.createElement('li');
    listItem.id = `order-${order.id}`;
    listItem.className = 'order-item order-processing';
    
    listItem.innerHTML = `
        <div class="order-info">
            <div><strong>Pedido #${order.id}</strong> - ${order.beverage}</div>
            <div class="progress-bar">
                <div class="progress-fill" id="progress-${order.id}"></div>
            </div>
            <div class="timestamp">Iniciado: ${new Date().toLocaleTimeString()}</div>
        </div>
        <div class="order-status status-processing">${order.status}</div>
    `;
    
    orderList.appendChild(listItem);
    
    // Actualizar estadísticas
    totalOrders++;
    processingOrders++;
    updateStats();
}

// Función para actualizar estado del pedido (del código original)
function updateOrderStatus(order, status) {
    const listItem = document.getElementById(`order-${order.id}`);
    if (listItem) {
        const statusElement = listItem.querySelector('.order-status');
        const orderInfo = listItem.querySelector('.order-info');
        
        if (status === 'Completado') {
            listItem.className = 'order-item order-completed';
            statusElement.className = 'order-status status-completed';
            statusElement.textContent = status;
            
            // Agregar tiempo de completado
            const completedTime = new Date().toLocaleTimeString();
            const timeSpan = document.createElement('div');
            timeSpan.className = 'timestamp';
            timeSpan.textContent = `Completado: ${completedTime}`;
            orderInfo.appendChild(timeSpan);
            
            // Actualizar estadísticas
            processingOrders--;
            completedOrders++;
            updateStats();
        } else {
            statusElement.textContent = status;
        }
    }
}

// ============================================
// PARTE ASINCRÓNICA - COMPLETAR LOS TODOs
// ============================================

async function processOrder(order) {
    try {
        logEvent(`Iniciando preparación del pedido #${order.id}`);
        
        // Simular progreso visual
        simulateProgress(order.id, order.preparationTime);
        
        // TODO COMPLETADO: Simular la preparación del pedido usando setTimeout y Promise
        await new Promise((resolve, reject) => {
            // Simular posible error (5% de probabilidad)
            const willFail = Math.random() < 0.05;
            
            setTimeout(() => {
                if (willFail) {
                    reject(new Error(`Error en la preparación del pedido #${order.id}`));
                } else {
                    resolve(`Pedido #${order.id} preparado exitosamente`);
                }
            }, order.preparationTime);
        });

        // TODO COMPLETADO: Actualizar el estado del pedido a "Completado"
        updateOrderStatus(order, 'Completado');
        logEvent(`Pedido #${order.id} completado exitosamente`);

    } catch (error) {
        // Manejo de errores
        logEvent(`ERROR: ${error.message}`, 'error');
        updateOrderStatus(order, 'Error');
        
        // Retry después de 2 segundos
        setTimeout(async () => {
            logEvent(`Reintentando pedido #${order.id}...`);
            order.preparationTime = order.preparationTime / 2; // Reducir tiempo en retry
            await processOrder(order);
        }, 2000);
    }
}

// Función para simular progreso visual
function simulateProgress(orderId, totalTime) {
    const progressBar = document.getElementById(`progress-${orderId}`);
    if (!progressBar) return;

    let progress = 0;
    const interval = totalTime / 100; // Actualizar 100 veces
    
    const progressInterval = setInterval(() => {
        progress += 1;
        progressBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(progressInterval);
        }
    }, interval);
}

// Función para actualizar estadísticas
function updateStats() {
    document.getElementById('totalOrders').textContent = totalOrders;
    document.getElementById('processingOrders').textContent = processingOrders;
    document.getElementById('completedOrders').textContent = completedOrders;
}

// Función para registrar eventos
function logEvent(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    
    const typePrefix = type === 'error' ? '[ERROR]' : '[INFO]';
    const color = type === 'error' ? '#ef4444' : '#10b981';
    
    logEntry.innerHTML = `<span style="color: #6c757d">${timestamp}</span> <span style="color: ${color}">${typePrefix}</span> ${message}`;
    eventLog.appendChild(logEntry);
    eventLog.scrollTop = eventLog.scrollHeight;
}

// Función para limpiar todo
function limpiarTodo() {
    orderList.innerHTML = '';
    eventLog.innerHTML = '<div>[INFO] Sistema reiniciado...</div>';
    
    // Resetear contadores
    orderId = 1;
    totalOrders = 0;
    processingOrders = 0;
    completedOrders = 0;
    updateStats();
    
    logEvent('Sistema limpiado y reiniciado');
}

// Demostración automática del Event Loop
setTimeout(() => {
    logEvent('Sistema listo para recibir pedidos');
}, 1000);

// Ejemplo de microtask vs macrotask
setTimeout(() => {
    logEvent('Macrotask: Verificación del sistema (setTimeout)');
}, 0);

Promise.resolve().then(() => {
    logEvent('Microtask: Inicialización completada (Promise)');
});

console.log('Event Loop Demo: Este mensaje aparece primero (código sincrónico)');
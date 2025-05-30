// Sistema de Reservas para Restaurante
// Uso de Promesas y Async/Await con manejo de errores

// Simulando una base de datos de mesas
const mesasDisponibles = 5; // Número de mesas disponibles para reservar

// Función que simula la verificación de disponibilidad de mesas
function verificarDisponibilidad(mesasSolicitadas) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Verificando disponibilidad para ${mesasSolicitadas} mesa(s)...`);
            console.log(`Mesas disponibles: ${mesasDisponibles}`);
            
            // Lógica de verificación
            if (mesasSolicitadas <= mesasDisponibles && mesasSolicitadas > 0) {
                resolve(`Hay ${mesasSolicitadas} mesa(s) disponible(s) para su reserva.`);
            } else if (mesasSolicitadas <= 0) {
                reject('Error: Debe solicitar al menos 1 mesa.');
            } else {
                reject(`Lo sentimos, solo tenemos ${mesasDisponibles} mesa(s) disponible(s). No podemos reservar ${mesasSolicitadas} mesa(s).`);
            }
        }, 2000); // Simula un retraso en la verificación (2 segundos)
    });
}

// Función que simula el envío de un correo de confirmación
function enviarConfirmacionReserva(nombreCliente) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Enviando confirmación por correo a ${nombreCliente}...`);
            
            // Simula éxito/fallo en el envío (70% probabilidad de éxito)
            const exito = Math.random() > 0.3;
            
            if (exito) {
                resolve(`Correo de confirmación enviado exitosamente a ${nombreCliente}.`);
            } else {
                reject(`Error al enviar el correo de confirmación a ${nombreCliente}. Intente nuevamente.`);
            }
        }, 1500); // Simula el envío de un correo (1.5 segundos)
    });
}

// Función principal para manejar una reserva
async function hacerReserva(nombreCliente, mesasSolicitadas) {
    try {
        console.log(`\nINICIANDO RESERVA PARA: ${nombreCliente}`);
        console.log("=" .repeat(50));
        
        // Paso 1: Verificar disponibilidad de mesas
        console.log("Verificando disponibilidad de mesas...");
        const disponibilidad = await verificarDisponibilidad(mesasSolicitadas);
        console.log(disponibilidad);
        
        // Paso 2: Si hay mesas disponibles, enviar confirmación
        console.log("\nEnviando confirmación por correo...");
        const confirmacion = await enviarConfirmacionReserva(nombreCliente);
        console.log(confirmacion);
        
        // Paso 3: Reserva completada exitosamente
        console.log("\nRESERVA COMPLETADA EXITOSAMENTE!");
        console.log(`Reserva confirmada para ${nombreCliente}`);
        console.log(`Mesas reservadas: ${mesasSolicitadas}`);
        console.log("=" .repeat(50));
        
    } catch (error) {
        console.log("\nERROR EN LA RESERVA:");
        console.log("Error:", error);
        console.log("Por favor, intente nuevamente o contacte al restaurante.");
        console.log("=" .repeat(50));
    }
}

// Función adicional para mostrar el estado del restaurante
function mostrarEstadoRestaurante() {
    console.log("\nESTADO DEL RESTAURANTE");
    console.log("=" .repeat(30));
    console.log(`Mesas disponibles: ${mesasDisponibles}`);
    console.log(`Horario de atención: 12:00 - 22:00`);
    console.log("=" .repeat(30));
}

// Función para ejecutar múltiples pruebas
async function ejecutarPruebas() {
    mostrarEstadoRestaurante();
    
    // Prueba 1: Reserva exitosa (dentro del límite)
    await hacerReserva("Juan Pérez", 3);
    
    // Pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Prueba 2: Reserva fallida (excede el límite)
    await hacerReserva("María García", 8);
    
    // Pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Prueba 3: Reserva con número inválido
    await hacerReserva("Carlos López", 0);
    
    // Pausa entre pruebas
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Prueba 4: Reserva en el límite exacto
    await hacerReserva("Ana Rodríguez", 5);
}

// Llamadas de prueba individuales
console.log("EJECUTANDO PRUEBAS DEL SISTEMA DE RESERVAS");
console.log("=" .repeat(60));

// Ejecutar todas las pruebas
ejecutarPruebas().then(() => {
    console.log("\nTodas las pruebas han sido completadas.");
}).catch((error) => {
    console.log("\nError durante las pruebas:", error);
});

// Exportar funciones para uso en otros módulos (si es necesario)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        verificarDisponibilidad,
        enviarConfirmacionReserva,
        hacerReserva,
        mostrarEstadoRestaurante
    };
}
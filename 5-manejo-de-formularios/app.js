// Funciones de validación
const validaciones = {
    validarNombre: function(nombre) {
        if (!nombre.trim()) {
            return "El nombre es obligatorio";
        }
        if (nombre.length < 2) {
            return "El nombre debe tener al menos 2 caracteres";
        }
        if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(nombre)) {
            return "El nombre solo puede contener letras y espacios";
        }
        return null;
    },

    validarCorreo: function(correo) {
        if (!correo.trim()) {
            return "El correo electrónico es obligatorio";
        }
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regexEmail.test(correo)) {
            return "Por favor ingrese un correo electrónico válido";
        }
        // Validación adicional: dominios comunes
        const dominiosComunes = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'yahoo.es'];
        const dominio = correo.split('@')[1];
        if (!dominiosComunes.includes(dominio) && !dominio.includes('.')) {
            return "Por favor verifique que el dominio del correo sea correcto";
        }
        return null;
    },

    validarTelefono: function(telefono) {
        if (!telefono.trim()) {
            return "El teléfono es obligatorio";
        }
        // Eliminar espacios, guiones y paréntesis para validar
        const telefonoLimpio = telefono.replace(/[\s\-\(\)\+]/g, '');
        if (!/^\d{10,}$/.test(telefonoLimpio)) {
            return "El teléfono debe tener al menos 10 dígitos";
        }
        if (telefonoLimpio.length > 15) {
            return "El teléfono no puede tener más de 15 dígitos";
        }
        return null;
    },

    validarEdad: function(edad) {
        if (!edad) {
            return "La edad es obligatoria";
        }
        
        const edadNumero = parseInt(edad);
        
        if (isNaN(edadNumero)) {
            return "La edad debe ser un número válido";
        }
        
        if (edadNumero < 16) {
            return "Debe ser mayor de 16 años para registrarse";
        }
        
        if (edadNumero > 99) {
            return "La edad no puede ser mayor a 99 años";
        }
        
        if (edadNumero <= 0) {
            return "La edad debe ser un número positivo";
        }
        
        return null;
    },

    validarFecha: function(fecha) {
        if (!fecha) {
            return "La fecha del evento es obligatoria";
        }
        const fechaSeleccionada = new Date(fecha);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        
        if (fechaSeleccionada <= hoy) {
            return "La fecha del evento debe ser posterior a hoy";
        }
        
        // Validar que no sea más de 1 año en el futuro
        const unAñoFuturo = new Date();
        unAñoFuturo.setFullYear(unAñoFuturo.getFullYear() + 1);
        
        if (fechaSeleccionada > unAñoFuturo) {
            return "La fecha no puede ser más de un año en el futuro";
        }
        
        return null;
    },

    validarArchivo: function(archivo) {
        if (!archivo || !archivo.files || archivo.files.length === 0) {
            return null; // El archivo es opcional
        }
        
        const file = archivo.files[0];
        const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        const tamañoMaximo = 5 * 1024 * 1024; // 5MB
        
        if (!tiposPermitidos.includes(file.type)) {
            return "Solo se permiten archivos JPG, PNG o PDF";
        }
        
        if (file.size > tamañoMaximo) {
            return "El archivo no puede superar los 5MB";
        }
        
        return null;
    }
};

// Función para mostrar errores
function mostrarError(campo, mensaje) {
    const errorElement = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
    if (errorElement) {
        errorElement.textContent = mensaje;
        errorElement.style.display = 'block';
    }
}

// Función para limpiar errores
function limpiarError(campo) {
    const errorElement = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

// Función para limpiar todos los errores
function limpiarTodosLosErrores() {
    const errores = document.querySelectorAll('.error-message');
    errores.forEach(error => error.style.display = 'none');
}

// Función para inicializar el formulario
function inicializarFormulario() {
    // Establecer fecha mínima como mañana
    const mañana = new Date();
    mañana.setDate(mañana.getDate() + 1);
    document.getElementById('fecha').min = mañana.toISOString().split('T')[0];

    // Event listeners para validación en tiempo real
    document.getElementById('nombre').addEventListener('blur', function() {
        const error = validaciones.validarNombre(this.value);
        if (error) {
            mostrarError('nombre', error);
        } else {
            limpiarError('nombre');
        }
    });

    document.getElementById('correo').addEventListener('blur', function() {
        const error = validaciones.validarCorreo(this.value);
        if (error) {
            mostrarError('correo', error);
        } else {
            limpiarError('correo');
        }
    });

    document.getElementById('telefono').addEventListener('blur', function() {
        const error = validaciones.validarTelefono(this.value);
        if (error) {
            mostrarError('telefono', error);
        } else {
            limpiarError('telefono');
        }
    });

    document.getElementById('edad').addEventListener('blur', function() {
        const error = validaciones.validarEdad(this.value);
        if (error) {
            mostrarError('edad', error);
        } else {
            limpiarError('edad');
        }
    });

    document.getElementById('fecha').addEventListener('change', function() {
        const error = validaciones.validarFecha(this.value);
        if (error) {
            mostrarError('fecha', error);
        } else {
            limpiarError('fecha');
        }
    });

    document.getElementById('archivo').addEventListener('change', function() {
        const error = validaciones.validarArchivo(this);
        if (error) {
            mostrarError('archivo', error);
        } else {
            limpiarError('archivo');
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                document.querySelector('.file-upload-label').textContent = `Archivo seleccionado: ${fileName}`;
            }
        }
    });

    // Manejo del envío del formulario
    document.getElementById('registroEvento').addEventListener('submit', function(event) {
        event.preventDefault();
        limpiarTodosLosErrores();
        
        let hayErrores = false;

        // Obtener valores
        const nombre = document.getElementById('nombre').value;
        const correo = document.getElementById('correo').value;
        const telefono = document.getElementById('telefono').value;
        const edad = document.getElementById('edad').value;
        const intereses = document.querySelectorAll('input[name="intereses"]:checked');
        const horario = document.querySelector('input[name="horario"]:checked');
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const archivo = document.getElementById('archivo');

        // Validar nombre
        const errorNombre = validaciones.validarNombre(nombre);
        if (errorNombre) {
            mostrarError('nombre', errorNombre);
            hayErrores = true;
        }

        // Validar correo
        const errorCorreo = validaciones.validarCorreo(correo);
        if (errorCorreo) {
            mostrarError('correo', errorCorreo);
            hayErrores = true;
        }

        // Validar teléfono
        const errorTelefono = validaciones.validarTelefono(telefono);
        if (errorTelefono) {
            mostrarError('telefono', errorTelefono);
            hayErrores = true;
        }

        // Validar edad
        const errorEdad = validaciones.validarEdad(edad);
        if (errorEdad) {
            mostrarError('edad', errorEdad);
            hayErrores = true;
        }

        // Validar intereses
        if (intereses.length === 0) {
            mostrarError('intereses', 'Debe seleccionar al menos un interés');
            hayErrores = true;
        }

        // Validar horario
        if (!horario) {
            mostrarError('horario', 'Debe seleccionar un horario preferido');
            hayErrores = true;
        }

        // Validar fecha
        const errorFecha = validaciones.validarFecha(fecha);
        if (errorFecha) {
            mostrarError('fecha', errorFecha);
            hayErrores = true;
        }

        // Validar hora
        if (!hora) {
            mostrarError('hora', 'La hora es obligatoria');
            hayErrores = true;
        }

        // Validar archivo
        const errorArchivo = validaciones.validarArchivo(archivo);
        if (errorArchivo) {
            mostrarError('archivo', errorArchivo);
            hayErrores = true;
        }

        // Si no hay errores, mostrar mensaje de éxito
        if (!hayErrores) {
            document.getElementById('successMessage').style.display = 'block';
            // Simular envío exitoso
            setTimeout(() => {
                alert('Registro exitoso. Se ha enviado un correo de confirmación a su dirección de email.');
                // Opcional: limpiar el formulario
                // this.reset();
                // document.getElementById('successMessage').style.display = 'none';
            }, 500);
            
            // Scroll hacia arriba para mostrar el mensaje
            document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
        } else {
            // Scroll hacia el primer error
            const primerError = document.querySelector('.error-message[style*="block"]');
            if (primerError) {
                primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', inicializarFormulario);
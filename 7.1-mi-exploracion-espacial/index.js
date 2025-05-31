const planetas = require('./planetas');
const cowsay = require('cowsay');

console.log('INICIANDO EXPLORACION ESPACIAL');
console.log('===============================');
console.log();

// Mostrar estadísticas generales
console.log('RESUMEN DE LA EXPEDICION:');
console.log(`Total de planetas descubiertos: ${planetas.length}`);
console.log();

// Recorrer y mostrar información de cada planeta
planetas.forEach((planeta, index) => {
  console.log(`Planeta ${planeta.nombre} descubierto!`);
  console.log(`Descripcion: ${planeta.descripcion}`);
  console.log(`Descubierto en: ${planeta.descubiertoEn}`);
  console.log(`Distancia: ${planeta.distancia}`);
  console.log(`Tipo: ${planeta.tipo}`);
  console.log(`Habitabilidad: ${planeta.habitabilidad}`);
  
  if (index < planetas.length - 1) {
    console.log('---');
  }
});

console.log();
console.log('MISION COMPLETADA CON EXITO');
console.log('Todos los descubrimientos han sido registrados');
console.log();

// Mostrar planetas habitables
const planetasHabitables = planetas.filter(planeta => 
  planeta.habitabilidad.toLowerCase().includes('habitable') || 
  planeta.habitabilidad.toLowerCase().includes('oceano')
);

if (planetasHabitables.length > 0) {
  console.log('PLANETAS CON POTENCIAL PARA LA VIDA:');
  planetasHabitables.forEach(planeta => {
    console.log(`- ${planeta.nombre} - ${planeta.habitabilidad}`);
  });
  console.log();
}

// Seleccionar un planeta aleatorio para cowsay
const planetaAleatorio = planetas[Math.floor(Math.random() * planetas.length)];

console.log('PLANETA DESTACADO DEL DIA:');
console.log('==========================');
console.log();

// Crear mensaje para cowsay
const mensaje = `Planeta: ${planetaAleatorio.nombre}\n${planetaAleatorio.descripcion}\nDescubierto: ${planetaAleatorio.descubiertoEn}`;

// Mostrar con cowsay
console.log(cowsay.say({
  text: mensaje,
  e: "oO",
  T: "U "
}));

console.log();
console.log('Ejecuta "npm run explorar" para ver otro planeta destacado');
console.log();
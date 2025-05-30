/**
 * Servicio para manejar solicitudes HTTP usando Fetch API
 * REST Countries API - Fetch Implementation
 */

class FetchService {
    constructor() {
        this.baseURL = 'https://restcountries.com/v3.1';
    }

    /**
     * Obtiene todos los países o países de una región específica
     * @param {string} region - Región opcional para filtrar países
     * @returns {Promise} - Promesa que resuelve con los datos de países
     */
    async getCountries(region = '') {
        try {
            // Construir URL según si hay región seleccionada
            let url = `${this.baseURL}/all`;
            if (region) {
                url = `${this.baseURL}/region/${region}`;
            }

            console.log(`🚀 Fetch: Realizando solicitud a ${url}`);

            // Realizar solicitud con fetch
            const response = await fetch(url);

            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }

            // Convertir respuesta a JSON
            const data = await response.json();

            console.log(`✅ Fetch: Datos obtenidos exitosamente`, data);

            // Limitar a 100 países para mejor rendimiento
            return data.slice(0, 100);

        } catch (error) {
            console.error('❌ Error en FetchService:', error);
            throw error;
        }
    }

    /**
     * Busca un país por nombre
     * @param {string} name - Nombre del país a buscar
     * @returns {Promise} - Promesa que resuelve con los datos del país
     */
    async getCountryByName(name) {
        try {
            const url = `${this.baseURL}/name/${name}`;
            console.log(`🚀 Fetch: Buscando país ${name}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`País no encontrado: ${response.status}`);
            }

            const data = await response.json();
            console.log(`✅ Fetch: País encontrado`, data);

            return data;

        } catch (error) {
            console.error('❌ Error buscando país:', error);
            throw error;
        }
    }

    /**
     * Obtiene países por código de país
     * @param {string} code - Código del país (alpha2 o alpha3)
     * @returns {Promise} - Promesa que resuelve con los datos del país
     */
    async getCountryByCode(code) {
        try {
            const url = `${this.baseURL}/alpha/${code}`;
            console.log(`🚀 Fetch: Buscando país por código ${code}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Código de país no válido: ${response.status}`);
            }

            const data = await response.json();
            console.log(`✅ Fetch: País encontrado por código`, data);

            return data;

        } catch (error) {
            console.error('❌ Error buscando país por código:', error);
            throw error;
        }
    }
}

// Crear instancia global del servicio Fetch
const fetchService = new FetchService();
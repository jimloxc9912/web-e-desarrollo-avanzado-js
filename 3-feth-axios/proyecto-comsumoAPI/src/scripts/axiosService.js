/**
 * Servicio para manejar solicitudes HTTP usando Axios
 * REST Countries API - Axios Implementation
 */

class AxiosService {
    constructor() {
        this.baseURL = 'https://restcountries.com/v3.1';
        
        // Configurar interceptores de Axios para logging
        this.setupInterceptors();
    }

    /**
     * Configura interceptores para request y response
     */
    setupInterceptors() {
        // Interceptor para requests
        axios.interceptors.request.use(
            (config) => {
                console.log(`🚀 Axios: Realizando solicitud a ${config.url}`);
                return config;
            },
            (error) => {
                console.error('❌ Error en request de Axios:', error);
                return Promise.reject(error);
            }
        );

        // Interceptor para responses
        axios.interceptors.response.use(
            (response) => {
                console.log(`✅ Axios: Respuesta exitosa`, response.data);
                return response;
            },
            (error) => {
                console.error('❌ Error en response de Axios:', error);
                return Promise.reject(error);
            }
        );
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

            // Realizar solicitud con axios
            const response = await axios.get(url, {
                timeout: 10000, // Timeout de 10 segundos
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            // Axios automáticamente parsea la respuesta JSON
            const data = response.data;

            // Limitar a 100 países para mejor rendimiento
            return data.slice(0, 100);

        } catch (error) {
            console.error('❌ Error en AxiosService:', error);
            
            // Manejar diferentes tipos de errores de Axios
            if (error.response) {
                // El servidor respondió con un código de error
                throw new Error(`Error del servidor: ${error.response.status} - ${error.response.statusText}`);
            } else if (error.request) {
                // La solicitud fue hecha pero no se recibió respuesta
                throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            } else {
                // Algo más causó el error
                throw new Error(`Error de configuración: ${error.message}`);
            }
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
            
            const response = await axios.get(url, {
                timeout: 5000,
                params: {
                    fullText: false // Búsqueda parcial
                }
            });

            return response.data;

        } catch (error) {
            console.error('❌ Error buscando país con Axios:', error);
            
            if (error.response?.status === 404) {
                throw new Error(`País "${name}" no encontrado`);
            }
            throw new Error(`Error buscando país: ${error.message}`);
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
            
            const response = await axios.get(url, {
                timeout: 5000
            });

            return response.data;

        } catch (error) {
            console.error('❌ Error buscando país por código con Axios:', error);
            
            if (error.response?.status === 404) {
                throw new Error(`Código de país "${code}" no válido`);
            }
            throw new Error(`Error buscando país por código: ${error.message}`);
        }
    }

    /**
     * Obtiene múltiples países por sus códigos
     * @param {Array} codes - Array de códigos de países
     * @returns {Promise} - Promesa que resuelve con los datos de los países
     */
    async getCountriesByCodes(codes) {
        try {
            const url = `${this.baseURL}/alpha`;
            
            const response = await axios.get(url, {
                timeout: 10000,
                params: {
                    codes: codes.join(',')
                }
            });

            return response.data;

        } catch (error) {
            console.error('❌ Error obteniendo países por códigos:', error);
            throw new Error(`Error obteniendo países: ${error.message}`);
        }
    }
}

// Crear instancia global del servicio Axios
const axiosService = new AxiosService();
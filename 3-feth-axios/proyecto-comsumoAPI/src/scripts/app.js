/**
 * Sistema de Consulta de Países - REST Countries API
 * Aplicación profesional para consulta y visualización de datos de países
 */

class CountriesApp {
    constructor() {
        // Referencias a elementos del DOM
        this.fetchBtn = document.getElementById('fetch-btn');
        this.axiosBtn = document.getElementById('axios-btn');
        this.dataContainer = document.getElementById('data-container');
        this.regionSelect = document.getElementById('region-select');
        this.statsBar = document.getElementById('stats-bar');
        this.countryCountEl = document.getElementById('country-count');
        this.regionCountEl = document.getElementById('region-count');
        
        // Estado de la aplicación
        this.currentData = [];
        this.currentMethod = null;
        
        // Inicializar la aplicación
        this.init();
    }

 
    init() {
        this.setupEventListeners();
        this.showWelcomeMessage();
        console.log('Sistema de Países inicializado correctamente');
    }

    setupEventListeners() {
        this.fetchBtn.addEventListener('click', () => {
            this.handleFetchRequest();
        });

        this.axiosBtn.addEventListener('click', () => {
            this.handleAxiosRequest();
        });

        this.regionSelect.addEventListener('change', () => {
            this.handleRegionChange();
        });
    }

    async handleFetchRequest() {
        try {
            this.toggleButtons(false);
            const selectedRegion = this.regionSelect.value;
            this.showLoading('Fetch API');
            
            const countries = await fetchService.getCountries(selectedRegion);
            this.currentData = countries;
            this.currentMethod = 'Fetch API';
            
            this.renderCountries(countries, 'Fetch API');
            this.updateStats(countries);
            
        } catch (error) {
            console.error('Error en consulta Fetch:', error);
            this.showError(`Error en la consulta: ${error.message}`);
        } finally {
            this.toggleButtons(true);
        }
    }


    async handleAxiosRequest() {
        try {
            this.toggleButtons(false);
            const selectedRegion = this.regionSelect.value;
            this.showLoading('Axios');
            
            const countries = await axiosService.getCountries(selectedRegion);
            this.currentData = countries;
            this.currentMethod = 'Axios';
            
            this.renderCountries(countries, 'Axios');
            this.updateStats(countries);
            
        } catch (error) {
            console.error('Error en consulta Axios:', error);
            this.showError(`Error en la consulta: ${error.message}`);
        } finally {
            this.toggleButtons(true);
        }
    }

    
    //cambio de región

    handleRegionChange() {
        const selectedRegion = this.regionSelect.value;
        const regionText = selectedRegion ? 
            this.getRegionDisplayName(selectedRegion) : 
            'Todas las regiones';
            
        this.dataContainer.innerHTML = `
            <div class="welcome-message">
                Región seleccionada: <strong>${regionText}</strong><br>
                Seleccione un método de consulta para visualizar los países
            </div>
        `;
        
        this.hideStats();
    }

    
    //obtiene el nombre de las regiones
    getRegionDisplayName(region) {
        const regions = {
            'africa': 'África',
            'americas': 'América',
            'asia': 'Asia',
            'europe': 'Europa',
            'oceania': 'Oceanía'
        };
        return regions[region] || 'Todas las regiones';
    }
    
    //Muestra indicador de carga 
    showLoading(method) {
        this.dataContainer.innerHTML = `
            <div class="loading">
                <div>Consultando base de datos de países...</div>
                <div style="font-size: 0.9rem; margin-top: 10px; opacity: 0.8;">
                    Método: ${method} | Fuente: REST Countries API
                </div>
            </div>
        `;
        this.hideStats();
    }

    //mensaje de error

    showError(message) {
        this.dataContainer.innerHTML = `
            <div class="error">
                <strong>Error en la consulta</strong><br>
                ${message}<br><br>
                <small>Verifique su conexión a internet y vuelva a intentar</small>
            </div>
        `;
        this.hideStats();
    }

    
    // Muestra mensaje de bienvenida 
    
    showWelcomeMessage() {
        this.dataContainer.innerHTML = `
            <div class="welcome-message">
                <strong>Sistema de Consulta de Países</strong><br><br>
                Utilice los controles superiores para consultar información oficial de países mediante REST Countries API<br><br>
                <small>Seleccione una región (opcional) y un método de consulta para comenzar</small>
            </div>
        `;
    }


    // Habilita/deshabilita los botones

    toggleButtons(enabled) {
        this.fetchBtn.disabled = !enabled;
        this.axiosBtn.disabled = !enabled;
    }

     // Actualiza las estadísticas

    updateStats(countries) {
        if (this.countryCountEl && this.regionCountEl && this.statsBar) {
            const regions = new Set(countries.map(country => country.region).filter(Boolean));
            
            this.countryCountEl.textContent = countries.length;
            this.regionCountEl.textContent = regions.size;
            this.statsBar.style.display = 'flex';
        }
    }

    
    //  Oculta las estadísticas

    hideStats() {
        if (this.statsBar) {
            this.statsBar.style.display = 'none';
        }
    }

    //Renderiza la lista de países 
    renderCountries(countries, method) {
        this.dataContainer.innerHTML = '';
        
        // Título del método
        const methodTitle = document.createElement('div');
        methodTitle.className = 'method-title';
        methodTitle.textContent = `Resultados obtenidos mediante ${method}`;
        this.dataContainer.appendChild(methodTitle);
        
        // Información de la consulta
        const queryInfo = document.createElement('div');
        queryInfo.style.cssText = `
            text-align: center;
            margin-bottom: 30px;
            color: #4a5568;
            font-size: 0.95rem;
        `;
        
        const regionText = this.regionSelect.value ? 
            this.getRegionDisplayName(this.regionSelect.value) : 
            'Todas las regiones';
            
        queryInfo.innerHTML = `
            <strong>${countries.length}</strong> países encontrados | 
            Región: <strong>${regionText}</strong> | 
            Método: <strong>${method}</strong>
        `;
        this.dataContainer.appendChild(queryInfo);
        
        // Contenedor de grid
        const gridContainer = document.createElement('div');
        gridContainer.className = 'countries-grid';
        
        // Generar tarjetas de países
        countries.forEach((country, index) => {
            const countryCard = this.createCountryCard(country, index);
            gridContainer.appendChild(countryCard);
        });
        
        this.dataContainer.appendChild(gridContainer);
        
        console.log(`${method}: ${countries.length} países renderizados`);
    }

    //Tarjeta de pais
    createCountryCard(country, index) {
        const countryElement = document.createElement('div');
        countryElement.className = 'country-card';
        
        // Extraer información del país de manera segura
        const data = this.extractCountryData(country);
        

        countryElement.innerHTML = `
            ${data.flag ? `<img src="${data.flag}" alt="Bandera de ${data.name}" class="country-flag" loading="lazy">` : ''}
            <div class="card-content">
                <h3 class="country-name">${data.name}</h3>
                <div class="country-info">
                    <p><strong>Capital:</strong> <span class="info-value">${data.capital}</span></p>
                    <p><strong>Población:</strong> <span class="info-value">${data.population}</span></p>
                    <p><strong>Región:</strong> <span class="info-value">${data.region}</span></p>
                    ${data.subregion !== 'No disponible' && data.subregion !== data.region ? `<p><strong>Subregión:</strong> <span class="info-value">${data.subregion}</span></p>` : ''}
                    <div class="info-divider"></div>
                    <p><strong>Área:</strong> <span class="info-value">${data.area}</span></p>
                    <p><strong>Moneda:</strong> <span class="info-value">${data.mainCurrency}</span></p>
                    <p><strong>Idioma:</strong> <span class="info-value">${data.mainLanguage}</span></p>
                </div>
            </div>
        `;
        
        // Aplicar animación escalonada
        countryElement.style.animationDelay = `${index * 0.03}s`;
        
        return countryElement;
    }

    //Extrae y formatea los datos del país

    extractCountryData(country) {
        const name = country.name?.common || 'Nombre no disponible';
        const officialName = country.name?.official || name;
        const capital = country.capital?.[0] || 'No disponible';
        const population = country.population ? 
            this.formatNumber(country.population) : 'No disponible';
        const region = country.region || 'No disponible';
        const subregion = country.subregion || 'No disponible';
        const flag = country.flags?.png || country.flags?.svg || '';
        const area = country.area ? 
            this.formatNumber(country.area) + ' km²' : 'No disponible';
        
        // Procesar moneda principal (solo la primera)
        let mainCurrency = 'No disponible';
        if (country.currencies) {
            const currencyArray = Object.values(country.currencies);
            if (currencyArray.length > 0) {
                const currency = currencyArray[0];
                const symbol = currency.symbol ? ` (${currency.symbol})` : '';
                mainCurrency = `${currency.name}${symbol}`;
            }
        }
        
        // Procesar idioma principal (solo el primero)
        let mainLanguage = 'No disponible';
        if (country.languages) {
            const languageArray = Object.values(country.languages);
            if (languageArray.length > 0) {
                mainLanguage = languageArray[0];
                if (languageArray.length > 1) {
                    mainLanguage += ` (+${languageArray.length - 1})`;
                }
            }
        }
        
        return {
            name,
            officialName,
            capital,
            population,
            region,
            subregion,
            flag,
            area,
            mainCurrency,
            mainLanguage
        };
    }

    //Formatea números con separadores de miles

    formatNumber(number) {
        return new Intl.NumberFormat('es-ES').format(number);
    }

    // Método para exportar datos (funcionalidad adicional)
    
    exportData() {
        if (this.currentData.length === 0) {
            console.warn('No hay datos para exportar');
            return;
        }
        
        const dataToExport = {
            method: this.currentMethod,
            region: this.regionSelect.value || 'all',
            timestamp: new Date().toISOString(),
            count: this.currentData.length,
            countries: this.currentData.map(country => ({
                name: country.name?.common,
                capital: country.capital?.[0],
                population: country.population,
                region: country.region
            }))
        };
        
        console.log('Datos exportados:', dataToExport);
        
        // Crear y descargar archivo JSON
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `countries-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('Iniciando Sistema de Consulta de Países...');
    window.countriesApp = new CountriesApp();
    
    // Agregar funcionalidad de exportación (opcional)
    window.exportData = () => window.countriesApp.exportData();
});
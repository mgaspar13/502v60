// ARQV30 Enhanced v2.0 - Analysis JavaScript

class AnalysisManager {
    constructor() {
        this.currentAnalysis = null;
        this.sessionId = this.generateSessionId();
        this.progressInterval = null;
        this.init();
    }

    init() {
        this.setupFormSubmission();
        this.setupKeyboardShortcuts();
        this.checkSystemStatus();
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    setupFormSubmission() {
        const form = document.getElementById('analysisForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.startAnalysis();
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter para analisar
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.startAnalysis();
            }
            
            // Ctrl+S para salvar
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                if (this.currentAnalysis) {
                    this.saveAnalysisLocally(this.currentAnalysis);
                }
            }
        });
    }

    async checkSystemStatus() {
        try {
            const response = await fetch('/api/app_status');
            const status = await response.json();
            
            this.updateStatusIndicator(status);
            this.updateSystemStatusBar(status);
            
        } catch (error) {
            console.error('Erro ao verificar status:', error);
            this.updateStatusIndicator({ status: 'error' });
        }
    }

    updateStatusIndicator(status) {
        const indicator = document.getElementById('statusIndicator');
        const statusText = document.getElementById('statusText');
        
        if (!indicator || !statusText) return;

        indicator.className = 'status-indicator';
        
        if (status.status === 'production' || status.status === 'development') {
            indicator.classList.add('online');
            statusText.textContent = 'Sistema Online';
        } else {
            indicator.classList.add('offline');
            statusText.textContent = 'Sistema Offline';
        }
    }

    updateSystemStatusBar(status) {
        const apiStatus = document.getElementById('apiStatus');
        const extractorStatus = document.getElementById('extractorStatus');
        
        if (apiStatus) {
            const services = status.services || {};
            const searchProviders = services.search_providers || {};
            
            apiStatus.innerHTML = `
                <i class="fas fa-cog"></i>
                <span>APIs: ${searchProviders.available || 0}/${searchProviders.total || 0}</span>
            `;
        }
        
        if (extractorStatus) {
            extractorStatus.innerHTML = `
                <i class="fas fa-download"></i>
                <span>Extratores: Ativos</span>
            `;
        }
    }

    async startAnalysis() {
        const formData = this.collectFormData();
        
        if (!this.validateFormData(formData)) {
            return;
        }

        try {
            // Adiciona session ID
            formData.session_id = this.sessionId;
            
            // Adiciona arquivos enviados
            const uploadedFiles = window.uploadManager ? window.uploadManager.getUploadedFiles() : [];
            formData.uploaded_files = uploadedFiles;

            this.showProgressSection();
            this.startProgressTracking();

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok && result) {
                this.currentAnalysis = result;
                this.hideProgressSection();
                this.displayResults(result);
                this.showSuccess('Análise concluída com sucesso!');
            } else {
                this.hideProgressSection();
                this.showError(result.error || 'Erro na análise');
                console.error('Erro na análise:', result);
            }

        } catch (error) {
            this.hideProgressSection();
            this.showError('Erro de conexão: ' + error.message);
            console.error('Erro na análise:', error);
        }
    }

    collectFormData() {
        const form = document.getElementById('analysisForm');
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        return data;
    }

    validateFormData(data) {
        if (!data.segmento || data.segmento.trim().length < 3) {
            this.showError('Segmento de mercado é obrigatório (mínimo 3 caracteres)');
            return false;
        }

        return true;
    }

    showProgressSection() {
        const progressArea = document.getElementById('progressArea');
        if (progressArea) {
            progressArea.style.display = 'block';
            progressArea.scrollIntoView({ behavior: 'smooth' });
        }

        // Desabilita botão de análise
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = true;
            analyzeBtn.classList.add('loading');
            analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Analisando...</span>';
        }
    }

    hideProgressSection() {
        const progressArea = document.getElementById('progressArea');
        if (progressArea) {
            progressArea.style.display = 'none';
        }

        // Reabilita botão de análise
        const analyzeBtn = document.getElementById('analyzeBtn');
        if (analyzeBtn) {
            analyzeBtn.disabled = false;
            analyzeBtn.classList.remove('loading');
            analyzeBtn.innerHTML = '<i class="fas fa-magic"></i> <span>Gerar Análise Ultra-Detalhada</span>';
        }

        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    startProgressTracking() {
        let progress = 0;
        let step = 0;
        const steps = [
            "🔍 Coletando dados do formulário",
            "📊 Processando anexos inteligentes", 
            "🌐 Realizando pesquisa profunda massiva",
            "🧠 Analisando com múltiplas IAs",
            "👤 Criando avatar arqueológico completo",
            "🧠 Gerando drivers mentais customizados",
            "🎭 Desenvolvendo provas visuais instantâneas",
            "🛡️ Construindo sistema anti-objeção",
            "🎯 Arquitetando pré-pitch invisível",
            "⚔️ Mapeando concorrência profunda",
            "📈 Calculando métricas e projeções",
            "🔮 Predizendo futuro do mercado",
            "✨ Consolidando insights exclusivos"
        ];

        this.progressInterval = setInterval(() => {
            if (progress < 95) {
                progress += Math.random() * 3;
                step = Math.min(Math.floor(progress / 8), steps.length - 1);
                
                this.updateProgress(progress, step, steps[step]);
            }
        }, 2000);
    }

    updateProgress(percentage, stepIndex, stepMessage) {
        const progressFill = document.querySelector('.progress-fill');
        const currentStep = document.getElementById('currentStep');
        const stepCounter = document.getElementById('stepCounter');
        const estimatedTime = document.getElementById('estimatedTime');

        if (progressFill) {
            progressFill.style.width = Math.min(percentage, 100) + '%';
        }

        if (currentStep) {
            currentStep.textContent = stepMessage;
        }

        if (stepCounter) {
            stepCounter.textContent = `${stepIndex + 1}/13`;
        }

        if (estimatedTime) {
            const remaining = Math.max(0, Math.floor((100 - percentage) / 2));
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            estimatedTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    displayResults(analysis) {
        const resultsArea = document.getElementById('resultsArea');
        if (!resultsArea) return;

        resultsArea.style.display = 'block';
        resultsArea.scrollIntoView({ behavior: 'smooth' });

        // Limpa resultados anteriores
        this.clearPreviousResults();

        // Exibe cada seção
        this.displayAvatar(analysis.avatar_ultra_detalhado);
        this.displayDrivers(analysis.drivers_mentais_customizados);
        this.displayVisualProofs(analysis.provas_visuais_instantaneas);
        this.displayAntiObjection(analysis.sistema_anti_objecao);
        this.displayPrePitch(analysis.pre_pitch_invisivel);
        this.displayPositioning(analysis.escopo);
        this.displayCompetition(analysis.analise_concorrencia_detalhada);
        this.displayKeywords(analysis.estrategia_palavras_chave);
        this.displayMetrics(analysis.metricas_performance_detalhadas);
        this.displayFunnel(analysis.funil_vendas_detalhado);
        this.displayActionPlan(analysis.plano_acao_detalhado);
        this.displayInsights(analysis.insights_exclusivos);
        this.displayFuturePredictions(analysis.predicoes_futuro_completas);
        this.displayResearch(analysis.pesquisa_web_massiva);
        this.displayMetadata(analysis.metadata);

        // Habilita botões de ação
        this.enableResultActions();
    }

    clearPreviousResults() {
        const containers = [
            'avatarResults', 'driversResults', 'visualProofsResults', 'antiObjectionResults',
            'prePitchResults', 'positioningResults', 'competitionResults', 'keywordsResults',
            'metricsResults', 'funnelResults', 'actionPlanResults', 'insightsResults',
            'futureResults', 'researchResults', 'metadataResults'
        ];

        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
            }
        });
    }

    displayAvatar(avatarData) {
        if (!avatarData) return;

        const container = document.getElementById('avatarResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-user-circle"></i>
                    <h4>Avatar Ultra-Detalhado</h4>
                </div>
                <div class="result-section-content">
                    <div class="avatar-grid">
        `;

        // Perfil Demográfico
        if (avatarData.perfil_demografico) {
            html += `
                <div class="avatar-card">
                    <h5><i class="fas fa-chart-pie"></i> Perfil Demográfico</h5>
            `;
            
            for (const [key, value] of Object.entries(avatarData.perfil_demografico)) {
                html += `
                    <div class="avatar-item">
                        <span class="avatar-label">${key.replace(/_/g, ' ')}</span>
                        <span class="avatar-value">${value}</span>
                    </div>
                `;
            }
            html += `</div>`;
        }

        // Perfil Psicográfico
        if (avatarData.perfil_psicografico) {
            html += `
                <div class="avatar-card">
                    <h5><i class="fas fa-brain"></i> Perfil Psicográfico</h5>
            `;
            
            for (const [key, value] of Object.entries(avatarData.perfil_psicografico)) {
                html += `
                    <div class="avatar-item">
                        <span class="avatar-label">${key.replace(/_/g, ' ')}</span>
                        <span class="avatar-value">${value}</span>
                    </div>
                `;
            }
            html += `</div>`;
        }

        html += `</div>`;

        // Dores Viscerais
        if (avatarData.dores_viscerais && Array.isArray(avatarData.dores_viscerais)) {
            html += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="expandable-title">
                            <i class="fas fa-exclamation-triangle"></i>
                            Dores Viscerais (${avatarData.dores_viscerais.length})
                        </div>
                        <i class="fas fa-chevron-down expandable-icon"></i>
                    </div>
                    <div class="expandable-content">
                        <ul class="insight-list">
            `;
            
            avatarData.dores_viscerais.forEach(dor => {
                html += `
                    <li class="insight-item">
                        <i class="fas fa-arrow-right"></i>
                        <span class="insight-text">${dor}</span>
                    </li>
                `;
            });
            
            html += `</ul></div></div>`;
        }

        // Desejos Secretos
        if (avatarData.desejos_secretos && Array.isArray(avatarData.desejos_secretos)) {
            html += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="expandable-title">
                            <i class="fas fa-heart"></i>
                            Desejos Secretos (${avatarData.desejos_secretos.length})
                        </div>
                        <i class="fas fa-chevron-down expandable-icon"></i>
                    </div>
                    <div class="expandable-content">
                        <ul class="insight-list">
            `;
            
            avatarData.desejos_secretos.forEach(desejo => {
                html += `
                    <li class="insight-item">
                        <i class="fas fa-star"></i>
                        <span class="insight-text">${desejo}</span>
                    </li>
                `;
            });
            
            html += `</ul></div></div>`;
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }

    displayDrivers(driversData) {
        if (!driversData) return;

        const container = document.getElementById('driversResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-brain"></i>
                    <h4>Drivers Mentais Customizados</h4>
                </div>
                <div class="result-section-content">
        `;

        // Drivers Customizados
        if (driversData.drivers_customizados && Array.isArray(driversData.drivers_customizados)) {
            html += `<div class="drivers-grid">`;
            
            driversData.drivers_customizados.forEach((driver, index) => {
                html += `
                    <div class="driver-card">
                        <h4>Driver ${index + 1}: ${driver.nome || 'Driver Mental'}</h4>
                        <div class="driver-content">
                            <p><strong>Gatilho Central:</strong> ${driver.gatilho_central || 'N/A'}</p>
                            <p><strong>Definição:</strong> ${driver.definicao_visceral || 'N/A'}</p>
                `;
                
                if (driver.roteiro_ativacao) {
                    html += `
                        <div class="driver-script">
                            <h6>Roteiro de Ativação</h6>
                            <p><strong>Pergunta:</strong> ${driver.roteiro_ativacao.pergunta_abertura || 'N/A'}</p>
                            <p><strong>História:</strong> ${driver.roteiro_ativacao.historia_analogia || 'N/A'}</p>
                            <p><strong>Comando:</strong> ${driver.roteiro_ativacao.comando_acao || 'N/A'}</p>
                        </div>
                    `;
                }
                
                if (driver.frases_ancoragem && Array.isArray(driver.frases_ancoragem)) {
                    html += `
                        <div class="anchor-phrases">
                            <h6>Frases de Ancoragem</h6>
                            <ul>
                    `;
                    driver.frases_ancoragem.forEach(frase => {
                        html += `<li>"${frase}"</li>`;
                    });
                    html += `</ul></div>`;
                }
                
                html += `</div></div>`;
            });
            
            html += `</div>`;
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }

    displayVisualProofs(proofsData) {
        if (!proofsData || !Array.isArray(proofsData)) return;

        const container = document.getElementById('visualProofsResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-eye"></i>
                    <h4>Provas Visuais Instantâneas</h4>
                </div>
                <div class="result-section-content">
                    <div class="insights-showcase">
        `;

        proofsData.forEach((prova, index) => {
            html += `
                <div class="insight-card">
                    <div class="insight-number">${index + 1}</div>
                    <div class="insight-content">
                        <h5>${prova.nome || 'Prova Visual'}</h5>
                        <p><strong>Conceito:</strong> ${prova.conceito_alvo || 'N/A'}</p>
                        <p><strong>Experimento:</strong> ${prova.experimento || 'N/A'}</p>
            `;
            
            if (prova.materiais && Array.isArray(prova.materiais)) {
                html += `
                    <p><strong>Materiais:</strong></p>
                    <ul>
                `;
                prova.materiais.forEach(material => {
                    html += `<li>${material}</li>`;
                });
                html += `</ul>`;
            }
            
            html += `</div></div>`;
        });

        html += `</div></div></div>`;
        container.innerHTML = html;
    }

    displayAntiObjection(antiObjectionData) {
        if (!antiObjectionData) return;

        const container = document.getElementById('antiObjectionResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-shield-alt"></i>
                    <h4>Sistema Anti-Objeção</h4>
                </div>
                <div class="result-section-content">
        `;

        // Objeções Universais
        if (antiObjectionData.objecoes_universais) {
            html += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="expandable-title">
                            <i class="fas fa-universal-access"></i>
                            Objeções Universais
                        </div>
                        <i class="fas fa-chevron-down expandable-icon"></i>
                    </div>
                    <div class="expandable-content">
            `;
            
            for (const [tipo, objecao] of Object.entries(antiObjectionData.objecoes_universais)) {
                html += `
                    <div class="info-card">
                        <strong>${tipo.toUpperCase()}</strong>
                        <span>Objeção: ${objecao.objecao || 'N/A'}</span>
                        <span>Contra-ataque: ${objecao.contra_ataque || 'N/A'}</span>
                `;
                
                if (objecao.scripts_customizados && Array.isArray(objecao.scripts_customizados)) {
                    html += `<ul>`;
                    objecao.scripts_customizados.forEach(script => {
                        html += `<li>${script}</li>`;
                    });
                    html += `</ul>`;
                }
                
                html += `</div>`;
            }
            
            html += `</div></div>`;
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }

    displayPrePitch(prePitchData) {
        if (!prePitchData) return;

        const container = document.getElementById('prePitchResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-bullseye"></i>
                    <h4>Pré-Pitch Invisível</h4>
                </div>
                <div class="result-section-content">
        `;

        // Roteiro Completo
        if (prePitchData.roteiro_completo) {
            html += `
                <div class="expandable-section expanded">
                    <div class="expandable-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="expandable-title">
                            <i class="fas fa-script"></i>
                            Roteiro Completo
                        </div>
                        <i class="fas fa-chevron-down expandable-icon"></i>
                    </div>
                    <div class="expandable-content">
            `;
            
            for (const [secao, dados] of Object.entries(prePitchData.roteiro_completo)) {
                html += `
                    <div class="info-card">
                        <strong>${secao.replace(/_/g, ' ').toUpperCase()}</strong>
                `;
                
                if (typeof dados === 'object') {
                    for (const [key, value] of Object.entries(dados)) {
                        html += `<span><strong>${key.replace(/_/g, ' ')}:</strong> ${value}</span>`;
                    }
                } else {
                    html += `<span>${dados}</span>`;
                }
                
                html += `</div>`;
            }
            
            html += `</div></div>`;
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }

    displayPositioning(positioningData) {
        if (!positioningData) return;

        const container = document.getElementById('positioningResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-crosshairs"></i>
                    <h4>Escopo e Posicionamento</h4>
                </div>
                <div class="result-section-content">
        `;

        if (positioningData.posicionamento_mercado) {
            html += `
                <div class="info-card">
                    <strong>Posicionamento no Mercado</strong>
                    <span>${positioningData.posicionamento_mercado}</span>
                </div>
            `;
        }

        if (positioningData.proposta_valor) {
            html += `
                <div class="info-card">
                    <strong>Proposta de Valor</strong>
                    <span>${positioningData.proposta_valor}</span>
                </div>
            `;
        }

        if (positioningData.diferenciais_competitivos && Array.isArray(positioningData.diferenciais_competitivos)) {
            html += `
                <div class="info-card">
                    <strong>Diferenciais Competitivos</strong>
                    <ul>
            `;
            positioningData.diferenciais_competitivos.forEach(diferencial => {
                html += `<li>${diferencial}</li>`;
            });
            html += `</ul></div>`;
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }

    displayCompetition(competitionData) {
        if (!competitionData || !Array.isArray(competitionData)) return;

        const container = document.getElementById('competitionResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-chess"></i>
                    <h4>Análise de Concorrência</h4>
                </div>
                <div class="result-section-content">
                    <table class="competition-table">
                        <thead>
                            <tr>
                                <th>Concorrente</th>
                                <th>Forças</th>
                                <th>Fraquezas</th>
                                <th>Estratégia</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        competitionData.forEach(competitor => {
            const forcas = competitor.analise_swot?.forcas || [];
            const fraquezas = competitor.analise_swot?.fraquezas || [];
            
            html += `
                <tr>
                    <td class="competitor-name">${competitor.nome || 'Concorrente'}</td>
                    <td class="competitor-strengths">${forcas.slice(0, 3).join(', ')}</td>
                    <td class="competitor-weaknesses">${fraquezas.slice(0, 3).join(', ')}</td>
                    <td>${competitor.estrategia_marketing || 'N/A'}</td>
                </tr>
            `;
        });

        html += `</tbody></table></div></div>`;
        container.innerHTML = html;
    }

    displayKeywords(keywordsData) {
        if (!keywordsData) return;

        const container = document.getElementById('keywordsResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-key"></i>
                    <h4>Estratégia de Palavras-Chave</h4>
                </div>
                <div class="result-section-content">
        `;

        // Palavras primárias
        if (keywordsData.palavras_primarias && Array.isArray(keywordsData.palavras_primarias)) {
            html += `
                <div class="info-card">
                    <strong>Palavras-Chave Primárias</strong>
                    <div class="keyword-tags">
            `;
            keywordsData.palavras_primarias.forEach(keyword => {
                html += `<span class="keyword-tag">${keyword}</span>`;
            });
            html += `</div></div>`;
        }

        // Palavras secundárias
        if (keywordsData.palavras_secundarias && Array.isArray(keywordsData.palavras_secundarias)) {
            html += `
                <div class="info-card">
                    <strong>Palavras-Chave Secundárias</strong>
                    <div class="keyword-tags">
            `;
            keywordsData.palavras_secundarias.slice(0, 20).forEach(keyword => {
                html += `<span class="keyword-tag secondary">${keyword}</span>`;
            });
            html += `</div></div>`;
        }

        // Long tail
        if (keywordsData.long_tail && Array.isArray(keywordsData.long_tail)) {
            html += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="expandable-title">
                            <i class="fas fa-list"></i>
                            Palavras-Chave Long Tail (${keywordsData.long_tail.length})
                        </div>
                        <i class="fas fa-chevron-down expandable-icon"></i>
                    </div>
                    <div class="expandable-content">
                        <div class="keyword-tags">
            `;
            keywordsData.long_tail.forEach(keyword => {
                html += `<span class="keyword-tag long-tail">${keyword}</span>`;
            });
            html += `</div></div></div>`;
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }

    displayMetrics(metricsData) {
        if (!metricsData) return;

        const container = document.getElementById('metricsResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-chart-line"></i>
                    <h4>Métricas de Performance</h4>
                </div>
                <div class="result-section-content">
        `;

        // KPIs principais
        if (metricsData.kpis_principais && Array.isArray(metricsData.kpis_principais)) {
            html += `<div class="metrics-grid">`;
            
            metricsData.kpis_principais.forEach(kpi => {
                html += `
                    <div class="metric-card">
                        <div class="metric-icon">
                            <i class="fas fa-bullseye"></i>
                        </div>
                        <div class="metric-title">${kpi.metrica || 'Métrica'}</div>
                        <div class="metric-value">${kpi.objetivo || 'N/A'}</div>
                        <div class="metric-description">${kpi.frequencia || 'N/A'}</div>
                    </div>
                `;
            });
            
            html += `</div>`;
        }

        // Projeções financeiras
        if (metricsData.projecoes_financeiras) {
            html += `
                <table class="projections-table">
                    <thead>
                        <tr>
                            <th>Cenário</th>
                            <th>Receita Mensal</th>
                            <th>Clientes/Mês</th>
                            <th>Ticket Médio</th>
                            <th>Margem</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            
            const cenarios = ['cenario_conservador', 'cenario_realista', 'cenario_otimista'];
            const labels = ['Conservador', 'Realista', 'Otimista'];
            const classes = ['scenario-conservative', 'scenario-realistic', 'scenario-optimistic'];
            
            cenarios.forEach((cenario, index) => {
                const dados = metricsData.projecoes_financeiras[cenario];
                if (dados) {
                    html += `
                        <tr class="${classes[index]}">
                            <td class="scenario-label">${labels[index]}</td>
                            <td>${dados.receita_mensal || 'N/A'}</td>
                            <td>${dados.clientes_mes || 'N/A'}</td>
                            <td>${dados.ticket_medio || 'N/A'}</td>
                            <td>${dados.margem_lucro || 'N/A'}</td>
                        </tr>
                    `;
                }
            });
            
            html += `</tbody></table>`;
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }

    displayFunnel(funnelData) {
        if (!funnelData) return;

        const container = document.getElementById('funnelResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-filter"></i>
                    <h4>Funil de Vendas Detalhado</h4>
                </div>
                <div class="result-section-content">
        `;

        const fases = ['topo_funil', 'meio_funil', 'fundo_funil'];
        const labels = ['Topo do Funil', 'Meio do Funil', 'Fundo do Funil'];
        const icons = ['fas fa-users', 'fas fa-user-friends', 'fas fa-user-check'];

        fases.forEach((fase, index) => {
            const dados = funnelData[fase];
            if (dados) {
                html += `
                    <div class="info-card">
                        <strong><i class="${icons[index]}"></i> ${labels[index]}</strong>
                        <span><strong>Objetivo:</strong> ${dados.objetivo || 'N/A'}</span>
                `;
                
                if (dados.estrategias && Array.isArray(dados.estrategias)) {
                    html += `<span><strong>Estratégias:</strong></span><ul>`;
                    dados.estrategias.forEach(estrategia => {
                        html += `<li>${estrategia}</li>`;
                    });
                    html += `</ul>`;
                }
                
                html += `</div>`;
            }
        });

        html += `</div></div>`;
        container.innerHTML = html;
    }

    displayActionPlan(actionPlanData) {
        if (!actionPlanData) return;

        const container = document.getElementById('actionPlanResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-tasks"></i>
                    <h4>Plano de Ação Detalhado</h4>
                </div>
                <div class="result-section-content">
                    <div class="action-timeline">
        `;

        const fases = Object.keys(actionPlanData);
        
        fases.forEach((fase, index) => {
            const dados = actionPlanData[fase];
            if (dados && typeof dados === 'object') {
                html += `
                    <div class="timeline-item">
                        <div class="timeline-marker"></div>
                        <div class="timeline-content">
                            <div class="timeline-title">
                                ${fase.replace(/_/g, ' ').toUpperCase()}
                                <span class="timeline-duration">${dados.duracao || 'N/A'}</span>
                            </div>
                `;
                
                if (dados.atividades && Array.isArray(dados.atividades)) {
                    html += `<div class="timeline-activities">`;
                    dados.atividades.forEach(atividade => {
                        html += `
                            <div class="timeline-activity">
                                <i class="fas fa-check"></i>
                                <span>${atividade}</span>
                            </div>
                        `;
                    });
                    html += `</div>`;
                }
                
                if (dados.investimento) {
                    html += `<p><strong>Investimento:</strong> ${dados.investimento}</p>`;
                }
                
                html += `</div></div>`;
            }
        });

        html += `</div></div></div>`;
        container.innerHTML = html;
    }

    displayInsights(insightsData) {
        if (!insightsData || !Array.isArray(insightsData)) return;

        const container = document.getElementById('insightsResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-lightbulb"></i>
                    <h4>Insights Exclusivos (${insightsData.length})</h4>
                </div>
                <div class="result-section-content">
                    <div class="insights-showcase">
        `;

        insightsData.forEach((insight, index) => {
            html += `
                <div class="insight-card">
                    <div class="insight-number">${index + 1}</div>
                    <div class="insight-content">${insight}</div>
                </div>
            `;
        });

        html += `</div></div></div>`;
        container.innerHTML = html;
    }

    displayFuturePredictions(futureData) {
        if (!futureData) return;

        const container = document.getElementById('futureResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-crystal-ball"></i>
                    <h4>Predições do Futuro</h4>
                </div>
                <div class="result-section-content">
        `;

        // Tendências atuais
        if (futureData.tendencias_atuais) {
            html += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="expandable-title">
                            <i class="fas fa-trending-up"></i>
                            Tendências Atuais
                        </div>
                        <i class="fas fa-chevron-down expandable-icon"></i>
                    </div>
                    <div class="expandable-content">
            `;
            
            const tendencias = futureData.tendencias_atuais.tendencias_relevantes || {};
            for (const [nome, dados] of Object.entries(tendencias)) {
                html += `
                    <div class="info-card">
                        <strong>${nome.replace(/_/g, ' ').toUpperCase()}</strong>
                        <span><strong>Fase:</strong> ${dados.fase_atual || 'N/A'}</span>
                        <span><strong>Impacto:</strong> ${dados.impacto_esperado || 'N/A'}</span>
                        <span><strong>Timeline:</strong> ${dados.timeline || 'N/A'}</span>
                    </div>
                `;
            }
            
            html += `</div></div>`;
        }

        // Oportunidades emergentes
        if (futureData.oportunidades_emergentes && Array.isArray(futureData.oportunidades_emergentes)) {
            html += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="expandable-title">
                            <i class="fas fa-rocket"></i>
                            Oportunidades Emergentes (${futureData.oportunidades_emergentes.length})
                        </div>
                        <i class="fas fa-chevron-down expandable-icon"></i>
                    </div>
                    <div class="expandable-content">
            `;
            
            futureData.oportunidades_emergentes.forEach(oportunidade => {
                html += `
                    <div class="info-card">
                        <strong>${oportunidade.nome || 'Oportunidade'}</strong>
                        <span>${oportunidade.descricao || 'N/A'}</span>
                        <span><strong>Potencial:</strong> ${oportunidade.potencial_mercado || 'N/A'}</span>
                        <span><strong>Timeline:</strong> ${oportunidade.timeline || 'N/A'}</span>
                        <span><strong>ROI:</strong> ${oportunidade.roi_esperado || 'N/A'}</span>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }

    displayResearch(researchData) {
        if (!researchData) return;

        const container = document.getElementById('researchResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-search"></i>
                    <h4>Pesquisa Web Massiva</h4>
                </div>
                <div class="result-section-content">
                    <div class="research-content">
        `;

        // Estatísticas da pesquisa
        if (researchData.estatisticas) {
            html += `
                <div class="research-stats">
                    <h5>Estatísticas da Pesquisa</h5>
                    <div class="stats-grid">
            `;
            
            for (const [key, value] of Object.entries(researchData.estatisticas)) {
                html += `
                    <div class="stat-item">
                        <span class="stat-label">${key.replace(/_/g, ' ')}</span>
                        <span class="stat-value">${value}</span>
                    </div>
                `;
            }
            
            html += `</div></div>`;
        }

        // Queries executadas
        if (researchData.queries_executadas && Array.isArray(researchData.queries_executadas)) {
            html += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="expandable-title">
                            <i class="fas fa-search"></i>
                            Queries Executadas (${researchData.queries_executadas.length})
                        </div>
                        <i class="fas fa-chevron-down expandable-icon"></i>
                    </div>
                    <div class="expandable-content">
                        <ul class="insight-list">
            `;
            
            researchData.queries_executadas.forEach(query => {
                html += `
                    <li class="insight-item">
                        <i class="fas fa-search"></i>
                        <span class="insight-text">${query}</span>
                    </li>
                `;
            });
            
            html += `</ul></div></div>`;
        }

        // Fontes consultadas
        if (researchData.fontes && Array.isArray(researchData.fontes)) {
            html += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="expandable-title">
                            <i class="fas fa-link"></i>
                            Fontes Consultadas (${researchData.fontes.length})
                        </div>
                        <i class="fas fa-chevron-down expandable-icon"></i>
                    </div>
                    <div class="expandable-content">
                        <div class="results-list">
            `;
            
            researchData.fontes.slice(0, 20).forEach(fonte => {
                html += `
                    <div class="result-item">
                        <h5>${fonte.title || 'Sem título'}</h5>
                        <div class="result-url">${fonte.url || 'N/A'}</div>
                    </div>
                `;
            });
            
            html += `</div></div></div>`;
        }

        html += `</div></div></div>`;
        container.innerHTML = html;
    }

    displayMetadata(metadataData) {
        if (!metadataData) return;

        const container = document.getElementById('metadataResults');
        if (!container) return;

        let html = `
            <div class="result-section">
                <div class="result-section-header">
                    <i class="fas fa-info-circle"></i>
                    <h4>Informações da Análise</h4>
                </div>
                <div class="result-section-content">
        `;

        // Indicador de qualidade dos dados
        html += `
            <div class="data-quality-indicator">
                <span class="quality-label">Qualidade dos Dados:</span>
                <span class="quality-value real-data">100% DADOS REAIS</span>
            </div>
        `;

        // Metadata grid
        html += `<div class="metadata-grid">`;
        
        const metadataItems = [
            { label: 'Tempo de Processamento', value: metadataData.processing_time_formatted || 'N/A' },
            { label: 'Engine de Análise', value: metadataData.analysis_engine || 'N/A' },
            { label: 'Gerado em', value: metadataData.generated_at ? new Date(metadataData.generated_at).toLocaleString('pt-BR') : 'N/A' },
            { label: 'Score de Qualidade', value: metadataData.quality_score ? `${metadataData.quality_score}%` : 'N/A' },
            { label: 'Fontes de Dados', value: metadataData.real_data_sources || 'N/A' },
            { label: 'Conteúdo Analisado', value: metadataData.total_content_analyzed ? `${metadataData.total_content_analyzed.toLocaleString()} chars` : 'N/A' }
        ];
        
        metadataItems.forEach(item => {
            html += `
                <div class="metadata-item">
                    <span class="metadata-label">${item.label}</span>
                    <span class="metadata-value">${item.value}</span>
                </div>
            `;
        });
        
        html += `</div>`;

        // Informações de arquivos locais
        if (metadataData.local_files) {
            html += `
                <div class="expandable-section">
                    <div class="expandable-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="expandable-title">
                            <i class="fas fa-folder"></i>
                            Arquivos Locais Salvos (${metadataData.local_files.files_created || 0})
                        </div>
                        <i class="fas fa-chevron-down expandable-icon"></i>
                    </div>
                    <div class="expandable-content">
                        <p>Análise salva em arquivos TXT separados:</p>
                        <ul class="insight-list">
            `;
            
            if (metadataData.local_files.files && Array.isArray(metadataData.local_files.files)) {
                metadataData.local_files.files.forEach(file => {
                    html += `
                        <li class="insight-item">
                            <i class="fas fa-file-alt"></i>
                            <span class="insight-text">${file.name} (${file.type}) - ${(file.size / 1024).toFixed(1)} KB</span>
                        </li>
                    `;
                });
            }
            
            html += `</ul></div></div>`;
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }

    enableResultActions() {
        const downloadPdfBtn = document.getElementById('downloadPdfBtn');
        const saveJsonBtn = document.getElementById('saveJsonBtn');

        if (downloadPdfBtn) {
            downloadPdfBtn.style.display = 'inline-flex';
            downloadPdfBtn.onclick = () => this.downloadPDF();
        }

        if (saveJsonBtn) {
            saveJsonBtn.style.display = 'inline-flex';
        }
    }

    async downloadPDF() {
        if (!this.currentAnalysis) {
            this.showError('Nenhuma análise disponível para download');
            return;
        }

        try {
            const response = await fetch('/api/generate_pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.currentAnalysis)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `analise_mercado_${new Date().toISOString().slice(0, 10)}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                this.showSuccess('PDF baixado com sucesso!');
            } else {
                this.showError('Erro ao gerar PDF');
            }

        } catch (error) {
            this.showError('Erro ao baixar PDF: ' + error.message);
        }
    }

    saveAnalysisLocally(analysis) {
        if (!analysis) {
            this.showError('Nenhuma análise disponível para salvar');
            return;
        }

        const dataStr = JSON.stringify(analysis, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `analise_${analysis.metadata?.generated_at?.slice(0, 10) || new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.showSuccess('Análise salva localmente!');
    }

    // Métodos de teste
    async testExtraction() {
        try {
            const response = await fetch('/api/test_extraction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: 'https://g1.globo.com/tecnologia/' })
            });
            
            const result = await response.json();
            console.log('Teste de Extração:', result);
            
            if (result.success) {
                this.showSuccess(`Extração OK: ${result.content_length} caracteres`);
            } else {
                this.showError(`Extração falhou: ${result.error}`);
            }
        } catch (error) {
            this.showError('Erro no teste: ' + error.message);
        }
    }

    async testSearch() {
        try {
            const response = await fetch('/api/test_search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: 'mercado digital Brasil 2024' })
            });
            
            const result = await response.json();
            console.log('Teste de Busca:', result);
            
            if (result.success) {
                this.showSuccess(`Busca OK: ${result.results_count} resultados`);
            } else {
                this.showError(`Busca falhou: ${result.error}`);
            }
        } catch (error) {
            this.showError('Erro no teste: ' + error.message);
        }
    }

    async showExtractorStats() {
        try {
            const response = await fetch('/api/extractor_stats');
            const result = await response.json();
            console.log('Estatísticas dos Extratores:', result);
            
            if (result.success) {
                const stats = result.stats;
                let message = 'Estatísticas dos Extratores:\n';
                
                for (const [name, data] of Object.entries(stats)) {
                    if (name !== 'global') {
                        message += `${name}: ${data.available ? 'Ativo' : 'Inativo'}\n`;
                    }
                }
                
                alert(message);
            }
        } catch (error) {
            this.showError('Erro ao obter stats: ' + error.message);
        }
    }

    async resetExtractors() {
        try {
            const response = await fetch('/api/reset_extractors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('Extratores resetados com sucesso!');
            } else {
                this.showError('Erro ao resetar extratores');
            }
        } catch (error) {
            this.showError('Erro no reset: ' + error.message);
        }
    }

    showError(message) {
        this.showAlert(message, 'error');
    }

    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    showAlert(message, type = 'info') {
        // Remove alertas existentes
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;

        document.body.appendChild(alert);

        // Remove após 5 segundos
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }
}

// Inicializa quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.analysisManager = new AnalysisManager();
    
    // Adiciona ao objeto global app se existir
    if (window.app) {
        window.app.analysisManager = window.analysisManager;
    }
});
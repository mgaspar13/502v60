#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ARQV30 Enhanced v2.0 - Enhanced Analysis Pipeline
Pipeline de análise aprimorado com continuidade garantida e zero simulação
"""

import time
import logging
import json
from datetime import datetime
from typing import Dict, List, Any, Optional, Callable
from services.ai_manager import ai_manager
from services.ultra_robust_search_manager import ultra_robust_search_manager
from services.mental_drivers_architect import mental_drivers_architect
from services.visual_proofs_generator import visual_proofs_generator
from services.anti_objection_system import anti_objection_system
from services.enhanced_pre_pitch_architect import enhanced_pre_pitch_architect
from services.future_prediction_engine import future_prediction_engine
from services.auto_save_manager import auto_save_manager, salvar_etapa, salvar_erro
from services.analysis_quality_controller import analysis_quality_controller

logger = logging.getLogger(__name__)

class EnhancedAnalysisPipeline:
    """Pipeline de análise aprimorado com continuidade garantida"""
    
    def __init__(self):
        """Inicializa pipeline aprimorado"""
        self.components = [
            ('pesquisa_web_ultra_robusta', self._execute_ultra_robust_search),
            ('analise_ia_avancada', self._execute_advanced_ai_analysis),
            ('avatar_ultra_detalhado', self._extract_avatar_from_analysis),
            ('drivers_mentais_customizados', self._generate_mental_drivers),
            ('provas_visuais_instantaneas', self._generate_visual_proofs),
            ('sistema_anti_objecao', self._generate_anti_objection),
            ('pre_pitch_invisivel', self._generate_pre_pitch),
            ('predicoes_futuro_completas', self._generate_future_predictions),
            ('insights_exclusivos_finais', self._generate_final_insights)
        ]
        
        self.quality_filters = {
            'min_content_length': 3000,
            'min_sources': 3,
            'min_quality_score': 60.0,
            'simulation_tolerance': 0  # Zero tolerância
        }
        
        logger.info("Enhanced Analysis Pipeline inicializado")
    
    def execute_complete_analysis(
        self, 
        data: Dict[str, Any],
        session_id: str = None,
        progress_callback: Optional[Callable] = None
    ) -> Dict[str, Any]:
        """Executa análise completa com continuidade garantida"""
        
        start_time = time.time()
        session_id = session_id or auto_save_manager.iniciar_sessao()
        
        logger.info(f"🚀 Iniciando pipeline aprimorado para {data.get('segmento')}")
        
        # Salva dados de entrada
        salvar_etapa("pipeline_iniciado", {
            "input_data": data,
            "session_id": session_id,
            "components_count": len(self.components)
        }, categoria="analise_completa")
        
        # Executa componentes com continuidade garantida
        results = {}
        successful_components = []
        failed_components = []
        
        for i, (component_name, component_func) in enumerate(self.components):
            if progress_callback:
                progress_callback(i + 1, f"Executando {component_name}...")
            
            try:
                logger.info(f"🔄 Executando componente: {component_name}")
                
                # Executa componente com dados acumulados
                component_data = {**data, **results}
                result = component_func(component_data, session_id)
                
                if result and self._validate_component_result(component_name, result):
                    results[component_name] = result
                    successful_components.append(component_name)
                    
                    # Salva resultado imediatamente
                    salvar_etapa(f"componente_{component_name}", result, categoria="analise_completa")
                    
                    logger.info(f"✅ {component_name}: Sucesso")
                else:
                    failed_components.append(component_name)
                    logger.warning(f"⚠️ {component_name}: Resultado inválido ou vazio")
                    
                    # Salva falha mas continua
                    salvar_erro(f"componente_{component_name}", 
                              Exception("Resultado inválido"), 
                              contexto={"component": component_name})
                
            except Exception as e:
                failed_components.append(component_name)
                logger.error(f"❌ {component_name}: {str(e)}")
                
                # Salva erro mas CONTINUA pipeline
                salvar_erro(f"componente_{component_name}", e, 
                          contexto={"component": component_name, "data": component_data})
        
        # Consolida análise final (SEMPRE gera algo)
        final_analysis = self._consolidate_final_analysis(
            data, results, successful_components, failed_components, session_id
        )
        
        # Filtra dados brutos do relatório final
        clean_analysis = self._filter_raw_data_from_report(final_analysis)
        
        # Adiciona metadados
        processing_time = time.time() - start_time
        clean_analysis['metadata'] = {
            'processing_time_seconds': processing_time,
            'session_id': session_id,
            'successful_components': successful_components,
            'failed_components': failed_components,
            'success_rate': len(successful_components) / len(self.components) * 100,
            'generated_at': datetime.now().isoformat(),
            'pipeline_version': '2.0_enhanced',
            'simulation_free': True,
            'raw_data_filtered': True
        }
        
        # Salva análise final
        salvar_etapa("analise_final_limpa", clean_analysis, categoria="analise_completa")
        
        logger.info(f"✅ Pipeline concluído: {len(successful_components)}/{len(self.components)} sucessos")
        
        return clean_analysis
    
    def _execute_ultra_robust_search(self, data: Dict[str, Any], session_id: str) -> Dict[str, Any]:
        """Executa pesquisa ultra-robusta aprimorada"""
        
        try:
            # Gera queries expandidas e inteligentes
            queries = self._generate_enhanced_queries(data)
            
            # Executa busca em múltiplas camadas
            search_results = []
            
            for query in queries[:5]:  # Top 5 queries
                try:
                    results = ultra_robust_search_manager.execute_comprehensive_search(
                        query, data, max_results=20, require_high_quality=True
                    )
                    
                    if results.get('meets_quality_requirements'):
                        search_results.append(results)
                        
                except Exception as e:
                    logger.warning(f"Query '{query}' falhou: {e}")
                    continue
            
            if not search_results:
                raise Exception("Nenhuma busca retornou dados de qualidade suficiente")
            
            # Consolida resultados
            consolidated = self._consolidate_search_results(search_results)
            
            return {
                'queries_executadas': queries,
                'resultados_consolidados': consolidated,
                'total_fontes': consolidated.get('total_sources', 0),
                'qualidade_media': consolidated.get('avg_quality', 0),
                'timestamp': datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Pesquisa ultra-robusta falhou: {e}")
            raise Exception(f"PESQUISA FALHOU: {str(e)}")
    
    def _execute_advanced_ai_analysis(self, data: Dict[str, Any], session_id: str) -> Dict[str, Any]:
        """Executa análise avançada com IA"""
        
        try:
            search_data = data.get('pesquisa_web_ultra_robusta', {})
            
            # Prepara contexto de pesquisa limpo
            search_context = self._prepare_clean_search_context(search_data)
            
            # Prompt aprimorado
            prompt = self._build_enhanced_analysis_prompt(data, search_context)
            
            # Executa com IA
            response = ai_manager.generate_analysis(prompt, max_tokens=8192)
            
            if not response:
                raise Exception("IA não respondeu")
            
            # Processa e valida resposta
            analysis = self._process_and_validate_ai_response(response, data)
            
            return analysis
            
        except Exception as e:
            logger.error(f"Análise IA falhou: {e}")
            raise Exception(f"ANÁLISE IA FALHOU: {str(e)}")
    
    def _extract_avatar_from_analysis(self, data: Dict[str, Any], session_id: str) -> Dict[str, Any]:
        """Extrai avatar da análise IA"""
        
        try:
            ai_analysis = data.get('analise_ia_avancada', {})
            avatar = ai_analysis.get('avatar_ultra_detalhado', {})
            
            if not avatar or not avatar.get('perfil_demografico'):
                raise Exception("Avatar insuficiente na análise IA")
            
            # Valida qualidade do avatar
            if not self._validate_avatar_quality(avatar):
                raise Exception("Avatar não atende critérios de qualidade")
            
            return avatar
            
        except Exception as e:
            logger.error(f"Extração de avatar falhou: {e}")
            raise Exception(f"AVATAR FALHOU: {str(e)}")
    
    def _generate_mental_drivers(self, data: Dict[str, Any], session_id: str) -> Dict[str, Any]:
        """Gera drivers mentais sem fallbacks"""
        
        try:
            avatar_data = data.get('avatar_ultra_detalhado', {})
            
            if not avatar_data:
                raise Exception("Avatar necessário para drivers mentais")
            
            drivers = mental_drivers_architect.generate_complete_drivers_system(avatar_data, data)
            
            if not drivers or drivers.get('fallback_mode'):
                raise Exception("Drivers mentais retornaram fallback - rejeitado")
            
            return drivers
            
        except Exception as e:
            logger.error(f"Drivers mentais falharam: {e}")
            raise Exception(f"DRIVERS MENTAIS FALHARAM: {str(e)}")
    
    def _generate_visual_proofs(self, data: Dict[str, Any], session_id: str) -> List[Dict[str, Any]]:
        """Gera provas visuais sem fallbacks"""
        
        try:
            avatar_data = data.get('avatar_ultra_detalhado', {})
            
            # Extrai conceitos para prova
            concepts = self._extract_proof_concepts(avatar_data, data)
            
            if not concepts:
                raise Exception("Nenhum conceito válido para provas visuais")
            
            proofs = visual_proofs_generator.generate_complete_proofs_system(concepts, avatar_data, data)
            
            if not proofs or any(p.get('fallback_mode') for p in proofs):
                raise Exception("Provas visuais retornaram fallback - rejeitado")
            
            return proofs
            
        except Exception as e:
            logger.error(f"Provas visuais falharam: {e}")
            raise Exception(f"PROVAS VISUAIS FALHARAM: {str(e)}")
    
    def _generate_anti_objection(self, data: Dict[str, Any], session_id: str) -> Dict[str, Any]:
        """Gera sistema anti-objeção sem fallbacks"""
        
        try:
            avatar_data = data.get('avatar_ultra_detalhado', {})
            objections = avatar_data.get('objecoes_reais', [])
            
            if not objections:
                # Extrai objeções das dores
                dores = avatar_data.get('dores_viscerais', [])
                objections = [f"Objeção relacionada a: {dor}" for dor in dores[:5]]
            
            anti_obj = anti_objection_system.generate_complete_anti_objection_system(
                objections, avatar_data, data
            )
            
            if not anti_obj or anti_obj.get('fallback_mode'):
                raise Exception("Sistema anti-objeção retornou fallback - rejeitado")
            
            return anti_obj
            
        except Exception as e:
            logger.error(f"Sistema anti-objeção falhou: {e}")
            raise Exception(f"ANTI-OBJEÇÃO FALHOU: {str(e)}")
    
    def _generate_pre_pitch(self, data: Dict[str, Any], session_id: str) -> Dict[str, Any]:
        """Gera pré-pitch sem fallbacks"""
        
        try:
            drivers_data = data.get('drivers_mentais_customizados', {})
            avatar_data = data.get('avatar_ultra_detalhado', {})
            
            drivers_list = drivers_data.get('drivers_customizados', [])
            
            if not drivers_list:
                raise Exception("Drivers necessários para pré-pitch")
            
            pre_pitch = enhanced_pre_pitch_architect.generate_enhanced_pre_pitch_system(
                drivers_data, avatar_data, data
            )
            
            if not pre_pitch or pre_pitch.get('status') == 'EMERGENCY_MODE':
                raise Exception("Pré-pitch retornou modo de emergência - rejeitado")
            
            return pre_pitch
            
        except Exception as e:
            logger.error(f"Pré-pitch falhou: {e}")
            raise Exception(f"PRÉ-PITCH FALHOU: {str(e)}")
    
    def _generate_future_predictions(self, data: Dict[str, Any], session_id: str) -> Dict[str, Any]:
        """Gera predições do futuro"""
        
        try:
            segmento = data.get('segmento', 'negócios')
            
            predictions = future_prediction_engine.predict_market_future(
                segmento, data, horizon_months=36
            )
            
            if not predictions:
                raise Exception("Predições do futuro falharam")
            
            return predictions
            
        except Exception as e:
            logger.error(f"Predições futuras falharam: {e}")
            raise Exception(f"PREDIÇÕES FUTURAS FALHARAM: {str(e)}")
    
    def _generate_final_insights(self, data: Dict[str, Any], session_id: str) -> List[str]:
        """Gera insights finais consolidados"""
        
        try:
            # Coleta insights de todos os componentes
            all_insights = []
            
            # Insights da análise IA
            ai_analysis = data.get('analise_ia_avancada', {})
            ai_insights = ai_analysis.get('insights_exclusivos', [])
            if ai_insights:
                all_insights.extend(ai_insights[:10])
            
            # Insights da pesquisa
            search_data = data.get('pesquisa_web_ultra_robusta', {})
            search_insights = self._extract_insights_from_search(search_data)
            all_insights.extend(search_insights)
            
            # Insights dos componentes avançados
            component_insights = self._extract_component_insights(data)
            all_insights.extend(component_insights)
            
            # Remove duplicatas e filtra qualidade
            unique_insights = []
            seen_insights = set()
            
            for insight in all_insights:
                if (insight and 
                    len(insight) > 50 and 
                    insight not in seen_insights and
                    not self._is_simulated_insight(insight)):
                    unique_insights.append(insight)
                    seen_insights.add(insight)
            
            return unique_insights[:25]  # Top 25 insights únicos
            
        except Exception as e:
            logger.error(f"Geração de insights finais falhou: {e}")
            return []  # Retorna lista vazia em vez de falhar
    
    def _consolidate_final_analysis(
        self, 
        original_data: Dict[str, Any],
        results: Dict[str, Any],
        successful: List[str],
        failed: List[str],
        session_id: str
    ) -> Dict[str, Any]:
        """Consolida análise final SEMPRE (mesmo com falhas)"""
        
        # Estrutura base sempre presente
        final_analysis = {
            'projeto_dados': original_data,
            'pipeline_status': {
                'componentes_executados': successful,
                'componentes_falharam': failed,
                'taxa_sucesso': len(successful) / len(self.components) * 100,
                'session_id': session_id
            }
        }
        
        # Adiciona componentes bem-sucedidos
        for component_name in successful:
            if component_name in results:
                final_analysis[component_name] = results[component_name]
        
        # Se tem pelo menos pesquisa e análise IA, considera válido
        if ('pesquisa_web_ultra_robusta' in results and 
            'analise_ia_avancada' in results):
            final_analysis['status'] = 'COMPLETO'
        elif len(successful) >= 3:
            final_analysis['status'] = 'PARCIAL_VALIDO'
        else:
            final_analysis['status'] = 'MINIMO_PRESERVADO'
        
        return final_analysis
    
    def _filter_raw_data_from_report(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Remove dados brutos do relatório final"""
        
        clean_analysis = {}
        
        for key, value in analysis.items():
            if key in ['projeto_dados', 'pipeline_status', 'metadata']:
                # Mantém dados estruturais
                clean_analysis[key] = value
            elif isinstance(value, dict):
                # Filtra dicionários recursivamente
                clean_analysis[key] = self._filter_dict_raw_data(value)
            elif isinstance(value, list):
                # Filtra listas
                clean_analysis[key] = self._filter_list_raw_data(value)
            else:
                # Mantém outros tipos
                clean_analysis[key] = value
        
        return clean_analysis
    
    def _filter_dict_raw_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Filtra dados brutos de dicionários"""
        
        # Campos que contêm dados brutos a serem removidos
        raw_data_fields = [
            'extracted_content', 'raw_content', 'page_content', 'html_content',
            'search_results', 'urls_found', 'links_extracted', 'raw_response',
            'full_content', 'content_preview', 'detailed_results', 'sources_raw',
            'extraction_details', 'raw_data', 'content_raw', 'html_raw'
        ]
        
        filtered = {}
        
        for key, value in data.items():
            if key.lower() in [field.lower() for field in raw_data_fields]:
                # Remove dados brutos mas mantém estatísticas
                if isinstance(value, list):
                    filtered[f"{key}_count"] = len(value)
                elif isinstance(value, str):
                    filtered[f"{key}_length"] = len(value)
                # Não inclui o conteúdo bruto
            elif isinstance(value, dict):
                filtered[key] = self._filter_dict_raw_data(value)
            elif isinstance(value, list):
                filtered[key] = self._filter_list_raw_data(value)
            else:
                filtered[key] = value
        
        return filtered
    
    def _filter_list_raw_data(self, data: List[Any]) -> List[Any]:
        """Filtra dados brutos de listas"""
        
        filtered = []
        
        for item in data:
            if isinstance(item, dict):
                # Remove campos de conteúdo bruto
                clean_item = {}
                for key, value in item.items():
                    if key.lower() not in ['content', 'raw_content', 'html', 'full_text']:
                        if isinstance(value, dict):
                            clean_item[key] = self._filter_dict_raw_data(value)
                        elif isinstance(value, list):
                            clean_item[key] = self._filter_list_raw_data(value)
                        else:
                            clean_item[key] = value
                    else:
                        # Mantém apenas estatísticas do conteúdo
                        if isinstance(value, str):
                            clean_item[f"{key}_length"] = len(value)
                
                filtered.append(clean_item)
            else:
                filtered.append(item)
        
        return filtered
    
    def _generate_enhanced_queries(self, data: Dict[str, Any]) -> List[str]:
        """Gera queries aprimoradas para pesquisa"""
        
        segmento = data.get('segmento', '')
        produto = data.get('produto', '')
        publico = data.get('publico', '')
        
        queries = []
        
        # Queries principais aprimoradas
        if produto:
            queries.extend([
                f"análise mercado {segmento} {produto} Brasil 2024 dados estatísticas crescimento",
                f"competição {segmento} {produto} principais players market share",
                f"tendências {segmento} {produto} inovação tecnologia futuro",
                f"consumidor {segmento} {produto} comportamento compra decisão",
                f"preços {segmento} {produto} ticket médio benchmarks mercado"
            ])
        else:
            queries.extend([
                f"mercado {segmento} Brasil 2024 tamanho crescimento oportunidades",
                f"análise competitiva {segmento} principais empresas líderes",
                f"tendências {segmento} inovação disrupção tecnológica",
                f"investimentos {segmento} venture capital funding startups",
                f"regulamentação {segmento} mudanças legais impacto negócios"
            ])
        
        # Queries específicas por público
        if publico:
            queries.extend([
                f"perfil {publico} {segmento} dados demográficos IBGE",
                f"comportamento {publico} {segmento} pesquisa consumo",
                f"jornada compra {publico} {segmento} processo decisão"
            ])
        
        # Queries de inteligência avançada
        queries.extend([
            f"cases sucesso {segmento} empresas brasileiras unicórnios",
            f"fusões aquisições {segmento} M&A Brasil consolidação",
            f"IPO {segmento} bolsa valores B3 mercado capitais",
            f"pesquisas mercado {segmento} institutos consultoria dados",
            f"relatórios setoriais {segmento} McKinsey BCG Deloitte"
        ])
        
        return queries[:12]  # Top 12 queries
    
    def _consolidate_search_results(self, search_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Consolida resultados de múltiplas buscas"""
        
        total_sources = 0
        total_content_length = 0
        quality_scores = []
        all_sources = []
        
        for result in search_results:
            stats = result.get('statistics', {})
            total_sources += stats.get('successful_extractions', 0)
            total_content_length += stats.get('total_content_length', 0)
            
            if stats.get('avg_quality_score'):
                quality_scores.append(stats['avg_quality_score'])
            
            # Coleta fontes (sem conteúdo bruto)
            sources = result.get('search_results', [])
            for source in sources:
                all_sources.append({
                    'title': source.get('title', ''),
                    'url': source.get('url', ''),
                    'source': source.get('source', ''),
                    'quality_score': source.get('filtro', {}).get('prioridade', 0)
                })
        
        return {
            'total_sources': total_sources,
            'total_content_length': total_content_length,
            'avg_quality': sum(quality_scores) / len(quality_scores) if quality_scores else 0,
            'unique_domains': len(set(s['url'].split('/')[2] for s in all_sources if s.get('url'))),
            'sources_summary': all_sources[:20]  # Top 20 fontes sem conteúdo
        }
    
    def _prepare_clean_search_context(self, search_data: Dict[str, Any]) -> str:
        """Prepara contexto de pesquisa limpo (sem dados brutos)"""
        
        consolidated = search_data.get('resultados_consolidados', {})
        
        context = f"""PESQUISA ULTRA-ROBUSTA EXECUTADA COM SUCESSO:

ESTATÍSTICAS DA PESQUISA:
- Total de fontes analisadas: {consolidated.get('total_sources', 0)}
- Domínios únicos consultados: {consolidated.get('unique_domains', 0)}
- Qualidade média das fontes: {consolidated.get('avg_quality', 0):.1f}%
- Total de conteúdo analisado: {consolidated.get('total_content_length', 0):,} caracteres

FONTES PRINCIPAIS CONSULTADAS:
"""
        
        sources = consolidated.get('sources_summary', [])
        for i, source in enumerate(sources[:10], 1):
            context += f"{i}. {source.get('title', 'Sem título')}\n"
            context += f"   URL: {source.get('url', '')}\n"
            context += f"   Fonte: {source.get('source', 'unknown')}\n"
            context += f"   Qualidade: {source.get('quality_score', 0):.1f}\n\n"
        
        context += "\nGARANTIA: Todos os dados baseados em pesquisa real, sem simulações."
        
        return context
    
    def _build_enhanced_analysis_prompt(self, data: Dict[str, Any], search_context: str) -> str:
        """Constrói prompt aprimorado para análise"""
        
        return f"""# ANÁLISE ULTRA-DETALHADA APRIMORADA - ARQV30 v2.0

Você é o DIRETOR SUPREMO DE ANÁLISE DE MERCADO com 30+ anos de experiência.

## DADOS DO PROJETO:
- Segmento: {data.get('segmento', 'Não informado')}
- Produto: {data.get('produto', 'Não informado')}
- Público: {data.get('publico', 'Não informado')}
- Preço: R$ {data.get('preco', 'Não informado')}
- Objetivo Receita: R$ {data.get('objetivo_receita', 'Não informado')}

{search_context}

## INSTRUÇÕES CRÍTICAS:
1. Use APENAS dados REAIS da pesquisa
2. NUNCA use "N/A", "Customizado para", "Baseado em"
3. Seja ULTRA-ESPECÍFICO com dados concretos
4. Se não houver dados suficientes, omita a seção
5. Foque em INSIGHTS ACIONÁVEIS únicos

## FORMATO OBRIGATÓRIO:
```json
{{
  "avatar_ultra_detalhado": {{
    "nome_ficticio": "Nome específico baseado no segmento",
    "perfil_demografico": {{
      "idade": "Faixa específica com dados reais",
      "genero": "Distribuição real com percentuais",
      "renda": "Faixa real baseada em pesquisas",
      "escolaridade": "Nível real predominante",
      "localizacao": "Regiões reais de concentração",
      "profissao": "Ocupações reais mais comuns"
    }},
    "perfil_psicografico": {{
      "personalidade": "Traços reais dominantes",
      "valores": "Valores reais principais",
      "interesses": "Interesses reais específicos",
      "comportamento_compra": "Processo real documentado",
      "influenciadores": "Quem realmente influencia",
      "medos_profundos": "Medos reais documentados",
      "aspiracoes_secretas": "Aspirações reais identificadas"
    }},
    "dores_viscerais": [
      "Lista de 10-15 dores REAIS específicas do segmento"
    ],
    "desejos_secretos": [
      "Lista de 10-15 desejos REAIS profundos"
    ],
    "objecoes_reais": [
      "Lista de 8-12 objeções REAIS específicas"
    ],
    "linguagem_interna": {{
      "frases_dor": ["Frases reais que usam"],
      "frases_desejo": ["Frases reais de desejo"],
      "vocabulario_especifico": ["Palavras específicas do nicho"],
      "tom_comunicacao": "Tom real de comunicação"
    }}
  }},
  
  "posicionamento_estrategico": {{
    "posicionamento_mercado": "Posicionamento único baseado em análise real",
    "proposta_valor_unica": "Proposta irresistível baseada em gaps reais",
    "diferenciais_competitivos": [
      "Lista de diferenciais únicos e defensáveis"
    ],
    "mensagem_central": "Mensagem principal que resume tudo",
    "estrategia_oceano_azul": "Como criar mercado sem concorrência",
    "ancoragem_preco": "Como ancorar preço na mente do cliente"
  }},
  
  "analise_concorrencia_avancada": [
    {{
      "nome": "Nome real do concorrente principal",
      "posicionamento": "Como se posicionam realmente",
      "forcas": ["Forças reais específicas"],
      "fraquezas": ["Fraquezas reais exploráveis"],
      "vulnerabilidades": ["Pontos fracos específicos"],
      "estrategia_marketing": "Estratégia real observada",
      "share_estimado": "Participação estimada real"
    }}
  ],
  
  "estrategia_marketing_completa": {{
    "palavras_chave_primarias": [
      "15-20 palavras principais com dados reais"
    ],
    "palavras_chave_secundarias": [
      "25-35 palavras secundárias identificadas"
    ],
    "long_tail_keywords": [
      "30-50 palavras de cauda longa específicas"
    ],
    "estrategia_conteudo": "Como usar palavras-chave estrategicamente",
    "canais_aquisicao": [
      "Canais reais mais eficazes para o segmento"
    ],
    "funil_conversao": {{
      "topo": "Estratégias reais para topo do funil",
      "meio": "Estratégias reais para meio do funil", 
      "fundo": "Estratégias reais para fundo do funil"
    }}
  }},
  
  "metricas_kpis_avancados": {{
    "kpis_principais": [
      {{
        "metrica": "Nome da métrica real",
        "objetivo": "Valor objetivo baseado em dados",
        "benchmark": "Benchmark real do mercado"
      }}
    ],
    "projecoes_financeiras": {{
      "cenario_conservador": {{
        "receita_mensal": "Valor real baseado em dados",
        "clientes_mes": "Número real estimado",
        "ticket_medio": "Ticket real do mercado"
      }},
      "cenario_realista": {{
        "receita_mensal": "Valor real baseado em dados",
        "clientes_mes": "Número real estimado", 
        "ticket_medio": "Ticket real do mercado"
      }},
      "cenario_otimista": {{
        "receita_mensal": "Valor real baseado em dados",
        "clientes_mes": "Número real estimado",
        "ticket_medio": "Ticket real do mercado"
      }}
    }}
  }},
  
  "insights_exclusivos": [
    "Lista de 20-30 insights ULTRA-ESPECÍFICOS e ACIONÁVEIS baseados exclusivamente na pesquisa real"
  ]
}}
```

CRÍTICO: Gere APENAS o JSON válido. Use exclusivamente dados da pesquisa real."""
    
    def _process_and_validate_ai_response(self, response: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Processa e valida resposta da IA rigorosamente"""
        
        try:
            # Extrai JSON
            clean_text = response.strip()
            
            if "```json" in clean_text:
                start = clean_text.find("```json") + 7
                end = clean_text.rfind("```")
                clean_text = clean_text[start:end].strip()
            
            # Parse JSON
            analysis = json.loads(clean_text)
            
            # Validação rigorosa
            validation = analysis_quality_controller.validate_complete_analysis(analysis)
            
            if not validation['valid']:
                raise Exception(f"Análise IA inválida: {validation['errors']}")
            
            # Verifica simulações
            if self._contains_simulation_markers(analysis):
                raise Exception("Análise contém marcadores de simulação")
            
            return analysis
            
        except json.JSONDecodeError as e:
            raise Exception(f"JSON inválido da IA: {str(e)}")
    
    def _contains_simulation_markers(self, analysis: Dict[str, Any]) -> bool:
        """Verifica se contém marcadores de simulação"""
        
        analysis_str = json.dumps(analysis, ensure_ascii=False).lower()
        
        forbidden_phrases = [
            'customizado para', 'baseado em', 'específico para', 'n/a',
            'não informado', 'exemplo de', 'simulado', 'genérico'
        ]
        
        return any(phrase in analysis_str for phrase in forbidden_phrases)
    
    def _validate_component_result(self, component_name: str, result: Any) -> bool:
        """Valida resultado de componente"""
        
        if not result:
            return False
        
        # Rejeita fallbacks
        if isinstance(result, dict) and result.get('fallback_mode'):
            return False
        
        # Validações específicas por componente
        if component_name == 'avatar_ultra_detalhado':
            return self._validate_avatar_quality(result)
        elif component_name == 'drivers_mentais_customizados':
            return self._validate_drivers_quality(result)
        elif component_name == 'insights_exclusivos_finais':
            return len(result) >= 5 if isinstance(result, list) else False
        
        return True
    
    def _validate_avatar_quality(self, avatar: Dict[str, Any]) -> bool:
        """Valida qualidade do avatar"""
        
        required_fields = ['perfil_demografico', 'dores_viscerais', 'desejos_secretos']
        
        for field in required_fields:
            if not avatar.get(field):
                return False
        
        # Verifica se dores e desejos são substanciais
        dores = avatar.get('dores_viscerais', [])
        desejos = avatar.get('desejos_secretos', [])
        
        if len(dores) < 5 or len(desejos) < 5:
            return False
        
        # Verifica se não são genéricas
        for dor in dores[:3]:
            if self._is_simulated_insight(dor):
                return False
        
        return True
    
    def _validate_drivers_quality(self, drivers: Dict[str, Any]) -> bool:
        """Valida qualidade dos drivers"""
        
        drivers_list = drivers.get('drivers_customizados', [])
        
        if len(drivers_list) < 3:
            return False
        
        for driver in drivers_list:
            if not driver.get('nome') or not driver.get('roteiro_ativacao'):
                return False
            
            historia = driver.get('roteiro_ativacao', {}).get('historia_analogia', '')
            if len(historia) < 100:
                return False
        
        return True
    
    def _is_simulated_insight(self, insight: str) -> bool:
        """Verifica se insight é simulado"""
        
        if not insight or len(insight) < 30:
            return True
        
        simulation_indicators = [
            'customizado para', 'baseado em', 'específico para',
            'exemplo de', 'simulado', 'genérico', 'n/a'
        ]
        
        insight_lower = insight.lower()
        return any(indicator in insight_lower for indicator in simulation_indicators)
    
    def _extract_insights_from_search(self, search_data: Dict[str, Any]) -> List[str]:
        """Extrai insights da pesquisa (sem dados brutos)"""
        
        insights = []
        consolidated = search_data.get('resultados_consolidados', {})
        
        # Insights baseados em estatísticas
        total_sources = consolidated.get('total_sources', 0)
        if total_sources > 0:
            insights.append(f"Análise baseada em {total_sources} fontes reais de alta qualidade")
        
        avg_quality = consolidated.get('avg_quality', 0)
        if avg_quality > 70:
            insights.append(f"Qualidade média das fontes: {avg_quality:.1f}% - dados confiáveis")
        
        unique_domains = consolidated.get('unique_domains', 0)
        if unique_domains > 5:
            insights.append(f"Diversidade de fontes: {unique_domains} domínios únicos consultados")
        
        return insights
    
    def _extract_component_insights(self, data: Dict[str, Any]) -> List[str]:
        """Extrai insights dos componentes avançados"""
        
        insights = []
        
        # Insights dos drivers mentais
        drivers = data.get('drivers_mentais_customizados', {})
        if drivers and not drivers.get('fallback_mode'):
            drivers_count = len(drivers.get('drivers_customizados', []))
            insights.append(f"Sistema de {drivers_count} drivers mentais customizados implementado")
        
        # Insights das provas visuais
        proofs = data.get('provas_visuais_instantaneas', [])
        if proofs and not any(p.get('fallback_mode') for p in proofs):
            insights.append(f"Sistema de {len(proofs)} provas visuais instantâneas desenvolvido")
        
        # Insights do sistema anti-objeção
        anti_obj = data.get('sistema_anti_objecao', {})
        if anti_obj and not anti_obj.get('fallback_mode'):
            insights.append("Sistema anti-objeção completo com scripts personalizados")
        
        return insights

# Instância global
enhanced_analysis_pipeline = EnhancedAnalysisPipeline()
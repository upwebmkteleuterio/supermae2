import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const isTerms = type === 'terms';

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-md px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] flex flex-col shadow-2xl animate-in zoom-in-95 duration-300 max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              {isTerms ? <FileText className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{isTerms ? 'Termos de Uso' : 'Política de Privacidade'}</h3>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Versão 1.0 - Março 2026</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 text-slate-600 text-sm leading-relaxed prose prose-slate no-scrollbar">
          {isTerms ? (
            <>
              <h4 className="font-bold text-slate-800">1. Aceitação dos Termos</h4>
              <p>Ao acessar e utilizar o Super Mãe, você concorda em cumprir e estar vinculado a estes Termos de Uso. O aplicativo é destinado ao suporte emocional e organização de rotinas para mães, não substituindo aconselhamento médico ou terapêutico profissional.</p>
              
              <h4 className="font-bold text-slate-800">2. Uso do Aplicativo</h4>
              <p>O Super Mãe oferece ferramentas de inteligência artificial para sugestão de atividades e análise de sentimentos. Estas sugestões são baseadas em modelos probabilísticos e devem ser avaliadas criteriosamente pela usuária antes da execução.</p>
              
              <h4 className="font-bold text-slate-800">3. Cadastro e Segurança</h4>
              <p>Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem em sua conta. O uso indevido de canais comunitários (como assédio ou spam) resultará em banimento imediato.</p>
              
              <h4 className="font-bold text-slate-800">4. Propriedade Intelectual</h4>
              <p>Todo o conteúdo, design e algoritmos do Super Mãe são propriedade exclusiva da plataforma, protegidos por leis de direitos autorais e propriedade intelectual.</p>
            </>
          ) : (
            <>
              <h4 className="font-bold text-slate-800">1. Coleta de Dados</h4>
              <p>Coletamos dados necessários para a personalização da sua experiência, incluindo nome, localização, sentimentos registrados, dados de rotina e informações sobre o desenvolvimento dos seus filhos (conforme fornecido voluntariamente).</p>
              
              <h4 className="font-bold text-slate-800">2. Processamento por IA</h4>
              <p>Os textos enviados para análise de sentimentos e chat são processados de forma segura utilizando o Google Gemini API. Seus dados não são utilizados para treinar modelos públicos externos de forma identificável.</p>
              
              <h4 className="font-bold text-slate-800">3. Armazenamento e Segurança</h4>
              <p>Utilizamos infraestrutura Supabase com criptografia de ponta e políticas de Row Level Security (RLS), garantindo que apenas você tenha acesso aos seus dados privados e dos seus filhos.</p>
              
              <h4 className="font-bold text-slate-800">4. Seus Direitos (LGPD)</h4>
              <p>Em conformidade com a LGPD, você tem o direito de acessar, retificar e excluir definitivamente seus dados a qualquer momento através das configurações do aplicativo.</p>

              <div className="bg-purple-50 p-6 rounded-3xl flex gap-4 items-start">
                 <Lock className="w-5 h-5 text-purple-400 shrink-0 mt-1" />
                 <p className="text-purple-900 text-xs font-medium">Seus dados de humor e rotina são criptografados e nunca compartilhados com terceiros para fins publicitários.</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-50 shrink-0">
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-4 rounded-full font-bold active:scale-95 transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
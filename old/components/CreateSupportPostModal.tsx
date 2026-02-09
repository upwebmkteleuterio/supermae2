
import React, { useState, useEffect } from 'react';
import { X, Truck, HandHeart, Save, MapPin, Calendar, Clock } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { LocalSupportPost } from '../types';

interface CreateSupportPostModalProps {
  onClose: () => void;
  initialData?: LocalSupportPost;
}

export const CreateSupportPostModal: React.FC<CreateSupportPostModalProps> = ({ onClose, initialData }) => {
  const { createLocalSupportPost, updateLocalSupportPost } = useApp();
  const [type, setType] = useState<'offer' | 'request'>('offer');
  const [category, setCategory] = useState<'carona' | 'apoio_geral'>('carona');
  const [neighborhood, setNeighborhood] = useState('');
  const [destination, setDestination] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setCategory(initialData.category);
      setNeighborhood(initialData.locationNeighborhood);
      setDestination(initialData.destination);
      
      // Converte ISO para string aceita pelo input datetime-local
      const date = new Date(initialData.dateTime);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
      setDateTime(localISOTime);
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!destination || !neighborhood || !dateTime) return;
    setLoading(true);
    
    let success = false;
    if (initialData) {
      success = await updateLocalSupportPost(initialData.id, {
        type,
        category,
        locationNeighborhood: neighborhood,
        destination,
        dateTime: new Date(dateTime).toISOString()
      });
    } else {
      success = await createLocalSupportPost({
        type,
        category,
        locationNeighborhood: neighborhood,
        destination,
        dateTime: new Date(dateTime).toISOString()
      });
    }

    if (success) onClose();
    else alert("Erro ao processar. Tente novamente.");
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-6 animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto no-scrollbar max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
            {initialData ? 'Editar Publicação' : 'Novo Apoio Comunitário'}
          </h3>
          <button onClick={onClose} className="p-1 text-slate-300"><X className="w-5 h-5" /></button>
        </div>

        <div className="space-y-6">
          <div className="flex p-1 bg-slate-50 rounded-2xl">
            <button 
              onClick={() => setType('offer')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${type === 'offer' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-400'}`}
            >
              Eu ofereço
            </button>
            <button 
              onClick={() => setType('request')}
              className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${type === 'request' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-400'}`}
            >
              Eu preciso
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <button 
               onClick={() => setCategory('carona')}
               className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${category === 'carona' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-50 text-slate-400'}`}
             >
               <Truck className="w-6 h-6" />
               <span className="text-[10px] font-bold uppercase">Carona</span>
             </button>
             <button 
               onClick={() => setCategory('apoio_geral')}
               className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${category === 'apoio_geral' ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-slate-50 text-slate-400'}`}
             >
               <HandHeart className="w-6 h-6" />
               <span className="text-[10px] font-bold uppercase">Ajuda</span>
             </button>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2">Meu Bairro</label>
              <div className="relative">
                <input type="text" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} placeholder="Ex: Centro" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700" />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2">Destino / Item</label>
              <div className="relative">
                <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="Ex: Escola ABC ou Almoço" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700" />
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2">Data e Hora</label>
              <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-700" />
            </div>
          </div>

          <button 
            disabled={!neighborhood || !destination || !dateTime || loading}
            onClick={handleSave}
            className="w-full bg-purple-600 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-purple-100 active:scale-95 transition-all disabled:opacity-30 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
          >
            {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Processando...' : (initialData ? 'Salvar Alterações' : 'Publicar no Mural')}
          </button>
        </div>
      </div>
    </div>
  );
};

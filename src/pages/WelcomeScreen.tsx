import { ArrowLeft, ArrowRight, Brain } from 'lucide-react';

interface WelcomeScreenProps {
  subtitle: string;
  onBack?: () => void;
  onNext?: () => void;
}

export default function WelcomeScreen({ subtitle, onBack, onNext }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4 md:p-8">
      <div className="relative overflow-hidden bg-white rounded-lg border border-[#E1E4E8] shadow-sm w-full max-w-5xl flex flex-col min-h-[650px] p-8 md:p-12">
        {/* Decoración superior derecha: circuito / cerebro */}
        <div className="absolute -top-6 -right-6 w-64 h-64 text-[#003366]/15 pointer-events-none hidden md:block">
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="150" cy="50" r="4" />
            <circle cx="180" cy="90" r="3" />
            <circle cx="120" cy="20" r="3" />
            <circle cx="190" cy="140" r="4" />
            <circle cx="140" cy="120" r="3" />
            <circle cx="170" cy="170" r="3" />
            <line x1="150" y1="50" x2="180" y2="90" />
            <line x1="150" y1="50" x2="120" y2="20" />
            <line x1="180" y1="90" x2="190" y2="140" />
            <line x1="180" y1="90" x2="140" y2="120" />
            <line x1="140" y1="120" x2="170" y2="170" />
            <rect x="146" y="46" width="8" height="8" />
            <rect x="186" y="136" width="8" height="8" />
          </svg>
          <Brain className="absolute top-10 right-10 w-12 h-12 text-[#003366]/25" />
        </div>

        {/* Decoración izquierda: líneas geométricas */}
        <div className="absolute left-0 top-1/3 -translate-x-1/3 w-40 h-40 pointer-events-none hidden md:block">
          <svg viewBox="0 0 160 160" className="w-full h-full" fill="none" strokeWidth="2">
            <polyline points="0,40 40,40 40,0" stroke="#0056B3" strokeOpacity="0.25" />
            <polyline points="20,90 70,90 70,40" stroke="#0056B3" strokeOpacity="0.25" />
            <polyline points="0,140 60,140 60,90" stroke="#12B76A" strokeOpacity="0.5" />
          </svg>
        </div>

        {/* Decoración inferior izquierda: figura */}
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#12B76A]/15 rounded-tr-[100px] pointer-events-none" />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col flex-1 w-full">
          {/* Encabezado con logo */}
          <div className="flex items-center gap-3 mb-10">
            <svg viewBox="0 0 32 32" className="w-10 h-10 flex-shrink-0" fill="none">
              <circle cx="16" cy="16" r="14.5" stroke="#003366" strokeWidth="1.5" />
              <path d="M16 3 L20 16 L16 29 L12 16 Z" fill="#003366" />
              <path d="M3 16 L16 12 L29 16 L16 20 Z" fill="#003366" />
            </svg>
            <div className="leading-tight">
              <span className="text-[#003366] font-extrabold text-lg">PUCE</span>
              <span className="text-[#003366] text-sm"> | </span>
              <div className="inline-block text-[#003366] text-sm font-semibold uppercase">
                Dirección de<br />Investigación
              </div>
            </div>
          </div>

          {/* Título principal */}
          <h1 className="text-center text-5xl md:text-6xl font-extrabold text-[#003366] mb-6">
            Bienvenido
          </h1>
          <h2 className="text-center text-lg md:text-xl font-bold text-[#003366] mb-12">
            {subtitle}
          </h2>

          {/* Texto de instrucciones */}
          <div className="flex-1 flex items-center">
            <div className="w-full max-w-3xl mx-auto space-y-4 text-[#0056B3] text-sm md:text-base font-medium">
              <p>
                Para este formulario se requiere su Firma <span className="font-bold">[Formato IMAGEN jpg, jpeg, png]</span>.
              </p>
              <p>
                - Recuerde leer cuidadosamente las instrucciones que se encuentran a continuación.
              </p>
              <p>
                - La información ingresada en el formulario se guardará siempre que presione los botones
                "Guardar" o "Siguiente". Si por alguna eventualidad se cierra o no termina, recargue la
                página y vuelva a ingresar al sistema para editar.
              
              </p>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-end gap-4 mt-10">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#344054] border-2 border-[#D0D5DD] rounded-lg font-semibold hover:bg-[#F5F7FA] transition-colors"
            >
              <ArrowLeft size={18} />
              Regresar
            </button>
            <button
              onClick={onNext}
              className="flex items-center gap-2 px-6 py-3 bg-[#0056B3] text-white rounded-lg font-semibold hover:bg-[#004494] transition-colors"
            >
              Siguiente
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

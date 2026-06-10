import { useState } from 'react';
import { Save, Send, Plus, Trash2, FileText } from 'lucide-react';

interface Participant {
  id: string;
  tipo: string;
  nacionalidad: string;
  horas: string;
  fechaInicio: string;
  fechaFin: string;
  tipoDoc: string;
  numeroDoc: string;
  nombres: string;
  carrera: string;
}

interface FollowUpReportProps {
  onBack?: () => void;
}

export default function FollowUpReport({ onBack }: FollowUpReportProps) {
  const [activeSection, setActiveSection] = useState('datos');
  const [participants, setParticipants] = useState<Participant[]>([
    { id: '1', tipo: '', nacionalidad: '', horas: '', fechaInicio: '', fechaFin: '', tipoDoc: '', numeroDoc: '', nombres: '', carrera: '' }
  ]);

  const sections = [
    { id: 'datos', icon: '📋', label: 'Datos' },
    { id: 'alcance', icon: '🎯', label: 'Alcance' },
    { id: 'componentes', icon: '🔗', label: 'Comp.' },
    { id: 'estudiantes', icon: '👥', label: 'Est.' },
    { id: 'resultados', icon: '📊', label: 'Resultados' },
    { id: 'participantes', icon: '👤', label: 'Particip.' },
    { id: 'firmas', icon: '✍️', label: 'Firmas' },
    { id: 'anexos', icon: '📎', label: 'Anexos' }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const addParticipant = () => {
    setParticipants([...participants, {
      id: Date.now().toString(),
      tipo: '',
      nacionalidad: '',
      horas: '',
      fechaInicio: '',
      fechaFin: '',
      tipoDoc: '',
      numeroDoc: '',
      nombres: '',
      carrera: ''
    }]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col">
      {/* Header Fijo */}
      <header className="bg-[#003366] px-6 py-6 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center font-bold text-[#003366] text-xl">
                PUCE
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold mb-1">
                  INFORMACIÓN PARCIAL DE SEGUIMIENTO
                </h1>
                <p className="text-white/90 text-lg">Proyectos de Servicio Comunitario</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <label className="text-white/80 text-sm mb-1">Código:</label>
              <input
                type="text"
                placeholder="XXXX-XXX"
                className="px-4 py-2 rounded-lg border-2 border-white/20 bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-white/50 w-40"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navegación por Secciones */}
      <nav className="bg-white border-b border-[#E1E4E8] sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeSection === section.id
                    ? 'bg-[#003366] text-white'
                    : 'bg-[#F5F7FA] text-[#344054] hover:bg-[#E1E4E8]'
                }`}
              >
                <span>{section.icon}</span>
                <span className="text-sm">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Contenedor Central Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

          {/* SECCIÓN 1 - Datos Generales */}
          <section id="datos" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              📋 DATOS GENERALES
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Proyecto <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white">
                  <option>Seleccionar estado</option>
                  <option>En ejecución</option>
                  <option>Finalizado</option>
                  <option>Suspendido</option>
                </select>
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Unidad responsable <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Carrera <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Docente responsable <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Correo <span className="text-red-500">*</span>
                </label>
                <input type="email" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input type="tel" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Año de ejecución <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Fecha de inicio <span className="text-red-500">*</span>
                </label>
                <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Fecha de cierre <span className="text-red-500">*</span>
                </label>
                <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Fecha del informe <span className="text-red-500">*</span>
                </label>
                <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Programa
                </label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[#344054] font-medium mb-3 text-sm">
                  ¿Articulación con investigación PUCE? <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="articulacion" value="si" className="w-4 h-4 text-[#003366] focus:ring-[#003366]" />
                    <span className="text-[#344054]">Sí</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="articulacion" value="no" className="w-4 h-4 text-[#003366] focus:ring-[#003366]" />
                    <span className="text-[#344054]">No</span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2 - Alcance y Presupuesto */}
          <section id="alcance" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              🎯 ALCANCE Y PRESUPUESTO
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Comunidad alcanzada <span className="text-red-500">*</span>
                </label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Tipo de actores <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
                <div>
                  <label className="block text-[#344054] font-medium mb-2 text-sm">
                    Beneficiarios <span className="text-red-500">*</span>
                  </label>
                  <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  N° de personas alcanzadas <span className="text-red-500">*</span>
                </label>
                <input type="number" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Institución contraparte
                </label>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>

              {/* Presupuesto Card */}
              <div className="bg-[#F5F7FA] rounded-lg p-6 border border-[#D0D5DD]">
                <h3 className="text-[#003366] font-semibold mb-4 flex items-center gap-2">
                  💰 PRESUPUESTO
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">
                      Planificado
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-[#344054]">$</span>
                      <input type="number" step="0.01" className="w-full pl-8 pr-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">
                      Interno ejecutado
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-[#344054]">$</span>
                      <input type="number" step="0.01" className="w-full pl-8 pr-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">
                      Externo asignado
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-[#344054]">$</span>
                      <input type="number" step="0.01" className="w-full pl-8 pr-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">
                      Externo ejecutado
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-[#344054]">$</span>
                      <input type="number" step="0.01" className="w-full pl-8 pr-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#344054] font-medium mb-2 text-sm">
                      Gasto no contemplado
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-[#344054]">$</span>
                      <input type="number" step="0.01" className="w-full pl-8 pr-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] bg-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3 - Componentes */}
          <section id="componentes" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              🔗 COMPONENTES
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054] font-medium">Componente intersedes</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054] font-medium">Componente de interculturalidad</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054] font-medium">Componente de interdisciplinariedad</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054] font-medium">Componente de posgrados</span>
              </label>
            </div>
          </section>

          {/* SECCIÓN 4 - Estudiantes e Impacto */}
          <section id="estudiantes" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              👥 ESTUDIANTES E IMPACTO
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  N° de estudiantes vinculados <span className="text-red-500">*</span>
                </label>
                <input type="number" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
              </div>
              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Articulación con funciones sustantivas
                </label>
                <textarea rows={3} className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] resize-none" />
              </div>
              <div>
                <label className="block text-[#344054] font-medium mb-2 text-sm">
                  Impactos del proyecto
                </label>
                <textarea rows={5} className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] resize-none" placeholder="Describa los impactos generados por el proyecto..." />
              </div>
            </div>
          </section>

          {/* SECCIÓN 5 - Matriz de Resultados */}
          <section id="resultados" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              📊 RESULTADOS DEL PROYECTO
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#003366] text-white">
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Cadena de Resultados</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Indicadores</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Fuentes y Medios de Verificación</th>
                    <th className="border border-[#D0D5DD] px-4 py-3 text-left text-sm font-semibold">Avance de la Actividad y Actores Participantes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-[#F5F7FA]">
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <div className="font-semibold text-[#003366] mb-2">OBJETIVO GENERAL</div>
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <div className="font-semibold text-[#003366] mb-2">OBJETIVO ESPECÍFICO</div>
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                  </tr>
                  <tr className="bg-[#F5F7FA]">
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <div className="font-semibold text-[#003366] mb-2">RESULTADOS</div>
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <div className="font-semibold text-[#003366] mb-2">ACTIVIDADES</div>
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                    <td className="border border-[#D0D5DD] px-4 py-3">
                      <div className="font-medium text-[#344054] mb-2 text-sm">Ejecución</div>
                      <textarea rows={2} className="w-full px-3 py-2 border border-[#D0D5DD] rounded focus:outline-none focus:ring-2 focus:ring-[#003366] text-sm resize-none" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SECCIÓN 6 - Participantes */}
          <section id="participantes" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[#003366] text-xl font-semibold flex items-center gap-2">
                👤 LISTA DE PARTICIPANTES
              </h2>
              <button
                onClick={addParticipant}
                className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002952] transition-colors"
              >
                <Plus size={18} />
                Agregar participante
              </button>
            </div>
            <p className="text-sm text-[#344054] mb-4">Docentes, Administrativos, Alumni</p>

            <div className="overflow-x-auto">
              <div className="min-w-max">
                <div className="grid grid-cols-10 gap-2 mb-2 bg-[#003366] text-white p-3 rounded-t-lg">
                  <div className="text-sm font-semibold">Tipo</div>
                  <div className="text-sm font-semibold">Nacionalidad</div>
                  <div className="text-sm font-semibold">Horas</div>
                  <div className="text-sm font-semibold">Fecha inicio</div>
                  <div className="text-sm font-semibold">Fecha fin</div>
                  <div className="text-sm font-semibold">Tipo doc.</div>
                  <div className="text-sm font-semibold">N° doc.</div>
                  <div className="text-sm font-semibold col-span-2">Apellidos y nombres</div>
                  <div className="text-sm font-semibold">Acciones</div>
                </div>

                {participants.map((participant, index) => (
                  <div key={participant.id} className={`grid grid-cols-10 gap-2 p-3 border-b border-[#E1E4E8] ${index % 2 === 0 ? 'bg-[#F5F7FA]' : 'bg-white'}`}>
                    <input type="text" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Tipo" />
                    <input type="text" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="País" />
                    <input type="number" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="0" />
                    <input type="date" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                    <input type="date" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                    <input type="text" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="CI/Pasap." />
                    <input type="text" className="px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Número" />
                    <input type="text" className="col-span-2 px-3 py-2 border border-[#D0D5DD] rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]" placeholder="Nombre completo" />
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="flex items-center justify-center p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-[#344054] mt-3 flex items-center gap-1">
              💡 Deslizar horizontalmente para ver más columnas
            </p>
          </section>

          {/* SECCIÓN 7 - Firmas */}
          <section id="firmas" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              ✍️ FIRMAS
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-[#D0D5DD] rounded-lg p-6">
                <h3 className="font-semibold text-[#003366] mb-4">ELABORADO POR</h3>
                <p className="text-sm text-[#344054] mb-3">Docente Líder del Proyecto</p>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] mb-3" placeholder="Nombre" />
                <div>
                  <label className="block text-[#344054] text-sm mb-2">Fecha</label>
                  <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
              </div>

              <div className="border border-[#D0D5DD] rounded-lg p-6">
                <h3 className="font-semibold text-[#003366] mb-4">REVISADO POR</h3>
                <p className="text-sm text-[#344054] mb-3">Decano de Unidad</p>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] mb-3" placeholder="Nombre" />
                <div>
                  <label className="block text-[#344054] text-sm mb-2">Fecha</label>
                  <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
              </div>

              <div className="border border-[#D0D5DD] rounded-lg p-6">
                <h3 className="font-semibold text-[#003366] mb-4">APROBADO</h3>
                <p className="text-sm text-[#344054] mb-3">Dirección de Vinculación</p>
                <input type="text" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366] mb-3" placeholder="Nombre" />
                <div>
                  <label className="block text-[#344054] text-sm mb-2">Fecha</label>
                  <input type="date" className="w-full px-4 py-3 border border-[#D0D5DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003366]" />
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 8 - Anexos */}
          <section id="anexos" className="bg-white rounded-lg border border-[#E1E4E8] p-8 shadow-sm">
            <h2 className="text-[#003366] text-xl font-semibold mb-6 flex items-center gap-2">
              📎 ANEXOS
            </h2>
            <div className="space-y-3 mb-6">
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054]">Acta de entrega-recepción de productos</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054]">Reporte banner de estudiantes</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-[#D0D5DD] rounded-lg hover:bg-[#F5F7FA] cursor-pointer transition-colors">
                <input type="checkbox" className="w-5 h-5 text-[#003366] rounded focus:ring-[#003366]" />
                <span className="text-[#344054]">Convenio / Carta de compromiso</span>
              </label>
            </div>

            <div className="border-2 border-dashed border-[#D0D5DD] rounded-lg p-8 text-center hover:border-[#003366] transition-colors cursor-pointer">
              <FileText size={48} className="mx-auto mb-4 text-[#344054]" />
              <p className="text-[#344054] font-medium mb-2">Adjuntar archivos</p>
              <p className="text-sm text-[#344054]/70">Haga clic para seleccionar o arrastre los archivos aquí</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer Fijo */}
      <footer className="bg-white border-t border-[#E1E4E8] px-6 py-5 shadow-lg flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-white text-[#344054] border-2 border-[#D0D5DD] rounded-lg font-semibold hover:bg-[#F5F7FA] transition-colors"
            >
              Volver
            </button>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#F5F7FA] text-[#344054] border border-[#D0D5DD] rounded-lg font-semibold hover:bg-[#E1E4E8] transition-colors">
                <Save size={20} />
                Guardar borrador
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#12B76A] text-white rounded-lg font-semibold hover:bg-[#0F9C5A] transition-colors">
                <Send size={20} />
                Enviar informe
              </button>
            </div>
          </div>
          <div className="text-center text-sm text-[#344054]/70 pt-4 border-t border-[#E1E4E8]">
            Pontificia Universidad Católica del Ecuador • Av. 12 de Octubre 1076 • Quito, Ecuador • {new Date().toLocaleDateString('es-ES')}
          </div>
        </div>
      </footer>
    </div>
  );
}

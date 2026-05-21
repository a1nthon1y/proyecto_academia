'use client';

import { useState, useMemo } from 'react';
import { useTutores } from '@/hooks/useTutoresTrabajador';
import { useUbicacion } from '@/hooks/useUbicacion';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Search, MapPin, BookOpen, Star, Phone, Mail } from 'lucide-react';
import { DisponibilidadTutor } from '@/components/matriculas/DisponibilidadTutor';

/**
 * Buscador avanzado de tutores con filtros de especialidad y ubicación
 */
export function BuscadorTutores({ onSelect, selectLabel = "Asignar Tutor" }) {
    const { tutores, isLoading: isLoadingTutores } = useTutores();
    const { ciudades, distritos, isLoadingCiudades, isLoadingDistritos, cargarDistritos } = useUbicacion();

    const [filters, setFilters] = useState({
        search: '',
        especialidad: '',
        ciudad_id: '',
        distrito_id: '',
    });

    // Extraer especialidades únicas de la lista de tutores
    const especialidades = useMemo(() => {
        if (!tutores) return [];
        const set = new Set(tutores.map(t => t.especialidad).filter(Boolean));
        return Array.from(set).sort();
    }, [tutores]);

    // Filtrado de la lista
    const filteredTutores = useMemo(() => {
        if (!tutores) return [];
        return tutores.filter(t => {
            const matchSearch = (t.nombres + ' ' + t.apellidos).toLowerCase().includes(filters.search.toLowerCase()) ||
                (t.dni || '').includes(filters.search);
            const matchEspecialidad = !filters.especialidad || t.especialidad === filters.especialidad;

            // El backend devuelve ciudad y distrito como texto en listarTutores, 
            // pero podríamos necesitar los IDs si quisiéramos filtrar por ID exacto.
            // Sin embargo, listarTutores en el service devuelve 'ciudad' y 'distrito' como NOMBRES.
            // Vamos a filtrar por nombre para coincidir con lo que viene del service.

            const ciudadNombre = ciudades.find(c => c.id === Number(filters.ciudad_id))?.nombre;
            const distritoNombre = distritos.find(d => d.id === Number(filters.distrito_id))?.nombre;

            const matchCiudad = !filters.ciudad_id || t.ciudad === ciudadNombre;
            const matchDistrito = !filters.distrito_id || t.distrito === distritoNombre;

            return matchSearch && matchEspecialidad && matchCiudad && matchDistrito;
        });
    }, [tutores, filters, ciudades, distritos]);

    const handleCiudadChange = (id) => {
        setFilters(prev => ({ ...prev, ciudad_id: id, distrito_id: '' }));
        cargarDistritos(id);
    };

    if (isLoadingTutores) return <div className="flex justify-center py-10"><LoadingSpinner /></div>;

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Buscar por nombre o DNI</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Ej: Juan Perez..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-300 focus:ring-navy-500 focus:border-navy-500 text-sm"
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Especialidad</label>
                    <select
                        className="w-full rounded-lg border-slate-300 focus:ring-navy-500 focus:border-navy-500 text-sm"
                        value={filters.especialidad}
                        onChange={(e) => setFilters({ ...filters, especialidad: e.target.value })}
                    >
                        <option value="">Todas</option>
                        {especialidades.map(esp => (
                            <option key={esp} value={esp}>{esp}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Ubicación (Ciudad)</label>
                    <select
                        className="w-full rounded-lg border-slate-300 focus:ring-navy-500 focus:border-navy-500 text-sm"
                        value={filters.ciudad_id}
                        onChange={(e) => handleCiudadChange(e.target.value)}
                    >
                        <option value="">Todas</option>
                        {ciudades.map(c => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>
                </div>

                {filters.ciudad_id && (
                    <div className="md:col-start-4">
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-1 block">Distrito</label>
                        <select
                            className="w-full rounded-lg border-slate-300 focus:ring-navy-500 focus:border-navy-500 text-sm"
                            value={filters.distrito_id}
                            onChange={(e) => setFilters({ ...filters, distrito_id: e.target.value })}
                            disabled={isLoadingDistritos}
                        >
                            <option value="">Todos</option>
                            {distritos.map(d => (
                                <option key={d.id} value={d.id}>{d.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Resultados */}
            <div className="grid gap-4 md:grid-cols-2">
                {filteredTutores.length === 0 ? (
                    <div className="md:col-span-2 text-center py-10 text-slate-500">
                        No se encontraron tutores con los criterios seleccionados.
                    </div>
                ) : (
                    filteredTutores.map(tutor => (
                        <div key={tutor.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition group">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-slate-800 group-hover:text-navy-600 transition tracking-tight">
                                        {tutor.apellidos}, {tutor.nombres}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="inline-flex items-center gap-1 bg-navy-50 text-navy-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-navy-100 uppercase">
                                            <BookOpen className="h-3 w-3" />
                                            {tutor.especialidad || 'General'}
                                        </span>
                                        {tutor.nivel && (
                                            <span className="text-[10px] text-slate-500 font-medium italic">
                                                Nivel: {tutor.nivel}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-green-50 text-green-700 p-1.5 rounded-lg border border-green-100">
                                    <Star className="h-4 w-4 fill-green-600" />
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-slate-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span>{tutor.distrito || 'Sin distrito'}, {tutor.ciudad || 'Sin ciudad'}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="text-xs">{tutor.telefono || 'Sin tel.'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                                        <span className="text-xs truncate max-w-[120px]">{tutor.email || 'Sin email'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Disponibilidad compacta */}
                            <DisponibilidadTutor tutorId={tutor.id} compact />

                            <button
                                onClick={() => onSelect(tutor)}
                                className="w-full mt-3 py-2 bg-navy-600 text-white text-sm font-semibold rounded-lg hover:bg-navy-700 transition shadow-sm"
                            >
                                {selectLabel}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


import { useState, useEffect } from 'react';
import { listarCiudades, listarDistritosPorCiudad } from '@/services/ubicacionService';
import { toast } from 'sonner';

export function useUbicacion() {
    const [ciudades, setCiudades] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [isLoadingCiudades, setIsLoadingCiudades] = useState(false);
    const [isLoadingDistritos, setIsLoadingDistritos] = useState(false);

    useEffect(() => {
        cargarCiudades();
    }, []);

    const cargarCiudades = async () => {
        setIsLoadingCiudades(true);
        try {
            const data = await listarCiudades();
            setCiudades(data);
        } catch (error) {
            console.error('Error al cargar ciudades:', error);
            toast.error('Error al cargar lista de ciudades');
        } finally {
            setIsLoadingCiudades(false);
        }
    };

    const cargarDistritos = async (ciudadId) => {
        if (!ciudadId || ciudadId === "") {
            setDistritos([]);
            return;
        }

        setIsLoadingDistritos(true);
        try {
            const data = await listarDistritosPorCiudad(ciudadId);
            setDistritos(data);
        } catch (error) {
            console.error('Error al cargar distritos:', error);
            toast.error('Error al cargar lista de distritos');
        } finally {
            setIsLoadingDistritos(false);
        }
    };

    return {
        ciudades,
        distritos,
        isLoadingCiudades,
        isLoadingDistritos,
        cargarDistritos
    };
}

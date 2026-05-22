import { useState, useEffect, useCallback } from 'react';
import { listarCiudades, listarDistritosPorCiudad } from '@/services/ubicacionService';
import { toast } from 'sonner';

export function useUbicacion() {
    const [ciudades, setCiudades] = useState([]);
    const [distritos, setDistritos] = useState([]);
    const [isLoadingCiudades, setIsLoadingCiudades] = useState(false);
    const [isLoadingDistritos, setIsLoadingDistritos] = useState(false);

    // useCallback para que la referencia de la función sea estable entre renders.
    // Sin esto, cualquier useEffect que dependa de cargarDistritos entra en loop.
    const cargarCiudades = useCallback(async () => {
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
    }, []);

    const cargarDistritos = useCallback(async (ciudadId) => {
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
    }, []);

    useEffect(() => {
        cargarCiudades();
    }, [cargarCiudades]);

    return {
        ciudades,
        distritos,
        isLoadingCiudades,
        isLoadingDistritos,
        cargarDistritos,
    };
}

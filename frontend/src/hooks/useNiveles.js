
import { useState, useEffect } from 'react';
import { listarNiveles } from '@/services/nivelesService';
import { toast } from 'sonner';

export function useNiveles() {
    const [niveles, setNiveles] = useState([]);
    const [isLoadingNiveles, setIsLoadingNiveles] = useState(false);

    useEffect(() => {
        cargarNiveles();
    }, []);

    const cargarNiveles = async () => {
        setIsLoadingNiveles(true);
        try {
            const data = await listarNiveles();
            setNiveles(data);
        } catch (error) {
            console.error('Error al cargar niveles:', error);
            toast.error('Error al cargar lista de niveles');
        } finally {
            setIsLoadingNiveles(false);
        }
    };

    return {
        niveles,
        isLoadingNiveles,
        refetchNiveles: cargarNiveles
    };
}

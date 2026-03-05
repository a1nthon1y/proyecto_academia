
import { useState, useEffect } from 'react';
import { listarBancos } from '@/services/bancosService';
import { toast } from 'sonner';

export function useBancos() {
    const [bancos, setBancos] = useState([]);
    const [isLoadingBancos, setIsLoadingBancos] = useState(false);

    useEffect(() => {
        cargarBancos();
    }, []);

    const cargarBancos = async () => {
        setIsLoadingBancos(true);
        try {
            const data = await listarBancos();
            setBancos(data);
        } catch (error) {
            console.error('Error al cargar bancos:', error);
            toast.error('Error al cargar lista de bancos');
        } finally {
            setIsLoadingBancos(false);
        }
    };

    return {
        bancos,
        isLoadingBancos,
        refetchBancos: cargarBancos
    };
}

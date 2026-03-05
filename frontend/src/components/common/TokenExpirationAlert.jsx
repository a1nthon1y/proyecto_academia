'use client';

import { useState, useEffect } from 'react';
import { Alert, Button } from 'antd';
import { ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

export const TokenExpirationAlert = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const handleLogout = () => {
    try {
      // Limpiar localStorage
      authService.logout();
      
      toast.success('Sesión cerrada correctamente');
      
      // Usar window.location.href para evitar conflictos
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (!authService.isAuthenticated()) {
        setShowAlert(false);
        return;
      }

      const tokenInfo = authService.getTokenInfo();
      if (!tokenInfo) {
        setShowAlert(false);
        return;
      }

      const currentTime = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = tokenInfo.exp - currentTime;
      
      // Mostrar alerta si faltan menos de 10 minutos
      if (timeUntilExpiry < 600 && timeUntilExpiry > 0) {
        setShowAlert(true);
        setTimeLeft(timeUntilExpiry);
      } else if (timeUntilExpiry <= 0) {
        // Token ya expiró
        setShowAlert(false);
        handleLogout();
      } else {
        setShowAlert(false);
      }
    };

    // Verificar cada minuto
    const interval = setInterval(checkTokenExpiration, 60000);
    
    // Verificar inmediatamente
    checkTokenExpiration();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showAlert && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowAlert(false);
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showAlert, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleRefreshSession = () => {
    // Aquí podrías implementar un refresh token si el backend lo soporta
    toast.info('Por favor, inicie sesión nuevamente para renovar su sesión.');
    handleLogout();
  };

  if (!showAlert) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <Alert
        message="Sesión próxima a expirar"
        description={
          <div className="space-y-2">
            <p>
              Su sesión expirará en <strong>{formatTime(timeLeft)}</strong>.
            </p>
            <p className="text-sm text-gray-600">
              Para evitar perder su trabajo, inicie sesión nuevamente.
            </p>
          </div>
        }
        type="warning"
        showIcon
        icon={<ExclamationCircleOutlined />}
        action={
          <Button
            size="small"
            type="primary"
            icon={<ReloadOutlined />}
            onClick={handleRefreshSession}
          >
            Renovar Sesión
          </Button>
        }
        closable
        onClose={() => setShowAlert(false)}
      />
    </div>
  );
};

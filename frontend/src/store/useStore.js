import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/services/authService';

const useStore = create(
  persist(
    (set, get) => ({
      // Estado de autenticación
      user: null,
      token: null,
      isAuthenticated: false,
      hydrated: false,

      // Estado de la UI
      sidebarOpen: true,
      notifications: [],

      // Acciones de autenticación
      login: async (credentials) => {
        try {
          const response = await authService.login(credentials);
          set({ 
            user: response.user,
            token: response.token,
            isAuthenticated: true
          });
          return response;
        } catch (error) {
          set({ user: null, token: null, isAuthenticated: false });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          sidebarOpen: true
        });
      },

      // Acciones de UI
      toggleSidebar: () => set((state) => ({ 
        sidebarOpen: !state.sidebarOpen 
      })),
      
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id: Date.now() }],
        })),
        
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      // Estado de carga
      loading: false,
      setLoading: (loading) => set({ loading }),

      // Estado de errores
      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Obtener header de autorización
      getAuthHeader: () => {
        const token = authService.getToken();
        return token ? `Bearer ${token}` : null;
      },

      // Verificación de autenticación
      checkAuth: () => {
        const state = get();
        if (!state.isAuthenticated || !state.token) {
          return false;
        }
        return authService.isAuthenticated();
      },

      // Inicialización del estado
      initializeAuth: () => {
        const user = authService.getUser();
        const token = authService.getToken();
        if (user && token) {
          set({
            user,
            token,
            isAuthenticated: true
          });
          return true;
        }
        return false;
      },

      // Acciones de hidratación
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'Deoxy Academia-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Verificar autenticación después de hidratar
        const isAuthenticated = authService.isAuthenticated();
        const user = authService.getUser();
        const token = authService.getToken();

        if (state) {
          state.setHydrated();
          
          if (!isAuthenticated) {
            state.logout();
          } else if (user && token) {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
          }
        }
      },
    }
  )
);

// Inicializar el estado de autenticación al cargar
if (typeof window !== 'undefined') {
  useStore.getState().initializeAuth();
}

export default useStore; 
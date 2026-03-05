export function LoadingSpinner() {
  return (
    <div className="inline-flex items-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
      <span className="ml-2 text-gray-700">Cargando...</span>
    </div>
  );
} 
'use client';

import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function Form({
  onSubmit,
  fields,
  defaultValues = {},
  submitText = 'Guardar',
  isLoading = false
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues
  });

  const processSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
      toast.success('Operación exitosa');
    } catch (error) {
      toast.error(error.message || 'Error al procesar la operación');
    }
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-6">
      {fields.map((field) => (
        <div key={field.name}>
          <label
            htmlFor={field.name}
            className="block text-sm font-medium text-gray-700"
          >
            {field.label}
          </label>
          <div className="mt-1">
            {field.type === 'select' ? (
              <select
                id={field.name}
                {...register(field.name, field.validation)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Seleccione una opción</option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                id={field.name}
                {...register(field.name, field.validation)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            ) : (
              <input
                type={field.type || 'text'}
                id={field.name}
                {...register(field.name, field.validation)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            )}
          </div>
          {errors[field.name] && (
            <p className="mt-1 text-sm text-red-600">
              {errors[field.name].message}
            </p>
          )}
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isLoading ? 'Procesando...' : submitText}
        </button>
      </div>
    </form>
  );
} 
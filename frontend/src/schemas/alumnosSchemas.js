import { z } from 'zod';

const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/;

/**
 * Schema de validación para registro de alumno
 */
export const alumnoSchema = z.object({
  dni: z
    .string({ required_error: 'Ingresa el DNI' })
    .min(1, 'El DNI es obligatorio')
    .length(8, 'El DNI debe tener exactamente 8 dígitos (Ej: 12345678)')
    .regex(/^\d{8}$/, 'El DNI solo puede contener números'),

  nombres: z
    .string({ required_error: 'Ingresa los nombres' })
    .trim()
    .min(2, 'Los nombres deben tener al menos 2 caracteres')
    .max(100, 'Los nombres no pueden exceder 100 caracteres')
    .regex(REGEX_NOMBRE, 'Solo se permiten letras, tildes y espacios'),

  apellidos: z
    .string({ required_error: 'Ingresa los apellidos' })
    .trim()
    .min(2, 'Los apellidos deben tener al menos 2 caracteres')
    .max(100, 'Los apellidos no pueden exceder 100 caracteres')
    .regex(REGEX_NOMBRE, 'Solo se permiten letras, tildes y espacios'),

  fecha_nacimiento: z
    .string({ required_error: 'Ingresa la fecha de nacimiento' })
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida')
    .refine((val) => new Date(val) <= new Date(), 'La fecha de nacimiento no puede ser futura')
    .refine(
      (val) => {
        const fecha = new Date(val);
        const hace100Anios = new Date();
        hace100Anios.setFullYear(hace100Anios.getFullYear() - 100);
        return fecha >= hace100Anios;
      },
      'La fecha de nacimiento parece muy antigua (más de 100 años)'
    ),

  padre_id: z
    .string({ required_error: 'Selecciona un padre de familia' })
    .min(1, 'Debes seleccionar un padre de familia')
    .refine((val) => !isNaN(parseInt(val)), 'Selección inválida'),

  grado: z
    .string()
    .max(50, 'El grado no puede exceder 50 caracteres')
    .optional()
    .or(z.literal('')),

  nivel_id: z.string().optional().or(z.literal('')),
  ciudad_id: z.string().optional().or(z.literal('')),
  distrito_id: z.string().optional().or(z.literal('')),
});

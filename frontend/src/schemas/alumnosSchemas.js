
import { z } from 'zod';

/**
 * Schema de validación para registro de alumno
 * - DNI: 8 dígitos numéricos (obligatorio)
 * - Nombres/Apellidos: min 2 chars (obligatorio)
 * - Fecha Nacimiento: obligatoria, no futura
 * - Padre ID: numérico (obligatorio)
 */
export const alumnoSchema = z.object({
    dni: z
        .string()
        .min(1, 'El DNI es obligatorio')
        .length(8, 'El DNI debe tener exactamente 8 dígitos')
        .regex(/^\d{8}$/, 'El DNI debe contener solo números'),

    nombres: z
        .string()
        .min(1, 'Los nombres son obligatorios')
        .min(2, 'Los nombres deben tener al menos 2 caracteres')
        .max(100, 'Los nombres no pueden exceder 100 caracteres'),

    apellidos: z
        .string()
        .min(1, 'Los apellidos son obligatorios')
        .min(2, 'Los apellidos deben tener al menos 2 caracteres')
        .max(100, 'Los apellidos no pueden exceder 100 caracteres'),

    fecha_nacimiento: z
        .string()
        .min(1, 'La fecha de nacimiento es obligatoria')
        .refine((val) => !isNaN(Date.parse(val)), 'Fecha inválida')
        .refine((val) => new Date(val) <= new Date(), 'La fecha de nacimiento no puede ser futura'),

    padre_id: z
        .string()
        .min(1, 'Debes seleccionar un padre de familia')
        .refine((val) => !isNaN(parseInt(val)), 'ID de padre inválido'),

    // Campos opcionales pero recomendados
    grado: z
        .string()
        .max(50, 'El grado no puede exceder 50 caracteres')
        .optional()
        .or(z.literal('')),

    nivel_id: z
        .string()
        .optional()
        .or(z.literal('')),

    ciudad_id: z
        .string()
        .optional()
        .or(z.literal('')),

    distrito_id: z
        .string()
        .optional()
        .or(z.literal(''))
});

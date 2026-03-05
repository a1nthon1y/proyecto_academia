import { z } from 'zod';

/**
 * Schema de validación para registro de padre
 * Todos los campos son obligatorios según requisitos del negocio
 */
export const padreSchema = z.object({
    // Datos obligatorios
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

    email: z
        .string()
        .min(1, 'El email es obligatorio')
        .email('El email no es válido')
        .max(120, 'El email no puede exceder 120 caracteres'),

    telefono: z
        .string()
        .min(1, 'El teléfono es obligatorio')
        .min(7, 'El teléfono debe tener al menos 7 dígitos')
        .max(20, 'El teléfono no puede exceder 20 caracteres')
        .regex(/^[\d\s\+\-\(\)]+$/, 'El teléfono solo puede contener números, espacios y símbolos +, -, (, )'),

    // Contraseña opcional (si no se proporciona, se genera automáticamente)
    password: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.length >= 6,
            'La contraseña debe tener al menos 6 caracteres'
        ),

    // Flag para indicar si se usa contraseña automática
    useAutoPassword: z.boolean().default(true),
});

/**
 * Schema de validación para registro de tutor
 * Todos los campos básicos son obligatorios
 * Campos profesionales y bancarios son opcionales pero validados si se proporcionan
 */
export const tutorSchema = z.object({
    // Datos obligatorios básicos
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

    email: z
        .string()
        .min(1, 'El email es obligatorio')
        .email('El email no es válido')
        .max(120, 'El email no puede exceder 120 caracteres'),

    telefono: z
        .string()
        .min(1, 'El teléfono es obligatorio')
        .min(7, 'El teléfono debe tener al menos 7 dígitos')
        .max(20, 'El teléfono no puede exceder 20 caracteres')
        .regex(/^[\d\s\+\-\(\)]+$/, 'El teléfono solo puede contener números, espacios y símbolos +, -, (, )'),

    direccion: z
        .string()
        .min(1, 'La dirección es obligatoria')
        .min(10, 'La dirección debe tener al menos 10 caracteres')
        .max(500, 'La dirección no puede exceder 500 caracteres'),

    // Información profesional (opcional pero validada)
    especialidad: z
        .string()
        .max(100, 'La especialidad no puede exceder 100 caracteres')
        .optional()
        .or(z.literal('')),

    nivel_id: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(parseInt(val)),
            'El nivel educativo debe ser un número válido'
        )
        .or(z.literal('')),

    tarifa_por_sesion: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(parseFloat(val)),
            'La tarifa debe ser un número válido'
        )
        .refine(
            (val) => !val || parseFloat(val) >= 0,
            'La tarifa no puede ser negativa'
        )
        .or(z.literal('')),

    ciudad_id: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(parseInt(val)),
            'La ciudad debe ser un número válido'
        )
        .or(z.literal('')),

    distrito_id: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(parseInt(val)),
            'El distrito debe ser un número válido'
        )
        .or(z.literal('')),

    // Información bancaria (opcional)
    banco_id: z
        .string()
        .optional()
        .refine(
            (val) => !val || !isNaN(parseInt(val)),
            'El banco debe ser un número válido'
        )
        .or(z.literal('')),

    cuenta_bancaria: z
        .string()
        .max(30, 'La cuenta bancaria no puede exceder 30 caracteres')
        .optional()
        .or(z.literal('')),

    // Contraseña opcional
    password: z
        .string()
        .optional()
        .refine(
            (val) => !val || val.length >= 6,
            'La contraseña debe tener al menos 6 caracteres'
        ),

    useAutoPassword: z.boolean().default(true),
});

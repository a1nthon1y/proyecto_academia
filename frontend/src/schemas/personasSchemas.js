import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Reglas compartidas con mensajes accionables
// ─────────────────────────────────────────────────────────────

// Permite letras (incluye tildes/ñ), apóstrofes y espacios. No números ni símbolos raros.
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]+$/;

// Teléfono Perú: 9 dígitos para celular (empieza con 9) o 6-8 para fijos. Aceptamos espacios.
const REGEX_TELEFONO_PE = /^[\d\s\+\-\(\)]+$/;

const dniSchema = z
  .string({ required_error: 'Ingresa el DNI' })
  .min(1, 'El DNI es obligatorio')
  .length(8, 'El DNI debe tener exactamente 8 dígitos (Ej: 12345678)')
  .regex(/^\d{8}$/, 'El DNI solo puede contener números');

const nombresSchema = z
  .string({ required_error: 'Ingresa los nombres' })
  .trim()
  .min(2, 'Los nombres deben tener al menos 2 caracteres')
  .max(100, 'Los nombres no pueden exceder 100 caracteres')
  .regex(REGEX_NOMBRE, 'Solo se permiten letras, tildes y espacios (sin números ni símbolos)');

const apellidosSchema = z
  .string({ required_error: 'Ingresa los apellidos' })
  .trim()
  .min(2, 'Los apellidos deben tener al menos 2 caracteres')
  .max(100, 'Los apellidos no pueden exceder 100 caracteres')
  .regex(REGEX_NOMBRE, 'Solo se permiten letras, tildes y espacios (sin números ni símbolos)');

const emailSchema = z
  .string({ required_error: 'Ingresa el email' })
  .trim()
  .min(1, 'El email es obligatorio')
  .email('Formato inválido (Ej: usuario@dominio.com)')
  .max(120, 'El email no puede exceder 120 caracteres');

const telefonoSchema = z
  .string({ required_error: 'Ingresa el teléfono' })
  .trim()
  .min(7, 'El teléfono debe tener al menos 7 dígitos')
  .max(20, 'El teléfono no puede exceder 20 caracteres')
  .regex(REGEX_TELEFONO_PE, 'Solo números, espacios y los símbolos + - ( )')
  .refine(
    (val) => {
      const soloDigitos = val.replace(/\D/g, '');
      // Celular peruano: 9 dígitos empezando en 9
      if (soloDigitos.length === 9) return soloDigitos.startsWith('9');
      // Fijo: entre 7 y 8 dígitos
      return soloDigitos.length >= 7 && soloDigitos.length <= 8;
    },
    'Celular debe tener 9 dígitos empezando con 9 (Ej: 987654321). Fijos entre 7 y 8 dígitos.'
  );

const passwordOpcionalSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || val.length >= 6,
    'La contraseña debe tener al menos 6 caracteres'
  );

const idOpcionalSchema = (label) =>
  z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(parseInt(val)),
      `${label} inválido`
    )
    .or(z.literal(''));

// ─────────────────────────────────────────────────────────────
// Schema de PADRE
// ─────────────────────────────────────────────────────────────
export const padreSchema = z.object({
  dni: dniSchema,
  nombres: nombresSchema,
  apellidos: apellidosSchema,
  email: emailSchema,
  telefono: telefonoSchema,
  password: passwordOpcionalSchema,
  useAutoPassword: z.boolean().default(true),
});

// ─────────────────────────────────────────────────────────────
// Schema de TUTOR
// ─────────────────────────────────────────────────────────────
export const tutorSchema = z.object({
  dni: dniSchema,
  nombres: nombresSchema,
  apellidos: apellidosSchema,
  email: emailSchema,
  telefono: telefonoSchema,

  direccion: z
    .string({ required_error: 'Ingresa la dirección' })
    .trim()
    .min(10, 'La dirección debe tener al menos 10 caracteres (Ej: Av. Los Álamos 123)')
    .max(500, 'La dirección no puede exceder 500 caracteres'),

  especialidad: z
    .string()
    .max(100, 'La especialidad no puede exceder 100 caracteres')
    .optional()
    .or(z.literal('')),

  nivel_id: idOpcionalSchema('Nivel educativo'),

  tarifa_por_sesion: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(parseFloat(val)), 'La tarifa debe ser un número (Ej: 25.50)')
    .refine((val) => !val || parseFloat(val) >= 0, 'La tarifa no puede ser negativa')
    .refine((val) => !val || parseFloat(val) <= 1000, 'La tarifa parece muy alta (máximo S/. 1000)')
    .or(z.literal('')),

  ciudad_id: idOpcionalSchema('Ciudad'),
  distrito_id: idOpcionalSchema('Distrito'),
  banco_id: idOpcionalSchema('Banco'),

  cuenta_bancaria: z
    .string()
    .max(30, 'La cuenta bancaria no puede exceder 30 caracteres')
    .optional()
    .or(z.literal('')),

  password: passwordOpcionalSchema,
  useAutoPassword: z.boolean().default(true),
});

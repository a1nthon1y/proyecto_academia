'use client';

import { useState } from 'react';
import { Check, Copy, Printer, X, Eye, EyeOff } from 'lucide-react';

/**
 * Componente para mostrar credenciales generadas
 * Muestra username y password con opciones para copiar e imprimir
 */
export function CredencialesDisplay({ credenciales, onClose, tipo = 'PADRE' }) {
    const [copiedField, setCopiedField] = useState(null);
    const [showPassword, setShowPassword] = useState(true);

    const copyToClipboard = async (text, field) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=600,height=400');
        printWindow.document.write(`
      <html>
        <head>
          <title>Credenciales de Acceso</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              line-height: 1.6;
            }
            h1 {
              color: #1e40af;
              border-bottom: 2px solid #1e40af;
              padding-bottom: 10px;
            }
            .credential {
              margin: 20px 0;
              padding: 15px;
              background: #f3f4f6;
              border-radius: 8px;
            }
            .label {
              font-weight: bold;
              color: #374151;
            }
            .value {
              font-size: 18px;
              color: #111827;
              font-family: monospace;
            }
            .warning {
              margin-top: 30px;
              padding: 15px;
              background: #fef3c7;
              border-left: 4px solid #f59e0b;
              color: #92400e;
            }
          </style>
        </head>
        <body>
          <h1>Credenciales de Acceso - ${tipo}</h1>
          <div class="credential">
            <div class="label">Usuario:</div>
            <div class="value">${credenciales.username}</div>
          </div>
          <div class="credential">
            <div class="label">Contraseña:</div>
            <div class="value">${credenciales.password}</div>
          </div>
          <div class="warning">
            <strong>⚠️ IMPORTANTE:</strong> Guarde estas credenciales en un lugar seguro. 
            La contraseña no podrá ser recuperada posteriormente.
          </div>
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-200 p-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            ✅ Registro Exitoso
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Credenciales de acceso generadas
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* Warning Alert */}
                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                        <div className="flex gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-amber-900">
                                    Importante: Guarde estas credenciales
                                </p>
                                <p className="text-xs text-amber-700 mt-1">
                                    La contraseña no podrá ser recuperada después de cerrar esta ventana.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Username Field */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Usuario
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-3">
                                <p className="font-mono text-lg font-semibold text-slate-900">
                                    {credenciales.username}
                                </p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(credenciales.username, 'username')}
                                className="flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-navy-500 hover:bg-navy-50 hover:text-navy-700"
                            >
                                {copiedField === 'username' ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        <span className="hidden sm:inline">Copiado</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" />
                                        <span className="hidden sm:inline">Copiar</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                            Contraseña
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-3 flex items-center gap-2">
                                <p className="flex-1 font-mono text-lg font-semibold text-slate-900">
                                    {showPassword ? credenciales.password : '••••••••'}
                                </p>
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="text-slate-400 hover:text-slate-600 transition"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            <button
                                onClick={() => copyToClipboard(credenciales.password, 'password')}
                                className="flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-navy-500 hover:bg-navy-50 hover:text-navy-700"
                            >
                                {copiedField === 'password' ? (
                                    <>
                                        <Check className="h-4 w-4" />
                                        <span className="hidden sm:inline">Copiado</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-4 w-4" />
                                        <span className="hidden sm:inline">Copiar</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-slate-200 p-6">
                    <button
                        onClick={handlePrint}
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                        <Printer className="h-4 w-4" />
                        Imprimir
                    </button>
                    <button
                        onClick={onClose}
                        className="btn-primary flex-1"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-soft text-slate-900">
      {/* HEADER STICKY */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Academia Lumen Tutoria"
              width={200}
              height={120}
              className="h-12 w-auto object-contain drop-shadow-md"
              priority
            />
            <div className="hidden flex-col leading-tight sm:flex">
              <span className="text-base font-semibold tracking-tight text-brand-navy">
                Academia Lumen
              </span>
              <span className="text-xs text-slate-500">
                Tutoría personalizada
              </span>
            </div>
          </div>

          {/* Navegación */}
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <Link href="#inicio" className="hover:text-brand-navy">
              Inicio
            </Link>
            <Link href="#metodo" className="hover:text-brand-navy">
              Nuestro Método
            </Link>
            <Link href="#niveles" className="hover:text-brand-navy">
              Niveles
            </Link>
            <Link href="#testimonios" className="hover:text-brand-navy">
              Testimonios
            </Link>
          </div>

          {/* Botones */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-brand-navy shadow-sm hover:border-brand-navy hover:text-brand-navy md:px-4 md:text-sm"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="#cta"
              className="hidden rounded-full bg-navy-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-navy-700 md:inline-flex md:text-sm"
            >
              Agenda tu Asesoría
            </Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <main id="inicio" className="bg-gradient-to-b from-brand-soft via-white to-brand-sand/40">
        <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:flex-row lg:items-center lg:px-8 lg:pb-24 lg:pt-16">
          {/* Columna texto */}
          <div className="max-w-xl space-y-6">
            <p className="inline-flex items-center rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700 ring-1 ring-navy-100">
              Acompañamos el camino académico de tu hijo, paso a paso.
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl lg:text-5xl">
              El éxito académico de tu hijo,
              <span className="block text-navy-600">diseñado a su medida.</span>
            </h1>
            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Tutoría 100% personalizada que identifica sus barreras de aprendizaje y potencia sus
              fortalezas únicas. Olvídate de las clases genéricas: aquí cada sesión tiene un
              propósito claro y medible.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="#cta"
                className="inline-flex items-center justify-center rounded-full bg-navy-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-navy-700"
              >
                Quiero un plan personalizado
              </Link>
              <Link
                href="#metodo"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-brand-navy hover:border-brand-navy"
              >
                Ver cómo funciona
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-600 sm:text-sm">
              <div>
                <p className="font-semibold text-brand-navy">Para padres de familia</p>
                <p>
                  Entiende qué está pasando con las notas de tu hijo y recibe un plan claro de
                  acción.
                </p>
              </div>
              <div>
                <p className="font-semibold text-brand-navy">Para estudiantes</p>
                <p>
                  Sesiones dinámicas, cercanas y enfocadas en recuperar seguridad y confianza en sí
                  mismos.
                </p>
              </div>
            </div>
          </div>

          {/* Columna imagen hero */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-3xl bg-navy-100/50 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl">
              <Image
                src="/imgs pagina web/imagen banner 1.png"
                alt="Tutora acompañando a estudiante frente a una laptop"
                width={640}
                height={480}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* NUESTRO MÉTODO */}
        <section
          id="metodo"
          className="border-t border-slate-100 bg-white/80 py-16 backdrop-blur-sm sm:py-20"
        >
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">
              ¿Por qué nuestra metodología funciona?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              No todas las dificultades académicas se resuelven con más tareas. Primero entendemos
              la raíz del problema, luego construimos un plan que sí encaja con tu hijo.
            </p>

            <div className="mt-10 flex justify-center">
              <div className="max-w-xl overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-md">
                <Image
                  src="/imgs pagina web/metodologia.png"
                  alt="Iconos del método de trabajo de la academia"
                  width={800}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="mt-10 grid gap-6 text-left text-sm text-slate-600 md:grid-cols-3">
              <div className="rounded-2xl bg-brand-soft p-5 ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-600">
                  Paso 1
                </p>
                <h3 className="mt-1 text-base font-semibold text-brand-navy">Diagnóstico claro</h3>
                <p className="mt-2">
                  Evaluamos su situación académica, hábitos de estudio y estilo de aprendizaje para
                  entender qué está fallando realmente.
                </p>
              </div>
              <div className="rounded-2xl bg-brand-soft p-5 ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-600">
                  Paso 2
                </p>
                <h3 className="mt-1 text-base font-semibold text-brand-navy">Match perfecto</h3>
                <p className="mt-2">
                  Asignamos al tutor ideal según sus necesidades: carácter, área académica y
                  objetivos del padre de familia.
                </p>
              </div>
              <div className="rounded-2xl bg-brand-soft p-5 ring-1 ring-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-600">
                  Paso 3
                </p>
                <h3 className="mt-1 text-base font-semibold text-brand-navy">Plan flexible</h3>
                <p className="mt-2">
                  Diseñamos un plan de trabajo con metas por semana y reportes periódicos para que
                  siempre sepas cómo va avanzando.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* NIVELES EDUCATIVOS */}
        <section
          id="niveles"
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20"
        >
          <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">
                Apoyo para cada etapa escolar.
              </h2>
              <p className="mt-3 text-sm text-slate-600 sm:text-base">
                Desde los primeros años hasta la preparación para la universidad, adaptamos la
                tutoría al momento de vida de cada estudiante.
              </p>
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-navy-500" />
                  Primaria: bases sólidas en lectura, escritura y razonamiento lógico.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-navy-500" />
                  Secundaria: organización, manejo de carga académica y preparación de exámenes.
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-navy-500" />
                  Preuniversitario: acompañamiento estratégico en cursos clave y simulacros.
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg">
              <Image
                src="/imgs pagina web/niveles de educación.png"
                alt="Niveles escolares: niños, adolescentes y jóvenes estudiando"
                width={900}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* TESTIMONIO */}
        <section
          id="testimonios"
          className="border-y border-slate-100 bg-brand-sand/60 py-16 sm:py-20"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
            {/* Imagen testimonio */}
            <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg">
              <Image
                src="/imgs pagina web/testimonio 1.png"
                alt="Madre de familia sonriendo"
                width={600}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Texto testimonio */}
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-navy-700">
                Lo que dicen los padres de familia
              </p>
              <h2 className="mt-2 text-2xl font-bold text-brand-navy sm:text-3xl">
                “Mi hijo volvió a creer en sí mismo.”
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                “Antes de iniciar con Academia Lumen, mi hijo llegaba frustrado a casa. Las tareas
                eran una batalla diaria y sus notas seguían bajando. Después del diagnóstico,
                entendimos qué estaba pasando y el tutor que le asignaron conectó con él desde la
                primera sesión. Hoy ya no le teme a los exámenes y, lo más importante, recuperó la
                confianza.”
              </p>
              <p className="mt-4 text-sm font-semibold text-brand-navy">María Rodríguez</p>
              <p className="text-xs text-slate-500">
                Mamá de Diego, 2° de secundaria
              </p>
            </div>
          </div>
        </section>

        {/* CAPTURA DE LEADS / CTA FINAL */}
        <section
          id="cta"
          className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20"
        >
          <div className="grid gap-10 rounded-3xl bg-white p-6 shadow-xl ring-1 ring-slate-100 md:grid-cols-[1.1fr,1fr] md:p-10">
            {/* Imagen videollamada */}
            <div className="order-2 md:order-1">
              <div className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
                <Image
                  src="/imgs pagina web/agenda una llamada.png"
                  alt="Videollamada de asesoría con un tutor"
                  width={900}
                  height={600}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Formulario */}
            <div className="order-1 space-y-5 md:order-2">
              <h2 className="text-2xl font-bold text-brand-navy sm:text-3xl">
                ¿Preocupado por las notas? Hablemos hoy.
              </h2>
              <p className="text-sm text-slate-600 sm:text-base">
                Agenda una videollamada de diagnóstico gratuita de 20 minutos para entender la
                situación de tu hijo y recibir un plan claro, sin compromisos.
              </p>

              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-navy-100 placeholder:text-slate-400 focus:border-navy-500 focus:ring-2"
                      placeholder="Ej. María Rodríguez"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">
                      Email
                    </label>
                    <input
                      type="email"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-navy-100 placeholder:text-slate-400 focus:border-navy-500 focus:ring-2"
                      placeholder="tu@correo.com"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-navy-100 placeholder:text-slate-400 focus:border-navy-500 focus:ring-2"
                      placeholder="+51 999 999 999"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">
                      Nivel escolar
                    </label>
                    <select
                      className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-navy-100 focus:border-navy-500 focus:ring-2"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Selecciona una opción
                      </option>
                      <option value="primaria">Primaria</option>
                      <option value="secundaria">Secundaria</option>
                      <option value="preuniversitario">Preuniversitario</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700">
                    Comentario opcional
                  </label>
                  <textarea
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-navy-100 placeholder:text-slate-400 focus:border-navy-500 focus:ring-2"
                    placeholder="Cuéntanos brevemente qué te preocupa o qué esperas de la tutoría."
                  />
                </div>

                <button
                  type="button"
                  className="mt-2 w-full rounded-full bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-navy-700"
                >
                  Solicitar Diagnóstico Gratuito
                </button>
                <p className="text-[11px] text-slate-500">
                  Nos pondremos en contacto contigo en menos de 24 horas hábiles.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10 text-xs text-slate-600">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
           <div>
             <div className="flex items-center gap-2">
               <Image
                 src="/logo.png"
                 alt="Academia Lumen"
                 width={120}
                 height={120}
                 className="h-10 w-auto object-contain drop-shadow-sm"
               />
               <span className="text-sm font-semibold text-brand-navy">
                 Academia Lumen
               </span>
             </div>
             <p className="mt-3 max-w-xs text-[11px] text-slate-500">
              Tutoría personalizada para que cada estudiante avance con claridad, seguridad y
              acompañamiento cercano.
            </p>
          </div>

          <div className="grid flex-1 gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-xs font-semibold text-brand-navy">Enlaces rápidos</h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="#metodo" className="hover:text-brand-navy">
                    Nuestro método
                  </Link>
                </li>
                <li>
                  <Link href="#niveles" className="hover:text-brand-navy">
                    Niveles educativos
                  </Link>
                </li>
                <li>
                  <Link href="#cta" className="hover:text-brand-navy">
                    Agenda tu asesoría
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-brand-navy">Contacto</h3>
              <ul className="mt-3 space-y-2">
                <li>WhatsApp: +51 999 999 999</li>
                <li>Email: contacto@academialumen.com</li>
                <li>Lima, Perú</li>
              </ul>
            </div>

             <div>
               <h3 className="text-xs font-semibold text-brand-navy">
                 Síguenos
               </h3>
               <ul className="mt-3 space-y-2">
                 <li>
                   <button
                     type="button"
                     className="flex items-center gap-2 text-xs text-slate-600 hover:text-brand-navy"
                   >
                     <Facebook className="h-4 w-4" aria-hidden="true" />
                     <span>Facebook</span>
                   </button>
                 </li>
                 <li>
                   <button
                     type="button"
                     className="flex items-center gap-2 text-xs text-slate-600 hover:text-brand-navy"
                   >
                     <Instagram className="h-4 w-4" aria-hidden="true" />
                     <span>Instagram</span>
                   </button>
                 </li>
                 <li>
                   <button
                     type="button"
                     className="flex items-center gap-2 text-xs text-slate-600 hover:text-brand-navy"
                   >
                     <Youtube className="h-4 w-4" aria-hidden="true" />
                     <span>YouTube</span>
                   </button>
                 </li>
               </ul>
             </div>
          </div>
        </div>
        <div className="mt-6 border-t border-slate-100 pt-4 text-center text-[11px] text-slate-400">
          <span>
            © {new Date().getFullYear()} Academia Lumen. Todos los derechos reservados. ·{' '}
          </span>
          <Link href="/politica-privacidad" className="hover:text-brand-navy">
            Política de Privacidad
          </Link>
        </div>
      </footer>
    </div>
  );
}

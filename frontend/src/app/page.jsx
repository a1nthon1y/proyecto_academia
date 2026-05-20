'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Facebook, Instagram, Youtube, Menu, X,
  CheckCircle2, Star, ArrowRight, Phone,
  BookOpen, GraduationCap, Target, Sparkles,
  MessageCircle, MapPin, Mail, ChevronRight,
  Users, Trophy, Clock, Heart,
} from 'lucide-react';
import environment from '@/config/environment';

/* ── Datos estáticos ─────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Inicio',       href: '#inicio' },
  { label: 'Metodología',  href: '#metodo' },
  { label: 'Tutores',      href: '#tutores' },
  { label: 'Niveles',      href: '#niveles' },
  { label: 'Testimonios',  href: '#testimonios' },
  { label: 'Contacto',     href: '#cta' },
];

const STATS = [
  { value: '+200',  label: 'Estudiantes atendidos', icon: Users },
  { value: '95%',   label: 'Tasa de satisfacción',  icon: Trophy },
  { value: '+30',   label: 'Tutores especializados', icon: GraduationCap },
  { value: '5 años',label: 'De experiencia',         icon: Clock },
];

const STEPS = [
  {
    n: '01', icon: Target,
    title: 'Diagnóstico inicial',
    desc: 'Evaluamos el nivel académico, estilo de aprendizaje y objetivos del estudiante para entender exactamente qué necesita.',
  },
  {
    n: '02', icon: Sparkles,
    title: 'Match con el tutor ideal',
    desc: 'Asignamos al tutor que mejor conecta con su personalidad, ritmo y área de dificultad. No hay tutoría genérica.',
  },
  {
    n: '03', icon: BookOpen,
    title: 'Plan personalizado',
    desc: 'Sesiones con metas claras, reportes semanales y ajustes continuos para que los resultados sean visibles y medibles.',
  },
];

const NIVELES = [
  {
    icon: '🎒', title: 'Primaria',
    desc: 'Bases sólidas en lectura, escritura y razonamiento lógico. Construimos hábitos de estudio desde temprano.',
    materias: ['Matemática', 'Comprensión lectora', 'Lógica'],
  },
  {
    icon: '📚', title: 'Secundaria',
    desc: 'Organización, manejo de carga académica y preparación para exámenes. Acompañamiento constante.',
    materias: ['Algebra', 'Física', 'Química', 'Historia'],
  },
  {
    icon: '🎯', title: 'Preuniversitario',
    desc: 'Estrategia enfocada en los cursos clave del examen de admisión. Simulacros y refuerzo intensivo.',
    materias: ['Razonamiento matemático', 'Verbal', 'Ciencias'],
  },
];

/* ── Componente principal ────────────────────────────────────── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm]         = useState({ nombres: '', email: '', telefono: '', nivel: '', mensaje: '' });
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombres || !form.telefono) {
      setFormError('El nombre y teléfono son obligatorios.');
      return;
    }
    setSending(true);
    setFormError('');
    try {
      const res = await fetch(`${environment.url_backend}/api/consultas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombres:  form.nombres,
          telefono: form.telefono,
          email:    form.email,
          mensaje:  form.mensaje || `Nivel de interés: ${form.nivel || 'No especificado'}`,
          origen:   'WEB',
        }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setFormError('Hubo un problema al enviar. Intenta por WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur shadow-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="#inicio" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Academia Lumen" width={180} height={60} className="h-10 w-auto object-contain" priority />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-bold text-navy-600">Academia Lumen</span>
              <span className="text-[10px] text-slate-400 tracking-wide">Tutoría personalizada</span>
            </div>
          </Link>

          {/* Nav desktop */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href} className="hover:text-navy-600 transition-colors">{l.label}</Link>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-navy-600 border border-navy-200 px-4 py-2 rounded-full hover:bg-navy-50 transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="#cta" className="inline-flex items-center gap-1.5 bg-navy-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow hover:bg-navy-700 transition-colors">
              Agenda gratis
              <ChevronRight className="h-3 w-3" />
            </Link>
            {/* Hamburger mobile */}
            <button
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menú"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pb-4">
            <div className="flex flex-col gap-1 pt-3">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">
                  {l.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="mt-2 px-4 py-2.5 text-sm font-semibold text-navy-600 border border-navy-200 rounded-xl text-center hover:bg-navy-50">
                Iniciar Sesión
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section id="inicio" className="relative overflow-hidden bg-navy-600">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-navy-500/30 -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gold-500/10 translate-y-1/2 -translate-x-1/3 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 lg:flex lg:items-center lg:gap-12 lg:px-8 lg:pt-24 lg:pb-28">
          {/* Texto */}
          <div className="flex-1 text-white space-y-7">
            <span className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/30 text-gold-300 text-xs font-bold px-4 py-1.5 rounded-full tracking-wide">
              <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
              Tutoría 100% personalizada · Lima, Perú
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight leading-[1.1] sm:text-5xl lg:text-6xl">
              El éxito académico<br />
              <span className="text-gold-400">de tu hijo,</span><br />
              diseñado a su medida.
            </h1>
            <p className="text-navy-200 text-base leading-relaxed max-w-lg sm:text-lg">
              Identificamos las barreras reales de aprendizaje y asignamos el tutor ideal.
              Resultados visibles en las primeras semanas o te devolvemos tu inversión.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href="#cta"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-gold-500/25 transition-all hover:scale-105">
                Quiero un diagnóstico gratuito
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#metodo"
                className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 font-semibold text-sm px-6 py-3.5 rounded-full transition-colors">
                Ver cómo funciona
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              {['Sin compromiso', 'Respuesta en 24h', 'Primera sesión de prueba gratis'].map(item => (
                <span key={item} className="flex items-center gap-1.5 text-xs text-navy-200 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Imagen hero */}
          <div className="hidden lg:block lg:w-[440px] shrink-0">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gold-500/20 blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/imgs pagina web/imagen banner 1.png"
                  alt="Tutora acompañando a estudiante"
                  width={640} height={480}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              {/* Badge flotante */}
              <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">¡Nota mejorada!</p>
                  <p className="text-[10px] text-slate-500">+2 puntos en 3 semanas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-brand-sand/50">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1.5">
                <div className="w-10 h-10 rounded-2xl bg-navy-600/10 flex items-center justify-center mb-1">
                  <Icon className="h-5 w-5 text-navy-600" />
                </div>
                <span className="text-2xl font-black text-navy-600">{value}</span>
                <span className="text-xs text-slate-500 font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METODOLOGÍA ─────────────────────────────────────── */}
      <section id="metodo" className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">Nuestro proceso</span>
            <h2 className="mt-2 text-3xl font-extrabold text-navy-600 sm:text-4xl">
              ¿Por qué nuestra metodología funciona?
            </h2>
            <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
              No todas las dificultades académicas se resuelven con más horas de clase. Primero entendemos la raíz, luego construimos el plan correcto.
            </p>
          </div>

          <div className="grid gap-8 sm:gap-6 md:grid-cols-3">
            {STEPS.map(({ n, icon: Icon, title, desc }) => (
              <div key={n} className="relative group bg-white border border-slate-100 rounded-3xl p-7 shadow-sm hover:shadow-navy transition-all hover:-translate-y-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-navy-600 flex items-center justify-center shrink-0 shadow-lg shadow-navy-600/20 group-hover:bg-gold-500 transition-colors">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-4xl font-black text-slate-100 leading-none mt-1">{n}</span>
                </div>
                <h3 className="text-base font-bold text-navy-600 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Imagen metodología */}
          <div className="mt-14 flex justify-center">
            <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-100 shadow-md">
              <Image src="/imgs pagina web/metodologia.png" alt="Metodología Academia Lumen"
                width={800} height={400} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* ── TUTORES ─────────────────────────────────────────── */}
      <section id="tutores" className="py-20 sm:py-24 bg-brand-sand/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">Nuestro equipo</span>
            <h2 className="mt-2 text-3xl font-extrabold text-navy-600 sm:text-4xl">
              Tutores que conectan de verdad.
            </h2>
            <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
              Seleccionamos a nuestros tutores no solo por su conocimiento académico, sino por su capacidad de motivar y conectar con cada estudiante.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 max-w-3xl mx-auto">
            {[
              { img: '/imgs pagina web/tutor 1.jpg',   nombre: 'Carlos Mendoza',   area: 'Matemática y Física', exp: '6 años de experiencia', rate: '98%' },
              { img: '/imgs pagina web/tutora 2.jpg',  nombre: 'Valeria Torres',   area: 'Comprensión lectora y Comunicación', exp: '4 años de experiencia', rate: '96%' },
            ].map(tutor => (
              <div key={tutor.nombre} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-navy transition-all hover:-translate-y-1 group">
                <div className="h-56 overflow-hidden">
                  <Image src={tutor.img} alt={tutor.nombre} width={600} height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-navy-600 text-base">{tutor.nombre}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{tutor.area}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-green-50 border border-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full shrink-0">
                      <Heart className="h-3 w-3 fill-green-500 text-green-500" />
                      {tutor.rate}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <Trophy className="h-3.5 w-3.5 text-gold-500" />
                    {tutor.exp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NIVELES ─────────────────────────────────────────── */}
      <section id="niveles" className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Imagen */}
            <div className="order-2 lg:order-1">
              <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-lg">
                <Image src="/imgs pagina web/niveles de educación.png" alt="Niveles educativos"
                  width={900} height={600} className="w-full h-full object-cover" />
              </div>
            </div>
            {/* Contenido */}
            <div className="order-1 lg:order-2 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">Cobertura educativa</span>
                <h2 className="mt-2 text-3xl font-extrabold text-navy-600 sm:text-4xl">
                  Apoyo para cada etapa escolar.
                </h2>
                <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
                  Desde los primeros años hasta la preparación para la universidad. Adaptamos la tutoría al momento de vida de cada estudiante.
                </p>
              </div>
              <div className="space-y-4">
                {NIVELES.map(({ icon, title, desc, materias }) => (
                  <div key={title} className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-navy-200 hover:bg-brand-sand/30 transition-colors group">
                    <div className="text-2xl mt-0.5 shrink-0">{icon}</div>
                    <div>
                      <h3 className="font-bold text-navy-600 text-sm group-hover:text-navy-700">{title}</h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {materias.map(m => (
                          <span key={m} className="text-[10px] bg-navy-600/5 text-navy-600 font-semibold px-2 py-0.5 rounded-full">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ─────────────────────────────────────── */}
      <section id="testimonios" className="py-20 sm:py-24 bg-navy-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Imagen */}
            <div className="mx-auto w-full max-w-sm">
              <div className="relative">
                <div className="absolute -inset-3 rounded-3xl bg-gold-500/20 blur-xl" />
                <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                  <Image src="/imgs pagina web/testimonio 1.png" alt="Testimonio"
                    width={600} height={600} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            {/* Quote */}
            <div className="text-white space-y-5">
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">Lo que dicen las familias</span>
              <blockquote className="text-2xl font-bold leading-snug sm:text-3xl text-white">
                "Mi hijo volvió a creer en sí mismo."
              </blockquote>
              <p className="text-navy-200 text-sm sm:text-base leading-relaxed max-w-lg">
                "Antes de iniciar con Academia Lumen, mi hijo llegaba frustrado a casa. Las tareas eran una batalla diaria y sus notas seguían bajando. Después del diagnóstico entendimos qué estaba pasando. Hoy ya no le teme a los exámenes y, lo más importante, recuperó la confianza en sí mismo."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center font-black text-navy-900 text-sm">M</div>
                <div>
                  <p className="font-bold text-white text-sm">María Rodríguez</p>
                  <p className="text-navy-300 text-xs">Mamá de Diego, 2° de secundaria</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA / FORMULARIO ────────────────────────────────── */}
      <section id="cta" className="py-20 sm:py-24 bg-brand-sand/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Imagen + info */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">Primer paso sin costo</span>
                <h2 className="mt-2 text-3xl font-extrabold text-navy-600 sm:text-4xl">
                  ¿Preocupado por las notas? Hablemos hoy.
                </h2>
                <p className="mt-4 text-slate-500 text-sm sm:text-base leading-relaxed">
                  Agenda una videollamada de diagnóstico gratuita de 20 minutos. Entendemos la situación de tu hijo y te entregamos un plan claro, sin compromisos.
                </p>
              </div>
              <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-md">
                <Image src="/imgs pagina web/agenda una llamada.png" alt="Videollamada de diagnóstico"
                  width={900} height={600} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-3">
                {[
                  'Diagnóstico personalizado sin costo',
                  'Tutor asignado en menos de 48 horas',
                  'Primera sesión de prueba incluida',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-gold-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-7 sm:p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-navy-600">¡Mensaje enviado!</h3>
                  <p className="text-slate-500 text-sm max-w-xs">
                    Nos pondremos en contacto contigo en menos de 24 horas hábiles para coordinar tu diagnóstico gratuito.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ nombres:'', email:'', telefono:'', nivel:'', mensaje:'' }); }}
                    className="mt-2 text-xs font-semibold text-navy-600 underline underline-offset-2"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-navy-600 mb-1">Solicitar diagnóstico gratuito</h3>
                  <p className="text-xs text-slate-500 mb-6">Sin compromisos · Respuesta en 24 horas hábiles</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre completo *</label>
                        <input name="nombres" value={form.nombres} onChange={handleChange} required
                          placeholder="Ej. María Rodríguez"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all placeholder:text-slate-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">WhatsApp *</label>
                        <input name="telefono" value={form.telefono} onChange={handleChange} required type="tel"
                          placeholder="+51 999 999 999"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all placeholder:text-slate-400" />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Email (opcional)</label>
                        <input name="email" value={form.email} onChange={handleChange} type="email"
                          placeholder="tu@correo.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all placeholder:text-slate-400" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nivel escolar</label>
                        <select name="nivel" value={form.nivel} onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all">
                          <option value="">Selecciona…</option>
                          <option value="Primaria">Primaria</option>
                          <option value="Secundaria">Secundaria</option>
                          <option value="Preuniversitario">Preuniversitario</option>
                          <option value="Universitario">Universitario</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">¿Qué te preocupa? (opcional)</label>
                      <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows={3}
                        placeholder="Cuéntanos brevemente la situación de tu hijo o qué esperas de la tutoría."
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-navy-500 focus:ring-2 focus:ring-navy-100 transition-all placeholder:text-slate-400 resize-none" />
                    </div>

                    {formError && (
                      <p className="text-xs text-red-500 font-medium">{formError}</p>
                    )}

                    <button type="submit" disabled={sending}
                      className="w-full bg-navy-600 hover:bg-navy-700 disabled:opacity-60 text-white font-bold text-sm py-3.5 rounded-xl shadow-lg shadow-navy-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                      {sending ? (
                        <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />Enviando...</>
                      ) : (
                        <><MessageCircle className="h-4 w-4" />Solicitar Diagnóstico Gratuito</>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-400">
                      Nos pondremos en contacto en menos de 24 horas hábiles.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="bg-navy-600 text-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.5fr,1fr,1fr,1fr]">
            {/* Brand */}
            <div className="space-y-4">
              <Image src="/logo.png" alt="Academia Lumen" width={140} height={50} className="h-10 w-auto object-contain brightness-0 invert" />
              <p className="text-navy-200 text-xs leading-relaxed max-w-xs">
                Tutoría personalizada para que cada estudiante avance con claridad, seguridad y acompañamiento cercano.
              </p>
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, label: 'Facebook' },
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Youtube, label: 'YouTube' },
                ].map(({ Icon, label }) => (
                  <a key={label} href="#" aria-label={label}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-gold-500 flex items-center justify-center transition-colors">
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gold-400 mb-4">Navegación</h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-navy-200 hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Servicios */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gold-400 mb-4">Servicios</h4>
              <ul className="space-y-2.5 text-xs text-navy-200">
                <li>Tutoría Primaria</li>
                <li>Tutoría Secundaria</li>
                <li>Preuniversitario</li>
                <li>Diagnóstico gratuito</li>
                <li>Plan personalizado</li>
              </ul>
            </div>

            {/* Contacto */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-gold-400 mb-4">Contacto</h4>
              <ul className="space-y-3 text-xs text-navy-200">
                <li className="flex items-start gap-2">
                  <Phone className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gold-400" />
                  +51 999 999 999
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gold-400" />
                  contacto@academialumen.com
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gold-400" />
                  Lima, Perú
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-navy-300">
            <span>© {new Date().getFullYear()} Academia Lumen. Todos los derechos reservados.</span>
            <span>Hecho con ♥ para las familias peruanas</span>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOAT ──────────────────────────────────── */}
      <a href="https://wa.me/51999999999?text=Hola,%20quiero%20información%20sobre%20la%20tutoría"
        target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1ebe5a] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110"
        aria-label="Escribir por WhatsApp">
        <MessageCircle className="h-7 w-7 text-white fill-white" />
      </a>
    </div>
  );
}

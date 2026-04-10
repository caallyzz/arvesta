import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, Target, ScanLine, BarChart2,
  ArrowRight, CheckCircle2, Shield, Zap, Users,
  ChevronDown,
} from 'lucide-react'

/* ── helpers ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setInView(true); obs.disconnect() }
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ── sub-components ── */
function NavBar({ onLogin }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-card border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-700 rounded-xl flex items-center justify-center shadow-green">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-semibold text-ink text-lg">Arvesta</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-muted">
          <a href="#fitur"     className="hover:text-ink transition-colors">Fitur</a>
          <a href="#cara-kerja" className="hover:text-ink transition-colors">Cara Kerja</a>
          <a href="#mulai"     className="hover:text-ink transition-colors">Mulai</a>
        </nav>
        <button onClick={onLogin} className="btn-primary text-sm px-5 py-2.5">
          Masuk <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

function HeroSection({ onLogin }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-mesh pt-16">
      {/* decorative blobs */}
      <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-green-100/60 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-64 h-64 rounded-full bg-yellow-100/60 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="space-y-6 animate-fade-up">
          <span className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-primary-100">
            <Zap className="w-3 h-3" /> Platform Keuangan Cerdas
          </span>
          <h1 className="font-display text-5xl lg:text-6xl font-bold text-ink leading-tight text-balance">
            Kelola Uangmu <br />
            <em className="text-primary-700 not-italic">Lebih Cerdas</em><br />
            Bersama Arvesta
          </h1>
          <p className="text-ink-muted text-lg leading-relaxed max-w-lg">
            Catat pemasukan & pengeluaran, pantau tabungan bersama,
            dan scan struk otomatis — semua dalam satu platform yang mudah digunakan.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={onLogin} className="btn-primary px-7 py-3.5 text-base">
              Mulai Gratis <ArrowRight className="w-4 h-4" />
            </button>
            <a href="#fitur" className="btn-secondary px-7 py-3.5 text-base">
              Lihat Fitur
            </a>
          </div>
          <div className="flex flex-wrap gap-5 pt-2">
            {['Gratis selamanya', 'Aman & terenkripsi', 'Tanpa iklan'].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-ink-muted">
                <CheckCircle2 className="w-4 h-4 text-primary-700" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview card */}
        <div className="relative animate-fade-up animate-delay-200 hidden lg:block">
          <div className="bg-white rounded-3xl shadow-float border border-gray-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-muted">Total Saldo</p>
                <p className="font-display text-2xl font-bold text-ink mt-0.5">Rp 42.500.000</p>
              </div>
              <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Pemasukan', val: 'Rp 12.480.000', color: 'text-green-600', bg: 'bg-green-50' },
                { label: 'Pengeluaran', val: 'Rp 3.120.500', color: 'text-red-500', bg: 'bg-red-50' },
              ].map(c => (
                <div key={c.label} className={`${c.bg} rounded-2xl p-3.5`}>
                  <p className="text-xs text-ink-muted">{c.label}</p>
                  <p className={`font-semibold text-sm mt-0.5 ${c.color} tabular-nums`}>{c.val}</p>
                </div>
              ))}
            </div>
            {/* mini bar chart */}
            <div>
              <p className="text-xs text-ink-muted mb-2">Tren Bulanan</p>
              <div className="flex items-end gap-1.5 h-14">
                {[40, 65, 50, 80, 60, 90, 72].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col gap-0.5">
                    <div className="rounded-t bg-primary-700/20" style={{ height: `${h * 0.4}px` }} />
                    <div className="rounded-t bg-primary-700" style={{ height: `${h * 0.4 * 0.6}px` }} />
                  </div>
                ))}
              </div>
            </div>
            {/* recent tx */}
            <div className="space-y-2 pt-1">
              {[
                { label: 'Pasar Swalayan', val: '-Rp 342.000', color: 'text-red-500' },
                { label: 'Gaji Bulanan',   val: '+Rp 8.500.000', color: 'text-green-600' },
              ].map(tx => (
                <div key={tx.label} className="flex justify-between items-center text-xs py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-ink font-medium">{tx.label}</span>
                  <span className={`font-semibold tabular-nums ${tx.color}`}>{tx.val}</span>
                </div>
              ))}
            </div>
          </div>
          {/* floating badges */}
          <div className="absolute -top-4 -right-4 bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse-slow">
            Live Data ✦
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white border border-gray-100 shadow-float text-xs font-medium px-3 py-2 rounded-xl flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-primary-700" /> Data aman & terenkripsi
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <a href="#fitur" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-ink-muted hover:text-ink transition-colors animate-bounce">
        <span className="text-xs">Scroll</span>
        <ChevronDown className="w-4 h-4" />
      </a>
    </section>
  )
}

const FEATURES = [
  {
    icon: BarChart2,
    title: 'Pelacakan Keuangan',
    desc:  'Catat setiap pemasukan dan pengeluaran. Lihat ringkasan dan tren keuanganmu secara real-time.',
    color: 'bg-green-50 text-primary-700',
  },
  {
    icon: Target,
    title: 'Target Tabungan Bersama',
    desc:  'Buat tabungan bareng keluarga atau teman. Pantau progress dan setor bersama menuju target.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: ScanLine,
    title: 'Scan Struk Otomatis',
    desc:  'Foto struk belanja, AI kami langsung membaca dan mencatat nominal ke transaksimu.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Shield,
    title: 'Aman & Terpercaya',
    desc:  'Data keuanganmu dilindungi enkripsi JWT. Hanya kamu yang bisa mengaksesnya.',
    color: 'bg-purple-50 text-purple-600',
  },
]

function FeaturesSection() {
  const [ref, inView] = useInView()
  return (
    <section id="fitur" className="py-24 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-700">Fitur Unggulan</span>
          <h2 className="font-display text-4xl font-bold text-ink mt-2 mb-3">
            Semua yang Kamu Butuhkan
          </h2>
          <p className="text-ink-muted max-w-lg mx-auto">
            Dirancang khusus untuk membantu kamu mengelola keuangan dengan lebih cerdas dan efisien.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className={`
                  card-hover p-6 transition-all duration-700
                  ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-ink mb-2">{f.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { no: '01', title: 'Daftar Gratis',       desc: 'Buat akun dalam hitungan detik. Tidak perlu kartu kredit.' },
  { no: '02', title: 'Catat Transaksi',      desc: 'Input pemasukan & pengeluaran manual atau scan struk.' },
  { no: '03', title: 'Pantau Dashboard',     desc: 'Lihat ringkasan, chart tren, dan analisis pengeluaran.' },
  { no: '04', title: 'Capai Target Bersama', desc: 'Buat tabungan bersama dan undang anggota keluarga/teman.' },
]

function HowItWorksSection() {
  const [ref, inView] = useInView()
  return (
    <section id="cara-kerja" className="py-24 bg-surface-muted" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-700">Cara Kerja</span>
          <h2 className="font-display text-4xl font-bold text-ink mt-2">Mudah dalam 4 Langkah</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((s, i) => (
            <div
              key={s.no}
              className={`transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="font-display text-5xl font-bold text-primary-100 mb-3">{s.no}</div>
              <h3 className="font-semibold text-ink mb-2">{s.title}</h3>
              <p className="text-sm text-ink-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection({ onLogin }) {
  const [ref, inView] = useInView()
  return (
    <section id="mulai" className="py-24 bg-primary-700 overflow-hidden relative" ref={ref}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-accent blur-3xl" />
      </div>
      <div className={`max-w-2xl mx-auto px-6 text-center relative transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <span className="text-xs font-semibold uppercase tracking-widest text-green-300">Mulai Sekarang</span>
        <h2 className="font-display text-4xl font-bold text-white mt-3 mb-4 text-balance">
          Mulai Perjalananmu Menuju Kebebasan Finansial
        </h2>
        <p className="text-green-200 mb-8 leading-relaxed">
          Bergabung dengan ribuan pengguna yang sudah lebih cerdas mengelola keuangan mereka bersama Arvesta.
        </p>
        <button
          onClick={onLogin}
          className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-xl hover:bg-green-50 transition-colors shadow-float text-base"
        >
          Daftar Gratis Sekarang <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-ink py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary-700 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-display font-semibold text-white">Arvesta</span>
        </div>
        <p className="text-xs text-gray-500">© {new Date().getFullYear()} Arvesta. Platform manajemen keuangan modern.</p>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const toLogin  = () => navigate('/login')

  return (
    <div className="min-h-screen">
      <NavBar     onLogin={toLogin} />
      <HeroSection onLogin={toLogin} />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection  onLogin={toLogin} />
      <Footer />
    </div>
  )
}

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Target,
  ScanLine,
  BarChart2,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  ChevronDown,
  Sparkles,
  UserPlus,
  PenTool,
  Eye,
  Trophy,
} from "lucide-react";
import ChangingWord from "../components/ChangingWord";
import heroPhoto from "../assets/hero.png";
import saveIllustration from "../assets/save.svg";
import scannerPhoto from "../assets/scanner.png";

/* ── helpers ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── NAVBAR ── */
function NavBar({ onLogin }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-full" />
          <span className="font-semibold">Arvesta.</span>
        </div>

        <nav className="hidden md:flex gap-6 text-sm">
          <a href="#">About us</a>
          <a href="#fitur">Features</a>
          <a href="#">Community</a>
        </nav>

        <button
          onClick={onLogin}
          className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white shadow-sm shadow-orange-200/50 transition duration-300 hover:from-orange-600 hover:to-orange-700"
        >
          Log in
        </button>
      </div>
    </header>
  );
}

/* ── HERO ── */
function HeroSection({ onLogin }) {
  return (
    <section className="bg-transparent min-h-screen flex items-center pt-20">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 px-6 items-center">
        <div>
          <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold">
            smart finance platform
          </span>

          <h1 className="text-6xl md:text-7xl font-bold mt-5 leading-tight tracking-tight">
            Manage You <br />
            Money <ChangingWord /> <br />
            With Arvesta.
          </h1>

          <p className="text-gray-600 mt-5 text-lg md:text-xl max-w-2xl">
            Track expenses, plan budgets, and achieve your financial goals.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={onLogin}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 text-white font-semibold shadow-lg shadow-orange-200/40 transition duration-300 hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-700"
            >
              Get Started →
            </button>

            <button
              onClick={onLogin}
              className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-white/90 px-8 py-3 text-orange-600 font-semibold transition duration-300 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
            >
              Log in
            </button>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <img
            src={heroPhoto}
            alt="Hero illustration"
            className="h-[420px] w-[420px] object-cover"
          />
        </div>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section className="py-20 text-center bg-transparent">
      <div className="max-w-4xl mx-auto px-6">
        {/* HEADER */}
        <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
          About Arvesta
        </span>

        <h2 className="text-4xl font-bold mt-6 text-[#1E293B]">Our Mission</h2>

        <p className="text-gray-600 mt-6 leading-relaxed text-lg">
          At Arvesta, we believe that financial freedom should be accessible to
          everyone. Founded in 2024, we've been on a mission to democratize
          personal finance through innovative technology and user-centric
          design.
        </p>

        <p className="text-gray-600 mt-4 leading-relaxed">
          Our platform combines the power of AI with intuitive interfaces to
          help users track expenses, plan budgets, and achieve their financial
          goals. Whether you're a student managing your first paycheck or a
          family planning for the future, Arvesta is here to guide you every
          step of the way.
        </p>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div>
            <h3 className="text-3xl font-bold text-[#1E293B]">10K+</h3>
            <p className="text-gray-600 mt-2">Active Users</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#1E293B]">$2M+</h3>
            <p className="text-gray-600 mt-2">Money Saved</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#1E293B]">4.8★</h3>
            <p className="text-gray-600 mt-2">User Rating</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── FEATURES (BENTO GRID) ── */
function FeaturesSection() {
  return (
    <section id="fitur" className="py-28 bg-transparent">
      {/* TITLE */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-semibold text-[#1E293B]">
          Powerful Features
        </h2>
        <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
          Master your finances with tools designed for professionals who demand
          excellence.
        </p>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT CARD */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-[320px]">
          <div>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <BarChart2 className="w-5 h-5 text-green-700" />
            </div>

            <h3 className="font-semibold text-lg text-[#1E293B]">
              Expense Tracking
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Deep insights into where your capital flows every day.
            </p>
          </div>

          {/* MINI CHART */}
          <div className="mt-6 bg-gray-50 rounded-2xl p-4">
            <div className="flex items-end gap-2 h-16">
              {[30, 45, 70, 50, 25].map((h, i) => (
                <div
                  key={i}
                  className={`w-6 rounded-full ${
                    i === 2 ? "bg-green-700" : "bg-green-200"
                  }`}
                  style={{ height: `${h}px` }}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">+12% growth</p>
          </div>
        </div>

        {/* MIDDLE CARD */}
        <div className="bg-white rounded-[28px] p-6 shadow-sm flex flex-col justify-between h-[320px]">
          <div>
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-orange-500" />
            </div>

            <h3 className="font-semibold text-lg text-[#1E293B]">
              Smart Budget Planner
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              AI-driven predictive budgeting that evolves with your lifestyle.
            </p>
          </div>

          {/* PROGRESS */}
          <div className="mt-6 space-y-3 text-sm">
            {[
              { name: "Marketing & Ops", val: "80%", color: "bg-green-700" },
              { name: "Personal Growth", val: "85%", color: "bg-orange-500" },
              { name: "Leisure", val: "25%", color: "bg-yellow-400" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-gray-500">
                  <span>{item.name}</span>
                  <span>{item.val}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-1">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: item.val }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-6">
          {/* SAVINGS */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm h-[150px] flex justify-between items-center">
            <div>
              <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-yellow-500" />
              </div>

              <h3 className="font-semibold text-[#1E293B]">Savings Goals</h3>

              <p className="text-xs text-gray-500">Automated milestones.</p>
            </div>

            {/* CIRCLE */}
            <div className="w-14 h-14 rounded-full border-[6px] border-yellow-400 flex items-center justify-center text-xs font-semibold text-gray-700">
              80%
            </div>
          </div>

          {/* SCANNER */}
          <div className="bg-white rounded-[28px] p-6 shadow-sm h-[150px] flex justify-between items-center">
            <div>
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                <ScanLine className="w-5 h-5 text-gray-700" />
              </div>

              <h3 className="font-semibold text-[#1E293B]">AI Scanner</h3>

              <p className="text-xs text-gray-500">Instant extraction.</p>
            </div>

            <div className="w-12 h-16 bg-gray-900 rounded-xl flex items-center justify-center text-white text-xs">
              $85
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── SAVE TOGETHER ── */
function SaveTogether() {
  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 px-6 items-center">
        <img
          src={saveIllustration}
          alt="save"
          className="w-full max-w-md mx-auto"
        />

        <div>
          <h2 className="text-4xl font-bold">
            Save Together, <span className="text-green-700">Achieve More</span>
          </h2>

          <p className="mt-4 text-gray-600">
            Financial goals are easier with collaboration.
          </p>

          <ul className="mt-4 space-y-2">
            <li>✔ Multi-user goal</li>
            <li>✔ Contribution logs</li>
            <li>✔ Progress tracking</li>
          </ul>

          <button className="mt-6 bg-green-700 text-white px-6 py-3 rounded-full">
            Explore Community Saving
          </button>
        </div>
      </div>
    </section>
  );
}

/* ── SCANNER ── */
function ScannerSection() {
  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 px-6 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 shadow-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
            Smart Receipt Scanner
          </div>

          <div>
            <h2 className="text-4xl font-bold text-slate-950">
              Smart Receipt <span className="text-orange-500">Scanner</span>
            </h2>
            <p className="mt-4 max-w-xl text-gray-600">
              Scan receipts and automatically record your expenses using fast,
              AI-powered OCR.
            </p>
          </div>

          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
              Instant receipt scanning
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
              Automatic data extraction
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
              Expense auto-recording
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
              Faster expense tracking
            </li>
          </ul>
        </div>

        <div className="flex justify-center">
          <img
            src={scannerPhoto}
            alt="Receipt scanner"
            className="h-[520px] w-[320px] rounded-[2.5rem] object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/* ── HOW IT WORKS ── */
function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Daftar Akun",
      desc: "Buat akun gratis dalam hitungan detik dan mulai perjalanan finansialmu.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: PenTool,
      title: "Catat Transaksi",
      desc: "Input pemasukan dan pengeluaran harian dengan mudah melalui interface intuitif.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Eye,
      title: "Pantau Progress",
      desc: "Lihat laporan real-time, grafik tren, dan analisis keuangan otomatis.",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: Trophy,
      title: "Capai Target",
      desc: "Raih tujuan tabunganmu dengan fitur reminder dan motivasi yang cerdas.",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  return (
    <section id="cara-kerja" className="py-28 bg-transparent">
      <div className="max-w-6xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-16">
          <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
            How It Works
          </span>
          <h2 className="text-4xl font-bold mt-6 text-[#1E293B]">
            Mulai Perjalanan Finansialmu
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Dalam 4 langkah sederhana, kamu bisa mengelola keuangan dengan lebih
            baik dan capai target tabunganmu.
          </p>
        </div>

        {/* STEPS GRID */}
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* CONNECTING LINE */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 via-orange-200 to-purple-200"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* STEP NUMBER */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-white rounded-full border-4 border-orange-500 flex items-center justify-center text-lg font-bold text-orange-600 shadow-lg">
                  {index + 1}
                </div>
              </div>

              {/* CARD */}
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center h-full">
                {/* ICON */}
                <div
                  className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <step.icon className="w-8 h-8" />
                </div>

                {/* TITLE */}
                <h3 className="font-semibold text-lg text-[#1E293B] mb-3">
                  {step.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* ARROW (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-4 text-orange-400">
                  <ArrowRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA ── */
function CTASection({ onLogin }) {
  return (
    <section id="mulai" className="relative overflow-hidden py-28">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50" />
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="relative overflow-hidden rounded-[3rem] border border-slate-200/70 bg-white/95 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.08)]">
          <div className="absolute -left-14 top-6 h-60 w-60 rounded-full bg-emerald-100/80 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-slate-200/70 blur-3xl" />
          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-orange-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-orange-500" />
              Next-gen wealth
            </span>

            <h2 className="mt-8 text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
              Start Your Journey to{" "}
              <span className="text-emerald-700">Financial Excellence</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-500 sm:text-lg">
              Join the elite circle of professionals managing their future with
              Arvesta. Build smarter habits, track every transaction, and grow
              your savings with confidence.
            </p>

            <div className="mt-8 mx-auto mb-1 h-1 w-24 rounded-full bg-orange-200"></div>

            <button
              onClick={onLogin}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-10 py-4 text-base font-semibold text-white shadow-xl shadow-emerald-700/20 transition hover:bg-emerald-800"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
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
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Arvesta. Platform manajemen keuangan
          modern.
        </p>
      </div>
    </footer>
  );
}

/* ── MAIN ── */
export default function LandingPage() {
  const navigate = useNavigate();
  const toLogin = () => navigate("/login");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-orange-100 via-white to-emerald-100">
      <div className="pointer-events-none absolute left-1/2 top-20 -translate-x-1/2 h-[420px] w-[420px] rounded-full bg-gradient-radial from-orange-200 via-white to-emerald-200 opacity-90 blur-3xl" />
      <div className="relative">
        <NavBar onLogin={toLogin} />
        <HeroSection onLogin={toLogin} />
        <AboutSection />
        <FeaturesSection />
        <SaveTogether />
        <ScannerSection />
        <HowItWorksSection />
        <CTASection onLogin={toLogin} />
        <Footer />
      </div>
    </div>
  );
}

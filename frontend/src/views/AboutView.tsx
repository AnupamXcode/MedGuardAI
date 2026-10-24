import React, { useState } from 'react';
import {
  ShieldCheck,
  Heart,
  Pill,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  Search,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  Stethoscope,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Can I check over-the-counter medicines, vitamins, and painkillers?',
      a: 'Yes! You can check prescription pills, common pain relievers, allergy tablets, and everyday vitamins. Many common clashes happen between simple drugstore remedies and prescription pills.',
    },
    {
      q: 'Does MediGuard AI replace my doctor or pharmacist?',
      a: 'No. MediGuard is a helpful guide designed to give you peace of mind and clear answers before your visit. Always talk to your doctor or pharmacist before starting, stopping, or changing any medicine.',
    },
    {
      q: 'What should I do if a warning shows up?',
      a: 'Stay calm! A warning simply means the two medicines might interact or cause side effects. Read the simple explanation, note any safer alternatives suggested, and ask your pharmacist or doctor during your next visit or call.',
    },
    {
      q: 'Is my personal health information kept private?',
      a: 'Yes, 100%. Your saved medicines, health conditions, and emergency contacts are encrypted and private to you. We never sell your personal information or share it with insurance companies or advertisers.',
    },
  ];

  const features = [
    {
      icon: Search,
      title: 'Quick & Simple Search',
      description: 'Look up any medicine by its common brand name or medical name in seconds.',
      color: 'bg-teal-50 text-[#008060]',
    },
    {
      icon: MessageSquare,
      title: 'Plain, Everyday Words',
      description: 'No confusing doctor jargon. We explain what happens in your body so anyone can understand.',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      icon: Pill,
      title: 'Safer Alternatives',
      description: 'If two medicines clash, we highlight gentler options you can discuss with your doctor.',
      color: 'bg-sky-50 text-sky-700',
    },
    {
      icon: Lock,
      title: 'Private & Secure',
      description: 'Your saved medicine list and health records are completely private to your account.',
      color: 'bg-purple-50 text-purple-700',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Add Your Medicines',
      desc: 'Type the names of the pills, vitamins, or syrups you take or plan to take.',
    },
    {
      number: '2',
      title: 'Instant Safety Check',
      desc: 'We immediately check whether your medicines can be safely taken together.',
    },
    {
      number: '3',
      title: 'Take Action with Confidence',
      desc: 'Read clear advice and take helpful notes to your next doctor or pharmacy visit.',
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-10 animate-fadeIn pb-16">
      {/* ========================================================= */}
      {/* WELCOMING HERO BANNER */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B2E26] to-slate-900 text-white p-8 sm:p-12 shadow-lg border border-teal-900/30">
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-xs font-medium backdrop-blur-sm">
            <Heart className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
            <span>Medicine Safety Made Simple</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-heading tracking-tight text-white">
            Clear, honest answers about your medicines.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            MediGuard AI helps you and your family understand how your medicines work together — explained in simple words anyone can understand.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs text-teal-200">
            <span className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-teal-400" />
              <span>Easy for all ages</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-teal-400" />
              <span>No complicated terms</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-teal-400" />
              <span>Free to check anytime</span>
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* OUR MISSION */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-[#008060] font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Why We Built MediGuard AI</span>
        </div>

        <h2 className="text-2xl font-bold font-heading text-slate-900">
          Taking medicine should never be a guessing game
        </h2>

        <p className="text-sm text-slate-600 leading-relaxed">
          Prescription bottles and drug leaflets are full of small print and confusing medical words. Most people just want to know: <em>"Is it safe to take my pain reliever with my daily blood pressure pill?"</em>
        </p>

        <p className="text-sm text-slate-600 leading-relaxed">
          MediGuard AI was created to answer that exact question. We translate medical information into straightforward guidance so you can take care of yourself, your parents, or your children with complete peace of mind.
        </p>
      </div>

      {/* ========================================================= */}
      {/* HOW IT HELPS YOU (4 CARDS) */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            How MediGuard Helps You
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to keep your daily medicine routine safe and simple.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-teal-400/60 transition-colors space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3 SIMPLE STEPS */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-[#008060]">
            How It Works
          </span>
          <h2 className="text-2xl font-bold font-heading text-slate-900">
            Safety in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/70 text-center space-y-2 relative"
            >
              <div className="w-9 h-9 mx-auto rounded-full bg-[#008060] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                {step.number}
              </div>
              <h3 className="font-bold text-sm text-slate-900 pt-1">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* WHO IT'S FOR */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#008060] flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Patients &amp; Families</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Quickly check if over-the-counter cough or pain syrups can be mixed with your regular prescriptions.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#008060] flex items-center justify-center">
            <Heart className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Seniors &amp; Caregivers</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Easily manage multiple daily pills and protect against unexpected dizziness, tiredness, or stomach upset.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#008060] flex items-center justify-center">
            <Stethoscope className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Doctors &amp; Pharmacists</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Patients come to consultations well-prepared with their complete list and clear, focused questions.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FRIENDLY DOCTOR & SAFETY REMINDER */}
      {/* ========================================================= */}
      <div className="p-6 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="w-11 h-11 rounded-xl bg-[#008060] text-white flex items-center justify-center shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-sm text-slate-900">
            A Friendly Reminder About Your Healthcare
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            MediGuard AI is an educational assistant created to help you understand your medicines. It does not replace a licensed doctor or pharmacist. Never stop or change your prescribed doses without speaking to your doctor first.
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SIMPLE FAQ ACCORDION */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-[#008060] font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Frequently Asked Questions</span>
        </div>

        <h2 className="text-2xl font-bold font-heading text-slate-900">
          Got Questions? We Have Answers.
        </h2>

        <div className="divide-y divide-slate-100 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="py-4">
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900 hover:text-[#008060] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                  )}
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed animate-fadeIn">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

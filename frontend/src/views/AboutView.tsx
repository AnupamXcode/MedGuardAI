import React, { useState } from 'react';
import {
  ShieldCheck,
  BookOpen,
  Layers,
  Cpu,
  Database,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  HeartHandshake,
  Users,
  Stethoscope,
  Pill,
  Sparkles,
  CheckCircle2,
  Lock,
  Activity,
  Play,
  Zap,
  Check,
  X,
  Atom,
  HelpCircle,
  Heart,
  Droplet,
} from 'lucide-react';

interface SimulationPair {
  id: string;
  name: string;
  drugA: string;
  drugB: string;
  tag: string;
  layer: 'Layer 1 (Clinical Database)' | 'Layer 2 (Neural AI Predictor)' | 'Layer 1 (Safe Combination)';
  layerColor: string;
  severity: 'High Alert' | 'Moderate Warning' | 'Safe / No Known Clash';
  severityColor: string;
  mechanism: string;
  plainEnglish: string;
  doctorTip: string;
}

export const AboutView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'architecture' | 'simulation' | 'mechanisms' | 'science' | 'ethics'>('architecture');

  // Simulation interactive state
  const simulationPairs: SimulationPair[] = [
    {
      id: 'warfarin-aspirin',
      name: 'Warfarin + Aspirin',
      drugA: 'Warfarin (Blood Thinner)',
      drugB: 'Aspirin (NSAID Pain Reliever)',
      tag: 'PNAS Database Match',
      layer: 'Layer 1 (Clinical Database)',
      layerColor: 'text-[#008060] bg-teal-50 border-teal-200',
      severity: 'High Alert',
      severityColor: 'bg-rose-50 text-rose-700 border-rose-200',
      mechanism: 'Type 42: Synergistic anticoagulant cascade. Aspirin inhibits platelet aggregation while Warfarin blocks clotting factor synthesis.',
      plainEnglish: 'Both medicines thin your blood in different ways. Taking them together significantly raises the risk of severe stomach bleeding, easy bruising, or internal hemorrhage.',
      doctorTip: 'Ask your doctor if a safer pain reliever (like Acetaminophen/Paracetamol within safe limits) can be used instead of Aspirin while on blood thinners.',
    },
    {
      id: 'novel-pair',
      name: 'Novel Molecule X + Ibuprofen',
      drugA: 'Novel Agent X (Experimental)',
      drugB: 'Ibuprofen (Common Pain Relief)',
      tag: 'Neural Model Fallback',
      layer: 'Layer 2 (Neural AI Predictor)',
      layerColor: 'text-purple-700 bg-purple-50 border-purple-200',
      severity: 'Moderate Warning',
      severityColor: 'bg-amber-50 text-amber-700 border-amber-200',
      mechanism: 'Predicted Mechanism 18: Competitive renal prostaglandin inhibition leading to reduced glomerular filtration clearance.',
      plainEnglish: 'Because this new compound has not been studied in formal human trials with Ibuprofen, our deep learning model analyzed their molecular shapes. It predicts they may strain your kidneys if taken together.',
      doctorTip: 'Inform your doctor or clinical trial coordinator before taking common over-the-counter NSAIDs with newer or unstudied prescription drugs.',
    },
    {
      id: 'metformin-atorvastatin',
      name: 'Metformin + Atorvastatin',
      drugA: 'Metformin (Blood Sugar)',
      drugB: 'Atorvastatin (Cholesterol)',
      tag: 'Clinically Compatible',
      layer: 'Layer 1 (Safe Combination)',
      layerColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      severity: 'Safe / No Known Clash',
      severityColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      mechanism: 'Independent metabolic pathways. Metformin is cleared by renal organic cation transporters; Atorvastatin is cleared via hepatic CYP3A4.',
      plainEnglish: 'These two commonly prescribed medicines work through completely separate pathways in your body. There is no known negative chemical clash between them.',
      doctorTip: 'Continue taking each pill at your doctor-directed times (e.g. Metformin with meals, Atorvastatin at evening) for best efficacy.',
    },
  ];

  const [selectedSim, setSelectedSim] = useState<SimulationPair>(simulationPairs[0]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSelectSim = (sim: SimulationPair) => {
    setIsSimulating(true);
    setSelectedSim(sim);
    setTimeout(() => {
      setIsSimulating(false);
    }, 450);
  };

  // Mechanism explorer data
  const reactionMechanisms = [
    {
      title: 'Bleeding & Clotting',
      icon: Droplet,
      iconColor: 'text-rose-600 bg-rose-50',
      example: 'Blood thinners + NSAID pain relievers',
      simpleWhy: 'When two medications both weaken your body’s ability to clot, a simple cut or stomach ulcer can bleed much longer and more heavily.',
      whatToDo: 'Watch for unusual bruising, black or bloody stools, and frequent nosebleeds. Consult a doctor before combining.',
    },
    {
      title: 'Heart Rhythm (QT Interval)',
      icon: Heart,
      iconColor: 'text-red-600 bg-red-50',
      example: 'Certain antibiotics + Heart arrhythmia pills',
      simpleWhy: 'Some drugs delay the tiny electrical reset of your heartbeat. Stacking them can trigger dangerous irregular heart rhythms.',
      whatToDo: 'Never take unapproved antibiotics or antifungals without telling your cardiologist or general physician.',
    },
    {
      title: 'Kidney Clearance',
      icon: Activity,
      iconColor: 'text-amber-600 bg-amber-50',
      example: 'Blood pressure ACE inhibitors + Diuretics',
      simpleWhy: 'Your kidneys filter waste from your blood. Stacking medicines that constrict kidney blood vessels can cause fluid retention or kidney fatigue.',
      whatToDo: 'Ensure regular blood tests (eGFR / Creatinine) if your doctor prescribes multiple blood pressure pills.',
    },
    {
      title: 'Liver Metabolism (CYP450)',
      icon: Cpu,
      iconColor: 'text-indigo-600 bg-indigo-50',
      example: 'Grapefruit/Antifungals + Cholesterol Statins',
      simpleWhy: 'Your liver uses specific enzymes to break down medicines. If drug A disables the enzyme, drug B builds up to toxic levels in your bloodstream.',
      whatToDo: 'Ask your pharmacist about food or supplement interactions whenever starting a new prescription.',
    },
    {
      title: 'Sedation & Breathing',
      icon: AlertTriangle,
      iconColor: 'text-amber-600 bg-amber-50',
      example: 'Sleep aids + Allergy antihistamines',
      simpleWhy: 'Medications that calm your central nervous system can multiply their sedative effects when taken together, leading to extreme dizziness or shallow breathing.',
      whatToDo: 'Avoid driving or operating machinery. Check with your pharmacist before taking night-time allergy tablets.',
    },
    {
      title: 'Stomach Absorption Blocking',
      icon: Pill,
      iconColor: 'text-teal-600 bg-teal-50',
      example: 'Thyroid hormone + Calcium or Antacid supplements',
      simpleWhy: 'Certain minerals stick chemically to medicines in your stomach, preventing your body from absorbing the medicine into your bloodstream.',
      whatToDo: 'Separate thyroid medications and mineral supplements by at least 4 hours for full absorption.',
    },
  ];

  const [selectedMechanismIdx, setSelectedMechanismIdx] = useState<number>(0);

  const faqs = [
    {
      q: 'Is MediGuard AI a replacement for my doctor or pharmacist?',
      a: 'No. MediGuard AI is designed as an educational assistant and preliminary safety checker. It highlights documented interactions and risk mechanisms in plain English so you can ask informed questions during your doctor or pharmacist appointments. Never stop or adjust prescribed medications without consulting your healthcare provider.',
    },
    {
      q: 'How does the Two-Layer safety engine work?',
      a: 'First, your medication list is checked against our gold-standard database of 192,284 verified clinical interaction pairs from PNAS medical research. If a combination has not been documented in published studies yet, our deep learning neural model analyzes structural molecular fingerprints to predict whether adverse reactions are likely.',
    },
    {
      q: 'What do the 86 reaction types mean?',
      a: 'Rather than just saying "bad interaction," medical research categorizes interactions into 86 physiological mechanisms. These include increased bleeding risk, decreased kidney clearance, altered liver enzyme metabolism (CYP450 pathways), reduced absorption, or heart rhythm changes (QT prolongation). MediGuard translates each mechanism into straightforward advice.',
    },
    {
      q: 'Why does MediGuard avoid arbitrary danger scores (like 78% risk)?',
      a: 'Medical research does not use arbitrary percentage scores for patient risk because actual harm depends on your individual dosage, kidney health, age, and duration of use. Instead of a misleading number, MediGuard tells you the exact biological clash, how it affects your body, and actionable questions for your doctor.',
    },
    {
      q: 'Is my personal health data private?',
      a: 'Yes. Your saved medications, medical conditions, and emergency contacts are encrypted and strictly isolated under your authorized account. We never sell your health history or share your data with insurance companies or advertisers.',
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-12 animate-fadeIn pb-16">
      {/* ========================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B2E26] to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-teal-900/40">
        <div className="pointer-events-none absolute -right-24 -top-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Built on PNAS Peer-Reviewed Medical Research</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight leading-tight text-white">
            Transforming Medicine Safety Into Plain, Simple English.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Millions of people take medications that clash inside their body without realizing it. MediGuard AI pairs gold-standard clinical research with modern machine learning to give patients, families, and doctors instant, transparent clarity.
          </p>
        </div>

        {/* 4 Quick Stat Metric Tiles */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-2 text-teal-400 mb-1">
              <Database className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Database</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">192,284</div>
            <p className="text-xs text-slate-300 mt-1">Verified interaction pairs from PNAS studies.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-2 text-teal-400 mb-1">
              <Pill className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Coverage</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">1,710</div>
            <p className="text-xs text-slate-300 mt-1">Approved brand and generic medications.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-2 text-teal-400 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Classifications</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">86 Types</div>
            <p className="text-xs text-slate-300 mt-1">Clear biological reaction descriptions.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-2 text-teal-400 mb-1">
              <Cpu className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Engine</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">2-Layer</div>
            <p className="text-xs text-slate-300 mt-1">Deterministic research + deep neural AI.</p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE NAVIGATION TABS */}
      {/* ========================================================= */}
      <div className="flex items-center justify-center p-1.5 bg-slate-100 rounded-2xl max-w-2xl mx-auto border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'architecture'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#008060]" />
          <span>How It Works</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('simulation')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'simulation'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Play className="w-3.5 h-3.5 text-[#008060]" />
          <span>Interactive Demo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mechanisms')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'mechanisms'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#008060]" />
          <span>86 Reactions</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('science')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'science'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-[#008060]" />
          <span>Medical Research</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ethics')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'ethics'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#008060]" />
          <span>Trust &amp; Ethics</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: HOW THE TWO-LAYER ENGINE WORKS */}
      {/* ========================================================= */}
      {activeTab === 'architecture' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Visual Step-by-Step Flow */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#008060]">
                The Safety Workflow
              </span>
              <h2 className="text-2xl font-bold font-heading text-slate-900 mt-1">
                From Medicine Bottle to Patient Clarity in 4 Steps
              </h2>
              <p className="text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
                Here is exactly what happens behind the scenes whenever you run a safety check on MediGuard AI:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 relative">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs mb-3">
                  01
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Standardize Names</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Both brand names (like Tylenol or Advil) and generics (Acetaminophen or Ibuprofen) are mapped to clinical IDs.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200/80 relative">
                <div className="w-8 h-8 rounded-lg bg-[#008060] text-white flex items-center justify-center font-bold text-xs mb-3">
                  02
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Layer 1: Clinical Check</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We query 192,284 verified clinical trial pairs published in PNAS medical literature.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200/80 relative">
                <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center font-bold text-xs mb-3">
                  03
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Layer 2: Neural Fallback</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  If never studied before, our deep learning model reads the 3D molecular fingerprints to predict clash risks.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 relative">
                <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs mb-3">
                  04
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1">Plain-English Advice</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We translate complex biochemistry into straightforward advice and provide safer alternatives for your doctor.
                </p>
              </div>
            </div>
          </div>

          {/* Deep Dive: Layer 1 vs Layer 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
            <h2 className="text-2xl font-bold font-heading text-slate-900 mb-2">
              Layer 1 vs Layer 2 Architecture
            </h2>
            <p className="text-sm text-slate-600 mb-8 max-w-2xl leading-relaxed">
              Most online drug checkers only give generic badges without explaining why. MediGuard AI uses a dual-engine architecture to first check clinical facts, then apply machine learning for unstudied combinations.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Layer 1 Box */}
              <div className="p-6 rounded-2xl bg-teal-50/60 border border-teal-200 flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#008060] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Layer 1: Verified Clinical Database
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    When you check a combination like <strong>Warfarin + Aspirin</strong>, Layer 1 executes an exact-match query against 192,284 peer-reviewed interaction pairs.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2">
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#008060] shrink-0" />
                      <span>Zero hallucination: strictly based on clinical trials</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#008060] shrink-0" />
                      <span>Explains the exact biological clash in plain terms</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#008060] shrink-0" />
                      <span>Suggests doctor-approved safer alternatives</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-teal-200 text-[11px] font-semibold text-[#008060]">
                  Status: 100% Deterministic Gold-Standard Evidence
                </div>
              </div>

              {/* Layer 2 Box */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between relative overflow-hidden">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-heading">
                    Layer 2: Deep Learning Neural Predictor
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If two medicines have never been formally studied together in a published trial, Layer 2 analyzes their 50-dimensional molecular fingerprints to predict likely adverse effects.
                  </p>
                  <ul className="space-y-2 text-xs text-slate-700 pt-2">
                    <li className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>Structural PCA &amp; DeepDDI multi-class classification</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>Predicts 86 distinct biochemical reaction pathways</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>Transparently marks results as AI-predicted</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] font-semibold text-slate-600">
                  Status: Active Fallback for Unstudied Combinations
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: INTERACTIVE DEMO SIMULATOR */}
      {/* ========================================================= */}
      {activeTab === 'simulation' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-[#008060] font-bold text-xs uppercase tracking-wider mb-1">
                <Zap className="w-4 h-4" />
                <span>Live Interactive Simulation</span>
              </div>
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Experience How MediGuard Evaluates Medications
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Click any of the 3 realistic medicine pairs below to see how our engine routes the query and breaks down the safety mechanism:
              </p>
            </div>

            {/* Selector Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {simulationPairs.map((sim) => {
                const isSelected = selectedSim.id === sim.id;
                return (
                  <button
                    key={sim.id}
                    type="button"
                    onClick={() => handleSelectSim(sim)}
                    className={`p-4 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'border-[#008060] bg-teal-50/50 shadow-xs ring-2 ring-[#008060]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sim.layerColor}`}>
                        {sim.tag}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#008060]" />}
                    </div>
                    <div className="font-bold text-sm text-slate-900">{sim.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">{sim.drugA}</div>
                  </button>
                );
              })}
            </div>

            {/* Simulation Pipeline Visual Display */}
            <div className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
              isSimulating ? 'opacity-50 scale-[0.99]' : 'opacity-100 scale-100'
            } bg-slate-50/80 border-slate-200 space-y-6`}>
              {/* Header Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs">
                    <Atom className="w-5 h-5 text-[#008060]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Active Evaluation Pair
                    </span>
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedSim.drugA} &amp; {selectedSim.drugB}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedSim.severityColor}`}>
                    {selectedSim.severity}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${selectedSim.layerColor}`}>
                    {selectedSim.layer}
                  </span>
                </div>
              </div>

              {/* Engine Route Step Indicator */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Step 1: Normalization</span>
                  <span className="font-semibold text-slate-800">Chemical SMILES &amp; DrugBank ID matched</span>
                </div>
                <div className={`p-3.5 rounded-xl border ${
                  selectedSim.layer.includes('Layer 1')
                    ? 'bg-teal-50 border-teal-200 text-[#008060]'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <span className="text-[10px] font-bold uppercase block mb-1 opacity-80">Step 2: Layer 1 PNAS Check</span>
                  <span className="font-semibold">
                    {selectedSim.layer.includes('Layer 1') ? '✓ Exact Peer-Reviewed Match Found' : '∅ No clinical pair match (Fallback)'}
                  </span>
                </div>
                <div className={`p-3.5 rounded-xl border ${
                  selectedSim.layer.includes('Layer 2')
                    ? 'bg-purple-50 border-purple-200 text-purple-700'
                    : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  <span className="text-[10px] font-bold uppercase block mb-1 opacity-80">Step 3: Layer 2 Neural AI</span>
                  <span className="font-semibold">
                    {selectedSim.layer.includes('Layer 2') ? '✓ 50-Dim PCA Neural Classification' : 'Bypassed (Layer 1 confident)'}
                  </span>
                </div>
              </div>

              {/* Plain English Translation Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center space-x-2 text-[#008060] font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Plain-English Safety Explanation</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  "{selectedSim.plainEnglish}"
                </p>

                <div className="pt-3 border-t border-slate-100 flex items-start space-x-2 text-xs text-slate-600">
                  <Stethoscope className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">What to ask your doctor: </span>
                    {selectedSim.doctorTip}
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 font-mono">
                  Biochemical pathway: {selectedSim.mechanism}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: THE 86 REACTION MECHANISMS */}
      {/* ========================================================= */}
      {activeTab === 'mechanisms' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <div className="flex items-center space-x-2 text-[#008060] font-bold text-xs uppercase tracking-wider mb-1">
                <Activity className="w-4 h-4" />
                <span>Clear Medical Classifications</span>
              </div>
              <h2 className="text-2xl font-bold font-heading text-slate-900">
                Understanding the 86 Biological Reaction Types
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Most drug safety checkers just give an ominous "Major Warning" badge without telling you what will actually happen in your body. We classify interactions into 86 specific physiological pathways. Explore 6 of the most frequent below:
              </p>
            </div>

            {/* Reaction Type Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reactionMechanisms.map((mech, idx) => {
                const IconComponent = mech.icon;
                const isSelected = selectedMechanismIdx === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMechanismIdx(idx)}
                    className={`p-5 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'border-[#008060] bg-teal-50/40 shadow-xs ring-2 ring-[#008060]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${mech.iconColor}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900">{mech.title}</h3>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block mb-2">
                      Common example: {mech.example}
                    </span>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {mech.simpleWhy}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Mechanism Detail Callout */}
            {reactionMechanisms[selectedMechanismIdx] && (
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                  <Stethoscope className="w-4 h-4 text-[#008060]" />
                  <span>Clinical Advice for {reactionMechanisms[selectedMechanismIdx].title}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {reactionMechanisms[selectedMechanismIdx].simpleWhy}
                </p>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-900">Patient Action Step: </span>
                  {reactionMechanisms[selectedMechanismIdx].whatToDo}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: MEDICAL RESEARCH FOUNDATION */}
      {/* ========================================================= */}
      {activeTab === 'science' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Research Paper Citation Card */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#008060] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                    Published Peer-Reviewed Research
                  </span>
                  <h3 className="text-lg font-bold font-heading text-slate-900">
                    Proceedings of the National Academy of Sciences (PNAS)
                  </h3>
                </div>
              </div>
              <a
                href="https://doi.org/10.1073/pnas.1803294115"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition"
              >
                <span>Read Original Paper</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="font-bold text-sm text-slate-900">
                "Deep learning provides a systematic approach to predict drug–drug interactions"
              </div>
              <p className="text-xs text-slate-600">
                Jae Yong Ryu, Hyun Uk Kim, and Sang Yup Lee. <em>PNAS</em> 2018; 115 (18) E4304–E4311.
              </p>
              <div className="pt-2 text-[11px] text-slate-500 font-mono">
                DOI: 10.1073/pnas.1803294115 • Validated across 192,284 pairs &amp; 86 interaction types
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="font-bold text-xs text-slate-900 block mb-1">1,710 Drugs Cataloged</span>
                <p className="text-xs text-slate-500">
                  Chemical structure representations and approved medical profiles.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="font-bold text-xs text-slate-900 block mb-1">86 Interaction Pathways</span>
                <p className="text-xs text-slate-500">
                  Covers metabolic breakdown, absorption interference, and cardiotoxicity.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="font-bold text-xs text-slate-900 block mb-1">Gold Standard Accuracy</span>
                <p className="text-xs text-slate-500">
                  Trained on rigorous train/val/test splits without artificial data leakage.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: TRUST, ETHICS & SAFETY COMMITMENT */}
      {/* ========================================================= */}
      {activeTab === 'ethics' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Comparison Matrix: Generic Drug Checkers vs MediGuard */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#008060]">
                Transparency Comparison
              </span>
              <h2 className="text-2xl font-bold font-heading text-slate-900 mt-1">
                How MediGuard AI Compares to Outdated Checkers
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-3 px-4 font-bold text-slate-500">Feature</th>
                    <th className="py-3 px-4 font-bold text-slate-400">Typical Online Checkers</th>
                    <th className="py-3 px-4 font-bold text-[#008060]">MediGuard AI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Plain-English Explanations</td>
                    <td className="py-3.5 px-4 text-slate-500 flex items-center space-x-1.5">
                      <X className="w-4 h-4 text-rose-500" />
                      <span>Dense medical jargon</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-teal-800 flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-[#008060]" />
                      <span>Easy for all age groups</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Unstudied / Novel Combinations</td>
                    <td className="py-3.5 px-4 text-slate-500 flex items-center space-x-1.5">
                      <X className="w-4 h-4 text-rose-500" />
                      <span>Blank "No interaction found"</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-teal-800 flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-[#008060]" />
                      <span>Layer 2 Neural Fingerprint fallback</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Safer Alternatives Suggested</td>
                    <td className="py-3.5 px-4 text-slate-500 flex items-center space-x-1.5">
                      <X className="w-4 h-4 text-rose-500" />
                      <span>Rarely provided</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-teal-800 flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-[#008060]" />
                      <span>Pre-screened substitutes to ask doctor</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Arbitrary Percentage Danger Scores</td>
                    <td className="py-3.5 px-4 text-slate-500 flex items-center space-x-1.5">
                      <span className="text-amber-600 font-semibold">Common ("82% Danger")</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-teal-800 flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-[#008060]" />
                      <span>Zero gimmick numbers; pure clinical mechanism</span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">Patient Privacy</td>
                    <td className="py-3.5 px-4 text-slate-500 flex items-center space-x-1.5">
                      <X className="w-4 h-4 text-rose-500" />
                      <span>Sold to ad networks or insurers</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-teal-800 flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-[#008060]" />
                      <span>100% Encrypted &amp; private to you</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-2xl font-bold font-heading text-slate-900 mb-2">
              Our Safety &amp; Medical Transparency Commitment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>No Made-Up Danger Scores</span>
                </div>
                <p className="text-xs text-amber-900/80 leading-relaxed">
                  We never display arbitrary numeric danger scores or made-up statistics. We explain the exact biological reaction happening in your body and specify whether it is confirmed by medical literature or estimated by AI.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
                <div className="flex items-center space-x-2 text-teal-900 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-[#008060]" />
                  <span>Your Individual Health Comes First</span>
                </div>
                <p className="text-xs text-teal-900/80 leading-relaxed">
                  No interaction checker can replace clinical judgment. Factors like kidney clearance, blood pressure, dosage, and meal timing affect medication safety. Always review results with your doctor or pharmacist.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                <Lock className="w-4 h-4 text-teal-600" />
                <span>Strict Patient Privacy</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your health data is yours alone. Your saved daily medicines, medical conditions, and emergency contacts are encrypted in your private database and are never shared or commercialized.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* WHO WE PROTECT (3 CARDS) */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-heading text-slate-900 text-center">
          Who MediGuard AI Protects
        </h2>
        <p className="text-sm text-slate-600 text-center max-w-xl mx-auto">
          Whether you take one prescription or manage multiple daily pills, safety starts with simple clarity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-3">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-teal-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008060] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Patients &amp; Families</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Understand what happens when mixing over-the-counter pills like pain relievers with your regular prescriptions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-teal-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008060] flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Seniors &amp; Caregivers</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track multiple daily medicines (polypharmacy) and screen for health clashes like diabetes, blood pressure, or kidney health.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-teal-400 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#008060] flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Doctors &amp; Pharmacists</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use a clean pre-screening tool that points directly to published medical literature and safer alternative medications.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE FAQ ACCORDION */}
      {/* ========================================================= */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-[#008060] font-bold text-xs uppercase tracking-wider">
          <HelpCircle className="w-4 h-4" />
          <span>Clear Answers</span>
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-900">
          Frequently Asked Questions
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
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed animate-fadeIn">
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

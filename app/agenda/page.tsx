'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ArrowLeft, 
  Palette, 
  Edit2, 
  Eye, 
  Sparkles,
  RefreshCw,
  Info,
  Sliders,
  Presentation
} from 'lucide-react';
import Link from 'next/link';
import { marked } from 'marked';

// Configure marked globally for proper processing of single breaks and GitHub Flavored Markdown
marked.use({
  breaks: true,
  gfm: true
});

// Define theme customizer parameters
type ThemeName = 'gradient-pink-blue' | 'soft-pink' | 'soft-blue' | 'lavender-mint';

interface AgendaTemplate {
  name: string;
  title: string;
  dates: string;
  planMarkdown: string;
  presentationMarkdown: string;
}

const AGENDA_TEMPLATES: Record<string, AgendaTemplate> = {
  ai_hackathon: {
    name: '🤖 AI Innovation Hackathon',
    title: '🧠 Generative AI Hackathon 2026',
    dates: 'October 23 - 25, 2026',
    planMarkdown: `# 🚀 Build & Hustle: Generative AI Hackathon

Welcome to the ultimate build sprint! Over the next 48 hours, you will collaborate with top developers, designers, and entrepreneurs to build innovative GenAI-powered web applications. 

---

## 📅 Day 1: Spark & Ideation

The launchpad of the challenge. Form teams, brainstorm, validate ideas, and begin the sprint!

- **09:00 AM - 11:00 AM** | 🔑 Registration & Networking Breakfast
- **11:00 AM - 12:00 PM** | 🎤 Opening Ceremony & Sponsor API Keynotes
- **12:00 PM - 01:00 PM** | 🤝 Team Formation & Mentor Speed-Dating
- **01:00 PM - 02:00 PM** | 🍕 Lunch & Workshop: *Accelerating UI with Next.js & Bun*
- **02:00 PM** | 💻 **HACKING OFFICIALLY BEGINS!**
- **05:00 PM - 06:00 PM** | 💡 Mentor Office Hours: Architecture & Ideation
- **08:00 PM** | 🌮 Dinner: *Taco Bar & Gaming Break*

---

## 📅 Day 2: The Deep Code

The peak of productivity. Put your head down, build features, refine user experience, and consult domain mentors.

- **08:00 AM - 09:30 AM** | 🍳 Breakfast & Espresso Bar Open
- **10:00 AM - 12:00 PM** | 🛠️ Mentor Check-ins (Required Technical Checkpoint)
- **01:00 PM - 02:00 PM** | 🍔 Lunch & Learn: *Mastering the 3-Minute Demo Pitch*
- **03:00 PM - 05:00 PM** | 🎨 Pitch Deck Clinic & Visual Polish Reviews
- **08:00 PM** | 🍜 Late Night Fuel: *Ramen & Energy Drinks*
- **11:00 PM** | 💤 Midnight Pizza & Security Checkpoint

---

## 📅 Day 3: The Pitch & Victory

Wrap up loose ends, freeze your code, present your build to the judges, and claim your share of the prizes!

- **08:00 AM - 09:30 AM** | 🥐 Warm Pastries & Coffee
- **09:30 AM - 11:00 AM** | 🛠️ Submission Support & Final Deployment Help
- **11:00 AM** | 🛑 **CODE FREEZE!** Final Projects Submitted to Devpost
- **11:30 AM - 01:30 PM** | 🎪 Science Fair Expo & Initial Round Judging
- **01:30 PM - 02:30 PM** | 🍱 Lunch & Finalist Deliberation
- **02:30 PM - 04:30 PM** | 🏆 Top 10 Team Demos & Live Q&A (Main Stage)
- **04:30 PM - 05:00 PM** | 🥇 Awards Ceremony & Closing Remarks

---

### 🏆 Prize Tracks & Locations

| Track | Prize | Location |
| :--- | :--- | :--- |
| **Grand Winner** | $10,000 Cash | Main Arena |
| **Best UX Design** | $2,500 Cash | Design Lab |
| **Most Innovative AI** | $2,500 API Credits | Innovation Room |

> "The best way to predict the future is to build it." — Let's build something extraordinary this weekend!`,
    presentationMarkdown: `# 🎤 Perfect Pitch: GenAI Presentation Blueprint

Master your 3-minute demo pitch. Highlight your AI models, validation, and tech stack clearly!

---

## ⚡ Pitch Outline (3 Minutes)

- **00:00 - 00:30** | **The AI Hook & Problem** | Frame a real-world pain point solved by GenAI.
- **00:30 - 01:30** | **The Live Demo** | Show the AI in action. Enter prompts, show the generated response, and highlight speed/accuracy.
- **01:30 - 02:15** | **AI Stack & Architecture** | Explain your pipeline (OpenRouter, Llama-3, Vector DB, etc.). Highlight fine-tuning, retrieval, or prompt engineering.
- **02:15 - 02:45** | **Viability & Hustle** | How does this scale? What's the monetisation funnel?
- **02:45 - 03:00** | **The Team & Dream** | Introduce developers, UI designers, and key skills.

---

## 🚨 AI Demo Checklist

- [ ] **Fallback Video**: Record a 1-minute silent screen capture of the working demo. If API keys fail or latency spikes during live demo, play the video!
- [ ] **Prompt Presets**: Pre-write 3 perfect input prompts in a text file. Copy and paste them to avoid typing errors under pressure.
- [ ] **Edge Cases**: Be prepared to answer how your system handles hallucination or sensitive data.`,
  },
  web3_sprint: {
    name: '🌐 Web3 & WASM Builders Sprint',
    title: '⛓️ WASM & Web3 Decentralized Sprint',
    dates: 'July 10 - 12, 2026',
    planMarkdown: `# 🌐 WASM & Web3 Decentralized Sprint

An intensive developers sprint focused on low-level performance, Rust-compiled WebAssembly, and decentralized system architectures.

---

## 📅 Day 1: Node Setup & Assembly

- **10:00 AM - 11:30 AM** | 🍵 Matcha Breakfast & Hardware Setup
- **11:30 AM - 12:30 PM** | 📢 System Architecture & SDK Briefing
- **12:30 PM - 01:30 PM** | 🥑 Clean Lunch & Team Deployment
- **01:30 PM** | 💻 **DEVISE & BUILD COMMAND INITIATED**
- **04:00 PM - 05:30 PM** | 🦀 Workshop: *High Performance WebAssembly with Rust*
- **07:30 PM** | 🍲 Dinner & Local Node Syncing

---

## 📅 Day 2: Consensus & Optimization

- **09:00 AM - 10:00 AM** | ☕ Morning Fuel & Coffee Bar
- **11:00 AM - 12:30 PM** | 🔍 Midpoint Checkpoint: Benchmarking Code
- **01:00 PM - 02:00 PM** | 🥗 Lunch & Workshop: *Designing for the Decentralized Web*
- **05:00 PM - 06:00 PM** | ⚡ Performance Auditing & Gas Optimization Office Hours
- **08:30 PM** | 🍕 Midnight Code Sprints & Chill Session

---

## 📅 Day 3: Block Settlement & Pitch

- **09:00 AM - 10:00 AM** | 🍳 Breakfast & Espresso
- **11:00 AM** | 🛑 **DEPLOYMENT FREEZE!** Final contracts pushed to testnet.
- **11:30 AM - 01:30 PM** | 📊 Live Code Inspection & Peer Audits
- **02:30 PM - 04:30 PM** | 🎤 Technical Presentations & Q&A
- **04:30 PM - 05:00 PM** | 🎉 Network Consensus: Prize Allocation & Closing`,
    presentationMarkdown: `# 🎤 Perfect Pitch: WASM & Web3 Demo Blueprint

Pitching decentralized architectures requires clarity. Focus on performance, security, and smart contract execution!

---

## ⚡ Pitch Outline (3 Minutes)

- **00:00 - 00:30** | **The Decentralized Use Case** | Why does this need WebAssembly or blockchain? Explain trustlessness or local browser speeds.
- **00:30 - 01:30** | **WASM / Web3 Demo** | Show the local browser execution. Strip metadata or execute WASM instantly without server roundtrips.
- **01:30 - 02:15** | **Rust & Cryptography Stack** | Highlight Rust compile size, safety guarantees, and state storage.
- **02:15 - 02:45** | **Network & Protocol Scaling** | How does this integrate with the wider Web3 ecosystem?
- **02:45 - 03:00** | **The Node Validators (Team)** | Introduce core rustaceans and front-end wizards.

---

## 🚨 Web3 Demo Checklist

- [ ] **Testnet Wallet**: Fund your demo wallet with test faucet tokens before the pitch.
- [ ] **Local Nodes**: Run a local node fallback in case the network public RPC lags.
- [ ] **UX Polish**: Ensure that loading states (e.g. transaction processing or WASM instantiation) have elegant spinners.`,
  },
  hustle_classic: {
    name: '⚡ TADS Hustle Weekend',
    title: '⚡ TADS 1K Challenge Bootcamp',
    dates: 'May 22 - 24, 2026',
    planMarkdown: `# ⚡ TADS 1K Challenge Bootcamp

Industrialize your hustle. Three days. Zero excuses. Formulate your product, build a high-conversion landing page, and land your first paying customer!

---

## 📅 Day 1: Build the Foundation

- **08:00 AM - 09:30 AM** | ☕ Hustler's Fuel (High-Caffeine Breakfast)
- **09:30 AM - 10:30 AM** | 🎯 Goal Definition: *The 1K Hustle Plan*
- **10:30 AM** | 💻 **DEVELOPMENT STARTS!**
- **01:00 PM - 02:00 PM** | 🥪 Standing Lunch: *No-Code & Rapid Prototyping Hacks*
- **04:00 PM - 05:30 PM** | 👥 Lead Generation & Landing Page Feedback
- **08:00 PM** | 🥩 Dinner: *Refining the USP*

---

## 📅 Day 2: Market Validation

- **08:00 AM** | ☀️ Sunrise Strategy Sync
- **11:00 AM - 01:00 PM** | 📞 Cold Outreach & Funnel Launch Checkpoint
- **01:00 PM - 02:00 PM** | 🥗 Lunch
- **03:00 PM - 05:00 PM** | 💳 Stripe Integration & Checkout Verification
- **08:00 PM** | 🥡 Late Night Push: *Converting Leads*

---

## 📅 Day 3: Revenue & Scaling

- **09:00 AM** | 🍳 Breakfast
- **11:00 AM** | 🛑 **HUSTLE FREEZE!** All products must be live and accepting payments.
- **12:00 PM - 02:00 PM** | 📈 Live Dashboard Audit: *Show the Stripe Logs*
- **03:00 PM - 04:30 PM** | 🏆 Awards: *Most Profitable Product & Hardest Hustler*
- **05:00 PM** | 🍾 Closing Celebration`,
    presentationMarkdown: `# 🎤 The Hustler's Pitch: Cash & Revenue Outline

Focus on validation, Stripe transactions, customer acquisition, and rapid building!

---

## ⚡ Pitch Outline (3 Minutes)

- **00:00 - 00:45** | **The Hustle & Market Need** | Frame a high-demand niche. Prove that people want this product.
- **00:45 - 01:45** | **The High-Converting Landing Page** | Show the visitor journey. Demonstrate the core checkout flow.
- **01:45 - 02:30** | **Stripe Ledger & Proof of Revenue** | Open your dashboard live. Show the audit logs, verified payments, and cash in hand!
- **02:30 - 03:00** | **Unit Economics & Margin** | CAC, LTV, and margin structure. Prove it's a scalable hustle.

---

## 🚨 Hustler's Checklist

- [ ] **Live Stripe Webhooks**: Verify that webhooks are active and upgrade accounts immediately upon receipt.
- [ ] **Cold Lead Logs**: Have your spreadsheet of 100+ outreach contacts open to show judges proof of active hustling.
- [ ] **Mobile Responsive**: Over 60% of customer purchases occur on mobile. Make sure your landing page and checkout are pristine on phone viewports!`,
  }
};

export default function HackathonAgendaPage(): JSX.Element {
  // Main form states
  const [title, setTitle] = useState(AGENDA_TEMPLATES.ai_hackathon.title);
  const [dates, setDates] = useState(AGENDA_TEMPLATES.ai_hackathon.dates);
  const [planMarkdown, setPlanMarkdown] = useState(AGENDA_TEMPLATES.ai_hackathon.planMarkdown);
  const [presentationMarkdown, setPresentationMarkdown] = useState(AGENDA_TEMPLATES.ai_hackathon.presentationMarkdown);
  
  // Customizer UI states
  const [selectedTheme, setSelectedTheme] = useState<ThemeName>('gradient-pink-blue');
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('editor');
  const [activeEditorTab, setActiveEditorTab] = useState<'plan' | 'presentation'>('plan');
  
  const [copiedText, setCopiedText] = useState<'markdown' | 'html' | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const [parsedPlanHtml, setParsedPlanHtml] = useState('');
  const [parsedPresentationHtml, setParsedPresentationHtml] = useState('');

  const previewRef = useRef<HTMLDivElement>(null);

  // Compile both Markdown fields to HTML in real-time
  useEffect(() => {
    try {
      setParsedPlanHtml(marked.parse(planMarkdown || '') as string);
    } catch (e) {
      console.error('Plan Markdown compilation error:', e);
    }
  }, [planMarkdown]);

  useEffect(() => {
    try {
      setParsedPresentationHtml(marked.parse(presentationMarkdown || '') as string);
    } catch (e) {
      console.error('Presentation Markdown compilation error:', e);
    }
  }, [presentationMarkdown]);

  // Load predefined template
  const handleLoadTemplate = (key: keyof typeof AGENDA_TEMPLATES) => {
    const template = AGENDA_TEMPLATES[key];
    setTitle(template.title);
    setDates(template.dates);
    setPlanMarkdown(template.planMarkdown);
    setPresentationMarkdown(template.presentationMarkdown);
  };

  // Copy helpers
  const handleCopyMarkdown = () => {
    const combinedMd = `# ${title}\nDates: ${dates}\n\n## 📅 AGENDA\n\n${planMarkdown}\n\n---\n\n## 🎤 PRESENTATION CHECKS\n\n${presentationMarkdown}`;
    navigator.clipboard.writeText(combinedMd);
    setCopiedText('markdown');
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleCopyHtml = () => {
    // Wrap with basic container
    const fullHtml = `
<div class="agenda-document" style="font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #334155;">
  <h1 style="font-size: 2.25rem; font-weight: 800; color: #0f172a; margin-bottom: 8px;">${title}</h1>
  <div style="font-size: 1rem; color: #64748b; margin-bottom: 24px;">${dates}</div>
  <hr style="border: 0; border-top: 2px solid #f1f5f9; margin-bottom: 32px;" />
  <div class="agenda-section">${parsedPlanHtml}</div>
  <div style="page-break-before: always; border-top: 2px dashed #cbd5e1; margin: 40px 0; padding-top: 40px;"></div>
  <div class="presentation-section">${parsedPresentationHtml}</div>
</div>`;
    navigator.clipboard.writeText(fullHtml);
    setCopiedText('html');
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Launch browser native print interface with high quality vector output
  const handlePrint = () => {
    window.print();
  };

  // High resolution client side PDF download using html2canvas & jsPDF
  const handleDownloadPDF = async () => {
    if (typeof window === 'undefined') return;
    
    setIsGeneratingPDF(true);
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;

      const element = previewRef.current;
      if (!element) return;

      // Render the HTML onto canvas with high scaling for crispness
      const canvas = await html2canvas(element, {
        scale: 2, // 2x retina scaling
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 800, // lock width for consistent rendering layout
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add First Page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Add subsequent pages if the agenda overflows A4 height
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      const formattedFileName = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_hackathon_pack.pdf`;
      pdf.save(formattedFileName);
      
      // Trigger success confirmation toast
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 4000);
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('PDF generation failed. Try using the "Print Vector PDF" option for native browser export.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Theme variable map
  const getThemeClass = (): { style: React.CSSProperties, class: string } => {
    switch (selectedTheme) {
      case 'soft-pink':
        return {
          style: {
            '--primary-accent': '#ec4899', // pink-500
            '--secondary-accent': '#f43f5e', // rose-500
            '--badge-bg': '#fdf2f8', // pink-50
            '--badge-text': '#be185d', // pink-700
            '--badge-border': '#fce7f3', // pink-100
            '--header-gradient': 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
            '--header-border': '#fecdd3',
          } as React.CSSProperties,
          class: 'theme-pink',
        };
      case 'soft-blue':
        return {
          style: {
            '--primary-accent': '#3b82f6', // blue-500
            '--secondary-accent': '#2563eb', // blue-600
            '--badge-bg': '#eff6ff', // blue-50
            '--badge-text': '#1d4ed8', // blue-700
            '--badge-border': '#dbeafe', // blue-100
            '--header-gradient': 'linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)',
            '--header-border': '#bfdbfe',
          } as React.CSSProperties,
          class: 'theme-blue',
        };
      case 'lavender-mint':
        return {
          style: {
            '--primary-accent': '#8b5cf6', // violet-500
            '--secondary-accent': '#0d9488', // teal-600
            '--badge-bg': '#f5f3ff', // violet-50
            '--badge-text': '#6d28d9', // violet-700
            '--badge-border': '#ede9fe', // violet-100
            '--header-gradient': 'linear-gradient(135deg, #f5f3ff 0%, #f0fdfa 100%)',
            '--header-border': '#e9d5ff',
          } as React.CSSProperties,
          class: 'theme-lavender',
        };
      case 'gradient-pink-blue':
      default:
        return {
          style: {
            '--primary-accent': '#ec4899', // pink-500
            '--secondary-accent': '#2563eb', // blue-600
            '--badge-bg': '#eff6ff', // blue-50
            '--badge-text': '#1d4ed8', // blue-700
            '--badge-border': '#dbeafe', // blue-100
            '--header-gradient': 'linear-gradient(135deg, #fff1f2 0%, #eff6ff 100%)',
            '--header-border': '#fbcfe8',
          } as React.CSSProperties,
          class: 'theme-gradient',
        };
    }
  };

  const currentTheme = getThemeClass();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans relative z-[90] flex flex-col selection:bg-pink-100 selection:text-pink-900">
      {/* Dynamic Native Print Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide everything except the preview container */
          body * {
            visibility: hidden;
          }
          #agenda-print-zone, #agenda-print-zone * {
            visibility: visible;
          }
          #agenda-print-zone {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm; /* Force absolute A4 dimensions */
            max-width: 100%;
            margin: 0 !important;
            padding: 20mm !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
            margin-top: 40px !important;
            padding-top: 40px !important;
            border-top: 2px dashed #e2e8f0 !important;
          }
          /* Prevent page cut on headings */
          h1, h2, h3 {
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          tr {
            page-break-inside: avoid;
          }
        }
      `}} />

      {/* Main Header / Navigation */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-50 no-print shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/"
              className="p-2 hover:bg-slate-50 rounded-xl transition-all duration-200 text-slate-500 hover:text-slate-900 flex items-center justify-center border border-slate-100"
              aria-label="Return to main console"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-pink-500 to-blue-500 text-white font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded font-bold">
                  TADS Tool
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Hackathon Pack Builder
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 border border-slate-200 hover:border-blue-300 rounded-xl text-slate-700 hover:text-blue-600 bg-white hover:bg-blue-50/20 transition-all font-medium text-xs flex items-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print Vector PDF</span>
            </button>
            <button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 rounded-xl text-white transition-all font-semibold text-xs flex items-center gap-2 shadow-md shadow-pink-100/50 relative overflow-hidden"
            >
              {isGeneratingPDF ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Editor & Preview Workspace Container */}
      <main className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8 no-print">
        {/* Mobile View Tabs Selector */}
        <div className="col-span-12 flex lg:hidden bg-white p-1 rounded-xl border border-slate-200 shadow-sm no-print mb-2">
          <button
            onClick={() => setActiveMobileTab('editor')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeMobileTab === 'editor' 
                ? 'bg-slate-900 text-white shadow' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Edit2 className="w-3.5 h-3.5" />
            Agenda Editor
          </button>
          <button
            onClick={() => setActiveMobileTab('preview')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeMobileTab === 'preview' 
                ? 'bg-slate-900 text-white shadow' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Live Preview (A4)
          </button>
        </div>

        {/* ============================================================== */}
        {/* LEFT COLUMN: EDITOR FORM                                       */}
        {/* ============================================================== */}
        <section 
          className={`lg:col-span-5 space-y-6 flex flex-col ${
            activeMobileTab === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Section: Templates */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-pink-500" />
                Preserve Presets / Templates
              </h3>
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Load preset configurations to auto-populate both schedule agenda and presentation pitch structures:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2 pt-1">
              {Object.entries(AGENDA_TEMPLATES).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => handleLoadTemplate(key)}
                  className="p-2.5 border border-slate-100 hover:border-pink-200 bg-slate-50/50 hover:bg-pink-50/10 rounded-xl text-left text-xs font-semibold text-slate-700 hover:text-pink-600 transition-all flex items-center gap-2"
                >
                  <span className="text-sm">{template.name.split(' ')[0]}</span>
                  <span className="truncate">{template.name.split(' ').slice(1).join(' ')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section: Attributes Form */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 border-b border-slate-50 pb-2">
              <Sliders className="w-3.5 h-3.5 text-blue-500" />
              General Attributes
            </h3>

            {/* Input: Title */}
            <div className="space-y-1.5">
              <label htmlFor="hackathon-title" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Hackathon Title
              </label>
              <input
                id="hackathon-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter event name..."
                className="w-full text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 focus:bg-white transition-all font-semibold text-sm"
              />
            </div>

            {/* Input: Dates */}
            <div className="space-y-1.5">
              <label htmlFor="hackathon-dates" className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Event Dates
              </label>
              <div className="relative">
                <input
                  id="hackathon-dates"
                  type="text"
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                  placeholder="e.g. October 14 - 16, 2026"
                  className="w-full text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 focus:bg-white transition-all font-semibold text-sm"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          </div>

          {/* Section: Dual MD Editors Workspace */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3 flex-1 flex flex-col min-h-[450px]">
            {/* Editor Workspace Tabs */}
            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/60 no-print mb-2">
              <button
                onClick={() => setActiveEditorTab('plan')}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeEditorTab === 'plan' 
                    ? 'bg-white text-pink-600 shadow-sm border border-slate-200/20' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-pink-500" />
                Schedule (plan.md)
              </button>
              <button
                onClick={() => setActiveEditorTab('presentation')}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                  activeEditorTab === 'presentation' 
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-200/20' 
                    : 'text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                <Presentation className="w-3.5 h-3.5 text-blue-500" />
                Pitch Guide (presentation.md)
              </button>
            </div>

            {/* Plan.md Editor Panel */}
            {activeEditorTab === 'plan' ? (
              <div className="flex-1 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="plan-editor" className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Schedule Markdown File (plan.md)
                  </label>
                  <span className="text-[9px] text-pink-500 font-mono">day_by_day_schedule</span>
                </div>
                <textarea
                  id="plan-editor"
                  value={planMarkdown}
                  onChange={(e) => setPlanMarkdown(e.target.value)}
                  placeholder="# 📅 Schedule Plan..."
                  className="w-full flex-1 min-h-[300px] p-4 text-slate-800 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-500 resize-y transition-all"
                />
              </div>
            ) : (
              /* Presentation.md Editor Panel */
              <div className="flex-1 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="presentation-editor" className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    Pitch Deck Outline File (presentation.md)
                  </label>
                  <span className="text-[9px] text-blue-500 font-mono">presentation_outline</span>
                </div>
                <textarea
                  id="presentation-editor"
                  value={presentationMarkdown}
                  onChange={(e) => setPresentationMarkdown(e.target.value)}
                  placeholder="# 🎤 Presentation Guideline..."
                  className="w-full flex-1 min-h-[300px] p-4 text-slate-800 bg-slate-50/50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-xl font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 resize-y transition-all"
                />
              </div>
            )}
            
            <div className="bg-pink-50/20 border border-pink-100/50 rounded-xl p-3 flex items-start gap-2.5">
              <Info className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-600 leading-normal">
                <strong className="text-pink-700">Dynamic Merging:</strong> Both files will be compiled and displayed dynamically. Checklists like <code>- [ ] Tasks</code> inside `presentation.md` will compile to interactive checkboxes o!
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* RIGHT COLUMN: LIVE PREVIEW PANEL                               */}
        {/* ============================================================== */}
        <section 
          className={`lg:col-span-7 flex flex-col space-y-4 ${
            activeMobileTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Controls Bar for Preview */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between no-print">
            {/* Theme Selectors */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                Theme Accent:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedTheme('gradient-pink-blue')}
                  className={`w-6 h-6 rounded-full bg-gradient-to-r from-pink-300 to-blue-300 border-2 transition-all flex items-center justify-center ${
                    selectedTheme === 'gradient-pink-blue' ? 'border-slate-800 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                  }`}
                  title="Gradient Pink-Blue (Classic)"
                >
                  {selectedTheme === 'gradient-pink-blue' && <Check className="w-3 h-3 text-slate-800" />}
                </button>
                <button
                  onClick={() => setSelectedTheme('soft-pink')}
                  className={`w-6 h-6 rounded-full bg-pink-400 border-2 transition-all flex items-center justify-center ${
                    selectedTheme === 'soft-pink' ? 'border-slate-800 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                  }`}
                  title="Soft Rose"
                >
                  {selectedTheme === 'soft-pink' && <Check className="w-3 h-3 text-white" />}
                </button>
                <button
                  onClick={() => setSelectedTheme('soft-blue')}
                  className={`w-6 h-6 rounded-full bg-blue-400 border-2 transition-all flex items-center justify-center ${
                    selectedTheme === 'soft-blue' ? 'border-slate-800 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                  }`}
                  title="Soft Ocean"
                >
                  {selectedTheme === 'soft-blue' && <Check className="w-3 h-3 text-white" />}
                </button>
                <button
                  onClick={() => setSelectedTheme('lavender-mint')}
                  className={`w-6 h-6 rounded-full bg-gradient-to-r from-violet-300 to-teal-300 border-2 transition-all flex items-center justify-center ${
                    selectedTheme === 'lavender-mint' ? 'border-slate-800 scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                  }`}
                  title="Lavender Mint"
                >
                  {selectedTheme === 'lavender-mint' && <Check className="w-3 h-3 text-slate-800" />}
                </button>
              </div>
            </div>

            {/* Quick Actions (Copy buttons) */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition-all font-medium text-[11px] flex items-center gap-1.5"
              >
                {copiedText === 'markdown' ? (
                  <>
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-semibold">Copied Markdown</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Pack MD</span>
                  </>
                )}
              </button>
              <button
                onClick={handleCopyHtml}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 hover:text-slate-900 transition-all font-medium text-[11px] flex items-center gap-1.5"
              >
                {copiedText === 'html' ? (
                  <>
                    <Check className="w-3 h-3 text-green-600" />
                    <span className="text-green-600 font-semibold">Copied HTML</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Pack HTML</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Paper Sheet Preview Area */}
          <div className="bg-slate-200/40 border border-slate-200 rounded-2xl p-4 md:p-6 overflow-auto max-h-[800px] flex justify-center shadow-inner relative">
            
            {/* The Print Zone Element - Styled as floating A4 sheet */}
            <div
              id="agenda-print-zone"
              ref={previewRef}
              style={currentTheme.style}
              className={`bg-white shadow-xl shadow-slate-300/40 rounded-sm border border-slate-300/60 p-8 md:p-12 w-[210mm] min-h-[297mm] text-slate-800 text-left transition-all ${currentTheme.class}`}
            >
              {/* Decorative faint blueprint dot grid pattern */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-sm"
                style={{
                  backgroundImage: 'radial-gradient(#2563eb 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />

              <div className="relative z-10 flex flex-col h-full">
                
                {/* Header card inside A4 */}
                <div 
                  className="rounded-xl border p-6 mb-8 flex flex-col gap-2 relative overflow-hidden"
                  style={{
                    background: 'var(--header-gradient)',
                    borderColor: 'var(--header-border)'
                  }}
                >
                  {/* Decorative pastel glowing background blurts */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-pink-300/10 blur-xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-32 h-32 rounded-full bg-blue-300/10 blur-xl pointer-events-none" />

                  <div className="flex items-center gap-2 relative z-10">
                    <span 
                      className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border"
                      style={{
                        borderColor: 'var(--primary-accent)',
                        color: 'var(--primary-accent)',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      Official Hackathon Pack
                    </span>
                  </div>

                  <h2 
                    className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight relative z-10"
                    style={{ textShadow: '0 1px 2px rgba(255,255,255,0.4)' }}
                  >
                    {title || 'Untitled Hackathon'}
                  </h2>

                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mt-1 relative z-10">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{dates || 'Date TBD'}</span>
                  </div>
                </div>

                {/* Section 1: Agenda plan.md */}
                <div 
                  dangerouslySetInnerHTML={{ __html: parsedPlanHtml }}
                  className="agenda-preview-content text-slate-700"
                />

                {/* Separation Line for Next Page (Vector Page-Break Support) */}
                <div className="page-break my-10 border-t-2 border-dashed border-slate-200 pt-10" />

                {/* Section 2: Presentation Guide presentation.md */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 rounded-lg bg-pink-50 text-pink-500 border border-pink-100">
                    <Presentation className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block">
                      Part Two
                    </span>
                    <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-tight m-0">
                      Pitch & Demo Blueprint
                    </h2>
                  </div>
                </div>

                <div 
                  dangerouslySetInnerHTML={{ __html: parsedPresentationHtml }}
                  className="agenda-preview-content text-slate-700"
                />

                {/* Footer block */}
                <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between text-[9px] font-semibold text-slate-400 uppercase tracking-widest">
                  <span>Generated with TADS Agenda Builder</span>
                  <span>Page 1 of 2</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Styled custom CSS scopes for custom HTML parsed from markdown */}
      <style jsx global>{`
        /* Heading styles */
        .agenda-preview-content h1 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin-top: 2rem;
          margin-bottom: 0.8rem;
          border-bottom: 2px solid #f1f5f9;
          padding-bottom: 0.3rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .agenda-preview-content h2 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--secondary-accent);
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          border-left: 3px solid var(--secondary-accent);
          padding-left: 0.6rem;
        }

        .agenda-preview-content h3 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--primary-accent);
          margin-top: 1.2rem;
          margin-bottom: 0.6rem;
        }

        .agenda-preview-content p {
          color: #475569;
          font-size: 0.85rem;
          line-height: 1.6;
          margin-bottom: 0.8rem;
        }

        /* Horizontal Divider */
        .agenda-preview-content hr {
          border: 0;
          border-top: 1px dashed #cbd5e1;
          margin: 1.5rem 0;
        }

        /* Unordered Schedule list */
        .agenda-preview-content ul {
          list-style-type: none;
          padding-left: 0;
          margin-bottom: 1.2rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .agenda-preview-content li {
          position: relative;
          padding-left: 1.2rem;
          margin-bottom: 0.25rem;
          color: #334155;
          font-size: 0.85rem;
          line-height: 1.5;
        }

        /* Standard Bullet Circle */
        .agenda-preview-content li::before {
          content: "•";
          position: absolute;
          left: 0.3rem;
          color: var(--primary-accent);
          font-weight: bold;
          font-size: 1.1rem;
          top: -0.05rem;
        }

        /* Timeline Badge parser magic! If bold tags are first item in lists, turn to pills */
        .agenda-preview-content li > strong:first-child {
          display: inline-block;
          background-color: var(--badge-bg);
          color: var(--badge-text);
          border: 1px solid var(--badge-border);
          padding: 0.1rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.7rem;
          font-weight: 700;
          margin-right: 0.6rem;
          box-shadow: 0 1px 1.5px rgba(0,0,0,0.02);
          letter-spacing: 0.02em;
        }

        /* Checklist styling! Intercept [ ] or [x] bullet checkmarks in presentation */
        .agenda-preview-content li > input[type="checkbox"] {
          margin-right: 0.5rem;
          accent-color: var(--primary-accent);
          transform: scale(1.1);
          vertical-align: middle;
          cursor: pointer;
        }

        /* Remove bullet circle if list item has checkbox */
        .agenda-preview-content li:has(input[type="checkbox"])::before {
          content: "" !important;
        }
        
        .agenda-preview-content li:has(input[type="checkbox"]) {
          padding-left: 0.25rem !important;
        }

        /* Table custom styling */
        .agenda-preview-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.2rem 0;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #f1f5f9;
        }

        .agenda-preview-content th {
          background-color: #f8fafc;
          border-bottom: 2px solid #e2e8f0;
          color: #475569;
          font-weight: 700;
          padding: 0.6rem 0.8rem;
          text-align: left;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .agenda-preview-content td {
          padding: 0.6rem 0.8rem;
          border-bottom: 1px solid #f1f5f9;
          color: #334155;
          font-size: 0.75rem;
        }

        .agenda-preview-content tr:last-child td {
          border-bottom: none;
        }

        .agenda-preview-content tr:nth-child(even) td {
          background-color: #fafbfd;
        }

        /* Blockquotes custom styling */
        .agenda-preview-content blockquote {
          border-left: 4px solid var(--primary-accent);
          background: linear-gradient(to right, #f8fafc, #ffffff);
          padding: 0.8rem 1rem;
          margin: 1.2rem 0;
          color: #475569;
          font-style: italic;
          border-radius: 0 8px 8px 0;
          font-size: 0.8rem;
          box-shadow: inset 1px 0 0 rgba(255,255,255,0.8);
        }
      `}</style>

      {/* Floating Success Confirmation Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-[200] bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex items-center gap-3 animate-bounce no-print">
          <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center text-white shrink-0">
            <Check className="w-4 h-4 font-bold" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">PDF Compiled Successfully</h4>
            <p className="text-[10px] text-slate-400">Your Hackathon Pack is downloaded. Ready for prime-time distribution!</p>
          </div>
        </div>
      )}
    </div>
  );
}

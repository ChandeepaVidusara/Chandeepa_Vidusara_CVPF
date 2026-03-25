import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Globe, GraduationCap, Award, Code, 
  Mail, Phone, MapPin, Plus, Trash2, Settings,
  ArrowRight, ExternalLink, ShieldCheck, LogIn,
  Image as ImageIcon, Video, User, Briefcase, FileText,
  Linkedin, Check, ThumbsUp, MessageSquare, Share2,
  Download, Printer, Layout, Type, UserCircle, History,
  BookOpen, Wrench, Languages, Heart, Cpu, Home, Lock, Eye, EyeOff, Sun, Moon,
  ChevronRight, Github, Search
} from 'lucide-react';
import { PortfolioData, Language, Project, Page, Post } from './types';
import { DEFAULT_DATA, TRANSLATIONS } from './constants';
import { savePortfolioData, subscribeToPortfolioData, auth, logGeneratedCV, subscribeToGeneratedCVs } from './firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Helper to convert Google Drive links to embeddable preview links
const getGoogleDriveEmbedUrl = (url: string) => {
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

const CVMaker = () => {
  const [cvData, setCvData] = useState({
    personal: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      summary: '',
      image: ''
    },
    experience: [{ id: '1', company: '', role: '', period: '', description: '' }],
    education: [{ id: '1', school: '', degree: '', period: '', description: '' }],
    skills: [''],
    languages: [''],
    certifications: ['']
  });

  const [template, setTemplate] = useState(1);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [zoom, setZoom] = useState(0.75);
  const [themeColor, setThemeColor] = useState('#FF6321');
  const updatePersonal = (field: string, value: string) => {
    setCvData({ ...cvData, personal: { ...cvData.personal, [field]: value } });
  };

  const addExperience = () => {
    setCvData({
      ...cvData,
      experience: [...cvData.experience, { id: Date.now().toString(), company: '', role: '', period: '', description: '' }]
    });
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setCvData({
      ...cvData,
      experience: cvData.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    });
  };

  const removeExperience = (id: string) => {
    setCvData({ ...cvData, experience: cvData.experience.filter(exp => exp.id !== id) });
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [...cvData.education, { id: Date.now().toString(), school: '', degree: '', period: '', description: '' }]
    });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCvData({
      ...cvData,
      education: cvData.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    });
  };

  const removeEducation = (id: string) => {
    setCvData({ ...cvData, education: cvData.education.filter(edu => edu.id !== id) });
  };

  const updateList = (field: 'skills' | 'languages' | 'certifications', index: number, value: string) => {
    const newList = [...cvData[field]];
    newList[index] = value;
    setCvData({ ...cvData, [field]: newList });
  };

  const addListItem = (field: 'skills' | 'languages' | 'certifications') => {
    setCvData({ ...cvData, [field]: [...cvData[field], ''] });
  };

  const removeListItem = (field: 'skills' | 'languages' | 'certifications', index: number) => {
    const newList = [...cvData[field]];
    newList.splice(index, 1);
    setCvData({ ...cvData, [field]: newList });
  };

  const handlePrint = () => {
    const confirmPrint = window.confirm("To save as PDF, select 'Save as PDF' in the printer destination dropdown. Would you like to proceed to print?");
    if (confirmPrint) {
      logGeneratedCV(
        cvData.personal.name || 'Anonymous',
        cvData.personal.email || 'No email',
        window.innerWidth < 1024 ? 'Mobile' : 'Desktop',
        template
      );
      window.print();
    }
  };

  const Template1 = () => (
    <div className="cv-page bg-white text-slate-800 shadow-2xl mx-auto flex flex-col font-sans w-[210mm] min-h-[297mm] p-[15mm]" style={{ '--cv-primary': themeColor } as any}>
      <div className="border-b-4 pb-6 mb-6 flex items-center gap-6" style={{ borderColor: themeColor }}>
        {cvData.personal.image && (
          <img src={cvData.personal.image} alt="Profile" className="w-24 h-24 rounded-full object-cover object-top shadow-md shrink-0" />
        )}
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-near-black">{cvData.personal.name || 'Your Name'}</h1>
          <p className="text-xl font-bold mt-1" style={{ color: themeColor }}>{cvData.personal.title || 'Professional Title'}</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-slate-600">
            {cvData.personal.email && <span className="flex items-center gap-1"><Mail size={14} /> {cvData.personal.email}</span>}
            {cvData.personal.phone && <span className="flex items-center gap-1"><Phone size={14} /> {cvData.personal.phone}</span>}
            {cvData.personal.location && <span className="flex items-center gap-1"><MapPin size={14} /> {cvData.personal.location}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 flex-grow">
        <div className="col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-near-black border-b-2 border-slate-200 pb-1 mb-3 flex items-center gap-2">
              <UserCircle size={18} style={{ color: themeColor }} /> Professional Summary
            </h2>
            <p className="text-sm leading-relaxed text-slate-700">{cvData.personal.summary || 'A brief summary of your professional background and goals.'}</p>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-near-black border-b-2 border-slate-200 pb-1 mb-3 flex items-center gap-2">
              <History size={18} style={{ color: themeColor }} /> Experience
            </h2>
            <div className="space-y-6">
              {cvData.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-near-black">{exp.role || 'Job Title'}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${themeColor}15`, color: themeColor }}>{exp.period || 'Period'}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600">{exp.company || 'Company Name'}</p>
                  <p className="text-sm mt-2 text-slate-700 whitespace-pre-wrap">{exp.description || 'Describe your responsibilities and achievements.'}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-near-black border-b-2 border-slate-200 pb-1 mb-3 flex items-center gap-2">
              <BookOpen size={18} style={{ color: themeColor }} /> Education
            </h2>
            <div className="space-y-4">
              {cvData.education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-near-black">{edu.degree || 'Degree/Certificate'}</h3>
                    <span className="text-xs font-bold text-slate-500">{edu.period || 'Period'}</span>
                  </div>
                  <p className="text-sm font-bold text-slate-600">{edu.school || 'Institution Name'}</p>
                  {edu.description && <p className="text-xs mt-1 text-slate-700">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-near-black border-b-2 border-slate-200 pb-1 mb-3 flex items-center gap-2">
              <Wrench size={18} style={{ color: themeColor }} /> Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {cvData.skills.filter(s => s).map((skill, i) => (
                <span key={i} className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full border border-slate-200">{skill}</span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-near-black border-b-2 border-slate-200 pb-1 mb-3 flex items-center gap-2">
              <Languages size={18} style={{ color: themeColor }} /> Languages
            </h2>
            <ul className="space-y-1">
              {cvData.languages.filter(l => l).map((lang, i) => (
                <li key={i} className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: themeColor }}></div> {lang}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-black uppercase tracking-widest text-near-black border-b-2 border-slate-200 pb-1 mb-3 flex items-center gap-2">
              <Award size={18} style={{ color: themeColor }} /> Certifications
            </h2>
            <ul className="space-y-2">
              {cvData.certifications.filter(c => c).map((cert, i) => (
                <li key={i} className="text-sm font-medium text-slate-700 leading-tight">{cert}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );

  const Template2 = () => (
    <div className="cv-page bg-white text-slate-800 shadow-2xl mx-auto flex flex-col font-serif w-[210mm] min-h-[297mm] p-[15mm]">
      <div className="text-center border-b-2 border-near-black pb-8 mb-8">
        {cvData.personal.image && (
          <img src={cvData.personal.image} alt="Profile" className="w-32 h-32 rounded-full object-cover object-top shadow-lg mx-auto mb-6" />
        )}
        <h1 className="text-5xl font-bold text-near-black tracking-tight mb-2">{cvData.personal.name || 'Your Name'}</h1>
        <p className="text-lg italic text-slate-600 mb-4">{cvData.personal.title || 'Professional Title'}</p>
        <div className="flex justify-center gap-6 text-sm font-medium text-slate-600">
          <span>{cvData.personal.email}</span>
          <span>{cvData.personal.phone}</span>
          <span>{cvData.personal.location}</span>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="text-xl font-bold uppercase tracking-widest text-near-black border-b border-near-black mb-4">Summary</h2>
          <p className="text-base leading-relaxed text-slate-700 italic">{cvData.personal.summary}</p>
        </section>

        <section>
          <h2 className="text-xl font-bold uppercase tracking-widest text-near-black border-b border-near-black mb-6">Professional Experience</h2>
          <div className="space-y-8">
            {cvData.experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-near-black">{exp.company}</h3>
                  <span className="text-sm font-bold italic">{exp.period}</span>
                </div>
                <p className="text-md font-bold text-slate-700 mb-2">{exp.role}</p>
                <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold uppercase tracking-widest text-near-black border-b border-near-black mb-6">Education</h2>
          <div className="space-y-6">
            {cvData.education.map(edu => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-bold text-near-black">{edu.school}</h3>
                  <span className="text-sm italic">{edu.period}</span>
                </div>
                <p className="text-md font-bold text-slate-700">{edu.degree}</p>
                {edu.description && <p className="text-sm mt-1 text-slate-600">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-12">
          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-near-black border-b border-near-black mb-4">Expertise</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
              {cvData.skills.filter(s => s).map((skill, i) => <li key={i}>{skill}</li>)}
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold uppercase tracking-widest text-near-black border-b border-near-black mb-4">Languages</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
              {cvData.languages.filter(l => l).map((lang, i) => <li key={i}>{lang}</li>)}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );

  const Template3 = () => (
    <div className="cv-page bg-near-black text-white shadow-2xl mx-auto flex flex-col font-sans overflow-hidden w-[210mm] min-h-[297mm]">
      <div className="flex-grow flex">
        <div className="w-1/3 bg-energetic-orange p-8 text-white flex flex-col">
          <div className="mb-10 text-center">
            {cvData.personal.image && (
              <img src={cvData.personal.image} alt="Profile" className="w-28 h-28 rounded-full object-cover object-top border-4 border-white/20 mx-auto mb-6 shadow-xl" />
            )}
            <h1 className="text-3xl font-black uppercase leading-tight">{cvData.personal.name || 'Your Name'}</h1>
            <p className="text-sm font-bold opacity-90 mt-2">{cvData.personal.title || 'Professional Title'}</p>
          </div>

          <div className="space-y-8 flex-grow">
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest mb-4 border-b border-white/30 pb-1">Contact</h2>
              <div className="space-y-3 text-xs font-medium">
                {cvData.personal.email && <p className="flex items-center gap-2"><Mail size={12} /> {cvData.personal.email}</p>}
                {cvData.personal.phone && <p className="flex items-center gap-2"><Phone size={12} /> {cvData.personal.phone}</p>}
                {cvData.personal.location && <p className="flex items-center gap-2"><MapPin size={12} /> {cvData.personal.location}</p>}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-widest mb-4 border-b border-white/30 pb-1">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {cvData.skills.filter(s => s).map((skill, i) => (
                  <span key={i} className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded">{skill}</span>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xs font-black uppercase tracking-widest mb-4 border-b border-white/30 pb-1">Languages</h2>
              <div className="space-y-2">
                {cvData.languages.filter(l => l).map((lang, i) => (
                  <div key={i} className="text-xs font-bold">{lang}</div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="w-2/3 p-10 bg-near-black space-y-10">
          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-energetic-orange mb-4">About Me</h2>
            <p className="text-sm leading-relaxed text-white/70">{cvData.personal.summary}</p>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-energetic-orange mb-6">Experience</h2>
            <div className="space-y-8">
              {cvData.experience.map(exp => (
                <div key={exp.id} className="relative pl-6 border-l border-white/10">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-energetic-orange"></div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-black uppercase">{exp.role}</h3>
                    <span className="text-[10px] font-bold text-white/40">{exp.period}</span>
                  </div>
                  <p className="text-xs font-bold text-energetic-orange mb-2">{exp.company}</p>
                  <p className="text-xs text-white/60 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-energetic-orange mb-6">Education</h2>
            <div className="space-y-6">
              {cvData.education.map(edu => (
                <div key={edu.id} className="relative pl-6 border-l border-white/10">
                  <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-energetic-orange"></div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm font-black uppercase">{edu.degree}</h3>
                    <span className="text-[10px] font-bold text-white/40">{edu.period}</span>
                  </div>
                  <p className="text-xs font-bold text-white/80">{edu.school}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const Template4 = () => (
    <div className="cv-page bg-white text-near-black shadow-2xl mx-auto flex flex-col font-sans w-[210mm] min-h-[297mm] p-[15mm]">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-12 gap-8">
        <div className="flex items-center gap-6">
          {cvData.personal.image && (
            <img src={cvData.personal.image} alt="Profile" className="w-32 h-32 rounded-xl object-cover object-top shadow-2xl shrink-0" />
          )}
          <div>
            <h1 className="text-6xl font-black tracking-tighter leading-none mb-2">{cvData.personal.name || 'Your Name'}</h1>
            <p className="text-2xl font-light text-slate-400">{cvData.personal.title || 'Professional Title'}</p>
          </div>
        </div>
        <div className="text-left sm:text-right space-y-1 text-sm font-medium text-slate-500">
          <p>{cvData.personal.email}</p>
          <p>{cvData.personal.phone}</p>
          <p>{cvData.personal.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-12 flex-grow">
        <div className="col-span-1 space-y-10">
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-energetic-orange mb-4">Expertise</h2>
            <div className="space-y-2">
              {cvData.skills.filter(s => s).map((skill, i) => (
                <p key={i} className="text-sm font-bold text-slate-700">{skill}</p>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-energetic-orange mb-4">Languages</h2>
            <div className="space-y-2">
              {cvData.languages.filter(l => l).map((lang, i) => (
                <p key={i} className="text-sm font-bold text-slate-700">{lang}</p>
              ))}
            </div>
          </section>
        </div>

        <div className="col-span-3 space-y-12">
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-energetic-orange mb-4">Profile</h2>
            <p className="text-lg font-medium leading-relaxed text-slate-600">{cvData.personal.summary}</p>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-energetic-orange mb-8">Experience</h2>
            <div className="space-y-10">
              {cvData.experience.map(exp => (
                <div key={exp.id} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <span className="text-sm font-black text-slate-300">{exp.period}</span>
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-xl font-black mb-1">{exp.role}</h3>
                    <p className="text-sm font-bold text-energetic-orange mb-3">{exp.company}</p>
                    <p className="text-sm text-slate-500 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-energetic-orange mb-8">Education</h2>
            <div className="space-y-8">
              {cvData.education.map(edu => (
                <div key={edu.id} className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <span className="text-sm font-black text-slate-300">{edu.period}</span>
                  </div>
                  <div className="col-span-3">
                    <h3 className="text-lg font-black mb-1">{edu.degree}</h3>
                    <p className="text-sm font-bold text-slate-600">{edu.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4 sm:px-6 relative">
      <div className="max-w-7xl mx-auto">
        {/* Mobile View Toggle */}
        <div className="lg:hidden flex mb-6 bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setViewMode('editor')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              viewMode === 'editor' ? 'bg-near-black text-white shadow-md' : 'text-slate-500'
            }`}
          >
            <Layout size={18} /> Editor
          </button>
          <button 
            onClick={() => setViewMode('preview')}
            className={`flex-1 py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              viewMode === 'preview' ? 'bg-near-black text-white shadow-md' : 'text-slate-500'
            }`}
          >
            <Eye size={18} /> Preview
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Editor Side */}
          <div className={`space-y-8 no-print cv-editor-area ${viewMode === 'preview' ? 'hidden lg:block' : 'block'}`}>
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <h2 className="text-2xl font-black text-near-black flex items-center gap-3">
                  <Layout className="text-energetic-orange" /> CV Editor
                </h2>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setTemplate(num)}
                      className={`px-3 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all border ${
                        template === num 
                          ? 'bg-energetic-orange text-white border-energetic-orange shadow-lg' 
                          : 'bg-white text-slate-400 border-slate-200 hover:border-energetic-orange hover:text-energetic-orange'
                      }`}
                    >
                      Template {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-10 p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row flex-wrap md:items-center justify-between gap-6">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Theme</span>
                    <input 
                      type="color" 
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-3 w-40">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Zoom</span>
                    <input 
                      type="range" 
                      min="0.4" 
                      max="1.2" 
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      className="flex-grow accent-energetic-orange"
                    />
                    <span className="text-[10px] font-bold text-slate-500 w-8">{Math.round(zoom * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                {/* Personal Info */}
                <section className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <UserCircle size={16} /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Profile Photo</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => updatePersonal('image', reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-energetic-orange outline-none transition-all cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-energetic-orange/10 file:text-energetic-orange hover:file:bg-energetic-orange/20"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-energetic-orange outline-none transition-all"
                      value={cvData.personal.name}
                      onChange={(e) => updatePersonal('name', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Professional Title"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-energetic-orange outline-none transition-all"
                      value={cvData.personal.title}
                      onChange={(e) => updatePersonal('title', e.target.value)}
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-energetic-orange outline-none transition-all"
                      value={cvData.personal.email}
                      onChange={(e) => updatePersonal('email', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-energetic-orange outline-none transition-all"
                      value={cvData.personal.phone}
                      onChange={(e) => updatePersonal('phone', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-energetic-orange outline-none transition-all"
                      value={cvData.personal.location}
                      onChange={(e) => updatePersonal('location', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="LinkedIn URL"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-energetic-orange outline-none transition-all"
                      value={cvData.personal.linkedin}
                      onChange={(e) => updatePersonal('linkedin', e.target.value)}
                    />
                  </div>
                  <textarea
                    placeholder="Professional Summary"
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-energetic-orange outline-none transition-all resize-none"
                    value={cvData.personal.summary}
                    onChange={(e) => updatePersonal('summary', e.target.value)}
                  />
                </section>

                {/* Experience */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <History size={16} /> Experience
                    </h3>
                    <button onClick={addExperience} className="text-energetic-orange hover:bg-energetic-orange/10 p-2 rounded-lg transition-colors">
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {cvData.experience.map((exp) => (
                      <div key={exp.id} className="p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200 relative group">
                        <button 
                          onClick={() => removeExperience(exp.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                        >
                          <X size={14} />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <input
                            type="text"
                            placeholder="Company"
                            className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-energetic-orange"
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Role"
                            className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-energetic-orange"
                            value={exp.role}
                            onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Period (e.g. 2020 - Present)"
                            className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-energetic-orange sm:col-span-2"
                            value={exp.period}
                            onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                          />
                        </div>
                        <textarea
                          placeholder="Description"
                          rows={4}
                          className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-energetic-orange resize-none"
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* Education */}
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <BookOpen size={16} /> Education
                    </h3>
                    <button onClick={addEducation} className="text-energetic-orange hover:bg-energetic-orange/10 p-2 rounded-lg transition-colors">
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {cvData.education.map((edu) => (
                      <div key={edu.id} className="p-4 sm:p-6 bg-slate-50 rounded-xl border border-slate-200 relative group">
                        <button 
                          onClick={() => removeEducation(edu.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                        >
                          <X size={14} />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Institution"
                            className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-energetic-orange"
                            value={edu.school}
                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Degree"
                            className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-energetic-orange"
                            value={edu.degree}
                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          />
                          <input
                            type="text"
                            placeholder="Period"
                            className="bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-energetic-orange sm:col-span-2"
                            value={edu.period}
                            onChange={(e) => updateEducation(edu.id, 'period', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Lists */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Wrench size={16} /> Skills
                      </h3>
                      <button onClick={() => addListItem('skills')} className="text-energetic-orange hover:bg-energetic-orange/10 p-1 rounded-lg transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {cvData.skills.map((skill, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-energetic-orange"
                            value={skill}
                            onChange={(e) => updateList('skills', i, e.target.value)}
                          />
                          <button onClick={() => removeListItem('skills', i)} className="text-red-500 p-1"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Languages size={16} /> Languages
                      </h3>
                      <button onClick={() => addListItem('languages')} className="text-energetic-orange hover:bg-energetic-orange/10 p-1 rounded-lg transition-colors">
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {cvData.languages.map((lang, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            type="text"
                            className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-energetic-orange"
                            value={lang}
                            onChange={(e) => updateList('languages', i, e.target.value)}
                          />
                          <button onClick={() => removeListItem('languages', i)} className="text-red-500 p-1"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handlePrint}
                  className="flex-1 bg-near-black text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-near-black/90 transition-all shadow-xl active:scale-95"
                >
                  <Printer size={20} /> Print CV
                </button>
                <button 
                  onClick={handlePrint}
                  className="flex-1 bg-energetic-orange text-white font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-energetic-orange/90 transition-all shadow-xl active:scale-95"
                >
                  <Download size={20} /> Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Preview Side */}
          <div className={`lg:sticky lg:top-32 h-auto lg:h-[calc(100vh-160px)] overflow-y-auto no-scrollbar bg-slate-200 rounded-2xl p-4 sm:p-8 border border-slate-300 shadow-inner no-print ${viewMode === 'editor' ? 'hidden lg:block' : 'block'}`}>
            <div className="flex justify-center items-start min-h-full">
              <div 
                className="origin-top transform transition-transform duration-300 shadow-2xl"
                style={{ transform: `scale(${zoom})` }}
              >
                {template === 1 && <Template1 />}
                {template === 2 && <Template2 />}
                {template === 3 && <Template3 />}
                {template === 4 && <Template4 />}
              </div>
            </div>
          </div>

          {/* Print Only View */}
          <div className="hidden print:block">
            {template === 1 && <Template1 />}
            {template === 2 && <Template2 />}
            {template === 3 && <Template3 />}
            {template === 4 && <Template4 />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>('EN');
  const [data, setData] = useState<PortfolioData>(DEFAULT_DATA);
  const [currentPage, setCurrentPage] = useState<Page>('brand-home');
  const [isLightMode, setIsLightMode] = useState(() => {
    return localStorage.getItem('cvk_theme') === 'light';
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newPostMedia, setNewPostMedia] = useState<{url: string, type: 'image' | 'video'}[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectMedia, setNewProjectMedia] = useState<{url: string, type: 'image' | 'video'}[]>([]);
  const [dashboardTab, setDashboardTab] = useState<'content' | 'security' | 'analytics'>('content');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [generatedCvs, setGeneratedCvs] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem('cvk_theme', isLightMode ? 'light' : 'dark');
  }, [isLightMode]);

  // Load from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToPortfolioData((firebaseData) => {
      if (firebaseData) {
        // Automatically sync the new CV schema and fix broken image if Firebase is outdated
        let needsSync = false;
        if (!firebaseData.personalImages || firebaseData.personalImages[0] !== DEFAULT_DATA.personalImages[0]) {
          firebaseData.personalImages = DEFAULT_DATA.personalImages;
          needsSync = true;
        }
        if (!firebaseData.cv || JSON.stringify(firebaseData.cv) !== JSON.stringify(DEFAULT_DATA.cv)) {
          firebaseData.cv = DEFAULT_DATA.cv;
          needsSync = true;
        }
        
        if (needsSync) {
          import('./firebase').then(m => m.savePortfolioData(firebaseData)).catch(e => console.error(e));
        }
        
        setData(firebaseData);
      } else {
        // If no data in Firebase, check localStorage as fallback or use default
        const savedData = localStorage.getItem('chandeepa_portfolio_data_v2');
        if (savedData) {
          setData(JSON.parse(savedData));
          // Sync to Firebase if empty
          savePortfolioData(JSON.parse(savedData));
        }
      }
    });

    const unsubscribeCvs = subscribeToGeneratedCVs((cvs) => {
      setGeneratedCvs(cvs);
    });

    return () => {
      unsubscribe();
      unsubscribeCvs();
    };
  }, []);

  // Save to Firebase and localStorage
  const saveData = (newData: PortfolioData) => {
    setData(newData);
    localStorage.setItem('chandeepa_portfolio_data_v2', JSON.stringify(newData));
    savePortfolioData(newData);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = TRANSLATIONS[lang];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAdmin(true);
      setShowLogin(false);
      setShowDashboard(true);
      setPassword('');
      setEmail('');
    } catch (error: any) {
      alert('Login failed: ' + error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = { ...project, id: Date.now().toString() };
    saveData({ ...data, projects: [...data.projects, newProject] });
  };

  const deleteProject = (id: string) => {
    saveData({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  const addPost = (post: Omit<Post, 'id' | 'date'>) => {
    const newPost: Post = { 
      ...post, 
      id: Date.now().toString(), 
      date: new Date().toLocaleDateString() 
    };
    saveData({ ...data, posts: [newPost, ...data.posts] });
  };

  const deletePost = (id: string) => {
    saveData({ ...data, posts: data.posts.filter(p => p.id !== id) });
  };

  const addGalleryImage = (url: string) => {
    if (!url) return;
    saveData({ ...data, personalImages: [...data.personalImages, url] });
  };

  const deleteGalleryImage = (index: number) => {
    const newImages = [...data.personalImages];
    newImages.splice(index, 1);
    saveData({ ...data, personalImages: newImages });
  };

  const renderMedia = (url: string, type: 'image' | 'video', className = "w-full h-full object-cover") => {
    if (type === 'video') {
      const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
      const isGoogleDrive = url.includes('drive.google.com');

      if (isYoutube) {
        const id = url.split('v=')[1] || url.split('/').pop();
        return (
          <iframe 
            className="w-full aspect-video"
            src={`https://www.youtube.com/embed/${id}`}
            title="Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      } else if (isGoogleDrive) {
        const embedUrl = getGoogleDriveEmbedUrl(url);
        return (
          <iframe 
            className="w-full aspect-video"
            src={embedUrl}
            title="Google Drive Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        );
      }
      return <video src={url} controls className={className} />;
    }
    return <img src={url} alt="" className={className} referrerPolicy="no-referrer" />;
  };

  const PostContent = ({ text }: { text: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const maxLength = 180;
    const shouldTruncate = text.length > maxLength;

    return (
      <div className="px-4 pb-3 text-near-black/80 whitespace-pre-wrap text-sm leading-relaxed">
        {isExpanded || !shouldTruncate ? text : `${text.substring(0, maxLength)}...`}
        {shouldTruncate && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-energetic-orange font-bold ml-1 hover:underline focus:outline-none"
          >
            {isExpanded ? 'See Less' : 'See More'}
          </button>
        )}
      </div>
    );
  };

  const PostMediaGallery = ({ media }: { media: Post['media'] }) => {
    if (!media || media.length === 0) return null;

    const count = media.length;
    
    if (count === 1) {
      return (
        <div className="w-full bg-near-black/5 flex items-center justify-center overflow-hidden">
          {renderMedia(media[0].url, media[0].type, "w-full max-h-[600px] object-contain")}
        </div>
      );
    }

    return (
      <div className={`grid gap-0.5 bg-near-black/5 ${count === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
        {media.slice(0, 4).map((m, i) => (
          <div key={i} className={`relative overflow-hidden ${count === 3 && i === 0 ? 'row-span-2' : 'aspect-square'}`}>
            {renderMedia(m.url, m.type, "w-full h-full object-cover")}
            {i === 3 && count > 4 && (
              <div className="absolute inset-0 bg-near-black/60 flex items-center justify-center text-white text-2xl font-bold">
                +{count - 4}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const BackgroundGraphics = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 no-print">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]"></div>
      
      {/* Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-energetic-orange/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-deep-blue/10 blur-[120px] rounded-full"></div>
      
      {/* Animated Floating Shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            rotate: 0,
            opacity: 0.1
          }}
          animate={{ 
            y: [null, Math.random() * 100 - 50 + "%"],
            rotate: 360,
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className={`absolute border border-white/10 ${i % 2 === 0 ? 'rounded-full' : 'rounded-3xl'}`}
          style={{ 
            width: Math.random() * 300 + 100 + "px", 
            height: Math.random() * 300 + 100 + "px" 
          }}
        />
      ))}

      {/* Animated Dots */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.3
          }}
          animate={{ 
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 2, 1],
            y: [null, "-20px"]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-energetic-orange rounded-full"
        />
      ))}
    </div>
  );

  const NavLink = ({ page, label }: { page: Page, label: string }) => (
    <button 
      onClick={() => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
      }}
      className={`transition-colors font-medium text-sm uppercase tracking-widest ${
        currentPage === page ? 'text-energetic-orange' : 'text-white/80 hover:text-energetic-orange'
      }`}
    >
      {label}
    </button>
  );

  const isPortfolioPage = ['home', 'projects', 'posts', 'cv'].includes(currentPage);
  const isBrandPage = ['brand-home', 'brand-services'].includes(currentPage);

  return (
    <div className={`min-h-screen font-sans bg-near-black ${isLightMode ? 'light-mode' : ''}`}>
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 no-print ${isScrolled || currentPage !== 'brand-home' ? 'bg-near-black/95 backdrop-blur-md py-4 shadow-lg border-b border-white/5' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => {
                setCurrentPage('brand-home');
                window.scrollTo(0, 0);
              }}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-energetic-orange rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:rotate-12 transition-transform">C</div>
              <div className="flex flex-col items-start">
                <span className="text-2xl font-black tracking-tighter text-white leading-none">CVK</span>
                <span className="text-[8px] font-bold text-energetic-orange tracking-[0.3em] uppercase">Engineering</span>
              </div>
            </button>
            <button 
              onClick={() => setLang(lang === 'EN' ? 'SI' : 'EN')}
              className="flex items-center gap-2 text-white hover:text-energetic-orange transition-colors font-medium text-sm border border-white/20 px-3 py-1.5 rounded-md"
            >
              <Globe size={16} />
              {lang === 'EN' ? 'සිංහල' : 'English'}
            </button>
            <button 
              onClick={() => setIsLightMode(!isLightMode)}
              className="flex items-center justify-center w-8 h-8 text-white hover:text-energetic-orange transition-colors border border-white/20 rounded-md"
              title="Toggle Light/Dark Mode"
            >
              {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <NavLink page="brand-home" label={t.nav.brandHome} />
            <NavLink page="brand-services" label={t.nav.services} />
            <NavLink page="cv-maker" label={t.nav.cvMaker} />
            <NavLink page="home" label={t.nav.portfolio} />
            <a href="#contact" className="text-white/80 hover:text-energetic-orange transition-colors font-medium text-sm uppercase tracking-widest">
              {t.nav.contact}
            </a>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Portfolio Sub-Navbar */}
        <AnimatePresence>
          {isPortfolioPage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full bg-near-black/80 border-t border-white/10 py-3 mt-4"
            >
              <div className="max-w-7xl mx-auto px-6 flex justify-center gap-8 overflow-x-auto no-scrollbar">
                <NavLink page="home" label={t.nav.home} />
                <a href="#expertise" className="text-white/60 hover:text-energetic-orange transition-colors font-medium text-xs uppercase tracking-widest whitespace-nowrap">
                  {t.nav.expertise}
                </a>
                <NavLink page="projects" label={t.nav.projects} />
                <NavLink page="posts" label={t.nav.posts} />
                <NavLink page="cv" label={t.nav.cv} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-near-black border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6">
                <NavLink page="brand-home" label={t.nav.brandHome} />
                <NavLink page="brand-services" label={t.nav.services} />
                <NavLink page="cv-maker" label={t.nav.cvMaker} />
                <NavLink page="home" label={t.nav.portfolio} />
                {isPortfolioPage && (
                  <div className="pl-4 border-l border-white/10 flex flex-col gap-4">
                    <NavLink page="home" label={t.nav.home} />
                    <NavLink page="projects" label={t.nav.projects} />
                    <NavLink page="posts" label={t.nav.posts} />
                    <NavLink page="cv" label={t.nav.cv} />
                  </div>
                )}
                <a 
                  href="#contact" 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white/80 hover:text-energetic-orange transition-colors font-medium text-sm uppercase tracking-widest"
                >
                  {t.nav.contact}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentPage === 'brand-home' && (
          <motion.div 
            key="brand-home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-near-black"
          >
            {/* Brand Hero */}
            <section className="relative min-h-screen flex items-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUYo9g2KlKmXTpVEgd4YKNzzpPTa0cpMgKJQ&s')] bg-cover bg-center opacity-40 scale-110"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-near-black via-near-black/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-near-black/40"></div>
                <BackgroundGraphics />
              </div>

              <div className="max-w-7xl mx-auto px-6 w-full relative z-10 py-32">
                <div className="max-w-4xl">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-4 mb-8"
                  >
                    <div className="h-[2px] w-12 bg-energetic-orange"></div>
                    <span className="text-energetic-orange font-bold tracking-[0.5em] uppercase text-xs">Innovation & Excellence</span>
                  </motion.div>
                  
                  <motion.h1 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-[0.85] mb-10 tracking-tighter"
                  >
                    CVK <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-energetic-orange to-orange-400">ENGINEERING.</span>
                  </motion.h1 >

                  <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl md:text-2xl text-white/70 mb-14 leading-relaxed max-w-2xl"
                  >
                    {data.brandHeadline}
                  </motion.p>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-wrap gap-8"
                  >
                    <button 
                      onClick={() => {
                        setCurrentPage('brand-services');
                        window.scrollTo(0, 0);
                      }}
                      className="group relative px-12 py-5 bg-energetic-orange text-white font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        DISCOVER SERVICES
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setCurrentPage('home');
                        window.scrollTo(0, 0);
                      }}
                      className="px-12 py-5 border-2 border-white/20 text-white font-black rounded-full hover:bg-white hover:text-near-black transition-all hover:border-white"
                    >
                      VIEW PORTFOLIO
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Decorative Scroll Indicator */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
              >
                <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
                <span className="text-[10px] text-white uppercase tracking-[0.3em]">Scroll</span>
              </motion.div>
            </section>

            {/* Features Grid */}
            <section className="py-20 md:py-32 bg-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                  {[
                    { title: "Precision", desc: "Meticulous attention to detail in every engineering solution we deliver.", icon: ShieldCheck },
                    { title: "Automation", desc: "Cutting-edge industrial automation to streamline your business processes.", icon: Settings },
                    { title: "Innovation", desc: "Constant research and development to stay ahead of industry trends.", icon: Code }
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                      className="p-8 md:p-12 bg-near-black/5 rounded-[2rem] md:rounded-[2.5rem] border border-near-black/5 hover:bg-near-black hover:text-white transition-all duration-500 group"
                    >
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-energetic-orange rounded-2xl flex items-center justify-center text-white mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                        <feature.icon size={28} />
                      </div>
                      <h3 className="text-xl md:text-2xl font-black mb-4 uppercase tracking-tight">{feature.title}</h3>
                      <p className="text-near-black/60 group-hover:text-white/60 leading-relaxed text-sm md:text-base">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Brand About */}
            <section className="py-20 md:py-32 bg-near-black text-white relative">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-energetic-orange/5 blur-[120px] pointer-events-none"></div>
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-black mb-8 md:mb-10 leading-[0.9] tracking-tighter">
                      BRIDGING <br />
                      <span className="text-energetic-orange">TECHNOLOGY</span> <br />
                      & INDUSTRY.
                    </h2>
                    <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 md:mb-12 max-w-xl">
                      {data.brandAbout}
                    </p>
                    <div className="grid grid-cols-2 gap-8 md:gap-12">
                      <div className="border-l-2 border-energetic-orange pl-6 md:pl-8">
                        <div className="text-4xl md:text-5xl font-black mb-2">50+</div>
                        <div className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest">Projects Completed</div>
                      </div>
                      <div className="border-l-2 border-energetic-orange pl-6 md:pl-8">
                        <div className="text-4xl md:text-5xl font-black mb-2">10+</div>
                        <div className="text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest">Industry Partners</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative"
                  >
                    <div className="aspect-square sm:aspect-[4/5] bg-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 p-3 md:p-4">
                      <img 
                        src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" 
                        alt="Engineering" 
                        className="w-full h-full object-cover rounded-[1.5rem] md:rounded-[2.5rem] opacity-80 grayscale hover:grayscale-0 transition-all duration-1000"
                      />
                    </div>
                    <div className="absolute -bottom-6 -right-6 md:-bottom-12 md:-right-12 w-32 h-32 md:w-48 md:h-48 bg-energetic-orange rounded-full flex items-center justify-center animate-pulse">
                      <Settings size={48} className="text-white animate-spin-slow md:hidden" />
                      <Settings size={64} className="text-white animate-spin-slow hidden md:block" />
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Brand Contact Section */}
            <section id="brand-contact" className="py-32 bg-white relative overflow-hidden">
              <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                  <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase"
                  >
                    Get In <span className="text-energetic-orange">Touch</span>
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-near-black/60 max-w-2xl mx-auto"
                  >
                    Ready to automate your business? Contact us today for a consultation. Our team is ready to help you bridge the gap between technology and industry.
                  </motion.p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: Mail, label: "Email Us", value: data.contact.email, href: `mailto:${data.contact.email}` },
                    { icon: Phone, label: "Call Us", value: data.contact.phone, href: `tel:${data.contact.phone}` },
                    { icon: MapPin, label: "Visit Us", value: data.contact.location, href: "#" }
                  ].map((item, i) => (
                    <motion.a
                      key={i}
                      href={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="p-10 bg-near-black/5 rounded-3xl border border-near-black/5 flex flex-col items-center text-center group hover:bg-near-black hover:text-white transition-all duration-500"
                    >
                      <div className="w-16 h-16 bg-energetic-orange/10 rounded-2xl flex items-center justify-center text-energetic-orange mb-6 group-hover:bg-energetic-orange group-hover:text-white transition-all">
                        <item.icon size={28} />
                      </div>
                      <h4 className="text-xs font-bold uppercase tracking-widest text-near-black/40 group-hover:text-white/40 mb-2">{item.label}</h4>
                      <p className="font-bold text-sm break-all">{item.value}</p>
                    </motion.a>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {currentPage === 'brand-services' && (
          <motion.div 
            key="brand-services"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative bg-near-black min-h-screen overflow-hidden"
          >
            <div className="absolute inset-0 z-0">
              <BackgroundGraphics />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 pt-32 md:pt-40 pb-20 md:pb-32">
              <div className="mb-16 md:mb-24">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div className="h-[2px] w-12 bg-energetic-orange"></div>
                  <span className="text-energetic-orange font-bold tracking-[0.5em] uppercase text-xs">Our Expertise</span>
                </motion.div>
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
                  SOLUTIONS WE <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-energetic-orange to-orange-400">PROVIDE.</span>
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {data.services?.map((service, i) => (
                  <motion.div 
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] hover:bg-white/10 transition-all group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-energetic-orange/5 blur-3xl group-hover:bg-energetic-orange/10 transition-colors"></div>
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-energetic-orange rounded-2xl flex items-center justify-center text-white mb-8 md:mb-10 group-hover:scale-110 transition-transform shadow-lg shadow-energetic-orange/20">
                      {service.icon === 'Settings' && <Settings size={28} />}
                      {service.icon === 'Code' && <Code size={28} />}
                      {service.icon === 'Globe' && <Globe size={28} />}
                      {service.icon === 'Cpu' && <Cpu size={28} />}
                      {service.icon === 'Home' && <Home size={28} />}
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-4 md:mb-6 uppercase tracking-tight">{service.title}</h3>
                    <p className="text-white/60 leading-relaxed text-base md:text-lg">{service.description}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-20 md:mt-32 p-8 sm:p-12 md:p-16 bg-gradient-to-br from-energetic-orange to-orange-600 rounded-[2rem] md:rounded-[3rem] text-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 md:mb-8 tracking-tighter">HAVE A PROJECT IN MIND?</h2>
                  <p className="text-lg md:text-xl text-white/90 mb-10 md:mb-12 max-w-2xl mx-auto font-medium">
                    We are always ready to take on new challenges and help you automate your business processes with cutting-edge engineering.
                  </p>
                  <a href="#contact" className="inline-flex items-center gap-3 bg-white text-near-black px-10 md:px-14 py-4 md:py-5 rounded-full font-black hover:bg-near-black hover:text-white transition-all hover:scale-105 active:scale-95 shadow-xl text-sm md:text-base">
                    GET STARTED
                    <ArrowRight size={24} />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {currentPage === 'cv-maker' && (
          <motion.div 
            key="cv-maker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CVMaker />
          </motion.div>
        )}

        {currentPage === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-near-black"
          >
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center bg-near-black overflow-hidden">
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://cmb.ac.lk/wp-content/uploads/faculty-of-technology.jpg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-near-black via-near-black/80 md:via-near-black/60 to-transparent"></div>
                <BackgroundGraphics />
              </div>

              <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center relative z-10 py-12 md:py-0">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center md:text-left"
                >
                  <h2 className="text-energetic-orange font-bold tracking-[0.3em] uppercase mb-4 text-xs md:text-sm">Chandeepa Vidusara</h2>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
                    Engineering <br className="hidden sm:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-energetic-orange to-orange-400">Precision.</span>
                  </h1>
                  <p className="text-lg md:text-xl text-white/70 mb-10 max-w-lg mx-auto md:mx-0 leading-relaxed">
                    {data.headline}
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                    <button onClick={() => setCurrentPage('projects')} className="bg-energetic-orange hover:bg-orange-600 text-white px-8 py-4 rounded-md font-bold transition-all flex items-center justify-center gap-2 group">
                      {t.hero.cta}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <a href="#contact" className="border border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-md font-bold transition-all text-center">
                      {t.nav.contact}
                    </a>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex justify-center md:justify-end"
                >
                  <div className="sharp-frame w-full max-w-[280px] sm:max-w-sm md:max-w-md aspect-[4/5] bg-near-black shadow-2xl">
                    <img 
                      src={data.personalImages[0] || ""} 
                      alt="Chandeepa Vidusara"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </motion.div>
              </div>
            </section>

            {/* About Me Section */}
            <section className="py-16 md:py-24 bg-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-3xl md:text-4xl font-extrabold text-near-black mb-6 md:mb-8">{t.about.title}</h2>
                    <p className="text-base md:text-lg text-near-black/70 leading-relaxed mb-8">
                      {data.aboutMe}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="p-5 md:p-6 bg-near-black/5 rounded-xl border border-near-black/5">
                        <h4 className="font-bold text-energetic-orange mb-1">Location</h4>
                        <p className="text-sm text-near-black/60">Galle, Sri Lanka</p>
                      </div>
                      <div className="p-5 md:p-6 bg-near-black/5 rounded-xl border border-near-black/5">
                        <h4 className="font-bold text-energetic-orange mb-1">Role</h4>
                        <p className="text-sm text-near-black/60">Automation Engineer</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 gap-3 md:gap-4"
                  >
                    {data.personalImages.length > 0 ? (
                      <>
                        <div className="col-span-1 row-span-2 aspect-[3/4] overflow-hidden rounded-2xl shadow-lg group">
                          <img 
                            src={data.personalImages[0]} 
                            alt="" 
                            referrerPolicy="no-referrer" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        </div>
                        <div className="space-y-3 md:space-y-4">
                          {data.personalImages.slice(1, 3).map((img, i) => (
                            <div key={i} className="aspect-square overflow-hidden rounded-2xl shadow-md group">
                              <img 
                                src={img} 
                                alt="" 
                                referrerPolicy="no-referrer" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                              />
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2 aspect-video bg-near-black/5 rounded-2xl flex items-center justify-center text-near-black/20">
                        <ImageIcon size={48} />
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Expertise Section */}
            <section id="expertise" className="py-20 md:py-24 bg-near-black text-white">
              <div className="max-w-7xl mx-auto px-6">
                <div className="mb-12 md:mb-16">
                  <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{t.expertise.title}</h2>
                  <p className="text-white/60 text-base md:text-lg">{t.expertise.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                  <div className="space-y-8">
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-energetic-orange shrink-0">
                        <GraduationCap size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{t.expertise.education}</h3>
                        <div className="border-l-2 border-energetic-orange pl-6 py-2 space-y-8">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <img 
                                src="https://cmb.ac.lk/wp-content/uploads/logo-web.png" 
                                alt="UoC Logo" 
                                className="w-8 h-8 object-contain"
                                referrerPolicy="no-referrer"
                              />
                              <h4 className="font-bold text-white text-lg">{t.expertise.uoc}</h4>
                            </div>
                            <p className="text-white/70 font-medium">{t.expertise.degree}</p>
                            <div className="flex flex-wrap gap-4 mt-2">
                              <p className="text-energetic-orange font-bold text-sm">{t.expertise.gpa}</p>
                              <p className="text-white/40 text-sm">{t.expertise.faculty}</p>
                            </div>
                            <p className="mt-3 text-sm text-white/60 leading-relaxed">
                              {t.expertise.modules}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-lg mb-1">St. Anthony's (National) College</h4>
                            <p className="text-white/70">G.C.E. Advanced Level - Engineering Tech</p>
                            <div className="flex flex-wrap gap-4 mt-1">
                              <p className="text-energetic-orange font-bold text-sm">Z-Score: 2.0285</p>
                              <p className="text-white/40 text-sm">Island Rank: 220</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-energetic-orange shrink-0">
                        <Award size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Awards</h3>
                        <div className="border-l-2 border-energetic-orange pl-6 py-2">
                          <h4 className="font-bold text-white">{t.expertise.award}</h4>
                          <p className="text-white/70">{t.expertise.awardDesc}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex gap-6 mb-8">
                      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-energetic-orange shrink-0">
                        <Code size={24} />
                      </div>
                      <h3 className="text-xl font-bold">{t.expertise.skills}</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {['Arduino', 'Java', 'Python', 'Ladder Logic', 'SolidWorks', 'Web Development', 'AutoCAD', 'PLC Programming', 'ESP32', 'NodeMCU', 'Firebase', 'Industrial Automation'].map((skill) => (
                        <span key={skill} className="bg-white/5 text-white px-4 py-2 rounded-sm text-sm font-medium tracking-wide border border-white/10 hover:bg-energetic-orange hover:border-energetic-orange transition-all cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {currentPage === 'projects' && (
          <motion.div 
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-24 relative overflow-hidden"
          >
            <BackgroundGraphics />
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="mb-16">
                <h2 className="text-5xl font-extrabold text-near-black mb-4">{t.projects.title}</h2>
                <p className="text-near-black/60 text-xl">{t.projects.subtitle}</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.projects.map((project, index) => (
                  <motion.div 
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-near-black text-white overflow-hidden rounded-lg cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-energetic-orange text-[10px] font-bold uppercase tracking-widest mb-1 block">{project.category}</span>
                      <h3 className="text-lg font-bold mb-2 line-clamp-1">{project.title}</h3>
                      <p className="text-white/60 text-xs mb-4 line-clamp-2">{project.description}</p>
                      <button className="flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-wider group/btn">
                        Details <ExternalLink size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 'cv' && (
          <motion.div 
            key="cv"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="pt-32 pb-24 bg-[#525659] min-h-screen relative overflow-hidden"
          >
            <BackgroundGraphics />
            <div className="max-w-5xl mx-auto px-6 relative z-10 flex justify-center gap-10 cv-container">

              {/* CV Document (A4 Page 1) */}
              <div className="flex flex-col gap-10">
                {/* Visual split logic: The document will now just print naturally with CSS page-break, 
                    but looks unified and professional on screen. It mimics 2 pages with height */}
              <div className="bg-white shadow-2xl w-[210mm] flex flex-col font-sans text-[#222] relative overflow-hidden rounded-sm p-[15mm] md:p-[20mm] cv-page" style={{minHeight: "594mm"}}>
                {/* CV Header */}
                <div className="border-b-[3px] border-[#003366] pb-5 mb-6 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-[2.5rem] font-extrabold uppercase leading-none text-[#003366] tracking-tight">
                      {data.cv?.personalInfo.fullName.split(' ')[0]} <span className="text-energetic-orange">{data.cv?.personalInfo.fullName.split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <div className="flex flex-col gap-1 text-[0.85rem] text-[#555] mt-3">
                      <p className="flex items-center justify-center md:justify-start gap-2">
                        <Mail size={14} className="text-energetic-orange text-center w-4" /> {data.contact.email}
                      </p>
                      <p className="flex items-center justify-center md:justify-start gap-2">
                        <Phone size={14} className="text-energetic-orange text-center w-4" /> {data.contact.phone}
                      </p>
                      <p className="flex items-center justify-center md:justify-start gap-2">
                        <Linkedin size={14} className="text-energetic-orange text-center w-4" /> linkedin.com/in/chandeepa-vidusara
                      </p>
                      <p className="flex items-center justify-center md:justify-start gap-2">
                        <MapPin size={14} className="text-energetic-orange text-center w-4" /> {data.contact.location}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <img 
                      src={data.personalImages[0] || ""} 
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-[120px] h-[120px] rounded-full object-cover border-4 border-[#003366] shadow-sm md:ml-8 aspect-square"
                    />
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="mb-6">
                  <h2 className="text-[1.1rem] font-extrabold uppercase tracking-wider text-[#003366] border-b-2 border-energetic-orange pb-1 mb-3">Professional Summary</h2>
                  <p className="text-[0.9rem] text-[#444] leading-relaxed text-justify italic">
                    {data.cv?.personalInfo.summary}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">
                  {/* Left Column (Main Content) */}
                  <div>
                    {/* Professional Experience */}
                    <section>
                      <h2 className="text-[1.1rem] font-extrabold uppercase tracking-wider text-[#003366] border-b-2 border-energetic-orange pb-1 mb-4 mt-5">Professional Experience</h2>
                      <div>
                        {data.cv?.experience.map((exp, i) => (
                          <div key={i} className="mb-4">
                            <h4 className="text-[1rem] font-bold text-[#111]">{exp.title} @ {exp.company}</h4>
                            <span className="text-[0.85rem] font-semibold text-energetic-orange mb-1 block">{exp.period} | {exp.location}</span>
                            <ul className="list-disc pl-4 space-y-1 text-[0.85rem] text-[#444] leading-relaxed">
                              {exp.bullets.map((bullet, j) => (
                                <li key={j}>{bullet}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Education & Certifications */}
                    <section>
                      <h2 className="text-[1.1rem] font-extrabold uppercase tracking-wider text-[#003366] border-b-2 border-energetic-orange pb-1 mb-4 mt-5">Education & Certifications</h2>
                      <div>
                        {data.cv?.education.map((edu, i) => (
                          <div key={i} className="mb-4">
                            <div className="flex items-center gap-3 mb-1">
                              {edu.institution.includes("Colombo") && (
                                <img src="https://cmb.ac.lk/wp-content/uploads/logo-web.png" alt="UOC" className="h-[20px] w-auto" referrerPolicy="no-referrer" />
                              )}
                              <h4 className="text-[1rem] font-bold text-[#111]">{edu.institution}</h4>
                            </div>
                            <span className="text-[0.85rem] font-semibold text-energetic-orange mb-1 block">{edu.degree} | {edu.period}</span>
                            {edu.bullets && (
                              <ul className="list-disc pl-4 space-y-1 text-[0.85rem] text-[#444] leading-relaxed">
                                {edu.bullets.map((bullet, j) => (
                                  <li key={j}>{bullet}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* References */}
                    <section>
                      <h2 className="text-[1.1rem] font-extrabold uppercase tracking-wider text-[#003366] border-b-2 border-energetic-orange pb-1 mb-4 mt-5">References</h2>
                      <div>
                        {data.cv?.references.map((ref, i) => (
                          <div key={i} className="mb-4">
                            <h4 className="text-[1rem] font-bold text-[#111]">{ref.name}</h4>
                            <p className="text-[0.85rem] text-[#444]">
                              {ref.title} {ref.email && <><br/>{ref.email}</>} {ref.phone && <><br/>{ref.phone}</>}
                            </p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* Right Column (Sidebar) */}
                  <div>
                    {/* Technical Skills */}
                    <section>
                      <h2 className="text-[1.1rem] font-extrabold uppercase tracking-wider text-[#003366] border-b-2 border-energetic-orange pb-1 mb-4 mt-5">Technical Skills</h2>
                      <div>
                        {data.cv?.technicalSkills.map((skill, i) => (
                          <div key={i} className="mb-4">
                            <span className="text-[0.85rem] font-semibold text-[#003366] mb-1 block">{skill.category}</span>
                            <div className="flex flex-wrap">
                              {skill.skills.split(',').map((s, j) => (
                                <span key={j} className="bg-[#f0f4f8] text-[#003366] px-2 py-1 rounded border border-[#d1d5db] text-[0.75rem] font-semibold m-[2px]">
                                  {s.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Key Projects */}
                    <section>
                      <h2 className="text-[1.1rem] font-extrabold uppercase tracking-wider text-[#003366] border-b-2 border-energetic-orange pb-1 mb-4 mt-5">Key Projects</h2>
                      <div>
                        {data.cv?.cvProjects.map((project, i) => (
                          <div key={i} className="mb-4">
                            <h4 className="text-[1rem] font-bold text-[#111] mb-1">{project.title}</h4>
                            <p className="text-[0.85rem] text-[#444] leading-relaxed">{project.description}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Declaration */}
                    <section>
                      <h2 className="text-[1.1rem] font-extrabold uppercase tracking-wider text-[#003366] border-b-2 border-energetic-orange pb-1 mb-4 mt-5">Declaration</h2>
                      <p className="text-[0.75rem] text-[#555] leading-relaxed italic">
                        I hereby declare that the foregoing particulars are true and accurate to the best of my knowledge.
                      </p>
                      <div className="mt-6">
                        <div className="text-[0.8rem] font-bold text-[#003366]">20 July 2025</div>
                        <div className="font-serif italic text-[1.4rem] text-[#111] mt-1">{data.cv?.personalInfo.fullName}</div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 'posts' && (
          <motion.div 
            key="posts"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pt-32 pb-24 px-6"
          >
            <div className="max-w-2xl mx-auto">
              {/* LinkedIn Style Profile Header */}
              <div className="bg-white border border-near-black/10 rounded-xl overflow-hidden mb-8 shadow-sm">
                <div className="h-32 bg-gradient-to-r from-[#003366] to-[#001f3f] relative">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                </div>
                <div className="px-8 pb-8 relative">
                  <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 mb-6">
                    <img 
                      src={data.personalImages[0] || ""} 
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg bg-white"
                    />
                    <div className="flex-1 text-center md:text-left pb-2">
                      <h1 className="text-2xl font-bold text-near-black flex items-center justify-center md:justify-start gap-2">
                        {data.name}
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Check size={10} className="text-white" />
                        </div>
                      </h1>
                      <p className="text-near-black/60 text-sm font-medium">Automation Engineer | BET (Hons) UoC | Web Developer</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <span className="bg-energetic-orange text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-energetic-orange/20">Open to Work</span>
                    <span className="bg-near-black/5 border border-near-black/10 text-near-black/80 px-4 py-1.5 rounded-full text-xs font-medium">Galle, Sri Lanka</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-near-black flex items-center gap-3">
                  <div className="w-1 h-6 bg-energetic-orange rounded-full"></div>
                  Recent Activity
                </h2>
              </div>

              <div className="space-y-6">
                {data.posts.map((post) => (
                  <motion.div 
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-near-black/10 rounded-xl overflow-hidden shadow-sm group"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={data.personalImages[0] || ""} 
                            alt="Avatar"
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-near-black/10"
                          />
                          <div>
                            <h3 className="text-near-black text-sm font-bold leading-none mb-1">{data.name}</h3>
                            <p className="text-near-black/40 text-[10px] uppercase tracking-wider font-bold">{post.date} • <Globe size={10} className="inline ml-1" /></p>
                          </div>
                        </div>
                        {isAdmin && (
                          <button 
                            onClick={() => deletePost(post.id)}
                            className="text-near-black/20 hover:text-red-500 transition-colors p-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <p className="text-near-black/80 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.text}</p>
                    </div>
                    
                    <PostMediaGallery media={post.media} />

                    <div className="px-4 py-1 flex items-center justify-between border-t border-near-black/5">
                      <button className="flex-1 flex items-center justify-center gap-2 py-3 text-near-black/60 hover:text-near-black hover:bg-near-black/5 rounded-lg transition-all text-xs font-bold">
                        <ThumbsUp size={16} /> Like
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-3 text-near-black/60 hover:text-near-black hover:bg-near-black/5 rounded-lg transition-all text-xs font-bold">
                        <MessageSquare size={16} /> Comment
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-3 text-near-black/60 hover:text-near-black hover:bg-near-black/5 rounded-lg transition-all text-xs font-bold">
                        <Share2 size={16} /> Share
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white no-print">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-near-black mb-4">{t.contact.title}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Mail, label: t.contact.email, value: data.contact.email, href: `mailto:${data.contact.email}` },
              { icon: Phone, label: t.contact.phone, value: data.contact.phone, href: `tel:${data.contact.phone}` },
              { icon: MapPin, label: t.contact.location, value: data.contact.location, href: '#' },
              { icon: Linkedin, label: 'LinkedIn', value: 'Connect', href: `https://${data.contact.linkedin}` }
            ].map((item, index) => (
              <a 
                key={index}
                href={item.href}
                target={item.icon === Linkedin ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="bg-near-black p-6 md:p-8 rounded-xl text-center group hover:-translate-y-2 transition-all duration-300 border border-white/5"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-energetic-orange rounded-full flex items-center justify-center text-white mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform">
                  <item.icon size={20} />
                </div>
                <h4 className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest mb-2">{item.label}</h4>
                <p className="text-white font-bold text-xs md:text-sm break-all">{item.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="py-20 bg-near-black border-t border-white/10 no-print relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="text-3xl font-black tracking-tighter text-white mb-6">
                CVK<span className="text-energetic-orange">.</span> ENGINEERING
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-md">
                Bridging the gap between complex industrial challenges and innovative technological solutions. We specialize in industrial automation, precision engineering, and custom software development.
              </p>
              <div className="flex gap-4 mt-8">
                {[
                  { icon: Linkedin, href: `https://${data.contact.linkedin}` },
                  { icon: Mail, href: `mailto:${data.contact.email}` },
                  { icon: Globe, href: "#" }
                ].map((social, i) => (
                  <a 
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white/40 hover:bg-energetic-orange hover:text-white transition-all"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
              <div className="flex flex-col gap-4">
                <button onClick={() => { setCurrentPage('brand-home'); window.scrollTo(0, 0); }} className="text-white/60 hover:text-energetic-orange transition-colors text-sm text-left">Home</button>
                <button onClick={() => { setCurrentPage('brand-services'); window.scrollTo(0, 0); }} className="text-white/60 hover:text-energetic-orange transition-colors text-sm text-left">Services</button>
                <button onClick={() => { setCurrentPage('cv-maker'); window.scrollTo(0, 0); }} className="text-white/60 hover:text-energetic-orange transition-colors text-sm text-left">CV Maker</button>
                <button onClick={() => { setCurrentPage('home'); window.scrollTo(0, 0); }} className="text-white/60 hover:text-energetic-orange transition-colors text-sm text-left">Portfolio</button>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contact Us</h4>
              <div className="space-y-4">
                <p className="text-white/60 text-sm flex items-center gap-3">
                  <Mail size={14} className="text-energetic-orange" />
                  {data.contact.email}
                </p>
                <p className="text-white/60 text-sm flex items-center gap-3">
                  <Phone size={14} className="text-energetic-orange" />
                  {data.contact.phone}
                </p>
                <p className="text-white/60 text-sm flex items-start gap-3">
                  <MapPin size={14} className="text-energetic-orange mt-1 shrink-0" />
                  {data.contact.location}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-6">
            <p className="text-white/20 text-xs text-center md:text-left">
              © {new Date().getFullYear()} CVK Engineering. All rights reserved. Designed for Excellence.
            </p>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowLogin(true)}
                className="text-white/10 hover:text-white/40 text-[10px] transition-colors flex items-center gap-1 uppercase tracking-widest"
              >
                <ShieldCheck size={10} /> Admin Access
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {showLogin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-near-black/90 backdrop-blur-sm p-6 no-print"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-md p-10 rounded-lg shadow-2xl relative"
            >
              <button onClick={() => setShowLogin(false)} className="absolute top-6 right-6 text-near-black/40 hover:text-near-black"><X size={24} /></button>
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-energetic-orange/10 rounded-full flex items-center justify-center text-energetic-orange">
                  <LogIn size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-8">{t.admin.login}</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-near-black/60 uppercase tracking-widest mb-2">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-near-black/5 border border-near-black/10 px-4 py-3 rounded-md focus:outline-none focus:border-energetic-orange transition-colors"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-near-black/60 uppercase tracking-widest mb-2">{t.admin.password}</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-near-black/5 border border-near-black/10 px-4 py-3 rounded-md focus:outline-none focus:border-energetic-orange transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" disabled={isLoggingIn} className="w-full bg-near-black text-white font-bold py-4 rounded-md hover:bg-near-black/90 transition-colors disabled:opacity-50">
                  {isLoggingIn ? 'Logging in...' : t.admin.submit}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Dashboard Modal */}
      <AnimatePresence>
        {showDashboard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-near-black/90 backdrop-blur-sm p-6 no-print"
          >
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto p-10 rounded-lg shadow-2xl relative"
            >
              <button onClick={() => setShowDashboard(false)} className="absolute top-6 right-6 text-near-black/40 hover:text-near-black"><X size={24} /></button>
              
              <div className="flex items-center gap-4 mb-10 border-b border-near-black/5 pb-6">
                <div className="w-12 h-12 bg-deep-blue/5 rounded-lg flex items-center justify-center text-deep-blue">
                  <Settings size={24} />
                </div>
                <h2 className="text-3xl font-bold">{t.admin.dashboard}</h2>
                <div className="flex-grow"></div>
                <div className="flex gap-2 bg-near-black/5 p-1 rounded-lg">
                  <button onClick={() => setDashboardTab('content')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${dashboardTab === 'content' ? 'bg-white shadow-sm text-near-black' : 'text-near-black/40 hover:text-near-black'}`}>Content</button>
                  <button onClick={() => setDashboardTab('security')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${dashboardTab === 'security' ? 'bg-white shadow-sm text-near-black' : 'text-near-black/40 hover:text-near-black'}`}>Security</button>
                  <button onClick={() => setDashboardTab('analytics')} className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${dashboardTab === 'analytics' ? 'bg-white shadow-sm text-near-black' : 'text-near-black/40 hover:text-near-black'}`}>Analytics</button>
                </div>
              </div>

              {dashboardTab === 'analytics' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                       <History size={20} className="text-energetic-orange" />
                       Generated CV Analytics
                    </h3>
                    <div className="bg-near-black/5 px-4 py-2 rounded-lg font-bold text-sm">
                      Total: {generatedCvs.length}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-near-black/5 p-6 rounded-xl border border-near-black/10">
                      <h4 className="text-xs font-bold text-near-black/50 uppercase tracking-widest mb-2">Most Popular Template</h4>
                      <p className="text-2xl font-black text-near-black">
                        {generatedCvs.length > 0 
                          ? `Template ${Object.entries(generatedCvs.reduce((acc, cv) => { acc[cv.template] = (acc[cv.template] || 0) + 1; return acc; }, {})).sort((a: any, b: any) => b[1] - a[1])[0][0]}`
                          : 'N/A'
                        }
                      </p>
                    </div>
                    <div className="bg-near-black/5 p-6 rounded-xl border border-near-black/10">
                      <h4 className="text-xs font-bold text-near-black/50 uppercase tracking-widest mb-2">Desktop Users</h4>
                      <p className="text-2xl font-black text-near-black">
                        {generatedCvs.filter(cv => cv.source === 'Desktop').length}
                      </p>
                    </div>
                    <div className="bg-near-black/5 p-6 rounded-xl border border-near-black/10">
                      <h4 className="text-xs font-bold text-near-black/50 uppercase tracking-widest mb-2">Mobile Users</h4>
                      <p className="text-2xl font-black text-near-black">
                        {generatedCvs.filter(cv => cv.source === 'Mobile').length}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-near-black/10 rounded-xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-near-black/5 border-b border-near-black/10">
                          <tr>
                            <th className="px-6 py-4 text-xs font-bold text-near-black/50 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-near-black/50 uppercase tracking-widest">Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-near-black/50 uppercase tracking-widest">Email</th>
                            <th className="px-6 py-4 text-xs font-bold text-near-black/50 uppercase tracking-widest">Template</th>
                            <th className="px-6 py-4 text-xs font-bold text-near-black/50 uppercase tracking-widest">Source</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-near-black/5">
                          {generatedCvs.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-8 text-center text-sm text-near-black/50">No CVs generated yet.</td>
                            </tr>
                          ) : (
                            generatedCvs.map((cv) => (
                              <tr key={cv.id} className="hover:bg-near-black/5 transition-colors">
                                <td className="px-6 py-4 text-sm whitespace-nowrap">{new Date(cv.timestamp).toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm font-bold">{cv.name}</td>
                                <td className="px-6 py-4 text-sm text-near-black/70">{cv.email}</td>
                                <td className="px-6 py-4 text-sm"><span className="bg-energetic-orange/10 text-energetic-orange px-2 py-1 rounded font-bold text-xs">T{cv.template}</span></td>
                                <td className="px-6 py-4 text-sm text-near-black/70">{cv.source}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {dashboardTab === 'content' && (
                <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                       <ShieldCheck size={18} className="text-energetic-orange" />
                       Brand Settings (Main Page)
                    </h3>
                    <div className="space-y-4 p-4 bg-near-black/5 rounded-md border border-near-black/5">
                      <div>
                        <label className="block text-[10px] font-bold text-near-black/40 uppercase mb-1">Brand Headline</label>
                        <textarea 
                          value={data.brandHeadline}
                          onChange={(e) => saveData({ ...data, brandHeadline: e.target.value })}
                          className="w-full bg-white border border-near-black/10 px-3 py-2 rounded text-sm h-20 resize-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-near-black/40 uppercase mb-1">Brand About</label>
                        <textarea 
                          value={data.brandAbout}
                          onChange={(e) => saveData({ ...data, brandAbout: e.target.value })}
                          className="w-full bg-white border border-near-black/10 px-3 py-2 rounded text-sm h-32 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                       <FileText size={18} className="text-energetic-orange" />
                       {t.admin.editHeadline}
                    </h3>
                    <textarea 
                      value={data.headline}
                      onChange={(e) => saveData({ ...data, headline: e.target.value })}
                      className="w-full bg-near-black/5 border border-near-black/10 px-4 py-3 rounded-md focus:outline-none focus:border-energetic-orange transition-colors h-24 resize-none"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                       <User size={18} className="text-energetic-orange" />
                       {t.admin.editAbout}
                    </h3>
                    <textarea 
                      value={data.aboutMe}
                      onChange={(e) => saveData({ ...data, aboutMe: e.target.value })}
                      className="w-full bg-near-black/5 border border-near-black/10 px-4 py-3 rounded-md focus:outline-none focus:border-energetic-orange transition-colors h-48 resize-none"
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                       <ImageIcon size={18} className="text-energetic-orange" />
                       {t.admin.manageGallery}
                    </h3>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {data.personalImages.map((img, i) => (
                        <div key={i} className="relative group aspect-square">
                          <img src={img} alt="" className="w-full h-full object-cover rounded" />
                          <button 
                            onClick={() => deleteGalleryImage(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input id="new-gallery-img" placeholder="Image URL" className="flex-1 bg-near-black/5 border border-near-black/10 px-4 py-2 rounded-md text-sm" />
                      <button onClick={() => {
                        const input = document.getElementById('new-gallery-img') as HTMLInputElement;
                        addGalleryImage(input.value);
                        input.value = '';
                      }} className="bg-near-black text-white px-4 py-2 rounded-md text-sm font-bold">Add</button>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                       <Settings size={18} className="text-energetic-orange" />
                       Manage Services
                    </h3>
                    <div className="space-y-4 p-4 bg-near-black/5 rounded-md border border-near-black/5">
                      <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                        {data.services?.map(s => (
                          <div key={s.id} className="flex items-center justify-between p-2 bg-white rounded border border-near-black/5">
                            <span className="text-xs font-bold">{s.title}</span>
                            <button 
                              onClick={() => {
                                const ns = data.services?.filter(x => x.id !== s.id);
                                saveData({ ...data, services: ns });
                              }}
                              className="text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.currentTarget);
                        const newService = {
                          id: Date.now().toString(),
                          title: fd.get('title') as string,
                          description: fd.get('desc') as string,
                          icon: fd.get('icon') as any
                        };
                        saveData({ ...data, services: [...(data.services || []), newService] });
                        (e.target as HTMLFormElement).reset();
                      }} className="space-y-2">
                        <input name="title" placeholder="Service Title" required className="w-full bg-white border border-near-black/10 px-3 py-2 rounded text-xs" />
                        <textarea name="desc" placeholder="Service Description" required className="w-full bg-white border border-near-black/10 px-3 py-2 rounded text-xs h-16" />
                        <select name="icon" className="w-full bg-white border border-near-black/10 px-3 py-2 rounded text-xs">
                          <option value="Settings">Settings (Automation)</option>
                          <option value="Code">Code (Software)</option>
                          <option value="Globe">Globe (Web)</option>
                        </select>
                        <button type="submit" className="w-full bg-near-black text-white font-bold py-2 rounded text-xs">Add Service</button>
                      </form>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                       <Briefcase size={18} className="text-energetic-orange" />
                       Manage Projects
                    </h3>
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2">
                      {data.projects.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-near-black/5 rounded border border-near-black/5">
                          <span className="text-sm font-bold truncate mr-4">{p.title}</span>
                          <button onClick={() => deleteProject(p.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      addProject({
                        category: fd.get('cat') as string,
                        title: fd.get('title') as string,
                        description: fd.get('desc') as string,
                        imageUrl: fd.get('img') as string,
                        longDescription: fd.get('longDesc') as string,
                        media: newProjectMedia
                      });
                      (e.target as HTMLFormElement).reset();
                      setNewProjectMedia([]);
                    }} className="space-y-3 p-4 bg-near-black/5 rounded-md border border-near-black/5">
                      <input name="title" placeholder="Title" required className="w-full bg-white border border-near-black/10 px-3 py-2 rounded text-sm" />
                      <input name="cat" placeholder="Category" required className="w-full bg-white border border-near-black/10 px-3 py-2 rounded text-sm" />
                      <textarea name="desc" placeholder="Short Description" required className="w-full bg-white border border-near-black/10 px-3 py-2 rounded text-sm h-16" />
                      <textarea name="longDesc" placeholder="Full Details (Long Description)" className="w-full bg-white border border-near-black/10 px-3 py-2 rounded text-sm h-32" />
                      <input name="img" placeholder="Main Image URL" className="w-full bg-white border border-near-black/10 px-3 py-2 rounded text-sm" />
                      
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-near-black/40 uppercase">Additional Media</p>
                        <div className="flex gap-2">
                          <input id="proj-media-url" placeholder="Media URL" className="flex-1 bg-white border border-near-black/10 px-3 py-2 rounded text-sm" />
                          <select id="proj-media-type" className="bg-white border border-near-black/10 px-2 py-2 rounded text-sm">
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                          <button type="button" onClick={() => {
                            const url = (document.getElementById('proj-media-url') as HTMLInputElement).value;
                            const type = (document.getElementById('proj-media-type') as HTMLSelectElement).value as 'image' | 'video';
                            if (url) {
                              setNewProjectMedia([...newProjectMedia, { url, type }]);
                              (document.getElementById('proj-media-url') as HTMLInputElement).value = '';
                            }
                          }} className="bg-near-black text-white px-3 py-2 rounded text-sm"><Plus size={16} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newProjectMedia.map((m, i) => (
                            <div key={i} className="relative group">
                              <div className="w-12 h-12 bg-near-black/10 rounded flex items-center justify-center overflow-hidden">
                                {m.type === 'image' ? <img src={m.url} className="w-full h-full object-cover" /> : <Video size={16} />}
                              </div>
                              <button type="button" onClick={() => {
                                const nm = [...newProjectMedia];
                                nm.splice(i, 1);
                                setNewProjectMedia(nm);
                              }} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={8} /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-energetic-orange text-white font-bold py-2 rounded text-sm">Add Project</button>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                       <FileText size={18} className="text-energetic-orange" />
                       Manage Highlights (Posts)
                    </h3>
                    <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-2">
                      {data.posts.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-3 bg-near-black/5 rounded border border-near-black/5">
                          <span className="text-sm truncate mr-4">{p.text}</span>
                          <button onClick={() => deletePost(p.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      addPost({
                        text: fd.get('text') as string,
                        media: newPostMedia
                      });
                      setNewPostMedia([]);
                      (e.target as HTMLFormElement).reset();
                    }} className="space-y-3 p-4 bg-near-black/5 rounded-md border border-near-black/5">
                      <textarea name="text" placeholder="Post Text" required className="w-full bg-white border border-near-black/10 px-3 py-2 rounded text-sm h-24" />
                      
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-near-black/60 uppercase tracking-widest">Media Collection</p>
                        <div className="flex flex-wrap gap-2">
                          {newPostMedia.map((m, i) => (
                            <div key={i} className="relative w-16 h-16 bg-white border border-near-black/10 rounded overflow-hidden">
                              {m.type === 'image' ? <img src={m.url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-near-black/10"><Video size={16} /></div>}
                              <button 
                                type="button"
                                onClick={() => setNewPostMedia(newPostMedia.filter((_, idx) => idx !== i))}
                                className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input id="post-media-url" placeholder="Media URL" className="flex-1 bg-white border border-near-black/10 px-3 py-2 rounded text-sm" />
                          <select id="post-media-type" className="bg-white border border-near-black/10 px-2 py-2 rounded text-sm">
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                          </select>
                          <button 
                            type="button"
                            onClick={() => {
                              const urlInput = document.getElementById('post-media-url') as HTMLInputElement;
                              const typeSelect = document.getElementById('post-media-type') as HTMLSelectElement;
                              if (urlInput.value) {
                                setNewPostMedia([...newPostMedia, { url: urlInput.value, type: typeSelect.value as 'image' | 'video' }]);
                                urlInput.value = '';
                              }
                            }}
                            className="bg-near-black text-white px-3 py-2 rounded text-sm font-bold"
                          >
                            Add
                          </button>
                        </div>
                      </div>

                      <button type="submit" className="w-full bg-energetic-orange text-white font-bold py-2 rounded text-sm">Create Post</button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {dashboardTab === 'security' && (
              <div className="max-w-md mx-auto py-12">
                  <div className="bg-near-black/5 p-8 rounded-2xl border border-near-black/5">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 bg-energetic-orange/10 rounded-full flex items-center justify-center text-energetic-orange">
                        <Lock size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold">Security Settings</h3>
                        <p className="text-xs text-near-black/40">Manage your admin access</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-bold text-near-black/40 uppercase mb-2">Change Admin Password</label>
                        <div className="relative">
                          <input 
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            className="w-full bg-white border border-near-black/10 px-4 py-3 rounded-lg text-sm outline-none focus:ring-1 focus:ring-energetic-orange"
                            onBlur={(e) => {
                              if (e.target.value) {
                                saveData({ ...data, adminPassword: e.target.value });
                                alert("Password updated successfully!");
                              }
                            }}
                          />
                          <button 
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-near-black/20 hover:text-near-black"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <p className="mt-2 text-[10px] text-near-black/40 italic">Note: Changes are saved automatically on blur.</p>
                      </div>

                      <div className="pt-6 border-t border-near-black/5">
                        <h4 className="text-xs font-bold mb-4">Multi-User Access</h4>
                        <p className="text-xs text-near-black/60 leading-relaxed mb-4">
                          Currently, CVK Engineering uses a single-admin system. For enterprise-grade multi-user management with roles, please contact support to enable Firebase Authentication.
                        </p>
                        <button className="w-full py-3 border border-near-black/10 rounded-lg text-xs font-bold hover:bg-near-black hover:text-white transition-all">
                          REQUEST MULTI-USER UPGRADE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-near-black/95 backdrop-blur-md p-4 md:p-10 no-print"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-5xl max-h-full overflow-y-auto rounded-xl shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedProject(null)} 
                className="fixed md:absolute top-4 right-4 z-10 bg-near-black text-white p-2 rounded-full hover:bg-energetic-orange transition-colors"
              >
                <X size={24} />
              </button>

              <div className="grid lg:grid-cols-2">
                <div className="bg-near-black p-4 md:p-8 space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden border border-white/10">
                    {renderMedia(selectedProject.imageUrl, 'image')}
                  </div>
                  
                  {selectedProject.media && selectedProject.media.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedProject.media.map((m, i) => (
                        <div key={i} className="aspect-video rounded-lg overflow-hidden border border-white/10 bg-white/5">
                          {renderMedia(m.url, m.type)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-8 md:p-12">
                  <span className="text-energetic-orange text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-near-black mb-6">
                    {selectedProject.title}
                  </h2>
                  <div className="prose prose-orange max-w-none">
                    <p className="text-near-black/60 text-lg leading-relaxed mb-8">
                      {selectedProject.description}
                    </p>
                    {selectedProject.longDescription && (
                      <div className="text-near-black/80 whitespace-pre-wrap leading-relaxed">
                        {selectedProject.longDescription}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Video, 
  Users, 
  Award, 
  BrainCircuit, 
  Brain,
  FileText, 
  X, 
  Upload, 
  ClipboardCheck, 
  Camera, 
  Calendar, 
  Globe, 
  Ghost, 
  BarChart3, 
  MessageSquare, 
  Sparkles,
  Layers,
  FileBadge, 
  ShieldCheck,
  FileUp,
  AlertCircle,
  Table,
  Target,
  CheckCircle,
  TrendingUp,
  UserCheck,
  Heart,
  Activity,
  Milestone,
  ToggleLeft,
  ToggleRight,
  Mic,
  Smile,
  UserPlus,
  Trash2,
  Edit3,
  Save,
  Quote,
  Zap,
  Repeat,
  Scale,
  Lightbulb,
  LineChart as LineChartIcon,
  Plus
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Student, LessonPlan, StructuredLessonPlan, ObservationAnalysis, ExitTicketAnalysis, InstructionalReflectionReport, GrowthTrendReport, BridgePlan, Tier } from './types';
import { 
  analyzeLessonPlan, 
  rewriteLessonPlan, 
  FileData, 
  analyzeExitTickets, 
  analyzeObservation,
  generateReflectionReport,
  generateGrowthTrendAnalysis
} from './services/geminiService';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });
};

const BridgePlanCard: React.FC<{ plan: BridgePlan }> = ({ plan }) => (
  <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 space-y-4 animate-in slide-in-from-right">
    <div className="flex items-center space-x-3 mb-2">
      <div className="p-2 bg-white/20 rounded-xl"><Milestone className="w-5 h-5" /></div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Proficient+1 Bridge Plan</h4>
    </div>
    <div className="space-y-4">
      <div>
        <p className="text-[10px] font-black uppercase opacity-40">Focus Skill</p>
        <p className="text-xl font-black">{plan.focusSkill}</p>
      </div>
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase opacity-40">Two Moves for Tomorrow</p>
        {plan.twoMoves.map((m, i) => (
          <div key={i} className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl border border-white/10">
            <span className="w-5 h-5 flex items-center justify-center bg-white text-indigo-600 rounded-full text-[10px] font-black">{i + 1}</span>
            <p className="text-xs font-bold">{m}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <p className="text-[8px] font-black uppercase opacity-40 mb-1">Easy Fallback</p>
          <p className="text-[10px] font-medium leading-tight">{plan.easierVersion}</p>
        </div>
        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
          <p className="text-[8px] font-black uppercase opacity-40 mb-1">Success Signal</p>
          <p className="text-[10px] font-medium leading-tight">{plan.successSignal}</p>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<{ students: Student[], plans: LessonPlan[] }> = ({ students, plans }) => {
  const [isGeneratingGrowth, setIsGeneratingGrowth] = useState(false);
  const [growthReport, setGrowthReport] = useState<GrowthTrendReport | null>(null);

  const handleGrowthAnalysis = async () => {
    setIsGeneratingGrowth(true);
    try {
      const res = await generateGrowthTrendAnalysis(plans, students);
      setGrowthReport(res);
    } catch (e) { alert("Analysis failed."); }
    finally { setIsGeneratingGrowth(false); }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight italic">Console</h1>
          <p className="text-slate-500 text-sm">Professional Growth & Student Mastery</p>
        </div>
        <button onClick={handleGrowthAnalysis} disabled={isGeneratingGrowth} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center hover:bg-indigo-700 transition shadow-lg">
          {isGeneratingGrowth ? <Sparkles className="animate-spin w-4 h-4 mr-2" /> : <Activity className="w-4 h-4 mr-2" />}
          Growth Timeline
        </button>
      </header>

      {growthReport && (
        <div className="bg-white p-8 rounded-[3rem] border border-indigo-100 shadow-xl space-y-6 animate-in zoom-in">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-black text-slate-900 flex items-center"><TrendingUp className="w-5 h-5 mr-2 text-indigo-600" /> Professional Growth Curve</h3>
            <button onClick={() => setGrowthReport(null)} className="text-slate-300 hover:text-red-500"><X /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {growthReport.metricSnapshots.map((m, i) => (
              <div key={i} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{m.metric}</p>
                <div className="flex items-end justify-between">
                  <p className="text-2xl font-black text-slate-900">{m.value}</p>
                  <span className={`text-[10px] font-black uppercase ${m.trend === 'up' ? 'text-green-500' : 'text-indigo-500'}`}>{m.trend}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
            <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">Ladder Progress</p>
            <p className="text-sm font-bold text-indigo-900">{growthReport.ladderProgress}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 lg:col-span-2 shadow-sm">
           <h3 className="text-xs font-black uppercase text-slate-400 mb-6 flex items-center"><Layers className="w-4 h-4 mr-2" /> Focus Rungs</h3>
           <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-green-50 rounded-[2rem] border border-green-100">
                <p className="text-[10px] font-black text-green-700 uppercase">Strongest Loop</p>
                <p className="text-base font-bold text-green-900 mt-1">CVC Decodable Routines</p>
              </div>
              <div className="p-6 bg-orange-50 rounded-[2rem] border border-orange-100">
                <p className="text-[10px] font-black text-orange-700 uppercase">Next Bridge</p>
                <p className="text-base font-bold text-orange-900 mt-1">Student Wait Time (3s+)</p>
              </div>
           </div>
        </div>
        <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col justify-between shadow-xl">
          <div>
            <Smile className="w-10 h-10 mb-4 opacity-50" />
            <h4 className="text-xl font-bold">Growth Affirmation</h4>
            <p className="text-indigo-200 text-sm mt-2 italic opacity-80">"Your transition pacing from 'We Do' to 'You Do' has improved by 20% this week. Ownership is rising."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LessonPlanner: React.FC<{ plans: LessonPlan[], setPlans: React.Dispatch<React.SetStateAction<LessonPlan[]>>, students: Student[], showTTESS: boolean }> = ({ plans, setPlans, students, showTTESS }) => {
  const [targetLesson, setTargetLesson] = useState('');
  const [lessonText, setLessonText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [rewrittenPlan, setRewrittenPlan] = useState<StructuredLessonPlan | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const [curriculumFile, setCurriculumFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      let fileData: FileData | undefined;
      if (curriculumFile) {
        const base = await fileToBase64(curriculumFile);
        fileData = { inlineData: { data: base, mimeType: curriculumFile.type } };
      }
      const res = await analyzeLessonPlan(lessonText, 'Current Curriculum', fileData, targetLesson, showTTESS);
      setAnalysis(res);
    } catch (e) { alert("Analysis failed."); }
    finally { setIsAnalyzing(false); }
  };

  const handleRewrite = async () => {
    setIsRewriting(true);
    try {
      const res = await rewriteLessonPlan(lessonText || "Curriculum Context", analysis.suggestions || [], targetLesson);
      setRewrittenPlan(res);
    } catch (e) { alert("Rewrite failed."); }
    finally { setIsRewriting(false); }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-black uppercase text-slate-900 italic">Optimizer</h2>
          <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                   <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><FileUp className="w-5 h-5" /></div>
                   <p className="text-sm font-black text-slate-800">Module PDF</p>
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="bg-slate-50 border px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100">
                  {curriculumFile ? curriculumFile.name : 'Select PDF'}
                </button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={e => setCurriculumFile(e.target.files?.[0] || null)} />
             </div>
             <input className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Identify lesson (e.g. Lesson 3)..." value={targetLesson} onChange={e => setTargetLesson(e.target.value)} />
             <textarea className="w-full h-48 p-6 rounded-2xl bg-slate-50 border outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Paste curriculum content or manual notes..." value={lessonText} onChange={e => setLessonText(e.target.value)} />
          </div>
          <div className="flex space-x-3">
             <button onClick={handleAnalyze} disabled={isAnalyzing} className="flex-1 bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-indigo-700 transition flex items-center justify-center shadow-lg">
               {isAnalyzing ? <Sparkles className="w-5 h-5 animate-spin mr-2" /> : <Brain className="w-5 h-5 mr-2" />}
               Analyze Lesson
             </button>
             {analysis && (
               <button onClick={handleRewrite} disabled={isRewriting} className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition flex items-center justify-center shadow-lg">
                 {isRewriting ? <Sparkles className="w-5 h-5 animate-spin mr-2" /> : <Award className="w-5 h-5 mr-2" />}
                 Distinguish Plan
               </button>
             )}
          </div>
        </div>

        <div className="space-y-6">
          {analysis && !rewrittenPlan && (
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-xl animate-in fade-in space-y-6">
               <div className="flex justify-between items-center border-b border-white/10 pb-4">
                  <h3 className="text-xs font-black uppercase opacity-60 tracking-widest">Coaching Audit</h3>
                  <span className="px-4 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase">{analysis.rating || "Ready"}</span>
               </div>
               {showTTESS && analysis.ttessAlignment && (
                  <div className="grid grid-cols-2 gap-4">
                     {analysis.ttessAlignment.map((t: any, i: number) => (
                        <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                           <p className="text-[8px] font-black opacity-40 uppercase">{t.dimension}</p>
                           <p className="text-base font-black text-indigo-400">{t.score}/5</p>
                        </div>
                     ))}
                  </div>
               )}
               <div className="grid grid-cols-1 gap-6">
                  <div>
                    <p className="text-[10px] font-black text-green-400 uppercase mb-3 flex items-center"><CheckCircle className="w-3 h-3 mr-2" /> Mastery Points</p>
                    <ul className="space-y-2">
                       {analysis.strengths?.map((s: string, i: number) => <li key={i} className="text-xs opacity-80 leading-relaxed font-medium">• {s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-orange-400 uppercase mb-3 flex items-center"><AlertCircle className="w-3 h-3 mr-2" /> Growth Areas</p>
                    <ul className="space-y-2">
                       {analysis.suggestions?.map((s: string, i: number) => <li key={i} className="text-xs opacity-80 leading-relaxed font-medium">• {s}</li>)}
                    </ul>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {rewrittenPlan && (
        <div className="bg-white p-12 rounded-[4rem] border border-indigo-100 shadow-2xl animate-in slide-in-from-bottom duration-500 space-y-12">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl rotate-3">
                <FileBadge className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Distinguished Lesson Plan</h3>
                <p className="text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Target Balance: {rewrittenPlan.overview.talkBalanceTarget}</p>
              </div>
            </div>
            <button onClick={() => setRewrittenPlan(null)} className="p-4 bg-slate-100 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><X className="w-6 h-6"/></button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
                <p className="text-[10px] font-black uppercase opacity-60 mb-3 tracking-[0.2em]">WE WILL (Teacher commitment)</p>
                <p className="text-2xl font-black leading-tight">{rewrittenPlan.weWill}</p>
                <div className="absolute top-4 right-4 text-white/20"><Quote className="w-8 h-8" /></div>
              </div>
              <div className="p-10 bg-slate-900 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
                <p className="text-[10px] font-black uppercase opacity-60 mb-3 tracking-[0.2em]">I WILL (Student commitment)</p>
                <p className="text-2xl font-black leading-tight">{rewrittenPlan.iWill}</p>
                <div className="absolute top-4 right-4 text-white/20"><Smile className="w-8 h-8" /></div>
              </div>
            </div>
            <BridgePlanCard plan={rewrittenPlan.bridgePlan} />
          </div>

          <div className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Instructional Loop</h4>
              <div className="flex space-x-4">
                <span className="text-[9px] font-black uppercase px-3 py-1 bg-slate-100 rounded-full text-slate-500">PAX: {rewrittenPlan.classroomCulture.paxKernel}</span>
                <span className="text-[9px] font-black uppercase px-3 py-1 bg-slate-100 rounded-full text-slate-500">Signal: {rewrittenPlan.classroomCulture.attentionSignal}</span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-100 shadow-inner">
               <div className="grid grid-cols-12 bg-slate-900 text-white p-6 text-[10px] font-black uppercase tracking-[0.2em]">
                  <div className="col-span-2">Phase</div>
                  <div className="col-span-5 px-6 border-l border-white/10">Teacher: Explicit Modeling</div>
                  <div className="col-span-5 px-6 border-l border-white/10">Student: Mastery Action</div>
               </div>
               {rewrittenPlan.phases.map((p, i) => (
                 <div key={i} className="grid grid-cols-12 p-10 border-b border-slate-200 last:border-0 hover:bg-white transition-all group">
                    <div className="col-span-2 flex flex-col space-y-3">
                       <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl uppercase tracking-widest w-fit">{p.name}</span>
                       {p.engagementStrategy && <span className="text-[9px] font-bold text-slate-400 italic flex items-center"><Zap className="w-3 h-3 mr-1 text-orange-400" /> {p.engagementStrategy}</span>}
                    </div>
                    <div className="col-span-5 px-8 text-sm text-slate-700 font-semibold leading-relaxed border-l border-slate-100">{p.teacherActions}</div>
                    <div className="col-span-5 px-8 text-sm text-slate-700 font-medium leading-relaxed border-l border-slate-100 italic">{p.studentActions}</div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 p-10 rounded-[3rem] space-y-8">
            <h4 className="text-[10px] font-black uppercase text-orange-700 flex items-center tracking-[0.3em]"><BrainCircuit className="w-5 h-5 mr-3" /> Proactive Misconception Defense</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {rewrittenPlan.misconceptions.map((m, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-orange-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-2 h-full bg-orange-200 transition-all group-hover:w-4" />
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Plausible Misunderstanding</p>
                  <p className="text-base font-black text-slate-900 mb-4">"{m.issue}"</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-orange-700 uppercase mb-1">Common Cause</p>
                      <p className="text-xs text-slate-600 font-medium">{m.cause}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-green-700 uppercase mb-1">Teacher Correction Move</p>
                      <p className="text-xs text-slate-600 font-bold italic">"{m.correction}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StudentRoster: React.FC<{ students: Student[], setStudents: React.Dispatch<React.SetStateAction<Student[]>> }> = ({ students, setStudents }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [trackingStudent, setTrackingStudent] = useState<Student | null>(null);
  const [newScore, setNewScore] = useState<string>('');
  const [newStudent, setNewStudent] = useState({ name: '', grade: '', tier: 1 as Tier, accommodations: '', behaviorPlan: '', isELL: false, hasIEP: false });
  const bulkInputRef = useRef<HTMLInputElement>(null);

  const handleBulkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      const newStudents: Student[] = lines
        .map(line => line.split(',')[0]?.trim())
        .filter(name => name && name !== 'Name')
        .map(name => ({
          id: Math.random().toString(36).substr(2, 9),
          name,
          grade: 'K',
          tier: 1,
          accommodations: '',
          behaviorPlan: '',
          isELL: false,
          iepNotes: '',
          scores: []
        }));
      setStudents([...students, ...newStudents]);
    };
    reader.readAsText(file);
  };

  const addStudent = () => {
    if (!newStudent.name) return;
    const student: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStudent.name,
      grade: newStudent.grade || 'K',
      tier: newStudent.tier,
      accommodations: newStudent.accommodations,
      behaviorPlan: newStudent.behaviorPlan,
      isELL: newStudent.isELL,
      iepNotes: newStudent.hasIEP ? 'IEP Active' : '',
      scores: []
    };
    setStudents([...students, student]);
    setNewStudent({ name: '', grade: '', tier: 1, accommodations: '', behaviorPlan: '', isELL: false, hasIEP: false });
    setIsAdding(false);
  };

  const saveEditedStudent = () => {
    if (!editingStudent) return;
    setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
    setEditingStudent(null);
  };

  const addScore = () => {
    if (!trackingStudent || !newScore) return;
    const scoreVal = parseFloat(newScore);
    if (isNaN(scoreVal)) return;

    const updated = {
      ...trackingStudent,
      scores: [...trackingStudent.scores, scoreVal]
    };
    setStudents(students.map(s => s.id === trackingStudent.id ? updated : s));
    setTrackingStudent(updated);
    setNewScore('');
  };

  const updateTier = (id: string, tier: Tier) => {
    setStudents(students.map(s => s.id === id ? { ...s, tier } : s));
  };

  const progressData = trackingStudent?.scores.map((s, i) => ({
    assessment: `A${i + 1}`,
    score: s
  })) || [];

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-black uppercase text-slate-900 italic tracking-tighter">Student Roster</h2>
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Manage individuals, scores, and bulk upload</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => bulkInputRef.current?.click()} className="bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center hover:bg-slate-200 transition">
            <FileUp className="w-4 h-4 mr-2" />
            Bulk Upload
          </button>
          <input type="file" ref={bulkInputRef} className="hidden" accept=".csv" onChange={handleBulkUpload} />
          <button onClick={() => setIsAdding(!isAdding)} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center hover:bg-indigo-700 transition shadow-lg">
            {isAdding ? <X className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
            {isAdding ? 'Cancel' : 'Add Student'}
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-[2.5rem] border border-indigo-100 shadow-xl space-y-6 animate-in slide-in-from-top">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Student Name" />
            <input value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})} className="p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Grade" />
            <select value={newStudent.tier} onChange={e => setNewStudent({...newStudent, tier: parseInt(e.target.value) as Tier})} className="p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-100">
                <option value={1}>Tier 1</option>
                <option value={2}>Tier 2</option>
                <option value={3}>Tier 3</option>
            </select>
          </div>
          <button onClick={addStudent} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-slate-800 transition shadow-lg">Save Student</button>
        </div>
      )}

      {/* Progress & Score Tracker Modal */}
      {trackingStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-4xl rounded-[4rem] shadow-2xl p-12 space-y-8 animate-in zoom-in overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center shrink-0">
               <div>
                 <h3 className="text-3xl font-black text-slate-900 uppercase italic leading-none">{trackingStudent.name}</h3>
                 <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">Academic Progress & Mastery Tracker</p>
               </div>
               <button onClick={() => setTrackingStudent(null)} className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><X /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0">
              <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-4 scrollbar-hide">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-800 tracking-widest flex items-center"><Plus className="w-3 h-3 mr-2" /> Log Assessment</h4>
                  <div className="flex space-x-2">
                    <input 
                      type="number" 
                      value={newScore} 
                      onChange={e => setNewScore(e.target.value)} 
                      className="flex-1 p-3 bg-white border rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" 
                      placeholder="Score (0-100)"
                    />
                    <button onClick={addScore} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Score History</h4>
                  {trackingStudent.scores.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 rounded-3xl border border-dashed text-slate-300">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-[10px] font-black uppercase">No Data Logged</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {trackingStudent.scores.map((s, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                          <span className="text-[10px] font-black uppercase text-slate-400">Assmnt {i + 1}</span>
                          <span className={`text-sm font-black ${s >= 80 ? 'text-green-600' : s >= 60 ? 'text-orange-500' : 'text-red-500'}`}>{s}%</span>
                        </div>
                      )).reverse()}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col bg-slate-50 rounded-[3rem] p-10 border border-slate-100 overflow-hidden">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-8 text-center">Mastery Trend Line</h4>
                {trackingStudent.scores.length < 2 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-4 text-slate-300">
                    <TrendingUp className="w-16 h-16 opacity-10" />
                    <p className="text-sm font-bold max-w-[200px]">Log at least 2 assessments to visualize growth trends.</p>
                  </div>
                ) : (
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="assessment" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                        />
                        <YAxis 
                          domain={[0, 100]} 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }} 
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          labelStyle={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          stroke="#4f46e5" 
                          strokeWidth={4} 
                          dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {editingStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-8">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-12 space-y-8 animate-in zoom-in">
              <div className="flex justify-between items-center">
                 <h3 className="text-2xl font-black text-slate-900 uppercase italic">Edit Profile: {editingStudent.name}</h3>
                 <button onClick={() => setEditingStudent(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><X /></button>
              </div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Accommodations</label>
                    <textarea value={editingStudent.accommodations} onChange={e => setEditingStudent({...editingStudent, accommodations: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none min-h-24 focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="List all SPED/504 accommodations..." />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Behavior Plan (BIP) Details</label>
                    <textarea value={editingStudent.behaviorPlan} onChange={e => setEditingStudent({...editingStudent, behaviorPlan: e.target.value})} className="w-full p-4 bg-slate-50 border rounded-2xl text-sm font-bold outline-none min-h-24 focus:ring-2 focus:ring-indigo-100 transition-all" placeholder="List specific triggers and intervention moves..." />
                 </div>
                 <div className="flex space-x-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                       <input type="checkbox" checked={editingStudent.isELL} onChange={e => setEditingStudent({...editingStudent, isELL: e.target.checked})} className="w-6 h-6 rounded-lg text-indigo-600 focus:ring-indigo-500" />
                       <span className="text-sm font-bold text-slate-700">ELL</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                       <input type="checkbox" checked={!!editingStudent.iepNotes} onChange={e => setEditingStudent({...editingStudent, iepNotes: e.target.checked ? 'IEP Active' : ''})} className="w-6 h-6 rounded-lg text-indigo-600 focus:ring-indigo-500" />
                       <span className="text-sm font-bold text-slate-700">IEP Active</span>
                    </label>
                 </div>
              </div>
              <button onClick={saveEditedStudent} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center shadow-lg hover:bg-indigo-700 transition">
                 <Save className="w-4 h-4 mr-2" />
                 Save Profile Details
              </button>
           </div>
        </div>
      )}

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Latest Mastery</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Intervention Tier</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {students.map(s => (
              <tr key={s.id} className="hover:bg-indigo-50/10 transition-all">
                <td className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-black text-slate-900 leading-none">{s.name}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">{s.grade}</p>
                        {s.isELL && <Globe className="w-3 h-3 text-blue-400" />}
                        {s.iepNotes && <ShieldCheck className="w-3 h-3 text-indigo-400" />}
                        {s.behaviorPlan && <Ghost className="w-3 h-3 text-orange-400" />}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">
                  {s.scores.length > 0 ? (
                    <div className="inline-flex flex-col items-center">
                      <span className={`text-base font-black ${s.scores[s.scores.length-1] >= 80 ? 'text-green-600' : s.scores[s.scores.length-1] >= 60 ? 'text-orange-500' : 'text-red-500'}`}>
                        {s.scores[s.scores.length-1]}%
                      </span>
                      <span className="text-[8px] font-black text-slate-300 uppercase">Assessment {s.scores.length}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-black opacity-20 uppercase">No Data</span>
                  )}
                </td>
                <td className="px-8 py-6 text-center">
                  <select 
                    value={s.tier} 
                    onChange={e => updateTier(s.id, parseInt(e.target.value) as Tier)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase appearance-none outline-none border-none cursor-pointer transition-all ${
                      s.tier === 1 ? 'bg-green-100 text-green-700' : s.tier === 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    <option value={1}>Tier 1</option>
                    <option value={2}>Tier 2</option>
                    <option value={3}>Tier 3</option>
                  </select>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => setTrackingStudent(s)} 
                      className="p-3 text-slate-300 hover:text-green-600 hover:bg-green-50 rounded-2xl transition"
                      title="Progress Tracking"
                    >
                       <LineChartIcon className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setEditingStudent(s)} 
                      className="p-3 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition"
                      title="Edit Profile"
                    >
                       <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setStudents(students.filter(std => std.id !== s.id))} 
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition"
                      title="Delete"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ObservationAnalyzer: React.FC<{ students: Student[], plans: LessonPlan[], showTTESS: boolean }> = ({ students, plans, showTTESS }) => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<ObservationAnalysis | null>(null);

  const handleUpload = async () => {
    if (!selectedPlanId || !file) return alert("Select plan and recording.");
    setIsUploading(true);
    const plan = plans.find(p => p.id === selectedPlanId);
    try {
      const result = await analyzeObservation("Audio transcript analysis results...", plan?.content || "", "Teacher observation notes", showTTESS);
      setFeedback(result);
    } catch (e) { alert("Analysis failed."); }
    finally { setIsUploading(false); }
  };

  const talkData = feedback ? [
    { name: 'Teacher', value: feedback.talkBalance.teacherPercentage, color: '#4f46e5' },
    { name: 'Student', value: feedback.talkBalance.studentPercentage, color: '#10b981' }
  ] : [];

  return (
    <div className="space-y-8 pb-20">
      <h2 className="text-2xl font-black uppercase text-slate-900 tracking-tighter italic">Reflection Loop</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">1. Pair Plan</h3>
            <select className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100" value={selectedPlanId} onChange={e => setSelectedPlanId(e.target.value)}>
              <option value="">-- Associate Lesson Plan --</option>
              {plans.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">2. Evidence Upload</h3>
            <div className="p-16 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center hover:border-indigo-300 transition-all cursor-pointer group">
              <input type="file" id="obs" className="hidden" accept="video/*,audio/*" onChange={e => setFile(e.target.files?.[0] || null)} />
              <label htmlFor="obs" className="cursor-pointer">
                <Mic className="w-10 h-10 mx-auto mb-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-slate-800">{file ? file.name : 'Drop Audio/Video Recording'}</p>
              </label>
            </div>
            <button onClick={handleUpload} disabled={isUploading || !file} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition shadow-lg flex items-center justify-center">
              {isUploading ? <Sparkles className="animate-spin w-5 h-5 mr-2" /> : <Repeat className="w-5 h-5 mr-2" />}
              Begin Reflection
            </button>
          </div>

          {feedback && (
            <div className="bg-indigo-600 p-10 rounded-[3.5rem] text-white shadow-xl space-y-10 animate-in slide-in-from-bottom">
               <div className="flex justify-between items-end border-b border-white/10 pb-6">
                  <div>
                    <h3 className="text-[10px] font-black uppercase opacity-60 mb-1">Growth Outcome</h3>
                    <p className="text-2xl font-black uppercase italic tracking-tighter">{feedback.alignmentSummary.level}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white/10 p-6 rounded-[2.5rem] border border-white/10">
                     <h4 className="text-[10px] font-black uppercase opacity-60 mb-4 flex items-center"><Scale className="w-4 h-4 mr-2" /> Talk Ratio</h4>
                     <div className="h-44 relative">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie data={talkData} innerRadius={40} outerRadius={60} paddingAngle={8} dataKey="value" stroke="none">
                                 {talkData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                              </Pie>
                              <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', fontWeight: 'bold' }} />
                           </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                           <p className="text-xl font-black">{feedback.talkBalance.studentPercentage}%</p>
                           <p className="text-[8px] uppercase font-black opacity-60 tracking-widest">Student</p>
                        </div>
                     </div>
                     <div className="mt-4 p-4 bg-white/5 rounded-2xl text-[10px] font-bold text-center border border-white/5 italic">
                       Next Move: {feedback.talkBalance.actionStep}
                     </div>
                  </div>
                  <div className="bg-white/10 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
                     <h4 className="text-[10px] font-black uppercase opacity-60 flex items-center tracking-[0.2em]"><Mic className="w-4 h-4 mr-2" /> Talk Evidence</h4>
                     <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide">
                       {feedback.talkBalance.evidence.map((e, i) => (
                         <div key={i} className={`p-4 rounded-2xl text-[10px] font-semibold leading-relaxed ${e.type === 'student' ? 'bg-green-500/20 text-green-100' : 'bg-white/10 text-white'}`}>
                            <span className="opacity-40 uppercase block text-[8px] font-black mb-1">{e.type} @ {e.timestamp || '0:00'}</span>
                            "{e.quote}"
                         </div>
                       ))}
                     </div>
                  </div>
               </div>

               <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase opacity-60 flex items-center tracking-[0.3em] border-b border-white/10 pb-4"><BrainCircuit className="w-4 h-4 mr-3" /> Misconception Review</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {feedback.misconceptionReview.map((m, i) => (
                      <div key={i} className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-start space-x-6 group">
                         <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-110 transition-transform">
                            {m.resolved ? <CheckCircle className="text-green-400" /> : <AlertCircle className="text-orange-400" />}
                         </div>
                         <div className="flex-1 space-y-2">
                            <p className="text-sm font-black text-indigo-300">{m.appeared}</p>
                            <p className="text-[10px] opacity-70 leading-relaxed italic">Your Response: "{m.response}"</p>
                            <div className="pt-2 flex items-center text-[9px] font-black uppercase tracking-widest text-indigo-200">
                               <Lightbulb className="w-3 h-3 mr-2" /> Tip: {m.suggestion}
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 space-y-6">
                  <h4 className="text-[10px] font-black uppercase opacity-60 flex items-center tracking-[0.3em]"><Table className="w-4 h-4 mr-3" /> Flow Alignment</h4>
                  <div className="space-y-4">
                    {feedback.flowAnalysis.map((f, i) => (
                      <div key={i} className="flex items-start space-x-6 bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition">
                         <div className={`p-2 rounded-xl text-[9px] font-black uppercase ${f.whatWasMissing ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>{f.phase}</div>
                         <div className="flex-1 space-y-1">
                            <p className="text-[10px] font-bold">"{f.whatMatched}"</p>
                            {f.whatWasMissing && <p className="text-[10px] text-orange-400 font-bold italic">Missing: {f.whatWasMissing}</p>}
                            <p className="text-[9px] opacity-60 font-medium">Adjustment: {f.adjustment}</p>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               <BridgePlanCard plan={feedback.bridgePlan} />
            </div>
          )}
        </div>

        <div className="space-y-6">
           {showTTESS && feedback?.ttessAlignment && (
             <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-6 animate-in slide-in-from-right">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] mb-4">Alignment Logic</h4>
                <div className="space-y-4">
                   {feedback.ttessAlignment.map((t, i) => (
                     <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group">
                        <div className="flex-1 pr-6">
                          <p className="text-[10px] font-black text-indigo-600 uppercase mb-1">{t.dimension}</p>
                          <p className="text-xs text-slate-500 italic">"{t.evidence}"</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-slate-900">{t.score}<span className="text-[10px] opacity-40">/5</span></p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planner' | 'observation' | 'students'>('dashboard');
  const [showTTESS, setShowTTESS] = useState(false);
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Liam Garcia', grade: '1st', tier: 1, accommodations: 'Front seating', scores: [85, 78, 82, 88, 91], mclassBOY: 82, mapBOY: 78, isELL: true },
    { id: '2', name: 'Sophia Chen', grade: '1st', tier: 2, accommodations: 'ESL Support', scores: [65, 62, 70, 68, 72], mclassBOY: 60, mapBOY: 65, iepNotes: 'Visual aids' },
  ]);
  const [plans] = useState<LessonPlan[]>([
    { id: 'l1', title: 'ELA - Phonics Intro', curriculum: 'Amplify', content: 'CVC blended sounds focus.', status: 'analyzed' }
  ]);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <nav className="w-72 bg-white border-r border-slate-100 flex flex-col fixed h-full z-10 shadow-sm">
        <div className="p-10">
          <div className="flex items-center space-x-3 mb-16">
            <div className="w-12 h-12 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl rotate-6 group">
              <Brain className="text-white w-7 h-7 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">EduElevate</span>
          </div>
          <div className="space-y-4">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Console' },
              { id: 'planner', icon: BookOpen, label: 'Optimizer' },
              { id: 'observation', icon: Video, label: 'Audit' },
              { id: 'students', icon: Users, label: 'Roster' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`w-full flex items-center space-x-4 px-6 py-5 rounded-[2rem] transition-all group ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105' : 'text-slate-400 hover:bg-slate-50'}`}>
                <tab.icon className={`w-5 h-5 transition-transform group-hover:scale-110`} />
                <span className="font-black text-[11px] uppercase tracking-[0.1em]">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto p-10 border-t space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[2rem] border border-slate-100">
             <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">TTESS Mode</span>
                <span className={`text-[9px] font-bold uppercase ${showTTESS ? 'text-indigo-600' : 'text-slate-500'}`}>{showTTESS ? 'Alignment On' : 'Growth Mode'}</span>
             </div>
             <button onClick={() => setShowTTESS(!showTTESS)} className="transition-all active:scale-95">
                {showTTESS ? <ToggleRight className="w-10 h-10 text-indigo-600" /> : <ToggleLeft className="w-10 h-10 text-slate-300" />}
             </button>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Private Growth Secured</span>
          </div>
        </div>
      </nav>
      <main className="flex-1 ml-72 p-16 max-w-7xl mx-auto">
        {activeTab === 'dashboard' && <Dashboard students={students} plans={plans} />}
        {activeTab === 'planner' && <LessonPlanner plans={plans} setPlans={() => {}} students={students} showTTESS={showTTESS} />}
        {activeTab === 'observation' && <ObservationAnalyzer students={students} plans={plans} showTTESS={showTTESS} />}
        {activeTab === 'students' && (
          <StudentRoster students={students} setStudents={setStudents} />
        )}
      </main>
    </div>
  );
}

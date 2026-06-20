import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import {
  getSubjectNotes, setSubjectNotes, getSubjectCards, setSubjectCards,
  getSubjectTasks, setSubjectTasks, getSubjectConnections, setSubjectConnections,
} from '../../data/storage';
import { DEFAULT_SUBJECTS } from '../../data/defaults';
import { screenEnter } from '../../utils/motion';

const TABS = ['notes', 'cards', 'quiz', 'links', 'tasks'];

export default function SubjectDetail({ subject, onBack, editMode }) {
  const [tab, setTab] = useState('notes');
  const [notes, setNotesState] = useState(() => getSubjectNotes(subject.id));
  const [cards, setCardsState] = useState(() => getSubjectCards(subject.id));
  const [tasks, setTasksState] = useState(() => getSubjectTasks(subject.id));
  const [connections, setConnState] = useState(() => getSubjectConnections(subject.id));
  const [quizIdx, setQuizIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizScore, setQuizScore] = useState({ knew: 0, missed: 0 });
  const [quizDone, setQuizDone] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editNoteId, setEditNoteId] = useState(null);
  const [newCard, setNewCard] = useState({ q: '', a: '' });
  const [newTask, setNewTask] = useState('');
  const [linkSid, setLinkSid] = useState('');
  const [linkNote, setLinkNote] = useState('');

  const saveNotes = (n) => { setNotesState(n); setSubjectNotes(subject.id, n); };
  const saveCards = (c) => { setCardsState(c); setSubjectCards(subject.id, c); };
  const saveTasks = (t) => { setTasksState(t); setSubjectTasks(subject.id, t); };
  const saveConn = (c) => { setConnState(c); setSubjectConnections(subject.id, c); };

  const linkedSubjects = connections.map((c) => DEFAULT_SUBJECTS.find((s) => s.id === c.sid)).filter(Boolean);
  const unlinked = DEFAULT_SUBJECTS.filter((s) => s.id !== subject.id && !connections.find((c) => c.sid === s.id));

  function advanceQuiz(knew) {
    setQuizScore((s) => ({ knew: s.knew + (knew ? 1 : 0), missed: s.missed + (knew ? 0 : 1) }));
    setFlipped(false);
    if (quizIdx + 1 >= cards.length) setQuizDone(true);
    else setQuizIdx((i) => i + 1);
  }

  return (
    <motion.div className="screen" {...screenEnter}>
      <button type="button" className="glass-pill mb-16" onClick={onBack}><ArrowLeft size={14} /> Back</button>
      <div style={{ background: `linear-gradient(135deg, ${subject.c}22, transparent)`, padding: 20, borderRadius: 20, marginBottom: 20, border: `1px solid ${subject.c}33` }}>
        <h1 className="text-title">{subject.i} {subject.n}</h1>
        <p className="text-caption text-secondary">{subject.d}</p>
      </div>

      <div className="segmented mb-20">
        {TABS.map((t) => (
          <button key={t} type="button" className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t === 'notes' && '📝'}{t === 'cards' && '🃏'}{t === 'quiz' && '🧪'}{t === 'links' && '🔗'}{t === 'tasks' && '✅'}
          </button>
        ))}
      </div>

      {tab === 'notes' && (
        <>
          <GlassCard style={{ padding: 16, marginBottom: 16 }}>
            <input className="glass-input mb-8" placeholder="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
            <textarea className="glass-input mb-12" placeholder="Content (#tags supported)" rows={4} value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} />
            <button type="button" className="glass-btn glass-btn--primary" onClick={() => {
              if (!newNote.title.trim()) return;
              saveNotes([...notes, { id: Date.now().toString(), ...newNote, date: new Date().toISOString() }]);
              setNewNote({ title: '', content: '' });
            }}>New Note</button>
          </GlassCard>
          {notes.map((n, i) => (
            <GlassCard key={n.id} index={i} accentColor={subject.c} style={{ padding: 16, marginBottom: 10 }}>
              {editNoteId === n.id ? (
                <>
                  <input className="glass-input mb-8" value={n.title} onChange={(e) => saveNotes(notes.map((x) => x.id === n.id ? { ...x, title: e.target.value } : x))} />
                  <textarea className="glass-input mb-8" value={n.content} onChange={(e) => saveNotes(notes.map((x) => x.id === n.id ? { ...x, content: e.target.value } : x))} rows={4} />
                  <button type="button" className="glass-pill" onClick={() => setEditNoteId(null)}>Done</button>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <div className="text-headline">{n.title}</div>
                    <span className="glass-pill" style={{ fontSize: 10 }}>{new Date(n.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', marginTop: 10, fontSize: 14, lineHeight: 1.7 }}>{n.content}</div>
                  {(n.content.match(/#\w+/g) || []).map((tag) => (
                    <span key={tag} className="glass-pill glass-pill--active" style={{ marginTop: 8, marginRight: 6, fontSize: 10 }}>{tag}</span>
                  ))}
                  <div className="flex gap-8" style={{ marginTop: 10 }}>
                    <button type="button" className="glass-pill" onClick={() => setEditNoteId(n.id)}>✏️ Edit</button>
                    {editMode && <button type="button" className="glass-pill" style={{ color: 'var(--rose)' }} onClick={() => saveNotes(notes.filter((x) => x.id !== n.id))}>×</button>}
                  </div>
                </>
              )}
            </GlassCard>
          ))}
        </>
      )}

      {tab === 'cards' && (
        <>
          <input className="glass-input mb-8" placeholder="Question" value={newCard.q} onChange={(e) => setNewCard({ ...newCard, q: e.target.value })} />
          <input className="glass-input mb-12" placeholder="Answer" value={newCard.a} onChange={(e) => setNewCard({ ...newCard, a: e.target.value })} />
          <button type="button" className="glass-btn glass-btn--primary mb-16" onClick={() => {
            if (!newCard.q.trim()) return;
            saveCards([...cards, { id: Date.now().toString(), ...newCard }]);
            setNewCard({ q: '', a: '' });
          }}>Add Card</button>
          {cards.map((c, i) => (
            <GlassCard key={c.id} index={i} style={{ padding: 16, marginBottom: 10 }}>
              <div className="text-micro" style={{ color: subject.c }}>Q</div>
              <div style={{ marginBottom: 10 }}>{c.q}</div>
              <div className="text-micro" style={{ color: 'var(--emerald)' }}>A</div>
              <div>{c.a}</div>
            </GlassCard>
          ))}
        </>
      )}

      {tab === 'quiz' && (
        <>
          {!quizActive && !quizDone && (
            <GlassCard className="quiz-card" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 56 }}>{subject.i}</div>
              <h3 className="text-title" style={{ margin: '12px 0' }}>Ready to Quiz?</h3>
              <p className="text-secondary mb-16">{cards.length} cards</p>
              {cards.length > 0 ? (
                <button type="button" className="glass-btn glass-btn--primary glass-btn--glow" onClick={() => { setQuizActive(true); setQuizIdx(0); setQuizScore({ knew: 0, missed: 0 }); setQuizDone(false); }}>Start</button>
              ) : <p className="text-secondary">Add flashcards first</p>}
            </GlassCard>
          )}
          {quizActive && !quizDone && cards[quizIdx] && (
            <>
              <div className="day-progress mb-12"><div className="day-progress-fill" style={{ width: `${((quizIdx) / cards.length) * 100}%`, background: subject.c }} /></div>
              <p className="text-micro text-center mb-12">{quizIdx + 1} / {cards.length}</p>
              <div className="quiz-card-flip" onClick={() => !flipped && setFlipped(true)}>
                <div className={`quiz-card-inner ${flipped ? 'flipped' : ''}`}>
                  <GlassCard className="quiz-face">
                    <div className="text-micro" style={{ color: subject.c }}>QUESTION</div>
                    <p className="text-headline" style={{ marginTop: 16 }}>{cards[quizIdx].q}</p>
                    {!flipped && <p className="text-tertiary" style={{ marginTop: 20, fontSize: 13 }}>Tap to reveal</p>}
                  </GlassCard>
                  <GlassCard className="quiz-face back">
                    <div className="text-micro" style={{ color: 'var(--emerald)' }}>ANSWER</div>
                    <p className="text-headline" style={{ marginTop: 16 }}>{cards[quizIdx].a}</p>
                  </GlassCard>
                </div>
              </div>
              {flipped && (
                <div className="flex gap-8 mt-16">
                  <button type="button" className="glass-btn flex-1" style={{ borderColor: 'var(--rose)', color: 'var(--rose)' }} onClick={() => advanceQuiz(false)}>✗ Missed It</button>
                  <button type="button" className="glass-btn glass-btn--primary flex-1" onClick={() => advanceQuiz(true)}>✓ Knew It</button>
                </div>
              )}
            </>
          )}
          {quizDone && (
            <GlassCard style={{ padding: 24, textAlign: 'center' }}>
              <div className="text-title accent-text"><CountUpDisplay value={Math.round((quizScore.knew / cards.length) * 100)} />%</div>
              <p className="text-caption text-secondary" style={{ marginTop: 8 }}>Knew {quizScore.knew} · Missed {quizScore.missed}</p>
              <div className="flex gap-8 mt-16 justify-center">
                <button type="button" className="glass-btn" onClick={() => { setQuizActive(false); setQuizDone(false); }}>Done</button>
                <button type="button" className="glass-btn glass-btn--primary" onClick={() => { setQuizActive(true); setQuizIdx(0); setQuizDone(false); setQuizScore({ knew: 0, missed: 0 }); setFlipped(false); }}>Retry</button>
              </div>
            </GlassCard>
          )}
        </>
      )}

      {tab === 'links' && (
        <>
          <div className="connection-graph glass-card" style={{ padding: 20, marginBottom: 16 }}>
            <div className="connection-center" style={{ background: subject.c, color: '#fff', boxShadow: `0 0 32px ${subject.c}66` }}>{subject.n.split(' ')[0]}</div>
            {linkedSubjects.map((s, i) => {
              const angle = (i / Math.max(linkedSubjects.length, 1)) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * 90;
              const y = Math.sin(angle) * 70;
              return (
                <div key={s.id} className="connection-node" style={{ borderColor: s.c, transform: `translate(${x}px, ${y}px)`, left: '50%', top: '50%', marginLeft: -28, marginTop: -28 }}>
                  {s.i}
                </div>
              );
            })}
          </div>
          <div className="flex gap-8 mb-12">
            <select className="glass-input flex-1" value={linkSid} onChange={(e) => setLinkSid(e.target.value)}>
              <option value="">Link subject…</option>
              {unlinked.map((s) => <option key={s.id} value={s.id}>{s.n}</option>)}
            </select>
            <button type="button" className="glass-btn glass-btn--primary" onClick={() => {
              if (!linkSid) return;
              saveConn([...connections, { id: Date.now().toString(), sid: linkSid, note: linkNote }]);
              setLinkSid(''); setLinkNote('');
            }}>+</button>
          </div>
          {connections.map((c) => {
            const s = DEFAULT_SUBJECTS.find((x) => x.id === c.sid);
            return (
              <GlassCard key={c.id} style={{ padding: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span>{s?.i} {s?.n} {c.note && `— ${c.note}`}</span>
                {editMode && <button type="button" onClick={() => saveConn(connections.filter((x) => x.id !== c.id))} style={{ background: 'none', border: 'none', color: 'var(--rose)', cursor: 'pointer' }}>×</button>}
              </GlassCard>
            );
          })}
        </>
      )}

      {tab === 'tasks' && (
        <>
          <div className="flex gap-8 mb-16">
            <input className="glass-input flex-1" placeholder="Add task…" value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => {
              if (e.key === 'Enter' && newTask.trim()) { saveTasks([...tasks, { id: Date.now().toString(), text: newTask.trim(), done: false }]); setNewTask(''); }
            }} />
            <button type="button" className="glass-btn glass-btn--primary" onClick={() => {
              if (!newTask.trim()) return;
              saveTasks([...tasks, { id: Date.now().toString(), text: newTask.trim(), done: false }]);
              setNewTask('');
            }}>+</button>
          </div>
          {tasks.filter((t) => !t.done).map((t) => (
            <GlassCard key={t.id} style={{ padding: 12, marginBottom: 8, display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }}
              onClick={() => saveTasks(tasks.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}>
              <div className={`nn-check ${t.done ? 'nn-check--done' : ''}`}>✓</div>
              <span>{t.text}</span>
            </GlassCard>
          ))}
          {tasks.filter((t) => t.done).map((t) => (
            <div key={t.id} className="text-secondary strikethrough opacity-45" style={{ padding: 8, cursor: 'pointer' }}
              onClick={() => saveTasks(tasks.map((x) => x.id === t.id ? { ...x, done: false } : x))}>{t.text}</div>
          ))}
        </>
      )}
    </motion.div>
  );
}

function CountUpDisplay({ value }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / 1400);
      setV(Math.round(value * p));
      if (p >= 1) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [value]);
  return v;
}
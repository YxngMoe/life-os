import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import {
  getSubjectNotes, setSubjectNotes,
  getSubjectCards, setSubjectCards,
  getSubjectTasks, setSubjectTasks,
  getSubjectConnections, setSubjectConnections,
} from '../../data/storage';
import { DEFAULT_SUBJECTS } from '../../data/defaults';

const TABS = ['notes', 'cards', 'quiz', 'links', 'tasks'];

export default function SubjectDetail({ subject, onBack, editMode }) {
  const [tab, setTab] = useState('notes');
  const [notes, setNotesState] = useState(() => getSubjectNotes(subject.id));
  const [cards, setCardsState] = useState(() => getSubjectCards(subject.id));
  const [tasks, setTasksState] = useState(() => getSubjectTasks(subject.id));
  const [connections, setConnState] = useState(() => getSubjectConnections(subject.id));
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizFlipped, setQuizFlipped] = useState(false);
  const [quizActive, setQuizActive] = useState(false);
  const [quizScore, setQuizScore] = useState({ knew: 0, missed: 0 });
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [newCard, setNewCard] = useState({ q: '', a: '' });
  const [newTask, setNewTask] = useState('');

  function saveNotes(n) { setNotesState(n); setSubjectNotes(subject.id, n); }
  function saveCards(c) { setCardsState(c); setSubjectCards(subject.id, c); }
  function saveTasks(t) { setTasksState(t); setSubjectTasks(subject.id, t); }
  function saveConn(c) { setConnState(c); setSubjectConnections(subject.id, c); }

  return (
    <motion.div className="screen" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
      <button type="button" className="glass-pill mb-16" onClick={onBack}><ArrowLeft size={14} /> Back</button>
      <div className="screen-header" style={{ background: `linear-gradient(135deg, ${subject.c}22, transparent)`, padding: 16, borderRadius: 16, marginBottom: 16 }}>
        <h1 className="text-title2">{subject.i} {subject.n}</h1>
        <p className="text-secondary">{subject.d}</p>
      </div>

      <div className="segmented mb-16">
        {TABS.map((t) => (
          <button key={t} type="button" className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
            {t === 'notes' && '📝'}{t === 'cards' && '🃏'}{t === 'quiz' && '🧪'}{t === 'links' && '🔗'}{t === 'tasks' && '✅'} {t}
          </button>
        ))}
      </div>

      {tab === 'notes' && (
        <>
          <div className="mb-16">
            <input className="glass-input mb-8" placeholder="Title" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
            <textarea className="glass-input mb-8" placeholder="Content (#tags supported)" value={newNote.content} onChange={(e) => setNewNote({ ...newNote, content: e.target.value })} />
            <button type="button" className="glass-btn glass-btn--primary" onClick={() => {
              if (!newNote.title.trim()) return;
              saveNotes([...notes, { id: Date.now().toString(), ...newNote, date: new Date().toISOString() }]);
              setNewNote({ title: '', content: '' });
            }}>New Note</button>
          </div>
          {notes.map((n) => (
            <GlassCard key={n.id} accentColor={subject.c} style={{ padding: 14, marginBottom: 8 }}>
              <div className="text-headline">{n.title}</div>
              <div className="text-micro text-tertiary" style={{ margin: '4px 0 8px' }}>{new Date(n.date).toLocaleDateString()}</div>
              <div style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{n.content}</div>
              {editMode && <button type="button" onClick={() => saveNotes(notes.filter((x) => x.id !== n.id))} style={{ marginTop: 8, color: 'var(--accent-rose)', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>}
            </GlassCard>
          ))}
        </>
      )}

      {tab === 'cards' && (
        <>
          <input className="glass-input mb-8" placeholder="Question" value={newCard.q} onChange={(e) => setNewCard({ ...newCard, q: e.target.value })} />
          <input className="glass-input mb-8" placeholder="Answer" value={newCard.a} onChange={(e) => setNewCard({ ...newCard, a: e.target.value })} />
          <button type="button" className="glass-btn glass-btn--primary mb-16" onClick={() => {
            if (!newCard.q.trim()) return;
            saveCards([...cards, { id: Date.now().toString(), ...newCard }]);
            setNewCard({ q: '', a: '' });
          }}>Add Card</button>
          {cards.map((c) => (
            <GlassCard key={c.id} style={{ padding: 14, marginBottom: 8 }}>
              <div className="text-micro" style={{ color: subject.c }}>Q</div>
              <div style={{ marginBottom: 8 }}>{c.q}</div>
              <div className="text-micro" style={{ color: 'var(--accent-emerald)' }}>A</div>
              <div>{c.a}</div>
            </GlassCard>
          ))}
        </>
      )}

      {tab === 'quiz' && (
        <>
          {!quizActive && cards.length > 0 && (
            <GlassCard className="quiz-card">
              <div style={{ fontSize: 48, marginBottom: 12 }}>{subject.i}</div>
              <h3 className="text-headline">Ready to Quiz?</h3>
              <p className="text-secondary mb-16">{cards.length} cards</p>
              <button type="button" className="glass-btn glass-btn--primary" onClick={() => { setQuizActive(true); setQuizIdx(0); setQuizFlipped(false); setQuizScore({ knew: 0, missed: 0 }); }}>Start</button>
            </GlassCard>
          )}
          {quizActive && cards[quizIdx] && (
            <GlassCard className="quiz-card" onClick={() => setQuizFlipped(!quizFlipped)}>
              <div className="text-micro text-tertiary">{quizIdx + 1} / {cards.length}</div>
              <div className="text-micro" style={{ color: subject.c, margin: '12px 0' }}>{quizFlipped ? 'ANSWER' : 'QUESTION'}</div>
              <p className="text-headline">{quizFlipped ? cards[quizIdx].a : cards[quizIdx].q}</p>
              {!quizFlipped && <p className="text-tertiary" style={{ marginTop: 16, fontSize: 13 }}>Tap to reveal</p>}
            </GlassCard>
          )}
          {quizActive && quizFlipped && (
            <div className="flex gap-8 mt-16">
              <button type="button" className="glass-btn flex-1" style={{ borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)' }} onClick={() => {
                setQuizScore((s) => ({ ...s, missed: s.missed + 1 }));
                if (quizIdx + 1 >= cards.length) setQuizActive(false);
                else { setQuizIdx((i) => i + 1); setQuizFlipped(false); }
              }}>✗ Missed It</button>
              <button type="button" className="glass-btn glass-btn--primary flex-1" onClick={() => {
                setQuizScore((s) => ({ ...s, knew: s.knew + 1 }));
                if (quizIdx + 1 >= cards.length) setQuizActive(false);
                else { setQuizIdx((i) => i + 1); setQuizFlipped(false); }
              }}>✓ Knew It</button>
            </div>
          )}
          {!quizActive && quizScore.knew + quizScore.missed > 0 && (
            <GlassCard style={{ padding: 16, marginTop: 16, textAlign: 'center' }}>
              Score: {quizScore.knew} knew / {quizScore.missed} missed
            </GlassCard>
          )}
          {cards.length === 0 && <p className="text-secondary">Add flashcards first.</p>}
        </>
      )}

      {tab === 'tasks' && (
        <>
          <div className="flex gap-8 mb-16">
            <input className="glass-input flex-1" placeholder="Add task..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => {
              if (e.key === 'Enter' && newTask.trim()) {
                saveTasks([...tasks, { id: Date.now().toString(), text: newTask.trim(), done: false }]);
                setNewTask('');
              }
            }} />
            <button type="button" className="glass-btn glass-btn--primary" onClick={() => {
              if (!newTask.trim()) return;
              saveTasks([...tasks, { id: Date.now().toString(), text: newTask.trim(), done: false }]);
              setNewTask('');
            }}>+</button>
          </div>
          {tasks.filter((t) => !t.done).map((t) => (
            <GlassCard key={t.id} style={{ padding: 12, marginBottom: 6, display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer' }} onClick={() => saveTasks(tasks.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}>
              <div className={`check-square ${t.done ? 'check-square--done' : ''}`}>✓</div>
              <span>{t.text}</span>
            </GlassCard>
          ))}
        </>
      )}

      {tab === 'links' && (
        <GlassCard style={{ padding: 20, textAlign: 'center' }}>
          <div className="connection-graph">
            <div className="connection-center glass-card" style={{ background: subject.c, color: '#fff' }}>{subject.n}</div>
          </div>
          <p className="text-secondary">{connections.length} connections</p>
        </GlassCard>
      )}
    </motion.div>
  );
}

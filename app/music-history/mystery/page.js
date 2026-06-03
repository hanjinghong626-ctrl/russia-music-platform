'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import cases from './data';
import './mystery.css';

// 游戏阶段
const PHASES = {
  INTRO: 'intro',
  CASE_SELECT: 'caseSelect',
  CRIME_SCENE: 'crimeScene',
  INTERROGATION: 'interrogation',
  EVIDENCE: 'evidence',
  VERDICT: 'verdict',
  TRUTH: 'truth'
};

export default function MysteryPage() {
  const [phase, setPhase] = useState(PHASES.INTRO);
  const [selectedCase, setSelectedCase] = useState(null);
  const [collectedClues, setCollectedClues] = useState([]);
  const [inspectedItems, setInspectedItems] = useState(new Set());
  const [currentSuspect, setCurrentSuspect] = useState(null);
  const [dialogueRound, setDialogueRound] = useState(0);
  const [dialogueHistory, setDialogueHistory] = useState({});
  const [selectedCulprit, setSelectedCulprit] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [verdictResult, setVerdictResult] = useState(null);
  const [showTypewriter, setShowTypewriter] = useState('');
  const [particleActive, setParticleActive] = useState(true);
  const introTimerRef = useRef(null);
  const typewriterRef = useRef(null);

  // 开场动画
  const [introStep, setIntroStep] = useState(0);
  useEffect(() => {
    if (phase !== PHASES.INTRO) return;
    const timers = [
      setTimeout(() => setIntroStep(1), 800),
      setTimeout(() => setIntroStep(2), 2200),
      setTimeout(() => setIntroStep(3), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // 打字机效果
  const typewrite = useCallback((text, setter, speed = 30) => {
    if (typewriterRef.current) clearTimeout(typewriterRef.current);
    let i = 0;
    setter('');
    const type = () => {
      if (i < text.length) {
        setter(text.slice(0, i + 1));
        i++;
        typewriterRef.current = setTimeout(type, speed);
      }
    };
    type();
  }, []);

  // 开始案件
  const startCase = (caseData) => {
    setSelectedCase(caseData);
    setCollectedClues([]);
    setInspectedItems(new Set());
    setDialogueHistory({});
    setCurrentSuspect(null);
    setDialogueRound(0);
    setSelectedCulprit(null);
    setSelectedEvidence([]);
    setVerdictResult(null);
    setPhase(PHASES.CRIME_SCENE);
  };

  // 搜查物品
  const inspectItem = (item) => {
    if (inspectedItems.has(item.id)) return;
    setInspectedItems(prev => new Set([...prev, item.id]));
    if (item.isKey) {
      setCollectedClues(prev => [...prev, {
        id: item.id,
        name: item.name,
        icon: item.icon,
        clue: item.clue,
        type: 'physical'
      }]);
    }
  };

  // 审讯对话
  const askQuestion = (questionObj) => {
    if (!currentSuspect) return;
    const key = `${currentSuspect.id}_r${dialogueRound}`;
    setDialogueHistory(prev => ({
      ...prev,
      [key]: questionObj
    }));
  };

  // 检查是否已问过当前轮
  const hasAskedThisRound = () => {
    if (!currentSuspect) return false;
    const key = `${currentSuspect.id}_r${dialogueRound}`;
    return !!dialogueHistory[key];
  };

  // 下一个审讯轮次
  const nextRound = () => {
    if (dialogueRound < 2) {
      setDialogueRound(prev => prev + 1);
    }
  };

  // 提交指认
  const submitVerdict = () => {
    if (!selectedCulprit) return;
    const isCorrect = selectedCulprit === selectedCase.culprit;
    const hasEvidence = selectedEvidence.length > 0;
    const culpritData = selectedCase.suspects.find(s => s.id === selectedCulprit);
    
    let result;
    if (isCorrect && hasEvidence) {
      result = 'perfect';
    } else if (isCorrect) {
      result = 'correct';
    } else {
      result = 'wrong';
    }
    setVerdictResult({ result, culpritData });
    setPhase(PHASES.VERDICT);
  };

  // ==================== 渲染各阶段 ====================

  // 开场动画
  const renderIntro = () => (
    <div className="mystery-intro" onClick={() => setPhase(PHASES.CASE_SELECT)}>
      <div className="intro-particles">
        {particleActive && [...Array(30)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }} />
        ))}
      </div>
      <div className="intro-silhouette" />
      <div className={`intro-text intro-step-${introStep}`}>
        <h1 className="intro-title">
          <span className="title-char" style={{ animationDelay: '0s' }}>案</span>
          <span className="title-char" style={{ animationDelay: '0.1s' }}>中</span>
          <span className="title-char" style={{ animationDelay: '0.2s' }}>曲</span>
        </h1>
        <p className="intro-subtitle-ru">Дело о Музыке</p>
        <p className="intro-desc">俄罗斯音乐史上最离奇的案件<br />你是侦探，嫌疑人们都是大作曲家</p>
        <button className="intro-enter-btn">
          <span className="btn-icon">🔍</span> 开始调查
        </button>
      </div>
    </div>
  );

  // 选案界面
  const renderCaseSelect = () => (
    <div className="case-select-page">
      <header className="mystery-header">
        <Link href="/music-history" className="back-link">
          <span className="back-arrow">←</span> 返回音乐史
        </Link>
        <h1 className="mystery-page-title">案中曲</h1>
        <p className="mystery-page-subtitle">Дело о Музыке — 选择案件开始调查</p>
      </header>
      <div className="cases-grid">
        {cases.map((c, idx) => (
          <div key={c.id} className="case-card" onClick={() => startCase(c)}
            style={{ animationDelay: `${idx * 0.15}s` }}>
            <div className="case-card-glow" />
            <div className="case-card-inner">
              <div className="case-difficulty">
                {'★'.repeat(c.difficulty)}{'☆'.repeat(3 - c.difficulty)}
              </div>
              <div className="case-victim-portrait">
                <img src={c.victim.portrait} alt={c.victim.name} />
              </div>
              <h2 className="case-title">{c.title}</h2>
              <p className="case-title-ru">{c.titleRu}</p>
              <div className="case-meta">
                <span className="case-year">{c.year}年</span>
                <span className="case-suspects-count">{c.suspects.length}位嫌疑人</span>
              </div>
              <div className="case-tags">
                {c.tags.map(t => <span key={t} className="case-tag">{t}</span>)}
              </div>
              <button className="case-start-btn">开始调查 →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 案发现场
  const renderCrimeScene = () => {
    if (!selectedCase) return null;
    const scene = selectedCase.crimeScene;
    const keyCluesFound = collectedClues.filter(c => c.type === 'physical').length;
    const totalKeyClues = scene.items.filter(i => i.isKey).length;

    return (
      <div className="crime-scene-page">
        <header className="mystery-header">
          <button className="back-link" onClick={() => setPhase(PHASES.CASE_SELECT)}>
            <span className="back-arrow">←</span> 返回选案
          </button>
          <h1 className="mystery-page-title">{selectedCase.title}</h1>
          <div className="scene-progress">
            <span className="clue-counter">关键线索 {keyCluesFound}/{totalKeyClues}</span>
          </div>
        </header>

        <div className="crime-scene-container">
          <div className="scene-room">
            <div className="room-ambient" />
            <div className="room-flicker" />
            <div className="scene-description">
              <p>{scene.description}</p>
            </div>
            <div className="scene-items-grid">
              {scene.items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`scene-item ${inspectedItems.has(item.id) ? 'inspected' : ''} ${item.isKey && !inspectedItems.has(item.id) ? 'item-glow' : ''}`}
                  onClick={() => inspectItem(item)}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <span className="item-icon">{item.icon}</span>
                  <span className="item-name">{item.name}</span>
                  {inspectedItems.has(item.id) && <span className="item-check">✓</span>}
                </div>
              ))}
            </div>
          </div>

          {/* 线索面板 */}
          <div className="clue-panel">
            <h3 className="clue-panel-title">已收集线索</h3>
            {collectedClues.length === 0 ? (
              <p className="clue-empty">点击场景中的物品搜查线索</p>
            ) : (
              <div className="clue-list">
                {collectedClues.map(clue => (
                  <div key={clue.id} className="clue-card">
                    <div className="clue-header">
                      <span className="clue-icon">{clue.icon}</span>
                      <span className="clue-name">{clue.name}</span>
                    </div>
                    <p className="clue-text">{clue.clue}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              className="next-phase-btn"
              onClick={() => setPhase(PHASES.INTERROGATION)}
              disabled={collectedClues.length === 0}
            >
              开始审讯 →
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 审讯环节
  const renderInterrogation = () => {
    if (!selectedCase) return null;
    const suspect = currentSuspect;
    const askedKey = suspect ? `${suspect.id}_r${dialogueRound}` : null;
    const askedQuestion = askedKey ? dialogueHistory[askedKey] : null;

    return (
      <div className="interrogation-page">
        <header className="mystery-header">
          <button className="back-link" onClick={() => setPhase(PHASES.CRIME_SCENE)}>
            <span className="back-arrow">←</span> 返回现场
          </button>
          <h1 className="mystery-page-title">审讯</h1>
          <div className="interrogation-progress">
            {suspect ? `第${dialogueRound + 1}/3轮` : '选择审讯对象'}
          </div>
        </header>

        {!suspect ? (
          <div className="suspect-gallery">
            <h2 className="gallery-title">选择要审讯的嫌疑人</h2>
            <div className="suspect-cards">
              {selectedCase.suspects.map(s => {
                const roundsDone = [0, 1, 2].filter(r => dialogueHistory[`${s.id}_r${r}`]).length;
                return (
                  <div key={s.id} className="suspect-card" onClick={() => {
                    setCurrentSuspect(s);
                    setDialogueRound([0, 1, 2].find(r => !dialogueHistory[`${s.id}_r${r}`]) || 0);
                  }}>
                    <div className="suspect-portrait-wrap">
                      <img src={s.portrait} alt={s.name} className="suspect-portrait" />
                      <div className="portrait-frame" />
                    </div>
                    <div className="suspect-info">
                      <h3 className="suspect-name">{s.name}</h3>
                      <p className="suspect-name-ru">{s.nameRu}</p>
                      <p className="suspect-relation">{s.relation}</p>
                      <div className="round-dots">
                        {[0, 1, 2].map(r => (
                          <span key={r} className={`round-dot ${dialogueHistory[`${s.id}_r${r}`] ? 'done' : ''}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              className="next-phase-btn"
              onClick={() => setPhase(PHASES.EVIDENCE)}
            >
              整理证据 →
            </button>
          </div>
        ) : (
          <div className="interrogation-room">
            <div className="interrogation-left">
              <div className="suspect-large-portrait">
                <img src={suspect.portrait} alt={suspect.name} />
                <div className="portrait-overlay" />
              </div>
              <div className="suspect-large-info">
                <h2>{suspect.name}</h2>
                <p className="suspect-relation-large">{suspect.relation}</p>
                <div className="round-indicator">
                  第{dialogueRound + 1}轮审讯
                </div>
              </div>
              <button className="back-suspects-btn" onClick={() => {
                setCurrentSuspect(null);
              }}>
                ← 换人审讯
              </button>
            </div>

            <div className="interrogation-right">
              <div className="dialogue-area">
                {!askedQuestion ? (
                  <div className="question-options">
                    <p className="dialogue-prompt">选择提问方向：</p>
                    {suspect.dialogues[`round${dialogueRound + 1}`].map((q, idx) => (
                      <button key={idx} className="question-btn" onClick={() => askQuestion(q)}>
                        <span className="question-num">{idx + 1}</span>
                        {q.question}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="dialogue-response">
                    <div className="dialogue-q">
                      <span className="q-label">你：</span>
                      {askedQuestion.question}
                    </div>
                    <div className="dialogue-a">
                      <span className="a-label">{suspect.name}：</span>
                      {askedQuestion.answer}
                    </div>
                    {askedQuestion.hint && (
                      <div className="dialogue-hint">
                        <span className="hint-icon">💡</span>
                        {askedQuestion.hint}
                      </div>
                    )}
                    {dialogueRound < 2 ? (
                      <button className="next-round-btn" onClick={() => {
                        setCurrentSuspect(null);
                      }}>
                        继续审讯他人 / 下一轮 →
                      </button>
                    ) : (
                      <button className="next-round-btn" onClick={() => {
                        setCurrentSuspect(null);
                      }}>
                        完成审讯 →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 证据板 + 推理
  const renderEvidence = () => {
    if (!selectedCase) return null;

    return (
      <div className="evidence-page">
        <header className="mystery-header">
          <button className="back-link" onClick={() => setPhase(PHASES.INTERROGATION)}>
            <span className="back-arrow">←</span> 返回审讯
          </button>
          <h1 className="mystery-page-title">推理</h1>
        </header>

        <div className="evidence-board">
          <div className="evidence-section">
            <h3 className="evidence-label">物证线索</h3>
            <div className="evidence-cards">
              {collectedClues.map(clue => (
                <div
                  key={clue.id}
                  className={`evidence-item ${selectedEvidence.includes(clue.id) ? 'evidence-selected' : ''}`}
                  onClick={() => {
                    setSelectedEvidence(prev =>
                      prev.includes(clue.id) ? prev.filter(e => e !== clue.id) : [...prev, clue.id]
                    );
                  }}
                >
                  <span className="evidence-icon">{clue.icon}</span>
                  <span className="evidence-name">{clue.name}</span>
                  <p className="evidence-clue">{clue.clue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="evidence-section">
            <h3 className="evidence-label">证词记录</h3>
            <div className="testimony-cards">
              {selectedCase.suspects.map(s => (
                <div key={s.id} className="testimony-suspect">
                  <div className="testimony-header">
                    <img src={s.portrait} alt={s.name} className="testimony-portrait" />
                    <span className="testimony-name">{s.name}</span>
                  </div>
                  {[0, 1, 2].map(r => {
                    const key = `${s.id}_r${r}`;
                    if (!dialogueHistory[key]) return null;
                    return (
                      <div key={r} className="testimony-entry">
                        <span className="testimony-round">第{r + 1}轮</span>
                        <p className="testimony-q">{dialogueHistory[key].question}</p>
                        <p className="testimony-a">{dialogueHistory[key].answer}</p>
                        {dialogueHistory[key].hint && (
                          <p className="testimony-hint">💡 {dialogueHistory[key].hint}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="verdict-section">
          <h3 className="verdict-label">指认凶手</h3>
          <div className="culprit-select">
            {selectedCase.suspects.map(s => (
              <div
                key={s.id}
                className={`culprit-option ${selectedCulprit === s.id ? 'culprit-selected' : ''}`}
                onClick={() => setSelectedCulprit(s.id)}
              >
                <img src={s.portrait} alt={s.name} className="culprit-portrait" />
                <span className="culprit-name">{s.name}</span>
                {selectedCulprit === s.id && <span className="culprit-check">✓</span>}
              </div>
            ))}
          </div>
          <button
            className="submit-verdict-btn"
            onClick={submitVerdict}
            disabled={!selectedCulprit}
          >
            提交指认 ⚖️
          </button>
        </div>
      </div>
    );
  };

  // 结案
  const renderVerdict = () => {
    if (!verdictResult) return null;
    const isCorrect = verdictResult.result !== 'wrong';

    return (
      <div className={`verdict-page ${isCorrect ? 'verdict-correct' : 'verdict-wrong'}`}>
        <div className="verdict-dramatic">
          <div className="verdict-stamp">
            {isCorrect ? '破案' : '误判'}
          </div>
        </div>

        <div className="verdict-content">
          {verdictResult.result === 'perfect' && (
            <div className="verdict-perfect">
              <h2>🎯 完美破案！</h2>
              <p>你不仅找到了真凶，还构建了完整的证据链。出色的侦探！</p>
            </div>
          )}
          {verdictResult.result === 'correct' && (
            <div className="verdict-ok">
              <h2>✅ 凶手找对了</h2>
              <p>但证据链还不够完整。试着找出更多关键线索！</p>
            </div>
          )}
          {verdictResult.result === 'wrong' && (
            <div className="verdict-fail">
              <h2>❌ 误判！</h2>
              <p>你指认了无辜的人。真凶还在暗处得意……</p>
              <p className="verdict-hint">
                真凶是：<strong>{selectedCase.suspects.find(s => s.id === selectedCase.culprit)?.name}</strong>
              </p>
            </div>
          )}

          <button className="reveal-truth-btn" onClick={() => setPhase(PHASES.TRUTH)}>
            揭示真相 →
          </button>
        </div>
      </div>
    );
  };

  // 真相还原
  const renderTruth = () => {
    if (!selectedCase) return null;

    return (
      <div className="truth-page">
        <div className="truth-reveal">
          <h2 className="truth-title">真相还原</h2>
          <div className="truth-portrait-row">
            <div className="truth-victim">
              <img src={selectedCase.victim.portrait} alt={selectedCase.victim.name} />
              <p>{selectedCase.victim.name}</p>
              <span className="truth-label">受害者</span>
            </div>
            <div className="truth-culprit">
              <img src={selectedCase.suspects.find(s => s.id === selectedCase.culprit)?.portrait} alt="" />
              <p>{selectedCase.suspects.find(s => s.id === selectedCase.culprit)?.name}</p>
              <span className="truth-label culprit-label">真凶</span>
            </div>
          </div>
          <div className="truth-text">
            {selectedCase.truth.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="knowledge-cards">
            <h3 className="knowledge-title">📚 本案涉及的音乐史知识</h3>
            {selectedCase.knowledge.map((k, i) => (
              <div key={i} className="knowledge-card">
                <h4>{k.title}</h4>
                <p>{k.content}</p>
                <span className="knowledge-source">{k.source}</span>
              </div>
            ))}
          </div>

          <div className="truth-actions">
            <button className="replay-btn" onClick={() => {
              setPhase(PHASES.CASE_SELECT);
              setSelectedCase(null);
            }}>
              🔄 调查其他案件
            </button>
            <Link href="/music-history" className="back-home-btn">
              🏠 返回音乐史
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mystery-app">
      {phase === PHASES.INTRO && renderIntro()}
      {phase === PHASES.CASE_SELECT && renderCaseSelect()}
      {phase === PHASES.CRIME_SCENE && renderCrimeScene()}
      {phase === PHASES.INTERROGATION && renderInterrogation()}
      {phase === PHASES.EVIDENCE && renderEvidence()}
      {phase === PHASES.VERDICT && renderVerdict()}
      {phase === PHASES.TRUTH && renderTruth()}
    </div>
  );
}

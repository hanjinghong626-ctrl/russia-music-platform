'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import worldMap from './worldData';
import './mystery.css';

// 游戏阶段
const PHASE = {
  INTRO: 'intro',
  EXPLORE: 'explore',       // 街道探索
  INTERIOR: 'interior',     // 建筑内部
  DIALOGUE: 'dialogue',     // NPC对话
  EVIDENCE: 'evidence',     // 证据板推理
  VERDICT: 'verdict',       // 结案
  TRUTH: 'truth'            // 真相
};

export default function MysteryPage() {
  const [phase, setPhase] = useState(PHASE.INTRO);
  const [introStep, setIntroStep] = useState(0);

  // 探索状态
  const [scrollX, setScrollX] = useState(0);
  const [playerX, setPlayerX] = useState(50); // 玩家在街道上的位置%
  const [currentBuilding, setCurrentBuilding] = useState(null);
  const [currentNpc, setCurrentNpc] = useState(null);
  const [dialogueHistory, setDialogueHistory] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(null);

  // 收集状态
  const [collectedClues, setCollectedClues] = useState([]);
  const [inspectedItems, setInspectedItems] = useState(new Set());
  const [talkedNpcs, setTalkedNpcs] = useState(new Set());
  const [npcRoundsDone, setNpcRoundsDone] = useState({});

  // 推理状态
  const [selectedCulprit, setSelectedCulprit] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState([]);
  const [verdictResult, setVerdictResult] = useState(null);

  // 时间系统
  const [gameTime, setGameTime] = useState(18); // 从18:00开始
  const [dayPhase, setDayPhase] = useState('evening'); // morning/afternoon/evening/night

  // 通知
  const [notification, setNotification] = useState(null);
  const [showMinimap, setShowMinimap] = useState(false);

  const streetRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStartX = useRef(0);

  // 开场动画
  useEffect(() => {
    if (phase !== PHASE.INTRO) return;
    const timers = [
      setTimeout(() => setIntroStep(1), 800),
      setTimeout(() => setIntroStep(2), 2200),
      setTimeout(() => setIntroStep(3), 3600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // 通知显示
  const showNotif = useCallback((text, type = 'info') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // 推进时间
  const advanceTime = useCallback((hours = 1) => {
    setGameTime(prev => {
      const next = prev + hours;
      if (next >= 22) setDayPhase('night');
      else if (next >= 18) setDayPhase('evening');
      else if (next >= 12) setDayPhase('afternoon');
      else setDayPhase('morning');
      return Math.min(next, 24);
    });
  }, []);

  // 进入建筑
  const enterBuilding = useCallback((building) => {
    if (!building.accessible) {
      showNotif('🔒 门锁着，暂时无法进入', 'locked');
      return;
    }
    setCurrentBuilding(building);
    setPhase(PHASE.INTERIOR);
    advanceTime(0.5);
  }, [showNotif, advanceTime]);

  // 离开建筑
  const leaveBuilding = useCallback(() => {
    setCurrentBuilding(null);
    setPhase(PHASE.EXPLORE);
  }, []);

  // 搜查物品
  const inspectItem = useCallback((item) => {
    if (inspectedItems.has(item.id)) {
      showNotif('已经检查过了', 'info');
      return;
    }
    setInspectedItems(prev => new Set([...prev, item.id]));
    if (item.isKey) {
      setCollectedClues(prev => [...prev, {
        id: item.id,
        name: item.name,
        icon: item.icon,
        clue: item.clue,
        source: currentBuilding?.name || '街道'
      }]);
      showNotif(`🔑 发现关键线索：${item.name}`, 'key');
    } else {
      showNotif(`发现：${item.name}`, 'info');
    }
    advanceTime(0.3);
  }, [inspectedItems, currentBuilding, showNotif, advanceTime]);

  // 与NPC对话
  const startDialogue = useCallback((npcId) => {
    const char = worldMap.characters[npcId];
    if (!char) return;
    setCurrentNpc({ id: npcId, ...char });
    setCurrentQuestion(null);
    setPhase(PHASE.DIALOGUE);
    advanceTime(0.3);
  }, [npcRoundsDone, advanceTime]);

  // 选择问题
  const askQuestion = useCallback((q) => {
    if (!currentNpc) return;
    const round = npcRoundsDone[currentNpc.id] || 0;
    const key = `${currentNpc.id}_r${round}`;
    setDialogueHistory(prev => ({ ...prev, [key]: q }));
    setCurrentQuestion(q);
    setTalkedNpcs(prev => new Set([...prev, currentNpc.id]));
  }, [currentNpc, npcRoundsDone]);

  // 结束对话轮次
  const endDialogueRound = useCallback(() => {
    if (!currentNpc) return;
    const newRounds = { ...npcRoundsDone };
    newRounds[currentNpc.id] = (newRounds[currentNpc.id] || 0) + 1;
    setNpcRoundsDone(newRounds);

    if (newRounds[currentNpc.id] >= 3) {
      showNotif(`${currentNpc.name} 的审讯已完成`, 'complete');
      setCurrentNpc(null);
      setCurrentQuestion(null);
      if (currentBuilding) {
        setPhase(PHASE.INTERIOR);
      } else {
        setPhase(PHASE.EXPLORE);
      }
    } else {
      setCurrentQuestion(null);
    }
  }, [currentNpc, npcRoundsDone, showNotif, currentBuilding]);

  // 结束对话返回
  const exitDialogue = useCallback(() => {
    setCurrentNpc(null);
    setCurrentQuestion(null);
    if (currentBuilding) {
      setPhase(PHASE.INTERIOR);
    } else {
      setPhase(PHASE.EXPLORE);
    }
  }, [currentBuilding]);

  // 拖拽滚动街道
  const handlePointerDown = useCallback((e) => {
    if (phase !== PHASE.EXPLORE) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollStartX.current = scrollX;
  }, [phase, scrollX]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging.current || phase !== PHASE.EXPLORE) return;
    const delta = startX.current - e.clientX;
    const maxScroll = 2000;
    const newScroll = Math.max(0, Math.min(maxScroll, scrollStartX.current + delta));
    setScrollX(newScroll);
    // 更新玩家位置
    setPlayerX(50 + (newScroll / maxScroll) * 50);
  }, [phase]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // 提交指认
  const submitVerdict = useCallback(() => {
    if (!selectedCulprit) return;
    const isCorrect = selectedCulprit === worldMap.caseResult.culprit;
    const hasEvidence = selectedEvidence.length > 0;
    let result;
    if (isCorrect && hasEvidence) result = 'perfect';
    else if (isCorrect) result = 'correct';
    else result = 'wrong';
    setVerdictResult(result);
    setPhase(PHASE.VERDICT);
  }, [selectedCulprit, selectedEvidence]);

  // 所有NPC的列表
  const allNpcs = Object.entries(worldMap.characters).map(([id, char]) => ({
    id,
    ...char
  }));

  // ==================== 渲染 ====================

  // 开场动画
  const renderIntro = () => (
    <div className="mystery-intro" onClick={() => setPhase(PHASE.EXPLORE)}>
      <div className="intro-particles">
        {[...Array(30)].map((_, i) => (
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
        <p className="intro-desc">1881年·圣彼得堡<br />穆索尔斯基被发现死在寓所——你是侦探</p>
        <button className="intro-enter-btn">
          <span className="btn-icon">🔍</span> 踏入圣彼得堡
        </button>
      </div>
    </div>
  );

  // 街道探索
  const renderExplore = () => {
    const street = worldMap.street;
    return (
      <div className="explore-page">
        {/* HUD */}
        <div className="explore-hud">
          <Link href="/music-history" className="hud-back">← 返回</Link>
          <div className="hud-case-info">
            <span className="hud-case-title">案中曲</span>
            <span className="hud-case-sub">冬宫之夜的暗奏 · 1881</span>
          </div>
          <div className="hud-stats">
            <div className="hud-time">
              <span className="time-icon">{dayPhase === 'night' ? '🌙' : dayPhase === 'evening' ? '🌆' : '☀️'}</span>
              <span className="time-text">{Math.floor(gameTime)}:00</span>
            </div>
            <div className="hud-clues">
              <span className="clue-icon">🔑</span>
              <span>{collectedClues.length}</span>
            </div>
            <button className="hud-evidence-btn" onClick={() => setPhase(PHASE.EVIDENCE)}>
              📋 推理
            </button>
          </div>
        </div>

        {/* 街道场景 */}
        <div
          className="street-viewport"
          ref={streetRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div
            className="street-scroll"
            style={{ transform: `translateX(${-scrollX}px)` }}
          >
            {/* 背景图 */}
            <div className="street-bg">
              <img src={street.background} alt="圣彼得堡街道" className="street-bg-img" />
            </div>

            {/* 建筑热区 */}
            {street.buildings.map(b => (
              <div
                key={b.id}
                className="building-hotspot"
                style={{ left: `${b.x}%`, width: `${b.width}%` }}
                onClick={() => enterBuilding(b)}
              >
                <div className="building-sign">
                  <span className="sign-text">{b.sign}</span>
                </div>
                <div className="building-door">
                  <span className="door-icon">🚪</span>
                </div>
                <div className="building-label">{b.name}</div>
                {b.npcInside && (
                  <div className="building-npc-indicator">
                    <img
                      src={worldMap.characters[b.npcInside]?.portrait}
                      alt=""
                      className="npc-thumb"
                    />
                  </div>
                )}
              </div>
            ))}

            {/* 街道NPC */}
            {street.npcs.map(npc => (
              <div
                key={npc.id}
                className="street-npc"
                style={{ left: `${npc.x}%` }}
                onClick={() => startDialogue(npc.id)}
              >
                <div className="street-npc-portrait">
                  <img src={npc.portrait} alt={npc.name} />
                  {talkedNpcs.has(npc.id) && (
                    <div className="npc-talked-badge">✓</div>
                  )}
                </div>
                <div className="street-npc-name">{npc.name}</div>
                <div className="street-npc-location">{npc.location}</div>
                <div className="npc-pulse" />
              </div>
            ))}

            {/* 雪花/氛围粒子 */}
            <div className="street-atmosphere">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="snowflake" style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 8}s`,
                  animationDuration: `${4 + Math.random() * 6}s`
                }} />
              ))}
            </div>

            {/* 天色渐变 */}
            <div className={`sky-overlay sky-${dayPhase}`} />
          </div>

          {/* 滚动提示 */}
          {scrollX < 100 && (
            <div className="scroll-hint scroll-hint-right">
              ← 滑动探索街道 →
            </div>
          )}
        </div>

        {/* 玩家位置指示器 */}
        <div className="player-indicator">
          <div className="player-dot" />
          <span className="player-label">你在圣彼得堡</span>
        </div>

        {/* 通知 */}
        {notification && (
          <div className={`notification notif-${notification.type}`}>
            {notification.text}
          </div>
        )}
      </div>
    );
  };

  // 建筑内部
  const renderInterior = () => {
    if (!currentBuilding) return null;
    const npc = currentBuilding.npcInside ? worldMap.characters[currentBuilding.npcInside] : null;

    return (
      <div className="interior-page">
        <div className="interior-hud">
          <button className="hud-back" onClick={leaveBuilding}>
            ← 返回街道
          </button>
          <div className="interior-title">{currentBuilding.name}</div>
          <div className="interior-subtitle">{currentBuilding.nameRu}</div>
        </div>

        <div className="interior-scene">
          <div className="interior-bg">
            <img src={currentBuilding.interior} alt={currentBuilding.name} className="interior-bg-img" />
            <div className="interior-overlay" />
          </div>

          {/* 室内物品 */}
          <div className="interior-items">
            {currentBuilding.clueItems?.map(item => (
              <div
                key={item.id}
                className={`interior-item ${inspectedItems.has(item.id) ? 'item-inspected' : ''} ${item.isKey ? 'item-key' : ''}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onClick={() => inspectItem(item)}
              >
                <span className="interior-item-icon">{item.icon}</span>
                {!inspectedItems.has(item.id) && item.isKey && (
                  <span className="item-sparkle">✨</span>
                )}
                {inspectedItems.has(item.id) && (
                  <span className="item-checked">✓</span>
                )}
              </div>
            ))}
          </div>

          {/* NPC（如果在室内） */}
          {npc && (
            <div className="interior-npc" onClick={() => startDialogue(currentBuilding.npcInside)}>
              <img src={npc.portrait} alt={npc.name} className="interior-npc-portrait" />
              <div className="interior-npc-name">{npc.name}</div>
              <div className="interior-npc-hint">点击对话</div>
              <div className="npc-pulse" />
            </div>
          )}
        </div>

        {/* 检查中的物品弹窗 */}
        {notification && (
          <div className={`notification notif-${notification.type}`}>
            {notification.text}
          </div>
        )}
      </div>
    );
  };

  // 对话
  const renderDialogue = () => {
    if (!currentNpc) return null;
    const roundsDone = npcRoundsDone[currentNpc.id] || 0;
    const currentRound = Math.min(roundsDone, 2);
    const roundKey = `round${currentRound + 1}`;
    const questions = currentNpc.dialogues[roundKey];
    const askedKey = `${currentNpc.id}_r${currentRound}`;
    const asked = dialogueHistory[askedKey];

    return (
      <div className="dialogue-overlay">
        <div className="dialogue-container">
          <div className="dialogue-portrait-side">
            <img src={currentNpc.portrait} alt={currentNpc.name} className="dialogue-portrait-lg" />
            <div className="dialogue-npc-name">{currentNpc.name}</div>
            <div className="dialogue-npc-ru">{currentNpc.nameRu}</div>
            <div className="dialogue-round-info">
              第{currentRound + 1}/3轮
            </div>
            <button className="dialogue-exit" onClick={exitDialogue}>
              ✕ 离开
            </button>
          </div>

          <div className="dialogue-main">
            {!asked ? (
              <div className="dialogue-questions">
                <div className="dialogue-greeting">
                  {currentNpc.greeting || `${currentNpc.name}看着你，等待你的提问。`}
                </div>
                {questions.map((q, idx) => (
                  <button key={idx} className="dialogue-question-btn" onClick={() => askQuestion(q)}>
                    <span className="q-num">{idx + 1}</span>
                    <span className="q-text">{q.question}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="dialogue-response-area">
                <div className="dialogue-asked-q">
                  <span className="q-marker">你：</span>
                  {asked.question}
                </div>
                <div className="dialogue-answer">
                  <span className="a-marker">{currentNpc.name}：</span>
                  {asked.answer}
                </div>
                {asked.hint && (
                  <div className="dialogue-hint-box">
                    💡 {asked.hint}
                  </div>
                )}
                <button className="dialogue-continue" onClick={endDialogueRound}>
                  {currentRound < 2 ? '继续 →' : '结束审讯'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 证据板
  const renderEvidence = () => (
    <div className="evidence-page">
      <header className="mystery-header">
        <button className="back-link" onClick={() => setPhase(PHASE.EXPLORE)}>
          <span className="back-arrow">←</span> 返回街道
        </button>
        <h1 className="mystery-page-title">推理</h1>
      </header>

      <div className="evidence-board">
        <div className="evidence-section">
          <h3 className="evidence-label">物证线索</h3>
          <div className="evidence-cards">
            {collectedClues.length === 0 ? (
              <p className="clue-empty">还没有收集到线索，去街道和建筑中探索吧</p>
            ) : (
              collectedClues.map(clue => (
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
                  <span className="evidence-source">📍 {clue.source}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="evidence-section">
          <h3 className="evidence-label">证词记录</h3>
          <div className="testimony-cards">
            {allNpcs.filter(npc => talkedNpcs.has(npc.id)).map(npc => (
              <div key={npc.id} className="testimony-suspect">
                <div className="testimony-header">
                  <img src={npc.portrait} alt={npc.name} className="testimony-portrait" />
                  <span className="testimony-name">{npc.name}</span>
                </div>
                {[0, 1, 2].map(r => {
                  const key = `${npc.id}_r${r}`;
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
            {talkedNpcs.size === 0 && (
              <p className="clue-empty">还没有与任何人对话</p>
            )}
          </div>
        </div>
      </div>

      <div className="verdict-section">
        <h3 className="verdict-label">指认凶手</h3>
        <div className="culprit-select">
          {allNpcs.map(npc => (
            <div
              key={npc.id}
              className={`culprit-option ${selectedCulprit === npc.id ? 'culprit-selected' : ''}`}
              onClick={() => setSelectedCulprit(npc.id)}
            >
              <img src={npc.portrait} alt={npc.name} className="culprit-portrait" />
              <span className="culprit-name">{npc.name}</span>
              {selectedCulprit === npc.id && <span className="culprit-check">✓</span>}
            </div>
          ))}
        </div>
        <button className="submit-verdict-btn" onClick={submitVerdict} disabled={!selectedCulprit}>
          提交指认 ⚖️
        </button>
      </div>
    </div>
  );

  // 结案
  const renderVerdict = () => {
    const isCorrect = verdictResult !== 'wrong';
    return (
      <div className={`verdict-page ${isCorrect ? 'verdict-correct' : 'verdict-wrong'}`}>
        <div className="verdict-dramatic">
          <div className="verdict-stamp">{isCorrect ? '破案' : '误判'}</div>
        </div>
        <div className="verdict-content">
          {verdictResult === 'perfect' && (
            <>
              <h2>🎯 完美破案！</h2>
              <p>你不仅找到了真凶，还构建了完整的证据链。</p>
            </>
          )}
          {verdictResult === 'correct' && (
            <>
              <h2>✅ 凶手找对了</h2>
              <p>但证据链还不够完整。下次多收集一些线索吧。</p>
            </>
          )}
          {verdictResult === 'wrong' && (
            <>
              <h2>❌ 误判！</h2>
              <p>你指认了无辜的人。真凶：<strong>{worldMap.caseResult.culpritName}</strong></p>
            </>
          )}
          <button className="reveal-truth-btn" onClick={() => setPhase(PHASE.TRUTH)}>
            揭示真相 →
          </button>
        </div>
      </div>
    );
  };

  // 真相
  const renderTruth = () => (
    <div className="truth-page">
      <div className="truth-reveal">
        <h2 className="truth-title">真相还原</h2>
        <div className="truth-portrait-row">
          <div className="truth-victim">
            <img src={worldMap.caseResult.victimPortrait} alt="" />
            <p>{worldMap.caseResult.victimName}</p>
            <span className="truth-label">受害者</span>
          </div>
          <div className="truth-culprit">
            <img src={worldMap.caseResult.culpritPortrait} alt="" />
            <p>{worldMap.caseResult.culpritName}</p>
            <span className="truth-label culprit-label">真凶</span>
          </div>
        </div>
        <div className="truth-text">
          {worldMap.caseResult.truth.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <div className="knowledge-cards">
          <h3 className="knowledge-title">📚 本案涉及的音乐史知识</h3>
          {worldMap.caseResult.knowledge.map((k, i) => (
            <div key={i} className="knowledge-card">
              <h4>{k.title}</h4>
              <p>{k.content}</p>
              <span className="knowledge-source">{k.source}</span>
            </div>
          ))}
        </div>
        <div className="truth-actions">
          <button className="replay-btn" onClick={() => {
            setPhase(PHASE.EXPLORE);
            setCollectedClues([]);
            setInspectedItems(new Set());
            setTalkedNpcs(new Set());
            setNpcRoundsDone({});
            setDialogueHistory({});
            setSelectedCulprit(null);
            setSelectedEvidence([]);
            setVerdictResult(null);
            setGameTime(18);
            setDayPhase('evening');
            setScrollX(0);
          }}>
            🔄 重新调查
          </button>
          <Link href="/music-history" className="back-home-btn">🏠 返回音乐史</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mystery-app">
      {phase === PHASE.INTRO && renderIntro()}
      {(phase === PHASE.EXPLORE) && renderExplore()}
      {phase === PHASE.INTERIOR && renderInterior()}
      {phase === PHASE.EVIDENCE && renderEvidence()}
      {phase === PHASE.VERDICT && renderVerdict()}
      {phase === PHASE.TRUTH && renderTruth()}
      {(phase === PHASE.DIALOGUE) && renderDialogue()}
    </div>
  );
}

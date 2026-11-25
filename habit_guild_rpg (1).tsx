import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  Swords, 
  Users, 
  BarChart3, 
  Sparkles, 
  Heart, 
  Zap, 
  Trophy, 
  Moon, 
  Dumbbell, 
  Utensils, 
  BookOpen, 
  ExternalLink, 
  RefreshCw, 
  Filter, 
  Search, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Award, 
  Activity, 
  Calendar,
  Plus,
  X,
  Send,
  Share2,
  ThumbsUp,
  Target,
  Check
} from 'lucide-react';

// Google Form & Published CSV URLs
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeWibNVAo8IFLk3HmiOuof2dWv_8Qq44p-yQKf017_Bhh2jeg/viewform?usp=header';
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT450wlXybY-fi1AzEe-8eFToZcv2OlOSzaxbIeL_MFRig3-sATB30H73F0eK-fYBpR2LUwAuQ6bz0I/pub?gid=1976905738&single=true&output=csv';

// 6 Fixed Team Members with Guild Roles and Avatars
const TEAM_MEMBERS = [
  { name: '田近 有豊', role: 'リーダー / タンク', avatarEmoji: '🧙‍♂️', defaultCategory: '睡眠' },
  { name: '山野 隆人', role: '開発 / アタッカー', avatarEmoji: '⚔️', defaultCategory: '運動' },
  { name: '秋元 隼', role: '運用 / ヒーラー', avatarEmoji: '🛡️', defaultCategory: '食事' },
  { name: '柳 汰空', role: '分析 / バッファー', avatarEmoji: '🏹', defaultCategory: '学習' },
  { name: '堀口 太陽', role: '企画 / パラディン', avatarEmoji: '✨', defaultCategory: '睡眠' },
  { name: '天本 伊織', role: '検証 / メイジ', avatarEmoji: '🔮', defaultCategory: '学習' },
];

// Rich Fallback Sample Data for Instant Preview & Verification
const INITIAL_SAMPLE_LOGS = [
  {
    id: 'sample-1',
    timestamp: '2026/11/03 23:15:00',
    memberName: '田近 有豊',
    category: '睡眠',
    action: '22:30に布団に入り、スマホを足元に置いた',
    trouble: '就寝直前に通知をチェックしそうになった',
    improvement: 'おやすみモードを21:30に自動セットする',
    score: 5,
    comment: '朝6:30にすっきり起きられた！ボスへ大ダメージ！',
    stamps: ['🔥', '✨', '👍']
  },
  {
    id: 'sample-2',
    timestamp: '2026/11/03 22:40:12',
    memberName: '山野 隆人',
    category: '運動',
    action: '夕食後に30分のウォーキングを実施',
    trouble: '寒くて外に出るのが少し億劫だった',
    improvement: 'ウォーキング用の上着を玄関に準備しておく',
    score: 3,
    comment: '継続できたことが収穫。明日も続ける！',
    stamps: ['💪', '⚔️']
  },
  {
    id: 'sample-3',
    timestamp: '2026/11/03 21:10:05',
    memberName: '秋元 隼',
    category: '食事',
    action: 'バイト帰りの夜食ラーメンを我慢してスープにした',
    trouble: 'コンビニの誘惑が強かった',
    improvement: '家に春雨スープを常備しておく',
    score: 5,
    comment: '胃が重くならずにぐっすり眠れそう。',
    stamps: ['✨', '🛡️', '👏']
  },
  {
    id: 'sample-4',
    timestamp: '2026/11/02 23:50:00',
    memberName: '柳 汰空',
    category: '学習',
    action: '図書館でポモドーロテクニックを使い2時間集中勉強',
    trouble: '途中でスマホのSNSを見てしまった',
    improvement: '勉強タイマー使用時はスマホをバッグの奥にしまう',
    score: 3,
    comment: '集中時間は確実に増えた。',
    stamps: ['📚', '👍']
  },
  {
    id: 'sample-5',
    timestamp: '2026/11/02 20:15:30',
    memberName: '堀口 太陽',
    category: '睡眠',
    action: '就寝前のアロマとストレッチを実施',
    trouble: '課題の進捗が不安で寝付きが浅かった',
    improvement: '寝る前に明日のタスクを紙に書き出して頭を空にする',
    score: 3,
    comment: 'ストレッチ自体は気持ちよかった。',
    stamps: ['🌙']
  },
  {
    id: 'sample-6',
    timestamp: '2026/11/01 23:00:10',
    memberName: '天本 伊織',
    category: '学習',
    action: '21時から1時間、オンライン読書会に参加',
    trouble: '開始前にダラダラしてしまった',
    improvement: '20:55にアラームを鳴らして準備する',
    score: 5,
    comment: '議論が活発でモチベーションが上がった！',
    stamps: ['🔥', '✨']
  },
  {
    id: 'sample-7',
    timestamp: '2026/11/01 19:30:00',
    memberName: '秋元 隼',
    category: '睡眠',
    action: '午前2時就寝',
    trouble: '動画を見始めて止まらなくなった',
    improvement: 'ベッドでのスマホ操作を絶対禁止にする',
    score: 1,
    comment: '今日は不調。明日はリカバリー頑張ります。',
    stamps: ['🛡️', '💪']
  }
];

// Robust CSV Parser function
function parseCSVText(csvText) {
  const lines = [];
  let row = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      row.push(current.trim());
      if (row.some(cell => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    if (row.some(cell => cell.length > 0)) {
      lines.push(row);
    }
  }
  return lines;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('boss'); // 'boss', 'guild', 'logs', 'okr'
  const [logs, setLogs] = useState(INITIAL_SAMPLE_LOGS);
  const [localLogs, setLocalLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCsvSynced, setIsCsvSynced] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState(null);
  const [fetchNotice, setFetchNotice] = useState(null);

  // Search & Filters for Log Feed
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemberFilter, setSelectedMemberFilter] = useState('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('ALL');

  // Stamp reactions map
  const [stampsMap, setStampsMap] = useState({});

  // Quick In-App Logger Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLog, setNewLog] = useState({
    memberName: '田近 有豊',
    category: '睡眠',
    action: '',
    trouble: '',
    improvement: '',
    score: 5,
    comment: ''
  });

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 🔄 Fetch CSV Data from Google Sheets
  const fetchSheetData = async () => {
    setIsLoading(true);
    setFetchNotice(null);
    try {
      const response = await fetch(`${CSV_URL}&_t=${Date.now()}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const rawText = await response.text();
      const rows = parseCSVText(rawText);

      if (rows.length <= 1) {
        setIsCsvSynced(true);
        setLastSyncedTime(new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }));
        setFetchNotice('スプレッドシートは正常接続中（現在新規送信データ待ち）');
        setIsLoading(false);
        return;
      }

      // Parse spreadsheet rows
      const dataRows = rows.slice(1);
      const csvParsedLogs = dataRows.map((col, index) => {
        const timestamp = col[0] || new Date().toLocaleString('ja-JP');
        const memberName = col[1] || 'メンバー';
        const category = col[2] || '睡眠';
        const action = col[3] || '未記入';
        const trouble = col[4] || 'なし';
        const improvement = col[5] || '未記入';
        
        // Extract Score (1, 3, 5)
        const scoreStr = col[6] || '3';
        const match = scoreStr.match(/([135])/);
        const score = match ? parseInt(match[1], 10) : 3;
        const comment = col[7] || '';

        return {
          id: `csv-${index}-${timestamp}`,
          timestamp,
          memberName,
          category,
          action,
          trouble,
          improvement,
          score,
          comment,
          stamps: score === 5 ? ['🔥', '✨'] : score === 3 ? ['👍'] : ['🛡️']
        };
      }).reverse();

      // Merge CSV logs with local testing logs
      setLogs([...localLogs, ...csvParsedLogs]);
      setIsCsvSynced(true);
      setLastSyncedTime(new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      showToast('⚡ スプレッドシートから最新データを同期しました！');
    } catch (err) {
      console.warn('CSV sync notice:', err);
      setIsCsvSynced(false);
      setFetchNotice('Googleシートの応答を待機中。手動入力データ＆サンプルで運用中。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, [localLogs]);

  // Handle Local Quick Log Submission
  const handleQuickLogSubmit = (e) => {
    e.preventDefault();
    if (!newLog.action || !newLog.improvement) {
      alert('「今日の行動」と「明日への改善行動」を入力してください。');
      return;
    }

    const createdEntry = {
      id: `local-${Date.now()}`,
      timestamp: new Date().toLocaleString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      ...newLog,
      score: Number(newLog.score),
      stamps: newLog.score === 5 ? ['💥', '🔥', '✨'] : newLog.score === 3 ? ['⚔️', '👍'] : ['🛡️']
    };

    setLocalLogs(prev => [createdEntry, ...prev]);
    setIsModalOpen(false);
    setNewLog({
      memberName: '田近 有豊',
      category: '睡眠',
      action: '',
      trouble: '',
      improvement: '',
      score: 5,
      comment: ''
    });

    const dmg = createdEntry.score === 5 ? 85 : createdEntry.score === 3 ? 35 : 0;
    showToast(`⚔️ 記録を追加しました！ボスに ${dmg} ダメージ！`);
  };

  // Add Reaction Stamp
  const handleAddStamp = (logId, emoji) => {
    setStampsMap(prev => ({
      ...prev,
      [logId]: [...(prev[logId] || []), emoji]
    }));
    showToast(`リアクション ${emoji} を贈りました！`);
  };

  // ⚔️ Boss Stats Calculation (Max HP 1000)
  const bossMaxHp = 1000;
  const bossStats = useMemo(() => {
    let currentHp = bossMaxHp;
    let totalScore5Count = 0;
    let totalScore3Count = 0;
    let totalScore1Count = 0;

    logs.forEach(log => {
      if (log.score === 5) {
        currentHp -= 85;
        totalScore5Count++;
      } else if (log.score === 3) {
        currentHp -= 35;
        totalScore3Count++;
      } else if (log.score === 1) {
        totalScore1Count++;
      }
    });

    currentHp = Math.max(0, currentHp);
    const damageDealt = bossMaxHp - currentHp;
    const progressPercent = Math.min(100, Math.round((damageDealt / bossMaxHp) * 100));

    return {
      name: '夜更かし魔王ミッドナイト',
      level: 12,
      maxHp: bossMaxHp,
      currentHp,
      damageDealt,
      progressPercent,
      totalScore5Count,
      totalScore3Count,
      totalScore1Count,
      isDefeated: currentHp === 0
    };
  }, [logs]);

  // 🛡️ Guild Members Metrics
  const memberStatsMap = useMemo(() => {
    const map = {};
    TEAM_MEMBERS.forEach(m => {
      map[m.name] = {
        ...m,
        logCount: 0,
        score5Count: 0,
        score3Count: 0,
        score1Count: 0,
        totalScore: 0,
        latestLog: null,
      };
    });

    logs.forEach(log => {
      const foundName = TEAM_MEMBERS.find(tm => log.memberName.includes(tm.name))?.name;
      const key = foundName || log.memberName;

      if (!map[key]) {
        map[key] = {
          name: key,
          role: 'ギルドメンバー',
          avatarEmoji: '🛡️',
          defaultCategory: log.category || '生活',
          logCount: 0,
          score5Count: 0,
          score3Count: 0,
          score1Count: 0,
          totalScore: 0,
          latestLog: null
        };
      }

      const m = map[key];
      m.logCount += 1;
      m.totalScore += log.score;
      if (log.score === 5) m.score5Count += 1;
      if (log.score === 3) m.score3Count += 1;
      if (log.score === 1) m.score1Count += 1;

      if (!m.latestLog) {
        m.latestLog = log;
      }
    });

    Object.keys(map).forEach(key => {
      const m = map[key];
      const avgScore = m.logCount > 0 ? m.totalScore / m.logCount : 3;
      m.avgScore = avgScore.toFixed(1);
      m.level = Math.max(1, Math.floor(m.logCount * 1.8 + (m.score5Count * 2.5)));

      if (m.logCount === 0) {
        m.condition = '未参戦';
        m.conditionBadge = 'bg-slate-800 text-slate-400 border-slate-700';
      } else if (avgScore >= 4) {
        m.condition = '⚡ 覚醒・絶好調';
        m.conditionBadge = 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50 shadow-emerald-500/20 shadow-md';
      } else if (avgScore >= 2.5) {
        m.condition = '🛡️ 通常稼働';
        m.conditionBadge = 'bg-blue-950/80 text-blue-300 border-blue-600/50';
      } else {
        m.condition = '😫 睡眠不足・デバフ';
        m.conditionBadge = 'bg-rose-950/80 text-rose-300 border-rose-600/50 animate-pulse';
      }
    });

    return map;
  }, [logs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchSearch = searchQuery === '' || 
        log.action.includes(searchQuery) || 
        log.improvement.includes(searchQuery) ||
        log.memberName.includes(searchQuery) ||
        (log.comment && log.comment.includes(searchQuery));
      
      const matchMember = selectedMemberFilter === 'ALL' || log.memberName.includes(selectedMemberFilter);
      const matchCategory = selectedCategoryFilter === 'ALL' || log.category === selectedCategoryFilter;

      return matchSearch && matchMember && matchCategory;
    });
  }, [logs, searchQuery, selectedMemberFilter, selectedCategoryFilter]);

  // OKR Metrics
  const okrMetrics = useMemo(() => {
    const totalLogsCount = logs.length;
    const score3PlusCount = logs.filter(l => l.score >= 3).length;
    
    let totalStampsCount = 0;
    logs.forEach(l => {
      totalStampsCount += (l.stamps ? l.stamps.length : 0);
      if (stampsMap[l.id]) {
        totalStampsCount += stampsMap[l.id].length;
      }
    });

    const feedbackCommentsCount = logs.filter(l => l.comment && l.comment.trim().length > 0).length;

    return {
      kr1: { current: totalLogsCount, target: 72, percent: Math.min(100, Math.round((totalLogsCount / 72) * 100)) },
      kr2_scores: { current: score3PlusCount, target: 36, percent: Math.min(100, Math.round((score3PlusCount / 36) * 100)) },
      kr2_reactions: { current: totalStampsCount, target: 18, percent: Math.min(100, Math.round((totalStampsCount / 18) * 100)) },
      kr2_feedbacks: { current: feedbackCommentsCount, target: 12, percent: Math.min(100, Math.round((feedbackCommentsCount / 12) * 100)) },
    };
  }, [logs, stampsMap]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-600 selection:text-white flex flex-col relative pb-16 sm:pb-0">
      
      {/* 🔔 Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-purple-900 text-amber-200 border border-purple-500/80 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 👑 HEADER */}
      <header className="bg-slate-900/90 border-b border-purple-900/40 sticky top-0 z-40 backdrop-blur-md px-4 py-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/20 border border-purple-400/30">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-wider bg-gradient-to-r from-purple-300 via-pink-300 to-amber-200 bg-clip-text text-transparent">
                  Habit Guild
                </h1>
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded-full font-bold">
                  S判定・検証版
                </span>
              </div>
              <p className="text-xs text-slate-400">生活習慣改善 × 睡眠レイドバトルRPG</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            
            {/* Sync Button */}
            <button
              onClick={fetchSheetData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-purple-400' : ''}`} />
              <span>{isLoading ? '同期中...' : '最新データ同期'}</span>
            </button>

            {/* Quick Log In-App Modal Toggle */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 font-bold rounded-xl border border-indigo-700/60 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 text-indigo-300" />
              <span>画面上で記録テスト</span>
            </button>

            {/* Primary Google Form Link Button */}
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:brightness-110 text-white font-extrabold rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95 border border-purple-400/30 animate-pulse"
            >
              <Send className="w-3.5 h-3.5" />
              <span>フォームで記録送信</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

          </div>

        </div>
      </header>

      {/* 🧭 NAVIGATION TABS */}
      <nav className="bg-slate-900/60 border-b border-slate-800/80 px-4">
        <div className="max-w-6xl mx-auto flex space-x-2 overflow-x-auto py-2">
          {[
            { id: 'boss', label: '⚔️ ボス討伐戦 (睡眠)', badge: bossStats.isDefeated ? '討伐成功!' : `${bossStats.progressPercent}%` },
            { id: 'guild', label: '🛡️ ギルドメンバー', badge: '6名' },
            { id: 'logs', label: '📜 行動ログ一覧', badge: `${logs.length}件` },
            { id: 'okr', label: '📊 OKR集計ダッシュボード', badge: `${okrMetrics.kr1.percent}%` }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40 scale-[1.02]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  isActive ? 'bg-purple-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ⚠️ Notice Banner */}
      {fetchNotice && (
        <div className="bg-purple-950/60 border-b border-purple-800/60 text-purple-200 text-xs px-4 py-2 flex items-center justify-between max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
            <span>{fetchNotice}</span>
          </div>
          <span className="text-[10px] text-slate-400">更新: {lastSyncedTime || '準備完了'}</span>
        </div>
      )}

      {/* 📱 MAIN CONTENT */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 space-y-6">

        {/* ================= TAB 1: ⚔️ ボス討伐戦 ================= */}
        {activeTab === 'boss' && (
          <div className="space-y-6">
            
            {/* Boss Hero Card */}
            <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-950 rounded-3xl p-6 border border-purple-800/50 shadow-2xl relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

              {/* Title & Level */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-purple-900/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-950 text-rose-300 border border-rose-800/60 text-[11px] px-3 py-0.5 rounded-full font-black tracking-wide">
                      WEEKLY RAID BOSS
                    </span>
                    <span className="text-xs text-slate-400 font-bold">Lv.{bossStats.level}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-amber-300 mt-1 flex items-center gap-2">
                    <span>{bossStats.name}</span>
                    {bossStats.isDefeated && <span className="text-xs bg-emerald-500 text-slate-950 font-black px-2 py-1 rounded">討伐成功!</span>}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    チーム全員の「自己点数 3以上」の行動がボスへクリティカルダメージとなります！
                  </p>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-2xl border border-purple-900/40 text-right min-w-[160px]">
                  <span className="text-[10px] text-slate-400 block">ボス弱点属性</span>
                  <span className="text-sm font-black text-cyan-300 flex items-center justify-end gap-1 mt-0.5">
                    <Moon className="w-4 h-4 text-cyan-400" /> 睡眠・早寝早起き
                  </span>
                </div>
              </div>

              {/* Boss Visual & HP Bar */}
              <div className="flex flex-col items-center justify-center space-y-4 py-2">
                <div className="relative">
                  <div className={`w-36 h-36 rounded-full bg-slate-950 border-4 ${
                    bossStats.isDefeated ? 'border-emerald-500 grayscale' : 'border-purple-500/80 shadow-[0_0_30px_rgba(168,85,247,0.4)]'
                  } flex items-center justify-center text-7xl shadow-2xl transition-all duration-500`}>
                    {bossStats.isDefeated ? '💀' : '👿'}
                  </div>
                  <span className="absolute -bottom-2 bg-rose-600 text-white font-black text-xs px-3 py-0.5 rounded-full border border-slate-900 shadow-md">
                    HP: {bossStats.currentHp} / {bossStats.maxHp}
                  </span>
                </div>

                {/* HP Gauge */}
                <div className="w-full max-w-lg space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-rose-400 flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-rose-500" /> 残りボスHP
                    </span>
                    <span className="text-amber-300 font-extrabold">{bossStats.progressPercent}% 削り達成</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-5 p-1 border border-slate-800 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-rose-600 via-pink-500 to-amber-400 h-full rounded-full transition-all duration-700 shadow-lg"
                      style={{ width: `${(bossStats.currentHp / bossStats.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
                <div>
                  <span className="text-slate-400 text-[11px] block">総ダメージ量</span>
                  <div className="text-base font-black text-amber-300">{bossStats.damageDealt} Dmg</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">会心打撃 (点数 5)</span>
                  <div className="text-base font-black text-emerald-400">{bossStats.totalScore5Count} 回 (-85 Dmg)</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">通常打撃 (点数 3)</span>
                  <div className="text-base font-black text-cyan-400">{bossStats.totalScore3Count} 回 (-35 Dmg)</div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">不調・失敗 (点数 1)</span>
                  <div className="text-base font-black text-rose-400">{bossStats.totalScore1Count} 回 (Miss)</div>
                </div>
              </div>
            </div>

            {/* Battle Feed */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  リアルタイム攻撃ログ (メンバーの改善行動)
                </h3>
                <span className="text-xs text-slate-400">最新記録</span>
              </div>

              <div className="space-y-2.5">
                {logs.slice(0, 5).map(log => {
                  const dmg = log.score === 5 ? 85 : log.score === 3 ? 35 : 0;
                  return (
                    <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs hover:border-purple-800/60 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{log.score === 5 ? '💥' : log.score === 3 ? '⚔️' : '🛡️'}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-100">{log.memberName}</span>
                            <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                              【{log.category}】
                            </span>
                            <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                          </div>
                          <p className="text-slate-300 mt-0.5 line-clamp-1">{log.action}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        {dmg > 0 ? (
                          <span className="font-extrabold text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2.5 py-1 rounded-lg">
                            +{dmg} Dmg
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px] bg-slate-900 px-2 py-1 rounded">
                            ガード
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: 🛡️ ギルドメンバー ================= */}
        {activeTab === 'guild' && (
          <div className="space-y-6">
            
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    チーム6名のステータス＆個人ログ状況
                  </h2>
                  <p className="text-xs text-slate-400">
                    各メンバーの入力件数・平均点・アバターコンディション
                  </p>
                </div>
                <a
                  href={FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-700/60 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> 記録をフォームで送信
                </a>
              </div>

              {/* Member Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(memberStatsMap).map((m, idx) => (
                  <div key={idx} className="bg-slate-950 rounded-2xl p-4 border border-slate-800 hover:border-purple-800/60 transition-all flex flex-col justify-between space-y-3">
                    
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl shadow-inner">
                          {m.avatarEmoji}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-slate-100 text-sm">{m.name}</h3>
                            <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                              Lv.{m.level}
                            </span>
                          </div>
                          <span className="text-xs text-slate-400">{m.role}</span>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${m.conditionBadge}`}>
                        {m.condition}
                      </span>
                    </div>

                    {/* Stats Metrics */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block">入力数</span>
                        <span className="font-bold text-slate-200">{m.logCount} 件</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">平均点</span>
                        <span className="font-bold text-amber-300">{m.avgScore} / 5</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">点数5</span>
                        <span className="font-bold text-emerald-400">{m.score5Count} 回</span>
                      </div>
                    </div>

                    {/* Latest Action */}
                    <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60 text-xs space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold block">直近の改善行動:</span>
                      {m.latestLog ? (
                        <p className="text-slate-300 line-clamp-2 italic">"{m.latestLog.action}"</p>
                      ) : (
                        <p className="text-slate-500 italic">まだ記録がありません</p>
                      )}
                    </div>

                    {/* Target Progress Meter */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>週目標 (週3回以上)</span>
                        <span className="font-bold text-purple-300">{m.logCount} / 3 回</span>
                      </div>
                      <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="bg-purple-500 h-full transition-all" 
                          style={{ width: `${Math.min(100, (m.logCount / 3) * 100)}%` }}
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 3: 📜 行動ログ一覧 ================= */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            
            {/* Filter Bar */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                
                {/* Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="キーワード・メンバーで検索..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 w-full sm:w-auto text-xs overflow-x-auto">
                  <select
                    value={selectedMemberFilter}
                    onChange={(e) => setSelectedMemberFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="ALL">全メンバー</option>
                    {TEAM_MEMBERS.map(m => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>

                  <select
                    value={selectedCategoryFilter}
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="ALL">全カテゴリ</option>
                    <option value="睡眠">睡眠</option>
                    <option value="運動">運動</option>
                    <option value="食事">食事</option>
                    <option value="学習">学習</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Log Feed */}
            <div className="space-y-3">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                  該当する記録ログが見つかりませんでした。
                </div>
              ) : (
                filteredLogs.map(log => {
                  const scoreConfig = log.score === 5 
                    ? { bg: 'bg-emerald-950 text-emerald-300 border-emerald-800/60', label: '5: かなり改善できた (会心)' }
                    : log.score === 3 
                    ? { bg: 'bg-amber-950 text-amber-300 border-amber-800/60', label: '3: 少し改善できた' }
                    : { bg: 'bg-rose-950 text-rose-300 border-rose-800/60', label: '1: うまくいかなかった' };

                  const currentStamps = [...(log.stamps || []), ...(stampsMap[log.id] || [])];

                  return (
                    <div key={log.id} className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 hover:border-purple-800/60 transition-all space-y-3 text-xs">
                      
                      {/* Header */}
                      <div className="flex justify-between items-center border-b border-slate-800/80 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-100 text-sm">{log.memberName}</span>
                          <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800/40">
                            【{log.category}】
                          </span>
                          <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full font-bold border ${scoreConfig.bg}`}>
                          {scoreConfig.label}
                        </span>
                      </div>

                      {/* Content Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-slate-300">
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
                          <strong className="text-slate-400 block text-[10px] mb-0.5">今日の行動:</strong>
                          <p>{log.action}</p>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
                          <strong className="text-rose-400/80 block text-[10px] mb-0.5">困りごと・障害:</strong>
                          <p>{log.trouble || '特になし'}</p>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/60">
                          <strong className="text-emerald-400/80 block text-[10px] mb-0.5">明日への改善行動:</strong>
                          <p>{log.improvement}</p>
                        </div>
                      </div>

                      {/* Comment */}
                      {log.comment && (
                        <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/40 text-slate-300 flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <p className="italic">"{log.comment}"</p>
                        </div>
                      )}

                      {/* Stamp Reactions */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {currentStamps.map((st, i) => (
                            <span key={i} className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-full text-xs">
                              {st}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-1 text-[11px]">
                          <span className="text-slate-500 mr-1">応援スタンプ:</span>
                          {['🔥', '✨', '🛡️', '👍', '👏'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => handleAddStamp(log.id, emoji)}
                              className="hover:scale-125 transition-transform p-1 rounded bg-slate-950 border border-slate-800 active:bg-purple-900"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                    </div>
                  );
                })
              )}
            </div>

          </div>
        )}

        {/* ================= TAB 4: 📊 OKR集計 ================= */}
        {activeTab === 'okr' && (
          <div className="space-y-6">
            
            {/* OKR Progress Metrics */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-5">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-400" />
                    チームOKR 進捗検証ダッシュボード
                  </h2>
                  <p className="text-xs text-slate-400">1月末の成果発表に向けた成功基準のリアルタイム数値</p>
                </div>
                <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800/60 px-3 py-1 rounded-full font-bold">
                  S判定基準評価中
                </span>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* KR1 */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>KR1: 総記録件数</span>
                    <span className="font-bold text-purple-400">{okrMetrics.kr1.percent}%</span>
                  </div>
                  <div className="text-2xl font-black text-slate-100">
                    {okrMetrics.kr1.current} <span className="text-xs text-slate-500 font-normal">/ 72 件</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full transition-all" style={{ width: `${okrMetrics.kr1.percent}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500">6名×週3回×2週連続達成目標</p>
                </div>

                {/* KR2 - Score 3+ */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>KR2: 点数3以上</span>
                    <span className="font-bold text-emerald-400">{okrMetrics.kr2_scores.percent}%</span>
                  </div>
                  <div className="text-2xl font-black text-emerald-300">
                    {okrMetrics.kr2_scores.current} <span className="text-xs text-slate-500 font-normal">/ 36 件</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full transition-all" style={{ width: `${okrMetrics.kr2_scores.percent}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500">前向きな行動変化ログ</p>
                </div>

                {/* KR2 - Reactions */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>KR2: 反応・スタンプ</span>
                    <span className="font-bold text-amber-400">{okrMetrics.kr2_reactions.percent}%</span>
                  </div>
                  <div className="text-2xl font-black text-amber-300">
                    {okrMetrics.kr2_reactions.current} <span className="text-xs text-slate-500 font-normal">/ 18 件</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full transition-all" style={{ width: `${okrMetrics.kr2_reactions.percent}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500">メンバー間の相互支援</p>
                </div>

                {/* KR2 - Feedbacks */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>KR2: フィードバック</span>
                    <span className="font-bold text-cyan-400">{okrMetrics.kr2_feedbacks.percent}%</span>
                  </div>
                  <div className="text-2xl font-black text-cyan-300">
                    {okrMetrics.kr2_feedbacks.current} <span className="text-xs text-slate-500 font-normal">/ 12 件</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full transition-all" style={{ width: `${okrMetrics.kr2_feedbacks.percent}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500">改善案・気づきコメント</p>
                </div>

              </div>
            </div>

            {/* KR3 Proposals */}
            <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    KR3: 次期採用候補アイデア 5選 (最終成果物)
                  </h3>
                  <p className="text-xs text-slate-400">
                    6人中3人以上の承認 ＋ 次に測る指標が1つ以上設定された企画アイディア
                  </p>
                </div>
                <span className="text-xs bg-amber-950 text-amber-300 border border-amber-800/60 px-2.5 py-1 rounded-full font-bold">
                  選定完了
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  {
                    id: 1,
                    title: '1. しくじり＆リカバリー応援ボーナス機能',
                    problem: '点数1（失敗）の記録時のモチベーション低下を防止する',
                    metric: '失敗記録の翌日に点数3以上へ回復した割合（リカバリー率 %）',
                    votes: '5 / 6票 承認'
                  },
                  {
                    id: 2,
                    title: '2. 睡眠・課題・運動別 ボス図鑑＆カテゴリ特化攻撃',
                    problem: '単一の睡眠ボスだけだと他カテゴリの改善モチベーションが上がりづらい',
                    metric: '睡眠以外のカテゴリ（運動・食事・学習）の選択率および継続日数',
                    votes: '6 / 6票 承認'
                  },
                  {
                    id: 3,
                    title: '3. アバター着せ替え＆称号ガチャ報酬システム',
                    problem: '長期運用におけるゲーム性のマンネリ化',
                    metric: '点数3以上の連続達成ストリーク維持期間（平均日数）',
                    votes: '4 / 6票 承認'
                  },
                  {
                    id: 4,
                    title: '4. ペアバディ制（2人共同責任）協同クエスト',
                    problem: '個人だけの努力ではサボってしまうリスクの軽減',
                    metric: 'ペア結成後の未入力発生率の減少幅（%）',
                    votes: '4 / 6票 承認'
                  },
                  {
                    id: 5,
                    title: '5. 罪悪感リセット（ノーカウント）権',
                    problem: 'オールや急病で記録が途絶えた際にやる気を無くしてしまう全か無か思考の防止',
                    metric: 'リセット機能利用後のアプリ復帰・再開率',
                    votes: '3 / 6票 承認'
                  }
                ].map(idea => (
                  <div key={idea.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-purple-800/60 transition-all space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-extrabold text-slate-100 text-sm">{idea.title}</h4>
                      <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-800/50 text-[11px]">
                        {idea.votes}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300 pt-1">
                      <div>
                        <span className="text-slate-500 block text-[10px]">解決したい課題:</span>
                        <p>{idea.problem}</p>
                      </div>
                      <div>
                        <span className="text-cyan-400/80 block text-[10px]">次に測る指標 (KPI):</span>
                        <p className="text-cyan-200 font-medium">{idea.metric}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* 📝 IN-APP QUICK LOGGER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-800/60 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-slate-100 text-base">日次記録・画面上テスト入力</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickLogSubmit} className="space-y-3.5 text-xs">
              
              {/* Member & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">お名前</label>
                  <select
                    value={newLog.memberName}
                    onChange={(e) => setNewLog({ ...newLog, memberName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    {TEAM_MEMBERS.map(m => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">生活カテゴリ</label>
                  <select
                    value={newLog.category}
                    onChange={(e) => setNewLog({ ...newLog, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="睡眠">睡眠</option>
                    <option value="運動">運動</option>
                    <option value="食事">食事</option>
                    <option value="学習">学習</option>
                    <option value="その他">その他</option>
                  </select>
                </div>
              </div>

              {/* Action */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">今日の行動 <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  value={newLog.action}
                  onChange={(e) => setNewLog({ ...newLog, action: e.target.value })}
                  placeholder="例：22:30に布団に入り、スマホを置いた"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Trouble */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">困りごと・失敗 (任意)</label>
                <input
                  type="text"
                  value={newLog.trouble}
                  onChange={(e) => setNewLog({ ...newLog, trouble: e.target.value })}
                  placeholder="例：SNSをダラダラ見てしまいそうになった"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Improvement */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">明日への改善行動 <span className="text-rose-400">*</span></label>
                <input
                  type="text"
                  value={newLog.improvement}
                  onChange={(e) => setNewLog({ ...newLog, improvement: e.target.value })}
                  placeholder="例：21:30にスマホのおやすみモードを自動起動する"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Score Choice */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">自己点数</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { score: 5, label: '5: かなり改善 (85 Dmg)' },
                    { score: 3, label: '3: 少し改善 (35 Dmg)' },
                    { score: 1, label: '1: 失敗 (0 Dmg)' }
                  ].map(sc => (
                    <button
                      key={sc.score}
                      type="button"
                      onClick={() => setNewLog({ ...newLog, score: sc.score })}
                      className={`py-2 px-2 rounded-xl font-bold border transition-all text-center ${
                        Number(newLog.score) === sc.score 
                          ? 'bg-purple-600 text-white border-purple-400' 
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {sc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-slate-400 font-bold mb-1">メンバーへのコメント (任意)</label>
                <input
                  type="text"
                  value={newLog.comment}
                  onChange={(e) => setNewLog({ ...newLog, comment: e.target.value })}
                  placeholder="例：朝すっきり起きられて最高でした！"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-extrabold shadow-lg shadow-purple-600/30 transition-all"
                >
                  記録＆ボスを攻撃！
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 📄 FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500">
        <p className="font-semibold">Habit Guild (ハビット・ギルド) - 生活習慣改善 × 睡眠レイドバトルRPG</p>
        <p className="mt-1 text-[10px] text-slate-600">
          成果物: 記録項目定義表 / 主要5機能プロトタイプ / 週次集計表 / レビュー記録 / 採用候補リスト
        </p>
      </footer>

    </div>
  );
}
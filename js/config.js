import { SUPABASE_URL, SUPABASE_KEY } from '../config.js';

const STORAGE_KEY = 'RUILI_SYSTEM_CASES_2026';

// 1. 從 Supabase 抓取資料並【強制刷新畫面】
window.fetchFromSupabase = async function() {
  try {
    console.log('🔄 開始從 Supabase 拉取最新案件資料...');
    const response = await fetch(`${SUPABASE_URL}/rest/v1/cases?select=*`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    const remoteData = await response.json();
    console.log('📦 Supabase 回傳原始資料：', remoteData);

    if (Array.isArray(remoteData) && remoteData.length > 0) {
      // 優先讀取 JSON 物件 (data)，若無則解析欄位
      const parsedCases = remoteData.map(row => {
        if (row.data && typeof row.data === 'object') {
          return row.data;
        }
        return {
          id: String(row.id),
          clientName: row.client_name || '未命名客戶',
          status: row.status || '簽約案件',
          workProgress: row.work_progress || '已簽約',
          contractAmount: Number(row.contract_amount) || 0,

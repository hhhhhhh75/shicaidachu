/**
 * 食材大厨 - 全局配置
 */
const CONFIG = {
    // ===== AI API 配置 =====
    // V1.0 使用浏览器端 fetch 直接调用 —— 开发/演示模式用 mock 数据
    // 接入真实 API 时，建议通过后端代理（Vercel Serverless）调用，避免 API Key 暴露
    AI: {
        mock: false,               // false=使用真实AI
        provider: 'deepseek',
        endpoint: 'https://api.deepseek.com/chat/completions',
        apiKey: '',               // ⚠️ 填你的 DeepSeek API Key（sk-xxx）
        model: 'deepseek-chat',
        maxTokens: 1500,
        temperature: 0.8,
    },

    // ===== 后端 API 配置 =====
    // V1.0 先用 localStorage 模拟后端；接入真实后端时改 baseURL
    API: {
        baseURL: '',              // 如 'https://your-app.vercel.app/api'
        mockBackend: true,        // true=使用 localStorage 模拟后端
    },

    // ===== 试用配置 =====
    TRIAL: {
        days: 7,                  // 免费试用天数
    },

    // ===== 套餐配置 =====
    PLANS: [
        { id: 'plan_5', name: '5次包', type: 'count', value: 5, price: 2 },
        { id: 'plan_10', name: '10次包', type: 'count', value: 10, price: 3 },
        { id: 'plan_20', name: '20次包', type: 'count', value: 20, price: 5 },
        { id: 'plan_week', name: '包星期', type: 'time', value: 7, price: 6 },
        { id: 'plan_month', name: '包月', type: 'time', value: 30, price: 12 },
    ],

    // ===== 存储 Key =====
    STORAGE_KEYS: {
        user: 'scdc_user',
        token: 'scdc_token',
        trial: 'scdc_trial_end',
        plan: 'scdc_plan',
        usage: 'scdc_usage',
    },
};
/**
 * 食材大厨 - 绘本风手绘插图库
 * 所有插图均为纯 SVG 手绘线条风格，无 AI emoji 感
 */

const ILLUSTRATIONS = {

    // 菜品图标映射（用于菜谱卡片和详情）
    dishIcons: {
        '番茄炒蛋': '🍅',
        '西红柿炒鸡蛋': '🍅',
        '蛋炒饭': '🍚',
        '青椒肉丝': '🫑',
        '麻婆豆腐': '🧈',
        '土豆炖牛肉': '🥔',
        '宫保鸡丁': '🥜',
        '清炒时蔬': '🥬',
        '鸡蛋羹': '🥚',
        '番茄鸡蛋面': '🍜',
        '洋葱炒蛋': '🧅',
        '蒜蓉生菜': '🥬',
        '红烧肉': '🍖',
        '糖醋排骨': '🍖',
        '鱼香肉丝': '🥕',
        '回锅肉': '🥩',
        '可乐鸡翅': '🍗',
        '默认': '🍳',
    },

    getDishIcon(name) {
        for (const [key, icon] of Object.entries(this.dishIcons)) {
            if (name.includes(key) || key.includes(name)) return icon;
        }
        return this.dishIcons['默认'];
    },

    // 食材手绘 SVG（用于快捷标签背景等场景）
    ingredientIllustrations: {
        '鸡蛋': `<svg width="20" height="20" viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="7" ry="9" fill="#FFF9C4" stroke="#D4A017" stroke-width="1.5"/></svg>`,
        '番茄': `<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="#FFCDD2" stroke="#D84315" stroke-width="1.5"/></svg>`,
        '土豆': `<svg width="20" height="20" viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="7" ry="5.5" fill="#E8D5B7" stroke="#A08060" stroke-width="1.5"/></svg>`,
        '鸡胸肉': `<svg width="20" height="20" viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="7" ry="5" fill="#FFCCBC" stroke="#D4836A" stroke-width="1.5"/></svg>`,
        '洋葱': `<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="7" fill="#E8D5B7" stroke="#A08060" stroke-width="1.5"/></svg>`,
        '青椒': `<svg width="20" height="20" viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="6" ry="7" fill="#DCEDC8" stroke="#7CB342" stroke-width="1.5"/></svg>`,
        '豆腐': `<svg width="20" height="20" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="3" fill="#FFFDE7" stroke="#CDC090" stroke-width="1.5"/></svg>`,
        '面条': `<svg width="20" height="20" viewBox="0 0 20 20"><ellipse cx="10" cy="10" rx="8" ry="6" fill="#FFF9C4" stroke="#D4A017" stroke-width="1.5"/></svg>`,
    },

    // 页面底部装饰：一排绘本风食物小插图
    footerDecor() {
        return `
      <div style="display:flex;justify-content:center;gap:6px;opacity:0.25;margin-top:8px;">
        <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#E88B6E" stroke-width="2"/><path d="M7 10c1 3 3 5 5 5s4-2 5-5" fill="none" stroke="#E88B6E" stroke-width="1.5" stroke-linecap="round"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="8" ry="10" fill="none" stroke="#E88B6E" stroke-width="2"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" fill="none" stroke="#E88B6E" stroke-width="2"/><line x1="12" y1="4" x2="12" y2="8" stroke="#E88B6E" stroke-width="1.5"/></svg>
        <svg width="24" height="24" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#E88B6E" stroke-width="2" stroke-dasharray="4 2"/></svg>
      </div>
    `;
    },
};
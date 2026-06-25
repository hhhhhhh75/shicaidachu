/**
 * 食材大厨 - 社交分享模块
 */
const Share = {
    generateText(menus) {
        const tn = (menus.today || []).map(d => d.name).join('、') || '正在考虑中';
        const wc = (menus.wish || []).length;
        return '🍳 食材大厨帮我安排了今晚的菜单：' + tn +
            '\n📋 待吃橱窗里还有 ' + wc + ' 道想吃的菜' +
            '\n👉 你也来试试！告诉大厨你有什么食材，马上帮你安排！';
    },

    generatePreviewHTML(menus) {
        const td = (menus.today || []).slice(0, 4);
        let html = '<div style="background:#FFF8E7;border-radius:16px;padding:20px;text-align:center;">';
        html += '<h3 style="color:#E0883A;margin-bottom:12px;">🍳 食材大厨 · 我的菜单</h3>';
        if (td.length === 0) {
            html += '<span style="color:#A1887F;">今天吃什么好呢...</span>';
        } else {
            td.forEach(function (d) {
                html += '<span style="background:#FFE4C4;padding:6px 14px;border-radius:20px;font-size:14px;display:inline-block;margin:4px;color:#5D4037;">'
                    + d.icon + ' ' + d.name + '</span>';
            });
        }
        html += '<p style="margin-top:12px;font-size:12px;color:#A1887F;">扫码试试食材大厨 →</p></div>';
        return html;
    },

    copyText(text) {
        if (navigator.clipboard) return navigator.clipboard.writeText(text);
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        return Promise.resolve();
    },
};
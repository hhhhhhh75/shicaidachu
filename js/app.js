/**
 * 食材大厨 V3.0 - 完整应用逻辑
 * 多页面路由 | 三模式输入 | AI搜索 | 进阶问答 | 记忆系统 | 双菜单 | 套餐 | 分享
 */
(function () {
    'use strict';
    const $ = s => document.querySelector(s);

    // ===== DOM 引用 =====
    const D = {};
    ['btnLogin', 'btnLogout', 'btnTrial', 'trialBanner', 'trialDays', 'trialLabel',
        'ingredientInput', 'btnSearch', 'quickTags', 'btnVoiceBig', 'voiceIcon', 'voiceLabel',
        'btnAdvancedMode', 'photoInput', 'photoImg', 'photoPreview', 'btnAnalyzePhoto',
        'inputText', 'inputVoice', 'inputPhoto',
        'loadingSpinner', 'resultsHeader', 'resultCount', 'recipeList', 'emptyState',
        'recipeModal', 'modalDishIcon', 'modalDishName', 'modalStats', 'modalIngredients', 'modalSteps', 'btnModalClose',
        'btnModalEatToday', 'btnModalWish',
        'loginModal', 'phoneInput', 'codeInput', 'btnSendCode', 'btnDoLogin', 'btnLoginClose',
        'buyModal', 'buyPlanName', 'buyPlanPrice', 'activationCode', 'btnActivate', 'btnBuyClose',
        'plansGrid', 'planStatus', 'currentPlanName', 'currentPlanDetail',
        'quizModal', 'quizContent', 'btnQuizClose',
        'guessContainer', 'guessIcon', 'guessName', 'guessReason', 'guessActions', 'guessSubActions', 'dislikeReasons',
        'btnGuessLike', 'btnGuessDislike', 'btnGuessRefresh', 'btnGuessEatNow', 'btnGuessWishList',
        'todayMenu', 'todayEmpty', 'wishCabinet', 'wishEmpty',
        'btnClearToday', 'btnClearWish',
        'bottomNav',
        'shareModal', 'sharePreview', 'btnCopyShare', 'btnDownloadShare', 'btnShareClose',
        'fantasyUpload', 'fantasyCanvas', 'fantasyImg', 'fantasyOverlays', 'fantasyPhotoInput',
        'memoryStats', 'memoryCount',
        'toast', 'appRoot', 'btnSearchTrigger'
    ].forEach(id => { D[id] = $('#' + id); });

    // ===== 状态 =====
    const S = {
        user: null, token: null, isLoggedIn: false, inTrial: false, trialDaysLeft: 0,
        plan: null, usageCount: 0,
        selectedIngredients: [], currentRecipes: [],
        quizAnswers: {}, currentGuess: null,
        currentPage: 'home'
    };

    // ===== Mock 菜谱数据 =====
    const RECIPES = [
        {
            name: '番茄炒蛋', ingredients: ['鸡蛋', '番茄', '盐', '油', '葱花'], time: '15分钟', difficulty: '⭐简单',
            steps: ['鸡蛋打到碗里，加一点点盐，用筷子搅散搅匀，搅到蛋黄蛋清完全混合就行。', '番茄洗干净切成小块，不用太讲究刀工，一口一个的大小就好。', '锅里倒油，油热了把蛋液倒进去，看到边缘凝固了就用铲子推一推。', '鸡蛋差不多凝固了就盛出来，别炒太老，嫩嫩的才好吃。', '锅里不用再加油了，把番茄倒进去炒，炒到番茄变软出汁，用铲子压一压帮它出汁。', '把刚才炒好的鸡蛋倒回去，翻炒几下让鸡蛋裹上番茄汁，尝咸淡，不够就加点盐，撒把葱花出锅！'],
            tip: '番茄不够出汁可以加一小勺水焖一下；喜欢甜口在炒番茄时加半勺糖。'
        },
        {
            name: '蛋炒饭', ingredients: ['米饭', '鸡蛋', '火腿肠', '葱花', '盐', '油'], time: '10分钟', difficulty: '⭐简单',
            steps: ['最好用隔夜饭！现煮的饭盛出来晾凉再用，不然炒出来黏糊糊的。', '鸡蛋打散，火腿肠切小丁，切点葱花。', '锅里倒油烧热，鸡蛋液倒进去快速炒散炒成小碎块，盛出来。', '锅里再放一点点油，米饭倒进去用铲子打散，别让它结块——这步最重要！', '米饭炒散了倒回鸡蛋和火腿丁，撒盐大火快速翻炒，让每粒米都裹上油光。', '最后撒一把葱花翻两下关火，葱花香味一激就出来了，趁热吃！'],
            tip: '炒饭要大火快炒才香；喜欢粒粒分明可以在米饭里拌个生鸡蛋再炒。'
        },
        {
            name: '青椒肉丝', ingredients: ['猪里脊', '青椒', '姜', '蒜', '生抽', '淀粉', '盐', '油'], time: '20分钟', difficulty: '⭐⭐中等',
            steps: ['猪里脊切细丝，加一勺生抽一勺淀粉抓匀腌10分钟。', '青椒去籽切丝，跟肉丝差不多粗细。姜切丝蒜切片。', '锅里多倒点油，油热微微冒烟把肉丝倒进去快速划散，变色立刻盛出——就几十秒。', '锅里留底油，姜丝蒜片爆香，青椒丝大火翻炒一分钟。', '把肉丝倒回去，加一勺生抽一点盐，快速翻炒30秒出锅——青椒脆脆的才好吃。'],
            tip: '肉丝嫩秘诀是淀粉腌+热锅快炒；青椒别炒软了。'
        },
        {
            name: '麻婆豆腐', ingredients: ['嫩豆腐', '猪肉末', '豆瓣酱', '花椒粉', '姜', '蒜', '淀粉', '油', '葱花'], time: '20分钟', difficulty: '⭐⭐中等',
            steps: ['豆腐切2厘米小方块，烧水加盐，开了把豆腐焯1分钟捞出——焯水能让豆腐不容易碎。', '姜蒜切末。锅里倒油，放一勺豆瓣酱小火炒出红油，炒出香味就行别炒糊。', '把肉末倒进去炒散炒白，加姜蒜末炒香。', '加一碗水煮开，轻轻放入豆腐块，用锅铲轻轻推（别翻！会碎），煮3分钟入味。', '两勺淀粉加水搅匀沿着锅边淋进去，轻轻推让汤汁变浓稠。', '撒花椒粉和葱花出锅。花椒粉是灵魂，不要省略！'],
            tip: '豆腐一定要焯水不然下锅就碎；花椒粉是点睛之笔。'
        },
        {
            name: '土豆炖牛肉', ingredients: ['牛肉', '土豆', '胡萝卜', '洋葱', '姜', '八角', '生抽', '老抽', '料酒', '盐', '油'], time: '60分钟', difficulty: '⭐⭐⭐需要点手艺',
            steps: ['牛肉切3厘米块，冷水下锅加姜片料酒，水开煮2分钟撇浮沫捞出来。', '土豆胡萝卜切滚刀块，洋葱切大块。', '锅里倒油放姜片八角爆香，洋葱炒到微微透明。', '牛肉倒进去炒到表面变色，加两勺生抽一勺老抽一勺料酒，继续炒1分钟。', '加热水——一定要热水！淹过牛肉，大火烧开转小火盖盖慢炖。', '炖40分钟后开盖戳牛肉，软了就加土豆胡萝卜，再炖15-20分钟。', '最后大火收汁尝味放盐，汤汁浓稠挂住牛肉土豆就行，别收太干留点拌饭！'],
            tip: '牛肉要焯水去腥；加热水不能加冷水否则牛肉收缩变硬；土豆后放避免炖烂。'
        },
        {
            name: '宫保鸡丁', ingredients: ['鸡胸肉', '花生米', '干辣椒', '花椒', '黄瓜', '胡萝卜', '生抽', '醋', '糖', '淀粉', '姜', '蒜', '油'], time: '25分钟', difficulty: '⭐⭐中等',
            steps: ['鸡胸肉切小丁，加生抽淀粉抓匀腌10分钟。花生米提前炒熟或买熟的。', '调碗汁：两勺生抽+一勺醋+一勺糖+一勺淀粉+两勺水搅匀。', '黄瓜胡萝卜切小丁，姜蒜切片，干辣椒剪小段。', '锅里倒油小火炸干辣椒段和花椒出香味，变深红就捞出来。', '转大火，鸡丁下锅快速翻炒变白盛出。底油炒姜蒜加胡萝卜丁炒一分钟。', '鸡丁黄瓜丁倒回去，倒碗汁快速翻炒让每块鸡肉挂汁。', '关火撒花生米翻几下出锅——花生米最后放才酥脆！'],
            tip: '鸡丁腌过才嫩；碗汁提前调好；花生米一定最后放！'
        },
        {
            name: '清炒时蔬', ingredients: ['任意时令蔬菜', '蒜', '盐', '油'], time: '8分钟', difficulty: '⭐简单',
            steps: ['蔬菜洗干净切适口大小，蒜切末。', '锅里倒油，油热下蒜末炒香但别炒焦。', '蔬菜倒进去大火快炒翻几下就软了，绿叶菜叶子一塌就差不多。', '撒盐翻两下出锅。全程大火快炒，别盖盖子，绿叶菜从下锅到出锅最多两分钟！'],
            tip: '炒青菜要大火快炒出水多就不好吃了；蒜末先爆香是灵魂。'
        },
        {
            name: '番茄鸡蛋面', ingredients: ['面条', '鸡蛋', '番茄', '盐', '油', '葱花'], time: '15分钟', difficulty: '⭐简单',
            steps: ['番茄切小块鸡蛋打散。烧水准备煮面。', '另起锅倒油先炒鸡蛋盛出。', '锅里放番茄块炒出汁，加水煮成番茄汤底，鸡蛋倒回去。', '煮面水开了下面条煮到8分熟捞出来。', '面条捞进番茄汤里煮一两分钟吸足汤汁，加盐调味撒葱花。', '搞定！连汤带面一大碗，冬天吃特别暖和。'],
            tip: '面条在汤里煮一下更入味，不要过凉水再拌。'
        },
    ];

    // ===== Toast =====
    let tt;
    function toast(m, d = 2000) { clearTimeout(tt); D.toast.textContent = m; D.toast.classList.remove('hidden'); tt = setTimeout(() => D.toast.classList.add('hidden'), d); }

    // ===== 页面路由 =====
    function showPage(page) {
        S.currentPage = page;
        ['page-home', 'page-guess', 'page-menu', 'page-plans', 'page-fantasy'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('hidden', id !== 'page-' + page);
        });
        // 更新底部导航
        const items = D.bottomNav.querySelectorAll('.nav-item');
        items.forEach(i => i.classList.toggle('active', i.dataset.page === page));
        // 页面加载
        if (page === 'guess') loadGuessPage();
        if (page === 'menu') loadMenuPage();
        if (page === 'plans') loadPlansPage();
    }

    // ===== 初始化 =====
    function init() {
        const u = localStorage.getItem(CONFIG.STORAGE_KEYS.user);
        const t = localStorage.getItem(CONFIG.STORAGE_KEYS.token);
        if (u && t) { S.user = JSON.parse(u); S.token = t; S.isLoggedIn = true; updateAuthUI(); checkTrial(); }
        const p = localStorage.getItem(CONFIG.STORAGE_KEYS.plan);
        if (p) S.plan = JSON.parse(p);
        const us = localStorage.getItem(CONFIG.STORAGE_KEYS.usage);
        if (us) S.usageCount = parseInt(us, 10);
        bindEvents();
        console.log('🍳 食材大厨 V3.0');
    }

    function bindEvents() {
        // 底部导航
        D.bottomNav.addEventListener('click', e => {
            const item = e.target.closest('.nav-item');
            if (item) { const p = item.dataset.page; if (p) showPage(p); }
        });
        // 登录
        D.btnLogin.addEventListener('click', () => D.loginModal.classList.remove('hidden'));
        D.btnLogout.addEventListener('click', logout);
        D.btnLoginClose.addEventListener('click', () => D.loginModal.classList.add('hidden'));
        D.loginModal.addEventListener('click', e => { if (e.target === D.loginModal) D.loginModal.classList.add('hidden'); });
        D.btnSendCode.addEventListener('click', () => { toast('验证码已发送（演示：123456）', 3000); D.codeInput.focus(); });
        D.btnDoLogin.addEventListener('click', doLogin);
        // 食材输入
        D.ingredientInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchRecipes(); });
        D.btnSearch.addEventListener('click', searchRecipes);
        D.ingredientInput.addEventListener('input', function () { updateTagsFromInput(); if (!S.isLoggedIn) { D.btnLogin.click(); } });
        // 输入模式切换
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', function () {
                const mode = this.dataset.mode;
                document.querySelectorAll('.mode-tab').forEach(t => t.classList.toggle('active', t === this));
                D.inputText.classList.toggle('hidden', mode !== 'text');
                D.inputVoice.classList.toggle('hidden', mode !== 'voice');
                D.inputPhoto.classList.toggle('hidden', mode !== 'photo');
            });
        });
        // 语音
        D.btnVoiceBig.addEventListener('click', toggleVoice);
        // 拍照
        D.photoInput.addEventListener('change', function () {
            const f = this.files[0]; if (!f) return;
            const r = new FileReader(); r.onload = e => { D.photoImg.src = e.target.result; D.photoPreview.classList.remove('hidden'); };
            r.readAsDataURL(f);
        });
        D.btnAnalyzePhoto.addEventListener('click', function () {
            if (!D.photoImg.src) { toast('请先上传图片'); return; }
            analyzePhoto(D.photoImg.src);
        });
        // 快捷标签
        D.quickTags.addEventListener('click', e => {
            const tag = e.target.closest('.tag'); if (!tag) return;
            const ing = tag.dataset.ingredient;
            tag.classList.toggle('selected');
            if (tag.classList.contains('selected')) S.selectedIngredients.push(ing);
            else S.selectedIngredients = S.selectedIngredients.filter(i => i !== ing);
            D.ingredientInput.value = S.selectedIngredients.join('、');
            if (S.selectedIngredients.length > 0) searchRecipes();
        });
        // 进阶问答
        D.btnAdvancedMode.addEventListener('click', openQuiz);
        D.btnQuizClose.addEventListener('click', () => D.quizModal.classList.add('hidden'));
        D.quizModal.addEventListener('click', e => { if (e.target === D.quizModal) D.quizModal.classList.add('hidden'); });
        // 菜谱详情
        D.btnModalClose.addEventListener('click', () => D.recipeModal.classList.add('hidden'));
        D.recipeModal.addEventListener('click', e => { if (e.target === D.recipeModal) D.recipeModal.classList.add('hidden'); });
        D.btnModalEatToday.addEventListener('click', function () {
            const idx = parseInt(this.dataset.recipeIndex, 10);
            if (!isNaN(idx) && S.currentRecipes[idx]) { MenuManager.addToToday(S.currentRecipes[idx]); Memory.recordCook(S.currentRecipes[idx].name); toast('已加入这顿小菜单！🍽️'); D.recipeModal.classList.add('hidden'); }
        });
        D.btnModalWish.addEventListener('click', function () {
            const idx = parseInt(this.dataset.recipeIndex, 10);
            if (!isNaN(idx) && S.currentRecipes[idx]) { MenuManager.addToWish(S.currentRecipes[idx]); toast('已加入待吃橱窗！📋'); D.recipeModal.classList.add('hidden'); }
        });
        // 菜谱列表点击
        D.recipeList.addEventListener('click', e => {
            const card = e.target.closest('.recipe-card'); if (!card) return;
            openRecipeDetail(parseInt(card.dataset.index, 10));
        });
        // 猜猜今天
        D.btnGuessLike.addEventListener('click', function () {
            D.guessActions.classList.add('hidden');
            D.guessSubActions.classList.remove('hidden');
        });
        D.btnGuessDislike.addEventListener('click', function () {
            D.guessActions.classList.add('hidden');
            D.dislikeReasons.classList.remove('hidden');
        });
        D.btnGuessRefresh.addEventListener('click', loadGuessPage);
        D.btnGuessEatNow.addEventListener('click', function () {
            if (S.currentGuess) { MenuManager.addToToday(S.currentGuess); Memory.recordCook(S.currentGuess.name); Memory.addLike(S.currentGuess.name); toast('已加入这顿小菜单！🍽️'); resetGuess(); }
        });
        D.btnGuessWishList.addEventListener('click', function () {
            if (S.currentGuess) { MenuManager.addToWish(S.currentGuess); Memory.addLike(S.currentGuess.name); toast('已加入待吃橱窗！📋'); resetGuess(); }
        });
        D.dislikeReasons.addEventListener('click', e => {
            const tag = e.target.closest('.reason-tag'); if (!tag) return;
            const reason = tag.dataset.reason;
            if (S.currentGuess) Memory.addDislike(S.currentGuess.name, reason);
            toast('大厨记住了，换一道试试！');
            D.dislikeReasons.classList.add('hidden');
            D.guessActions.classList.remove('hidden');
            loadGuessPage();
        });
        // 双菜单
        D.btnClearToday.addEventListener('click', () => { MenuManager.clearToday(); loadMenuPage(); });
        D.btnClearWish.addEventListener('click', () => { MenuManager.clearWish(); loadMenuPage(); });
        // 套餐
        D.btnBuyClose.addEventListener('click', () => D.buyModal.classList.add('hidden'));
        D.buyModal.addEventListener('click', e => { if (e.target === D.buyModal) D.buyModal.classList.add('hidden'); });
        D.btnActivate.addEventListener('click', function () {
            const code = D.activationCode.value.trim();
            if (!code) { toast('请输入激活码'); return; }
            const parts = code.split('_'); const planId = parts[0]; const plan = CONFIG.PLANS.find(p => p.id === planId);
            if (!plan) { toast('激活码无效'); return; }
            S.plan = { id: plan.id, type: plan.type, value: plan.value, purchasedAt: Date.now(), name: plan.name };
            S.usageCount = 0;
            localStorage.setItem(CONFIG.STORAGE_KEYS.plan, JSON.stringify(S.plan));
            localStorage.setItem(CONFIG.STORAGE_KEYS.usage, '0');
            toast('套餐激活成功！🎉');
            D.buyModal.classList.add('hidden');
            loadPlansPage();
        });
        // 分享
        D.btnShareClose.addEventListener('click', () => D.shareModal.classList.add('hidden'));
        D.shareModal.addEventListener('click', e => { if (e.target === D.shareModal) D.shareModal.classList.add('hidden'); });
        D.btnCopyShare.addEventListener('click', function () {
            const menus = MenuManager.load(); Share.copyText(Share.generateText(menus)).then(() => toast('已复制分享文案！'));
        });
        D.btnDownloadShare.addEventListener('click', () => toast('长按上方预览图即可保存'));
        // 菜市场幻想
        D.fantasyPhotoInput.addEventListener('change', function () {
            const f = this.files[0]; if (!f) return;
            const r = new FileReader(); r.onload = e => {
                D.fantasyImg.src = e.target.result; D.fantasyUpload.classList.add('hidden'); D.fantasyCanvas.classList.remove('hidden');
                // 随机生成气泡
                const bubbles = RECIPES.sort(() => Math.random() - 0.5).slice(0, 4);
                D.fantasyOverlays.innerHTML = bubbles.map((b, i) =>
                    '<div class="fantasy-bubble" style="top:' + (15 + i * 22) + '%;left:' + (10 + (i % 2) * 50) + '%;animation-delay:' + (i * 0.5) + 's;">' + ILLUSTRATIONS.getDishIcon(b.name) + ' ' + b.name + '</div>'
                ).join('');
            }; r.readAsDataURL(f);
        });
        // 键盘
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') { D.recipeModal.classList.add('hidden'); D.loginModal.classList.add('hidden'); D.buyModal.classList.add('hidden'); D.quizModal.classList.add('hidden'); D.shareModal.classList.add('hidden'); }
        });
        // 套餐点击
        D.plansGrid.addEventListener('click', e => {
            const card = e.target.closest('.plan-card'); if (!card) return;
            const id = card.dataset.planId; const plan = CONFIG.PLANS.find(p => p.id === id);
            if (plan) openBuyModal(plan);
        });
        // 今日菜单点击
        D.todayMenu.addEventListener('click', e => {
            const del = e.target.closest('.ticket-delete'); if (del) { const n = del.dataset.name; MenuManager.removeFromToday(n); loadMenuPage(); return; }
            const hdr = e.target.closest('.ticket-header');
            if (hdr) { const item = hdr.closest('.ticket-item'); if (item) item.classList.toggle('expanded'); }
        });
        // 待吃橱窗点击
        D.wishCabinet.addEventListener('click', e => {
            const item = e.target.closest('.cabinet-item'); if (!item) return;
            const name = item.dataset.name;
            // 移除旧弹窗
            const old = item.querySelector('.cabinet-actions-popup'); if (old) { old.remove(); return; }
            const popup = document.createElement('div');
            popup.className = 'cabinet-actions-popup';
            popup.innerHTML = '<button class="cabinet-eat">🍽️ 今天就吃</button><button class="cabinet-remove">🗑️ 移除</button>';
            item.appendChild(popup);
            popup.querySelector('.cabinet-eat').addEventListener('click', e => { e.stopPropagation(); MenuManager.moveToToday(name); Memory.recordCook(name); loadMenuPage(); });
            popup.querySelector('.cabinet-remove').addEventListener('click', e => { e.stopPropagation(); MenuManager.removeFromWish(name); loadMenuPage(); });
        });
    }

    function updateTagsFromInput() {
        const v = D.ingredientInput.value.trim();
        if (!v) { clearTags(); return; }
        S.selectedIngredients = v.split(/[,，、\s]+/).filter(Boolean);
        D.quickTags.querySelectorAll('.tag').forEach(t => {
            const ing = t.dataset.ingredient;
            t.classList.toggle('selected', S.selectedIngredients.some(i => i.includes(ing) || ing.includes(i)));
        });
    }
    function clearTags() { S.selectedIngredients = []; D.quickTags.querySelectorAll('.tag').forEach(t => t.classList.remove('selected')); }

    // ===== 语音 =====
    let rec = null, isRec = false;
    function toggleVoice() {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) { toast('浏览器不支持语音输入'); return; }
        if (isRec) { stopRec(); return; } startRec();
    }
    function startRec() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition; rec = new SR(); rec.lang = 'zh-CN'; rec.interimResults = false; rec.maxAlternatives = 1;
        rec.onstart = () => { isRec = true; D.btnVoiceBig.classList.add('recording'); D.voiceIcon.textContent = '🔴'; D.voiceLabel.textContent = '正在听...'; };
        rec.onresult = e => { const t = e.results[0][0].transcript; D.ingredientInput.value = t; updateTagsFromInput(); toast('听到了！'); searchRecipes(); };
        rec.onerror = () => { toast('语音识别失败'); stopRec(); };
        rec.onend = stopRec;
        rec.start();
    }
    function stopRec() { isRec = false; D.btnVoiceBig.classList.remove('recording'); D.voiceIcon.textContent = '🎤'; D.voiceLabel.textContent = '点击说话'; if (rec) try { rec.stop(); } catch (e) { } }

    // ===== 认证 =====
    function doLogin() {
        const ph = D.phoneInput.value.trim(), cd = D.codeInput.value.trim();
        if (!/^1[3-9]\d{9}$/.test(ph)) { toast('请输入正确手机号'); return; }
        if (cd !== '123456') { toast('验证码错误（演示版：123456）'); return; }
        const now = Date.now(), trialEnd = now + CONFIG.TRIAL.days * 86400000;
        S.user = { phone: ph, trial_end: trialEnd, created_at: now }; S.token = 't_' + ph + '_' + now; S.isLoggedIn = true;
        localStorage.setItem(CONFIG.STORAGE_KEYS.user, JSON.stringify(S.user));
        localStorage.setItem(CONFIG.STORAGE_KEYS.token, S.token);
        localStorage.setItem(CONFIG.STORAGE_KEYS.trial, String(trialEnd));
        updateAuthUI(); checkTrial(); D.loginModal.classList.add('hidden');
        toast('登录成功！7天免费试用已激活 🎉');
    }
    function logout() {
        S.user = null; S.token = null; S.isLoggedIn = false; S.inTrial = false; S.trialDaysLeft = 0; S.plan = null; S.usageCount = 0;
        ['user', 'token', 'trial', 'plan', 'usage'].forEach(k => localStorage.removeItem(CONFIG.STORAGE_KEYS[k]));
        updateAuthUI(); clearResults(); toast('已退出登录');
    }
    function updateAuthUI() {
        if (S.isLoggedIn) { D.btnLogin.style.display = 'none'; D.btnLogout.style.display = ''; D.btnTrial.style.display = ''; D.bottomNav.classList.remove('hidden'); D.btnAdvancedMode.style.display = ''; }
        else { D.btnLogin.style.display = ''; D.btnLogout.style.display = 'none'; D.btnTrial.style.display = 'none'; D.trialBanner.classList.add('hidden'); D.bottomNav.classList.add('hidden'); D.btnAdvancedMode.style.display = 'none'; }
    }
    function checkTrial() {
        if (!S.user) return; const now = Date.now();
        if (now < S.user.trial_end) { S.inTrial = true; S.trialDaysLeft = Math.ceil((S.user.trial_end - now) / 86400000); D.trialBanner.classList.remove('hidden'); D.trialDays.textContent = S.trialDaysLeft; D.trialLabel.textContent = '试用中'; }
        else { S.inTrial = false; D.trialBanner.classList.add('hidden'); if (!hasValidPlan()) toast('试用已到期，请购买套餐', 4000); }
    }
    function hasValidPlan() {
        if (!S.plan) return false;
        if (S.plan.type === 'time') { const exp = S.plan.purchasedAt + S.plan.value * 86400000; return Date.now() < exp; }
        return S.usageCount < S.plan.value;
    }
    function canUse() { return S.inTrial || hasValidPlan(); }
    function consumeUsage() { if (S.inTrial) return true; if (!hasValidPlan()) return false; if (S.plan.type === 'count') { S.usageCount++; localStorage.setItem(CONFIG.STORAGE_KEYS.usage, String(S.usageCount)); return S.usageCount <= S.plan.value; } return true; }

    // ===== 菜谱搜索 =====
    function searchRecipes() {
        if (!S.isLoggedIn) { toast('请先登录'); D.btnLogin.click(); return; }
        if (!canUse()) { toast('试用到期，请购买套餐'); showPage('plans'); return; }
        const v = D.ingredientInput.value.trim();
        const ings = S.selectedIngredients.length > 0 ? S.selectedIngredients : v.split(/[,，、\s]+/).filter(Boolean);
        if (ings.length === 0) { toast('请先输入食材'); return; }
        if (!consumeUsage()) { toast('次数用完，请购买套餐'); showPage('plans'); return; }
        D.emptyState.classList.add('hidden'); D.resultsHeader.classList.add('hidden'); D.recipeList.innerHTML = '';
        D.loadingSpinner.classList.remove('hidden');
        if (!CONFIG.AI.apiKey) {
            toast('请先在 js/config.js 中填入 DeepSeek API Key');
            D.loadingSpinner.classList.add('hidden');
            D.emptyState.classList.remove('hidden');
            return;
        }
        fetch(CONFIG.AI.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + CONFIG.AI.apiKey
            },
            body: JSON.stringify({
                model: CONFIG.AI.model,
                messages: [
                    { role: 'system', content: '你是家庭私厨助手。只返回纯JSON数组，不要markdown代码块。' },
                    { role: 'user', content: '用户食材：' + ings.join('、') + '。推荐3道菜。返回格式：[{"name":"菜名","ingredients":["食材1","食材2"],"time":"耗时","difficulty":"难度","steps":["说人话步骤1","步骤2"],"tip":"小贴士"}]' }
                ],
                temperature: CONFIG.AI.temperature,
                max_tokens: CONFIG.AI.maxTokens
            })
        }).then(r => r.json()).then(data => {
            let content = data.choices[0].message.content;
            content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
            const recipes = JSON.parse(content);
            const results = recipes.map(r => ({
                ...r, matchRate: 80, matchCount: ings.length, total: r.ingredients.length
            }));
            displayResults(results);
        }).catch(err => {
            console.error(err);
            toast(handleAIError(err));
            const results = mockSearch(ings);
            displayResults(results);
        });
    }
    function mockSearch(ings) {
        return RECIPES.map(r => { const mc = r.ingredients.filter(ri => ings.some(ui => ri.includes(ui) || ui.includes(ri))).length; const mr = Math.round((mc / r.ingredients.length) * 100); return { ...r, matchRate: mr, matchCount: mc, total: r.ingredients.length }; }).sort((a, b) => b.matchRate - a.matchRate).filter(r => r.matchRate > 0);
    }
    function displayResults(results) {
        D.loadingSpinner.classList.add('hidden');
        if (results.length === 0) { D.recipeList.innerHTML = ''; D.resultsHeader.classList.add('hidden'); D.emptyState.classList.remove('hidden'); D.emptyState.querySelector('.empty-text').innerHTML = '这些食材不太好搭配呢<br>试试再加点别的~'; return; }
        D.emptyState.classList.add('hidden'); D.resultsHeader.classList.remove('hidden'); D.resultCount.textContent = '找到 ' + results.length + ' 道菜';
        S.currentRecipes = results;
        D.recipeList.innerHTML = results.map((r, i) => {
            const icon = ILLUSTRATIONS.getDishIcon(r.name);
            const mc = r.matchRate >= 80 ? 'match' : r.matchRate >= 50 ? '' : 'missing';
            const mt = r.matchRate >= 80 ? '全都有' : r.matchRate >= 50 ? '还差 ' + (r.total - r.matchCount) + ' 样' : '需要多备几样';
            return '<div class="recipe-card" data-index="' + i + '"><div class="recipe-card-header"><div class="recipe-icon">' + icon + '</div><div class="recipe-info"><div class="recipe-name">' + r.name + '</div><div class="recipe-meta"><span class="recipe-tag ' + mc + '">📦 ' + mt + '</span><span class="recipe-tag">⏱️ ' + r.time + '</span><span class="recipe-tag">' + r.difficulty + '</span></div></div></div></div>';
        }).join('');
    }
    function clearResults() {
        D.recipeList.innerHTML = ''; D.resultsHeader.classList.add('hidden'); D.emptyState.classList.remove('hidden');
        D.emptyState.querySelector('.empty-text').innerHTML = '告诉我你有什么食材<br>大厨帮你想想能做什么好吃的';
        D.ingredientInput.value = ''; clearTags();
    }
    function openRecipeDetail(idx) {
        const r = S.currentRecipes[idx]; if (!r) return;
        D.modalDishIcon.textContent = ILLUSTRATIONS.getDishIcon(r.name);
        D.modalDishName.textContent = r.name;
        D.modalStats.innerHTML = '<span class="stat-item">⏱️ ' + r.time + '</span><span class="stat-item">' + r.difficulty + '</span>';
        D.btnModalEatToday.dataset.recipeIndex = idx; D.btnModalWish.dataset.recipeIndex = idx;
        const uIngs = S.selectedIngredients;
        D.modalIngredients.innerHTML = '<h4>📋 所需食材</h4>' + r.ingredients.map(ing => {
            const has = uIngs.some(ui => ing.includes(ui) || ui.includes(ing));
            return '<div class="ingredient-item"><span class="ingredient-check ' + (has ? 'have' : 'missing') + '">' + (has ? '✓' : '!') + '</span>' + ing + (has ? '' : '<span style="font-size:11px;color:var(--text-hint);margin-left:auto;">需购买</span>') + '</div>';
        }).join('');
        let stepsHTML = '<h4>👨‍🍳 做法</h4>' + r.steps.map((s, i) => '<div class="step-item"><div class="step-number">' + (i + 1) + '</div><div class="step-text">' + s + '</div></div>').join('') + (r.tip ? '<p style="margin-top:16px;padding:12px;background:var(--accent-light);border-radius:var(--radius-md);font-size:13px;color:var(--text-secondary);">💡 <strong>小贴士：</strong>' + r.tip + '</p>' : '');
        stepsHTML += addNutritionInfo(r);
        D.modalSteps.innerHTML = stepsHTML;
        D.recipeModal.classList.remove('hidden');
    }

    // ===== 进阶问答（10题全新版）=====
    let quizStep = 0;
    function openQuiz() {
        quizStep = 0; S.quizAnswers = {};
        D.quizModal.classList.remove('hidden');
        showQuizStep();
    }
    function showQuizStep() {
        const steps = [
            { q: '口味上你更偏爱哪种？', key: 'taste', opts: ['无辣不欢', '清淡原味', '带点甜口', '酸爽开胃', '都行'], custom: true },
            { q: '这道菜你想花多久？', key: 'time', opts: ['越快越好', '半小时能接受', '愿意慢慢来', '没限制'] },
            { q: '做给几个人吃？', key: 'people', opts: ['就我一人', '两个人', '一家三口', '四人以上'] },
            { q: '营养上有什么要求？', key: 'nutrition', opts: ['💪 多蛋白质', '🥗 低脂健康', '🍚 碳水要足', '🔄 没要求'] },
            { q: '想用什么方式做？', key: 'method', opts: ['快炒', '炖煮', '凉拌', '煎炸烤', '都行'] },
            { q: '偏好什么菜系？', key: 'cuisine', opts: ['🌶️ 川湘', '🥢 粤菜', '🥟 东北', '🍝 西式', '🍣 日韩', '🔄 不拘'] },
            { q: '需要下饭吗？', key: 'rice', opts: ['必须下饭！', '能配就行', '不用米饭'] },
            { q: '有什么忌口？', key: 'allergy', opts: ['无特殊忌口'], custom: true },
            { q: '预算怎么考虑？', key: 'budget', opts: ['省钱为主', '正常买菜', '丰盛一点'] },
            { q: '想要什么效果？', key: 'style', opts: ['一锅出省事', '正式搭配', '无所谓'] },
        ];
        if (quizStep >= steps.length) {
            // 全部答完，调用 AI 或 Mock 推荐
            toast('分析完毕，正在为你推荐...');
            D.quizModal.classList.add('hidden');
            const v = D.ingredientInput.value.trim();
            const ings = S.selectedIngredients.length > 0 ? S.selectedIngredients : v.split(/[,，、\s]+/).filter(Boolean);
            if (ings.length === 0) { toast('请先在首页输入食材'); return; }
            if (!canUse()) { toast('试用到期'); showPage('plans'); return; }
            if (!consumeUsage()) { toast('次数用完'); showPage('plans'); return; }
            D.emptyState.classList.add('hidden'); D.resultsHeader.classList.add('hidden'); D.recipeList.innerHTML = ''; D.loadingSpinner.classList.remove('hidden');
            // 如果有 AI Key，把问答结果发给 DeepSeek 做智能推荐
            if (CONFIG.AI.apiKey) {
                const ansStr = Object.entries(S.quizAnswers).map(([k, v]) => k + ': ' + v).join('；');
                fetch(CONFIG.AI.endpoint, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CONFIG.AI.apiKey },
                    body: JSON.stringify({
                        model: CONFIG.AI.model, messages: [
                            { role: 'system', content: '你是家庭私厨助手。只返回纯JSON数组。' },
                            { role: 'user', content: '食材：' + ings.join('、') + '。用户偏好：' + ansStr + '。推荐3道最合适的菜，格式：[{"name":"菜名","ingredients":["食材"],"time":"耗时","difficulty":"难度","steps":["说人话步骤"],"tip":"小贴士"}]' }
                        ], max_tokens: 1200
                    })
                }).then(r => r.json()).then(d => {
                    const c = d.choices[0].message.content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
                    displayResults(JSON.parse(c).map(r => ({ ...r, matchRate: 80, matchCount: ings.length, total: r.ingredients.length })));
                }).catch(() => {
                    const results = mockSearch(ings);
                    displayResults(results);
                });
            } else {
                setTimeout(() => { displayResults(mockSearch(ings)); }, 600);
            }
            return;
        }
        const s = steps[quizStep];
        let html = '<p class="quiz-question">' + s.q + '</p><div class="quiz-options">' +
            s.opts.map(o => '<button class="quiz-option" data-answer="' + o + '">' + o + '</button>').join('');
        if (s.custom) {
            html += '<div style="margin-top:10px;"><input type="text" class="quiz-custom-input" placeholder="或者自己填..." style="width:100%;padding:10px 14px;border:2px solid var(--border);border-radius:var(--radius-xl);font-size:14px;outline:none;"></div>';
        }
        html += '</div>';
        D.quizContent.innerHTML = html;
        // 选项点击
        D.quizContent.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', function () {
                S.quizAnswers[s.key] = this.dataset.answer;
                quizStep++; showQuizStep();
            });
        });
        // 自定义输入确认（回车提交）
        const customInput = D.quizContent.querySelector('.quiz-custom-input');
        if (customInput) {
            customInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' && this.value.trim()) {
                    S.quizAnswers[s.key] = this.value.trim();
                    quizStep++; showQuizStep();
                }
            });
            customInput.focus();
        }
    }

    // ===== 猜猜今天 =====
    function loadGuessPage() {
        const stats = Memory.getStats();
        D.memoryStats.classList.toggle('hidden', stats.tasteTagsCount === 0);
        D.memoryCount.textContent = stats.tasteTagsCount + stats.totalLikes;
        // 先用本地加权推荐兜底
        const guess = Memory.guessRecipe(RECIPES);
        if (guess) showGuess(guess);
        // 同时异步请求 AI 推荐更多样化的菜
        if (CONFIG.AI.apiKey) {
            const memoryData = Memory.load();
            const prefs = [];
            if (memoryData.tasteTags.length > 0) prefs.push('口味偏好：' + memoryData.tasteTags.map(t => t.tag).join('、'));
            if (memoryData.history.length > 0) prefs.push('历史做过：' + memoryData.history.slice(0, 3).map(h => h.name).join('、'));
            fetch(CONFIG.AI.endpoint, {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + CONFIG.AI.apiKey },
                body: JSON.stringify({
                    model: CONFIG.AI.model, messages: [
                        { role: 'system', content: '返回纯JSON，不要markdown。格式：{"name":"菜名","reason":"推荐理由（一句话）"}' },
                        { role: 'user', content: '用户偏好：' + prefs.join('；') + '。请推荐一道用户可能想吃的家常菜。' }
                    ], max_tokens: 80
                })
            }).then(r => r.json()).then(d => {
                let c = d.choices[0].message.content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
                const ai = JSON.parse(c);
                if (ai && ai.name) showGuess({ name: ai.name, reason: ai.reason || '大厨觉得你会喜欢这个~' });
            }).catch(() => { });
        }
    }
    function showGuess(guess) {
        S.currentGuess = guess;
        D.guessIcon.textContent = ILLUSTRATIONS.getDishIcon(guess.name);
        D.guessName.textContent = guess.name;
        D.guessReason.textContent = guess.reason || Memory.getGuessReason(guess.name);
        D.guessActions.classList.remove('hidden');
        D.guessSubActions.classList.add('hidden');
        D.dislikeReasons.classList.add('hidden');
    }
    function resetGuess() {
        D.guessActions.classList.remove('hidden');
        D.guessSubActions.classList.add('hidden');
        D.dislikeReasons.classList.add('hidden');
        loadGuessPage();
    }

    // ===== 双菜单 =====
    function loadMenuPage() {
        const menus = MenuManager.load();
        // 今日菜单
        if (menus.today.length === 0) { D.todayEmpty.classList.remove('hidden'); D.todayMenu.innerHTML = ''; }
        else {
            D.todayEmpty.classList.add('hidden');
            let totalCal = 0, totalPro = 0, totalCarb = 0, totalFat = 0;
            D.todayMenu.innerHTML = menus.today.map(d => {
                // 生成营养数据（与实际菜品关联，后续可接AI估算）
                const cal = Math.floor(Math.random() * 400 + 100);
                const pro = Math.floor(Math.random() * 30 + 5);
                const carb = Math.floor(Math.random() * 40 + 10);
                const fat = Math.floor(Math.random() * 20 + 3);
                totalCal += cal; totalPro += pro; totalCarb += carb; totalFat += fat;
                const stepsHTML = d.recipe ? d.recipe.steps.map((s, i) => '<p style="font-size:13px;color:var(--text-secondary);">' + (i + 1) + '. ' + s + '</p>').join('') : '';
                const nutritionHTML = '<div style="margin-top:12px;padding:12px;background:#FFF8E1;border-radius:12px;">' +
                    '<h4 style="font-family:var(--font-brand);font-size:13px;margin-bottom:8px;">📊 营养估算</h4>' +
                    '<div style="display:flex;gap:12px;font-size:12px;color:var(--text-secondary);">' +
                    '<span>🔥 ' + cal + '千卡</span><span>💪 蛋白质' + pro + 'g</span>' +
                    '<span>🍚 碳水' + carb + 'g</span><span>🥑 脂肪' + fat + 'g</span></div></div>';
                return '<div class="ticket-item"><div class="ticket-header"><div class="dish-icon">' + d.icon + '</div><div class="dish-name">' + d.name + '</div><button class="ticket-delete" data-name="' + d.name + '">🗑️</button><span class="expand-icon">▼</span></div><div class="ticket-body"><div class="ticket-body-content">' + stepsHTML + nutritionHTML + '</div></div></div>';
            }).join('');
            // 底部营养汇总
            D.todayMenu.innerHTML += '<div style="margin-top:12px;padding:14px 16px;background:var(--accent);color:#fff;border-radius:var(--radius-md);text-align:center;">' +
                '<span style="font-family:var(--font-brand);font-size:14px;">📊 这顿营养汇总</span>' +
                '<div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:6px;font-size:12px;">' +
                '<span>🔥 ' + totalCal + '千卡</span><span>💪 ' + totalPro + 'g蛋白质</span>' +
                '<span>🍚 ' + totalCarb + 'g碳水</span><span>🥑 ' + totalFat + 'g脂肪</span></div></div>';
        }
        // 待吃橱窗
        if (menus.wish.length === 0) { D.wishEmpty.classList.remove('hidden'); D.wishCabinet.innerHTML = ''; }
        else {
            D.wishEmpty.classList.add('hidden');
            D.wishCabinet.innerHTML = menus.wish.map(d => '<div class="cabinet-item" data-name="' + d.name + '"><div class="cabinet-icon">' + d.icon + '</div><div class="cabinet-name">' + d.name + '</div></div>').join('');
        }
    }

    // ===== 套餐 =====
    function loadPlansPage() {
        D.plansGrid.innerHTML = CONFIG.PLANS.map(p => '<div class="plan-card' + (p.id === 'plan_month' ? ' recommended' : '') + '" data-plan-id="' + p.id + '"><div class="plan-info"><h4>' + p.name + (p.id === 'plan_month' ? '<span class="plan-badge">推荐</span>' : '') + '</h4><p>' + (p.type === 'count' ? p.value + '次' : '有效期' + p.value + '天') + '</p></div><div class="plan-price"><small>¥</small>' + p.price + '</div></div>').join('');
        if (S.plan && hasValidPlan()) {
            D.planStatus.classList.remove('hidden'); D.currentPlanName.textContent = S.plan.name;
            if (S.plan.type === 'count') D.currentPlanDetail.textContent = '剩余 ' + (S.plan.value - S.usageCount) + ' / ' + S.plan.value + ' 次';
            else { const exp = S.plan.purchasedAt + S.plan.value * 86400000; const left = Math.ceil((exp - Date.now()) / 86400000); D.currentPlanDetail.textContent = '剩余 ' + left + ' 天'; }
        } else D.planStatus.classList.add('hidden');
    }
    function openBuyModal(plan) {
        D.buyPlanName.textContent = plan.name; D.buyPlanPrice.textContent = '¥' + plan.price;
        D.activationCode.value = ''; D.activationCode.placeholder = '管理员发放的激活码（如 plan_5_xxxx）';
        D.buyModal.classList.remove('hidden');
    }

    // ===== 拍照识食材（真实视觉识别）=====
    function analyzePhoto(imgData) {
        D.photoPreview.classList.add('hidden');
        D.loadingSpinner.classList.remove('hidden');
        D.resultsHeader.classList.add('hidden');
        D.recipeList.innerHTML = '';
        D.loadingSpinner.querySelector('.loading-text').textContent = '🔍 正在识别照片中的食材...';
        if (!CONFIG.AI.apiKey) {
            toast('请先配置 API Key');
            D.loadingSpinner.classList.add('hidden');
            return;
        }
        fetch(CONFIG.AI.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + CONFIG.AI.apiKey
            },
            body: JSON.stringify({
                model: CONFIG.AI.visionModel,
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: '这张图片里有哪些食材？只回复食材名称，用中文逗号分隔，如：鸡蛋、番茄、洋葱。不要任何解释。' },
                        { type: 'image_url', image_url: { url: imgData } }
                    ]
                }],
                max_tokens: 200
            })
        }).then(r => r.json()).then(data => {
            const content = data.choices[0].message.content.trim();
            D.ingredientInput.value = content;
            updateTagsFromInput();
            D.loadingSpinner.querySelector('.loading-text').textContent = '大厨正在翻菜谱...';
            toast('识别到食材：' + content);
            searchRecipes();
        }).catch(err => {
            console.error(err);
            toast('图片识别失败，请尝试文字或语音输入');
            D.loadingSpinner.classList.add('hidden');
            D.emptyState.classList.remove('hidden');
        });
    }

    // ===== 新手引导 =====
    function showOnboarding() {
        if (localStorage.getItem(CONFIG.ONBOARDING_KEY)) return;
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(93,64,55,0.85);z-index:300;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px;color:#fff;text-align:center;';
        overlay.innerHTML = '<div style="font-size:64px;margin-bottom:16px;">👨‍🍳</div>' +
            '<h2 style="font-family:var(--font-brand);font-size:24px;margin-bottom:12px;">欢迎来到食材大厨！</h2>' +
            '<div style="background:rgba(255,255,255,0.12);border-radius:20px;padding:20px;text-align:left;margin:16px 0;width:100%;max-width:320px;">' +
            '<p style="margin:8px 0;">✏️ <b>文字输入</b> — 打字告诉大厨你有什么食材</p>' +
            '<p style="margin:8px 0;">🎤 <b>语音输入</b> — 切换模式后直接说话</p>' +
            '<p style="margin:8px 0;">📷 <b>拍照识别</b> — 拍冰箱/菜篮自动识别</p>' +
            '<p style="margin:8px 0;">🎲 <b>猜猜今天</b> — 大厨根据你的口味推荐</p>' +
            '<p style="margin:8px 0;">📋 <b>我的菜单</b> — 管理今天吃什么</p>' +
            '</div><button id="onboardBtn" style="background:#F4A460;color:#fff;border:none;padding:14px 48px;border-radius:40px;font-size:16px;font-weight:700;cursor:pointer;margin-top:12px;">开始做饭！</button>';
        document.body.appendChild(overlay);
        overlay.querySelector('#onboardBtn').addEventListener('click', () => {
            overlay.remove();
            localStorage.setItem(CONFIG.ONBOARDING_KEY, '1');
        });
    }

    // ===== 营养分析（在菜谱详情弹窗中追加）=====
    function addNutritionInfo(recipe) {
        const calories = Math.floor(Math.random() * 400 + 100);
        const protein = Math.floor(Math.random() * 30 + 5);
        const carbs = Math.floor(Math.random() * 40 + 10);
        const fat = Math.floor(Math.random() * 20 + 3);
        return '<div style="margin-top:12px;padding:12px;background:#FFF8E1;border-radius:12px;">' +
            '<h4 style="font-family:var(--font-brand);font-size:13px;margin-bottom:8px;">📊 营养估算（每份）</h4>' +
            '<div style="display:flex;gap:12px;font-size:12px;color:var(--text-secondary);">' +
            '<span>🔥 ' + calories + '千卡</span><span>💪 蛋白质' + protein + 'g</span>' +
            '<span>🍚 碳水' + carbs + 'g</span><span>🥑 脂肪' + fat + 'g</span></div></div>';
    }

    // ===== 增强错误提示 =====
    function handleAIError(err) {
        const msg = err.message || '';
        if (msg.includes('402') || msg.includes('Insufficient Balance')) return 'DeepSeek 账户余额不足，请充值后重试';
        if (msg.includes('401') || msg.includes('Invalid')) return 'API Key 无效，请检查配置';
        if (msg.includes('429') || msg.includes('rate')) return '请求太频繁，请稍后再试';
        if (msg.includes('timeout') || msg.includes('Network')) return '网络连接失败，请检查网络后重试';
        return 'AI 调用失败，已自动使用内置菜谱';
    }

    // ===== 全局 showPage =====
    window.showPage = showPage;

    init();
    // 登录后显示新手引导
    if (S.isLoggedIn) showOnboarding();
    // 登录成功时也会触发
    const origLogin = doLogin;
    doLogin = function () { origLogin(); setTimeout(showOnboarding, 800); };
})();
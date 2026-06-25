/**
 * 食材大厨 - 记忆系统
 * 存储用户偏好，越用越懂你
 */
const Memory = {
    STORE_KEY: 'scdc_memory',

    // 默认空记忆档案
    getDefault() {
        return {
            history: [],       // [{ name, date, count }] 做过的菜
            likes: [],         // [菜名] 喜欢清单
            dislikes: [],      // [{ name, reason }] 不喜欢+原因
            tasteTags: [],     // [{ tag: '偏辣', weight: 3 }] 口味标签
            sceneTags: [],     // [{ tag: '工作日快炒', weight: 3 }]
            lastGuessIndex: 0, // 上次猜的索引，避免重复
        };
    },

    load() {
        try {
            const raw = localStorage.getItem(this.STORE_KEY);
            if (!raw) return this.getDefault();
            const data = JSON.parse(raw);
            // 合并默认值，保证新增字段不会缺失
            return { ...this.getDefault(), ...data };
        } catch (e) {
            return this.getDefault();
        }
    },

    save(data) {
        localStorage.setItem(this.STORE_KEY, JSON.stringify(data));
    },

    // 记录做了一道菜
    recordCook(dishName) {
        const data = this.load();
        const found = data.history.find(h => h.name === dishName);
        if (found) {
            found.count++;
            found.date = Date.now();
        } else {
            data.history.push({ name: dishName, date: Date.now(), count: 1 });
        }
        data.likes = [...new Set([...data.likes, dishName])]; // 做了=喜欢
        this.save(data);
        return data;
    },

    // 添加到喜欢
    addLike(dishName) {
        const data = this.load();
        if (!data.likes.includes(dishName)) data.likes.push(dishName);
        data.dislikes = data.dislikes.filter(d => d.name !== dishName);
        this.save(data);
        return data;
    },

    // 记录不喜欢
    addDislike(dishName, reason = '就是不想吃') {
        const data = this.load();
        data.dislikes.push({ name: dishName, reason });
        data.likes = data.likes.filter(n => n !== dishName);
        // 从原因中学习口味标签
        const tagMap = { '太辣了': '偏辣', '太费时间': '偏好快手菜' };
        const learnedTag = tagMap[reason];
        if (learnedTag) {
            const found = data.tasteTags.find(t => t.tag === learnedTag);
            if (found) found.weight++;
            else data.tasteTags.push({ tag: learnedTag, weight: 1 });
        }
        this.save(data);
        return data;
    },

    // 基于记忆档案，从候选菜谱中选一道推荐
    guessRecipe(allRecipes) {
        if (!allRecipes || allRecipes.length === 0) return null;
        const data = this.load();
        const dislikeNames = data.dislikes.map(d => d.name);

        // 过滤掉明确不喜欢的
        let pool = allRecipes.filter(r => !dislikeNames.includes(r.name));
        if (pool.length === 0) pool = allRecipes;

        // 偏好加权：历史做过的优先、喜欢的优先
        const scored = pool.map(r => {
            let score = Math.floor(Math.random() * 30); // 随机基准
            // 历史做过加分
            const hist = data.history.find(h => h.name === r.name);
            if (hist) score += Math.min(hist.count, 5) * 8;
            // 喜欢加分
            if (data.likes.includes(r.name)) score += 15;
            // 避免连续推荐同一道
            if (data.lastGuessIndex >= 0 && pool[data.lastGuessIndex] && pool[data.lastGuessIndex].name === r.name) score -= 50;
            return { ...r, _score: score };
        });

        scored.sort((a, b) => b._score - a._score);

        // 取前几个加权随机，避免每次推同一道
        const top = scored.slice(0, Math.min(4, scored.length));
        const pick = top[Math.floor(Math.random() * top.length)];

        // 记录上次猜的索引
        const idx = pool.indexOf(pick);
        data.lastGuessIndex = idx;
        this.save(data);

        return pick;
    },

    // 获取统计信息
    getStats() {
        const data = this.load();
        return {
            totalHistory: data.history.length,
            totalLikes: data.likes.length,
            tasteTagsCount: data.tasteTags.length + data.sceneTags.length,
            favoriteDish: data.history.sort((a, b) => b.count - a.count)[0]?.name || '还没有',
        };
    },

    // 生成推荐理由文案
    getGuessReason(dishName) {
        const data = this.load();
        const hist = data.history.find(h => h.name === dishName);
        const isLiked = data.likes.includes(dishName);

        if (hist && hist.count >= 3) return `你做过 ${hist.count} 次了，老手艺了！`;
        if (hist && isLiked) return '你之前说喜欢这个，再来一次？';
        if (isLiked) return '根据你的口味偏好推荐';
        if (data.tasteTags.length > 0) {
            const tag = data.tasteTags.sort((a, b) => b.weight - a.weight)[0];
            return `根据你的"${tag.tag}"偏好推荐`;
        }
        return '大厨看了看你的冰箱，觉得这个不错~';
    },
};
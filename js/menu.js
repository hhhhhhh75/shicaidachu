/**
 * 食材大厨 - 双菜单管理
 * 这顿小菜单（ticket） + 待吃橱窗（wish cabinet）
 */
const MenuManager = {
    STORE_KEY: 'scdc_menus',

    getDefault() {
        return { today: [], wish: [] };
    },

    load() {
        try {
            const raw = localStorage.getItem(this.STORE_KEY);
            return raw ? { ...this.getDefault(), ...JSON.parse(raw) } : this.getDefault();
        } catch (e) { return this.getDefault(); }
    },

    save(data) {
        localStorage.setItem(this.STORE_KEY, JSON.stringify(data));
    },

    /** 添加菜品到今日菜单 */
    addToToday(dish) {
        const data = this.load();
        if (!data.today.find(d => d.name === dish.name)) {
            data.today.push({ name: dish.name, icon: ILLUSTRATIONS.getDishIcon(dish.name), recipe: dish });
        }
        // 从待吃中移除
        data.wish = data.wish.filter(d => d.name !== dish.name);
        this.save(data);
        return data;
    },

    /** 添加菜品到待吃名单 */
    addToWish(dish) {
        const data = this.load();
        if (!data.wish.find(d => d.name === dish.name) && !data.today.find(d => d.name === dish.name)) {
            data.wish.push({ name: dish.name, icon: ILLUSTRATIONS.getDishIcon(dish.name), recipe: dish });
        }
        this.save(data);
        return data;
    },

    /** 从待吃移到今日 */
    moveToToday(dishName) {
        const data = this.load();
        const item = data.wish.find(d => d.name === dishName);
        if (item) {
            data.wish = data.wish.filter(d => d.name !== dishName);
            if (!data.today.find(d => d.name === dishName)) {
                data.today.push(item);
            }
            this.save(data);
        }
        return data;
    },

    /** 从今日移除 */
    removeFromToday(dishName) {
        const data = this.load();
        data.today = data.today.filter(d => d.name !== dishName);
        this.save(data);
        return data;
    },

    /** 从待吃移除 */
    removeFromWish(dishName) {
        const data = this.load();
        data.wish = data.wish.filter(d => d.name !== dishName);
        this.save(data);
        return data;
    },

    /** 清空今日 */
    clearToday() {
        const data = this.load();
        data.today = [];
        this.save(data);
        return data;
    },

    /** 清空待吃 */
    clearWish() {
        const data = this.load();
        data.wish = [];
        this.save(data);
        return data;
    },
};
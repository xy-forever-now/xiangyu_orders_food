// 默认菜单数据
const defaultMenuData = {
    饮品: [
        { id: 1, name: "珍珠奶茶", desc: "经典台式珍珠奶茶，Q弹珍珠", img: "🧋" },
        { id: 2, name: "水果茶", desc: "新鲜水果制作的茶饮，清爽解腻", img: "🍹" },
        { id: 3, name: "拿铁咖啡", desc: "香浓咖啡与丝滑牛奶的完美融合", img: "☕" },
        { id: 4, name: "抹茶奶绿", desc: "日式抹茶搭配鲜奶，清香不腻", img: "🍵" },
        { id: 5, name: "芒果冰沙", desc: "新鲜芒果制作的冰沙，夏日必备", img: "🥭" },
        { id: 6, name: "柠檬水", desc: "清新柠檬水，酸甜可口", img: "🍋" }
    ],
    食品: [
        { id: 11, name: "牛肉汉堡", desc: "澳洲牛肉饼，新鲜蔬菜，特制酱料", img: "🍔" },
        { id: 12, name: "黄金薯条", desc: "外酥里嫩，金黄诱人", img: "🍟" },
        { id: 13, name: "意式披萨", desc: "手工薄底披萨，丰富配料", img: "🍕" },
        { id: 14, name: "日式拉面", desc: "浓郁汤底，劲道面条", img: "🍜" },
        { id: 15, name: "韩式炸鸡", desc: "外酥里嫩，多种口味可选", img: "🍗" },
        { id: 16, name: "牛排套餐", desc: "澳洲牛排，配沙拉和面包", img: "🥩" }
    ],
    互动: [
        { id: 21, name: "桌游套装", desc: "多人桌游，增进友谊", img: "🎲" },
        { id: 22, name: "拼图游戏", desc: "1000片拼图，挑战耐心", img: "🧩" },
        { id: 23, name: "飞镖游戏", desc: "标准飞镖盘，娱乐竞技", img: "🎯" },
        { id: 24, name: "卡拉OK", desc: "2小时欢唱，包厢体验", img: "🎤" },
        { id: 25, name: "VR体验", desc: "虚拟现实游戏，沉浸体验", img: "🕹️" },
        { id: 26, name: "桌球小时", desc: "台球桌1小时使用", img: "🎱" }
    ],
    心情: [
        { id: 31, name: "解压玩具", desc: "可爱解压玩具，缓解压力", img: "🧸" },
        { id: 32, name: "香薰蜡烛", desc: "天然植物香薰，放松心情", img: "🕯️" },
        { id: 33, name: "心情日记", desc: "精美日记本，记录心情", img: "📔" },
        { id: 34, name: "治愈盆栽", desc: "小型绿植，净化空气", img: "🌱" },
        { id: 35, name: "音乐盒", desc: "经典旋律，温馨回忆", img: "🎵" },
        { id: 36, name: "星座运势", desc: "专属星座分析，了解运势", img: "✨" }
    ],
    甜品: [
        { id: 41, name: "草莓蛋糕", desc: "新鲜草莓，手工制作", img: "🍰" },
        { id: 42, name: "冰淇淋", desc: "奶油冰淇淋，多种口味", img: "🍦" },
        { id: 43, name: "马卡龙", desc: "法式马卡龙，色彩缤纷", img: "🧁" },
        { id: 44, name: "巧克力", desc: "进口巧克力，丝滑浓郁", img: "🍫" },
        { id: 45, name: "布丁", desc: "焦糖布丁，香甜嫩滑", img: "🍮" },
        { id: 46, name: "水果塔", desc: "新鲜水果塔，酥脆可口", img: "🥧" }
    ]
};

// 初始化菜单数据（从localStorage加载或使用默认数据）
function loadMenuData() {
    const savedData = localStorage.getItem('menuData');
    if (savedData) {
        menuData = JSON.parse(savedData);
    } else {
        menuData = JSON.parse(JSON.stringify(defaultMenuData));
        saveMenuData();
    }
}

// 保存菜单数据到localStorage
function saveMenuData() {
    localStorage.setItem('menuData', JSON.stringify(menuData));
}

// ==================== Supabase配置 ====================
// 请在这里填入你的Supabase项目信息
const SUPABASE_CONFIG = {
    url: 'https://vorwjvwwqdukkalxibiy.supabase.co', // 例如：https://yourproject.supabase.co
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvcndqdnd3cWR1a2thbHhpYml5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5Nzg5MTAsImV4cCI6MjA5MTU1NDkxMH0.YggaMVcOy_gqTyV9uxIHYRpDUWziQG_nttmf3QXcwyU' // 在Supabase项目设置中获取
};

let supabaseClient = null; // Supabase客户端实例
let pushPlusToken = ''; // 从数据库加载
let isAdmin = false; // 管理员状态

// 全局状态
let cart = [];
let currentCategory = '饮品';
let menuData = {};

// DOM元素
const productsGrid = document.getElementById('productsGrid');
const categoryBtns = document.querySelectorAll('.category-btn');
const categoryTitle = document.querySelector('.category-title');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');

// 添加商品弹窗相关元素
let addProductModal = null;
let addProductForm = null;

// 初始化
async function init() {
    // 初始化Supabase
    initSupabase();

    // 从数据库加载配置
    await loadConfigFromDB();

    loadMenuData();
    renderProducts(currentCategory);
    setupEventListeners();
    setupPushPlusConfig();
}

// 渲染商品
function renderProducts(category) {
    currentCategory = category;
    const products = menuData[category];

    productsGrid.setAttribute('data-category', category);
    
    // 生成商品卡片HTML
    let productsHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.img}
                <button class="delete-product-btn" onclick="event.stopPropagation(); deleteProduct(${product.id})" title="删除商品">🗑️</button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="quantity-selector">
                    <button class="qty-btn" onclick="event.stopPropagation(); changeQuantity(${product.id}, -1)">-</button>
                    <span class="qty-display" id="qty-${product.id}">1</span>
                    <button class="qty-btn" onclick="event.stopPropagation(); changeQuantity(${product.id}, 1)">+</button>
                </div>
                <button class="buy-btn" onclick="addToCartWithQuantity(${product.id})">加入购物车</button>
            </div>
        </div>
    `).join('');
    
    // 添加"添加商品"卡片
    productsHTML += `
        <div class="product-card add-product-card" onclick="openAddProductModal()">
            <div class="product-image add-product-image">
                <span class="add-icon">+</span>
            </div>
            <div class="product-info">
                <h3 class="product-name">添加商品</h3>
                <p class="product-desc">点击添加新商品</p>
            </div>
        </div>
    `;
    
    productsGrid.innerHTML = productsHTML;

    // 更新分类标题
    categoryTitle.textContent = category;
}

// 设置事件监听
function setupEventListeners() {
    // 分类切换
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            // 更新按钮状态
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 渲染对应分类商品
            renderProducts(category);
        });
        
        // 添加右键菜单支持（删除分类）
        btn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const category = btn.getAttribute('data-category');
            if (confirm(`是否删除「${category}」分类？`)) {
                deleteCategory(category);
            }
        });
    });

    // 购物车弹窗
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
        renderCart();
    });

    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });

    // 结算按钮
    checkoutBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            alert('购物车为空，请先添加商品！');
            return;
        }

        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

        // 发送PushPlus微信通知
        await sendPushPlusNotification(cart, itemCount);

        alert(`订单提交成功！\n共 ${itemCount} 件商品`);
        cart = [];
        updateCartCount();
        cartModal.classList.remove('active');
    });
}

// 添加到购物车（带数量）
function addToCartWithQuantity(productId) {
    const product = findProductById(productId);
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyDisplay.textContent);

    if (product && quantity > 0) {
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                ...product,
                quantity: quantity
            });
        }

        updateCartCount();

        // 重置数量选择器
        qtyDisplay.textContent = '1';

        // 显示添加成功提示
        showAddToCartAnimation();
    }
}

// 改变数量选择器
function changeQuantity(productId, change) {
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyDisplay.textContent);
    
    currentQty += change;
    
    // 数量不能小于1
    if (currentQty < 1) {
        currentQty = 1;
    }
    
    // 数量不能超过99
    if (currentQty > 99) {
        currentQty = 99;
    }
    
    qtyDisplay.textContent = currentQty;
}

// 查找商品
function findProductById(id) {
    for (const category in menuData) {
        const product = menuData[category].find(p => p.id === id);
        if (product) {
            return product;
        }
    }
    return null;
}

// 更新购物车数量
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// 渲染购物车
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <div class="empty-cart-text">购物车为空</div>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.img}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">删除</button>
            </div>
        </div>
    `).join('');
}

// 更新商品数量
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);

    if (item) {
        item.quantity += change;

        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            renderCart();
        }
    }
}

// 从购物车删除商品
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}

// 添加到购物车动画
function showAddToCartAnimation() {
    const cartBtn = document.getElementById('cartBtn');
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1)';
    }, 200);
}

// 打开添加商品弹窗
function openAddProductModal() {
    createAddProductModal();
    addProductModal.classList.add('active');
}

// 关闭添加商品弹窗
function closeAddProductModal() {
    if (addProductModal) {
        addProductModal.classList.remove('active');
    }
}

// 创建添加商品弹窗
function createAddProductModal() {
    if (addProductModal) return;
    
    addProductModal = document.createElement('div');
    addProductModal.className = 'cart-modal';
    addProductModal.id = 'addProductModal';
    
    addProductModal.innerHTML = `
        <div class="cart-content">
            <div class="cart-header">
                <h3>➕ 添加商品 - ${currentCategory}</h3>
                <button class="close-btn" id="closeAddProduct">✕</button>
            </div>
            <div class="cart-items">
                <form id="addProductForm" class="add-product-form">
                    <div class="form-group">
                        <label for="productName">商品名称：</label>
                        <input type="text" id="productName" required placeholder="请输入商品名称">
                    </div>
                    <div class="form-group">
                        <label for="productDesc">商品描述：</label>
                        <textarea id="productDesc" rows="3" placeholder="请输入商品描述"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="productImage">商品图片：</label>
                        <select id="productImage">
                            <option value="🍽️">🍽️ 餐具</option>
                            <option value="🧋">🧋 奶茶</option>
                            <option value="🍹">🍹 果汁</option>
                            <option value="☕">☕ 咖啡</option>
                            <option value="🍵">🍵 茶</option>
                            <option value="🥭">🥭 芒果</option>
                            <option value="🍋">🍋 柠檬</option>
                            <option value="🍔">🍔 汉堡</option>
                            <option value="🍟">🍟 薯条</option>
                            <option value="🍕">🍕 披萨</option>
                            <option value="🍜">🍜 拉面</option>
                            <option value="🍗">🍗 炸鸡</option>
                            <option value="🥩">🥩 牛排</option>
                            <option value="🎲">🎲 桌游</option>
                            <option value="🧩">🧩 拼图</option>
                            <option value="🎯">🎯 飞镖</option>
                            <option value="🎤">🎤 麦克风</option>
                            <option value="🕹️">🕹️ 游戏</option>
                            <option value="🎱">🎱 桌球</option>
                            <option value="🧸">🧸 玩具</option>
                            <option value="🕯️">🕯️ 蜡烛</option>
                            <option value="📔">📔 日记本</option>
                            <option value="🌱">🌱 植物</option>
                            <option value="🎵">🎵 音乐</option>
                            <option value="✨">✨ 星星</option>
                            <option value="🍰">🍰 蛋糕</option>
                            <option value="🍦">🍦 冰淇淋</option>
                            <option value="🧁">🧁 纸杯蛋糕</option>
                            <option value="🍫">🍫 巧克力</option>
                            <option value="🍮">🍮 布丁</option>
                            <option value="🥧">🥧 派</option>
                        </select>
                    </div>
                    <button type="submit" class="checkout-btn">确认添加</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(addProductModal);
    
    // 设置事件监听
    const closeBtn = addProductModal.querySelector('#closeAddProduct');
    closeBtn.addEventListener('click', closeAddProductModal);
    
    addProductModal.addEventListener('click', (e) => {
        if (e.target === addProductModal) {
            closeAddProductModal();
        }
    });
    
    addProductForm = addProductModal.querySelector('#addProductForm');
    addProductForm.addEventListener('submit', handleAddProduct);
}

// 处理添加商品
function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value.trim();
    const desc = document.getElementById('productDesc').value.trim() || '暂无描述';
    const img = document.getElementById('productImage').value;
    
    if (!name) {
        alert('请填写商品名称！');
        return;
    }
    
    // 生成唯一ID
    const newId = generateProductId();
    
    // 添加新商品
    const newProduct = {
        id: newId,
        name: name,
        desc: desc,
        img: img
    };
    
    menuData[currentCategory].push(newProduct);
    saveMenuData();
    
    // 重新渲染商品列表
    renderProducts(currentCategory);
    
    // 关闭弹窗并清空表单
    closeAddProductModal();
    addProductForm.reset();
    
    alert('商品添加成功！');
}

// 生成唯一商品ID
function generateProductId() {
    let maxId = 0;
    for (const category in menuData) {
        menuData[category].forEach(product => {
            if (product.id > maxId) {
                maxId = product.id;
            }
        });
    }
    return maxId + 1;
}

// 删除商品
function deleteProduct(productId) {
    if (!confirm('确定要删除这个商品吗？')) {
        return;
    }
    
    // 查找并删除商品
    for (const category in menuData) {
        const index = menuData[category].findIndex(p => p.id === productId);
        if (index !== -1) {
            menuData[category].splice(index, 1);
            saveMenuData();
            renderProducts(currentCategory);
            alert('商品已删除！');
            return;
        }
    }
}

// 删除分类
function deleteCategory(category) {
    if (!confirm(`确定要删除「${category}」分类及其所有商品吗？此操作不可恢复！`)) {
        return;
    }
    
    delete menuData[category];
    saveMenuData();
    
    // 如果删除的是当前分类，切换到第一个可用分类
    if (currentCategory === category) {
        const categories = Object.keys(menuData);
        if (categories.length > 0) {
            currentCategory = categories[0];
            // 更新侧边栏激活状态
            categoryBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-category') === currentCategory) {
                    btn.classList.add('active');
                }
            });
            renderProducts(currentCategory);
        } else {
            productsGrid.innerHTML = '<div style="text-align:center;padding:40px;color:#95a5a6;">暂无分类，请刷新页面重置数据</div>';
            categoryTitle.textContent = '无分类';
        }
    }
    
    // 移除对应的分类按钮
    const categoryBtn = document.querySelector(`.category-btn[data-category="${category}"]`);
    if (categoryBtn) {
        categoryBtn.remove();
    }
    
    alert(`「${category}」分类已删除！`);
}

// ==================== Supabase相关函数 ====================

// 初始化Supabase客户端
function initSupabase() {
    try {
        if (typeof window.supabase !== 'undefined' && SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL') {
            supabaseClient = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
            console.log('✅ Supabase初始化成功');
        } else if (SUPABASE_CONFIG.url === 'YOUR_SUPABASE_URL') {
            console.warn('⚠️ 请先配置Supabase连接信息');
        } else {
            console.error('❌ Supabase客户端库未加载');
        }
    } catch (error) {
        console.error('❌ Supabase初始化失败:', error);
    }
}

// 从数据库加载配置
async function loadConfigFromDB() {
    console.log('📥 开始从数据库加载配置...');

    if (!supabaseClient) {
        console.warn('⚠️ Supabase未初始化，跳过数据库配置加载');
        showPushPlusConfigModal();
        return;
    }

    try {
        console.log('📡 正在从数据库查询配置...');

        const { data, error } = await supabaseClient
            .from('app_config')
            .select('pushplus_token')
            .eq('id', 1)
            .single();

        console.log('数据库查询结果:', { data, error });

        if (error) {
            console.error('❌ 加载配置失败:', error);
            console.error('错误详情:', JSON.stringify(error));
            showPushPlusConfigModal();
            return;
        }

        if (data && data.pushplus_token) {
            pushPlusToken = data.pushplus_token;
            console.log('✅ 从数据库加载配置成功');
            console.log('Token前6位:', pushPlusToken.substring(0, 6) + '...');
            console.log('Token长度:', pushPlusToken.length);
            addPushPlusReconfigButton();
        } else {
            console.log('📝 数据库中暂无配置，显示配置界面');
            showPushPlusConfigModal();
        }
    } catch (error) {
        console.error('❌ 加载配置出错:', error);
        showPushPlusConfigModal();
    }
}

// 保存配置到数据库
async function saveConfigToDB(token) {
    console.log('💾 开始保存配置到数据库...');
    console.log('Token前6位:', token.substring(0, 6) + '...');

    if (!supabaseClient) {
        console.error('❌ Supabase客户端未初始化');
        alert('❌ Supabase未配置，无法保存到云端');
        return false;
    }

    try {
        console.log('📡 正在向数据库发送更新请求...');

        const { data, error } = await supabaseClient
            .from('app_config')
            .update({
                pushplus_token: token,
                updated_at: new Date().toISOString()
            })
            .eq('id', 1)
            .select();

        console.log('数据库返回结果:', { data, error });

        if (error) {
            console.error('❌ 保存配置失败:', error);
            console.error('错误详情:', JSON.stringify(error));
            return false;
        }

        console.log('✅ 配置保存到数据库成功');
        console.log('保存的Token前6位:', token.substring(0, 6) + '...');
        return true;
    } catch (error) {
        console.error('❌ 保存配置出错:', error);
        return false;
    }
}

// 验证管理员密码
async function verifyAdminPassword(password) {
    if (!supabaseClient) {
        return password === 'admin123'; // 降级到本地验证
    }

    try {
        const { data, error } = await supabaseClient
            .from('app_config')
            .select('admin_password')
            .eq('id', 1)
            .single();

        if (error) {
            console.error('❌ 验证密码失败:', error);
            return false;
        }

        return data && data.admin_password === password;
    } catch (error) {
        console.error('❌ 验证密码出错:', error);
        return false;
    }
}

// ==================== 配置管理相关函数 ====================

// 设置PushPlus配置
function setupPushPlusConfig() {
    // 配置已在loadConfigFromDB中检查
}

// 显示PushPlus配置弹窗
function showPushPlusConfigModal() {
    const configModal = document.createElement('div');
    configModal.className = 'cart-modal active';
    configModal.id = 'pushPlusConfigModal';

    configModal.innerHTML = `
        <div class="cart-content">
            <div class="cart-header">
                <h3>📱 配置PushPlus微信推送</h3>
                <button class="close-btn" onclick="document.getElementById('pushPlusConfigModal').remove()">✕</button>
            </div>
            <div class="cart-items">
                <div style="padding: 20px;">
                    <p style="margin-bottom: 15px; color: #2c3e50; line-height: 1.6;">
                        PushPlus可以将订单信息推送到您的微信，每天免费200条推送。<br>
                        <strong style="color: #667eea;">配置保存在云端，所有用户共享。</strong>
                    </p>

                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="adminPassword" style="display: block; font-size: 14px; font-weight: 600; color: #2c3e50; margin-bottom: 8px;">
                            管理员密码：
                        </label>
                        <input type="password" id="adminPassword" placeholder="请输入管理员密码"
                               style="width: 100%; padding: 12px; border: 2px solid #ecf0f1; border-radius: 8px; font-size: 14px;">
                        <p style="font-size: 12px; color: #7f8c8d; margin-top: 5px;">默认密码：admin123</p>
                    </div>

                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="pushPlusKey" style="display: block; font-size: 14px; font-weight: 600; color: #2c3e50; margin-bottom: 8px;">
                            Token：
                        </label>
                        <input type="text" id="pushPlusKey" placeholder="请输入您的PushPlus Token"
                               style="width: 100%; padding: 12px; border: 2px solid #ecf0f1; border-radius: 8px; font-size: 14px;">
                        <p style="font-size: 12px; color: #7f8c8d; margin-top: 8px; line-height: 1.5;">
                            还没有Token？
                            <a href="http://www.pushplus.plus/" target="_blank" style="color: #667eea; text-decoration: none;">
                                点击这里免费获取
                            </a>
                        </p>
                    </div>

                    <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin-bottom: 15px; font-size: 13px; color: #2c3e50; line-height: 1.6;">
                        <strong>使用说明：</strong><br>
                        1. 访问 PushPlus 官网并微信扫码登录<br>
                        2. 进入"发送消息"页面复制您的Token<br>
                        3. 输入管理员密码和Token<br>
                        4. 点击保存后即可使用微信推送（每天免费200条）
                    </div>

                    <button id="savePushPlusKey" class="checkout-btn" style="padding: 12px; font-size: 16px;">
                        💾 保存到云端
                    </button>
                    <button id="skipPushPlusConfig" class="remove-btn" style="margin-left: 10px; padding: 12px 20px;">
                        跳过
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(configModal);

    // 保存配置
    document.getElementById('savePushPlusKey').addEventListener('click', async () => {
        const password = document.getElementById('adminPassword').value.trim();
        const inputKey = document.getElementById('pushPlusKey').value.trim();

        if (!password) {
            alert('❌ 请输入管理员密码！');
            return;
        }

        if (!inputKey) {
            alert('❌ 请输入有效的Token！');
            return;
        }

        // 验证密码
        const isValid = await verifyAdminPassword(password);
        if (!isValid) {
            alert('❌ 管理员密码错误！');
            return;
        }

        // 保存到数据库
        const success = await saveConfigToDB(inputKey);
        if (success) {
            pushPlusToken = inputKey;
            console.log('PushPlus Token已保存到云端，前6位:', inputKey.substring(0, 6) + '...');
            alert('✅ PushPlus配置保存成功！\nToken: ' + inputKey.substring(0, 10) + '...\n已保存到云端数据库');
            configModal.remove();
            addPushPlusReconfigButton();
        } else {
            alert('❌ 保存失败，请检查网络连接');
        }
    });

    // 跳过配置
    document.getElementById('skipPushPlusConfig').addEventListener('click', () => {
        if (confirm('跳过后将不会发送微信通知，可以稍后在页面底部重新配置。确定跳过吗？')) {
            configModal.remove();
        }
    });

    // 点击背景关闭
    configModal.addEventListener('click', (e) => {
        if (e.target === configModal) {
            if (confirm('确定要关闭配置窗口吗？')) {
                configModal.remove();
            }
        }
    });
}

// 发送PushPlus通知
async function sendPushPlusNotification(cart, itemCount) {
    console.log('🔍 检查推送配置...');
    console.log('当前Token状态:', pushPlusToken ? '已配置' : '未配置');
    console.log('Token长度:', pushPlusToken ? pushPlusToken.length : 0);

    if (!pushPlusToken) {
        console.log('❌ 未配置PushPlus Token，跳过推送');
        return;
    }

    // 构建订单详情
    const orderTime = new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    let orderDetails = cart.map(item => {
        return `${item.img} ${item.name} × ${item.quantity}`;
    }).join('<br>');

    const message = `
📦 <strong>新订单通知</strong>

<hr style="border: 1px dashed #ccc;">

📅 时间：${orderTime}<br>
🔢 总件数：${itemCount} 件

<h3>📋 订单详情：</h3>
${orderDetails}
    `;

    const title = `🍽️ 雨膳房 - 新订单 (${itemCount}件)`;

    try {
        console.log('正在发送微信推送...');
        console.log('Token前6位:', pushPlusToken.substring(0, 6) + '...');

        // PushPlus API - 使用HTTPS避免跨域问题
        const response = await fetch('https://www.pushplus.plus/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: pushPlusToken,
                title: title,
                content: message,
                template: 'html'
            })
        });

        const result = await response.json();
        console.log('PushPlus返回结果:', result);

        if (result.code === 200) {
            console.log('✅ 微信推送发送成功！');
        } else {
            console.error('❌ 微信推送发送失败：', result.msg);
        }
    } catch (error) {
        console.error('❌ 微信推送发送出错：', error);
    }
}

// 添加重新配置按钮到页面
function addPushPlusReconfigButton() {
    // 移除旧按钮（如果存在）
    const oldBtn = document.getElementById('pushPlusReconfigBtn');
    if (oldBtn) {
        oldBtn.remove();
    }

    const reconfigBtn = document.createElement('button');
    reconfigBtn.id = 'pushPlusReconfigBtn';
    reconfigBtn.innerHTML = '🔧 推送设置';
    reconfigBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50px;
        padding: 12px 20px;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        z-index: 999;
        transition: all 0.3s ease;
    `;

    reconfigBtn.addEventListener('mouseenter', () => {
        reconfigBtn.style.transform = 'scale(1.05)';
    });

    reconfigBtn.addEventListener('mouseleave', () => {
        reconfigBtn.style.transform = 'scale(1)';
    });

    reconfigBtn.addEventListener('click', () => {
        showAdminPasswordModal();
    });

    document.body.appendChild(reconfigBtn);
}

// 显示管理员密码验证弹窗
function showAdminPasswordModal() {
    const passwordModal = document.createElement('div');
    passwordModal.className = 'cart-modal active';
    passwordModal.id = 'adminPasswordModal';

    passwordModal.innerHTML = `
        <div class="cart-content" style="max-width: 400px;">
            <div class="cart-header">
                <h3>🔐 管理员验证</h3>
                <button class="close-btn" onclick="document.getElementById('adminPasswordModal').remove()">✕</button>
            </div>
            <div class="cart-items">
                <div style="padding: 20px;">
                    <p style="margin-bottom: 20px; color: #2c3e50; text-align: center;">
                        请输入管理员密码以继续配置推送设置
                    </p>
                    <div class="form-group">
                        <input type="password" id="adminPasswordInput" placeholder="请输入管理员密码"
                               style="width: 100%; padding: 12px; border: 2px solid #ecf0f1; border-radius: 8px; font-size: 14px; margin-bottom: 15px;"
                               onkeypress="if(event.key==='Enter') document.getElementById('verifyPasswordBtn').click()">
                        <p style="font-size: 12px; color: #7f8c8d; margin-bottom: 15px;">默认密码：admin123</p>
                    </div>
                    <button id="verifyPasswordBtn" class="checkout-btn" style="padding: 12px; font-size: 16px; width: 100%;">
                        验证密码
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(passwordModal);

    // 验证密码
    document.getElementById('verifyPasswordBtn').addEventListener('click', async () => {
        const password = document.getElementById('adminPasswordInput').value.trim();

        if (!password) {
            alert('❌ 请输入管理员密码！');
            return;
        }

        // 验证密码
        const isValid = await verifyAdminPassword(password);
        if (isValid) {
            console.log('✅ 管理员密码验证成功');
            passwordModal.remove();
            showPushPlusConfigModal();
        } else {
            alert('❌ 管理员密码错误！');
        }
    });

    // 点击背景关闭
    passwordModal.addEventListener('click', (e) => {
        if (e.target === passwordModal) {
            passwordModal.remove();
        }
    });
}

// 页面加载完成后添加配置按钮
document.addEventListener('DOMContentLoaded', () => {
    init();
    if (pushPlusToken) {
        addPushPlusReconfigButton();
    }
});
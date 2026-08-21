<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VGS— Vortix Gaming Store</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <style>
        /* ---------- RESET & VARIABLES ---------- */
        :root {
            --primary: #5b3df5;
            --primary-light: #8b6fff;
            --primary-dark: #2f168f;
            --dark: #0f0e17;
            --dark-2: #1a1926;
            --text: #1e1b2e;
            --muted: #6d6a7e;
            --bg: #fbfaff;
            --white: #ffffff;
            --border: #e7e4f2;
            --radius: 22px;
            --shadow-sm: 0 10px 25px rgba(20, 10, 60, 0.06);
            --shadow-md: 0 20px 45px rgba(20, 10, 60, 0.1);
            --shadow-lg: 0 30px 60px rgba(30, 20, 80, 0.12);
            --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            line-height: 1.5;
            overflow-x: hidden;
        }

        a {
            text-decoration: none;
            color: inherit;
            transition: var(--transition);
        }

        button {
            font-family: inherit;
            cursor: pointer;
            border: none;
            background: none;
        }

        /* ---------- NAVBAR ---------- */
        .navbar {
            position: sticky;
            top: 0;
            z-index: 100;
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border-bottom: 1px solid rgba(0, 0, 0, 0.04);
            box-shadow: 0 4px 25px rgba(0, 0, 0, 0.02);
        }

        .nav-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 16px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
        }

        .logo {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -1.5px;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: var(--transition);
        }

        .logo:hover {
            transform: scale(1.03);
        }

        .logo span {
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .nav-links {
            display: flex;
            gap: 34px;
            font-weight: 600;
            font-size: 14px;
            color: #4b4858;
        }

        .nav-links a {
            position: relative;
            padding: 6px 0;
        }

        .nav-links a::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--primary);
            border-radius: 10px;
            transition: var(--transition);
        }

        .nav-links a:hover {
            color: var(--primary);
        }

        .nav-links a:hover::after {
            width: 100%;
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .icon-btn {
            width: 46px;
            height: 46px;
            border-radius: 14px;
            background: var(--white);
            border: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
        }

        .icon-btn:hover {
            transform: translateY(-3px);
            border-color: var(--primary-light);
            background: #f6f3ff;
            box-shadow: 0 12px 25px rgba(91, 61, 245, 0.12);
        }

        .login-btn {
            padding: 12px 24px;
            border-radius: 14px;
            background: var(--dark);
            color: white;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.3px;
            transition: all 0.3s ease;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .login-btn:hover {
            background: var(--primary);
            transform: translateY(-2px);
            box-shadow: 0 12px 28px rgba(91, 61, 245, 0.25);
        }

        /* ---------- HERO ---------- */
        .hero {
            max-width: 1280px;
            margin: 30px auto 0;
            padding: 70px 64px;
            border-radius: 38px;
            background:
                radial-gradient(circle at 85% 15%, rgba(139, 111, 255, 0.3) 0%, transparent 35%),
                radial-gradient(circle at 60% 110%, rgba(180, 155, 255, 0.25) 0%, transparent 40%),
                radial-gradient(circle at 10% 90%, rgba(91, 61, 245, 0.2) 0%, transparent 30%),
                linear-gradient(145deg, #151226 0%, #211d3b 100%);
            color: white;
            position: relative;
            overflow: hidden;
            box-shadow: 0 40px 80px rgba(20, 10, 60, 0.25);
            isolation: isolate;
        }

        .hero::before {
            content: '';
            position: absolute;
            inset: 0;
            background: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="white" fill-opacity="0.03"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');
            z-index: 0;
        }

        .hero-content {
            max-width: 640px;
            position: relative;
            z-index: 2;
            animation: fadeUp 0.8s ease-out;
        }

        @keyframes fadeUp {
            0% {
                opacity: 0;
                transform: translateY(25px);
            }

            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .hero-label {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 9px 18px;
            border-radius: 100px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.2px;
            text-transform: uppercase;
            margin-bottom: 24px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .hero h1 {
            font-size: clamp(44px, 7vw, 78px);
            line-height: 0.98;
            margin: 0 0 24px;
            letter-spacing: -3.5px;
            font-weight: 800;
            text-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
        }

        .hero h1 .gradient-text {
            background: linear-gradient(135deg, #ffffff 30%, #b3a0ff 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        .hero p {
            color: #c7c3d6;
            line-height: 1.8;
            font-size: 17px;
            max-width: 520px;
            margin-bottom: 34px;
        }

        .hero-btn {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: white;
            color: var(--dark);
            padding: 16px 32px;
            border-radius: 16px;
            font-weight: 800;
            font-size: 16px;
            letter-spacing: -0.2px;
            transition: all 0.35s ease;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
        }

        .hero-btn:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            background: #f0edff;
        }

        .hero-btn .arrow {
            transition: transform 0.3s ease;
        }

        .hero-btn:hover .arrow {
            transform: translateX(5px);
        }

        /* ---------- SECTIONS ---------- */
        .section {
            max-width: 1280px;
            margin: 90px auto;
            padding: 0 32px;
        }

        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 32px;
            gap: 20px;
        }

        .section-title {
            font-size: 36px;
            font-weight: 800;
            letter-spacing: -2px;
            line-height: 1.1;
            margin: 0;
        }

        .section-subtitle {
            color: var(--muted);
            font-size: 15px;
            margin-top: 8px;
            letter-spacing: -0.1px;
        }

        .view-all {
            color: var(--primary);
            font-weight: 700;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 16px;
            border-radius: 20px;
            transition: var(--transition);
            background: rgba(91, 61, 245, 0.06);
        }

        .view-all:hover {
            background: rgba(91, 61, 245, 0.12);
            transform: translateX(3px);
        }

        /* ---------- CATEGORIES ---------- */
        .categories {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 18px;
        }

        .category {
            padding: 28px 24px;
            background: var(--white);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            transition: all 0.35s ease;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            box-shadow: var(--shadow-sm);
        }

        .category::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background: linear-gradient(90deg, var(--primary), var(--primary-light));
            opacity: 0;
            transition: var(--transition);
        }

        .category:hover {
            transform: translateY(-8px);
            box-shadow: var(--shadow-md);
            border-color: transparent;
        }

        .category:hover::before {
            opacity: 1;
        }

        .category-icon {
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 18px;
            background: linear-gradient(135deg, #efebff, #e0d7ff);
            font-size: 28px;
            margin-bottom: 18px;
            transition: var(--transition);
        }

        .category:hover .category-icon {
            background: linear-gradient(135deg, var(--primary), var(--primary-light));
            transform: scale(1.1) rotate(-5deg);
        }

        .category h3 {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: -0.3px;
            margin-bottom: 6px;
        }

        .category p {
            color: var(--muted);
            font-size: 13px;
        }

        /* ---------- PRODUCTS ---------- */
        .products {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
        }

        .product-card {
            background: var(--white);
            border: 1px solid var(--border);
            border-radius: 24px;
            overflow: hidden;
            transition: all 0.4s ease;
            box-shadow: var(--shadow-sm);
            display: flex;
            flex-direction: column;
        }

        .product-card:hover {
            transform: translateY(-12px);
            box-shadow: var(--shadow-lg);
            border-color: transparent;
        }

        .product-image {
            height: 240px;
            background: linear-gradient(145deg, #f3f1fb, #e6e0f7);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 80px;
            position: relative;
            overflow: hidden;
            transition: var(--transition);
        }

        .product-card:hover .product-image {
            background: linear-gradient(145deg, #e8e2ff, #d9d0fb);
        }

        .product-image::after {
            content: '';
            position: absolute;
            bottom: -20px;
            right: -20px;
            width: 100px;
            height: 100px;
            background: rgba(91, 61, 245, 0.08);
            border-radius: 50%;
            transition: var(--transition);
        }

        .product-card:hover .product-image::after {
            transform: scale(1.6);
        }

        .favorite {
            position: absolute;
            top: 16px;
            right: 16px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            font-size: 18px;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
            z-index: 3;
        }

        .favorite:hover {
            background: white;
            transform: scale(1.15);
            color: #ff4d6d;
        }

        .product-info {
            padding: 20px 22px 22px;
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .product-category {
            color: var(--primary);
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.8px;
            font-weight: 800;
            margin-bottom: 6px;
        }

        .product-name {
            font-size: 17px;
            font-weight: 700;
            letter-spacing: -0.4px;
            margin-bottom: 6px;
        }

        .rating {
            font-size: 13px;
            color: #f5a623;
            letter-spacing: 1px;
            margin-bottom: 12px;
        }

        .rating span {
            color: var(--muted);
            margin-left: 8px;
            letter-spacing: 0;
        }

        .product-bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: auto;
            padding-top: 10px;
        }

        .price {
            font-size: 19px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }

        .add-cart {
            background: var(--dark);
            color: white;
            border-radius: 12px;
            padding: 10px 16px;
            font-weight: 700;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .add-cart:hover {
            background: var(--primary);
            transform: scale(1.08);
            box-shadow: 0 8px 25px rgba(91, 61, 245, 0.3);
        }

        /* ---------- FEATURES ---------- */
        .features {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .feature {
            background: var(--white);
            padding: 28px 24px;
            border-radius: 24px;
            border: 1px solid var(--border);
            transition: all 0.35s ease;
            box-shadow: var(--shadow-sm);
            position: relative;
            overflow: hidden;
        }

        .feature::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 80px;
            height: 80px;
            background: radial-gradient(circle, rgba(91, 61, 245, 0.04) 0%, transparent 70%);
            border-radius: 50%;
            transition: var(--transition);
        }

        .feature:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-md);
            border-color: transparent;
        }

        .feature:hover::after {
            transform: scale(1.4);
        }

        .feature-icon {
            font-size: 28px;
            margin-bottom: 16px;
            display: inline-block;
            background: linear-gradient(135deg, #efebff, #e2d9ff);
            border-radius: 14px;
            padding: 10px 12px;
        }

        .feature h3 {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.3px;
        }

        .feature p {
            color: var(--muted);
            font-size: 13px;
            line-height: 1.6;
        }

        /* ---------- FOOTER ---------- */
        footer {
            margin-top: 100px;
            background: linear-gradient(145deg, #0f0e17 0%, #1a1926 100%);
            color: white;
            border-radius: 40px 40px 0 0;
            position: relative;
            overflow: hidden;
        }

        footer::before {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(91, 61, 245, 0.15) 0%, transparent 70%);
            border-radius: 50%;
        }

        .footer-container {
            max-width: 1280px;
            margin: 0 auto;
            padding: 60px 32px 40px;
            display: flex;
            justify-content: space-between;
            gap: 40px;
            flex-wrap: wrap;
            position: relative;
            z-index: 2;
        }

        .footer-brand .logo {
            color: white;
            font-size: 30px;
            margin-bottom: 16px;
        }

        .footer-brand p {
            color: #9b98a6;
            max-width: 360px;
            line-height: 1.7;
            font-size: 14px;
        }

        .footer-links {
            display: flex;
            gap: 60px;
            flex-wrap: wrap;
        }

        .footer-links div {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .footer-links strong {
            font-size: 15px;
            margin-bottom: 8px;
            letter-spacing: 0.3px;
        }

        .footer-links a {
            color: #9b98a6;
            font-size: 13px;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .footer-links a:hover {
            color: white;
            transform: translateX(4px);
        }

        .copyright {
            max-width: 1280px;
            margin: 0 auto;
            padding: 24px 32px;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            color: #777482;
            font-size: 12px;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
            position: relative;
            z-index: 2;
        }

        /* ---------- RESPONSIVE ---------- */
        @media (max-width: 1024px) {

            .categories,
            .products,
            .features {
                grid-template-columns: repeat(2, 1fr);
            }

            .hero {
                padding: 55px 40px;
                margin: 20px 16px 0;
            }
        }

        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }

            .hero {
                padding: 45px 28px;
                border-radius: 28px;
                margin: 16px 12px 0;
            }

            .section {
                margin: 60px auto;
                padding: 0 20px;
            }

            .section-title {
                font-size: 28px;
                letter-spacing: -1px;
            }

            .footer-container {
                flex-direction: column;
            }

            .footer-links {
                gap: 30px;
            }
        }

        @media (max-width: 560px) {
            .nav-container {
                padding: 12px 16px;
            }

            .login-btn {
                padding: 10px 16px;
                font-size: 13px;
            }

            .icon-btn {
                width: 40px;
                height: 40px;
            }

            .hero {
                padding: 35px 20px;
            }

            .hero h1 {
                letter-spacing: -2px;
                font-size: 40px;
            }

            .categories,
            .products,
            .features {
                grid-template-columns: 1fr;
                gap: 16px;
            }

            .section-header {
                flex-direction: column;
                align-items: flex-start;
            }

            .view-all {
                margin-top: 8px;
            }

            .copyright {
                flex-direction: column;
                text-align: center;
            }
        }
    </style>
</head>

<body>

    <!-- NAVBAR -->
    <nav class="navbar">
        <div class="nav-container">
            <a href="/" class="logo">Shop<span>Ease</span></a>
            <div class="nav-links">
                <a href="/">Home</a>
                <a href="#products">Products</a>
                <a href="#categories">Categories</a>
                <a href="#features">Why Us</a>
            </div>
            <div class="nav-actions">
                <button class="icon-btn" title="Search">🔍</button>
                <button class="icon-btn" title="Shopping Cart">🛒</button>
                @if (Route::has('login'))
                @auth
                <a href="{{ url('/dashboard') }}" class="login-btn">📊 Dashboard</a>
                @else
                <a href="{{ route('login') }}" class="login-btn">🔐 Login</a>
                @endauth
                @endif
            </div>
        </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
        <div class="hero-content">
            <span class="hero-label">✨ NEW COLLECTION 2026</span>
            <h1>Everything you need.<br><span class="gradient-text">All in one place.</span></h1>
            <p>Discover products you'll love with a simple, modern and enjoyable shopping experience. Find your favorites and make every purchase count.</p>
            <a href="#products" class="hero-btn">Shop Now <span class="arrow">→</span></a>
        </div>
    </section>

    <!-- CATEGORIES -->
    <section class="section" id="categories">
        <div class="section-header">
            <div>
                <h2 class="section-title">Shop by Category</h2>
                <p class="section-subtitle">Find what you're looking for faster.</p>
            </div>
            <a href="#products" class="view-all">View all →</a>
        </div>
        <div class="categories">
            <div class="category">
                <div class="category-icon">💻</div>
                <h3>Electronics</h3>
                <p>Smart devices & gadgets</p>
            </div>
            <div class="category">
                <div class="category-icon">👕</div>
                <h3>Fashion</h3>
                <p>Style for every occasion</p>
            </div>
            <div class="category">
                <div class="category-icon">🎮</div>
                <h3>Gaming</h3>
                <p>Gear up and play</p>
            </div>
            <div class="category">
                <div class="category-icon">🏠</div>
                <h3>Lifestyle</h3>
                <p>Make life more comfortable</p>
            </div>
        </div>
    </section>

    <!-- PRODUCTS -->
    <section class="section" id="products">
        <div class="section-header">
            <div>
                <h2 class="section-title">Featured Products</h2>
                <p class="section-subtitle">Popular products picked just for you.</p>
            </div>
            <a href="#" class="view-all">View all →</a>
        </div>
        <div class="products">
            <!-- PRODUCT 1 -->
            <article class="product-card">
                <div class="product-image">🎧<button class="favorite">♡</button></div>
                <div class="product-info">
                    <div class="product-category">Electronics</div>
                    <h3 class="product-name">Wireless Headphone</h3>
                    <div class="rating">★★★★★ <span>(128)</span></div>
                    <div class="product-bottom">
                        <div class="price">Rp 499.000</div><button class="add-cart" onclick="addToCart('Wireless Headphone')">+ Add</button>
                    </div>
                </div>
            </article>
            <!-- PRODUCT 2 -->
            <article class="product-card">
                <div class="product-image">⌨️<button class="favorite">♡</button></div>
                <div class="product-info">
                    <div class="product-category">Gaming</div>
                    <h3 class="product-name">Mechanical Keyboard</h3>
                    <div class="rating">★★★★★ <span>(94)</span></div>
                    <div class="product-bottom">
                        <div class="price">Rp 799.000</div><button class="add-cart" onclick="addToCart('Mechanical Keyboard')">+ Add</button>
                    </div>
                </div>
            </article>
            <!-- PRODUCT 3 -->
            <article class="product-card">
                <div class="product-image">🖱️<button class="favorite">♡</button></div>
                <div class="product-info">
                    <div class="product-category">Gaming</div>
                    <h3 class="product-name">Gaming Mouse</h3>
                    <div class="rating">★★★★☆ <span>(76)</span></div>
                    <div class="product-bottom">
                        <div class="price">Rp 349.000</div><button class="add-cart" onclick="addToCart('Gaming Mouse')">+ Add</button>
                    </div>
                </div>
            </article>
            <!-- PRODUCT 4 -->
            <article class="product-card">
                <div class="product-image">⌚<button class="favorite">♡</button></div>
                <div class="product-info">
                    <div class="product-category">Lifestyle</div>
                    <h3 class="product-name">Smart Watch</h3>
                    <div class="rating">★★★★★ <span>(112)</span></div>
                    <div class="product-bottom">
                        <div class="price">Rp 899.000</div><button class="add-cart" onclick="addToCart('Smart Watch')">+ Add</button>
                    </div>
                </div>
            </article>
        </div>
    </section>

    <!-- FEATURES -->
    <section class="section" id="features">
        <div class="section-header">
            <div>
                <h2 class="section-title">VGS?</h2>
                <p class="section-subtitle">Shopping made simple.</p>
            </div>
        </div>
        <div class="features">
            <div class="feature">
                <div class="feature-icon">🚚</div>
                <h3>Fast Delivery</h3>
                <p>Get your products delivered quickly and safely to your doorstep.</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🔒</div>
                <h3>Secure Shopping</h3>
                <p>Your shopping experience is designed with security in mind.</p>
            </div>
            <div class="feature">
                <div class="feature-icon">💳</div>
                <h3>Easy Payment</h3>
                <p>Simple payment experience with multiple options available.</p>
            </div>
            <div class="feature">
                <div class="feature-icon">⭐</div>
                <h3>Trusted Products</h3>
                <p>Discover products with ratings and reviews from customers.</p>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer>
        <div class="footer-container">
            <div class="footer-brand">
                <div class="logo">Shop<span>Ease</span></div>
                <p>A modern online shopping experience designed to make finding your favorite products easier.</p>
            </div>
            <div class="footer-links">
                <div><strong>Shop</strong><a href="#products">Products</a><a href="#categories">Categories</a></div>
                <div><strong>Company</strong><a href="#features">About Us</a><a href="#features">Why Us</a></div>
                <div><strong>Help</strong><a href="#">FAQ</a><a href="#">Contact</a></div>
            </div>
        </div>
        <div class="copyright"><span>© 2026 VGS. All rights reserved.</span><span>Made with ♥ for modern shoppers</span></div>
    </footer>

    <script>
        function addToCart(productName) {
            alert(productName + " ditambahkan ke keranjang! 🛒");
        }

        // Favorite toggle with smooth animation
        document.querySelectorAll(".favorite").forEach(button => {
            button.addEventListener("click", function(e) {
                e.stopPropagation();
                if (this.textContent.trim() === "♡") {
                    this.textContent = "♥";
                    this.style.color = "#ff4d6d";
                    this.style.transform = "scale(1.2)";
                } else {
                    this.textContent = "♡";
                    this.style.color = "#666";
                    this.style.transform = "scale(1)";
                }
            });
        });

        // Smooth entrance animations for cards
        const observerOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -30px 0px"
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, observerOptions);

        document.querySelectorAll('.category, .product-card, .feature').forEach(el => {
            el.style.opacity = "0";
            el.style.transform = "translateY(20px)";
            el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            observer.observe(el);
        });
    </script>
</body>

</html>
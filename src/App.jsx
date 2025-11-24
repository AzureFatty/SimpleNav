import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    ArrowUpRight,
    Zap,
    XCircle,
    Loader2
} from 'lucide-react';
import yaml from 'js-yaml';
import { version } from '../package.json';

// --- Logo 显示组件 ---
const LogoDisplay = ({ src, alt, className }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={`${className} bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center rounded-xl font-bold text-neutral-400 shadow-inner`}>
                {alt ? alt.charAt(0).toUpperCase() : '?'}
            </div>
        );
    }

    return (
        <img src={src} alt={alt} className={`${className} object-contain drop-shadow-sm`} onError={() => setError(true)}
        />
    );
};

const App = () => {
    const [navConfig, setNavConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeSection, setActiveSection] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isWideScreen, setIsWideScreen] = useState(true);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const searchInputRef = useRef(null);

    // 定义配色配置
    const themes = {
        default: ['bg-cyan-200', 'bg-teal-200', 'bg-indigo-200'],
        // 1. 海盐气泡 (极度清爽的蓝青色系)
        ocean: ['bg-sky-200', 'bg-cyan-100', 'bg-blue-200'],
        // 2. 樱花多福 (温柔的粉白调，适合女性向或浪漫场景)
        sakura: ['bg-pink-200', 'bg-rose-100', 'bg-red-100'],
        // 3. 抹茶森林 (护眼的绿色系，非常有生机)
        matcha: ['bg-lime-200', 'bg-green-200', 'bg-emerald-100'],
        // 4. 普罗旺斯 (静谧的紫调，显得高级且神秘)
        lavender: ['bg-violet-200', 'bg-purple-100', 'bg-indigo-100'],
        // 5. 柠檬海盐 (明亮活泼，像夏天的阳光)
        lemonade: ['bg-yellow-200', 'bg-lime-100', 'bg-amber-100'],
        // 6. 冰川时代 (极冷的灰蓝色调，适合科技感或极简风)
        glacier: ['bg-slate-200', 'bg-cyan-100', 'bg-sky-100'],
        // 7. 蜜桃乌龙 (暖调的橘粉色，治愈且亲切)
        peach: ['bg-orange-100', 'bg-rose-200', 'bg-yellow-100'],
        // 8. 暮光之城 (灰紫与靛青的结合，像傍晚的天空)
        twilight: ['bg-indigo-200', 'bg-slate-200', 'bg-violet-100'],
        // 9. 热带雨林 (蓝绿交织，比抹茶色更深邃一点)
        tropical: ['bg-teal-200', 'bg-cyan-200', 'bg-emerald-200'],
        // 10. 春日野餐 (粉、绿、黄撞色，像春天的花田)
        spring: ['bg-green-100', 'bg-pink-100', 'bg-yellow-100'],
    };

    const [currentTheme, setCurrentTheme] = useState(themes.default);

    useEffect(() => {
        const themeKeys = Object.keys(themes);
        const randomKey = themeKeys[Math.floor(Math.random() * themeKeys.length)];
        setCurrentTheme(themes[randomKey]);
    }, []);

    // Load configuration
    useEffect(() => {
        const loadConfig = async () => {
            try {
                const response = await fetch('/assets/conf/config.yml');
                if (!response.ok) {
                    throw new Error(`Failed to load config: ${response.statusText}`);
                }
                const text = await response.text();
                const data = yaml.load(text);
                setNavConfig(data);
                setLoading(false);
            } catch (err) {
                console.error("Error loading config:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        loadConfig();
    }, []);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsWideScreen(window.innerWidth >= 1024);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            requestAnimationFrame(() => {
                setMousePos({
                    x: (e.clientX / window.innerWidth) * 20 - 10,
                    y: (e.clientY / window.innerHeight) * 20 - 10,
                });
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Update page title and favicon
    useEffect(() => {
        if (navConfig?.settings) {
            if (navConfig.settings.title) {
                document.title = navConfig.settings.title;
            }
            if (navConfig.settings.favicon) {
                let link = document.querySelector("link[rel~='icon']");
                if (!link) {
                    link = document.createElement('link');
                    link.rel = 'icon';
                    document.getElementsByTagName('head')[0].appendChild(link);
                }
                link.href = navConfig.settings.favicon;
            }
        }
    }, [navConfig]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50 text-red-500 font-bold">
                Error: {error}
            </div>
        );
    }

    if (!navConfig) return null;

    const filteredSections = navConfig.sections.map(section => ({
        ...section,
        items: section.items.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.subtitle && item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.tag && item.tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    })).filter(section => section.items.length > 0);

    return (
        <div
            className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">

            {/* 动态背景 */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] ${currentTheme[0]} rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse`}
                    style={{ transform: `translate(${mousePos.x * -2}px, ${mousePos.y * -2}px)` }}></div>
                <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] ${currentTheme[1]} rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-pulse delay-1000`}
                    style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }}></div>
                <div className={`absolute top-[40%] left-[40%] w-[30%] h-[30%] ${currentTheme[2]} rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-pulse delay-2000`}
                    style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}></div>
                <div
                    className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:40px_40px]">
                </div>
            </div>

            {/* 头部 */}
            <header className="relative z-10 pt-8 pb-6 px-6 md:px-8 max-w-[1800px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div
                            className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300
                            ${navConfig.settings?.logo
                                    ? 'bg-white/90 backdrop-blur-xl shadow-indigo-500/10 border border-white/50'
                                    : 'bg-gradient-to-br from-indigo-600 to-violet-600 shadow-indigo-200 text-white'
                                }`}>
                            {navConfig.settings?.logo ? (
                                <img src={navConfig.settings.logo} alt="Logo" className="w-8 h-8 object-contain" />
                            ) : (
                                <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300" />
                            )}
                        </div>
                        <div className="leading-tight">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
                                {navConfig.settings?.title || (
                                    <>
                                        TEAM <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">NAV</span>
                                    </>
                                )}
                            </h1>
                        </div>
                    </div>

                    <div className={`relative group flex-1 w-full transition-all duration-300 ease-in-out ${isSearchFocused ? 'lg:max-w-xl' : 'lg:max-w-[320px]'}`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            placeholder="Search resources..."
                            className="relative w-full bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl px-12 py-3 font-medium focus:outline-none
                focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300
                placeholder:text-slate-400 shadow-sm text-lg"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        )}
                        {!searchQuery && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex gap-1 pointer-events-none">
                                <kbd
                                    className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg text-sm font-bold text-slate-400 flex items-center gap-1">
                                    <span className="text-lg">⌘</span> K
                                </kbd>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* 通知栏 */}
            {navConfig.settings?.notification && (
                <div className="max-w-[1800px] mx-auto px-6 md:px-8 mb-6">
                    <div className="bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl border border-white/30 rounded-xl p-4 flex items-start gap-3 shadow-sm ring-1 ring-black/5">
                        <div className="p-1 bg-indigo-100 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                        </div>
                        <div className="flex-1 pt-0.5">
                            <p className="text-sm font-medium text-indigo-900">
                                {navConfig.settings.notification}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* 内容区域 */}
            <main className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-8 pb-12 space-y-12 mt-8">

                {filteredSections.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex p-6 rounded-full bg-white shadow-xl shadow-indigo-100 mb-6">
                            <Search className="w-10 h-10 text-indigo-300" />
                        </div>
                        <p className="text-xl font-bold text-slate-500">No resources found matching "{searchQuery}"</p>
                    </div>
                ) : (
                    filteredSections.map((section, index) => (
                        <section key={section.id} className="relative" onMouseEnter={() => setActiveSection(section.id)}
                            onMouseLeave={() => setActiveSection(null)}
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`w-10 h-10 ${section.themeColor} rounded-xl flex items-center
                    justify-center shadow-lg shadow-indigo-100 text-slate-900`}>
                                    <span className="text-sm font-black">{index + 1}</span>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-slate-800">{section.title}</h2>
                                <div className="flex-1 h-[2px] bg-slate-200 ml-4 relative overflow-hidden rounded-full [mask-image:linear-gradient(to_right,black,transparent)]">
                                    <div className={`absolute inset-0 ${section.themeColor} transform -translate-x-full
                        transition-transform duration-500 ease-out ${activeSection === section.id ? 'translate-x-0' : ''
                                        }`}></div>
                                </div>
                            </div>

                            <div className="grid gap-6" style={{
                                gridTemplateColumns: isWideScreen ?
                                    `repeat(${navConfig.settings?.columns || 4}, minmax(0, 1fr))` : 'repeat(auto-fill, minmax(280px, 1fr))'
                            }}>
                                {section.items.map((item, itemIndex) => (
                                    <a key={itemIndex} href={item.url} target="_blank" rel="noopener noreferrer"
                                        className="group relative block h-full">
                                        <div className={`h-full bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-5 transition-all duration-300
                        ease-out hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:bg-white/60
                        flex items-center gap-4 relative overflow-hidden min-h-[100px] shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]`}>

                                            <div className={`absolute right-0 top-0 w-24 h-24 rounded-bl-[100px] ${section.themeColor}
                            opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl`}></div>

                                            <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-white/80 shadow-sm p-2
                            transition-all duration-300 group-hover:scale-110 group-hover:shadow-md backdrop-blur-sm`}>
                                                <LogoDisplay src={item.logo} alt={item.name} className="w-full h-full" />
                                            </div>

                                            <div className="flex-1 min-w-0 z-10">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className="text-base font-bold text-slate-800 truncate pr-2 group-hover:text-indigo-600 transition-colors">
                                                        {item.name}
                                                    </h3>

                                                    {item.tag && (
                                                        <span className={`flex-shrink-0 px-2 py-0.5 text-[10px] uppercase font-bold 
                                    bg-white/50 text-slate-600 rounded-full transform group-hover:scale-105 border border-white/50
                                    transition-all duration-300 group-hover:bg-indigo-50 group-hover:text-indigo-600`}>
                                                            {item.tag}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.subtitle && (
                                                    <p
                                                        className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed group-hover:text-slate-800">
                                                        {item.subtitle}
                                                    </p>
                                                )}
                                            </div>

                                            <div
                                                className="absolute bottom-3 right-3 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <ArrowUpRight className="w-4 h-4 text-indigo-500" />
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </section>
                    ))
                )}
            </main>

            <footer className="relative z-10 border-t border-slate-200 bg-white/50 backdrop-blur-xl mt-12">
                <div className="max-w-[1800px] mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span>{navConfig.settings?.footer || "Simple Nav"} v{version}</span>
                    </div>
                    <div className="flex gap-6 text-sm font-bold">
                        <a href={navConfig.settings?.actionButton?.url || "https://github.com/AzureFatty"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300">
                            <LogoDisplay
                                src={navConfig.settings?.actionButton?.icon || "assets/icons/github.png"}
                                alt="Action"
                                className="w-4 h-4 invert brightness-0"
                            />
                            <span>{navConfig.settings?.actionButton?.text || "Flow Me"}</span>
                        </a>
                    </div>
                </div>
            </footer>

            {/* Force Tailwind to generate dynamic classes */}
            <div className="hidden">
                <div className="bg-yellow-300 group-hover:text-yellow-700 group-hover:bg-yellow-100 group-hover:border-yellow-700"></div>
                <div className="bg-blue-300 group-hover:text-blue-700 group-hover:bg-blue-100 group-hover:border-blue-700"></div>
                <div className="bg-pink-300 group-hover:text-pink-600 group-hover:bg-pink-100 group-hover:border-pink-600"></div>
            </div>
        </div>
    );
};


export default App;

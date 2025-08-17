import './App.module.css';
import {
    createSignal, onMount,
    onCleanup,
} from "solid-js"
function App() {

    const [clock, setClock] = createSignal({
        greeting: '你好',
        clock: '00:00'
    });

    const updateTime = () => {
        const now = new Date();
        const hh = now.getHours().toString().padStart(2, '0');
        const mm = now.getMinutes().toString().padStart(2, '0');
        const h = now.getHours();

        const greet =
            h < 6 ? '早点休息' :
                h < 12 ? '早上好' :
                    h < 14 ? '中午好' :
                        h < 18 ? '下午好' :
                            '晚上好';

        chrome.storage.sync.get(['username'], ({ username }) => {
            setClock({
                clock: `${hh}:${mm}`,
                greeting: username ? `${greet}，${username}` : greet
            });
        });
    };

    let interval;
    onMount(() => {
        updateTime(); // 先更新一次
        interval = setInterval(updateTime, 1000);
    });

    onCleanup(() => clearInterval(interval));

    // 搜索逻辑
    const [query, setQuery] = createSignal("");
    const [engine, setEngine] = createSignal("https://www.google.com/search?q=");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query().trim()) {
            window.location.href = engine() + encodeURIComponent(query().trim());
        }
    };
    const [links, setLinks] = createSignal([]);

    // 递归收集书签（忽略文件夹）
    // function collectBookmarks(nodes, result = [], maxDepth = 1, currentDepth = 0) {
    //     for (const node of nodes) {
    //         if (node.url) {
    //             result.push({
    //                 title: node.title || node.url,
    //                 url: node.url,
    //                 icon: `https://www.google.com/s2/favicons?sz=64&domain_url=${node.url}`,
    //             });
    //         }
    //         if (node.children && currentDepth < maxDepth) {
    //             collectBookmarks(node.children, result, maxDepth, currentDepth + 1);
    //         }
    //     }
    //     return result;
    // }
    function collectBookmarks(nodes, result = []) {
        for (const node of nodes) {
            if (node.url) {
                let hostname = new URL(node.url).hostname
                result.push({
                    title: node.title || node.url,
                    url: node.url,
                    icon: `https://www.google.com/s2/favicons?sz=64&domain_url=${hostname}`,
                });
            }
            // if (node.children) {
            //     collectBookmarks(node.children, result);
            // }
        }
        return result;
    }

    onMount(() => {
        chrome.bookmarks.getTree((tree) => {
            // const bookmarks = collectBookmarks(tree);
            const bookmarkBar = tree[0].children.find(n => n.title === "书签栏");
            if (bookmarkBar && bookmarkBar.children) {
                const bookmarks = collectBookmarks(bookmarkBar.children); // ✅ 只取第一层
                console.log(bookmarks)
                setLinks(bookmarks);
            }
            
        });
    });

    // 快捷方式：从存储读取，否则用默认
    // const DEFAULT_LINKS = [
    //     { title: 'Gmail', url: 'https://mail.google.com', icon: 'https://www.google.com/s2/favicons?sz=64&domain_url=mail.google.com' },
    //     { title: 'Google 学术', url: 'https://scholar.google.com', icon: 'https://www.google.com/s2/favicons?sz=64&domain_url=scholar.google.com' },
    //     { title: 'GitHub', url: 'https://github.com', icon: 'https://www.google.com/s2/favicons?sz=64&domain_url=github.com' },
    //     { title: 'ArXiv', url: 'https://arxiv.org', icon: 'https://www.google.com/s2/favicons?sz=64&domain_url=arxiv.org' }
    // ];
    // const [links, setLinks] = createSignal(DEFAULT_LINKS);
    // onMount(() => {
    //     // 从 chrome.storage.sync 读取
    //     chrome.storage.sync.get(["links"], ({ links }) => {
    //         if (links && links.length) {
    //             setLinks(links);
    //         }
    //     });
    // });


    // 每日一句（本地列表，离线可用）
    const QUOTES = [
        'Stay hungry, stay foolish.',
        'Simplicity is the ultimate sophistication.',
        '行胜于言。',
        'All models are wrong, but some are useful.',
        '不积跬步，无以至千里。',
        'Talk is cheap. Show me the code.'
    ];
    const [quote, setQuote] = createSignal("加载中…");

    const setRandomQuote = () => {
        const i = Math.floor(Math.random() * QUOTES.length);
        setQuote(QUOTES[i]);
    };

    onMount(() => {
        setRandomQuote();
    });


    // // 壁纸（来自 Unsplash 随机源，无需密钥）
    // function setBg() {
    //     const w = Math.max(window.screen.width, 1280);
    //     const h = Math.max(window.screen.height, 720);
    //     const url = `https://source.unsplash.com/random/${w}x${h}/?landscape,wallpaper`;
    //     const img = new Image();
    //     img.onload = () => { document.getElementById('bg').style.backgroundImage = `url(${url})`; };
    //     img.src = url;
    // }
    // // setBg();
    return (
        <div >
            <div id="bg">

            </div>
            <main class="container">
                <header class="topbar">
                    <div class="greeting" id="greeting">{clock().greeting}</div>
                    <div class="clock" id="clock">{clock().clock}</div>
                </header>


                <section class="search">
                    <form id="searchForm" onSubmit={handleSubmit}>
                        <input
                            id="searchInput"
                            type="text"
                            placeholder="搜索点什么…"
                            autocomplete="off"
                            value={query()}
                            onInput={(e) => setQuery(e.currentTarget.value)}
                        />
                        <select
                            id="engineSelect"
                            title="搜索引擎"
                            value={engine()}
                            onChange={(e) => setEngine(e.currentTarget.value)}
                        >
                            <option value="https://www.google.com/search?q=">Google</option>
                            <option value="https://www.bing.com/search?q=">Bing</option>
                            <option value="https://duckduckgo.com/?q=">DuckDuckGo</option>
                        </select>
                        <button type="submit">搜索</button>
                    </form>
                </section>
                <section class="quicklinks" id="quicklinks">
                    {links().map((i) => (
                        <a class="qitem" href={i.url} target="_self">
                            <img src={i.icon} alt="" />
                            {/* <span>{i.title}</span> */}
                        </a>
                    ))}
                </section>

                <section class="daily">
                    <blockquote id="quote">{quote()}</blockquote>
                </section>
            </main>


        </div>
    );
}

export default App;
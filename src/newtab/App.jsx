import './App.module.css';
import BookMarkItem from './component/book-mark-item'
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
                    // icon: `https://www.google.com/s2/favicons?sz=64&domain_url=${hostname}`,
                    icon: `https://icon.102417.xyz/favicon/${hostname}?minSize=86&autoPadding=true`,
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

    return (
        <div class="min-h-screen bg-[#f2f2f2] bg-center bg-cover bg-no-repeat blur-[var(--blur)]">
            <section class="daily pt-[30px]">
                <blockquote id="quote" class=" text-[#333]  text-center text-3xl">{quote()}</blockquote>
            </section>
            <header class="flex justify-between place-items-end mb-6 max-w-[880px] mx-auto px-6">
                <div class="text-[28px] font-semibold" id="greeting">{clock().greeting}</div>
                <div class="text-[56px] font-bold tracking-[1px]" id="clock">{clock().clock}</div>
            </header>
            <main class="max-w-screen mx-auto px-6">
                <section class="search max-w-[1080px] mx-auto">
                    <form id="searchForm" class="grid grid-cols-[1fr_auto_auto] gap-[10px]" onSubmit={handleSubmit}>
                        <input
                            id="searchInput"
                            class="px-4 py-[14px] text-[18px] rounded-[16px] border border-[#ddd] outline-none"
                            type="text"
                            placeholder="搜索点什么…"
                            autocomplete="off"
                            value={query()}
                            onInput={(e) => setQuery(e.currentTarget.value)}
                        />
                        <select
                            id="engineSelect"
                            title="搜索引擎"
                            class="rounded-[14px] border border-[#ddd] px-3 text-[16px]"
                            value={engine()}
                            onChange={(e) => setEngine(e.currentTarget.value)}
                        >
                            <option value="https://www.google.com/search?q=">Google</option>
                            <option value="https://www.bing.com/search?q=">Bing</option>
                            <option value="https://duckduckgo.com/?q=">DuckDuckGo</option>
                        </select>
                        <button type="submit" class="rounded-[14px] border border-[#ddd] px-3 text-[16px]">搜索</button>
                    </form>
                </section>
                <section class="grid grid-cols-12 gap-[6px] my-6 mx-auto place-items-center max-w-[1200px]" >
                    {links().map((item) => (
                        <BookMarkItem data={item} />
                    ))}
                </section>

               
            </main>
            {/* <footer class="text-[14px]">
                <a href="options.html" target="_blank" rel="noopener">自定义</a>
            </footer> */}
        </div>
    );
}

export default App;
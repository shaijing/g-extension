import {
    createSignal
} from "solid-js"
export default function Search() {

    // 搜索逻辑
    const [query, setQuery] = createSignal("");
    const [engine, setEngine] = createSignal("https://www.google.com/search?q=");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query().trim()) {
            window.location.href = engine() + encodeURIComponent(query().trim());
        }
    };
    return (
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
    );
}
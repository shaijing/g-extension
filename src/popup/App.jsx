import { createSignal, onMount } from "solid-js";

function App() {
    const [username, setUsername] = createSignal("");
    const [linksText, setLinksText] = createSignal("");

    // 初始化加载
    onMount(() => {
        chrome.storage.sync.get(["username", "links"], ({ username, links }) => {
            if (username) setUsername(username);
            if (links && links.length) {
                setLinksText(
                    links
                        .map((i) => [i.title, i.url, i.icon || ""].join(","))
                        .join("\n")
                );
            }
        });
    });

    // 保存昵称
    const saveUser = () => {
        chrome.storage.sync.set({ username: username().trim() }, () => {
            alert("已保存昵称");
        });
    };

    // 保存快捷方式
    const saveLinks = () => {
        const rows = linksText()
            .split(/\n+/)
            .map((l) => l.trim())
            .filter(Boolean);

        const links = rows.map((l) => {
            const [title, url, icon] = l.split(",").map((s) => s && s.trim());
            return {
                title: title || "未命名",
                url: url || "https://example.com",
                icon:
                    icon ||
                    (url
                        ? `https://www.google.com/s2/favicons?sz=64&domain_url=${new URL(url).hostname
                        }`
                        : ""),
            };
        });

        chrome.storage.sync.set({ links }, () => alert("快捷方式已保存"));
    };

    return (
        <div>
            <h2>自定义</h2>
            <div class="row">
                <label>昵称：</label>
                <input
                    value={username()}
                    placeholder="例如：Ling Yu"
                    onInput={(e) => setUsername(e.currentTarget.value)}
                />
                <button onClick={saveUser}>保存</button>
            </div>

            <h3>快捷方式</h3>
            <div class="hint">按行输入：标题,URL（可选 第3列为图标URL）</div>
            <textarea
                value={linksText()}
                onInput={(e) => setLinksText(e.currentTarget.value)}
            />
            <div class="row">
                <button onClick={saveLinks}>保存快捷方式</button>
            </div>
        </div>
    );
}


export default App;
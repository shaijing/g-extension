import BookMarkItem from './book-mark-item'
import {
    createSignal, onMount
} from "solid-js"
export default function IconList() {

    const [links, setLinks] = createSignal([]);
    // ---- 工具函数：获取 favicon 并缓存 ----
    async function getIcon(url, hostname) {
        const key = "icon_" + hostname;
        const cached = localStorage.getItem(key);
        if (cached) {
            return cached; // ✅ 命中缓存
        }

        try {
            const resp = await fetch(url);
            const blob = await resp.blob();
            const reader = new FileReader();

            return await new Promise((resolve) => {
                reader.onloadend = () => {
                    const base64 = reader.result;
                    localStorage.setItem(key, base64); // ✅ 写入缓存
                    resolve(base64);
                };
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.error("icon fetch error", e);
            return url; // fallback
        }
    }

    // ---- 收集书签：并行版本 ----
    async function collectBookmarks(nodes) {
        const tasks = nodes
            .filter(node => node.url) // 只要有 URL 的节点
            .map(async (node) => {
                let hostname = new URL(node.url).hostname;
                let iconUrl = `https://icon.102417.xyz/favicon/${hostname}?minSize=86&autoPadding=true`;

                let icon = await getIcon(iconUrl, hostname);

                return {
                    title: node.title || node.url,
                    url: node.url,
                    icon: icon,
                };
            });

        return Promise.all(tasks); // ✅ 并行等待
    }

    // ---- 挂载时获取书签 ----
    onMount(() => {
        chrome.bookmarks.getTree(async (tree) => {
            const bookmarkBar = tree[0].children.find(n => n.title === "书签栏");
            if (bookmarkBar && bookmarkBar.children) {
                const bookmarks = await collectBookmarks(bookmarkBar.children);
                setLinks(bookmarks);
            }
        });
    });
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
    // function collectBookmarks(nodes, result = []) {
    //     for (const node of nodes) {
    //         if (node.url) {
    //             let hostname = new URL(node.url).hostname
    //             result.push({
    //                 title: node.title || node.url,
    //                 url: node.url,
    //                 // icon: `https://www.google.com/s2/favicons?sz=64&domain_url=${hostname}`,
    //                 icon: `https://icon.102417.xyz/favicon/${hostname}?minSize=86&autoPadding=true`,
    //             });
    //         }
    //         // if (node.children) {
    //         //     collectBookmarks(node.children, result);
    //         // }
    //     }
    //     return result;
    // }

    // onMount(() => {
    //     chrome.bookmarks.getTree((tree) => {
    //         // const bookmarks = collectBookmarks(tree);
    //         const bookmarkBar = tree[0].children.find(n => n.title === "书签栏");
    //         if (bookmarkBar && bookmarkBar.children) {
    //             const bookmarks = collectBookmarks(bookmarkBar.children); // ✅ 只取第一层
    //             console.log(bookmarks)
    //             setLinks(bookmarks);
    //         }

    //     });
    // });

    return (
        <section class="grid mx-auto place-items-center grid-cols-6 gap-[6px] my-6 lg:grid-cols-12 lg:gap-[6px]  lg:max-w-[1280px]" >
            {links().map((item) => (
                <BookMarkItem data={item} />
            ))}
        </section>
    );
}
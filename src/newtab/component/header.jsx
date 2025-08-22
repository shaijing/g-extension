import {
    createSignal, onMount, onCleanup
} from "solid-js"
export default function Header() {
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
    return (
        <header class="flex justify-between place-items-end mb-6 max-w-[880px] mx-auto px-6">
            <div class="text-[28px] font-semibold" id="greeting">{clock().greeting}</div>
            <div class="text-[56px] font-bold tracking-[1px]" id="clock">{clock().clock}</div>
        </header>
    );
}
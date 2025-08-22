import {
    createSignal, onMount
} from "solid-js"
export default function Quote() {

    // 每日一句（本地列表，离线可用）
    const QUOTES = [
        'Stay hungry, stay foolish.',
        'Simplicity is the ultimate sophistication.',
        '行胜于言。',
        'All models are wrong, but some are useful.',
        '不积跬步，无以至千里。',
        'Talk is cheap. Show me the code.',
        '我这个人走得很慢，但是我从不后退。',
        '一个人几乎可以在任何他怀有无限热忱的事情上成功。',
        '要成就一番大事业，必须从小事做起。'

    ];
    const [quote, setQuote] = createSignal("加载中…");

    const setRandomQuote = () => {
        const i = Math.floor(Math.random() * QUOTES.length);
        setQuote(QUOTES[i]);
    };

    onMount(() => {
        setRandomQuote();
    });
    // const [quote, setQuote] = createSignal("加载中…");
    // const fetchHitokoto = async () => {
    //     try {
    //         const res = await fetch("https://v1.hitokoto.cn/");
    //         if (!res.ok) throw new Error("网络错误");
    //         const data = await res.json();
    //         setQuote(data.hitokoto);
    //     } catch (err) {
    //         console.error(err);
    //         setQuote("获取失败，请稍后重试。");
    //     }
    // };
    // onMount(() => {
    //     fetchHitokoto();
    // });
    return (
        <section class="daily pt-[30px]">
            <blockquote id="quote" class=" text-[#333]  text-center text-3xl">{quote()}</blockquote>
        </section>
    );
}
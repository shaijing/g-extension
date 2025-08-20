/**
 * @typedef {Object} BookMarkItem
 * @property {string} url - 链接地址
 * @property {string} title - 链接名称
 * @property {string} icon - 图标地址
 * @property {string} [text] - 链接文字（可选）
 */

/**
 * 
 * @param {*} props 
 * @param {BookMarkItem} props.data - 数据
 * @returns {JSX.Element}
 */
export default function BookMarkItem(props) {
    const { data } = props;
    return (
        <div class="w-[70px] h-[90px]">
            <a
                title={data.title}
                class="size-full grid" href={data.url} target="_self">
                <div class="w-[70px] h-[70px] place-items-center place-content-center gap-[10px] rounded-[16px] bg-white/70 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ">
                    <img src={data.icon} class="m-1 w-3/4 h-3/4 rounded" alt="" />
                </div>
                {/* <div class="w-[70px] h-[20px] truncate text-center">
                    {data.title}
                </div> */}
                <div className="group relative">
                    <div
                        className="
      w-[70px] h-[20px] truncate text-center
      group-hover:w-[80px] group-hover:whitespace-normal group-hover:overflow-visible
      transition-all duration-200
    "
                    >
                        {data.title}
                    </div>
                </div>

            </a>
        </div>
    );
}
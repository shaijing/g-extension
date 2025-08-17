import './App.module.css';
import {
    createSignal, onMount,
    onCleanup,
} from "solid-js"
function App() {


    return (
        <div >
            <h2>自定义</h2>
            <div class="row">
                <label>昵称：</label>
                <input id="username" placeholder="例如：Ling Yu" />
                <button id="saveUser">保存</button>
            </div>

            <h3>快捷方式</h3>
            <div class="hint">按行输入：标题,URL（可选 第3列为图标URL）</div>
            <textarea id="linksText"></textarea>
            <div class="row"><button id="saveLinks">保存快捷方式</button></div>
        </div>
    );
}

export default App;
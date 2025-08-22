import './App.module.css';
import Header from './component/header';
import Search from './component/search';
import IconList from './component/icon-list';
import Quote from './component/quote';
function App() {
    return (
        <div class="min-h-screen bg-[#f2f2f2] bg-center bg-cover bg-no-repeat blur-[var(--blur)]">
            <Quote />
            <Header />
            <main class="max-w-screen mx-auto px-6">
                <Search />
                <IconList />
            </main>
            {/* <footer class="text-[14px]">
                <a href="options.html" target="_blank" rel="noopener">自定义</a>
            </footer> */}
        </div>

    );
}

export default App;
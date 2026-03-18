import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Header from "@/components/Header";
import Dashboard from "@/pages/Dashboard";
import CoinDetail from "@/pages/CoinDetail";
import Wallet from "@/pages/Wallet";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <Header />
          <main className="mx-auto max-w-7xl px-4 py-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/coin/:id" element={<CoinDetail />} />
              <Route path="/wallet" element={<Wallet />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

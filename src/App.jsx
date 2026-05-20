import BigGreyBox from "./chrome/BigGreyBox/BigGreyBox";
import Header from "./chrome/Header/Header";
import AdStage from "./creative/AdStage/AdStage";

export default function App() {
  return (
    <main className="app">
      <Header />
      <AdStage />
      <BigGreyBox />
    </main>
  );
}

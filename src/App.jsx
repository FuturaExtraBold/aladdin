import BigGreyBox from "./chrome/BigGreyBox/BigGreyBox";
import Header from "./chrome/Header/Header";
import AdStage from "./creative/AdStage/AdStage";
import BgStatic from "./creative/BgStatic/BgStatic";

export default function App() {
  return (
    <>
      <BgStatic />
      <main className="app">
        <Header />
        <AdStage />
        <BigGreyBox />
      </main>
    </>
  );
}

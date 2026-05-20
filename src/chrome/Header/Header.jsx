import "./Header.css";

import chromeNav from "../../assets/images-compressed/chrome-nav.webp";

export default function Header() {
  return (
    <header className="header">
      <img
        className="header__nav"
        src={chromeNav}
        alt=""
        aria-hidden="true"
        width="1280"
        height="36"
      />
    </header>
  );
}

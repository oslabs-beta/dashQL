import "../App.css";
import logo from "../assets/github-logo.png";
import dashQL_Logo from "../assets/dashQL_Logo.png";

export default function Nav({ currentPage }: string) {
  return (
    <nav>
      <div id="left-nav">
        <a href="/">
          <img src={dashQL_Logo} alt="dashQL logo"/>
        </a>
      </div>
      <div id="right-nav">
        <a href="/" id={currentPage == "Home" ? "pageStyle" : ""}>
          Home
        </a>
        <a href="/demo" id={currentPage == "Demo" ? "pageStyle" : ""}>
          Demo
        </a>
        <a href="/docs" id={currentPage == "Docs" ? "pageStyle" : ""}>
          Docs
        </a>
        <div>
          <a href="https://github.com/orgs/oslabs-beta/teams/dashql" target="_blank" >
            <img id="githubLogo" src={logo} alt="github logo"/>
          </a>
        </div>
      </div>
    </nav>
  );
}

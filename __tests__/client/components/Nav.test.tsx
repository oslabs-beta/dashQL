import { render, screen } from '@testing-library/react';
import Nav from '../../../client/components/Nav';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach } from 'vitest';

// mock for being able to render nav page
const currentPage:string = "Home"

describe('Navbar Test', () => {
  beforeEach(async () => {
    render(
      <MemoryRouter>
        <Nav currentPage={currentPage}/>
      </MemoryRouter>
    );
  });

  test('renders Navbar', () => {
    // testing name elements showing with proper links
    const navLinks = document.querySelector("#right-nav")?.children
    const home = navLinks[0]
    const demo = navLinks[1]
    const docs = navLinks[2]
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(home.href).toBe("http://localhost:3000/");

    expect(screen.getByText('Demo')).toBeInTheDocument();
    expect(demo.href).toBe("http://localhost:3000/demo");

    expect(screen.getByText('Docs')).toBeInTheDocument();
    expect(docs.href).toBe("http://localhost:3000/docs");

    // testing image elements showing (Hithub logo and dashql logo)
    const testLogoImage = document.querySelector("img") as HTMLImageElement;
    expect(testLogoImage.alt).toBe("dashQL logo");
    expect(testLogoImage.src).toBe("http://localhost:3000/client/assets/dashQL_Logo.png");

    const testGithubImage = document.querySelector("#githubLogo") as HTMLImageElement;
    expect(testGithubImage.alt).toBe("github logo");
    expect(testGithubImage.src).toBe("http://localhost:3000/client/assets/github-logo.png");

  });

});
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useState } from "react";

import App from "../../client/App";
import "react-router-dom";

describe("App", () => {

  test("renders App", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    screen.debug();
  });
});

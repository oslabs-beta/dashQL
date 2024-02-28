import { render, screen } from "@testing-library/react";
import Demo from "../../../client/components/Demo";
import { MemoryRouter } from "react-router-dom";
import { beforeEach } from "vitest";
import { useState } from "react";

let currentPage = "Demo";
function changePage(page: string): void {
  currentPage = page;
}

describe("Demo Test", () => {
  beforeEach(async () => {
    render(<Demo changePage={changePage} />);
    screen.debug()
  });

  test("renders Demo component", () => {
    expect(screen.getByText("dashQL Cache Demo")).toBeInTheDocument();
  });
});

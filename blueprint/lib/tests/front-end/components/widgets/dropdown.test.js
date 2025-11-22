import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Dropdown } from "@/components/widgets/Dropdown";

// Mock the Widget so we can detect its render
jest.mock("@/components/widgets/Widget.js", () => ({
  Widget: ({ children, style }) => (
    <div data-testid="widget" style={style}>
      {children}
    </div>
  ),
}));

describe("Dropdown", () => {
  test("Renders inside the canvas with a select element", () => {
    render(
      <div data-testid="canvas">
        <Dropdown id={1} />
      </div>
    );

    const canvas = screen.getByTestId("canvas");
    const widget = within(canvas).getByTestId("widget");

    // Verify it's in the canvas
    expect(widget).toBeInTheDocument();

    // Verify a <select> exists inside
    const select = within(widget).getByRole("combobox");
    expect(select).toBeInTheDocument();

    // Default background color check
    expect(widget).toHaveStyle({ backgroundColor: "#ffffff" });
  });
});
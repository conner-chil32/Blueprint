import React from "react";
import { render, screen, within, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MenuScroll } from "@/components/widgets/MenuScroll.jsx";

describe("MenuScroll", () => {
  test("renders inside the canvas with items and default background", () => {
    const items = ["Home", "About", "Contact"];

    render(
      <div data-testid="canvas">
        <MenuScroll id={1} items={items} />
      </div>
    );

    const canvas = screen.getByTestId("canvas");
    const widget = within(canvas).getByTestId("widget");

    // In the canvas
    expect(widget).toBeInTheDocument();

    // Default Widget background
    expect(widget).toHaveStyle({ backgroundColor: "#f0f0f0" });

    // One of the items rendered
    expect(within(widget).getByText("Home")).toBeInTheDocument();
  });
});
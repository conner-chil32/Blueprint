import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Image } from "@/components/widgets/Image";

// Mock the Widget so we can detect its render
jest.mock("@/components/widgets/Widget.js", () => ({
  Widget: ({ children, style }) => (
    <div data-testid="widget" style={style}>
      {children}
    </div>
  ),
}));

describe("Image", () => {
  test("Renders inside the canvas with an img element", () => {
    render(
      <div data-testid="canvas">
        <Image id={1} />
      </div>
    );

    const canvas = screen.getByTestId("canvas");
    const widget = within(canvas).getByTestId("widget");

    // Confirm the widget is rendered inside the canvas
    expect(widget).toBeInTheDocument();

    // Check that an <img> element is rendered
    const img = within(widget).getByRole("img");
    expect(img).toBeInTheDocument();

    // Confirm it uses the default background color
    expect(widget).toHaveStyle({ backgroundColor: "#f5f5f5" });
  });
});
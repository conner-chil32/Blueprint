import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Box } from "@/components/widgets/Box";

// Mock the Widget so we can detect its render
jest.mock("@/components/widgets/Widget.js", () => ({
  Widget: ({ style }) => (
    <div data-testid="Widget" style={style}></div>
  ),
}));

describe("Box", () => {
  test("Renders inside the canvas and uses default background color", () => {
    // Render a fake 'canvas' and place Box inside it
    render(
      <div data-testid="canvas">
        <Box id={1} />
      </div>
    );

    const canvas = screen.getByTestId("canvas");
    const widget = within(canvas).getByTestId("Widget");

    // See if it is in the canvas
    expect(widget).toBeInTheDocument();

    // Check a default attribute to ensure it was rendered
    expect(widget).toHaveStyle({ backgroundColor: "#cccccc" });
  });
});

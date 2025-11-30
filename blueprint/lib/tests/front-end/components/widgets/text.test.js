import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Text } from "@/components/widgets/Text.jsx";

describe("Text", () => {
  test("renders inside the canvas with default content", () => {
    render(
      <div data-testid="canvas">
        <Text id={1} />
      </div>
    );

    const canvas = screen.getByTestId("canvas");
    const widget = within(canvas).getByTestId("widget");

    // In the canvas
    expect(widget).toBeInTheDocument();

    // Shows default text when not editing
    expect(within(widget).getByText("Edit me")).toBeInTheDocument();

    // Expect overflow to be hidden
    expect(widget).toHaveStyle({ overflow: "hidden" });
  });

  test("renders a textarea when isEditing=true", () => {
    render(
      <div data-testid="canvas">
        <Text id={2} isEditing={true} />
      </div>
    );

    const canvas = screen.getByTestId("canvas");
    const widget = within(canvas).getByTestId("widget");

    // Textarea appears in editing mode
    expect(within(widget).getByLabelText("Edit text")).toBeInTheDocument();
  });
});
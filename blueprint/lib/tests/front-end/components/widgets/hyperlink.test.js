import React from "react";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Hyperlink } from "@/components/widgets/Hyperlink.jsx";

describe("Hyperlink", () => {
  test("Renders inside the canvas with a link element", () => {
    render(
      <div data-testid="canvas">
        <Hyperlink text="Test Link" url="https://mrdoob.com/projects/chromeexperiments/google-gravity/" />
      </div>
    );

    const canvas = screen.getByTestId("canvas");
    const widget = within(canvas).getByTestId("widget");

    // Confirm it's in the canvas
    expect(widget).toBeInTheDocument();

    // Find the <a> link inside the widget
    const link = within(widget).getByRole("link", { name: "Test Link" });
    expect(link).toBeInTheDocument();

    // Confirm link properties
    expect(link).toHaveAttribute("href", "https://mrdoob.com/projects/chromeexperiments/google-gravity/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveStyle({ color: "#0000ee" });
  });
});
// @vitest-environment jsdom
import { readFileSync } from "node:fs";
import path from "node:path";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { citySchema } from "@/lib/city/schema";
import { Simulator } from "../Simulator";

const phoenix = citySchema.parse(
  JSON.parse(readFileSync(path.join(process.cwd(), "data/cities/phoenix-az.json"), "utf8")),
);

const slide = (label: RegExp, value: number) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value: String(value) } });

const notices = () => screen.queryAllByRole("note").map((n) => n.textContent ?? "");

/** The sentence at the top of the sheet. Sliders also expose a status role, so match the text. */
const summary = () => screen.getByText(/monthly bill at \d+% coverage/).textContent ?? "";

afterEach(cleanup);

/**
 * The three situations the brief singles out. Each one must be explained on
 * screen, not only reflected in the numbers.
 */
describe("what the simulator explains", () => {
  it("says the savings stop at the bill when generation is worth more", () => {
    render(<Simulator city={phoenix} />);
    fireEvent.click(screen.getByRole("button", { name: /pool and an EV/ }));
    slide(/share of usage/i, 100);

    expect(summary()).toContain("41 panels");
    expect(notices().join(" ")).toMatch(/savings stop at your bill.*\$431\.73.*\$430\.00/);
  });

  it("says the city minimum raised the panel count", () => {
    render(<Simulator city={phoenix} />);
    fireEvent.click(screen.getByRole("button", { name: /Apartment/ }));

    expect(summary()).toContain("8 panels");
    expect(notices().join(" ")).toMatch(/sized it at 8 panels.*ask for 7/);
    const roof = screen.getByRole("img", { name: /8 panels/ });
    expect(roof.getAttribute("aria-label")).toContain("plus 1 added");
  });

  it("says lowering coverage changes nothing once the minimum applies", () => {
    render(<Simulator city={phoenix} />);
    fireEvent.click(screen.getByRole("button", { name: /Apartment/ }));
    slide(/monthly electric bill/i, 60);
    const before = summary();

    slide(/share of usage/i, 50);

    expect(summary()).toBe(before.replace("80%", "50%"));
    expect(screen.getByText(/Lowering this will not change the estimate/)).toBeTruthy();
  });
});

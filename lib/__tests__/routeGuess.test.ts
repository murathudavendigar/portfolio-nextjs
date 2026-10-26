import { describe, expect, it } from "vitest";
import { closestPath, distance } from "@/lib/routeGuess";

const known = ["/work", "/about", "/lab", "/writing", "/contact", "/work/daily-skyline", "/work/courai"];

describe("distance", () => {
  it("counts single edits", () => {
    expect(distance("work", "work")).toBe(0);
    expect(distance("wokr", "work")).toBe(2);
    expect(distance("abut", "about")).toBe(1);
  });
});

describe("closestPath", () => {
  it("guesses the page a typo meant", () => {
    expect(closestPath("/wrok", known)).toBe("/work");
    expect(closestPath("/abuot", known)).toBe("/about");
    expect(closestPath("/work/daily-skylin", known)).toBe("/work/daily-skyline");
    expect(closestPath("/Writting/", known)).toBe("/writing");
  });
});

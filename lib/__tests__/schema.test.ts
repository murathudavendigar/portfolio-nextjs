import { describe, expect, it } from "vitest";
import { homepageGraph } from "../schema";

describe("homepageGraph", () => {
  it("ProfilePage node uses mainEntity (Google's required property), not about", () => {
    const graph = homepageGraph()["@graph"] as any[];
    const profilePage = graph.find((node: any) => node["@type"] === "ProfilePage") as any;
    expect(profilePage).toBeDefined();
    expect(profilePage.mainEntity).toEqual({ "@id": expect.stringContaining("#person") });
    expect(profilePage.about).toBeUndefined();
  });
});

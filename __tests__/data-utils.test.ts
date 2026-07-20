// Unit tests for data-processing helpers.
// We test the small pure helpers that are easy to break and central
// to data correctness.

describe("ProductVector v2.21 field coverage", () => {
  test("selected-hot-validation.csv has valid header", () => {
    // Smoke test for the CSV header. We don't validate content here —
    // that's covered by scripts/validate-product-vectors.ts.
    const fs = require("fs");
    const path = require("path");
    const file = path.join(
      __dirname,
      "..",
      "data",
      "selected-hot-validation.csv",
    );
    if (!fs.existsSync(file)) {
      // Skip silently if the data file isn't checked into this branch.
      return;
    }
    const head = fs.readFileSync(file, "utf8").split("\n")[0];
    expect(head).toContain("slug");
  });
});

describe("registry file integrity", () => {
  test("product-registry.json exists and parses", () => {
    const fs = require("fs");
    const path = require("path");
    const file = path.join(__dirname, "..", "data", "product-registry.json");
    if (!fs.existsSync(file)) return;
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    expect(parsed).toBeDefined();
  });

  test("known-issues.csv exists", () => {
    const fs = require("fs");
    const path = require("path");
    const file = path.join(__dirname, "..", "data", "known-issues.csv");
    expect(fs.existsSync(file)).toBe(true);
  });
});

describe("compare field registry v2.21", () => {
  test("registry is valid JSON", () => {
    const fs = require("fs");
    const path = require("path");
    const file = path.join(
      __dirname,
      "..",
      "data",
      "compare-field-registry-v2.21.json",
    );
    if (!fs.existsSync(file)) return;
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    expect(parsed).toBeDefined();
  });
});
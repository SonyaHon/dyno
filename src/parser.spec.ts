import { describe, expect, test } from "bun:test";
import { Parser } from "./parser";

describe("parser", function () {
  test("const number literal definition", function () {
    const input = "x :: 69";
    const module = Parser.ParseText(input);
    expect(module).toMatchSnapshot();
  });
});

import { describe, expect, test } from "bun:test";
import { Parser } from "./parser";

describe("parser", function () {
  test("const number literal definition", function () {
    const input = "x :: 69";
    const module = Parser.ParseText(input);
    expect(module).toMatchSnapshot();
  });

  test("ident literal expression statement", function () {
    const input = "x";
    const module = Parser.ParseText(input);
    expect(module).toMatchSnapshot();
  });

  test("void return statement", function () {
    const input = "return";
    const module = Parser.ParseText(input);
    expect(module).toMatchSnapshot();
  });

  test("number return statement", function () {
    const input = "return 10";
    const module = Parser.ParseText(input);
    expect(module).toMatchSnapshot();
  });

  test("number literal expression statement", function () {
    const input = "10";
    const module = Parser.ParseText(input);
    expect(module).toMatchSnapshot();
  });

  test("not number expression statement", function () {
    const input = "!10";
    const module = Parser.ParseText(input);
    expect(module).toMatchSnapshot();
  });

  test("minus number expression statement", function () {
    const input = "-10";
    const module = Parser.ParseText(input);
    expect(module).toMatchSnapshot();
  });
});

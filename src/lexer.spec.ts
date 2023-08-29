import { describe, expect, test } from "bun:test";
import { Token, TokenType } from "./token";
import { Lexer } from "./lexer";

describe("lexer", function () {
  test("basic", function () {
    const input = "=+(){},;";
    const data: [TokenType, string][] = [
      [TokenType.Assign, "="],
      [TokenType.Plus, "+"],
      [TokenType.ParenLeft, "("],
      [TokenType.ParenRight, ")"],
      [TokenType.BraceLeft, "{"],
      [TokenType.BraceRight, "}"],
      [TokenType.Comma, ","],
      [TokenType.Semicolon, ";"],
    ];

    const lexer = new Lexer(input);
    for (const [tokenType, tokenLiteral] of data) {
      const token: Token = lexer.nextToken();
      expect(token.type).toBe(tokenType);
      expect(token.literal).toBe(tokenLiteral);
    }
  });

  test("simple syntax", function () {
    const input = `
        x := 34
        y := 35
        add :: function(x number, y number) number {
            return x + y
        }
        result := add(x, y)
        ! < > >= <= if else return true false - * / ^ : != 
    `;
    const data: [TokenType, string][] = [
      [TokenType.Ident, "x"],
      [TokenType.ColonEqual, ":="],
      [TokenType.Number, "34"],
      [TokenType.Ident, "y"],
      [TokenType.ColonEqual, ":="],
      [TokenType.Number, "35"],
      [TokenType.Ident, "add"],
      [TokenType.ColonColon, "::"],
      [TokenType.Function, "function"],
      [TokenType.ParenLeft, "("],
      [TokenType.Ident, "x"],
      [TokenType.Ident, "number"],
      [TokenType.Comma, ","],
      [TokenType.Ident, "y"],
      [TokenType.Ident, "number"],
      [TokenType.ParenRight, ")"],
      [TokenType.Ident, "number"],
      [TokenType.BraceLeft, "{"],
      [TokenType.Return, "return"],
      [TokenType.Ident, "x"],
      [TokenType.Plus, "+"],
      [TokenType.Ident, "y"],
      [TokenType.BraceRight, "}"],
      [TokenType.Ident, "result"],
      [TokenType.ColonEqual, ":="],
      [TokenType.Ident, "add"],
      [TokenType.ParenLeft, "("],
      [TokenType.Ident, "x"],
      [TokenType.Comma, ","],
      [TokenType.Ident, "y"],
      [TokenType.ParenRight, ")"],
      [TokenType.Bang, "!"],
      [TokenType.LessThan, "<"],
      [TokenType.GreaterThan, ">"],
      [TokenType.GreaterEqualThan, ">="],
      [TokenType.LessEqualThan, "<="],
      [TokenType.If, "if"],
      [TokenType.Else, "else"],
      [TokenType.Return, "return"],
      [TokenType.True, "true"],
      [TokenType.False, "false"],
      [TokenType.Minus, "-"],
      [TokenType.Asterisk, "*"],
      [TokenType.Slash, "/"],
      [TokenType.Carrot, "^"],
      [TokenType.Colon, ":"],
      [TokenType.NotEqual, "!="],
    ];

    const lexer = new Lexer(input);
    for (const [tokenType, tokenLiteral] of data) {
      const token: Token = lexer.nextToken();
      expect(token.type).toBe(tokenType);
      expect(token.literal).toBe(tokenLiteral);
    }
  });
});

import { Token, TokenType } from "./token";

export class Lexer {
  private position: number = 0;
  private readPosition: number = 0;
  private char: string = "\0";

  constructor(private readonly input: string) {
    this.readChar();
  }

  nextToken(): Token {
    let token: Token;
    this.skipWhitespace();

    switch (this.char) {
      case "=":
        token = new Token(TokenType.Assign, "=");
        break;
      case "{":
        token = new Token(TokenType.BraceLeft, "{");
        break;
      case "}":
        token = new Token(TokenType.BraceRight, "}");
        break;
      case ",":
        token = new Token(TokenType.Comma, ",");
        break;
      case "(":
        token = new Token(TokenType.ParenLeft, "(");
        break;
      case ")":
        token = new Token(TokenType.ParenRight, ")");
        break;
      case ";":
        token = new Token(TokenType.Semicolon, ";");
        break;
      case "+":
        token = new Token(TokenType.Plus, "+");
        break;
      case "\0":
        token = new Token(TokenType.Eof, "\0");
        break;
      case "-":
        token = new Token(TokenType.Minus, "-");
        break;
      case "*":
        token = new Token(TokenType.Asterisk, "*");
        break;
      case "/":
        token = new Token(TokenType.Slash, "/");
        break;
      case "^":
        token = new Token(TokenType.Carrot, "^");
        break;
      case ">":
        token = this.readGreaterStartingTokens();
        break;
      case "<":
        token = this.readLessStargingTokens();
        break;
      case ":":
        token = this.readColonStartingTokens();
        return token;
      case "!":
        token = this.readBangStartingTokens();
        break;
      default:
        if (/[a-zA-Z_$]/.test(this.char)) {
          token = this.readIdentifier();
          return token;
        } else if (/[0-9]/.test(this.char)) {
          token = this.readNumber();
          return token;
        }
        token = new Token(TokenType.Illegal, "\0");
    }
    this.readChar();
    return token;
  }

  private readBangStartingTokens(): Token {
    const nextChar = this.input[this.readPosition];
    switch (nextChar) {
      case "=":
        this.readChar();
        this.readChar();
        return new Token(TokenType.NotEqual, "!=");
      default:
        this.readChar();
        return new Token(TokenType.Bang, "!");
    }
  }

  private readLessStargingTokens(): Token {
    const nextChar = this.input[this.readPosition];
    switch (nextChar) {
      case "=":
        this.readChar();
        this.readChar();
        return new Token(TokenType.LessEqualThan, "<=");
      default:
        this.readChar();
        return new Token(TokenType.LessThan, "<");
    }
  }

  private readGreaterStartingTokens(): Token {
    const nextChar = this.input[this.readPosition];
    switch (nextChar) {
      case "=":
        this.readChar();
        this.readChar();
        return new Token(TokenType.GreaterEqualThan, ">=");
      default:
        this.readChar();
        return new Token(TokenType.GreaterThan, ">");
    }
  }

  //todo Number parsing is terribly incorrect, improve it
  private readNumber(): Token {
    const tempPosition = this.position;
    while (/[0-9]/.test(this.char)) {
      this.readChar();
    }
    return new Token(
      TokenType.Number,
      this.input.slice(tempPosition, this.position)
    );
  }

  private readColonStartingTokens(): Token {
    const nextChar = this.input[this.readPosition];
    switch (nextChar) {
      case ":":
        this.readChar();
        this.readChar();
        return new Token(TokenType.ColonColon, "::");
      case "=":
        this.readChar();
        this.readChar();
        return new Token(TokenType.ColonEqual, ":=");
      default:
        this.readChar();
        return new Token(TokenType.Colon, ":");
    }
  }

  private readIdentifier() {
    const tempPosition = this.position;
    while (/\w/.test(this.char)) {
      this.readChar();
    }

    const identLiteral = this.input.slice(tempPosition, this.position);
    switch (identLiteral) {
      case "function":
        return new Token(TokenType.Function, identLiteral);
      case "return":
        return new Token(TokenType.Return, identLiteral);
      case "if":
        return new Token(TokenType.If, identLiteral);
      case "else":
        return new Token(TokenType.Else, identLiteral);
      case "true":
        return new Token(TokenType.True, identLiteral);
      case "false":
        return new Token(TokenType.False, identLiteral);
      default:
        return new Token(TokenType.Ident, identLiteral);
    }
  }

  private skipWhitespace() {
    while (/\s/.test(this.char)) {
      this.readChar();
    }
  }

  private readChar() {
    if (this.readPosition >= this.input.length) {
      this.char = "\0";
    } else {
      this.char = this.input[this.readPosition];
    }
    this.position = this.readPosition;
    this.readPosition += 1;
  }
}

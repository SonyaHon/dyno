import { Lexer } from "./lexer";
import { Token, TokenType } from "./token";

export interface Statement {}

export interface Expression {}

export class Identifier {
  constructor(public readonly token: Token, public readonly name: string) {}
}

export class NumberLiteral implements Expression {
  constructor(public readonly token: Token, public readonly value: number) {}
}

export class Type {}

export class DefineConstant implements Statement {
  constructor(
    public token: Token,
    public name: Identifier,
    public value: Expression
  ) {}
}

export class Module {
  public statements: Statement[] = [];
}

export class Parser {
  private currentToken: Token;
  private peekToken: Token;

  static ParseText(input: string): Module {
    const parser = new Parser(new Lexer(input));
    return parser.parse();
  }

  constructor(public lexer: Lexer) {
    this.currentToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();
  }

  private iterate() {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  private parseIdentStarting() {
    if (this.peekToken.type === TokenType.ColonColon) {
      const token = this.currentToken;
      const ident = new Identifier(
        this.currentToken,
        this.currentToken.literal
      );

      this.iterate();
      //@ts-ignore
      if (this.peekToken.type === TokenType.Number) {
        const numberToken = this.peekToken;
        this.iterate();
        this.iterate();
        return new DefineConstant(
          token,
          ident,
          new NumberLiteral(numberToken, Number(numberToken.literal))
        );
      }
    }
    throw new Error("Unreachable");
  }

  parse(): Module {
    const module = new Module();

    while (this.currentToken.type !== TokenType.Eof) {
      let statement = null;

      if (this.currentToken.type === TokenType.Ident) {
        statement = this.parseIdentStarting();
      }

      if (statement) {
        module.statements.push(statement);
      }
    }

    return module;
  }
}

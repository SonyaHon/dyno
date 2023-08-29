import { Lexer } from "./lexer";
import { Token, TokenType } from "./token";

export interface Statement {}

export interface Expression {}

export class Identifier implements Expression {
  constructor(public readonly token: Token, public readonly name: string) {}
}

export class NumberLiteral implements Expression {
  constructor(public readonly token: Token, public readonly value: number) {}
}

export class VoidLiteral implements Expression {
  public readonly value = undefined;
  constructor(public readonly token: Token) {}
}

export class NotExpression implements Expression {
  constructor(
    public readonly token: Token,
    public readonly value: Expression
  ) {}
}

export class MinusExpression implements Expression {
  constructor(
    public readonly token: Token,
    public readonly value: Expression
  ) {}
}

export class InfixExpression implements Expression {
  constructor(
    public readonly token: Token,
    public readonly left: Expression,
    public readonly Operator: Token,
    public readonly right: Expression
  ) {}
}

export class Type {}

export class DefineConstant implements Statement {
  constructor(
    public token: Token,
    public name: Identifier,
    public value: Expression
  ) {}
}

export class Return implements Statement {
  constructor(public token: Token, public returnValue: Expression) {}
}

export class EpxressionStatement implements Statement {
  constructor(public token: Token, public expression: Expression) {}
}

export class Module {
  public statements: Statement[] = [];
}

const OPERATOR_PRECENDENCE = {
  Lowest: 1,
  Equals: 2,
  Sum: 3,
  Product: 4,
  Prefix: 5,
  Call: 6,
  LessGreater: 7,
};

export class Parser {
  private currentToken: Token;
  private peekToken: Token;

  //@ts-ignore
  private prefixOperatorParsers: Record<TokenType, () => Expression> = {
    [TokenType.Number]: () => {
      const token = this.currentToken;
      this.iterate();
      return new NumberLiteral(token, Number(token.literal));
    },
    [TokenType.Ident]: () => {
      const token = this.currentToken;
      this.iterate();
      return new Identifier(token, token.literal);
    },
    [TokenType.Bang]: () => {
      const token = this.currentToken;
      this.iterate();
      return new NotExpression(token, this.parseExpression());
    },
    [TokenType.Minus]: () => {
      const token = this.currentToken;
      this.iterate();
      return new MinusExpression(token, this.parseExpression());
    },
  };

  private infixOperatorPrecendence = {
    [TokenType.Equal]: OPERATOR_PRECENDENCE.Equals,
    [TokenType.NotEqual]: OPERATOR_PRECENDENCE.Equals,
    [TokenType.LessThan]: OPERATOR_PRECENDENCE.LessGreater,
    [TokenType.GreaterThan]: OPERATOR_PRECENDENCE.LessGreater,
    [TokenType.Plus]: OPERATOR_PRECENDENCE.Sum,
    [TokenType.Minus]: OPERATOR_PRECENDENCE.Sum,
    [TokenType.Slash]: OPERATOR_PRECENDENCE.Product,
    [TokenType.Asterisk]: OPERATOR_PRECENDENCE.Product,
  };

  private infixOperatorParsers = {};

  static ParseText(input: string): Module {
    const parser = new Parser(new Lexer(input));
    return parser.parse();
  }

  constructor(public lexer: Lexer) {
    this.currentToken = this.lexer.nextToken();
    this.peekToken = this.lexer.nextToken();
  }

  private iterate(count: number = 1) {
    for (let i = 0; i < count; i += 1) {
      this.currentToken = this.peekToken;
      this.peekToken = this.lexer.nextToken();
    }
  }

  private parseExpression(): Expression {
    const parser = this.prefixOperatorParsers[this.currentToken.type];
    if (!parser) {
      throw new Error(`Expected expression, found ${this.currentToken}`);
    }
    const leftExpression = parser();
    return leftExpression;
  }

  private parseIdentStartingStatement() {
    if (this.peekToken.type === TokenType.ColonColon) {
      const token = this.currentToken;
      const ident = new Identifier(
        this.currentToken,
        this.currentToken.literal
      );
      this.iterate(2);
      return new DefineConstant(token, ident, this.parseExpression());
    } else {
      return this.parseExpressionStatement();
    }

    throw new Error(
      `Expected an expression, constant or variable declaration, found ${this.peekToken}`
    );
  }

  private parseReturnStatement(): Statement {
    const token = this.currentToken;
    this.iterate();
    let expression;
    try {
      expression = this.parseExpression();
    } catch (error) {
      //todo check error
      expression = new VoidLiteral(token);
    }
    return new Return(token, expression);
  }

  private parseExpressionStatement(): Statement {
    const token = this.currentToken;
    const expression = this.parseExpression();
    return new EpxressionStatement(token, expression);
  }

  parse(): Module {
    const module = new Module();

    while (this.currentToken.type !== TokenType.Eof) {
      let statement = null;

      if (this.currentToken.type === TokenType.Ident) {
        statement = this.parseIdentStartingStatement();
      } else if (this.currentToken.type === TokenType.Return) {
        statement = this.parseReturnStatement();
      } else {
        statement = this.parseExpressionStatement();
      }

      if (statement) {
        module.statements.push(statement);
      }
    }

    return module;
  }
}

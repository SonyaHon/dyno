export enum TokenType {
  // Utility
  Illegal = "Illegal",
  Eof = "Eof",

  // Identifiers + Literals
  Ident = "Ident",
  Number = "Number",

  // Operators
  Assign = "Assign",
  Plus = "Plus",
  Minus = "Minus",
  Asterisk = "Asterisk",
  Slash = "Divide",
  Carrot = "Carrot",
  Bang = "Bang",
  GreaterThan = "GreaterThan",
  LessThan = "LessThan",
  GreaterEqualThan = "GreaterEqualThan",
  LessEqualThan = "LessEqualThan",

  // Delimeters
  Comma = "Comma",
  Semicolon = "Semicolon",
  Colon = "Colon",
  ParenLeft = "ParenLeft",
  ParenRight = "ParenRight",
  BraceLeft = "BraceLeft",
  BraceRight = "BraceRight",
  ColonColon = "ColonColon",
  ColonEqual = "ColonEqual",
  NotEqual = "NotEqual",

  // Keywords
  Function = "Function",
  Return = "Return",
  If = "If",
  Else = "Else",
  True = "True",
  False = "False",
}

export class Token {
  constructor(
    public readonly type: TokenType,
    public readonly literal: string
  ) {}

  toString() {
    return `${this.type}<${this.literal}>`;
  }
}

import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { TokenType } from "./token";

export async function startRepl() {
  const prompt = ">> ";
  process.stdout.write(`Starting repl...\n`);
  process.stdout.write(prompt);

  for await (const input of console) {
    switch (input) {
      case ".clear":
        console.clear();
        break;
      case ".exit":
        console.log("Bye...");
        return;
      default:
        const lexer = new Lexer(input);
        const parser = new Parser(lexer);
        const module = parser.parse();
        console.log(module);
    }
    process.stdout.write(prompt);
  }
}

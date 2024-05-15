import {
  BashCommand,
  enricher,
  File,
  Position,
  ShellNodeTypes,
  ShellParser,
} from "@tdurieux/dinghy";
import { Matcher } from "@tdurieux/docker-parfum";

export function parseShell(
  shell: string,
  options?: { smell: boolean }
): {
  errors?: any[];
  commands?: any[];
  smells?: any[];
} {
  shell = shell.replace(/\\n/gm, "\n").replace(/\r\n/gm, "\n");
  const p = new Position(0, 0);
  p.file = new File(undefined, shell);
  const parser = new ShellParser(shell, p);
  let ast: ShellNodeTypes = undefined;
  let errors = null;
  try {
    ast = parser.parse();
  } catch (error) {
    if (error.errors) {
      errors = error.errors;
    }
    if (error.ast) {
      ast = error.ast;
    }
  }
  if (!ast) {
    return { errors: errors || [] };
  }
  enricher.enrich(ast);
  const commands = ast
    .getElements(BashCommand)
    .filter((c: BashCommand) => c.command)
    .map((c: BashCommand) => {
      return {
        annotations: c.annotations,
        command: c.command?.toString(),
        categories: (c as any).categories || [],
        args: c.args.map((a) => ({
          annotations: a.annotations,
          content: a.toString(),
        })),
      };
    });
  const output: ReturnType<typeof parseShell> = {
    commands,
    errors,
  };
  if (options?.smell) {
    output.smells = new Matcher(ast).matchAll();
  }
  return output;
}

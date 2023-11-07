#!/usr/bin/env node

import { Command } from "commander";
import { ShellParser, nodeType, parseShell } from "@tdurieux/dinghy";
import { enricher } from "@tdurieux/docker-parfum";

const program = new Command();

program
  .description("Parse bash command and print the list of used command")
  .argument("<bash>", "command to parse")
  .action(async function (bash) {
    bash = bash
      .replace(/\\n/gm, "\n")
      .replace(/\r\n/gm, "\n")
      .replace(/#([^\\\n]*)$/gm, "#$1\\")
      // empty space after \
      .replace(/\\([ \t]+)\n/gm, "$1\\\n")
      // empty line
      .replace(/^([ \t]*)\n/gm, "$1\\\n");
    const parser = new ShellParser(bash);
    const root = await parser.parse();
    if (root) {
      enricher.enrich(root);
      const output = root
        .getElements(nodeType.BashCommand)
        .filter((c) => c.command)
        .map((c) => {
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
      console.log(JSON.stringify(output, null, 2));
    }
    if (parser.errors.length > 0) {
      return console.log(JSON.stringify({ errors: parser.errors }, null, 2));
    }
  });

program.parse();

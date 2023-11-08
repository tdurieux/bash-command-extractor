#!/usr/bin/env node

import { Command } from "commander";
import { File, ShellParser, nodeType } from "@tdurieux/dinghy";
import { enricher } from "@tdurieux/docker-parfum";
import { Position } from "@tdurieux/dinghy/build/docker-type";

function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isEmpty);
  } else if (typeof value === "object") {
    return Object.values(value).every(isEmpty);
  }

  return false;
}

function replacer(key, value) {
  return isEmpty(value) ? undefined : value;
}

const program = new Command();

program
  .description("Parse bash command and print the list of used command")
  .argument("<bash>", "command to parse")
  .action(function (bash) {
    bash = bash
      .replace(/\\n/gm, "\n")
      .replace(/\r\n/gm, "\n")
      .replace(/#([^\\\n]*)$/gm, "#$1\\")
      // empty space after \
      .replace(/\\([ \t]+)\n/gm, "$1\\\n")
      // empty line
      .replace(/^([ \t]*)\n/gm, "$1\\\n");
    const p = new Position(0, 0);
    p.file = new File(undefined, bash);
    const parser = new ShellParser(bash, p);
    let ast: nodeType.DockerOpsNodeType = undefined;
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
      console.log(JSON.stringify({ errors: errors || [] }, replacer, 2));
      return;
    }
    enricher.enrich(ast);
    const output = ast
      .getElements(nodeType.BashCommand)
      .filter((c: nodeType.BashCommand) => c.command)
      .map((c: nodeType.BashCommand) => {
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
    console.log(
      JSON.stringify(
        {
          commands: output,
          errors,
        },
        replacer,
        2
      )
    );
  });

program.parse();

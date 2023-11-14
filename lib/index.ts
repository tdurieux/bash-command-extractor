#!/usr/bin/env node

import { Command } from "commander";
import { startServer } from "./server";
import { parseShell } from "./parser";
import { jsonReplacer } from "./utils";

const program = new Command();

program
  .description("Parse bash command and print the list of used command")
  .option("--server")
  .option("--smell")
  .option("-p, --port <port>", "port to listen to", "8080")
  .argument("[shell]", "command to parse")
  .action(function (bash: string, options) {
    if (options.server) {
      startServer({ port: parseInt(options.port), smell: options.smell });
    } else {
      console.log(
        JSON.stringify(
          parseShell(bash, { smell: options.smell }),
          jsonReplacer,
          2
        )
      );
    }
  });

program.parse();

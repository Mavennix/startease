#!/usr/bin/env node

import figlet from "figlet";
import { program } from "commander";
import chalk from "chalk";
import useGradient from "./src/utils/useGradient.js";
import { createBackendProject } from "./src/utils/create-backend-project.js";
import {
  promptBackendFramework,
  promptDatabase,
  promptFrontendFramework,
  promptFrontendLanguage,
  promptInitDatabase,
  promptOrm,
  promptProjectName,
  promptProjectStack,
  promptDependenciesInstall
} from "./src/utils/prompts.js";
import { createFrontendProject } from "./src/utils/create-frontend-project.js";
import { validateProjectName } from "./src/utils/helper.js";
import { sendQueuedStats } from "./src/utils/stat.js";

const toolName = "StartEase";
const jsBackendStacks = ["expressjs", "nestjs"];

program.version("1.0.0").description("StartEase CLI");

program
  .description("Scaffold a new project with StartEase")
  .action(async () => {
    await startProject();
  });

program.parse(process.argv);

async function startProject() {
  let framework;
  let projectName;
  let projectStack;
  let initDB;
  let database;
  let orm;
  let language;
  let installDependencies;

  const initialMsg = `Simplify Project Setup with the. ${chalk.green(
    toolName,
  )} CLI Tool.`;

  // render cli title
  renderTitle();
  console.log(chalk.white(initialMsg));

  projectName = await promptProjectName();
  validateProjectName(projectName);

  projectStack = await promptProjectStack();

  // process sending of stats in background
  sendQueuedStats();

  /**
   * start prompts
   */
  if (projectStack === "frontend") {
    language = await promptFrontendLanguage();
    framework = await promptFrontendFramework();

    if (framework === "html-x-css-x-javascript") {
      return await createFrontendProject(projectName, framework, "javascript");
    }

    return await createFrontendProject(projectName, framework, language);
  } else if (projectStack === "backend") {
    framework = await promptBackendFramework();

    initDB = await promptInitDatabase();

    if (initDB) {
      database = await promptDatabase(framework);

      if (jsBackendStacks.includes(framework)) {
        orm = await promptOrm(database);
      }
    }
    installDependencies = await promptDependenciesInstall();
    

    await createBackendProject(projectName, framework, database, orm, installDependencies);
  }
}

/**
 * Render cli title
 */
function renderTitle() {
  const figletConfig = {
    font: "Big",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 80,
    whitespaceBreak: true,
  };

  useGradient({
    title: figlet.textSync("StartEase", figletConfig),
  });
}

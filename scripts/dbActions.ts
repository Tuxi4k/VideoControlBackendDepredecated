#!/usr/bin/env node

import { execSync } from "child_process";
import readline from "readline";
import { emitKeypressEvents } from "readline";
import { existsSync } from "fs";
import { join } from "path";

// Определяем пакетный менеджер
const getPackageManager = (): string => {
  if (existsSync(join(process.cwd(), "pnpm-lock.yaml"))) {
    return "pnpm exec";
  }
  if (existsSync(join(process.cwd(), "yarn.lock"))) {
    return "yarn";
  }
  return "npx";
};

const packageManagerEx = getPackageManager();

// Утилиты для CLI
const createRL = () =>
  readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

const ask = (rl: readline.Interface, query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(`${query}: `, (answer) => {
      resolve(answer.trim());
    });
  });
};

const selectFromList = async (
  items: string[],
  title: string
): Promise<number> => {
  let selectedIndex = 0;

  const render = () => {
    console.clear();
    console.log(
      `\n${title} (use arrow keys, enter to select, Ctrl+C to exit):\n`
    );
    items.forEach((item, index) => {
      const prefix = index === selectedIndex ? "> " : "  ";
      console.log(`${prefix}${item}`);
    });
  };

  emitKeypressEvents(process.stdin);

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  process.stdin.resume();

  render();

  return new Promise((resolve) => {
    const keypressHandler = (str: string, key: any) => {
      if (key.name === "up" && selectedIndex > 0) {
        selectedIndex--;
        render();
      } else if (key.name === "down" && selectedIndex < items.length - 1) {
        selectedIndex++;
        render();
      } else if (key.name === "return" || key.name === "enter") {
        process.stdin.removeListener("keypress", keypressHandler);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.pause();
        resolve(selectedIndex);
      } else if (key.name === "c" && key.ctrl) {
        process.stdin.removeListener("keypress", keypressHandler);
        if (process.stdin.isTTY) {
          process.stdin.setRawMode(false);
        }
        process.stdin.pause();
        console.log("\nOperation cancelled");
        process.exit(0);
      }
    };

    process.stdin.on("keypress", keypressHandler);
  });
};

// Функции для выполнения команд
const runCommand = (command: string) => {
  try {
    console.log(`\nExecuting: ${command}\n`);
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error);
  }
};

const runTSX = (script: string) => {
  // Пытаемся найти tsx в node_modules или используем packageManagerEx
  try {
    execSync("tsx --version", { stdio: "ignore" });
    runCommand(`tsx ${script}`);
  } catch {
    runCommand(`${packageManagerEx} tsx ${script}`);
  }
};

const runPrisma = (command: string) => {
  // Пытаемся найти prisma в node_modules или используем packageManagerEx
  try {
    execSync("prisma --version", { stdio: "ignore" });
    runCommand(`prisma ${command}`);
  } catch {
    runCommand(`${packageManagerEx} prisma ${command}`);
  }
};

// Меню действий
const showMainMenu = async (): Promise<number> => {
  const menuItems = ["📊 Database Operations", "👥 User Management", "🚪 Exit"];

  return await selectFromList(menuItems, "DATABASE MANAGER - Select Category");
};

const showDatabaseMenu = async (): Promise<number> => {
  const menuItems = [
    "🔄 Reset Database (db:refresh)",
    "🔧 Generate Prisma Client (db:generate)",
    "🧹 Sanitize Database (db:sanitize)",
    "⬅️  Back to Main Menu",
  ];

  return await selectFromList(menuItems, "DATABASE OPERATIONS");
};

const showUserMenu = async (): Promise<number> => {
  const menuItems = [
    "👤 Create User (db:createUser)",
    "✏️  Edit User (db:userChange)",
    "👁️  View User (db:userView)",
    "🗑️  Delete User (db:userDelete)",
    "⬅️  Back to Main Menu",
  ];

  return await selectFromList(menuItems, "USER MANAGEMENT");
};

// Обработчики действий
const handleDatabaseOperation = async (choice: number) => {
  switch (choice) {
    case 0: // Reset Database
      runPrisma("db push --force-reset");
      break;
    case 1: // Generate Prisma Client
      runPrisma("generate");
      break;
    case 2: // Sanitize Database
      runTSX("dbSanitize.ts");
      break;
  }
};

const handleUserOperation = async (choice: number) => {
  switch (choice) {
    case 0: // Create User
      runTSX("createUser.ts");
      break;
    case 1: // Edit User
      runTSX("changeUser.ts");
      break;
    case 2: // View User
      runTSX("viewUser.ts");
      break;
    case 3: // Delete User
      runTSX("deleteUser.ts");
      break;
  }
};

// Главная функция
const main = async () => {
  console.clear();
  console.log("🚀 Database Manager Started");
  console.log(`📦 Using package manager: ${packageManagerEx}\n`);

  while (true) {
    const mainChoice = await showMainMenu();

    if (mainChoice === 0) {
      // Database Operations
      const dbChoice = await showDatabaseMenu();
      if (dbChoice === 3) continue; // Back
      await handleDatabaseOperation(dbChoice);
    } else if (mainChoice === 1) {
      // User Management
      const userChoice = await showUserMenu();
      if (userChoice === 4) continue; // Back
      await handleUserOperation(userChoice);
    } else if (mainChoice === 2) {
      // Exit
      console.log("\n👋 Goodbye!");
      process.exit(0);
    }

    // Пауза перед возвратом в меню
    const rl = createRL();
    await ask(rl, "\nPress Enter to continue");
    rl.close();
  }
};

// Обработка ошибок
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Запуск приложения
main().catch(console.error);

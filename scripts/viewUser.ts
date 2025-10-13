import prisma from "../utils/database/engine.js";
import readline from "readline";
import { emitKeypressEvents } from "readline";

const formatDate = (date: Date): string => {
  return date.toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const viewUser = async (user: any) => {
  console.clear();
  console.log("=".repeat(50));
  console.log("USER DETAILS");
  console.log("=".repeat(50));
  console.log(`ID: ${user.id}`);
  console.log(`Username: ${user.username}`);
  console.log(`Email: ${user.email || "Not specified"}`);
  console.log(`Created: ${formatDate(user.createdAt)}`);
  console.log(`Last Updated: ${formatDate(user.updatedAt)}`);
  console.log("=".repeat(50));
};

const selectUser = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "asc" },
    });

    if (users.length === 0) {
      console.log("\nNo users found");
      return null;
    }

    let selectedIndex = 0;

    const render = () => {
      console.clear();
      console.log(
        "\nSelect a user to VIEW (use arrow keys, enter to select, Ctrl+C to exit):\n"
      );
      users.forEach((user, index) => {
        const prefix = index === selectedIndex ? "> " : "  ";
        console.log(`${prefix}${user.username} (${user.email || "no email"})`);
      });
    };

    // Добавляем обработку событий клавиатуры
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
        } else if (key.name === "down" && selectedIndex < users.length - 1) {
          selectedIndex++;
          render();
        } else if (key.name === "return" || key.name === "enter") {
          // Убираем обработчик событий
          process.stdin.removeListener("keypress", keypressHandler);
          if (process.stdin.isTTY) {
            process.stdin.setRawMode(false);
          }
          process.stdin.pause();
          const selectedUser = users[selectedIndex];
          resolve(selectedUser);
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
  } catch (error) {
    console.error("\nError fetching users:", error);
    return null;
  }
};

const main = async () => {
  try {
    const selectedUser = await selectUser();
    if (selectedUser) {
      await viewUser(selectedUser);
    }
  } catch (error) {
    console.error("\nError in main function:", error);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
};

// Обработка непредвиденных ошибок
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Запуск приложения
main();

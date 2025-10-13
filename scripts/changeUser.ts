import prisma from "../utils/database/engine.js";
import readline from "readline";
import { emitKeypressEvents } from "readline";
import bcrypt from "bcryptjs";

const askWithDefault = (
  query: string,
  defaultValue: string
): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${query} (${defaultValue}): `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
};

const editUser = async (user: any) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (query: string, defaultValue: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(`${query} (${defaultValue}): `, (answer) => {
        resolve(answer.trim() || defaultValue);
      });
    });
  };

  try {
    const newUsername = await ask("Username", user.username);
    const newEmail = await ask("Email", user.email || "");
    const changePassword = await ask("Change password", "y/n");

    let newPassword = user.password;
    if (changePassword.toLowerCase() === "y") {
      const password = await ask("New password", "");
      if (password) {
        newPassword = await bcrypt.hash(password, 10);
      }
    }

    const updateData: any = {};
    if (newUsername !== user.username) updateData.username = newUsername;
    if (newEmail !== (user.email || "")) updateData.email = newEmail || null;
    if (newPassword !== user.password) updateData.password = newPassword;

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
      console.log("\nUser updated successfully");
    } else {
      console.log("\nNo changes made");
    }
  } catch (error) {
    console.error("\nError updating user:", error);
  } finally {
    rl.close();
  }
};

const selectUser = async () => {
  try {
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      console.log("\nNo users found");
      return null;
    }

    let selectedIndex = 0;

    const render = () => {
      console.clear();
      console.log(
        "\nSelect a user (use arrow keys, enter to select, Ctrl+C to exit):\n"
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
          console.log(`\n\nSelected user: ${selectedUser.username}\n`);
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
      await editUser(selectedUser);
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

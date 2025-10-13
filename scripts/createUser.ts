import bcrypt from "bcryptjs";
import prisma from "../utils/database/engine.js";
import readline from "readline";

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

const createUser = async () => {
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
    const username = await ask("Enter username", "admin");
    const emailInput = await ask("Enter email", "null");
    const password = await ask("Enter password", "admin");

    const email = emailInput === "null" ? null : emailInput;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Проверяем, существует ли пользователь с таким username
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      console.log(`\nError: User with username "${username}" already exists`);
      return;
    }

    // Если email указан, проверяем его уникальность через findFirst
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email },
      });

      if (existingEmail) {
        console.log(`\nError: User with email "${email}" already exists`);
        return;
      }
    }

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        lastToken: null,
      },
    });

    console.log("\nUser created successfully:", user.username);
  } catch (error: any) {
    if (error.code === "P2002") {
      // Резервная обработка ошибки уникальности
      const target = error.meta?.target?.[0];
      if (target === "username") {
        console.log(`\nError: User with this username already exists`);
      } else if (target === "email") {
        console.log(`\nError: User with this email already exists`);
      } else {
        console.log(`\nError: Unique constraint failed on field: ${target}`);
      }
    } else {
      console.error("\nError creating user:", error.message);
    }
  } finally {
    rl.close();
  }
};

const main = async () => {
  try {
    await createUser();
  } catch (error: any) {
    console.error("\nError in main function:", error.message);
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

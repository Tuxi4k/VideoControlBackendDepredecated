import prisma from "../utils/database/engine.js";

const sanitizeUsers = async () => {
  // Get all users
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  // Clear table
  await prisma.user.deleteMany();

  // Reset sequence
  await prisma.$executeRaw`DELETE FROM sqlite_sequence WHERE name = 'users'`;

  // Reinsert with new ids
  for (let i = 0; i < users.length; i++) {
    await prisma.user.create({
      data: {
        id: i + 1,
        username: users[i].username,
        password: users[i].password,
        email: users[i].email,
        lastToken: users[i].lastToken,
        createdAt: users[i].createdAt,
        updatedAt: users[i].updatedAt,
      },
    });
  }
};

const sanitizeContacts = async () => {
  // Contacts use cuid, so no need to sanitize
  console.log("Contacts empty or use cuid, skipping sanitize");
};

const main = async () => {
  try {
    await sanitizeUsers();
    await sanitizeContacts();
    console.log("Database sanitized successfully");
  } catch (error) {
    console.error("Error sanitizing database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

main();

export { sanitizeUsers, sanitizeContacts };

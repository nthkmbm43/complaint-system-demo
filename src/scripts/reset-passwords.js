const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log("Resetting default passwords to bcrypt...");
  
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update staff
  const staff = ["admin", "teacher", "operator"];
  for (const username of staff) {
    await prisma.staff.upsert({
      where: { username },
      update: { password: hashedPassword },
      create: {
        username,
        password: hashedPassword,
        name: username.charAt(0).toUpperCase() + username.slice(1),
        role: username === "admin" ? 3 : username === "operator" ? 2 : 1,
        faculty: "",
        major: ""
      }
    });
    console.log(`Updated staff: ${username}`);
  }

  console.log("Done.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

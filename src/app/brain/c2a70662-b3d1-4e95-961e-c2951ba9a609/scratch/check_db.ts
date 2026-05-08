import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.organizationUnit.count();
    console.log("OrganizationUnit count:", count);
    const units = await prisma.organizationUnit.findMany({ take: 5 });
    console.log("Sample units:", units);
  } catch (err) {
    console.error("Error accessing OrganizationUnit:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting to clear complaint data...");

  try {
    // Delete in order to respect foreign keys if not cascaded
    const evaluations = await prisma.evaluation.deleteMany();
    console.log(`✅ Deleted ${evaluations.count} evaluations.`);

    const histories = await prisma.complaintHistory.deleteMany();
    console.log(`✅ Deleted ${histories.count} complaint histories.`);

    const notifications = await prisma.notification.deleteMany();
    console.log(`✅ Deleted ${notifications.count} notifications.`);

    const complaints = await prisma.complaint.deleteMany();
    console.log(`✅ Deleted ${complaints.count} complaints.`);

    console.log("\n✨ Database cleared successfully! You can now start testing from 0 complaints.");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

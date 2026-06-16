import { prisma } from "../lib/config/prisma";

async function main() {
  const users = await prisma.user.findMany();
  console.log("=== DB USERS ===");
  console.log(JSON.stringify(users, null, 2));
  console.log("=================");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());

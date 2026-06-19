import 'dotenv/config';
import { corsair } from '../corsair';
import { prisma } from '../lib/config/prisma';

async function main() {
  const accounts = await prisma.corsairAccount.findMany({
    include: { integration: true }
  });

  if (accounts.length === 0) {
    console.log('No corsair accounts found.');
    return;
  }

  // Find a tenant that has Gmail connected
  const gmailAccount = accounts.find(a => a.integrationId.includes('gmail') || a.id.includes('gmail'));
  const tenantId = gmailAccount ? gmailAccount.tenantId : accounts[0].tenantId;

  console.log(`Querying Gmail DB for tenant: ${tenantId}`);
  try {
    const dbMessages = await corsair.withTenant(tenantId).gmail.db.messages.search({
      data: {}
    });

    console.log(`Found ${dbMessages.length} messages in database.`);
    const detailed = dbMessages.filter(m => (m.data as any).subject || (m.data as any).from);
    console.log(`Of those, ${detailed.length} have detailed information.`);
    if (detailed.length > 0) {
      console.log('First detailed message data:', JSON.stringify(detailed[0], null, 2));
    }
  } catch (error: any) {
    console.error('Error querying Gmail DB:', error);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { prisma } from '@/lib/config/prisma'

const tenantId = 'xyz'

async function clearTokens() {
  // Get ALL accounts for this tenant
  const accounts = await prisma.corsairAccount.findMany({
    where: { tenantId }
  })

  if (accounts.length === 0) {
    console.log('No accounts found for tenant:', tenantId)
    return
  }

  const accountIds = accounts.map(a => a.id)
  console.log('Found accounts:', accountIds)

  // Delete all children across all accounts
  const deletedEntities = await prisma.corsairEntity.deleteMany({
    where: { accountId: { in: accountIds } }
  })
  console.log('Deleted entities:', deletedEntities.count)

  const deletedEvents = await prisma.corsairEvent.deleteMany({
    where: { accountId: { in: accountIds } }
  })
  console.log('Deleted events:', deletedEvents.count)

  // Now delete all accounts
  const deletedAccounts = await prisma.corsairAccount.deleteMany({
    where: { tenantId }
  })
  console.log('Deleted accounts:', deletedAccounts.count)

  console.log('✅ Done! Now sign out and sign back in.')
}

clearTokens()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
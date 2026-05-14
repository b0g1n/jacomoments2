const { execSync } = require('child_process')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('=================================')
console.log('  JacoMoments Database Setup')
console.log('=================================\n')

console.log('Acest script va crea tabelele în baza de date Vercel Postgres.\n')

rl.question('Apasă ENTER pentru a continua sau Ctrl+C pentru a anula...', async () => {
  try {
    console.log('\n1. Generez clientul Prisma...')
    execSync('npx prisma generate', { stdio: 'inherit' })

    console.log('\n2. Creez tabelele în baza de date (prisma db push)...')
    execSync('npx prisma db push', { stdio: 'inherit' })

    console.log('\n✅ Succes! Tabelele au fost create.')
    console.log('\nAcum poți:')
    console.log('  - Vizita site-ul')
    console.log('  - Intră în /admin (parola: admin123)')
    console.log('  - Încarcă poze și creează pachete\n')

  } catch (error) {
    console.error('\n❌ Eroare:', error.message)
    console.log('\nDacă primești eroare de conexiune, asigură-te că:')
    console.log('1. Ai creat un database Vercel Postgres')
    console.log('2. DATABASE_URL este setat în Vercel Environment Variables')
    console.log('3. Ai făcut pull la environment variables local: npx vercel env pull .env\n')
  } finally {
    rl.close()
  }
})

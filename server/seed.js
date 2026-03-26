const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  // 1. Seed Contacts
  const c1 = await prisma.contact.create({
    data: { name: 'M. Jean Dupont', project: 'Rénovation Haussmannien', value: '145k €', status: 'client', date: 'Depuis 01/2026' }
  });
  const c2 = await prisma.contact.create({
    data: { name: 'SARL Azur Immobilier', project: 'Extension Villa Palmeraie', value: '85k €', status: 'prospect', date: 'Devis envoyé le 12/03' }
  });
  const c3 = await prisma.contact.create({
    data: { name: 'Mme Sophie Martin', project: 'Aménagement Combles', value: '32k €', status: 'lost', date: 'Refusé le 05/03' }
  });
  const c4 = await prisma.contact.create({
    data: { name: 'Clinique des Alpes', project: 'Mise aux normes ERP', value: '250k €', status: 'prospect', date: 'Rdv le 28/03' }
  });
  const c5 = await prisma.contact.create({
    data: { name: 'Famille Leroy', project: 'Construction Garage', value: '45k €', status: 'client', date: 'Depuis 02/2026' }
  });

  // 2. Seed Projects
  const p1 = await prisma.project.create({
    data: { title: 'Extension Villa Azur', location: 'Marseille', date: 'Début prévu: 15 Avril', status: 'todo', progress: 0, contactId: c2.id }
  });
  const p2 = await prisma.project.create({
    data: { title: 'Rénovation Toiture', location: 'Aix-en-Provence', date: 'Début prévu: 02 Mai', status: 'todo', progress: 0 }
  });
  const p3 = await prisma.project.create({
    data: { title: 'Rénovation Haussmannien', location: 'Paris 8ème', progress: 60, status: 'inProgress', contactId: c1.id }
  });
  const p4 = await prisma.project.create({
    data: { title: 'Construction Garage', location: 'Lyon', progress: 30, status: 'inProgress', contactId: c5.id }
  });
  const p5 = await prisma.project.create({
    data: { title: 'Aménagement Combles', location: 'Bordeaux', date: 'Terminé le: 10 Mars', status: 'done', contactId: c3.id }
  });

  // 3. Seed Tasks (Planning)
  await prisma.task.createMany({
    data: [
      { projectId: p3.id, title: 'Dépose plomberie', team: 'Equipe A', start: 5, duration: 15, status: 'good' },
      { projectId: p3.id, title: 'Casse cloisons', team: 'Equipe Démolition', start: 10, duration: 10, status: 'good' },
      { projectId: p3.id, title: 'Évacuation gravats', team: 'Sous-traitant', start: 15, duration: 10, status: 'warning' },
      { projectId: p3.id, title: 'Traçage sols', team: 'Chef de chantier', start: 30, duration: 5, status: 'upcoming' },
      { projectId: p3.id, title: 'Nouveau réseau d\'eau', team: 'Plombiers', start: 35, duration: 25, status: 'upcoming' },
      { projectId: p3.id, title: 'Passage gaines élec', team: 'Électriciens', start: 40, duration: 20, status: 'upcoming' },
    ]
  });

  // 4. Seed Companies (Annuaire)
  await prisma.company.createMany({
    data: [
      { name: 'BTP Durand Frères', type: 'Gros Œuvre', city: 'Lyon', rating: 4.8, active: true },
      { name: 'EcoElec Pro', type: 'Électricité', city: 'Marseille', rating: 4.5, active: true },
      { name: 'Plomberie Express', type: 'Plomberie', city: 'Paris', rating: 4.2, active: false },
      { name: 'Azur Menuiserie', type: 'Menuiserie', city: 'Aix-en-Provence', rating: 4.9, active: true },
      { name: 'Toitures du Rhône', type: 'Charpente', city: 'Lyon', rating: 4.0, active: false },
    ]
  });

  console.log('Seeding completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

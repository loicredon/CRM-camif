const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- Contacts ---
app.get('/api/contacts', async (req, res) => {
  const contacts = await prisma.contact.findMany({ orderBy: { id: 'asc' } });
  res.json(contacts);
});

app.post('/api/contacts', async (req, res) => {
  const contact = await prisma.contact.create({ data: req.body });
  res.json(contact);
});

// --- Projects (Chantiers) ---
app.get('/api/projects', async (req, res) => {
  const projects = await prisma.project.findMany({ 
    include: { contact: true, companies: true },
    orderBy: { id: 'asc' }
  });
  res.json(projects);
});

app.post('/api/projects', async (req, res) => {
  const { title, location, progress, status, date, contactId, companyIds } = req.body;
  const project = await prisma.project.create({ 
    data: {
      title, location, progress, status, date, contactId,
      companies: companyIds && companyIds.length > 0 ? {
        connect: companyIds.map(id => ({ id: parseInt(id) }))
      } : undefined
    }
  });
  res.json(project);
});

app.get('/api/projects/:id', async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { contact: true, tasks: true, companies: true }
  });
  res.json(project);
});

app.put('/api/projects/:id/status', async (req, res) => {
  const { status } = req.body;
  const project = await prisma.project.update({
    where: { id: parseInt(req.params.id) },
    data: { status }
  });
  res.json(project);
});

// --- Tasks (Rétroplanning) ---
app.get('/api/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany({
    include: { project: true },
    orderBy: { start: 'asc' }
  });
  res.json(tasks);
});

app.get('/api/projects/:id/tasks', async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { projectId: parseInt(req.params.id) },
    orderBy: { start: 'asc' }
  });
  res.json(tasks);
});

app.post('/api/tasks', async (req, res) => {
  const task = await prisma.task.create({ data: req.body });
  res.json(task);
});

// --- Companies (Annuaire) ---
app.get('/api/companies', async (req, res) => {
  const companies = await prisma.company.findMany({ orderBy: { name: 'asc' } });
  res.json(companies);
});

app.post('/api/companies', async (req, res) => {
  const company = await prisma.company.create({ data: req.body });
  res.json(company);
});

// Dashboard specific summary
app.get('/api/dashboard', async (req, res) => {
  const activeProjects = await prisma.project.count({ where: { status: 'inProgress' } });
  const warmProspects = await prisma.contact.count({ where: { status: 'prospect' } });
  const atRiskTasks = await prisma.task.count({ where: { status: 'warning' } });
  
  res.json({
    activeProjects,
    warmProspects,
    atRiskTasks
  });
});

app.listen(PORT, () => {
  console.log(`Backend CRM CAMIF is running on http://localhost:${PORT}`);
});

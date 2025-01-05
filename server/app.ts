import express from 'express';
import cors from 'cors';
import { employees } from './employees';
import { sleep } from './sleep';

const app = express();
app.use(cors());

app.get('/', (_, res) => {
  res.send('Mock Server');
});

app.get('/api/employees', async (_, res) => {
  await sleep();
  res.send(employees);
});

app.get('/api/employees/:id', async (req, res) => {
  await sleep();
  const employee = employees.find((e) => e.id === req.params.id);
  if (!employee) {
    res.status(404).send('Employee not found');
  }
  res.send(employee);
});

app.post('/api/users/:id/offboard', async (req, res) => {
  await sleep();
  const employee = employees.find((e) => e.id === req.params.id);

  if (!employee) {
    res.status(404).send('Employee not found');
    return;
  }

  res.status(200).send({
    message: 'Offboarding data saved successfully',
    employee: employee.id,
  });
});

export const viteNodeApp = app;

import express from 'express';
import cors from 'cors';
import { employees } from './employees';

const app = express();
app.use(cors());

app.get('/', (_, res) => {
  res.send('Mock Server');
});

app.get('/employees', function (_, res) {
  res.send(employees);
});

app.get('/employees/:id', function (req, res) {
  const employee = employees.find((e) => e.id === req.params.id);
  if (!employee) {
    res.status(404).send('Employee not found');
  }
  res.send(employee);
});

export const viteNodeApp = app;

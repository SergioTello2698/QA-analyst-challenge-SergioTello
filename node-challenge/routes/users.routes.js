import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { usersMock } from '../mockData.js';

export const usersRouter = Router();

let users = [...usersMock];

// GET /api/users - obtener todos los usuarios
usersRouter.get('/', (req, res) => {
  res.status(200).json(users);
});

// GET /api/users/:id - obtener usuario por id
usersRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  const userFound = users.find(u => u._id === id);

  if (!userFound || userFound.deleted_at) {
    return res.status(404).end();
  }

  res.status(200).json(userFound);
});

// POST /api/users - crear usuario
usersRouter.post('/', (req, res) => {
  // Validar nombre
  if (!req.body.name || req.body.name.length < 2) {
    return res.status(400).json({ error: 'Nombre debe tener al menos 2 caracteres' });
  }

  // Validar email
  if (!req.body.email || !req.body.email.includes('@')) {
    return res.status(400).json({ error: 'Email debe tener formato válido' });
  }

  // Validar RFC mexicano
  if (!req.body.rfc) {
    return res.status(400).json({ error: 'RFC es requerido' });
  }
  
  const rfcClean = req.body.rfc.trim().toUpperCase();
  // RFC persona física: 4 letras + 6 números + 3 alfanuméricos
  // RFC persona moral: 3 letras + 6 números + 3 alfanuméricos
  const rfcRegex = /^[A-Z]{3,4}[0-9]{6}[A-Z0-9]{3}$/;
  
  if (!rfcRegex.test(rfcClean)) {
    return res.status(400).json({ error: 'RFC debe tener formato mexicano válido' });
  }

  const newUser = {
    _id: uuidv4(),
    name: req.body.name,
    email: req.body.email,
    rfc: rfcClean,
    deleted_at: null
  };

  users.push(newUser);
  res.status(201).json(newUser);
});

// DELETE /api/users/:id - eliminar usuario (soft delete)
usersRouter.delete('/:id', (req, res) => {
  const userId = req.params.id;
  const userIndex = users.findIndex(u => u._id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Soft delete - no eliminar físicamente, solo marcar como eliminado
  users[userIndex].deleted_at = new Date().toISOString();

  res.status(200).end();
});

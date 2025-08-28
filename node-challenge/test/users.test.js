// Pruebas para usuarios
import fetch from 'node-fetch';

const baseURL = 'http://localhost:3000/api';

describe('GET /api/users/:id', () => {
  
  it('debería devolver un usuario cuando existe', async () => {
    const userId = '1';
    
    const response = await fetch(`${baseURL}/users/${userId}`, {
      method: 'GET',
    });
    
    expect(response.status).toBe(200);
    
    const user = await response.json();
    expect(user._id).toBe(userId);
    expect(user.name).toBeDefined();
    expect(user.email).toBeDefined();
    expect(user.rfc).toBeDefined();
  });

  it('debería devolver 404 cuando el usuario no existe', async () => {
    const nonExistentId = 'usuario-que-no-existe';
    
    const response = await fetch(`${baseURL}/users/${nonExistentId}`, {
      method: 'GET',
    });
    
    expect(response.status).toBe(404);
  });
});

describe('DELETE /api/users/:id', () => {
  
  it('debería hacer soft delete de un usuario', async () => {
    const userId = '3';
    
    // Eliminar usuario
    const deleteResponse = await fetch(`${baseURL}/users/${userId}`, {
      method: 'DELETE',
    });
    
    expect(deleteResponse.status).toBe(200);
    
    // Verificar que el usuario ya no se puede obtener
    const getUserResponse = await fetch(`${baseURL}/users/${userId}`, {
      method: 'GET',
    });
    expect(getUserResponse.status).toBe(404);
  });

  it('debería devolver 404 al eliminar usuario que no existe', async () => {
    const nonExistentId = 'usuario-inexistente';
    
    const response = await fetch(`${baseURL}/users/${nonExistentId}`, {
      method: 'DELETE',
    });
    
    expect(response.status).toBe(404);
  });
});

describe('POST /api/users', () => {
  
  it('debería crear un usuario con datos válidos', async () => {
    const newUser = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      rfc: 'PEPJ900101ABC'
    };
    
    const response = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });
    
    expect(response.status).toBe(201);
    
    const createdUser = await response.json();
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.rfc).toBe(newUser.rfc);
  });

  it('debería rechazar usuario con nombre inválido', async () => {
    const invalidUser = {
      name: 'A',
      email: 'test@example.com',
      rfc: 'PEPJ900101ABC'
    };
    
    const response = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidUser),
    });
    
    expect(response.status).toBe(400);
  });

  it('debería rechazar usuario con email inválido', async () => {
    const invalidUser = {
      name: 'Juan Pérez',
      email: 'email-sin-arroba',
      rfc: 'PEPJ900101ABC'
    };
    
    const response = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidUser),
    });
    
    expect(response.status).toBe(400);
  });

  it('debería rechazar usuario con RFC inválido', async () => {
    const invalidUser = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      rfc: 'RFC123'
    };
    
    const response = await fetch(`${baseURL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidUser),
    });
    
    expect(response.status).toBe(400);
  });
});

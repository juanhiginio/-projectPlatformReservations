import {describe, expect, it, jest} from '@jest/globals';

jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

// Importa los módulos después de los mocks
const { create, getAll } = await import('../controllers/userController.js');
const User = (await import('../models/User.js')).default;

describe ('crear usuario', () => {

  it('debería crear un nuevo User', async () => { 

    const mockUser = { name: 'Alejandro', email: 'alejandro12@gmail.com', addres: 'cll 29 n # 71 a 19', password: '123456alejo', phone: 8792457832, typeUser: '1231231239817293' }; 
    User.create.mockResolvedValue(mockUser); 
    const req = { 
      body: { name: 'Alejandro', email: 'alejandro12@gmail.com', addres: 'cll 29 n # 71 a 19', password: '123456alejo', phone: 8792457832, typeUser: '1231231239817293'}, 
    }; 
    const res = { 
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }; 
      await create(req, res); 
      expect(res.status).toHaveBeenCalledWith(201); 
    
  });

});

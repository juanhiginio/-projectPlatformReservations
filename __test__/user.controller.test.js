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
  //hice los test para errores de create services
  it (`deberia tirar error 501`, async () =>{
    const mockUser = { name: 'Alejandro', email: 'alejandro12@gmail.com', addres: 'cll 29 n # 71 a 19', password: '123456alejo', phone: 8792457832, typeUser: '1231231239817293' }; 
    User.create.mockRejectedValue(null)


    const req ={body:mockUser}
    const res ={status: jest.fn().mockReturnThis(),
      json: jest.fn(),}


      await create(req, res); 

      expect(res.status).toHaveBeenCalledWith(501);
      expect (res.json).toHaveBeenCalledWith(`Error en el servidor`);
  })


});

describe ('obtener todos los usuarios', () => {

  it('beberia traer una lista con todos los usuarios registrados', async () => {

    const mockUser = [

      {_id: '67253243b8c35a1654542d70', 
        name: 'Alejandro', 
        email: 'alejandro12@gmail.com', 
        addres: 'cll 29 n # 71 a 19', 
        password: '123456alejo', 
        phone: 8792457832, 
        deletedAt: null, 
        typeUser: {_id: '66e2360cc4e29e2f6762e241', type: 'admin'}, 
        createdAt: "2024-11-01T19:55:47.992Z", 
        updatedAt: "2024-11-01T19:55:47.992Z"}

    ];

    const populateMock = jest.fn().mockResolvedValue(mockUser); 
    User.find.mockReturnValue({ populate: populateMock });

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUser);
  });

  it('deberia traer un error en caso de que no se encuentre el usuario', async () =>{


    
  });

});

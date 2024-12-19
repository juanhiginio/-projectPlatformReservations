import {describe, expect, it, jest} from '@jest/globals';
import { populate } from 'dotenv';
import { json } from 'express';

jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
}));

// Importa los módulos después de los mocks
const { create, getAll, getById, update, destroy } = await import('../controllers/userController.js');
const User = (await import('../models/User.js')).default;


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
        typeUser: {type: 'admin'}, 
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

    const populateMock = jest.fn().mockRejectedValue(new Error('Error en la base de datos'))
    User.find.mockReturnValue({populate: populateMock});

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('Usuario no encontrado');

  });

});

describe('Obtener los usuarios mediante el Id', () => {

  it('deberia devolver los usuarios mediante el Id', async () => {

    const mockUser = [

      {
        _id: '67253243b8c35a1654542d70', 
        name: 'Alejandro', 
        email: 'alejandro12@gmail.com', 
        addres: 'cll 29 n # 71 a 19', 
        password: '123456alejo', 
        phone: 8792457832, 
        deletedAt: null, 
        typeUser: {type: 'admin'}, 
        createdAt: "2024-11-01T19:55:47.992Z", 
        updatedAt: "2024-11-01T19:55:47.992Z"
      }

    ];

    User.findById.mockResolvedValue(mockUser);

    const req = {
      params: { id: '67253243b8c35a1654542d70' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getById(req, res);
    expect(res.json).toHaveBeenCalledWith(mockUser);

  });

  it('deberia devolver un error en caso de que no se encuentre el usuario', async () => {

    User.findById.mockRejectedValue(new Error('Error en el servidor'));

    const req = {
      params: { id: '67253243b8c35a1654542d70' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('Usuario no encontrado');

  });
  
});

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

  it (`deberia devolver un error en caso de que no se pueda crear un usario`, async () =>{
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

describe('Actualizacion de los datos de los usuarios', () => {

  it('deberia actualizar el usuario si se encuentra registrado', async () => {

    const mockUser = {
      
        _id: '67253243b8c35a1654542d70', 
        name: 'Alejandro', 
        email: 'alejandro12@gmail.com', 
        addres: 'cll 29 n # 71 a 19', 
        password: '123456alejo', 
        phone: 8792457832, 
        typeUser: {type: 'admin'}, 
        save: jest.fn().mockResolvedValue({})
      
    };

    User.findById.mockResolvedValue(mockUser);

    const req = {

      params: { id: '67253243b8c35a1654542d70' },
      body: {
        name: 'Alejandro2', 
        email: 'alejandro122@gmail.com', 
        addres: 'cll 30 n # 71 a 19', 
        password: '123456alejo2', 
        phone: 8792457833, 
        typeUser: {type: 'Vendedor'}
      }

    };    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await update(req, res);
    expect(mockUser.save).toHaveBeenCalled();

  });

  it('deberia devolver un error en caso de que el usuario no este registrado', async () => {

    User.findById.mockResolvedValue(null);

    const req = {

      params: { id: '67253243b8c35a1654542d70' },
      body: {
        name: 'Alejandro2', 
        email: 'alejandro122@gmail.com', 
        addres: 'cll 30 n # 71 a 19', 
        password: '123456alejo2', 
        phone: 8792457833, 
        typeUser: {type: 'Vendedor'}
      }

    };    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await update(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('El usuario con este id no existe');


  });

  it('deberia devolver un error en caso de que no se pueda crear el usuario', async () => {

    User.findById.mockRejectedValue(new Error('Error del servidor'));

    const req = {

      params: { id: '67253243b8c35a1654542d70' },
      body: {
        name: 'Alejandro2', 
        email: 'alejandro122@gmail.com', 
        addres: 'cll 30 n # 71 a 19', 
        password: '123456alejo2', 
        phone: 8792457833, 
        typeUser: {type: 'Vendedor'}
      }

    };    
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await update(req, res);
    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalledWith('Hubo un error al intentar actualizar el usuario');

  });

});

describe('Eliminacion de los usuarios', () => {

  it('se deberia de eliminar el usuario si existe', async () => {

    const mockUser = {
      
      _id: '67253243b8c35a1654542d70', 
      deletedAt: null,
      save: jest.fn().mockResolvedValue({})
    
    };   

    User.findById.mockResolvedValue(mockUser);

    const req = {
      params: { id: '67253243b8c35a1654542d70' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await destroy(req, res);
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith('Usuario eliminado con exito');

  });

  it('deberia devolver un error en caso de que el usuario no exista', async () => { 

    User.findById.mockResolvedValue(null);

    const req = {
      params: { id: '67253243b8c35a1654542d70' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await destroy(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('El usuario no existe');

  });

  it('deberia devolver un error en caso de que el usuario no se pueda eliminar', async () => { 

    User.findById.mockRejectedValue(new Error('Error en el servidor'));

    const req = {
      params: { id: '67253243b8c35a1654542d70' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await destroy(req, res);
    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalledWith('Hubo un error al eliminar el usuario que indicaste');

  });

});

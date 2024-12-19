import { describe, expect, it, jest } from "@jest/globals";
import { populate } from "dotenv";
import { query } from "express";
import { body } from "express-validator";
import { startSession } from "mongoose";

jest.unstable_mockModule("../models/Business.js", () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    findById: jest.fn(),
  },
}));

const { create, getAll, getById, update, destroy } = await import("../controllers/businessController.js");
const Business = (await import("../models/Business.js")).default;
const User = (await import("../models/User.js")).default;


describe("Create Business Controller", () => {
  it("debería crear un negocio si el usuario tiene permisos", async () => {
    const mockUser = {
      _id: "mockUserId",
      typeUser: "66e2360cc4e29e2f6762e241", // Tipo de usuario con permisos
    };

    const mockCreateBusiness = {
      name: "Empresa Maravilla",
      slogan: "Innovación a Cada Paso",
      address: "Calle Ficticia 123, Ciudad Imaginaria, País de la Fantasía",
      category: "Tecnología",
      phone: "+57 300 123 4567",
      email: "info@empresamaravilla.com",
      businessLogo: "logo.png",
      userBusiness: mockUser._id,
    };

    // Mock de User.findById para devolver un usuario válido
    User.findById.mockResolvedValue(mockUser);

    // Mock de Business.create para devolver un negocio simulado
    Business.create.mockResolvedValue(mockCreateBusiness);

    const req = {
      auth: { id: mockUser._id },
      body: mockCreateBusiness,
      file: { filename: "logo.png" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Ejecutar el controlador
    await create(req, res);

    // Validar resultados
    expect(User.findById).toHaveBeenCalledWith(mockUser._id);
    expect(Business.create).toHaveBeenCalledWith({
      name: mockCreateBusiness.name,
      slogan: mockCreateBusiness.slogan,
      address: mockCreateBusiness.address,
      category: mockCreateBusiness.category,
      phone: mockCreateBusiness.phone,
      email: mockCreateBusiness.email,
      businessLogo: "logo.png",
      userBusiness: mockUser._id,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCreateBusiness);
  });

  it("debería devolver un error 403 si el usuario no tiene permisos", async () => {
    const mockUser = {
      _id: "mockUserId",
      typeUser: "otherTypeUser", // Tipo de usuario sin permisos
    };

    User.findById.mockResolvedValue(mockUser);

    const req = { auth: { id: mockUser._id }, body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    // Ejecutar el controlador
    await create(req, res);

    // Validar resultados
    expect(res.status).not.toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      "No tienes permiso para crear un negocio"
    );
  });

  it("debería manejar errores del servidor correctamente", async () => {
    const mockUser = {
      _id: "mockUserId",
      typeUser: "66e2360cc4e29e2f6762e241", // Tipo de usuario con permisos
    };

    User.findById.mockResolvedValue(mockUser);

    // Simular un error en Business.create
    Business.create.mockImplementation(() => {
      throw new Error("Simulated server error");
    });

    const req = {
      auth: { id: mockUser._id },
      body: {
        name: "Empresa Fallida",
        slogan: "Error en la creación",
        address: "Calle Errónea",
        category: "Errores",
        phone: "1234567890",
        email: "error@example.com",
        businessLogo: "logo-error.png",
      },
      file: { filename: "logo-error.png" },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Ejecutar el controlador
    await create(req, res);

    // Validar resultados
    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalledWith("Error en el servidor");
  });
});

describe ('Obtener todos los negocios', () => {

  it('Deberia obtener todos los negocios registrados', async () => {

    const mockBusiness = [
      {
        _id: "6725341eb8c35a1654542d8b",
        name: "Empresa Maravilla",
        slogan: "Innovación a Cada Paso",
        address: "Calle Ficticia 123, Ciudad Imaginaria, País de la Fantasía",
        category: "Tecnología",
        phone: "+57 300 123 4567",
        email: "info@empresamaravilla.com",
        businessLogo: "logo.png",
        deletedAt: null,
        userBusiness: {
          _id: '67253243b8c35a1654542d70',
          name: 'Alejandro', 
          email: 'alejandro12@gmail.com'
        },
        services: {
          _id: "6725341eb8c35a1654542d8a",
          name: "Restaurante",
          slogan: "Esto es una prueba",
          address: "Calle 9 #35 - 53 arreo",
          category: "otros",
          phone: "+57 31245679898",
          email: "businessNegocioNuevo@business.com",
          businessLogo: "1730491422429-auron sesi - copia.jpg"
        }

      }
    ];

    const populateUserMock = jest.fn().mockResolvedValue(mockBusiness);
    const populateServiceMock = jest.fn().mockReturnValue({ populate: populateUserMock });
    Business.find.mockReturnValue({ populate: populateServiceMock });

    const req = {
      query: { category: 'Tecnología' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(200); 
    expect(res.json).toHaveBeenCalledWith(mockBusiness);

  });

  it('deberia traer un error en caso de que no se encuentre el negocio', async () => {

    const populateUserMock = jest.fn().mockRejectedValue(new Error('Error en la base de datos'));
    const populateServiceMock = jest.fn().mockReturnValue({ populate: populateUserMock });
    Business.find.mockReturnValue({ populate: populateServiceMock });

    const req = {
      query: { category: 'Tecnología'}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('Negocio no encontrado');

  });

});

describe('Obterner los negocios por el Id', () => {

  it('deberia traer los negocios consultados por el Id', async () => {

    const mockBusiness = [
      {
        _id: "6725341eb8c35a1654542d8b",
        name: "Empresa Maravilla",
        slogan: "Innovación a Cada Paso",
        address: "Calle Ficticia 123, Ciudad Imaginaria, País de la Fantasía",
        category: "Tecnología",
        phone: "+57 300 123 4567",
        email: "info@empresamaravilla.com",
        businessLogo: "logo.png",
        deletedAt: null,
        userBusiness: {
          _id: '67253243b8c35a1654542d70',
          name: 'Alejandro', 
          email: 'alejandro12@gmail.com'
        },
        services: {
          _id: "6725341eb8c35a1654542d8a",
          name: "Restaurante",
          slogan: "Esto es una prueba",
          address: "Calle 9 #35 - 53 arreo",
          category: "otros",
          phone: "+57 31245679898",
          email: "businessNegocioNuevo@business.com",
          businessLogo: "1730491422429-auron sesi - copia.jpg"
        }

      }
    ];

    const populateServiceMock = jest.fn().mockResolvedValue(mockBusiness);
    Business.findById.mockReturnValue({ populate: populateServiceMock });

    const req = {
      params: { 
        id: "6725341eb8c35a1654542d8b"
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getById(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toBeCalledWith(mockBusiness);

  });

  it('deberia de traer un error en caso de que no encuentre ningun negocio con ese Id', async () => {

    const populateServiceMock = jest.fn().mockRejectedValue(new Error('Error en la base de datos'));
    Business.findById.mockReturnValue({ populate: populateServiceMock });

    const req = {
      params: { id: "6725341eb8c35a1654542d8b" }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getById(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('Negocio no encontrado');

  });

});

describe('Actualizacion de los negocios', () => {

  it('deberia de actualizar el negocio', async () => {

    const mockUser = {
      _id: '67253243b8c35a1654542d71', 
      typeUser: '66e2360cc4e29e2f6762e241'
    };

    const mockBusiness = {
      _id: '67253243b8c35a1654542d70',
      name: "Empresa Maravilla",
      address: "Calle Ficticia 123, Ciudad Imaginaria, País de la Fantasía",
      phone: "+57 300 123 4567",
      email: "info@empresamaravilla.com",
      category: "Tecnología",
      slogan: "Innovación a Cada Paso",  
      businessLogo: "logo.png",
      save: jest.fn().mockResolvedValue({})
    };

    User.findById.mockResolvedValue(mockUser);
    Business.findById.mockResolvedValue(mockBusiness);

    const req = {

      auth: { id: '67253243b8c35a1654542d71' }, 
      params: { id: '67253243b8c35a1654542d70' },
      body: {
        name: "Empresa Maravilla2",
        address: "Calle 2 # 13 12",
        phone: "+57 300 123 4675",
        email: "info2@empresamaravilla.com",
        category: "Tecnología2",
        slogan: "Innovación 2"
      },
      file: {
        filename: 'logo2.png'
      }

    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await update(req, res);
    expect(mockBusiness.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith('El negocio se actualizo');
    
  });

  it('deberia de traer un error en caso de que el negocio no exista', async () => {

    const mockUser = {
      _id: '67253243b8c35a1654542d71', 
      typeUser: '66e2360cc4e29e2f6762e241'
    };

    User.findById.mockResolvedValue(mockUser);
    Business.findById.mockResolvedValue(null);

    const req = {
      auth: { id: '67253243b8c35a1654542d71' }, 
      params: { id: '67253243b8c35a1654542d70' },
      body: {},
      file: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await update(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('No existe negocio con este id');

  });

  it('deberia traer un error en caso de que el usuario no tenga los permisos necesarios', async () => {

    const mockUser = {
      _id: '67253243b8c35a1654542d71', 
      typeUser: '66e2360cc4e29e2f6762e242'
    };

    User.findById.mockResolvedValue(mockUser);

    const req = {
      auth: { id: '67253243b8c35a1654542d71' }, 
      params: { id: '67253243b8c35a1654542d70' },
      body: {},
      file: {}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await update(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith('No tienes permiso para editar un negocio');

  });
 
});

describe('Eliminacion de los negocios', () => {

  it('deberia eliminar un negocio si el usuario esta autorizado', async () => {

    const mockUser = {
      _id: '67253243b8c35a1654542d71', 
      typeUser: '66e2360cc4e29e2f6762e241'
    };

    const mockBusiness = {
      _id: '67253243b8c35a1654542d70',
      deletedAt: null,
      save: jest.fn().mockResolvedValue({})
    };

    User.findById.mockResolvedValue(mockUser);
    Business.findById.mockResolvedValue(mockBusiness);

    const req = {
      auth: { id: '67253243b8c35a1654542d71' }, 
      params: { id: '67253243b8c35a1654542d70' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await destroy(req, res);
    expect(mockBusiness.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith('El negocio fue eliminado con exito');

  });

  it('deberia devolver un mensaje de error si no se encuentra el negocio', async () => {

    const mockUser = {
      _id: '67253243b8c35a1654542d71', 
      typeUser: '66e2360cc4e29e2f6762e241'
    };

    User.findById.mockResolvedValue(mockUser);
    Business.findById.mockResolvedValue(null);

    const req = {
      auth: { id: '67253243b8c35a1654542d71' },
      params: { id: '67253243b8c35a1654542d70' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await destroy(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('El negocio con el ID indicado no existe');

  });

  it('deberia devolver un mensaje de error si no se puede eliminar el negocio', async () => {

    const mockUser = {
      _id: '67253243b8c35a1654542d71', 
      typeUser: '66e2360cc4e29e2f6762e241'
    };

    User.findById.mockResolvedValue(mockUser);
    Business.findById.mockImplementation(() => { throw new Error('Error en la base de datos'); });

    const req = {
      auth: { id: '67253243b8c35a1654542d71' },
      params: { id: '67253243b8c35a1654542d70' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await destroy(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('Hubo un error inesperado al eliminar el negocio');

  });

  it('deberia deberia devolver un mensaje de error si el usuario no esta autorizado', async () => {

    const mockUser = {
      _id: '67253243b8c35a1654542d71', 
      typeUser: '66e2360cc4e29e2f6762e242'
    };

    User.findById.mockResolvedValue(mockUser);

    const req = {
      auth: { id: '67253243b8c35a1654542d71' }, 
      params: { id: '67253243b8c35a1654542d70' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await destroy(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith('No tienes permiso para eliminar un negocio');
    
  });

});

import { describe, expect, it, jest } from "@jest/globals";
import { populate } from "dotenv";
import { query } from "express";
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

const { create, getAll } = await import("../controllers/businessController.js");
const Business = await import("../models/Business.js");
const User = await import("../models/User.js");
const BusinessGet = (await import('../models/Business.js')).default;


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
    User.default.findById.mockResolvedValue(mockUser);

    // Mock de Business.create para devolver un negocio simulado
    Business.default.create.mockResolvedValue(mockCreateBusiness);

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
    expect(User.default.findById).toHaveBeenCalledWith(mockUser._id);
    expect(Business.default.create).toHaveBeenCalledWith({
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

    User.default.findById.mockResolvedValue(mockUser);

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

    User.default.findById.mockResolvedValue(mockUser);

    // Simular un error en Business.create
    Business.default.create.mockImplementation(() => {
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
    BusinessGet.find.mockReturnValue({ populate: populateServiceMock });

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
    BusinessGet.find.mockReturnValue({ populate: populateServiceMock });

    const req = {
      query: { category: 'Tecnología'}
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getAll(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith('negocio no encontrado');

  });

});

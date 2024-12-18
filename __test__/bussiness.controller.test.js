import { describe, expect, it, jest } from "@jest/globals";

jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    findById: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/Business.js", () => ({
  default: {
    create: jest.fn(), 
  },
}));

const { create } = await import("../controllers/businessController.js");
const User = await import("../models/User.js");
const Business = await import("../models/Business.js");

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



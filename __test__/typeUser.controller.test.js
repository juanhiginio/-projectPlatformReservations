import { jest, expect, describe } from "@jest/globals";
import request from "supertest";

jest.unstable_mockModule("../models/TypeUser.js", () => ({
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    save: jest.fn(),
  },
}));
//mocks
const mockTypeUsers = [
  { id: 1, type: `Admin` },
  { id: 2, type: `SuperUser` },
];
const mockIdTypeUsers = { id: 1, name: `Admin` };
const mockCreateTypeUser = { type: `SuperUser` };

const { getAll, getById, create, update, destroy } = await import(
  `../controllers/typeUserController.js`
);
const TypeUser = (await import(`../models/TypeUser.js`)).default;

describe(`Get All TypeUsers`, () => {
  it(`Deberia devolver el tipo de usuario`, async () => {
    //datos mock para simular respuesta de mongo

    TypeUser.find.mockResolvedValue(mockTypeUsers); // es para que find resuelva con el mock

    const req = {}; //este es el mock de el req de la funcion
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(), //mock para la funcion json
    };

    //llamando la funcion con el mock de res y res
    await getAll(req, res);
    //verificar si se llamo el mock en la funcion
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTypeUsers);
  });

  it(`Deberia devolver un error con status 404 si ocurre un fallo `, async () => {
    TypeUser.find.mockRejectedValue(new Error(`error en la base de datos`)); //Configura el mock para que tire un error y no deje avanzar

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(), //esto sirve para pueda usar los metodos encadenados de el res
      json: jest.fn(),
    };

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(`Tpo de Usuario no encontrado`);
  });
});

describe(`Get By Id TypeUser`, () => {
  it(`deberia devolver el usuario por id `, async () => {
    TypeUser.findById.mockResolvedValue(mockIdTypeUsers);

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await getById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockIdTypeUsers);
  });
  it(`deberia de tirar error 404`, async () => {
    TypeUser.findById.mockRejectedValue(null);

    const req = { params: { id: 1 } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await getById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(`Tipo de Usuario no encontrado`);
  });
});

describe(`Create TypeUser`, () => {
  it(`deberia crear el Typeuser`, async () => {
    TypeUser.create.mockResolvedValue(mockCreateTypeUser);

    const req = { body: mockCreateTypeUser };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCreateTypeUser);
  });

  it(`deberia tirar error 501 `, async () => {
    TypeUser.create.mockRejectedValue(null);

    const req = { body: mockCreateTypeUser };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalledWith(`Error en el servidor`);
  });
});

describe(`Update TypeUser`, () => {
  it(`deberia actualizar el typeUser`, async () => {
    const mockUpdateTypeUser = { _id: 1, type: "User",save: jest.fn() };

    TypeUser.findById.mockResolvedValue(mockUpdateTypeUser);

    const req = { params: { id: 1 }, body: { type: `SuperUser`  } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await update(req, res);

    expect(mockUpdateTypeUser.type).toBe('SuperUser');
    expect(mockUpdateTypeUser.save).toHaveBeenCalledWith();
    expect(res.json).toHaveBeenCalledWith(`El tipo de usuario se actualizo`);
  });
  it(`si pasan el update sin un type`,async () =>{
    TypeUser.findById.mockResolvedValue(null)


    const req = { params: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };


    await update (req,res);

    expect(res.json).toHaveBeenCalledWith("El tipo de usuario no exite con este id");
  })
});

describe("Destroy TypeUser", () => {
    it("debería eliminar el tipo de usuario si existe", async () => {
      const mockTypeUserToDelete = { 
        _id: 1, 
        deletedAt: null, 
        save: jest.fn() 
      };
  
      TypeUser.findById = jest.fn().mockResolvedValue(mockTypeUserToDelete);
  
      const req = { params: { id: 1 } };
      const res = { json: jest.fn() };
  
      await destroy(req, res);
  
      expect(mockTypeUserToDelete.deletedAt).not.toBeNull();
      expect(mockTypeUserToDelete.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith("Tipo de Usuario eliminado");
    });
  
    
    it("debería manejar errores internos al eliminar el tipo de usuario", async () => {
      TypeUser.findById = jest.fn().mockRejectedValue(new Error("Error interno"));
  
      const req = { params: { id: 1 } };
      const res = { 
        status: jest.fn().mockReturnThis(), 
        json: jest.fn() 
      };
  
      await destroy(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        "Ups, hubo un error al eliminar el rol que indicaste, puede que el rol con el ID indicado no exista en los registros"
      );
    });
  });
import { jest, describe, expect, it} from '@jest/globals';
import TypeUser from '../models/TypeUser.js';
import { populate } from 'dotenv';

jest.unstable_mockModule('../models/Service.js', () => ({
    default: {
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        populate: jest.fn(),
    }
}));

jest.unstable_mockModule("../models/User.js", () => ({
    default: {
      findById: jest.fn(),
    },
  }));

const { getAll, getById, create, update, destroy } = await import('../controllers/serviceController.js');

const User = (await import('../models/User.js')).default;
const Service = (await import('../models/Service.js')).default;


describe('obtener todos los servicios', () => {

    it('deberia trater una lista con los servicios registrados', async () => {

        const mockService = [
            {
                _id: "6760c65498779fa8af333ced",
                name: "Restaurante",
                serviceLogo: "1734395476089-1e7574572efb53f3542b0415d8059205.jpg",
                schedule: "Jueves a Domingo",
                serviceTime: "N horas",
                businessDays: "Miercoles, Juves, Viernes, Sabado, Domingo",
                address: "Cra 7ma # 25 - 42",
                details: "Llegar 5 minutos antes de la reserva",
                price: 75000,
                deletedAt: null,
                businessService: {
                    _id: "6725341eb8c35a1654542d8a",
                    name: "Restaurante",
                    slogan: "Esto es una prueba",
                    address: "Calle 9 #35 - 53 arreo",
                    category: "otros",
                    phone: "+57 31245679898",
                    email: "businessNegocioNuevo@business.com",
                    businessLogo: "1730491422429-auron sesi - copia.jpg",
                    deletedAt: "2024-12-17T00:36:48.493Z",
                    userBusiness: "67253243b8c35a1654542d70",
                    createdAt: "2024-11-01T20:03:42.433Z",
                    updatedAt: "2024-12-17T00:36:48.494Z"
                },
                createdAt: "2024-12-17T00:31:16.098Z",
                updatedAt: "2024-12-17T00:31:16.098Z"
            }            
        ];

        const populateBusinessMock = jest.fn().mockResolvedValue(mockService);
        Service.find.mockReturnValue({ populate: populateBusinessMock });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getAll(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockService);

    });

    it('deberia devolver un error en caso de que no se encuentren servicios', async () => {

        const populateBusinessMock = jest.fn().mockRejectedValue(new Error('Error en el servidor'));       
        Service.find.mockReturnValue({ populate: populateBusinessMock });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getAll(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith('No se encontro la lista de servicios');

    });

});

describe('obtener los servicios mediante el Id', () => {

    it('deberia obtener los servicios mediante el Id', async () => {

        const mockService = {

            _id: "6760c65498779fa8af333ced",
            name: "Restaurante",
            serviceLogo: "1734395476089-1e7574572efb53f3542b0415d8059205.jpg",
            schedule: "Jueves a Domingo",
            serviceTime: "N horas",
            businessDays: "Miercoles, Juves, Viernes, Sabado, Domingo",
            address: "Cra 7ma # 25 - 42",
            details: "Llegar 5 minutos antes de la reserva",
            price: 75000,
            deletedAt: null,
            businessService: {
                _id: "6725341eb8c35a1654542d8a",
                name: "Restaurante",
                slogan: "Esto es una prueba",
                address: "Calle 9 #35 - 53 arreo",
                category: "otros",
                phone: "+57 31245679898",
                email: "businessNegocioNuevo@business.com",
                businessLogo: "1730491422429-auron sesi - copia.jpg",
                deletedAt: "2024-12-17T00:36:48.493Z",
                userBusiness: "67253243b8c35a1654542d70",
                createdAt: "2024-11-01T20:03:42.433Z",
                updatedAt: "2024-12-17T00:36:48.494Z"
            },
            createdAt: "2024-12-17T00:31:16.098Z",
            updatedAt: "2024-12-17T00:31:16.098Z"
        };

        Service.findById.mockResolvedValue(mockService);

        const req = {
            params: { id: '6760c65498779fa8af333ced' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getById(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockService);

    });

    it('dederia devolver un error en caso de que no encuentre un servicio con ese Id', async () => {

        Service.findById.mockRejectedValue(new Error('Error en el servidor'));

        const req = {
            params: { id: '6760c65498779fa8af333ced' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith('El servicio especificado no se ha encontrado en los registros');

    });

});

describe('Creacion de servicios', () => {

    it('Debería crear un servicio', async () => {

        const mockUsuario = {
            _id: "67253243b8c35a1654542d70",
            typeUser: "66e2360cc4e29e2f6762e241"
        };

        const mockService = {

            _id: '67253243b8c35a1654542d72', 
            name: 'Service A', 
            serviceLogo: 'logo.png', 
            schedule: '9:00-17:00', 
            serviceTime: '60 minutos', 
            businessDays: 'Miercoles, Juves, Viernes, Sabado, Domingo', 
            address: 'Calle 123', 
            details: 'Detalles del servicio', 
            price: 15000, 
            businessService: '67253243b8c35a1654542d73'

        };

        User.findById.mockResolvedValue(mockUsuario);
        Service.create.mockResolvedValue(mockService);

        const req = {
            auth: { id: "67253243b8c35a1654542d70" },
            body : {
                name: "Service A",
                schedule: "9:00-17:00",
                serviceTime: "60 minutos",
                businessDays: "Miercoles, Juves, Viernes, Sabado, Domingo",
                address: "Calle 123",
                details: "Detalles del servicio",
                price: 15000,
                businessService: "67253243b8c35a1654542d3"
            },
            file: { filename: "logo.png" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await create(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith("El nuevo Servicio ha sido creado con exito");

    });

    it('deberia devolver un error en caso de que el servicio no pueda ser creado', async () => {

        const mockUsuario = {
            _id: "67253243b8c35a1654542d70",
            typeUser: "66e2360cc4e29e2f6762e241"
        };

        User.findById.mockResolvedValue(mockUsuario);
        Service.create.mockRejectedValue(new Error('Error en el servidor'));

        const req = {
            auth: { id: "67253243b8c35a1654542d70" },
            body : {
                name: "Service A",
                schedule: "9:00-17:00",
                serviceTime: "60 minutos",
                businessDays: "Miercoles, Juves, Viernes, Sabado, Domingo",
                address: "Calle 123",
                details: "Detalles del servicio",
                price: 15000,
                businessService: "67253243b8c35a1654542d3"
            },
            file: { filename: "logo.png" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await create(req, res);
        expect(res.status).toHaveBeenCalledWith(501);
        expect(res.json).toHaveBeenCalledWith("Ha ocurrido un error al crear un nuevo servicio");


    });

    it('deberia devolver un error en caso de que el usuario no tenga permisos', async () => {

        const mockUsuario = {
            _id: "67253243b8c35a1654542d70",
            typeUser: "66e2360cc4e29e2f6762e242"
        };

        User.findById.mockResolvedValue(mockUsuario);

        const req = {
            auth: { id: "67253243b8c35a1654542d70" },
            body : {
                name: "Service A",
                schedule: "9:00-17:00",
                serviceTime: "60 minutos",
                businessDays: "Miercoles, Juves, Viernes, Sabado, Domingo",
                address: "Calle 123",
                details: "Detalles del servicio",
                price: 15000,
                businessService: "67253243b8c35a1654542d3"
            },
            file: { filename: "logo.png" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await create(req, res);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith("No tienes permiso para crear un servicio, solo los negocios pueden hacer esto");

    });

});

describe('actualizacion de los servicios', () => {

    it('debria actualizar el servicio', async () => {

        const mockService = {

            _id: '67253243b8c35a1654542d72', 
            name: 'Service A', 
            serviceLogo: 'logo.png', 
            schedule: '9:00-17:00', 
            serviceTime: '60 minutos', 
            businessDays: 'Miercoles, Juves, Viernes, Sabado, Domingo', 
            address: 'Calle 123', 
            details: 'Detalles del servicio', 
            price: 15000, 
            businessService: '67253243b8c35a1654542d73',
            save: jest.fn().mockResolvedValue({})

        };

        Service.findById.mockResolvedValue(mockService);

        const req = {
            params: { id: "67253243b8c35a1654542d72" },
            body : {
                name: "Service B",
                schedule: "9:00-16:00",
                serviceTime: "61 minutos",
                businessDays: "Miercoles, Juves, Viernes, Sabado, Domingo",
                address: "Calle 1232",
                details: "Detalles del servicio2",
                price: 12000,
                businessService: "67253243b8c35a1654542d3"
            },
            file: { filename: "logo2.png" }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await update(req, res);
        expect(mockService.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith('Servicio actualizado con exito')

    });

    it('deberia devolver un error en caso de que no se encuentre el servicio', async () => {

        Service.findById.mockResolvedValue(null);

        const req = {
            params: { id: "67253243b8c35a1654542d72" },
            body : {},
            file: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await update(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith('El servicio con el ID indicado no existe en los registros');

    });

    it('deberia devolver un error en caso de que no se pueda hacer la actualizacion del servicio', async () => {

        Service.findById.mockRejectedValue(new Error('Error en el servidor'));

        const req = {
            params: { id: "67253243b8c35a1654542d72" },
            body : {},
            file: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await update(req, res);
        expect(res.status).toHaveBeenCalledWith(501);
        expect(res.json).toHaveBeenCalledWith('Ha ocurrido un error al intentar actualizar el servicio');

    });

});

describe('eliminacion de los servicios', () => {

    it('se debria eliminar el servicio si existe', async () => {

        const mockService = {

            _id: '67253243b8c35a1654542d70',
            deletedAt: null,
            save: jest.fn().mockResolvedValue({})

        };

        Service.findById.mockResolvedValue(mockService);

        const req = {
            params: { id: '67253243b8c35a1654542d70' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await destroy(req, res);
        expect(mockService.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith('Servicio eliminado con exito');

    });

    it('deberia devolver un error en caso de que el servicio no exista', async () => {

        Service.findById.mockResolvedValue(null);

        const req = {
            params: { id: '67253243b8c35a1654542d70' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await destroy(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith('El servicio con el ID indicado no existe en los registros');


    });

    it('deberia devolver un error en caso de que la eliminacion del servicio no se pueda hacer', async () => {

        Service.findById.mockRejectedValue(new Error('Error del servidor'));

        const req = {
            params: { id: '67253243b8c35a1654542d70' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await destroy(req, res);
        expect(res.status).toHaveBeenCalledWith(501);
        expect(res.json).toHaveBeenCalledWith('Hubo un error al eliminar el servicio que indicaste, puede que el servicio con el ID indicado no exista en los registros');

    });

});

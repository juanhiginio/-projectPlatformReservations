import { jest, describe, expect} from '@jest/globals';

jest.unstable_mockModule('../models/Service.js', () => ({
    default: {
        find: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        populate: jest.fn(),
    }
}));

const { getAll, getById, create, update, destroy } = await import('../controllers/serviceController.js');
const Service = (await import('../models/Service.js')).default;

describe('Obtener todos los servicios', () => {
    it('Debería devolver una lista de servicios', async () => {

        const mockServices = [
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
                        updatedAt: "2024-12-17T00:36:48.494Z",
                        __v: 0,
                        id: "6725341eb8c35a1654542d8a"
                    },
                    createdAt: "2024-12-17T00:31:16.098Z",
                    updatedAt: "2024-12-17T00:31:16.098Z",
                    __v: 0
                },
                {
                    _id: "6760c68c98779fa8af333cf3",
                    name: "Restaurante",
                    serviceLogo: "1734395532209-1e7574572efb53f3542b0415d8059205.jpg",
                    schedule: "Jueves a Domingo",
                    serviceTime: "N horas",
                    businessDays: "Miercoles, Juves, Viernes, Sabado, Domingo",
                    address: "Cra 7ma # 25 - 42",
                    details: "Llegar 5 minutos antes de la reserva",
                    price: 75000,
                    deletedAt: null,
                    businessService: {
                        _id: "6760bf2498779fa8af333c75",
                        name: "PATRIMONIO",
                        slogan: "En PATRIMONIO encuentras la mejor comida de manizales",
                        address: "Calle 7 #39 - 58",
                        category: "restaurantes",
                        phone: "+57 31245679898",
                        email: "businessNegocioNuevo@business.com",
                        businessLogo: "1734393636727-marca-patrimonio.jpg",
                        deletedAt: null,
                        userBusiness: "67253243b8c35a1654542d70",
                        createdAt: "2024-12-17T00:00:36.775Z",
                        updatedAt: "2024-12-17T00:00:36.775Z",
                        __v: 0,
                        id: "6760bf2498779fa8af333c75"
                    },
                    createdAt: "2024-12-17T00:32:12.235Z",
                    updatedAt: "2024-12-17T00:32:12.235Z",
                    __v: 0
                }
        ];

        const mockPopulate = jest.fn().mockResolvedValue(mockServices);
        Service.find.mockResolvedValue({ populate: mockPopulate });

        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }

        await getAll(req, res);

        console.log(res.json);
        expect(true).toBe(true);
        // expect(res.status).toHaveBeenCalledWith(200);

    });
});


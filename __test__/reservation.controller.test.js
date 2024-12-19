import {describe, expect, it, jest} from '@jest/globals';
import { populate } from 'dotenv';
import { json } from 'express';
import { body } from 'express-validator';

jest.unstable_mockModule("../models/Reservation.js", () => ({
    default: {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
}));

jest.unstable_mockModule("../models/User.js", () => ({
    default: {
        findById: jest.fn()
    },
}));


const { getAll, getById, create, update, destroy } = await import('../controllers/reservationController.js');
const Reservation = (await import('../models/Reservation.js')).default;
const User = (await import('../models/User.js')).default;

describe ('obterner todos las reservaciones', () => {

    it('deberia traer una lista con las reservaciones registradas', async () => {
        const mockReservation = [

            {
                _id: '67253243b8c35a1654542d70',
                user: {
                    _id: '67253243b8c35a1654542d71',
                    name: 'Alejandro', 
                    email: 'alejandro12@gmail.com', 
                    addres: 'cll 29 n # 71 a 19',  
                    phone: 8792457832
                },
                dateReservation: "2024-11-01",
                timeReservation: "19:55:47",
                status: 'Activo',
                priceTotal: 80000,
                deletedAt: null,
                bussines: {
                    _id: '67253243b8c35a1654542d72',
                    name: "Empresa Maravilla",
                    slogan: "Innovación a Cada Paso",
                    address: "Calle Ficticia 123, Ciudad Imaginaria, País de la Fantasía",
                    category: "Tecnología",
                    phone: "+57 300 123 4567",
                    email: "info@empresamaravilla.com",
                    businessLogo: "logo.png",
                },
                service: {
                    _id: '67253243b8c35a1654542d73',
                    name: "Restaurante",
                    serviceLogo: "1734395532209-1e7574572efb53f3542b0415d8059205.jpg",
                    schedule: "Jueves a Domingo",
                    serviceTime: "N horas",
                    businessDays: "Miercoles, Juves, Viernes, Sabado, Domingo",
                    address: "Cra 7ma # 25 - 42",
                    details: "Llegar 5 minutos antes de la reserva",
                    price: 75000,
                }
            }
        ];

        const populateUserMock = jest.fn().mockResolvedValue(mockReservation);
        const populateServiceMock = jest.fn().mockReturnValue({ populate: populateUserMock }); 
        const populateBusinessMock = jest.fn().mockReturnValue({ populate: populateServiceMock});
        Reservation.find.mockReturnValue({populate: populateBusinessMock});

        const req = {

            auth: { _id: '67253243b8c35a1654542d71' }

        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
    
        await getAll(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockReservation);

    });

    it('deberia traer un error en caso de que no se encuentren una reservacion', async () => {

        const populateUserMock = jest.fn().mockRejectedValue(new Error('Error en la base de datos'));
        const populateServiceMock = jest.fn().mockReturnValue({ populate: populateUserMock }); 
        const populateBusinessMock = jest.fn().mockReturnValue({ populate: populateServiceMock});
        Reservation.find.mockReturnValue({populate: populateBusinessMock}); 

        const req = {
            auth: { _id: '67253243b8c35a1654542d71' }
        };
        const res ={
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getAll(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith('No se encontraron reservas disponibles');

    });

});

describe('obtener las reservaciones mediante el Id', () => {

    it('deberia devolver las reservas mediante el Id', async () => {

        const mockReservation = [

            {
                _id: '67253243b8c35a1654542d70',
                user: {
                    _id: '67253243b8c35a1654542d71',
                    name: 'Alejandro', 
                    email: 'alejandro12@gmail.com', 
                    addres: 'cll 29 n # 71 a 19',  
                    phone: 8792457832
                },
                dateReservation: "2024-11-01",
                timeReservation: "19:55:47",
                status: 'Activo',
                priceTotal: 80000,
                deletedAt: null,
                bussines: {
                    _id: '67253243b8c35a1654542d72',
                    name: "Empresa Maravilla",
                    slogan: "Innovación a Cada Paso",
                    address: "Calle Ficticia 123, Ciudad Imaginaria, País de la Fantasía",
                    category: "Tecnología",
                    phone: "+57 300 123 4567",
                    email: "info@empresamaravilla.com",
                    businessLogo: "logo.png",
                },
                service: {
                    _id: '67253243b8c35a1654542d73',
                    name: "Restaurante",
                    serviceLogo: "1734395532209-1e7574572efb53f3542b0415d8059205.jpg",
                    schedule: "Jueves a Domingo",
                    serviceTime: "N horas",
                    businessDays: "Miercoles, Juves, Viernes, Sabado, Domingo",
                    address: "Cra 7ma # 25 - 42",
                    details: "Llegar 5 minutos antes de la reserva",
                    price: 75000,
                }
            }
        ];

        Reservation.findById.mockResolvedValue(mockReservation);

        const req = {
            params: { id: '67253243b8c35a1654542d70' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getById(req, res);
        expect(res.json).toHaveBeenCalledWith(mockReservation);

    });

    it('deberia de devolver un mensaje de error', async () => {

        Reservation.findById.mockResolvedValue(null);

        const req = {
            params: { id: '67253243b8c35a1654542d70' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith("Reserva no encontrada");

    });

    it('deberia devolver un mensaje de error en caso de haber una excepcion', async () => {

        Reservation.findById.mockImplementation(() => {throw new Error('Error en la base de datos');});

        const req = {
            params: { id: '67253243b8c35a1654542d70' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith("Hubo un problema en la consulta");

    });

});

describe('Creacion de reservas', () => {

    it('deberia de crear una reserva si el usuario se encuentra registrado', async () => {

        const mockUser = {
            _id: '67253243b8c35a1654542d71'
        };
        
        const mockReservation = {
            user: '67253243b8c35a1654542d71',
            dateReservation: '2024-01-01',
            timeReservation: '12:00',
            status: 'Activa',
            priceTotal: 80000,
            business: '67253243b8c35a1654542d72',
            service: '67253243b8c35a1654542d73'
        };

        User.findById.mockResolvedValue(mockUser);
        Reservation.create.mockResolvedValue(mockReservation);

        const req = {

            auth: { id: '67253243b8c35a1654542d71' },
            body: {

                dateReservation: '2024-01-01',
                timeReservation: '12:00',
                status: 'Activa',
                priceTotal: 80000,
                business: '67253243b8c35a1654542d72',
                service: '67253243b8c35a1654542d73'

            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await create(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockReservation);

    });

    it('deberia devolver un error en caso de que no se pueda crear una reserva', async () => {

        const mockUser = {
            _id: '67253243b8c35a1654542d71'
        };

        User.findById.mockResolvedValue(mockUser);
        Reservation.create.mockRejectedValue(new Error('Error en el servidor'));

        const req = {

            auth: { id: '67253243b8c35a1654542d71' },
            body: {

                dateReservation: '2024-01-01',
                timeReservation: '12:00',
                status: 'Activa',
                priceTotal: 80000,
                business: '67253243b8c35a1654542d72',
                service: '67253243b8c35a1654542d73'

            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await create(req, res);
        expect(res.status).toHaveBeenCalledWith(501);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error en el servidor'});

    });

});

describe('Actualizacion de las reservas', () => {

    it('deberia actualizar la reservacion si se encuentra resgistrada', async () => {

        const mockReservation = {
            _id: '67253243b8c35a1654542d70',
            dateReservation: '2024-01-01', 
            timeReservation: '12:00', 
            status: 'Activa', 
            priceTotal: 100,
            save: jest.fn().mockResolvedValue({})
        };

        Reservation.findById.mockResolvedValue(mockReservation);

        const req = {

            params: { id: '67253243b8c35a1654542d70' },
            body: {
                dateReservation: '2024-02-01', 
                timeReservation: '12:01', 
                status: 'Cancelada', 
                priceTotal: 2000
            }
      
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await update(req, res);
        expect(mockReservation.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith('Reserva actualizada');

    });

    it('deberia devolver un error en caso de que no se encuentre la reserva', async () => {

        Reservation.findById.mockResolvedValue(null);

        const req = {

            params: { id: '67253243b8c35a1654542d70' },
            body: {
                dateReservation: '2024-02-01', 
                timeReservation: '12:01', 
                status: 'Cancelada', 
                priceTotal: 2000
            }
      
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await update(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith('Reserva no exite');

    });

    it('deberia devolver un error en caso de que no se pueda actualizar la reserva', async () => {

        Reservation.findById.mockRejectedValue(new Error('Error en el servidor'));

        const req = {
            params: { id: '67253243b8c35a1654542d70' },
            body: {
                dateReservation: '2024-02-01', 
                timeReservation: '12:01', 
                status: 'Cancelada', 
                priceTotal: 2000
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await update(req, res);
        expect(res.status).toHaveBeenCalledWith(501);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error en el servidor'});

    });


});

describe('Cancelacion de las reservas', () => {

    it('deberia de cancelarse la reserva seleccionada', async () => {

        const mockReservation = {
            _id: '67253243b8c35a1654542d70',
            deletedAt: null,
            save: jest.fn().mockResolvedValue({})
        };

        Reservation.findById.mockResolvedValue(mockReservation);

        const req = {
            params: { id: '67253243b8c35a1654542d70' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await destroy(req, res);
        expect(mockReservation.save).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith('La reserva se cancelo con exito');
        
    });

    it('deberia devolver un error en caso de que no se encuentre la reserva', async () => {

        Reservation.findById.mockResolvedValue(null);

        const req = {
            params: { id: '67253243b8c35a1654542d70' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await destroy(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith('No se encuentra reserva para cancelar');

    });

    it('deberia devolver un error en caso de que no se pueda cancelar la reserva', async () => {

        Reservation.findById.mockRejectedValue(new Error('Error en el servidor'));

        const req = {
            params: { id: '67253243b8c35a1654542d70' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await destroy(req, res);
        expect(res.status).toHaveBeenCalledWith(501);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error en el servidor'});

    });
    
});

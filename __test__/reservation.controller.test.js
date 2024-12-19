import {describe, expect, it, jest} from '@jest/globals';
import { populate } from 'dotenv';
import { json } from 'express';

jest.unstable_mockModule("../models/Reservation.js", () => ({
    default: {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
}));


const { getAll } = await import('../controllers/reservationController.js');
const Reservation = (await import('../models/Reservation.js')).default;

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
import { describe, expect, it, jest } from "@jest/globals";
import { populate } from 'dotenv';
import { json } from 'express';
import { body } from "express-validator";

jest.unstable_mockModule("../models/User.js", () => ({
  default: {
    findOne: jest.fn()
  },
}));

jest.unstable_mockModule('bcryptjs', () => ({
    default: {
        compare: jest.fn()
    },
}));
jest.unstable_mockModule('jsonwebtoken', () => ({
    default: {
        sign: jest.fn()
    },
}));

const { token } = await import('../controllers/authController.js');
const User = (await import('../models/User.js')).default;
const bcrypt = (await import('bcryptjs')).default;
const jwt = (await import('jsonwebtoken')).default;

describe('Token de autenticacion', () => {

    it('deberia devolver un token y el nombre del usuario', async () => {

        const mockUser ={

            _id: '67253243b8c35a1654542d70', 
            name: 'Alejandro', 
            email: 'alejandro12@gmail.com', 
            password: '123456alejo'

        };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mockToken')

        const req = {
            body: {
                email: 'alejandro12@gmail.com',
                password: '123456alejo'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await token(req, res);
        expect(res.json).toHaveBeenCalledWith({ token: 'mockToken', name: 'Alejandro' });


    });

    it('deberia devolver un error si las credenciales no son validas', async () => {

        User.findOne.mockResolvedValue(null);

        const req = {
            body: {
                email: 'alejandro12@gmail.com',
                password: '123456alejo'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await token(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error, las credenciales son invalidas' });
        
    });

    it('deberia devolver un error en caso de que no se puedan validar las credenciales', async () => {

        User.findOne.mockRejectedValue(new Error('Error en el servidor'));

        const req = {
            body: {
                email: 'alejandro12@gmail.com',
                password: '123456alejo'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        }

        await token(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Ups, ocurrio un error al validar las credenciales' });

    });

});

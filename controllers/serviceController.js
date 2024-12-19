import Service from "../models/Service.js";

import business from "../models/Business.js";
import User from "../models/User.js";

export const getAll = async(req, res) => {
    try {
        const services = await Service.find({ deletedAt: null })
        .populate("businessService");
        return res.status(200).json(services);
    } catch (error) {
        return res.status(404).json("No se encontro la lista de servicios");
    }
};

export const getById = async (req, res) => {
    try {
        const specificServiceID = req.params.id;
        const specificService = await Service.findById(specificServiceID);
        return res.status(200).json(specificService);
    } catch (err) {
        console.log(err);
        return res.status(404).json("El servicio especificado no se ha encontrado en los registros");
    }
};

export const create = async (req, res) => {
    const { name, schedule, serviceTime, businessDays, address, details, price, businessService } = req.body;
    const serviceLogo = req.file.filename;

    const user = await User.findById(req.auth.id);

    const typeUser = user.typeUser;

    if (typeUser == "66e2360cc4e29e2f6762e241") {
        try {
            const newService = await Service.create({
                name: name,
                serviceLogo,
                schedule: schedule,
                serviceTime: serviceTime,
                businessDays: businessDays,
                address: address,
                details: details,
                price: price,
    
                businessService: businessService
            });
            return res.status(201).json("El nuevo Servicio ha sido creado con exito");
        } catch (error) {
            return res.status(501).json("Ha ocurrido un error al crear un nuevo servicio");
        }
    }

    return res.status(403).json("No tienes permiso para crear un servicio, solo los negocios pueden hacer esto");

};

export const update = async(req, res) => {
    
    
    try {
        const serviceToUpdate = await Service.findById(req.params.id);
        if(serviceToUpdate !== null) {
            const { name, schedule, serviceTime, businessDays, address, details, price } = req.body;
            const serviceLogo = req.file.filename;

            serviceToUpdate.name = name || serviceToUpdate.name;
            serviceToUpdate.serviceLogo = serviceLogo || serviceToUpdate.serviceLogo;
            serviceToUpdate.schedule = schedule || serviceToUpdate.schedule;
            serviceToUpdate.serviceTime = serviceTime || serviceToUpdate.serviceTime;
            serviceToUpdate.businessDays = businessDays || serviceToUpdate.businessDays;
            serviceToUpdate.address = address || serviceToUpdate.address;
            serviceToUpdate.details = details || serviceToUpdate.details;
            serviceToUpdate.price = price || serviceToUpdate.price;

            await serviceToUpdate.save();

            return res.json("Servicio actualizado con exito");
        } else {
            return res.status(404).json("El servicio con el ID indicado no existe en los registros");
        }
    } catch (error) {
        return res.status(501).json("Ha ocurrido un error al intentar actualizar el servicio");
    }
};

export const destroy = async(req, res) => {
    try {
        const serviceToDelete = await Service.findById(req.params.id);

        if (serviceToDelete) {
            serviceToDelete.deletedAt = Date.now();
            serviceToDelete.save();

            return res.json("Servicio eliminado con exito");
        }

        return res.status(404).json("El servicio con el ID indicado no existe en los registros");
    } catch (error) {
        return res.status(501).json("Hubo un error al eliminar el servicio que indicaste, puede que el servicio con el ID indicado no exista en los registros");
    }
};



export default {
    getAll: getAll,
    getById: getById,
    create: create,
    update: update,
    destroy: destroy
};
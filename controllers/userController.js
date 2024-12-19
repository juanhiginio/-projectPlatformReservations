import User from "../models/User.js";
import TypeUser from "../models/TypeUser.js";

export const getAll = async (req, res) => {
  try {
    const users = await User.find({ deletedAt: null })
    .populate("typeUser", ["type"]);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(404).json("Usuario no encontrado");
  }
};

export const getById = async(req, res) => {
  try {
    const user = await User.findById(req.params.id);
    return res.json(user);
  } catch (error) {
    return res.status(404).json("Usuario no encontrado");
  }
};

export const create = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      password: req.body.password,
      phone: req.body.phone,

      typeUser: req.body.typeUser,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(501).json("Error en el servidor");
  }
};

export const update = async(req, res) => {

  try {
    const userToUpdate = await User.findById(req.params.id);
    if (userToUpdate !== null) {
      const { name, email, address ,password, phone, typeUser } = req.body;
  
      userToUpdate.name = name || userToUpdate.name;
      userToUpdate.email = email || userToUpdate.email;
      userToUpdate.address = address || userToUpdate.address;
      userToUpdate.password = password || userToUpdate.password;
      userToUpdate.phone = phone || userToUpdate.phone;

      userToUpdate.typeUser = typeUser || userToUpdate.typeUser;
  
      await userToUpdate.save();
  
      return res.json("El usuario se actualizo");
    } else {
      return res.status(404).json("El usuario con este id no existe");
    }
  } catch (error) {
    return res.status(501).json("Hubo un error al intentar actualizar el usuario");
  }
};

export const destroy = async(req, res) => {
  try {
    const userToDelete = await User.findById(req.params.id);

    if (userToDelete) {
      userToDelete.deletedAt = Date.now();
      userToDelete.save();

      return res.json("Usuario eliminado con exito");
    } else {
      return res.status(404).json("El usuario no existe");
    }
  } catch (error) {
    return res.status(501).json("Hubo un error al eliminar el usuario que indicaste");
  }
};

export default {
  getAll: getAll,
  getById: getById,
  create: create,
  update: update,
  destroy: destroy,
};

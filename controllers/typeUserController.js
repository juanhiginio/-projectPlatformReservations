import TypeUser from "../models/TypeUser.js";

export const getAll = async(req, res) => {
  try {
    const typeUsers = await TypeUser.find({ deletedAt: null });
    return res.status(200).json(typeUsers);
  } catch (error) {
    console.log(error);
    return res.status(404).json("Tpo de Usuario no encontrado");
  }
}

export const getById = async(req, res) => {
  try {
    const typeUser = await TypeUser.findById(req.params.id);
    return res.status(200).json(typeUser);
  } catch (error) {
    console.log(error);
    return res.status(404).json("Tipo de Usuario no encontrado");
  }
}

export const create =async (req, res) => {
  try {
    const newTypeUser = await TypeUser.create({
      type: req.body.type,

    });

    return res.status(201).json(newTypeUser);
  } catch (error) {
    return res.status(501).json("Error en el servidor");
  }
}

export const update = async(req, res)=> {
  const typeUserToUpdate = await TypeUser.findById(req.params.id);

  if (typeUserToUpdate !== null) {
    const { type} = req.body;

    typeUserToUpdate.type = type 


    await typeUserToUpdate.save();

    return res.json("El tipo de usuario se actualizo");
  } else {
    return res.json("El tipo de usuario no exite con este id");
  }
}

export const destroy = async(req, res) =>{
  try {
    const typeUserToDelete = await TypeUser.findById(req.params.id);

    if (typeUserToDelete) {
      typeUserToDelete.deletedAt = Date.now();
      typeUserToDelete.save();

      return res.json("Tipo de Usuario eliminado");
    }

  } catch (err) {
    console.log(err);
    return res.status(404).json("Ups, hubo un error al eliminar el rol que indicaste, puede que el rol con el ID indicado no exista en los registros");
  }

}

export default {
  getAll: getAll,
  getById: getById,
  create: create,
  update: update,
  destroy: destroy,
};
import User from "../models/User.js";

async function getAll(req, res) {
  try {
    const users = await User.find({ deletedAt: null });
    return res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(404).json("Usuario no encontrado");
  }
}

async function getById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(404).json("Usuario no encontrado");
  }
}

async function create(req, res) {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error.errors.name.properties.message);
    return res.status(501).json("Error en el servidor");
  }
}

async function update(req, res) {
  const userToUpdate = await User.findById(req.params.id);

  if (userToUpdate !== null) {
    const { name, email, password, phone } = req.body;

    userToUpdate.name = name || userUpdate.name;
    userToUpdate.email = email || userToUpdate.email;
    userToUpdate.password = password || userToUpdate.password;
    userToUpdate.phone = phone || userToUpdate.phone;

    await userToUpdate.save();

    return res.json("El usuario se actualizo");
  } else {
    return res.json("El usuario no exite con este id");
  }
}

async function destroy(req, res) {
  const userToDelete = await User.findById(req.params.id);

  userToDelete.deletedAt = Date.now();
  userToDelete.save();

  return res.json("Usuario eliminado");
}

export default {
  getAll: getAll,
  getById: getById,
  create: create,
  update: update,
  destroy: destroy,
};

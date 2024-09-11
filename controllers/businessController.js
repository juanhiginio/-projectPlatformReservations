import Business from "../models/Business.js";

async function getAll(req, res) {
  try {
    const business = await Business.find({ deletedAt: null });
    return res.json(business);
  } catch (error) {
    console.log(error);
    return res.status(404).json("negocio no encontrado");
  }}

  async function getById(req, res) {
    try {
      const business = await Business.findById(req.params.id);
      return res.json(business);
    } catch (error) {
      console.log(error);
      return res.status(404).json("Negocio no encontrado");
    }
  }
  
  async function create(req, res) {
    try {
      const newBusiness = await Business.create({
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        email: req.body.email,
        businessLogo: req.file.filename
      });
  
      return res.status(201).json(newBusiness);
    } catch (error) {
      console.log(error.message || error);
      return res.status(501).json("Error en el servidor");
    }
  }
  
  async function update(req, res) {
    const businessToUpdate = await Business.findById(req.params.id);
  
    if (businessToUpdate !== null) {
      const { name, adress, phone, email } = req.body;
      const businessLogo = req.file.filename;
  
     businessToUpdate.name = name || businessToUpdate.name;
      businessToUpdate.address = adress || businessToUpdate.address;
      businessToUpdate.phone = phone || businessToUpdate.phone;
      businessToUpdate.email = email || businessToUpdate.email;
      businessToUpdate.businessLogo = businessLogo || businessToUpdate.businessLogo;
      
      await businessToUpdate.save();
  
      return res.json("El negocio se actualizo");
    } else {
      return res.json("No existe negocio con este id");
    }
  }
  
  async function destroy(req, res) {
    try {
      const businessToDelete = await Business.findById(req.params.id);
  
      if (businessToDelete) {
        businessToDelete.deletedAt = Date.now();
        businessToDelete.save();
  
        return res.json("El negocio fue eliminado con exito");
      } 
      
    } catch (err) {
      console.log(err);
      return res.status(404).json("Ups, hubo un error al eliminar el negocio que indicaste, puede que el negocio con el ID indicado no exista en los registros");
    }
  }
  
  export default {
    getAll: getAll,
    getById: getById,
    create: create,
    update: update,
    destroy: destroy,
  };
  
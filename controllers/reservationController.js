import Reservation from "../models/Reservation.js";

async function getAll(req, res) {
  try {
    const reservation = await Reservation.find({ deletedAt: null });
    return res.json(reservation);
  } catch (error) {
    console.log(error);
    return res.status(404).json("No se encontraron reservas disponibles");
  }
}

async function getById(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    return res.json(reservation);
  } catch (reservation) {
    console.log(error);
    return res.status(404).json(" Reserva no encontrada");
  }
}



async function create(req, res) {
  try {
    const newReservation = await Reservation.create({
        user: req.auth.id,
        dateReservation: req.body.dateReservation,
        timeReservation: req.body.timeReservation,
        status: req.body.status,
        priceTotal: req.body.priceTotal,
    });

    return res.status(201).json(newReservation);
  } catch (error) {
    console.log(error.errors.status.properties.message);
    return res.status(501).json("Error en el servidor");
  }
}

async function update(req, res) {
  const reservationToUpdate = await Reservation.findById(req.params.id);

  if (reservationToUpdate !== null) {
    const { dateReservation, timeReservation, status, priceTotal} = req.body;

    reservationToUpdate.dateReservation = dateReservation || reservationToUpdate.dateReservation;
    reservationToUpdate.timeReservation = timeReservation || reservationToUpdate.timeReservation;
    reservationToUpdate.status = status || reservationToUpdate.status;
    reservationToUpdate.priceTotal = priceTotal|| reservationToUpdate.priceTotal;

    await reservationToUpdate.save();

    return res.json("Reserva actualizada");
  } else {
    return res.json("Reserva no exite");
  }
}

async function destroy(req, res) {
  try {
    const reservationToDelete = await Reservation.findById(req.params.id);

    if (reservationToDelete) {
      reservationToDelete.deletedAt = Date.now();
      reservationToDelete.save();

      return res.json("La reserva se cancelo con exito");
    } 
    
  } catch (err) {
    console.log(err);
    return res.status(404).json("No se encuentra reserva para cancelar");
  }
}

export default {
  getAll: getAll,
  getById: getById,
  create: create,
  update: update,
  destroy: destroy,
};
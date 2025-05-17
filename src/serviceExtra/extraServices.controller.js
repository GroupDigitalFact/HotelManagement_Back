import Hotel from '../hotel/hotel.model.js';
import ExtraService from './extraServices.model.js';
import { validationResult } from 'express-validator';      

export const listServiceExtra = async (req, res) =>{
    try{
        
        const extraService = await ExtraService.find({status: true});

        if(!extraService){
            return res.status(404).json({
                message: "Service extra not found"
            })
        }

        return res.status(200).json({
            extraService
        })

    }catch(err){
        return res.status(500).json({
            succes: false,
            message: "Error al obtener el servicio extra",
            error: err.message
        });
    }
};

export const createExtraService = async (req, res) => {
    try {
    const data = req.body;

    const extraService = await ExtraService.create(data);
    
    if (!extraService) {
      return res.status(400).json({
        message: "Error al crear tu servicio extra",
        error: "El servicio extra no ha sido encontrado"
      })
    }
    return res.status(200).json({
      message: "El servicio extra creado con exito",
      extraService
    })
  }catch (e){
    return res.status(500).json({
      message: "Error al crear sercvicio extra",
      error: e.message
    })
  }
}

export const updateExtraService = async (req, res) => {
    try {
        const { uid } = req.params;
        const data = req.body;
        
        const extraService = await ExtraService.findByIdAndUpdate(uid, data, { new: true });
    
            if (!extraService) {
                return res.status(400).json({
                    message: "Error al actualizar el servicio extra",
                    error: "Servicio extra no encontrado"
                })
            }
            
            return res.status(200).json({
                message: "El servicio actualizado con exito",
                extraService 
            })
        }catch (e){
            return res.status(500).json({
                message: "Error al actualizar el sersvicio extra",
                error: e.message
            })
      }
}

export const deleteExtraService = async (req, res) => {
    try {
        const { uid } = req.params;
        const event = await Event.findByIdAndUpdate(uid, { status: false }, { new: true });

            if (!event) {
                return res.status(400).json({
                    message: "Error al eliminar el servicio extra",
                    error: "Servicio extra no encontrado"
                })
            }
            return res.status(200).json({
                message: "Servicio extra ah sido cancelado con exito ",
                event
            })
        }catch (e){
            return res.status(500).json({
                message: "Error al eliminar el servicio extra",
                error: e.message
            })
        }
};


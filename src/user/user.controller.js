import argon2, { hash, verify } from "argon2";
import fs from "fs/promises";
import jwt from "jsonwebtoken";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Reservation from "../reservation/reservation.model.js";
import Room from "../room/room.model.js";
import User from "./user.model.js";



const __dirname = dirname(fileURLToPath(import.meta.url));
const profileDirname = join(__dirname, "../../public/uploads/profile-picture");

export const getUserClient = async (req, res) =>{
    try{
        const uid = req.usuario._id
        
        const user = await User.findById(uid);

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            user
        })

    }catch(err){
        return res.status(500).json({
            succes: false,
            message: "Error al obtener al usuario",
            error: err.message
        });
    }
};

export const getUserAdminHotel = async (req, res) =>{
    try{
        const roleAdmin = 'HOTEL_ADMIN_ROLE'
        
        const user = await User.find({role: roleAdmin});

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            user
        })

    }catch(err){
        return res.status(500).json({
            succes: false,
            message: "Error al obtener al usuario",
            error: err.message
        });
    }
};


export const getUserHotel = async (req, res) =>{
    try{
        const roleUser = 'USER_ROLE'
        
        const user = await User.find({role: roleUser});

        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            user
        })

    }catch(err){
        return res.status(500).json({
            succes: false,
            message: "Error al obtener al usuario",
            error: err.message
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const { username } = req.query;
        let query = { status: true };
        if (username) {
            query.username = username;
        }

        const [total, users] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
        ]);

        if (username && users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }

        return res.status(200).json({
            success: true,
            total,
            users
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token no proporcionado",
            });
        }
        const { uid } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Debes proporcionar la contraseña actual y la nueva contraseña",
            });
        }
        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado",
            });
        }
        const isCurrentPasswordValid = await verify(user.password, currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "La contraseña actual es incorrecta",
            });
        }
        const isSamePassword = await verify(user.password, newPassword);
        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                message: "La nueva contraseña no puede ser igual a la anterior",
            });
        }
        const encryptedPassword = await hash(newPassword);
        user.password = encryptedPassword;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Contraseña actualizada exitosamente",
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la contraseña",
            error: err.message,
        });
    }
};


export const updateProfilePicture = async (req, res) => {
    try {
        const uid = req.usuario._id;
        const file = req.file?.filename;

        const user = await User.findById(uid);
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        if (file) {
            if (user.profilePicture) {
                const oldPath = join(profileDirname, user.profilePicture);

                try {
                    await fs.access(oldPath);
                    await fs.unlink(oldPath);
                    console.log("Imagen anterior eliminada");
                } catch (error) {
                    console.log("La imagen anterior no existe o ya fue eliminada");
                }
            }

            user.profilePicture = file;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Imagen actualizada correctamente",
                user
            });
        }

        return res.status(400).json({
            success: false,
            message: "No se envió una nueva imagen"
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al actualizar la imagen",
            error: error.message
        });
    }
};

export const deleteProfilePicture = async (req, res) => {
    try{
        const uid = req.usuario._id;
        const user = await User.findById(uid);

        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        if(user.profilePicture ){
            const oldPath = join(profileDirname, user.profilePicture);
            
            await fs.access(oldPath);
            await fs.unlink(oldPath);
            
            user.profilePicture = null;
            await user.save();
            
            return res.status(200).json({
                success: true,
                message: "Imagen eliminada correctamente",
                user
            });
        }
        return res.status(201).json({
            success: false,
            message: "No contiene imagen"
        });
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error al eliminar la imagen",
            error: error.message
        });
    }
}


export const editProfile = async (req, res) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            return res.status(401).json({ success: false, message: "Token no proporcionado" });
        }
        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }

        const { password, photo, role, ...updates } = req.body; 

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: "No se proporcionaron campos para actualizar" });
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        return res.status(200).json({
            success: true,
            message: "Usuario actualizado exitosamente",
            user: updatedUser,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error al actualizar el usuario", error: error.message });
    }
};

export const editUserAdmin = async (req, res) => {
    try {
        const { uid } = req.params;
        const { username, ...updates } = req.body;
        if (!uid && !username) {
            return res.status(400).json({
                success: false,
                message: "Debe proporcionar un ID o un nombre de usuario para buscar al usuario."
            });
        }
        let user;
        if (uid) {
            user = await User.findById(uid);
        } else {
            user = await User.findOne({ username });
        }
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }
        if (user.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No se puede modificar a un usuario con rol ADMIN_ROLE"
            });
        }
        if (updates.newUsername) {
            const existingUser = await User.findOne({ username: updates.newUsername });

            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                return res.status(409).json({
                    success: false,
                    message: "El nuevo nombre de usuario ya está en uso"
                });
            }
            updates.username = updates.newUsername;
            delete updates.newUsername;
        }if (updates.password) {
            updates.password = await argon2.hash(updates.password);
        }
        const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true });
        return res.status(200).json({
            success: true,
            message: "Usuario actualizado correctamente",
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error al actualizar el usuario",
            error: err.message
        });
    }
};

export const deleteUserAdmin = async (req, res) => {
    try {
        const { uid, username } = req.body;

        if (!uid && !username) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un ID o un nombre de usuario'
            });
        }

        let user;
        if (uid) {
            user = await User.findById(uid);
        } else if (username) {
            user = await User.findOne({ username });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        if (user.role === 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No se puede desactivar a un usuario administrador'
            });
        }

        const reservas = await Reservation.find({ user: user._id });
        for (const reserva of reservas) {
            if (reserva.room) {
                await Room.findByIdAndUpdate(reserva.room, { status: 'DISPONIBLE' });
            }
            await Reservation.findByIdAndDelete(reserva._id);
        }

        await User.findByIdAndUpdate(user._id, { status: false });

        return res.status(200).json({
            success: true,
            message: 'Usuario desactivado y sus reservaciones eliminadas correctamente'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error al desactivar el usuario y eliminar sus reservaciones',
            error: err.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No se proporcionó token'
            });
        }

        const { uid: userId } = jwt.verify(token.replace("Bearer ", ""), process.env.SECRETORPRIVATEKEY);

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        const reservas = await Reservation.find({ user: userId });

        for (const reserva of reservas) {
            if (reserva.room) {
                await Room.findByIdAndUpdate(reserva.room, { status: 'DISPONIBLE' });
            }
            await Reservation.findByIdAndDelete(reserva._id);
        }

        await User.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message: 'Usuario, sus reservaciones y habitaciones liberadas correctamente'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Error al eliminar usuario y sus datos relacionados',
            error: err.message
        });
    }
};


export const getUsersAll = async (req, res) => {
    try {
        const role = req.usuario.role;
        let users = {}
        if(role === 'ADMIN_ROLE'){
            users = await User.find({ status: true });
        }else{
            users = await User.find({ status: true, role: 'USER_ROLE' });
        }

        return res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error al obtener los usuarios",
            error: err.message
        });
    }
};

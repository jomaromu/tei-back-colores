import { Response } from "express";
import { CallbackError } from "mongoose";
const mongoose = require("mongoose");
import Server from "./server";

// Interfaces
import { Colores } from "../interfaces/colores";

// Modelo
import coloresModel from "../models/coloresModel";

export class ColoresClass {
  constructor() {}

  crearColor(req: any, resp: Response): void {
    const idCreador = new mongoose.Types.ObjectId(req.usuario._id);
    const foranea = new mongoose.Types.ObjectId(req.body.foranea);
    const nombre: string = req.body.nombre;
    const estado: boolean = req.body.estado;
    const color: string = req.body.color;

    const nuevoColor = new coloresModel({
      idCreador,
      foranea,
      nombre,
      color,
      estado,
    });

    nuevoColor.save((err: CallbackError, colorDB: Colores) => {
      if (err) {
        return resp.json({
          ok: false,
          mensaje: `Error interno`,
          err,
        });
      } else {
        const server = Server.instance;
        server.io.emit("cargar-colores", {
          ok: true,
        });
        return resp.json({
          ok: true,
          mensaje: `Color creado`,
          colorDB,
        });
      }
    });
  }

  obtenerColores(req: any, resp: Response): void {
    const foranea = new mongoose.Types.ObjectId(req.get("foranea"));
    coloresModel
      .find({ foranea })
      .populate("idCreador")
      .exec((err: CallbackError, coloresDB: Array<Colores>) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: "Error al obtener colores",
            err,
          });
        } else {
          return resp.json({
            ok: true,
            coloresDB,
          });
        }
      });
  }

  editarColor(req: any, resp: Response): void {
    const _id = new mongoose.Types.ObjectId(req.body.id);
    const foranea = new mongoose.Types.ObjectId(req.body.foranea);
    const estado: boolean = req.body.estado;

    const query = {
      nombre: req.body.nombre,
      color: req.body.color,
      estado,
    };

    coloresModel.findOne(
      { _id, foranea },
      (err: CallbackError, colorDB: Colores) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: `Error interno`,
            err,
          });
        }

        // if (!colorDB) {
        //   return resp.json({
        //     ok: false,
        //     mensaje: `No se encontró un color con ese ID en la base de datos`,
        //   });
        // }

        if (!query.nombre) {
          query.nombre = colorDB.nombre;
        }

        if (!query.color) {
          query.color = colorDB.color;
        }

        coloresModel.findOneAndUpdate(
          { _id, foranea },
          query,
          { new: true },
          (err: CallbackError, colorDB: any) => {
            if (err) {
              return resp.json({
                ok: false,
                mensaje: `Error interno`,
                err,
              });
            } else {
              const server = Server.instance;
              server.io.emit("cargar-colores", {
                ok: true,
              });
              return resp.json({
                ok: true,
                mensaje: `color actualizado`,
                colorDB,
              });
            }
          }
        );
      }
    );
  }

  eliminarColor(req: any, resp: Response): void {
    const _id = new mongoose.Types.ObjectId(req.get("id"));
    const foranea = new mongoose.Types.ObjectId(req.get("foranea"));

    coloresModel.findOneAndDelete(
      { _id, foranea },
      {},
      (err: CallbackError, colorDB: any) => {
        if (err) {
          return resp.json({
            ok: false,
            mensaje: "Erro interno",
            err,
          });
        } else {
          const server = Server.instance;
          server.io.emit("cargar-colores", {
            ok: true,
          });
          return resp.json({
            ok: true,
            mensaje: `Color eliminado`,
            colorDB,
          });
        }
      }
    );
  }
}

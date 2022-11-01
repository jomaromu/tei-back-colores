import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

// Interface
import { Colores } from "../interfaces/colores";

// crear esquema
const Schema = mongoose.Schema;

const coloresSchema = new Schema({
  idCreador: { type: Schema.Types.ObjectId, ref: "userWorker" },
  nombre: {
    type: String,
    required: [true, "Debe ingresar un nombre"],
  },
  color: {
    type: String,
    required: [true, "Debe ingresar un color"],
  },
  estado: { type: Boolean, default: true },
  foranea: { type: Schema.Types.ObjectId, ref: "userWorker" },
});

// validacion para único elemento
coloresSchema.plugin(uniqueValidator, { message: "{PATH}, ya existe!!" });

export = mongoose.model<Colores>("colores", coloresSchema);

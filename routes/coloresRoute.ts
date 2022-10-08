import { Router, Response, Request } from "express";
import { verificaToken } from "../auth/auth";
import { ColoresClass } from "../class/coloresClass";

const coloresRouter = Router();

coloresRouter.post(
  "/nuevoColor",
  [verificaToken],
  (req: Request, resp: Response) => {
    const crearColor = new ColoresClass();
    crearColor.crearColor(req, resp);
  }
);

coloresRouter.get(
  "/obtenerColores",
  [verificaToken],
  (req: Request, resp: Response) => {
    const obtenerColores = new ColoresClass();
    obtenerColores.obtenerColores(req, resp);
  }
);

coloresRouter.put(
  "/editarColor",
  [verificaToken],
  (req: Request, resp: Response) => {
    const editarColor = new ColoresClass();
    editarColor.editarColor(req, resp);
  }
);

coloresRouter.delete(
  "/eliminarColor",
  [verificaToken],
  (req: Request, resp: Response) => {
    const eliminarColor = new ColoresClass();
    eliminarColor.eliminarColor(req, resp);
  }
);
export default coloresRouter;

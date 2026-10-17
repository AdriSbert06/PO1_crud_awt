import express from 'express';
import fs from 'fs';

const router = express.Router();

const readData = () => JSON.parse(fs.readFileSync('./db/db.json'));
const writeData = (data) => fs.writeFileSync('./db/db.json', JSON.stringify(data));


router.get("/", (req, res) => {
    const data = readData();
    res.render("ordinadors", { ordinadors: data.ordinadors });
});

router.get("/crear", (req, res) => {
    res.render("crear_ordinadors");
});

router.get("/:id/edit", (req, res) => {
    const data = readData();
    const ordinador = data.ordinadors.find(b => b.id === parseInt(req.params.id));
    if (!ordinador) return res.status(404).send("ordinador not found");
    res.render("edit_ordinadors", { ordinador });
});

//Creem un endpoint per obtenir un ordinador per un id
router.get("/:id", (req, res) => {
    const data=readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id=parseInt(req.params.id);
    const ordinador=data.ordinadors.find((ordinador)=>ordinador.id===id);
    res.json(ordinador);
})


//Creem un endpoint del tipus post per afegir un ordinador
router.post("/", (req, res) => {
    const data = readData();
    const preu = Number(req.body.preu);
    if (!Number.isFinite(preu) || preu < 0) {
        return res.status(400).send("preu not valid");
    }

    const newOrdinador = {
        id: Math.max(0, ...data.ordinadors.map((ordinador) => ordinador.id)) + 1,
        marca: req.body.marca,
        model: req.body.model,
        processador: req.body.processador,
        memoriaRAM: req.body.memoriaRAM,
        emmagatzematge: req.body.emmagatzematge,
        preu,
        disponible: req.body.disponible === "true" || req.body.disponible === true,
    };
    data.ordinadors.push(newOrdinador);
    writeData(data);
    if (req.get("Accept")?.includes("text/html")) {
        return res.redirect(303, "/ordinadors");
    }
    res.status(201).json(newOrdinador);
});


//Creem un endpoint per modificar un ordinador
router.put("/:id", (req, res) => {
    const data = readData();
    const body = { ...req.body };
    const id = parseInt(req.params.id);
    const ordinadorIndex = data.ordinadors.findIndex((ordinador) => ordinador.id === id);
    if (ordinadorIndex === -1) return res.status(404).send("ordinador not found");

    if (body.preu !== undefined) {
        body.preu = Number(body.preu);
        if (!Number.isFinite(body.preu) || body.preu < 0) {
            return res.status(400).send("preu not valid");
        }
    }
    if (body.disponible !== undefined) {
        body.disponible = body.disponible === "true" || body.disponible === true;
    }

    data.ordinadors[ordinadorIndex] = {
      ...data.ordinadors[ordinadorIndex],
      ...body,
    };
    writeData(data);
    if (req.originalMethod === "POST") return res.redirect(303, "/ordinadors");
    res.json({ message: "ordinador updated successfully" });
});


//Creem un endpoint per eliminar un ordinador
router.delete("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const ordinadorIndex = data.ordinadors.findIndex((ordinador) => ordinador.id === id);
    if (ordinadorIndex === -1) return res.status(404).send("ordinador not found");
    //splice esborra a partir de ordinadorIndex, el número de elements
    // que li indiqui al segon argument, en aquest cas 1
    data.ordinadors.splice(ordinadorIndex, 1);
    writeData(data);
    if (req.originalMethod === "POST") return res.redirect("/ordinadors");
    res.json({ message: "ordinador deleted successfully" });
});

export default router;
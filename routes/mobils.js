import express from 'express';
import fs from 'fs';

const router = express.Router();

const readData = () => JSON.parse(fs.readFileSync('./db/db.json'));
const writeData = (data) => fs.writeFileSync('./db/db.json', JSON.stringify(data));


router.get("/", (req, res) => {
    const data = readData();
    res.render("mobils", { mobils: data.mobils });
});

router.get("/crear", (req, res) => {
    res.render("crear_mobils");
});

router.get("/:id/edit", (req, res) => {
    const data = readData();
    const mobil = data.mobils.find(b => b.id === parseInt(req.params.id));
    if (!mobil) return res.status(404).send("mobil not found");
    res.render("edit_mobils", { mobil });
});

//Creem un endpoint per obtenir un mòbil per un id
router.get("/:id", (req, res) => {
    const data=readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id=parseInt(req.params.id);
    const mobil=data.mobils.find((mobil)=>mobil.id===id);
    res.json(mobil);
})


//Creem un endpoint del tipus post per afegir un mòbil
router.post("/", (req, res) => {
    const data = readData();
    const preu = Number(req.body.preu);
    if (!Number.isFinite(preu) || preu < 0) {
        return res.status(400).send("preu not valid");
    }

    const newMobil = {
        id: Math.max(0, ...data.mobils.map((mobil) => mobil.id)) + 1,
        marca: req.body.marca,
        model: req.body.model,
        processador: req.body.processador,
        memoriaRAM: req.body.memoriaRAM,
        emmagatzematge: req.body.emmagatzematge,
        preu,
        disponible: req.body.disponible === "true" || req.body.disponible === true,
    };
    data.mobils.push(newMobil);
    writeData(data);
    if (req.get("Accept")?.includes("text/html")) {
        return res.redirect(303, "/mobils");
    }
    res.status(201).json(newMobil);
});


//Creem un endpoint per modificar un mòbil
router.put("/:id", (req, res) => {
    const data = readData();
    const body = { ...req.body };
    const id = parseInt(req.params.id);
    const mobilIndex = data.mobils.findIndex((mobil) => mobil.id === id);
    if (mobilIndex === -1) return res.status(404).send("mobil not found");

    if (body.preu !== undefined) {
        body.preu = Number(body.preu);
        if (!Number.isFinite(body.preu) || body.preu < 0) {
            return res.status(400).send("preu not valid");
        }
    }
    if (body.disponible !== undefined) {
        body.disponible = body.disponible === "true" || body.disponible === true;
    }

    data.mobils[mobilIndex] = {
      ...data.mobils[mobilIndex],
      ...body,
    };
    writeData(data);
    if (req.originalMethod === "POST") return res.redirect(303, "/mobils");
    res.json({ message: "mobil updated successfully" });
});


//Creem un endpoint per eliminar un mòbil
router.delete("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const mobilIndex = data.mobils.findIndex((mobil) => mobil.id === id);
    if (mobilIndex === -1) return res.status(404).send("mobil not found");
    //splice esborra a partir de mobilIndex, el número de elements
    // que li indiqui al segon argument, en aquest cas 1
    data.mobils.splice(mobilIndex, 1);
    writeData(data);
    if (req.originalMethod === "POST") return res.redirect("/mobils");
    res.json({ message: "mobil deleted successfully" });
});

export default router;
import express from "express";
import fs from "fs"; //treballar amb arxius
import bodyParser from "body-parser"; //Ho afegim per entendre que estem rebent un json des de la petició post.

const router = express.Router();

const readData = () => {
    try {
        const data = fs.readFileSync("./db/db.json");
        //console.log(data);
        //console.log(JSON.parse(data));
        return JSON.parse(data)

    } catch (error) {
        console.log(error);
    }
};
//Funció per escriure informació
const writeData = (data) => {
    try {
        fs.writeFileSync("./db/db.json", JSON.stringify(data));

    } catch (error) {
        console.log(error);
    }
}
//Funció per llegir la informació
//readData();

router.get("/", (req, res) => {
    const user = { name: "Adria" }
    const htmlMessage = `
   <p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
   <a href="https://www.example.com">Visita Example</a>`;
    const data = readData();
    res.render("ordinadors", { user, data, htmlMessage })
    //res.json(data.products);

});

//Creem un endpoint per obtenir tots els llibres
router.get("/", (req, res) => {
    const data = readData();
    res.json(data.ordinadors);
})
//Creem un endpoint per obtenir un llibre per un id
router.get("/:id", (req, res) => {
    const data = readData();
    //Extraiem l'id de l'url recordem que req es un objecte tipus requets
    // que conté l'atribut params i el podem consultar
    const id = parseInt(req.params.id);
    const ordinador = data.ordinadors.find((ordinador) => ordinador.id === id);
    res.json(ordinador);
})

//Creem un endpoint del tipus post per afegir un llibre

router.post("/", (req, res) => {
    const data = readData();
    const body = req.body;
    //todo lo que viene en ...body se agrega al nuevo libro
    const newOrdinador = {
        id: data.ordinadors.length + 1,
        ...body,
    };
    data.ordinadors.push(newOrdinador);
    writeData(data);
    res.json(newOrdinador);
});

//Creem un endpoint per modificar un llibre


router.put("/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const ordinadorsIndex = data.ordinadors.findIndex((ordinador) => ordinador.id === id);
    data.ordinadors[ordinadorsIndex] = {
        ...data.ordinadors[ordinadorsIndex],
        ...body,
    };
    writeData(data);
    res.json({ message: "PC updated successfully" });
});

//Creem un endpoint per eliminar un llibre
router.delete("/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const ordinadorsIndex = data.ordinadors.findIndex((ordinador) => ordinador.id === id);
    //splice esborra a part de ordinadorsIndex, el número de elements 
    // que li indiqui al segon argument, en aquest cas 1
    data.ordinadors.splice(ordinadorsIndex, 1);
    writeData(data);
    res.json({ message: "PC deleted successfully" });
});

router.use(express.static("public")); //carpeta publica pel css

export default router;
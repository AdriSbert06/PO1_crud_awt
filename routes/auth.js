import express from "express";
import fs from "fs"; //treballar amb arxius
//import bodyParser from "body-parser"; //Ho afegim per entendre que estem rebent un json des de la petició post.

//Creo l'objecte de l'aplicació
//const app=express();

const router=express.Router();
router.get("/login", (req, res) => {
    const user = { name: "Adrià" }
    const htmlMessage = `
   <p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
   `;
    res.render("login", { })

});

router.get("/register", (req, res) => {
    const user = { name: "Adrià" }
    const htmlMessage = `
   <p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
   `;
    res.render("register", { })
});

router.get("/logout", (req, res) => {
    const user = { name: "Adrià" }
    const htmlMessage = `
   <p>Aquest és un text <strong>amb estil</strong> i un enllaç:</p>
   `;
    res.render("logout", { })
});


export default router;
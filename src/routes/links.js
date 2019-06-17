const express = require('express');
const router = express.Router();

const pool = require('../database');
const {isLoggedIn} = require('../lib/auth');

//ruta para agregar nuevos links
router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add')
});

//metodo que guarda los elementos en la BD
router.post('/add', isLoggedIn, async (req , res) => {
    const {title, url, description} = req.body;
    const newLink = {
        title,
        url,
        description,
        user_id: req.user.id
    };
    //console.log(newLink);
    await pool.query('INSERT INTO links set ?' , [newLink]);
    req.flash('exito','El link se agrego correctamente');
    res.redirect('/links');
});

//metodo que lista los elementos guardados en la BD
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    console.log(links);
    res.render('links/list',{links});
});

//metodo para eliminar elementos
router.get('/delete/:id' , isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('exito','Link eliminado satisfactoriamente');
    res.redirect('/links')
});

//metodo para editar elementos
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
 const links = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
  res.render('links/edit', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const {id} = req.params;
    const {title,url,description} = req.body;
    const newLink = {
        title,
        url,
        description
    };
   await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
   req.flash('exito','link editado de forma correcta');
   res.redirect('/links');
})

module.exports = router;
// Requires
var express = require('express');
var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Usuario = require('../model/usuario');

// ===================================
// Obtener todos los usuarios
// ===================================

app.get('/', (req, res, next) => {

  Usuario.find({}, 'nombre email img role')
    .exec(
      (err, usuarios) => {

        if (err) {
          return res.status(500).json({
            ok: true,
            mensaje: 'Error cargando usuarios',
            errors: err
          });
        }

        return res.status(200).json({
          ok: true,
          usuarios: usuarios,
        });

      });

});





// ===================================
// Actualizar un nuevo usuario
// ===================================

app.put('/:id', mdAutenticacion.verificaToken , (req, res)=>{

  var id = req.params.id;
  var body = req.body;

  Usuario.findById( id, (err,usuario)=>{
    if (err) {
      return res.status(500).json({
        ok: true,
        mensaje: 'Error al buscar usuario',
        errors: err
      });
    }

    if (!usuario){
      return res.status(400).json({
        ok: true,
        mensaje: 'El usuario con el id' + id + 'no existe',
        errors: { message : 'No existe usuario con el id' }
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save( (err,usuarioGuardado)=>{
      if (err) {
        return res.status(400).json({
          ok: true,
          mensaje: 'Error al actualizar usuario',
          errors: err
        });
      }

      usuarioGuardado.password = ':)';

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
     });

    });

  });

});

// ===================================
// Crear un nuevo usuario
// ===================================

app.post('/', mdAutenticacion.verificaToken ,(req, res) => {

  var body = req.body;

  var usuario = new Usuario({
    nombre: body.nombre,
    email : body.email,
    password : bcrypt.hashSync(body.password, 10),
    img : body.img,
    role: body.role
  });

  usuario.save( (err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: true,
        mensaje: 'Error al crear usuario',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuario,
      usuarioToken : req.usuario
    });

  });

});

// ===================================
// Borar un usuario
// ===================================
app.delete('/:id', mdAutenticacion.verificaToken , (req, res)=>{

  id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    if (err) {
      return res.status(500).json({
        ok: true,
        mensaje: 'Error al borrar usuario',
        errors: err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: true,
        mensaje: 'No existe usuario con el id',
        errors: { message : 'No existe usuario con el id' }
      });
    }

    res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
   });

  });


});


module.exports = app;
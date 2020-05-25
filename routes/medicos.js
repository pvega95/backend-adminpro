// Requires
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Medico = require('../model/medico');

// ===================================
// Obtener todos los medicos
// ===================================

app.get('/', (req, res, next) => {

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .populate('hospital')
    .exec(
      (err, medicos) => {

        if (err) {
          return res.status(500).json({
            ok: true,
            mensaje: 'Error cargando medico',
            errors: err
          });
        }

        Medico.count({}, (err, conteo)=>{
          res.status(200).json({
            ok: true,
            medicos: medicos,
            total: conteo
          });
          
        });

        

      });

});





// ===================================
// Actualizar un medico
// ===================================

app.put('/:id', mdAutenticacion.verificaToken , (req, res)=>{

  var id = req.params.id;
  var body = req.body;

  Medico.findById( id, (err,medico)=>{
    if (err) {
      return res.status(500).json({
        ok: true,
        mensaje: 'Error al buscar medico',
        errors: err
      });
    }
  
    if (!medico){
      return res.status(400).json({
        ok: true,
        mensaje: 'El medico con el id' + id + 'no existe',
        errors: { message : 'No existe medico con el id' }
      });
    }

    medico.nombre = body.nombre;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save( (err,medicoGuardado)=>{
      if (err) {
        return res.status(400).json({
          ok: true,
          mensaje: 'Error al actualizar medico',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        medico: medicoGuardado
     });

    });

  });

});

// ===================================
// Crear un nuevo medico
// ===================================

app.post('/', mdAutenticacion.verificaToken ,(req, res) => {

  var body = req.body;

  var medico = new Medico({
    nombre: body.nombre,
    usuario: req.usuario._id,
    hospital: body.hospital
  });

  medico.save( (err, medicoGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: true,
        mensaje: 'Error al crear medico',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      medico: medicoGuardado,
    });

  });

});

// ===================================
// Borar un medico por el id
// ===================================
app.delete('/:id', mdAutenticacion.verificaToken , (req, res)=>{

  id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

    if (err) {
      return res.status(500).json({
        ok: true,
        mensaje: 'Error al borrar medico',
        errors: err
      });
    }

    if (!medicoBorrado) {
      return res.status(400).json({
        ok: true,
        mensaje: 'No existe medico con el id',
        errors: { message : 'No existe medico con el id' }
      });
    }

    res.status(200).json({
      ok: true,
      medico: medicoBorrado
   });

  });


});


module.exports = app;
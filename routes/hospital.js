// Requires
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

var Hospital = require('../model/hospital');

// ===================================
// Obtener todos los hospitales
// ===================================

app.get('/', (req, res, next) => {

  var desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({})
    .populate('usuario','nombre email')
    .exec(
      (err, hospitales) => {

        if (err) {
          return res.status(500).json({
            ok: true,
            mensaje: 'Error cargando hospital',
            errors: err
          });
        }

        Hospital.count({}, (err, conteo) => {
          res.status(200).json({
            ok: true,
            hospitales: hospitales,
            total: conteo
          });
          
        });

        

      });

});





// ===================================
// Actualizar un hospital
// ===================================

app.put('/:id', mdAutenticacion.verificaToken , (req, res)=>{

  var id = req.params.id;
  var body = req.body;

  Hospital.findById( id, (err,hospital)=>{
    if (err) {
      return res.status(500).json({
        ok: true,
        mensaje: 'Error al buscar hospital',
        errors: err
      });
    }
  
    if (!hospital){
      return res.status(400).json({
        ok: true,
        mensaje: 'El hospital con el id' + id + 'no existe',
        errors: { message : 'No existe hospital con el id' }
      });
    }

    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;

    hospital.save( (err,hospitalGuardado)=>{
      if (err) {
        return res.status(400).json({
          ok: true,
          mensaje: 'Error al actualizar hospital',
          errors: err
        });
      }

      res.status(200).json({
        ok: true,
        hospital: hospitalGuardado
     });

    });

  });

});

// ===================================
// Crear un nuevo hospital
// ===================================

app.post('/', mdAutenticacion.verificaToken ,(req, res) => {

  var body = req.body;

  var hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id
  });

  hospital.save( (err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: true,
        mensaje: 'Error al crear hospital',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      hospital: hospitalGuardado,
    });

  });

});

// ===================================
// Borar un hospital por el id
// ===================================
app.delete('/:id', mdAutenticacion.verificaToken , (req, res)=>{

  id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

    if (err) {
      return res.status(500).json({
        ok: true,
        mensaje: 'Error al borrar hospital',
        errors: err
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: true,
        mensaje: 'No existe hospital con el id',
        errors: { message : 'No existe hospital con el id' }
      });
    }

    res.status(200).json({
      ok: true,
      hospital: hospitalBorrado
   });

  });


});


module.exports = app;
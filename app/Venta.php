<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    protected $table = 'ventas';
    
    protected $fillable = ['idAlmacen', 'idProducto', 'idUser', 'vPrecio', 'vCantidad', 'vDescripcion', 'vFechaRegistro'];
}

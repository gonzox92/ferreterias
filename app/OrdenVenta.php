<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OrdenVenta extends Model
{
    protected $table = 'orden_venta';

    protected $fillable = ['idUser', 'fechaRegistro', 'nombre', 'ci'];
}

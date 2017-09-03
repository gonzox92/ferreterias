<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cantidad extends Model
{
    protected $table = 'cantidades';

    protected $fillable = ['idAlmacen', 'idProducto', 'cCantidad'];
}

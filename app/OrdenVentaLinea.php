<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class OrdenVentaLinea extends Model
{
    protected $table = 'orden_venta_linea';
    
    protected $fillable = ['idOrden', 'idProducto', 'nombre', 'descripcion', 'precio', 'cantidad', 'total', 'descuento'];
}

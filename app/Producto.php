<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = ['idAlmacen', 'idProveedor', 'idCategoria', 'pNombre', 'pDescripcion', 'pImagen', 'pPrecio', 'pCantidadEnMano'];

    public function almacen()
    {
        return $this->belongsTo('App\Almacen', 'idAlmacen');
    }
}

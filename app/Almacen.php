<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Almacen extends Model
{
    protected $table = 'almacenes';

    protected $fillable = ['idPropietario', 'aNombre', 'aImagen', 'aDireccion', 'aUbicacion', 'aEntrega', 'aHorario'];

    public function productos($nombre = '', $descripcion = '', $precio1 = ['>', '0'], $precio2 = ['<', '10000'])
    {
        return $this->hasMany('App\Producto', 'idAlmacen')
            ->where('pNombre', 'like', '%'. $nombre .'%')
            ->where('pDescripcion', 'like', '%'. $descripcion .'%')
            ->where('pPrecio', $precio1[0], $precio1[1])
            ->where('pPrecio', $precio2[0], $precio2[1])
            ->get();
    }
}

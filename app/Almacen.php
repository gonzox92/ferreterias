<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Almacen extends Model
{
    protected $table = 'ferreterias';

    protected $fillable = ['idPropietario', 'aNombre', 'aImagen', 'aDireccion', 'aUbicacion', 'aEntrega', 'aHorario'];

    public function productos($nombre = '', $categoria = '', $descripcion = '', $precio1 = ['>', '0'], $precio2 = ['<', '10000'])
    {
        $productos = $this->hasMany('App\Producto', 'idAlmacen')
            ->where('idCategoria', '=', $categoria)
            ->where('pNombre', 'like', '%'. $nombre .'%')
            ->where('pDescripcion', 'like', '%'. $descripcion .'%')
            ->where('pPrecio', $precio1[0], $precio1[1])
            ->where('pPrecio', $precio2[0], $precio2[1]);

        return $productos->get();
    }
}

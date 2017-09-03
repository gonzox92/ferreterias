<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Propietario extends Model
{
    protected $table = 'propietarios';
    
    protected $fillable = ['idUser', 'pCI', 'pNombre', 'pApellidos', 'pDireccion', 'pTelefono'];

    public function almacenes($nombre = '')
    {
        return $this->hasMany('App\Almacen', 'idPropietario')
            ->where('aNombre', 'like', '%'. $nombre .'%')
            ->get();
    }
}

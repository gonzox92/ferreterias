<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vendedor extends Model
{
    protected $table = 'vendedores';
    
    protected $fillable = ['idUser', 'idAlmacen', 'vCI', 'vNombre', 'vApellidos', 'vDireccion', 'vTelefono'];

    public function almacen()
    {
        return $this->hasOne('App\Almacen', 'id', 'idAlmacen')
            ->get();
    }
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SubCategoria extends Model
{
    protected $table = 'sub_categorias';
    public $incrementing = false;

    protected $fillable = ['id', 'idCategoria', 'idAlmacen', 'scNombre'];
}

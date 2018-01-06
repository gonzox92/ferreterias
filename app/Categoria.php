<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Categoria extends Model
{
    protected $table = 'categorias';
    public $incrementing = false;

    protected $fillable = ['id', 'idAlmacen', 'cNombre', 'cImagen'];
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class UPC extends Model
{
    protected $table = 'upc';
    public $incrementing = false;

    protected $fillable = ['id', 'nombre'];
}

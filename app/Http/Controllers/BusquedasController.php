<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Busquedas;

class BusquedasController extends Controller
{
    public function index($nombre = '')
    {
        return Busquedas::all();
    }
}

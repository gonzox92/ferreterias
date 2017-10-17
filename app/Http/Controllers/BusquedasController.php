<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Busquedas;

class BusquedasController extends Controller
{
    public function index($nombre = '')
    {
        $from = request()->from != null ? request()->from : '1900-01-01';
        $to = request()->to != null ? request()->to : '2999-12-31';

        // return Busquedas::all();

        $busquedas = DB::table('busquedas')
            ->select('*')
            ->whereRaw("updated_at >= '" . $from . "' AND updated_at <= '" . $to . "'")
            ->get();

        return response()->json($busquedas, 200);
    }
}

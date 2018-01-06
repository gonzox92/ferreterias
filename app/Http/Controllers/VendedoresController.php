<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Vendedor;

class VendedoresController extends Controller
{
    public function index()
    {
        $nombre = request()->nombre != null ? request()->nombre : '';
        $productos = Vendedor::where('vNombre', 'like', '%'. $nombre .'%')->get();

        return response()->json($productos, 200);
    }

    public function show($id)
    {
        $vendedor = Vendedor::find($id);
        $vendedor['almacen'] = $vendedor->almacen();

        return response()->json($vendedor, 200);
    }

    public function store(Request $request)
    {
        $vendedor = Vendedor::create($request->all());

        return response()->json($vendedor, 201);
    }

    public function update(Request $request, Vendedor $id)
    {
        $id->update($request->all());

        return response()->json($id, 200);
    }

    public function delete(Vendedor $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

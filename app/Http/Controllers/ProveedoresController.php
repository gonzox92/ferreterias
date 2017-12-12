<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Proveedor;

class ProveedoresController extends Controller
{
    public function index()
    {
        $nombre = request()->nombre != null ? request()->nombre : '';
        $productos = Proveedor::where('pNombre', 'like', '%'. $nombre .'%')->get();

        return response()->json($productos, 200);
    }

    public function show($id)
    {
        $producto = Proveedor::find($id);

        return response()->json($producto, 200);
    }

    public function store(Request $request)
    {
        $product = Proveedor::create($request->all());

        return response()->json($product, 201);
    }

    public function update(Request $request, Proveedor $id)
    {
        $id->update($request->all());

        return response()->json($id, 200);
    }

    public function delete(Proveedor $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Venta;

class VentasController extends Controller
{
    public function index()
    {
        return Venta::all();
    }

    public function show(Venta $id)
    {
        return $id;
    }

    public function store(Request $request)
    {
        $product = Venta::create($request->all());

        return response()->json($product, 201);
    }

    public function update(Request $request, Venta $id)
    {
        $id->update($request->all());

        return response()->json($product, 200);
    }

    public function delete(Venta $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CantidadesController extends Controller
{
    public function index()
    {
        return \App\Cantidad::all();
    }

    public function show(\App\Cantidad $id)
    {
        return $id;
    }

    public function store(Request $request)
    {
        $product = \App\Cantidad::create($request->all());

        return response()->json($product, 201);
    }

    public function update(Request $request, \App\Cantidad $id)
    {
        $id->update($request->all());

        return response()->json($id, 200);
    }

    public function delete(\App\Cantidad $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Categoria;

class CategoriasController extends Controller
{
    public function index()
    {
      return Categoria::all();
    }

    public function show($id)
    {
        $categoria = Categoria::find($id);

        return response()->json($categoria, 200);
    }

    public function store(Request $request)
    {
        $categorias = Categoria::create($request->all());

        return response()->json($categoria, 201);
    }

    public function update(Request $request, Categoria $id)
    {
        $id->update($request->all());

        return response()->json($product, 200);
    }

    public function delete(Categoria $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

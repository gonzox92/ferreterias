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
        $categoria = Categoria::create($request->all());

        return response()->json($categoria, 201);
    }

    public function update(Request $request, Categoria $id)
    {
        $id->update($request->all());

        return response()->json($id, 200);
    }

    public function delete(Categoria $id)
    {
        $id->delete();
        DB::delete('DELETE FROM sub_categorias WHERE idCategoria = ?', [$id->id]);

        return response()->json(null, 204);
    }
}

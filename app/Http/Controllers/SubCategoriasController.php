<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\SubCategoria;

class SubCategoriasController extends Controller
{
    public function index()
    {
      return SubCategoria::all();
    }

    public function show($id)
    {
        $subCategoria = SubCategoria::find($id);

        return response()->json($subCategoria, 200);
    }

    public function store(Request $request)
    {
        $subCategoria = SubCategoria::create($request->all());

        return response()->json($subCategoria, 201);
    }

    public function update(Request $request, SubCategoria $id)
    {
        $id->update($request->all());
        DB::update('UPDATE productos SET scNombre = ? WHERE idCategoria = ?', [$id->scNombre, $id->id]);

        return response()->json($id, 200);
    }

    public function delete(SubCategoria $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

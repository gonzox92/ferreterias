<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\UPC;

class UPCController extends Controller
{
    public function index()
    {
    //   return UPC::all();

      $limit = request()->limit != null ? request()->limit : '10';
      $id = request()->id != null ? request()->id : '%';
      $nombre = request()->nombre != null ? request()->nombre : '';
      $codes = UPC::where('id', 'LIKE', $id)
        ->where('nombre', 'LIKE', '%' . $nombre . '%')->paginate($limit);

      return response()->json($codes, 200);
    }

    public function show($id)
    {
        $UPC = UPC::find($id);

        return response()->json($UPC, 200);
    }

    public function store(Request $request)
    {
        $UPC = UPC::create($request->all());

        return response()->json($UPC, 201);
    }

    public function update(Request $request, UPC $id)
    {
        $id->update($request->all());

        return response()->json($id, 200);
    }

    public function delete(UPC $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

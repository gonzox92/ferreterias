<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Producto;

class ProductoController extends Controller
{
    function convert($name)
    {
        return("pNombre LIKE '%$name%'");
    }

    public function index()
    {
        $nombre = request()->nombre != null ? request()->nombre : '';
        $limit = request()->limit != null ? request()->limit : '10';
        $isAutocomplete = request()->limit != null ? boolval(request()->isAutocomplete) : true;
        $palabras = explode(',', $nombre);
        $where = join(' OR ', array_map(array($this, 'convert'), $palabras));

        if ($isAutocomplete) {
            foreach ($palabras as $palabra) {
                if ($palabra != '') {
                    DB::insert('INSERT INTO busquedas (palabra, contador) VALUES (:palabra, 1) ON DUPLICATE KEY UPDATE contador = contador + 1',
                        ['palabra' => $palabra]);
                }
            }
        }

        $productos = DB::table('productos')
            ->join('almacenes', 'productos.idAlmacen', '=', 'almacenes.id')
            ->select('productos.*', 'almacenes.aNombre', 'almacenes.aDireccion', 'almacenes.aUbicacion')
            ->whereRaw($where)
            ->paginate($limit);
            
        return response()->json($productos, 200);
    }

    public function show($id)
    {
        $producto = Producto::find($id);

        $producto['almacen'] = $producto->almacen;

        return response()->json($producto, 200);
    }

    public function store(Request $request)
    {
        $product = Producto::create($request->all());

        return response()->json($product, 201);
    }

    public function update(Request $request, Producto $product)
    {
        $product->update($request->all());

        return response()->json($product, 200);
    }

    public function delete(Producto $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

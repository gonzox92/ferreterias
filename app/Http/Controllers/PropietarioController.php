<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Propietario;
use App\Vendedor;

class PropietarioController extends Controller
{
    public function index()
    {
        $nombre = request()->nombre != null ? request()->nombre : '';
        $productos = Propietario::where('pNombre', 'like', '%'. $nombre .'%')->get();

        return response()->json($productos, 200);
    }

    public function show(Propietario $id)
    {
        return $id;
    }

    public function showAlmacenes($id)
    {
        $nombre = request()->nombre != null ? request()->nombre : '';
        
        $almacen = Propietario::find($id);
        $vendedor = Vendedor::find($id);
        
        try
        {
            if ($almacen != null) {
                $almacen['almacenes'] = $almacen->almacenes($nombre);
            } else {
                $almacen['almacenes'] = $vendedor->almacen();
            }
            return response()->json($almacen, 200);
        }
        catch(Exception $ex)
        {
            $almacen['almacenes'] = $vendedor->almacen();
            return response()->json($almacen, 200);
        }
    }

    public function showProductos($id) 
    {
        $nombre = request()->nombre != null ? request()->nombre : '';
        $descripcion = request()->descripcion != null ? request()->descripcion : '';
        $valor1 = explode('|', request()->valor1 != null ? request()->valor1 : '>|0');
        $valor2 = explode('|', request()->valor2 != null ? request()->valor2 : '<|100000');

        $page = request()->page != null ? request()->page : '1';
        $limit = request()->limit != null ? request()->limit : '6';

        $productos = DB::table('productos')
            ->join('almacenes', 'productos.idAlmacen', '=', 'almacenes.id')
            ->select('productos.*', 'almacenes.aNombre', 'almacenes.aDireccion', 'almacenes.aUbicacion')
            ->where('almacenes.idPropietario', '=', $id)
            ->where('pNombre', 'like', '%'. $nombre .'%')
            ->where('pDescripcion', 'like', '%'. $descripcion .'%')
            ->where('pPrecio', $valor1[0], $valor1[1])
            ->paginate($limit);

        return response()->json($productos, 200);
    }

    public function store(Request $request)
    {
        $product = Propietario::create($request->all());

        return response()->json($product, 201);
    }

    public function update(Request $request, Propietario $id)
    {
        $id->update($request->all());

        return response()->json($product, 200);
    }

    public function delete(Propietario $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

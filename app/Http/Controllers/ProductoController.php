<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Producto;

class ProductoController extends Controller
{
    function convert($name)
    {
        return("productos.pNombre LIKE '%$name%'");
    }

    public function index()
    {
        $nombre = request()->nombre != null ? request()->nombre : '';
        $limit = request()->limit != null ? request()->limit : '10';
        $isAutocomplete = request()->isAutocomplete != null ? request()->isAutocomplete : 'true';
        $orderByPrice = request()->orderByPrice != null ? request()->orderByPrice : '';
        $idPropietario = request()->idPropietario != null ? request()->idPropietario : '';
        $idVendedor = request()->idVendedor != null ? request()->idVendedor : '';

        $palabras = explode(',', $nombre);
        $where = join(' OR ', array_map(array($this, 'convert'), $palabras));

        if ($isAutocomplete)
        {
            foreach ($palabras as $palabra)
            {
                if ($palabra != '')
                {
                    DB::insert('INSERT INTO busquedas (palabra, contador, updated_at) VALUES (:palabra, 1, NOW()) ON DUPLICATE KEY UPDATE contador = contador + 1',
                        ['palabra' => $palabra]);
                }
            }
        }

        $productos = [];

        if ($isAutocomplete == 'true')
        {
            $productos = DB::table('productos')
                ->select('productos.pNombre')
                ->whereRaw('productos.pNombre LIKE \'%' . $nombre . '%\'')
                ->limit(5)
                ->distinct()
                ->get();
        }
        else if ($idPropietario != '')
        {
            $where = $where . ' AND propietarios.id = ' . $idPropietario;

            $productos = DB::table('ferreterias')
                ->join('propietarios', 'propietarios.id', '=', 'ferreterias.idPropietario')
                ->join('productos', 'productos.idAlmacen', '=', 'ferreterias.id')
                ->select('productos.*', 'ferreterias.aNombre', 'ferreterias.aDireccion', 'ferreterias.aUbicacion', 'ferreterias.aImagen')
                ->whereRaw($where);
        }
        else if ($idVendedor != '')
        {
            $where = $where . ' AND vendedores.id = ' . $idVendedor;
            
            $productos = DB::table('ferreterias')
                ->join('vendedores', 'vendedores.idAlmacen', '=', 'ferreterias.id')
                ->join('productos', 'productos.idAlmacen', '=', 'ferreterias.id')
                ->select('productos.*', 'ferreterias.aNombre', 'ferreterias.aDireccion', 'ferreterias.aUbicacion', 'ferreterias.aImagen')
                ->whereRaw($where);
        }
        else
        {
            $productos = DB::table('productos')
                ->join('ferreterias', 'productos.idAlmacen', '=', 'ferreterias.id')
                ->select('productos.*', 'ferreterias.aNombre', 'ferreterias.aDireccion', 'ferreterias.aUbicacion', 'ferreterias.aImagen')
                ->whereRaw($where);
        }

        if ($orderByPrice != '')
        {
            $productos = $productos->orderBy('productos.pPrecio', $orderByPrice);
        }
            
        if ($isAutocomplete == 'false')
        {
            $productos = $productos->paginate($limit);
        }
            
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

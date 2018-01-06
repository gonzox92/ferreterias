<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
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
        $limit = request()->limit != null ? request()->limit : '500';
        $where = 'MATCH(pNombre) AGAINST (\'' . $nombre . '\' IN NATURAL LANGUAGE MODE)';
        $whereFerreterias = 'SELECT id, aNombre, aUbicacion, aImagen, aDireccion ' . 
            'FROM ferreterias INNER JOIN (SELECT DISTINCT idAlmacen FROM productos ' .
            'WHERE MATCH(pNombre) AGAINST (\'' . $nombre . '\' IN NATURAL LANGUAGE MODE) LIMIT 100) AS tmpResult ' .
            'ON (ferreterias.id = tmpResult.idAlmacen)';
        $useFerreterias = request()->useFerreterias != null ? request()->useFerreterias : 'all';
        $productos = [];
        $ferreterias = [];

        if ($useFerreterias == 'own') {
            $privilegio = request()->privilegio;
            $ownerID = request()->ownerID;

            if ($privilegio == 'propietario') {
                $where = $where . ' AND idAlmacen IN (SELECT id FROM ferreterias WHERE idPropietario = ' . $ownerID . ')';
                $whereFerreterias = $whereFerreterias . ' AND idAlmacen IN (SELECT id FROM ferreterias WHERE idPropietario = ' . $ownerID . ')';
            }

            if ($privilegio == 'vendedor') {
                $where = $where . ' AND idAlmacen IN (SELECT idAlmacen FROM vendedores WHERE id = ' . $ownerID . ')';
                $whereFerreterias = $whereFerreterias . ' AND idAlmacen IN (SELECT idAlmacen FROM vendedores WHERE id = ' . $ownerID . ')';
            }
        }

        $productos = DB::table('productos')
            ->select('pNombre', 'pImagen', 'UPC' , 'scNombre', 'idAlmacen', 'aUbicacion')
            ->distinct()
            ->join('ferreterias', 'productos.idAlmacen', '=', 'ferreterias.id')
            ->whereRaw($where)
            ->paginate($limit);

        $ferreterias = DB::select(DB::raw($whereFerreterias));
        
        $productos['ferreterias'] = $ferreterias;

        return response()->json($productos, 200);
    }

    public function list()
    {
        $upc = request()->upc != null ? request()->upc : '';
        $limit = request()->limit != null ? request()->limit : '50';
        $useFerreterias = request()->useFerreterias != null ? request()->useFerreterias : 'all';
        $where = 'UPC = \'' . $upc . '\'';

        if ($useFerreterias == 'own') {
            $privilegio = request()->privilegio;
            $ownerID = request()->ownerID;

            if ($privilegio == 'propietario') {
                $where = $where . ' AND ferreterias.id IN (SELECT id FROM ferreterias WHERE idPropietario = ' . $ownerID . ')';
            }

            if ($privilegio == 'vendedor') {
                $where = $where . ' AND ferreterias.id IN (SELECT idAlmacen FROM vendedores WHERE id = ' . $ownerID . ')';
            }
        }

        $productos = DB::table('productos')
            ->select('productos.*', 'productos.pNombre as producto', 'aNombre', 'aImagen', 'aUbicacion', 'aDireccion', 'proveedores.pNombre', 'proveedores.pLogo')
            ->join('ferreterias', 'productos.idAlmacen', '=', 'ferreterias.id')
            ->join('proveedores', 'productos.idProveedor', '=', 'proveedores.id')
            ->whereRaw($where)
            ->paginate($limit);

        return response()->json($productos, 200);
    }

    public function search()
    {
        $client = new Client();
        $res = $client->request('GET', 'https://www.google.com/complete/search', [
            'query' => [
                'client' => request()->client,
                'hl' => request()->hl,
                'q' => request()->q
            ]
        ]);
        
        return $res->getBody();
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
        DB::update('UPDATE sub_categorias SET qtyProductos = qtyProductos + 1 WHERE id = ?', [$product->idCategoria]);
        DB::update('UPDATE productos SET scNombre = (SELECT scNombre FROM sub_categorias WHERE sub_categorias.id = ?) WHERE id = ?', [$product->idCategoria, $product->id]);

        return response()->json($product, 201);
    }

    public function update(Request $request, Producto $id)
    {
        $id->update($request->all());
        DB::update('UPDATE productos SET scNombre = (SELECT scNombre FROM sub_categorias WHERE sub_categorias.id = ?) WHERE id = ?', [$id->idCategoria, $id->id]);

        return response()->json($id, 200);
    }

    public function delete(Producto $id)
    {
        $id->delete();
        DB::update('UPDATE sub_categorias SET qtyProductos = qtyProductos - 1 WHERE id = ?', [$id->idCategoria]);
        // DB::update('UPDATE productos SET scNombre = (SELECT scNombre FROM sub_categorias WHERE sub_categorias.id = \'' . $product->idCategoria . '\') WHERE id = ?', [$product->id]);

        return response()->json(null, 204);
    }
}

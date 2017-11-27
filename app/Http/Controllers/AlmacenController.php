<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Almacen;

class AlmacenController extends Controller
{
    public function index($nombre = '')
    {
        $nombre = request()->nombre != null ? request()->nombre : '';
        $limit = request()->limit != null ? request()->limit : '20';

        $almacenes = Almacen::where('aNombre', 'LIKE', '%' . $nombre . '%')
            ->paginate($limit);

        return response()->json($almacenes, 200);
    }

    public function show($id)
    {
        $almacen = Almacen::find($id);

        return response()->json($almacen, 200);
    }

    public function showProductos($id)
    {
        $nombre = request()->nombre != null ? request()->nombre : '';
        $categoria = request()->categoria != null ? request()->categoria : '';        
        $descripcion = request()->descripcion != null ? request()->descripcion : '';
        $valor1 = request()->valor1 != null ? request()->valor1 : '>=,0';
        $valor2 = request()->valor2 != null ? request()->valor2 : '<,10000';
        
        $almacen = Almacen::find($id);
        $almacen['categoria'] = DB::select("SELECT id,scNombre FROM sub_categorias WHERE id = '" . $categoria . "'")[0];
        $almacen['productos'] = $almacen == NULL ? [] : $almacen->productos($nombre, $categoria, $descripcion, explode(',', $valor1), explode(',', $valor2));

        return response()->json($almacen, 200);
    }

    public function showCategorias($id)
    {
        $categorias = DB::select("SELECT id,cNombre,cImagen, NULL AS ParentId,'fa fa-plus' AS '__icon_class__' FROM categorias WHERE idAlmacen = " . $id . " UNION SELECT id,scNombre AS Nombre,NULL AS cImagen,idCategoria AS ParentId,'fa fa-file' AS '__icon_class__' FROM sub_categorias WHERE idAlmacen = " . $id);

        return response()->json($categorias, 200);
    }

    public function showVendedores($id)
    {
        $nombre = request()->nombre != null ? request()->nombre : '';

        $vendedores = DB::table('vendedores')
            ->select('*')
            ->where('idAlmacen', '=', $id)
            ->get();

        return response()->json($vendedores, 200);
    }

    public function store(Request $request)
    {
        $product = Almacen::create($request->all());

        return response()->json($product, 201);
    }

    public function update(Request $request, Almacen $id)
    {
        $id->update($request->all());

        return response()->json($id, 200);
    }

    public function delete(Almacen $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

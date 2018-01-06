<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Crisu83\ShortId\ShortId;
use App\Almacen;

class AlmacenController extends Controller
{
    public function index($nombre = '')
    {
        $nombre = request()->nombre != null ? request()->nombre : '';
        $limit = request()->limit != null ? request()->limit : '20';

        $almacenes = Almacen::where('aNombre', 'LIKE', '%' . $nombre . '%')
            ->orderBy('created_at', 'desc')
            ->paginate($limit);

        return response()->json($almacenes, 200);
    }

    public function productos($id)
    {
        $productos = DB::select(DB::raw('SELECT id,UPC,idAlmacen,idCategoria,idProveedor,pNombre,pImagen,pPrecio,pCantidadEnMano,scNombre FROM productos WHERE idAlmacen = \'' . $id . '\''));

        return response()->json($productos, 200);
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
        $categorias = DB::select("SELECT id,cNombre,cImagen, NULL AS ParentId, 0 AS qtyProductos FROM categorias WHERE idAlmacen = " . $id . " UNION SELECT id,scNombre AS Nombre,NULL AS cImagen,idCategoria AS ParentId, qtyProductos FROM sub_categorias WHERE idAlmacen = " . $id);

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
        $shortid = ShortId::create();

        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Herramientas de mano\', \'https://img.interempresas.net/Ap/E50x50/1000117.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Herramientas de sujeción\', \'https://img.interempresas.net/Ap/E50x50/1000118.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Elementos de unión\', \'https://img.interempresas.net/Ap/E50x50/1000132.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Herramientas para construcción e instaladores\', \'https://img.interempresas.net/Ap/E50x50/1000119.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Herramientas para máquina-herramienta\', \'https://img.interempresas.net/Ap/E50x50/1000120.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Herramientas para madera y carpintería\', \'https://img.interempresas.net/Ap/E50x50/1000121.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Herramientas abrasivas\', \'https://img.interempresas.net/Ap/E50x50/1000122.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Herramientas eléctricas y neumáticas\', \'https://img.interempresas.net/Ap/E50x50/1000123.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Herramientas automotrices para jardinería\', \'https://img.interempresas.net/Ap/E50x50/1000124.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Herramientas manuales para huerto y jardín\', \'https://img.interempresas.net/Ap/E50x50/1000125.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Máquinas manuales para construcción y obra pública\', \'https://img.interempresas.net/Ap/E50x50/1000126.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Materiales de desgaste para construcción y obra pública\', \'https://img.interempresas.net/Ap/E50x50/1000127.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Medios y equipos de obra\', \'https://img.interempresas.net/Ap/E50x50/1000128.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Herrajes\', \'https://img.interempresas.net/Ap/E50x50/1000129.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Artículos de seguridad\', \'https://img.interempresas.net/Ap/E50x50/2314.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Equipamiento para soldadura\', \'https://img.interempresas.net/Ap/E50x50/1000471.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Tuberías y sus accesorios\', \'https://img.interempresas.net/Ap/E50x50/1000643.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Productos de fijación y sellado\', \'https://img.interempresas.net/Ap/E50x50/2313.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Pinturas, esmaltes y barnices\', \'https://img.interempresas.net/Ap/E50x50/2322.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Escaleras\', \'https://img.interempresas.net/Ap/E50x50/1000133.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Equipamiento de taller\', \'https://img.interempresas.net/Ap/E50x50/1000134.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Equipos de protección individual\', \'https://img.interempresas.net/Ap/E50x50/1000136.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Iluminación y alumbrado\', \'https://img.interempresas.net/Ap/E50x50/1000131.jpeg\')');
        DB::insert('INSERT INTO categorias (id, idAlmacen, cNombre, cImagen) VALUES (\'' . $shortid->generate() . '\', \'' . $product->id . '\', \'Varios ferretería\', \'https://img.interempresas.net/Ap/E50x50/2311.jpeg\')');


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

    public function reporte_fechas()
    {
        $from = request()->from != null ? request()->from : '1900-01-01';
        $to = request()->to != null ? request()->to : '2099-12-31';

        $almacenes = Almacen::select(['id', 'created_at AS fecha', DB::raw('COUNT(created_at) AS registros')])
            ->where('created_at', '>=', $from)
            ->where('created_at', '<=', $to)
            ->groupBy('created_at');

        return response()->json($almacenes->get(), 200);
    }
}

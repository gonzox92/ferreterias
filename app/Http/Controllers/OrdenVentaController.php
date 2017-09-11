<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\OrdenVenta;
use App\OrdenVentaLinea;

class OrdenVentaController extends Controller
{
    public function index()
    {
        $idUser = request()->idUser != null ? request()->idUser : '0';
        // $ordenes = OrdenVenta::where('idUser', '=', $idUser)->select('*', 'COUNT(SELECT orden_venta_linea WHERE idOrden = 3)')->get();
        $ordenes = DB::table('orden_venta')
            ->join('orden_venta_linea', 'orden_venta.id', '=', 'orden_venta_linea.idOrden')
            ->select('orden_venta.*', DB::raw('COUNT(orden_venta_linea.id) AS productos, SUM(orden_venta_linea.total) AS total'))
            ->where('orden_venta.idUser', '=', $idUser)
            ->groupBy('orden_venta.id')
            ->get();

        return response()->json($ordenes, 200);
    }

    public function show(\App\OrdenVenta $id)
    {
        return $id;
    }

    public function store(Request $request)
    {
        $orden = \App\OrdenVenta::create($request->all());
        
        $lineas = $request->all()['lineas'];
        foreach($lineas as $linea)
        {
            $linea['idOrden'] = $orden['id'];
            \App\OrdenVentaLinea::create($linea);
        }
        $orden['lineas'] = $lineas;

        return response()->json($orden, 201);
    }

    public function update(Request $request, \App\OrdenVenta $id)
    {
        $id->update($request->all());

        return response()->json($id, 200);
    }

    public function delete(\App\OrdenVenta $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

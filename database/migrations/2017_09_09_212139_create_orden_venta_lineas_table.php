<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateOrdenVentaLineasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orden_venta_linea', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('idOrden');
            $table->integer('idProducto');
            $table->string('nombre');
            $table->string('descripcion');
            $table->float('precio');
            $table->float('cantidad');
            $table->float('total');
            $table->float('descuento');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orden_venta_linea');
    }
}

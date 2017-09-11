<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Articles
Route::get('articles', 'ArticleController@index');
Route::get('articles/{article}', 'ArticleController@show');
Route::post('articles', 'ArticleController@store');
Route::put('articles/{article}', 'ArticleController@update');
Route::delete('articles/{article}', 'ArticleController@delete');

// Products
Route::get('productos', 'ProductoController@index');
Route::get('productos/{id}', 'ProductoController@show');
Route::post('productos', 'ProductoController@store');
Route::put('productos/{id}', 'ProductoController@update');
Route::delete('productos/{id}', 'ProductoController@delete');

// Proveedores
Route::get('proveedores', 'ProveedoresController@index');
Route::get('proveedores/{id}', 'ProveedoresController@show');
Route::post('proveedores', 'ProveedoresController@store');
Route::put('proveedores/{id}', 'ProveedoresController@update');
Route::delete('proveedores/{id}', 'ProveedoresController@delete');

// Almacenes
Route::get('almacenes', 'AlmacenController@index');
Route::get('almacenes/{id}', 'AlmacenController@show');
Route::get('almacenes/{id}/productos', 'AlmacenController@showProductos');
Route::get('almacenes/{id}/vendedores', 'AlmacenController@showVendedores');
Route::post('almacenes', 'AlmacenController@store');
Route::put('almacenes/{id}', 'AlmacenController@update');
Route::delete('almacenes/{id}', 'AlmacenController@delete');

// Cantidades
Route::get('cantidades', 'CantidadesController@index');
Route::get('cantidades/{id}', 'CantidadesController@show');
Route::post('cantidades', 'CantidadesController@store');
Route::put('cantidades/{id}', 'CantidadesController@update');
Route::delete('cantidades/{id}', 'CantidadesController@delete');

// Ventas
Route::get('ventas', 'VentasController@index');
Route::get('ventas/{id}', 'VentasController@show');
Route::post('ventas', 'VentasController@store');
Route::put('ventas/{id}', 'VentasController@update');
Route::delete('ventas/{id}', 'VentasController@delete');

// Propietarios
Route::get('propietarios', 'PropietarioController@index');
Route::get('propietarios/{id}', 'PropietarioController@show');
Route::get('propietarios/{id}/almacenes', 'PropietarioController@showAlmacenes');
Route::get('propietarios/{id}/productos', 'PropietarioController@showProductos');
Route::post('propietarios', 'PropietarioController@store');
Route::put('propietarios/{id}', 'PropietarioController@update');
Route::delete('propietarios/{id}', 'PropietarioController@delete');

// Usuarios
Route::post('usuarios/login', 'UserController@logIn');
Route::post('usuarios', 'UserController@store');
Route::get('usuarios/{id}', 'UserController@show');
Route::put('usuarios/{id}', 'UserController@update');
Route::delete('usuarios/{id}', 'UserController@delete');

// Vendedores
Route::get('vendedores', 'VendedoresController@index');
Route::get('vendedores/{id}', 'VendedoresController@show');
Route::post('vendedores', 'VendedoresController@store');
Route::put('vendedores/{id}', 'VendedoresController@update');
Route::delete('vendedores/{id}', 'VendedoresController@delete');

Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
Route::post('authenticate', 'AuthenticateController@authenticate');

// Route::get('fileentry', 'FileEntryController@index');
Route::get('fileentry/get/{filename}', ['as' => 'getentry', 'uses' => 'FileEntryController@get']);
Route::post('fileentry/add',['as' => 'addentry', 'uses' => 'FileEntryController@add']);

// Busquedas
Route::get('busquedas', 'BusquedasController@index');

// Ordenes de Venta
Route::get('ordenes', 'OrdenVentaController@index');
Route::get('ordenes/{id}', 'OrdenVentaController@show');
Route::post('ordenes', 'OrdenVentaController@store');
Route::put('ordenes/{id}', 'OrdenVentaController@update');
Route::delete('ordenes/{id}', 'OrdenVentaController@delete');

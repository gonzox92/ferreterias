<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class UserController extends Controller
{
    public function logIn(Request $request)
    {
        $username = $request->input('username');
        $password = $request->input('password');

        $user = User::where('name', '=', $username)
            ->where('password', '=', $password)->first();
        $user['propietario'] = $user->propietario;
        $user['vendedor'] = $user->vendedor;

        return response()->json(['user' => $user], 200);
    }
    
    public function index()
    {
        $sql = request()->sql != null ? request()->sql : '1 = 1';
        $users = User::whereRaw($sql)->get();

        return response()->json($users, 200);
    }


    public function show($id)
    {
        $user = User::find($id);
        $user['propietario'] = $user->propietario;
        $user['vendedor'] = $user->vendedor;

        return response()->json($user, 200);
    }

    public function store(Request $request)
    {
        $user = User::create($request->all());

        return response()->json($user, 201);
    }

    public function update(Request $request, User $id)
    {
        $id->update($request->all());

        return response()->json($id, 200);
    }

    public function delete(User $id)
    {
        $id->delete();

        return response()->json(null, 204);
    }
}

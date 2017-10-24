<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password', 'privilegio', 'password', 'imagen', 'nombreCompleto'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'remember_token',
    ];

    public function propietario()
    {
        return $this->hasOne('App\Propietario', 'idUser');
    }

    public function vendedor()
    {
        return $this->hasOne('App\Vendedor', 'idUser');
    }
}

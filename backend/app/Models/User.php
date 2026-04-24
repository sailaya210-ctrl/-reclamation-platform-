<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'nom',
        'email',
        'password',
        'role', // admin | responsable | employe
    ];

    protected $hidden = [
        'password',
    ];

    // ── JWT ──────────────────────────────
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role'  => $this->role,
            'nom'   => $this->nom,
            'email' => $this->email,
        ];
    }
}
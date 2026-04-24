<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ── LOGIN ─────────────────────────────────
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect.',
            ], 401);
        }

        $user = auth('api')->user();

        return response()->json([
            'success' => true,
            'token'   => $token,
            'user'    => [
                'id'         => $user->id,
                'nom'        => $user->nom,
                'email'      => $user->email,
                'role'       => $user->role,
                'initiales'  => $this->getInitiales($user->nom),
            ],
        ]);
    }

    // ── ME (infos user connecté) ──────────────
    public function me()
    {
        $user = auth('api')->user();
        return response()->json([
            'id'        => $user->id,
            'nom'       => $user->nom,
            'email'     => $user->email,
            'role'      => $user->role,
            'initiales' => $this->getInitiales($user->nom),
        ]);
    }

    // ── LOGOUT ────────────────────────────────
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    // ── REFRESH TOKEN ─────────────────────────
    public function refresh()
    {
        return response()->json([
            'token' => auth('api')->refresh(),
        ]);
    }

    // ── HELPER ───────────────────────────────
    private function getInitiales($nom)
    {
        $parts = explode(' ', $nom);
        return strtoupper(substr($parts[0], 0, 1) . (isset($parts[1]) ? substr($parts[1], 0, 1) : ''));
    }
}
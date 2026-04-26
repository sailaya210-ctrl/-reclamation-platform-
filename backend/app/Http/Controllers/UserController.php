<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        // Only admins
        if (auth('api')->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        return response()->json(
            User::select('id', 'nom', 'email', 'role')->get()
        );
    }

    // POST /api/users
    public function store(Request $request)
    {
        // Only admins
        if (auth('api')->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $request->validate([
            'nom'      => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:4',
            'role'     => 'required|in:admin,responsable,employe,intervenant',
        ]);

        $user = User::create([
            'nom'      => $request->nom,
            'email'    => $request->email,
            'password' => Hash::make($request->password), // ← hashed so login works
            'role'     => $request->role,
        ]);

        return response()->json([
            'message' => 'Utilisateur créé avec succès.',
            'user'    => $user->only('id', 'nom', 'email', 'role'),
        ], 201);
    }

    // DELETE /api/users/{id}
    public function destroy($id)
    {
        // Only admins
        if (auth('api')->user()->role !== 'admin') {
            return response()->json(['message' => 'Accès refusé.'], 403);
        }

        $user = User::findOrFail($id);

        if ($user->id === auth('api')->id()) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.'
            ], 403);
        }

        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }
}
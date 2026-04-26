<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    // GET /api/tickets
    // Employee sees only their own tickets
    // Responsable/Admin sees all
    public function index(Request $request)
    {
        $user = auth('api')->user();

        $query = Ticket::with(['creator:id,nom,email', 'assignee:id,nom,email']);

        if ($user && $user->role === 'employe') {
            $query->where(function($q) use ($user) {
                $q->where('created_by', $user->id)
                  ->orWhere('assigned_to', $user->id);
            });
        }

        $tickets = $query->orderBy('created_at', 'desc')->get();

        return response()->json(['data' => $tickets]);
    }

    // POST /api/tickets — Employee creates ticket (always starts as "attente")
    public function store(Request $request)
    {
        $user = auth('api')->user();

        $request->validate([
            'titre'       => 'required|string|max:255',
            'service'     => 'required|string',
            'description' => 'required|string',
            'priorite'    => 'in:urgent,haute,normal,faible',
            ]);

        $ticket = Ticket::create([
            'titre'       => $request->titre,
            'service'     => $request->service,
            'description' => $request->description,
            'priorite'    => $request->priorite ?? 'normal',
            'statut'      => 'attente',   // always starts waiting
            'created_by'  => $user?->id,
            'assigned_to' => null,        // null until responsable assigns
        ]);

        return response()->json(['ticket' => $ticket->load('creator:id,nom,email')], 201);
    }

    // GET /api/tickets/{id}
    public function show($id)
    {
        $ticket = Ticket::with(['creator:id,nom,email', 'assignee:id,nom,email'])->findOrFail($id);
        return response()->json($ticket);
    }

    // PUT /api/tickets/{id}
    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->update($request->only(['titre', 'service', 'description', 'priorite', 'statut']));
        return response()->json(['ticket' => $ticket]);
    }

    // DELETE /api/tickets/{id}
    public function destroy($id)
    {
        $user   = auth('api')->user();
        $ticket = Ticket::findOrFail($id);

        // Employee can only delete their own tickets
        if ($user->role === 'employe' && $ticket->created_by !== $user->id) {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }

        $ticket->delete();
        return response()->json(['message' => 'Ticket supprimé.']);
    }

    // PUT /api/tickets/{id}/assign — Responsable assigns ticket
    public function assign(Request $request, $id)
    {
        $request->validate(['assigned_to' => 'required|exists:users,id']);
        $ticket = Ticket::findOrFail($id);
        $ticket->update([
            'assigned_to' => $request->assigned_to,
            'statut'      => 'cours',  // auto move to "en cours" when assigned
        ]);
        return response()->json(['ticket' => $ticket->load('assignee:id,nom,email')]);
    }

    // PUT /api/tickets/{id}/status
    public function updateStatus(Request $request, $id)
    {
        $request->validate(['statut' => 'required|in:attente,cours,resolu']);
        $ticket = Ticket::findOrFail($id);
        $ticket->update(['statut' => $request->statut]);
        return response()->json(['ticket' => $ticket]);
    }

    // PUT /api/tickets/{id}/priority
    public function updatePriority(Request $request, $id)
    {
        $request->validate(['priorite' => 'required|in:urgent,haute,normal,faible']);
        $ticket = Ticket::findOrFail($id);
        $ticket->update(['priorite' => $request->priorite]);
        return response()->json(['ticket' => $ticket]);
    }

    // POST /api/tickets/{id}/comment
    public function addComment(Request $request, $id)
    {
        $request->validate(['contenu' => 'required|string']);
        $ticket = Ticket::findOrFail($id);
        // Store comments as JSON array in a column, or use a comments table
        $comments = $ticket->comments ?? [];
        $comments[] = [
            'author'  => auth('api')->user()?->nom ?? 'Inconnu',
            'contenu' => $request->contenu,
            'time'    => now()->toDateTimeString(),
        ];
        $ticket->update(['comments' => $comments]);
        return response()->json(['comments' => $comments]);
    }

    // GET /api/stats
    public function stats()
    {
        $user = auth('api')->user();
        $query = Ticket::query();
        if ($user->role === 'employe') {
            $query->where('created_by', $user->id);
        }
        return response()->json([
            'total'   => $query->count(),
            'attente' => (clone $query)->where('statut', 'attente')->count(),
            'cours'   => (clone $query)->where('statut', 'cours')->count(),
            'resolu'  => (clone $query)->where('statut', 'resolu')->count(),
        ]);
    }
}
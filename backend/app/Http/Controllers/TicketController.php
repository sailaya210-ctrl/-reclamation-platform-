<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Commentaire;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    // ── GET ALL TICKETS ───────────────────────
    // Admin + Responsable voient tout
    // Employé voit seulement ses tickets
    public function index(Request $request)
    {
        $user = auth('api')->user();

        $query = Ticket::with(['createdBy:id,nom,email', 'assignedTo:id,nom,email', 'commentaires.user:id,nom']);

        if ($user->role === 'employe') {
            $query->where('created_by', $user->id);
        }

        // Filtres optionnels
        if ($request->statut)   $query->where('statut',   $request->statut);
        if ($request->service)  $query->where('service',  $request->service);
        if ($request->priorite) $query->where('priorite', $request->priorite);
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('titre',       'like', "%{$request->search}%")
                  ->orWhere('service',   'like', "%{$request->search}%");
            });
        }

        $tickets = $query->orderBy('created_at', 'desc')->get();

        return response()->json($tickets);
    }

    // ── CREATE TICKET ─────────────────────────
    public function store(Request $request)
    {
        $request->validate([
            'titre'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'service'     => 'required|in:Informatique,RH,Logistique,Finance,Maintenance',
            'priorite'    => 'in:normal,urgent',
        ]);

        $ticket = Ticket::create([
            'titre'       => $request->titre,
            'description' => $request->description,
            'service'     => $request->service,
            'priorite'    => $request->priorite ?? 'normal',
            'statut'      => 'attente',
            'created_by'  => auth('api')->id(),
        ]);

        return response()->json($ticket->load('createdBy:id,nom'), 201);
    }

    // ── GET ONE TICKET ────────────────────────
    public function show($id)
    {
        $ticket = Ticket::with(['createdBy:id,nom,email', 'assignedTo:id,nom', 'commentaires.user:id,nom'])->findOrFail($id);
        return response()->json($ticket);
    }

    // ── UPDATE STATUT / PRIORITE ──────────────
    public function update(Request $request, $id)
    {
        $ticket = Ticket::findOrFail($id);

        $request->validate([
            'statut'      => 'sometimes|in:attente,cours,resolu',
            'priorite'    => 'sometimes|in:normal,urgent',
            'assigned_to' => 'sometimes|nullable|exists:users,id',
        ]);

        $ticket->update($request->only(['statut', 'priorite', 'assigned_to']));

        return response()->json($ticket->load(['createdBy:id,nom', 'assignedTo:id,nom']));
    }

    // ── DELETE TICKET (admin only) ────────────
    public function destroy($id)
    {
        $user = auth('api')->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Non autorisé.'], 403);
        }
        Ticket::findOrFail($id)->delete();
        return response()->json(['message' => 'Ticket supprimé.']);
    }

    // ── ADD COMMENTAIRE ───────────────────────
    public function addComment(Request $request, $id)
    {
        $request->validate(['contenu' => 'required|string']);

        $ticket = Ticket::findOrFail($id);

        $comment = Commentaire::create([
            'ticket_id' => $ticket->id,
            'user_id'   => auth('api')->id(),
            'contenu'   => $request->contenu,
        ]);

        return response()->json($comment->load('user:id,nom'), 201);
    }

    // ── STATS (admin + responsable) ───────────
    public function stats()
    {
        return response()->json([
            'total'        => Ticket::count(),
            'en_attente'   => Ticket::where('statut', 'attente')->count(),
            'en_cours'     => Ticket::where('statut', 'cours')->count(),
            'resolus'      => Ticket::where('statut', 'resolu')->count(),
            'urgents'      => Ticket::where('priorite', 'urgent')->count(),
            'par_service'  => Ticket::selectRaw('service, count(*) as total')
                                ->groupBy('service')->get(),
        ]);
    }
}
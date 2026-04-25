<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    // ── GET conversations (liste des users avec qui j'ai parlé) ──
    public function contacts()
    {
        $me = auth('api')->user();

        // Tous les users sauf moi
        $users = User::where('id', '!=', $me->id)->get();

        $contacts = $users->map(function ($user) use ($me) {
            // Dernier message entre moi et ce user
            $lastMsg = Message::where(function ($q) use ($me, $user) {
                $q->where('sender_id',   $me->id)->where('receiver_id', $user->id);
            })->orWhere(function ($q) use ($me, $user) {
                $q->where('sender_id',   $user->id)->where('receiver_id', $me->id);
            })->latest()->first();

            // Messages non lus
            $unread = Message::where('sender_id',   $user->id)
                             ->where('receiver_id', $me->id)
                             ->where('lu', false)
                             ->count();

            return [
                'id'       => $user->id,
                'nom'      => $user->nom,
                'email'    => $user->email,
                'role'     => $user->role,
                'unread'   => $unread,
                'last_msg' => $lastMsg ? [
                    'contenu'    => $lastMsg->contenu,
                    'sender_id'  => $lastMsg->sender_id,
                    'created_at' => $lastMsg->created_at->format('H:i'),
                ] : null,
            ];
        });

        return response()->json($contacts);
    }

    // ── GET messages entre moi et un user ────────────────────────
    public function conversation($userId)
    {
        $me = auth('api')->user();

        // Marquer comme lus
        Message::where('sender_id',   $userId)
               ->where('receiver_id', $me->id)
               ->where('lu', false)
               ->update(['lu' => true]);

        $messages = Message::where(function ($q) use ($me, $userId) {
            $q->where('sender_id',   $me->id)->where('receiver_id', $userId);
        })->orWhere(function ($q) use ($me, $userId) {
            $q->where('sender_id',   $userId)->where('receiver_id', $me->id);
        })->orderBy('created_at', 'asc')->get();

        return response()->json($messages->map(function ($msg) use ($me) {
            return [
                'id'             => $msg->id,
                'from'           => $msg->sender_id === $me->id ? 'me' : $msg->sender_id,
                'sender_id'      => $msg->sender_id,
                'contenu'        => $msg->contenu,
                'fichier_nom'    => $msg->fichier_nom,
                'fichier_taille' => $msg->fichier_taille,
                'lu'             => $msg->lu,
                'time'           => $msg->created_at->format('H:i'),
                'date'           => $this->formatDate($msg->created_at),
            ];
        }));
    }

    // ── SEND message ──────────────────────────────────────────────
    public function send(Request $request)
    {
        $request->validate([
            'receiver_id'    => 'required|exists:users,id',
            'contenu'        => 'required|string',
            'fichier_nom'    => 'nullable|string',
            'fichier_taille' => 'nullable|string',
        ]);

        $me = auth('api')->user();

        $message = Message::create([
            'sender_id'      => $me->id,
            'receiver_id'    => $request->receiver_id,
            'contenu'        => $request->contenu,
            'fichier_nom'    => $request->fichier_nom,
            'fichier_taille' => $request->fichier_taille,
            'lu'             => false,
        ]);

        return response()->json([
            'id'             => $message->id,
            'from'           => 'me',
            'sender_id'      => $message->sender_id,
            'contenu'        => $message->contenu,
            'fichier_nom'    => $message->fichier_nom,
            'fichier_taille' => $message->fichier_taille,
            'lu'             => false,
            'time'           => $message->created_at->format('H:i'),
            'date'           => 'Aujourd\'hui',
        ], 201);
    }

    // ── Unread count total ────────────────────────────────────────
    public function unreadCount()
    {
        $me = auth('api')->user();
        $count = Message::where('receiver_id', $me->id)->where('lu', false)->count();
        return response()->json(['count' => $count]);
    }

    // ── Helper date ───────────────────────────────────────────────
    private function formatDate($date)
    {
        $today     = now()->startOfDay();
        $yesterday = now()->subDay()->startOfDay();

        if ($date->startOfDay()->eq($today))     return "Aujourd'hui";
        if ($date->startOfDay()->eq($yesterday)) return "Hier";
        return $date->format('d/m/Y');
    }
}
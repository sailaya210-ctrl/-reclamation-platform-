<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Ticket;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── COMPTES PAR DÉFAUT ────────────────────
        $users = [
            ['nom' => 'Ahmed Ataki',      'email' => 'ahmed@bayan.ma',       'password' => Hash::make('admin123'), 'role' => 'admin'],
            ['nom' => 'Karim Alami',      'email' => 'karim@bayan.ma',       'password' => Hash::make('resp123'),  'role' => 'responsable'],
            ['nom' => 'Aya Saïl',         'email' => 'aya@bayan.ma',         'password' => Hash::make('resp123'),  'role' => 'responsable'],
            ['nom' => 'Zakaria Achraf',   'email' => 'zakaria@bayan.ma',     'password' => Hash::make('emp123'),   'role' => 'employe'],
            ['nom' => 'Sarah Lemarié',    'email' => 'sarah@bayan.ma',       'password' => Hash::make('emp123'),   'role' => 'employe'],
            ['nom' => 'Omar Almsaddek',   'email' => 'omar@bayan.ma',        'password' => Hash::make('emp123'),   'role' => 'employe'],
            ['nom' => 'Intervenant Test', 'email' => 'intervenant@bayan.ma', 'password' => Hash::make('inter123'), 'role' => 'intervenant'],
        ];

        foreach ($users as $u) {
            User::firstOrCreate(['email' => $u['email']], $u);
        }

        // ── TICKETS PAR DÉFAUT ────────────────────
        $zakaria = User::where('email', 'zakaria@bayan.ma')->first();
        $sarah   = User::where('email', 'sarah@bayan.ma')->first();
        $omar    = User::where('email', 'omar@bayan.ma')->first();
        $karim   = User::where('email', 'karim@bayan.ma')->first();

        $tickets = [
            ['titre' => 'Panne serveur principal', 'service' => 'Informatique', 'priorite' => 'urgent', 'statut' => 'cours',   'created_by' => $sarah->id,   'assigned_to' => $zakaria->id],
            ['titre' => 'Remboursement médical',   'service' => 'RH',           'priorite' => 'normal', 'statut' => 'attente', 'created_by' => $sarah->id,   'assigned_to' => null],
            ['titre' => 'Livraison manquante',     'service' => 'Logistique',   'priorite' => 'normal', 'statut' => 'resolu',  'created_by' => $omar->id,    'assigned_to' => $karim->id],
            ['titre' => 'Accès refusé CRM',        'service' => 'Informatique', 'priorite' => 'urgent', 'statut' => 'cours',   'created_by' => $zakaria->id, 'assigned_to' => $zakaria->id],
            ['titre' => 'Facture incorrecte',      'service' => 'Finance',      'priorite' => 'normal', 'statut' => 'attente', 'created_by' => $omar->id,    'assigned_to' => null],
            ['titre' => 'Climatisation en panne',  'service' => 'Maintenance',  'priorite' => 'normal', 'statut' => 'resolu',  'created_by' => $sarah->id,   'assigned_to' => $omar->id],
            ['titre' => 'Stock insuffisant',       'service' => 'Logistique',   'priorite' => 'urgent', 'statut' => 'cours',   'created_by' => $karim->id,   'assigned_to' => $karim->id],
            ['titre' => 'Badge accès refusé',      'service' => 'RH',           'priorite' => 'urgent', 'statut' => 'cours',   'created_by' => $zakaria->id, 'assigned_to' => null],
        ];

        foreach ($tickets as $t) {
            Ticket::create($t);
        }
    }
}
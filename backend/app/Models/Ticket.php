<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    protected $fillable = [
        'titre',
        'description',
        'service',
        'priorite',
        'statut',
        'created_by',
        'assigned_to',
    ];

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function commentaires()
    {
        return $this->hasMany(Commentaire::class);
    }
}
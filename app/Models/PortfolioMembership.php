<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioMembership extends Model
{
    protected $table = 'portfolio_memberships';
    protected $fillable = ['name', 'url', 'sort_order'];
}

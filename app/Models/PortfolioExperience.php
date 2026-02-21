<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioExperience extends Model
{
    protected $table = 'portfolio_experiences';
    protected $fillable = ['role', 'company', 'year_start', 'year_end', 'is_current', 'sort_order'];
    protected $casts = ['is_current' => 'boolean'];
}

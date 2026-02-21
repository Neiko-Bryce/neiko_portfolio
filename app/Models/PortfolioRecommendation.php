<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioRecommendation extends Model
{
    protected $table = 'portfolio_recommendations';
    protected $fillable = ['quote', 'author_name', 'author_role', 'sort_order'];
}

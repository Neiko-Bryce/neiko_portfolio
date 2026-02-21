<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioProfile extends Model
{
    protected $table = 'portfolio_profile';
    protected $fillable = [
        'name', 'headline', 'location', 'about',
        'avatar_url', 'email', 'schedule_call_url', 'blog_url',
    ];
}

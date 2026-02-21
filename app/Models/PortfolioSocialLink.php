<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioSocialLink extends Model
{
    protected $table = 'portfolio_social_links';
    protected $fillable = ['platform', 'url'];
}

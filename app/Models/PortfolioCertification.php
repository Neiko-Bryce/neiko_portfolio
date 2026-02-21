<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioCertification extends Model
{
    protected $table = 'portfolio_certifications';
    protected $fillable = ['name', 'issuer', 'sort_order'];
}

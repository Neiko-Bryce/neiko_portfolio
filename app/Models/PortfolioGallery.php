<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioGallery extends Model
{
    protected $table = 'portfolio_gallery';
    protected $fillable = ['image_path', 'caption', 'sort_order'];
}

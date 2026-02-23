<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioProject extends Model
{
    protected $table = 'portfolio_projects';
    protected $fillable = ['title', 'description', 'image', 'url', 'is_recent', 'sort_order'];
    protected $casts = ['is_recent' => 'boolean'];
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image ? \Illuminate\Support\Facades\Storage::url($this->image) : null;
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioProfile extends Model
{
    protected $table = 'portfolio_profile';
    protected $fillable = [
        'name', 'headline', 'location', 'about',
        'avatar_url', 'email', 'schedule_call_url', 'blog_url', 'company_url',
    ];
    protected $appends = ['avatar_url_full'];

    public function getAvatarUrlFullAttribute()
    {
        if (!$this->avatar_url) return null;
        return (str_starts_with($this->avatar_url, 'data:'))
            ? $this->avatar_url
            : \Illuminate\Support\Facades\Storage::url($this->avatar_url);
    }
}

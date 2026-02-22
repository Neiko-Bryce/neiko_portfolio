<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit()
    {
        $profile = PortfolioProfile::first();
        return Inertia::render('admin/profile', ['profile' => $profile]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'name'              => 'nullable|string|max:255',
            'headline'          => 'nullable|string|max:255',
            'location'          => 'nullable|string|max:255',
            'about'             => 'nullable|string',
            'email'             => 'nullable|email|max:255',
            'schedule_call_url' => 'nullable|url|max:255',
            'blog_url'          => 'nullable|url|max:255',
            'company_url'       => 'nullable|url|max:255',
            'avatar'            => 'nullable|image|max:2048',
        ]);

        $profile = PortfolioProfile::firstOrNew([]);

        if ($request->hasFile('avatar')) {
            if ($profile->avatar_url) {
                Storage::disk('public')->delete($profile->avatar_url);
            }
            $data['avatar_url'] = $request->file('avatar')->store('portfolio/avatar', 'public');
        }

        unset($data['avatar']);
        $profile->fill($data)->save();

        return redirect()->route('admin.profile')->with('success', 'Profile updated.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioSocialLink;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SocialLinkController extends Controller
{
    public function index()
    {
        $socialLinks = PortfolioSocialLink::all();
        return Inertia::render('admin/social-links', ['socialLinks' => $socialLinks]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'platform' => 'required|string|max:100',
            'url'      => 'required|url|max:255',
        ]);
        PortfolioSocialLink::create($data);
        return redirect()->route('admin.social-links')->with('success', 'Social link added.');
    }

    public function update(Request $request, PortfolioSocialLink $socialLink)
    {
        $data = $request->validate([
            'platform' => 'required|string|max:100',
            'url'      => 'required|url|max:255',
        ]);
        $socialLink->update($data);
        return redirect()->route('admin.social-links')->with('success', 'Social link updated.');
    }

    public function destroy(PortfolioSocialLink $socialLink)
    {
        $socialLink->delete();
        return redirect()->route('admin.social-links')->with('success', 'Social link deleted.');
    }
}

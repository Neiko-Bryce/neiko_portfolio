<?php

namespace App\Http\Controllers;

use App\Models\PortfolioCertification;
use App\Models\PortfolioExperience;
use App\Models\PortfolioGallery;
use App\Models\PortfolioMembership;
use App\Models\PortfolioProfile;
use App\Models\PortfolioProject;
use App\Models\PortfolioRecommendation;
use App\Models\PortfolioSkill;
use App\Models\PortfolioSocialLink;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index()
    {
        $profile = PortfolioProfile::first();
        $skills  = PortfolioSkill::orderBy('sort_order')->get()->groupBy('category');
        $projects = PortfolioProject::orderBy('sort_order')->get();
        $recentProjects = PortfolioProject::where('is_recent', true)->orderBy('sort_order')->take(4)->get();
        $experiences = PortfolioExperience::orderBy('sort_order')->get();
        $certifications = PortfolioCertification::orderBy('sort_order')->get();
        $recommendations = PortfolioRecommendation::orderBy('sort_order')->get();
        $gallery = PortfolioGallery::orderBy('sort_order')->get()->map(function ($item) {
            $item->image_url = (str_starts_with($item->image_path, 'data:'))
                ? $item->image_path
                : Storage::url($item->image_path);
            return $item;
        });
        $memberships = PortfolioMembership::orderBy('sort_order')->get();
        $socialLinks = PortfolioSocialLink::all();

        return Inertia::render('welcome', [
            'profile'         => $profile,
            'skills'          => $skills,
            'recentProjects'  => $recentProjects,
            'experiences'     => $experiences,
            'certifications'  => $certifications,
            'recommendations' => $recommendations,
            'gallery'         => $gallery,
            'memberships'     => $memberships,
            'socialLinks'     => $socialLinks,
        ]);
    }
}

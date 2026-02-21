<?php

use App\Http\Controllers\Admin\CertificationController;
use App\Http\Controllers\Admin\ExperienceController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\MembershipController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\RecommendationController;
use App\Http\Controllers\Admin\SkillController;
use App\Http\Controllers\Admin\SocialLinkController;
use App\Http\Controllers\PortfolioController;
use Illuminate\Support\Facades\Route;

// ── Public Portfolio ──────────────────────────────────────────────────────────
Route::get('/', [PortfolioController::class, 'index'])->name('home');

// ── Hidden Admin Entry-point ──────────────────────────────────────────────────
// Only reachable by typing /neikoport — no link exposed on the public site
Route::get('/neikoport', fn () => redirect('/login'))->name('secret.entry');

// ── Post-login redirect target ───────────────────────────────────────────────
Route::get('/dashboard', fn () => redirect()->route('admin.profile'))
    ->middleware('auth')
    ->name('dashboard');

// ── Admin Panel (auth required) ───────────────────────────────────────────────
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/', fn () => redirect()->route('admin.profile'));

    // Profile
    Route::get('profile', [ProfileController::class, 'edit'])->name('profile');
    Route::post('profile', [ProfileController::class, 'update'])->name('profile.update');

    // Skills
    Route::get('skills', [SkillController::class, 'index'])->name('skills');
    Route::post('skills', [SkillController::class, 'store'])->name('skills.store');
    Route::put('skills/{skill}', [SkillController::class, 'update'])->name('skills.update');
    Route::delete('skills/{skill}', [SkillController::class, 'destroy'])->name('skills.destroy');

    // Projects
    Route::get('projects', [ProjectController::class, 'index'])->name('projects');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::put('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    // Experience
    Route::get('experience', [ExperienceController::class, 'index'])->name('experience');
    Route::post('experience', [ExperienceController::class, 'store'])->name('experience.store');
    Route::put('experience/{experience}', [ExperienceController::class, 'update'])->name('experience.update');
    Route::delete('experience/{experience}', [ExperienceController::class, 'destroy'])->name('experience.destroy');

    // Certifications
    Route::get('certifications', [CertificationController::class, 'index'])->name('certifications');
    Route::post('certifications', [CertificationController::class, 'store'])->name('certifications.store');
    Route::put('certifications/{certification}', [CertificationController::class, 'update'])->name('certifications.update');
    Route::delete('certifications/{certification}', [CertificationController::class, 'destroy'])->name('certifications.destroy');

    // Recommendations
    Route::get('recommendations', [RecommendationController::class, 'index'])->name('recommendations');
    Route::post('recommendations', [RecommendationController::class, 'store'])->name('recommendations.store');
    Route::put('recommendations/{recommendation}', [RecommendationController::class, 'update'])->name('recommendations.update');
    Route::delete('recommendations/{recommendation}', [RecommendationController::class, 'destroy'])->name('recommendations.destroy');

    // Gallery
    Route::get('gallery', [GalleryController::class, 'index'])->name('gallery');
    Route::post('gallery', [GalleryController::class, 'store'])->name('gallery.store');
    Route::put('gallery/{gallery}', [GalleryController::class, 'update'])->name('gallery.update');
    Route::delete('gallery/{gallery}', [GalleryController::class, 'destroy'])->name('gallery.destroy');

    // Memberships
    Route::get('memberships', [MembershipController::class, 'index'])->name('memberships');
    Route::post('memberships', [MembershipController::class, 'store'])->name('memberships.store');
    Route::put('memberships/{membership}', [MembershipController::class, 'update'])->name('memberships.update');
    Route::delete('memberships/{membership}', [MembershipController::class, 'destroy'])->name('memberships.destroy');

    // Social Links
    Route::get('social-links', [SocialLinkController::class, 'index'])->name('social-links');
    Route::post('social-links', [SocialLinkController::class, 'store'])->name('social-links.store');
    Route::put('social-links/{socialLink}', [SocialLinkController::class, 'update'])->name('social-links.update');
    Route::delete('social-links/{socialLink}', [SocialLinkController::class, 'destroy'])->name('social-links.destroy');
});

require __DIR__ . '/settings.php';

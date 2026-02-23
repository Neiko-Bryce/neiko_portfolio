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
Route::get('/neikoport', fn () => redirect('/login-052205'))->name('secret.entry');

// ── Authentication ───────────────────────────────────────────────────────────
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\ConfirmablePasswordController;
use Laravel\Fortify\Http\Controllers\ConfirmedPasswordStatusController;
use Laravel\Fortify\Http\Controllers\ConfirmedTwoFactorAuthenticationController;
use Laravel\Fortify\Http\Controllers\EmailVerificationNotificationController;
use Laravel\Fortify\Http\Controllers\EmailVerificationPromptController;
use Laravel\Fortify\Http\Controllers\RecoveryCodeController;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\TwoFactorAuthenticationController;
use Laravel\Fortify\Http\Controllers\TwoFactorQrCodeController;
use Laravel\Fortify\Http\Controllers\TwoFactorSecretKeyController;
use Laravel\Fortify\Http\Controllers\VerifyEmailController;

Route::group(['middleware' => config('fortify.middleware', ['web'])], function () {
    $enableViews = config('fortify.views', true);

    // Authentication...
    if ($enableViews) {
        Route::get('/login-052205', [AuthenticatedSessionController::class, 'create'])
            ->middleware(['guest:'.config('fortify.guard')])
            ->name('login');
    }

    Route::post('/login-052205', [AuthenticatedSessionController::class, 'store'])
        ->middleware(array_filter([
            'guest:'.config('fortify.guard'),
            config('fortify.limiters.login') ? 'throttle:'.config('fortify.limiters.login') : null,
        ]))->name('login.store');

    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
        ->middleware([config('fortify.auth_middleware', 'auth').':'.config('fortify.guard')])
        ->name('logout');

    // Email Verification...
    Route::get('/email/verify', [EmailVerificationPromptController::class, '__invoke'])
        ->middleware([config('fortify.auth_middleware', 'auth').':'.config('fortify.guard')])
        ->name('verification.notice');

    Route::get('/email/verify/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
        ->middleware([config('fortify.auth_middleware', 'auth').':'.config('fortify.guard'), 'signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware([config('fortify.auth_middleware', 'auth').':'.config('fortify.guard'), 'throttle:6,1'])
        ->name('verification.send');

    // Password Confirmation...
    if ($enableViews) {
        Route::get('/user/confirm-password', [ConfirmablePasswordController::class, 'show'])
            ->middleware([config('fortify.auth_middleware', 'auth').':'.config('fortify.guard')])
            ->name('password.confirm');
    }

    Route::get('/user/confirmed-password-status', [ConfirmedPasswordStatusController::class, 'show'])
        ->middleware([config('fortify.auth_middleware', 'auth').':'.config('fortify.guard')])
        ->name('password.confirmation');

    Route::post('/user/confirm-password', [ConfirmablePasswordController::class, 'store'])
        ->middleware([config('fortify.auth_middleware', 'auth').':'.config('fortify.guard')])
        ->name('password.confirm.store');

    // Two Factor Authentication...
    if ($enableViews) {
        Route::get('/two-factor-challenge', [TwoFactorAuthenticatedSessionController::class, 'create'])
            ->middleware(['guest:'.config('fortify.guard')])
            ->name('two-factor.login');
    }

    Route::post('/two-factor-challenge', [TwoFactorAuthenticatedSessionController::class, 'store'])
        ->middleware(array_filter([
            'guest:'.config('fortify.guard'),
            config('fortify.limiters.two-factor') ? 'throttle:'.config('fortify.limiters.two-factor') : null,
        ]))->name('two-factor.login.store');

    $twoFactorMiddleware = [config('fortify.auth_middleware', 'auth').':'.config('fortify.guard'), 'password.confirm'];

    Route::post('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'store'])
        ->middleware($twoFactorMiddleware)
        ->name('two-factor.enable');

    Route::post('/user/confirmed-two-factor-authentication', [ConfirmedTwoFactorAuthenticationController::class, 'store'])
        ->middleware($twoFactorMiddleware)
        ->name('two-factor.confirm');

    Route::delete('/user/two-factor-authentication', [TwoFactorAuthenticationController::class, 'destroy'])
        ->middleware($twoFactorMiddleware)
        ->name('two-factor.disable');

    Route::get('/user/two-factor-qr-code', [TwoFactorQrCodeController::class, 'show'])
        ->middleware($twoFactorMiddleware)
        ->name('two-factor.qr-code');

    Route::get('/user/two-factor-secret-key', [TwoFactorSecretKeyController::class, 'show'])
        ->middleware($twoFactorMiddleware)
        ->name('two-factor.secret-key');

    Route::get('/user/two-factor-recovery-codes', [RecoveryCodeController::class, 'index'])
        ->middleware($twoFactorMiddleware)
        ->name('two-factor.recovery-codes');

    Route::post('/user/two-factor-recovery-codes', [RecoveryCodeController::class, 'store'])
        ->middleware($twoFactorMiddleware)
        ->name('two-factor.regenerate-recovery-codes');
});

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

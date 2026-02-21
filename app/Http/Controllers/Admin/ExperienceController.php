<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioExperience;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExperienceController extends Controller
{
    public function index()
    {
        $experiences = PortfolioExperience::orderBy('sort_order')->get();
        return Inertia::render('admin/experience', ['experiences' => $experiences]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'role'       => 'required|string|max:255',
            'company'    => 'required|string|max:255',
            'year_start' => 'nullable|string|max:10',
            'year_end'   => 'nullable|string|max:10',
            'is_current' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);
        PortfolioExperience::create($data);
        return redirect()->route('admin.experience')->with('success', 'Experience added.');
    }

    public function update(Request $request, PortfolioExperience $experience)
    {
        $data = $request->validate([
            'role'       => 'required|string|max:255',
            'company'    => 'required|string|max:255',
            'year_start' => 'nullable|string|max:10',
            'year_end'   => 'nullable|string|max:10',
            'is_current' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);
        $experience->update($data);
        return redirect()->route('admin.experience')->with('success', 'Experience updated.');
    }

    public function destroy(PortfolioExperience $experience)
    {
        $experience->delete();
        return redirect()->route('admin.experience')->with('success', 'Experience deleted.');
    }
}

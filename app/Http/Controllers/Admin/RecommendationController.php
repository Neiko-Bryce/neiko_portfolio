<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioRecommendation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecommendationController extends Controller
{
    public function index()
    {
        $recommendations = PortfolioRecommendation::orderBy('sort_order')->get();
        return Inertia::render('admin/recommendations', ['recommendations' => $recommendations]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'quote'       => 'required|string',
            'author_name' => 'required|string|max:255',
            'author_role' => 'nullable|string|max:255',
            'sort_order'  => 'nullable|integer',
        ]);
        PortfolioRecommendation::create($data);
        return redirect()->route('admin.recommendations')->with('success', 'Recommendation added.');
    }

    public function update(Request $request, PortfolioRecommendation $recommendation)
    {
        $data = $request->validate([
            'quote'       => 'required|string',
            'author_name' => 'required|string|max:255',
            'author_role' => 'nullable|string|max:255',
            'sort_order'  => 'nullable|integer',
        ]);
        $recommendation->update($data);
        return redirect()->route('admin.recommendations')->with('success', 'Recommendation updated.');
    }

    public function destroy(PortfolioRecommendation $recommendation)
    {
        $recommendation->delete();
        return redirect()->route('admin.recommendations')->with('success', 'Recommendation deleted.');
    }
}

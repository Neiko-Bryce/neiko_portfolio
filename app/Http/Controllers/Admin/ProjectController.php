<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioProject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = PortfolioProject::orderBy('sort_order')->get();
        return Inertia::render('admin/projects', ['projects' => $projects]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'url'         => 'nullable|url|max:255',
            'is_recent'   => 'boolean',
            'sort_order'  => 'nullable|integer',
        ]);
        PortfolioProject::create($data);
        return redirect()->route('admin.projects')->with('success', 'Project added.');
    }

    public function update(Request $request, PortfolioProject $project)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'url'         => 'nullable|url|max:255',
            'is_recent'   => 'boolean',
            'sort_order'  => 'nullable|integer',
        ]);
        $project->update($data);
        return redirect()->route('admin.projects')->with('success', 'Project updated.');
    }

    public function destroy(PortfolioProject $project)
    {
        $project->delete();
        return redirect()->route('admin.projects')->with('success', 'Project deleted.');
    }
}

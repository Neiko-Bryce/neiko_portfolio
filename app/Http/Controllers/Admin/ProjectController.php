<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioProject;
use Illuminate\Http\Request;
use Inertia\Inertia;

use Illuminate\Support\Facades\Storage;

use App\Traits\CompressibleBase64;

class ProjectController extends Controller
{
    use CompressibleBase64;
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
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'url'         => 'nullable|url|max:255',
            'is_recent'   => 'boolean',
            'sort_order'  => 'nullable|integer',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $this->imageToBase64($request->file('image'));
        }

        PortfolioProject::create($data);
        return redirect()->route('admin.projects')->with('success', 'Project added.');
    }

    public function update(Request $request, PortfolioProject $project)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'url'         => 'nullable|url|max:255',
            'is_recent'   => 'boolean',
            'sort_order'  => 'nullable|integer',
        ]);

        if ($request->hasFile('image')) {
            if ($project->image && !str_starts_with($project->image, 'data:')) {
                Storage::disk('public')->delete($project->image);
            }
            $data['image'] = $this->imageToBase64($request->file('image'));
        }

        $project->update($data);
        return redirect()->route('admin.projects')->with('success', 'Project updated.');
    }

    public function destroy(PortfolioProject $project)
    {
        if ($project->image && !str_starts_with($project->image, 'data:')) {
            Storage::disk('public')->delete($project->image);
        }
        $project->delete();
        return redirect()->route('admin.projects')->with('success', 'Project deleted.');
    }
}

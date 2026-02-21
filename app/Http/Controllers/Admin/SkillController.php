<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioSkill;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SkillController extends Controller
{
    public function index()
    {
        $skills = PortfolioSkill::orderBy('sort_order')->orderBy('category')->get();
        return Inertia::render('admin/skills', ['skills' => $skills]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'category'   => 'required|string|max:100',
            'name'       => 'required|string|max:100',
            'sort_order' => 'nullable|integer',
        ]);
        PortfolioSkill::create($data);
        return redirect()->route('admin.skills')->with('success', 'Skill added.');
    }

    public function update(Request $request, PortfolioSkill $skill)
    {
        $data = $request->validate([
            'category'   => 'required|string|max:100',
            'name'       => 'required|string|max:100',
            'sort_order' => 'nullable|integer',
        ]);
        $skill->update($data);
        return redirect()->route('admin.skills')->with('success', 'Skill updated.');
    }

    public function destroy(PortfolioSkill $skill)
    {
        $skill->delete();
        return redirect()->route('admin.skills')->with('success', 'Skill deleted.');
    }
}

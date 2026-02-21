<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioMembership;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MembershipController extends Controller
{
    public function index()
    {
        $memberships = PortfolioMembership::orderBy('sort_order')->get();
        return Inertia::render('admin/memberships', ['memberships' => $memberships]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'url'        => 'nullable|url|max:255',
            'sort_order' => 'nullable|integer',
        ]);
        PortfolioMembership::create($data);
        return redirect()->route('admin.memberships')->with('success', 'Membership added.');
    }

    public function update(Request $request, PortfolioMembership $membership)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'url'        => 'nullable|url|max:255',
            'sort_order' => 'nullable|integer',
        ]);
        $membership->update($data);
        return redirect()->route('admin.memberships')->with('success', 'Membership updated.');
    }

    public function destroy(PortfolioMembership $membership)
    {
        $membership->delete();
        return redirect()->route('admin.memberships')->with('success', 'Membership deleted.');
    }
}

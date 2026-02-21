<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioCertification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CertificationController extends Controller
{
    public function index()
    {
        $certifications = PortfolioCertification::orderBy('sort_order')->get();
        return Inertia::render('admin/certifications', ['certifications' => $certifications]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'issuer'     => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);
        PortfolioCertification::create($data);
        return redirect()->route('admin.certifications')->with('success', 'Certification added.');
    }

    public function update(Request $request, PortfolioCertification $certification)
    {
        $data = $request->validate([
            'name'       => 'required|string|max:255',
            'issuer'     => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);
        $certification->update($data);
        return redirect()->route('admin.certifications')->with('success', 'Certification updated.');
    }

    public function destroy(PortfolioCertification $certification)
    {
        $certification->delete();
        return redirect()->route('admin.certifications')->with('success', 'Certification deleted.');
    }
}

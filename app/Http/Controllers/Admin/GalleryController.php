<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioGallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GalleryController extends Controller
{
    public function index()
    {
        $gallery = PortfolioGallery::orderBy('sort_order')->get()->map(function ($item) {
            $item->image_url = Storage::url($item->image_path);
            return $item;
        });
        return Inertia::render('admin/gallery', ['gallery' => $gallery]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image'      => 'required|image|max:4096',
            'caption'    => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);

        $path = $request->file('image')->store('portfolio/gallery', 'public');

        PortfolioGallery::create([
            'image_path' => $path,
            'caption'    => $request->caption,
            'sort_order' => $request->sort_order ?? 0,
        ]);

        return redirect()->route('admin.gallery')->with('success', 'Photo uploaded.');
    }

    public function update(Request $request, PortfolioGallery $gallery)
    {
        $data = $request->validate([
            'caption'    => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer',
        ]);
        $gallery->update($data);
        return redirect()->route('admin.gallery')->with('success', 'Photo updated.');
    }

    public function destroy(PortfolioGallery $gallery)
    {
        Storage::disk('public')->delete($gallery->image_path);
        $gallery->delete();
        return redirect()->route('admin.gallery')->with('success', 'Photo deleted.');
    }
}

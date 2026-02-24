<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PortfolioGallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Traits\CompressibleBase64;
use Inertia\Inertia;

class GalleryController extends Controller
{
    use CompressibleBase64;
    public function index()
    {
        $gallery = PortfolioGallery::orderBy('sort_order')->get()->map(function ($item) {
            // Already includes base64 or fallback to Storage::url
            $item->image_url = (str_starts_with($item->image_path, 'data:'))
                ? $item->image_path
                : Storage::url($item->image_path);
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

        $image = $request->file('image');
        $base64 = $this->imageToBase64($image);

        PortfolioGallery::create([
            'image_path' => $base64,
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
        if (!str_starts_with($gallery->image_path, 'data:')) {
            Storage::disk('public')->delete($gallery->image_path);
        }
        $gallery->delete();
        return redirect()->route('admin.gallery')->with('success', 'Photo deleted.');
    }
}

import { useForm, router } from '@inertiajs/react';
import { Check, Loader2, Pencil, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/AdminLayout';

interface GalleryItem { id: number; image_url: string; caption: string | null; sort_order: number }

export default function AdminGallery({ gallery }: { gallery: GalleryItem[] }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [editId, setEditId] = useState<number | null>(null);

    const addForm = useForm({ image: null as File | null, caption: '', sort_order: 0 });
    const editForm = useForm({ caption: '', sort_order: 0 });

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        addForm.setData('image', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => setPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const startEdit = (g: GalleryItem) => {
        setEditId(g.id);
        editForm.setData({ caption: g.caption ?? '', sort_order: g.sort_order });
    };

    return (
        <AdminLayout title="Gallery">
            <div className="max-w-4xl space-y-6">
                {/* Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Photo</CardTitle>
                        <CardDescription>Photos appear in the gallery strip on your public portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={e => { e.preventDefault(); addForm.post('/admin/gallery', { forceFormData: true, onSuccess: () => { addForm.reset(); setPreview(null); } }); }}
                            className="space-y-4">
                            {/* Drop zone / preview */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="cursor-pointer rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/30 transition-colors flex flex-col items-center justify-center gap-3 p-8"
                            >
                                {preview ? (
                                    <img src={preview} alt="preview" className="max-h-48 rounded-lg object-contain" />
                                ) : (
                                    <>
                                        <div className="rounded-full bg-muted p-4">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium">Click to upload a photo</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">JPG, PNG or WebP, max 4MB</p>
                                        </div>
                                    </>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                            {addForm.errors.image && <p className="text-xs text-destructive">{addForm.errors.image}</p>}
                            <div className="flex flex-wrap gap-3 items-end">
                                <div className="space-y-1.5 flex-1 min-w-[200px]">
                                    <Label>Caption (optional)</Label>
                                    <Input value={addForm.data.caption} onChange={e => addForm.setData('caption', e.target.value)} placeholder="Photo caption..." />
                                </div>
                                <div className="space-y-1.5 w-20">
                                    <Label>Order</Label>
                                    <Input type="number" value={addForm.data.sort_order} onChange={e => addForm.setData('sort_order', +e.target.value)} />
                                </div>
                                <Button type="submit" disabled={addForm.processing || !addForm.data.image}>
                                    {addForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                    Upload
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Gallery grid */}
                <Card>
                    <CardHeader>
                        <CardTitle>Gallery</CardTitle>
                        <CardDescription>{gallery.length} photo{gallery.length !== 1 ? 's' : ''}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {gallery.length === 0 ? (
                            <p className="py-10 text-center text-sm text-muted-foreground">No photos uploaded yet.</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                                {gallery.map(g => (
                                    <div key={g.id} className="group relative rounded-xl overflow-hidden border border-border bg-muted aspect-square">
                                        <img src={g.image_url} alt={g.caption ?? ''} className="h-full w-full object-cover" />
                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1">
                                            {editId === g.id ? (
                                                <form onSubmit={e => { e.preventDefault(); editForm.put(`/admin/gallery/${g.id}`, { onSuccess: () => setEditId(null) }); }}>
                                                    <Input
                                                        value={editForm.data.caption}
                                                        onChange={e => editForm.setData('caption', e.target.value)}
                                                        placeholder="Caption..."
                                                        className="h-7 text-xs bg-white/10 border-white/30 text-white placeholder:text-white/60"
                                                    />
                                                    <div className="flex gap-1 mt-1">
                                                        <Button type="submit" size="sm" className="h-6 flex-1 text-xs"><Check className="h-3 w-3" /></Button>
                                                        <Button type="button" variant="outline" size="sm" className="h-6 flex-1 text-xs bg-transparent border-white/30 text-white hover:bg-white/10" onClick={() => setEditId(null)}>
                                                            <X className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </form>
                                            ) : (
                                                <>
                                                    {g.caption && <p className="text-xs text-white/90 line-clamp-2">{g.caption}</p>}
                                                    <div className="flex gap-1">
                                                        <Button type="button" variant="outline" size="sm" className="h-6 flex-1 text-xs bg-transparent border-white/30 text-white hover:bg-white/10"
                                                            onClick={() => startEdit(g)}>
                                                            <Pencil className="h-3 w-3" />
                                                        </Button>
                                                        <Button type="button" variant="outline" size="sm" className="h-6 flex-1 text-xs bg-transparent border-white/30 text-white hover:bg-red-500/60"
                                                            onClick={() => router.delete(`/admin/gallery/${g.id}`)}>
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

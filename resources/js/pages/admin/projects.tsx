import { useForm, router } from '@inertiajs/react';
import { Check, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/AdminLayout';

interface Project { id: number; title: string; description: string | null; image: string | null; url: string | null; is_recent: boolean; sort_order: number }

const blank = () => ({ title: '', description: '', image: null as File | null, url: '', is_recent: true, sort_order: 0 });

interface ProjectFormData { title: string; description: string; image: File | null; url: string; is_recent: boolean; sort_order: number }

function ProjectForm({
    form, submitLabel, onCancel,
    onSubmit, currentImage
}: {
    form: {
        data: ProjectFormData;
        setData: (k: keyof ProjectFormData, v: ProjectFormData[keyof ProjectFormData]) => void;
        processing: boolean;
        errors: Partial<Record<keyof ProjectFormData, string>>;
    };
    submitLabel: string;
    onCancel?: () => void;
    onSubmit: (e: React.FormEvent) => void;
    currentImage?: string | null;
}) {
    const [preview, setPreview] = useState<string | null>(currentImage ? `/storage/${currentImage}` : null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        form.setData('image', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(currentImage ? `/storage/${currentImage}` : null);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label>Title *</Label>
                    <Input value={form.data.title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('title', e.target.value)} required placeholder="My Awesome Project" />
                    {form.errors.title && <p className="text-xs text-destructive">{form.errors.title}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label>URL</Label>
                    <Input type="url" value={form.data.url} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('url', e.target.value)} placeholder="https://github.com/..." />
                    {form.errors.url && <p className="text-xs text-destructive">{form.errors.url}</p>}
                </div>
            </div>

            <div className="space-y-1.5">
                <Label>Description</Label>
                <textarea
                    value={form.data.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => form.setData('description', e.target.value)}
                    rows={2}
                    placeholder="What does this project do?"
                    className="border-input placeholder:text-muted-foreground flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-y"
                />
            </div>

            <div className="space-y-1.5">
                <Label>Project Image</Label>
                <div className="flex items-start gap-4">
                    {preview && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => { form.setData('image', null); setPreview(null); }}
                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    <div className="flex-1">
                        <Input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="text-xs"
                        />
                        <p className="text-[10px] text-muted-foreground mt-1">Recommended: 1200x630px. Max 2MB.</p>
                        {form.errors.image && <p className="text-xs text-destructive">{form.errors.image}</p>}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id={`recent-${form.data.title}`}
                        checked={form.data.is_recent}
                        onCheckedChange={(v: boolean) => form.setData('is_recent', v)}
                    />
                    <Label htmlFor={`recent-${form.data.title}`} className="cursor-pointer">Show as Recent Project</Label>
                </div>
                <div className="flex items-center gap-2">
                    <Label className="text-muted-foreground">Order</Label>
                    <Input type="number" value={form.data.sort_order} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('sort_order', +e.target.value)} className="w-20" />
                </div>
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={form.processing}>
                    {form.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {submitLabel}
                </Button>
                {onCancel && <Button type="button" variant="ghost" onClick={onCancel}><X className="h-4 w-4" /> Cancel</Button>}
            </div>
        </form>
    );
}

export default function AdminProjects({ projects }: { projects: Project[] }) {
    const [editId, setEditId] = useState<number | null>(null);
    const addForm = useForm(blank());
    const editForm = useForm(blank());

    const startEdit = (p: Project) => {
        setEditId(p.id);
        editForm.setData({
            title: p.title,
            description: p.description ?? '',
            image: null,
            url: p.url ?? '',
            is_recent: p.is_recent,
            sort_order: p.sort_order
        });
    };

    return (
        <AdminLayout title="Projects">
            <div className="max-w-3xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Project</CardTitle>
                        <CardDescription>Projects marked "Recent" appear in the spotlight on your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProjectForm form={addForm} submitLabel="Add Project"
                            onSubmit={e => { e.preventDefault(); addForm.post('/admin/projects', { onSuccess: () => addForm.reset() }); }} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>All Projects</CardTitle>
                        <CardDescription>{projects.length} project{projects.length !== 1 ? 's' : ''}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {projects.length === 0 ? (
                            <p className="px-6 py-10 text-center text-sm text-muted-foreground">No projects added yet.</p>
                        ) : (
                            <div className="divide-y">
                                {projects.map(p => (
                                    <div key={p.id} className="px-6 py-5">
                                        {editId === p.id ? (
                                            <ProjectForm
                                                form={editForm}
                                                submitLabel="Save"
                                                onCancel={() => setEditId(null)}
                                                currentImage={p.image}
                                                onSubmit={e => {
                                                    e.preventDefault();
                                                    // Use post with _method: 'put' for file upload compatibility
                                                    editForm.transform((data) => ({
                                                        ...data,
                                                        _method: 'put',
                                                    }));
                                                    editForm.post(`/admin/projects/${p.id}`, {
                                                        forceFormData: true,
                                                        onSuccess: () => setEditId(null)
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex gap-4 flex-1 min-w-0">
                                                    {p.image && (
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden border flex-shrink-0">
                                                            <img src={`/storage/${p.image}`} alt={p.title} className="w-full h-full object-cover" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-medium text-sm">{p.title}</span>
                                                            {p.is_recent && (
                                                                <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-md">Recent</span>
                                                            )}
                                                        </div>
                                                        {p.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{p.description}</p>}
                                                        {p.url && <p className="text-xs font-mono text-muted-foreground mt-1 truncate">{p.url}</p>}
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 flex-shrink-0">
                                                    <Button variant="ghost" size="icon" onClick={() => startEdit(p)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => router.delete(`/admin/projects/${p.id}`)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
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

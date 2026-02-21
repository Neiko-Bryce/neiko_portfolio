import { useForm, router } from '@inertiajs/react';
import { Check, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/AdminLayout';

interface Rec { id: number; quote: string; author_name: string; author_role: string | null; sort_order: number }
const blank = () => ({ quote: '', author_name: '', author_role: '', sort_order: 0 });

export default function AdminRecommendations({ recommendations }: { recommendations: Rec[] }) {
    const [editId, setEditId] = useState<number | null>(null);
    const addForm = useForm(blank());
    const editForm = useForm(blank());

    const startEdit = (r: Rec) => {
        setEditId(r.id);
        editForm.setData({ quote: r.quote, author_name: r.author_name, author_role: r.author_role ?? '', sort_order: r.sort_order });
    };

    return (
        <AdminLayout title="Recommendations">
            <div className="max-w-3xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Recommendation</CardTitle>
                        <CardDescription>Testimonials from colleagues, clients, or managers — displayed as a carousel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={e => { e.preventDefault(); addForm.post('/admin/recommendations', { onSuccess: () => addForm.reset() }); }}
                            className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Quote *</Label>
                                <textarea
                                    value={addForm.data.quote}
                                    onChange={e => addForm.setData('quote', e.target.value)}
                                    required rows={3}
                                    placeholder="Working with Neiko was an absolute pleasure…"
                                    className="border-input placeholder:text-muted-foreground flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-y"
                                />
                                {addForm.errors.quote && <p className="text-xs text-destructive">{addForm.errors.quote}</p>}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="space-y-1.5 flex-1 min-w-[150px]">
                                    <Label>Author Name *</Label>
                                    <Input value={addForm.data.author_name} onChange={e => addForm.setData('author_name', e.target.value)} required placeholder="Jane Smith" />
                                    {addForm.errors.author_name && <p className="text-xs text-destructive">{addForm.errors.author_name}</p>}
                                </div>
                                <div className="space-y-1.5 flex-1 min-w-[150px]">
                                    <Label>Author Role</Label>
                                    <Input value={addForm.data.author_role} onChange={e => addForm.setData('author_role', e.target.value)} placeholder="CTO at Acme" />
                                </div>
                                <div className="space-y-1.5 w-20">
                                    <Label>Order</Label>
                                    <Input type="number" value={addForm.data.sort_order} onChange={e => addForm.setData('sort_order', +e.target.value)} />
                                </div>
                            </div>
                            <Button type="submit" disabled={addForm.processing}>
                                {addForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                Add Recommendation
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>All Recommendations</CardTitle>
                        <CardDescription>{recommendations.length} testimonial{recommendations.length !== 1 ? 's' : ''}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {recommendations.length === 0 ? (
                            <p className="px-6 py-10 text-center text-sm text-muted-foreground">No recommendations yet.</p>
                        ) : (
                            <div className="divide-y">
                                {recommendations.map(r => (
                                    <div key={r.id} className="px-6 py-5">
                                        {editId === r.id ? (
                                            <form onSubmit={e => { e.preventDefault(); editForm.put(`/admin/recommendations/${r.id}`, { onSuccess: () => setEditId(null) }); }}
                                                className="space-y-3">
                                                <textarea
                                                    value={editForm.data.quote}
                                                    onChange={e => editForm.setData('quote', e.target.value)}
                                                    rows={3}
                                                    className="border-input flex w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-y"
                                                />
                                                <div className="flex flex-wrap gap-3">
                                                    <Input value={editForm.data.author_name} onChange={e => editForm.setData('author_name', e.target.value)} placeholder="Author" className="flex-1" />
                                                    <Input value={editForm.data.author_role} onChange={e => editForm.setData('author_role', e.target.value)} placeholder="Role" className="flex-1" />
                                                    <Input type="number" value={editForm.data.sort_order} onChange={e => editForm.setData('sort_order', +e.target.value)} className="w-20" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button type="submit" size="sm"><Check className="h-4 w-4" /> Save</Button>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm italic text-muted-foreground line-clamp-3">"{r.quote}"</p>
                                                    <p className="mt-2 text-sm font-medium">{r.author_name}
                                                        {r.author_role && <span className="text-muted-foreground font-normal"> · {r.author_role}</span>}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1 flex-shrink-0">
                                                    <Button variant="ghost" size="icon" onClick={() => startEdit(r)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => router.delete(`/admin/recommendations/${r.id}`)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
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

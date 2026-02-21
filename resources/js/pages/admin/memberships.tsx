import { useForm, router } from '@inertiajs/react';
import { Check, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/AdminLayout';

interface Membership { id: number; name: string; url: string | null; sort_order: number }
const blank = () => ({ name: '', url: '', sort_order: 0 });

export default function AdminMemberships({ memberships }: { memberships: Membership[] }) {
    const [editId, setEditId] = useState<number | null>(null);
    const addForm = useForm(blank());
    const editForm = useForm(blank());

    const startEdit = (m: Membership) => {
        setEditId(m.id);
        editForm.setData({ name: m.name, url: m.url ?? '', sort_order: m.sort_order });
    };

    return (
        <AdminLayout title="Memberships">
            <div className="max-w-3xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Membership</CardTitle>
                        <CardDescription>Organizations, communities, or clubs you belong to</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={e => { e.preventDefault(); addForm.post('/admin/memberships', { onSuccess: () => addForm.reset() }); }}
                            className="flex flex-wrap gap-3 items-end">
                            <div className="space-y-1.5 flex-1 min-w-[180px]">
                                <Label>Organization Name *</Label>
                                <Input value={addForm.data.name} onChange={e => addForm.setData('name', e.target.value)} required placeholder="Filipino Web Developers" />
                                {addForm.errors.name && <p className="text-xs text-destructive">{addForm.errors.name}</p>}
                            </div>
                            <div className="space-y-1.5 flex-1 min-w-[180px]">
                                <Label>Website URL</Label>
                                <Input type="url" value={addForm.data.url} onChange={e => addForm.setData('url', e.target.value)} placeholder="https://..." />
                            </div>
                            <div className="space-y-1.5 w-20">
                                <Label>Order</Label>
                                <Input type="number" value={addForm.data.sort_order} onChange={e => addForm.setData('sort_order', +e.target.value)} />
                            </div>
                            <Button type="submit" disabled={addForm.processing}>
                                {addForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                Add
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>All Memberships</CardTitle>
                        <CardDescription>{memberships.length} membership{memberships.length !== 1 ? 's' : ''}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {memberships.length === 0 ? (
                            <p className="px-6 py-10 text-center text-sm text-muted-foreground">No memberships yet.</p>
                        ) : (
                            <div className="divide-y">
                                {memberships.map(m => (
                                    <div key={m.id} className="px-6 py-4">
                                        {editId === m.id ? (
                                            <form onSubmit={e => { e.preventDefault(); editForm.put(`/admin/memberships/${m.id}`, { onSuccess: () => setEditId(null) }); }}
                                                className="flex flex-wrap gap-3 items-center">
                                                <Input value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} required className="flex-1 min-w-[140px]" />
                                                <Input type="url" value={editForm.data.url} onChange={e => editForm.setData('url', e.target.value)} placeholder="https://..." className="flex-1 min-w-[180px]" />
                                                <Input type="number" value={editForm.data.sort_order} onChange={e => editForm.setData('sort_order', +e.target.value)} className="w-20" />
                                                <Button type="submit" size="sm"><Check className="h-4 w-4" /> Save</Button>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
                                            </form>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">{m.name}</p>
                                                    {m.url && <a href={m.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">{m.url}</a>}
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => startEdit(m)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => router.delete(`/admin/memberships/${m.id}`)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
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

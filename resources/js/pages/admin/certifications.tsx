import { useForm, router } from '@inertiajs/react';
import { Check, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/AdminLayout';

interface Cert { id: number; name: string; issuer: string | null; sort_order: number }
const blank = () => ({ name: '', issuer: '', sort_order: 0 });

export default function AdminCertifications({ certifications }: { certifications: Cert[] }) {
    const [editId, setEditId] = useState<number | null>(null);
    const addForm = useForm(blank());
    const editForm = useForm(blank());

    const startEdit = (c: Cert) => {
        setEditId(c.id);
        editForm.setData({ name: c.name, issuer: c.issuer ?? '', sort_order: c.sort_order });
    };

    return (
        <AdminLayout title="Certifications">
            <div className="max-w-3xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Certification</CardTitle>
                        <CardDescription>Awards, certificates, and credentials to feature on your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={e => { e.preventDefault(); addForm.post('/admin/certifications', { onSuccess: () => addForm.reset() }); }}
                            className="flex flex-wrap gap-3 items-end">
                            <div className="space-y-1.5 min-w-[200px] flex-1">
                                <Label>Certification Name *</Label>
                                <Input value={addForm.data.name} onChange={e => addForm.setData('name', e.target.value)} required placeholder="AWS Certified Developer" />
                                {addForm.errors.name && <p className="text-xs text-destructive">{addForm.errors.name}</p>}
                            </div>
                            <div className="space-y-1.5 min-w-[150px] flex-1">
                                <Label>Issuer</Label>
                                <Input value={addForm.data.issuer} onChange={e => addForm.setData('issuer', e.target.value)} placeholder="Amazon Web Services" />
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
                        <CardTitle>All Certifications</CardTitle>
                        <CardDescription>{certifications.length} certification{certifications.length !== 1 ? 's' : ''}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {certifications.length === 0 ? (
                            <p className="px-6 py-10 text-center text-sm text-muted-foreground">No certifications yet.</p>
                        ) : (
                            <div className="divide-y">
                                {certifications.map(c => (
                                    <div key={c.id} className="px-6 py-4">
                                        {editId === c.id ? (
                                            <form onSubmit={e => { e.preventDefault(); editForm.put(`/admin/certifications/${c.id}`, { onSuccess: () => setEditId(null) }); }}
                                                className="flex flex-wrap gap-3 items-end">
                                                <Input value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} required className="flex-1 min-w-[180px]" />
                                                <Input value={editForm.data.issuer} onChange={e => editForm.setData('issuer', e.target.value)} placeholder="Issuer" className="flex-1 min-w-[140px]" />
                                                <Input type="number" value={editForm.data.sort_order} onChange={e => editForm.setData('sort_order', +e.target.value)} className="w-20" />
                                                <Button type="submit" size="sm"><Check className="h-4 w-4" /> Save</Button>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
                                            </form>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">{c.name}</p>
                                                    {c.issuer && <p className="text-xs text-muted-foreground">{c.issuer}</p>}
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => startEdit(c)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => router.delete(`/admin/certifications/${c.id}`)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
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

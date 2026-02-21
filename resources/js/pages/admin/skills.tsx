import { useForm, router } from '@inertiajs/react';
import { Loader2, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select-native';
import AdminLayout from '@/layouts/AdminLayout';

interface Skill { id: number; category: string; name: string; sort_order: number }

const CATEGORIES = ['Frontend', 'Backend', 'DevOps & Cloud', 'Mobile', 'Database', 'Other'];

export default function AdminSkills({ skills }: { skills: Skill[] }) {
    const [editId, setEditId] = useState<number | null>(null);

    const addForm = useForm({ category: 'Frontend', name: '', sort_order: 0 });
    const editForm = useForm({ category: '', name: '', sort_order: 0 });

    const startEdit = (s: Skill) => {
        setEditId(s.id);
        editForm.setData({ category: s.category, name: s.name, sort_order: s.sort_order });
    };

    // Group skills by category for the list
    const grouped = CATEGORIES.reduce((acc, cat) => {
        const items = skills.filter(s => s.category === cat);
        if (items.length) acc[cat] = items;
        return acc;
    }, {} as Record<string, Skill[]>);
    const ungrouped = skills.filter(s => !CATEGORIES.includes(s.category));
    if (ungrouped.length) grouped['Other'] = [...(grouped['Other'] ?? []), ...ungrouped];

    return (
        <AdminLayout title="Skills">
            <div className="max-w-3xl space-y-6">
                {/* Add Skill */}
                <Card>
                    <CardHeader>
                        <CardTitle>Add Skill</CardTitle>
                        <CardDescription>Add a new technology or tool to your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={e => { e.preventDefault(); addForm.post('/admin/skills', { onSuccess: () => addForm.reset() }); }}
                            className="flex flex-wrap gap-3 items-end">
                            <div className="space-y-1.5">
                                <Label>Category</Label>
                                <Select
                                    value={addForm.data.category}
                                    onChange={e => addForm.setData('category', e.target.value)}
                                >
                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </Select>
                            </div>
                            <div className="space-y-1.5 min-w-[180px]">
                                <Label>Skill Name</Label>
                                <Input
                                    value={addForm.data.name}
                                    onChange={e => addForm.setData('name', e.target.value)}
                                    placeholder="e.g. React, Laravel"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5 w-20">
                                <Label>Order</Label>
                                <Input
                                    type="number"
                                    value={addForm.data.sort_order}
                                    onChange={e => addForm.setData('sort_order', +e.target.value)}
                                />
                            </div>
                            <Button type="submit" disabled={addForm.processing}>
                                {addForm.processing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                Add Skill
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Skills List */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Skills</CardTitle>
                        <CardDescription>{skills.length} skill{skills.length !== 1 ? 's' : ''} across {Object.keys(grouped).length} categor{Object.keys(grouped).length !== 1 ? 'ies' : 'y'}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {skills.length === 0 ? (
                            <p className="px-6 py-10 text-center text-sm text-muted-foreground">No skills added yet. Add your first skill above.</p>
                        ) : (
                            <div className="divide-y">
                                {skills.map(s => (
                                    <div key={s.id} className="px-6 py-4">
                                        {editId === s.id ? (
                                            <form onSubmit={e => {
                                                e.preventDefault();
                                                editForm.put(`/admin/skills/${s.id}`, { onSuccess: () => setEditId(null) });
                                            }} className="flex flex-wrap gap-3 items-end">
                                                <Select value={editForm.data.category} onChange={e => editForm.setData('category', e.target.value)}>
                                                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                                </Select>
                                                <Input value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} required className="w-44" />
                                                <Input type="number" value={editForm.data.sort_order} onChange={e => editForm.setData('sort_order', +e.target.value)} className="w-20" />
                                                <Button type="submit" size="sm" disabled={editForm.processing}>
                                                    <Check className="h-4 w-4" /> Save
                                                </Button>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => setEditId(null)}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </form>
                                        ) : (
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-md">{s.category}</span>
                                                    <span className="text-sm font-medium">{s.name}</span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => startEdit(s)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => router.delete(`/admin/skills/${s.id}`)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
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

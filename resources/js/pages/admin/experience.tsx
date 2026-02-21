import { useForm, router } from '@inertiajs/react';
import { Check, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/AdminLayout';

interface Experience { id: number; role: string; company: string; year_start: string | null; year_end: string | null; is_current: boolean; sort_order: number }

const blank = () => ({ role: '', company: '', year_start: '', year_end: '', is_current: false, sort_order: 0 });

interface ExperienceFormData { role: string; company: string; year_start: string; year_end: string; is_current: boolean; sort_order: number }
interface FormProps {
    form: { data: ExperienceFormData; setData: (k: keyof ExperienceFormData, v: ExperienceFormData[keyof ExperienceFormData]) => void; processing: boolean; errors: Partial<Record<keyof ExperienceFormData, string>> };
    submitLabel: string;
    onCancel?: () => void;
    onSubmit: (e: React.FormEvent) => void;
}

function ExperienceForm({ form, submitLabel, onCancel, onSubmit }: FormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <Label>Role / Position *</Label>
                    <Input value={form.data.role} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('role', e.target.value)} required placeholder="Software Engineer" />
                    {form.errors.role && <p className="text-xs text-destructive">{form.errors.role}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label>Company *</Label>
                    <Input value={form.data.company} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('company', e.target.value)} required placeholder="Acme Corp" />
                    {form.errors.company && <p className="text-xs text-destructive">{form.errors.company}</p>}
                </div>
                <div className="space-y-1.5">
                    <Label>Year Start</Label>
                    <Input value={form.data.year_start} onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('year_start', e.target.value)} placeholder="2022" />
                </div>
                <div className="space-y-1.5">
                    <Label>Year End</Label>
                    <Input
                        value={form.data.year_end}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setData('year_end', e.target.value)}
                        placeholder="2024"
                        disabled={form.data.is_current}
                    />
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Checkbox
                        id={`current-${submitLabel}`}
                        checked={form.data.is_current}
                        onCheckedChange={(v: boolean) => form.setData('is_current', v)}
                    />
                    <Label htmlFor={`current-${submitLabel}`} className="cursor-pointer">This is my current position</Label>
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

export default function AdminExperience({ experiences }: { experiences: Experience[] }) {
    const [editId, setEditId] = useState<number | null>(null);
    const addForm = useForm(blank());
    const editForm = useForm(blank());

    const startEdit = (ex: Experience) => {
        setEditId(ex.id);
        editForm.setData({ role: ex.role, company: ex.company, year_start: ex.year_start ?? '', year_end: ex.year_end ?? '', is_current: ex.is_current, sort_order: ex.sort_order });
    };

    return (
        <AdminLayout title="Experience">
            <div className="max-w-3xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Experience</CardTitle>
                        <CardDescription>Work history shown in the Experience timeline</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ExperienceForm form={addForm} submitLabel="Add Experience"
                            onSubmit={(e: React.FormEvent) => { e.preventDefault(); addForm.post('/admin/experience', { onSuccess: () => addForm.reset() }); }} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Work History</CardTitle>
                        <CardDescription>{experiences.length} position{experiences.length !== 1 ? 's' : ''}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {experiences.length === 0 ? (
                            <p className="px-6 py-10 text-center text-sm text-muted-foreground">No experience added yet.</p>
                        ) : (
                            <div className="divide-y">
                                {experiences.map(ex => (
                                    <div key={ex.id} className="px-6 py-5">
                                        {editId === ex.id ? (
                                            <ExperienceForm form={editForm} submitLabel="Save" onCancel={() => setEditId(null)}
                                                onSubmit={(e: React.FormEvent) => { e.preventDefault(); editForm.put(`/admin/experience/${ex.id}`, { onSuccess: () => setEditId(null) }); }} />
                                        ) : (
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3">
                                                    <div className={`mt-1 h-2.5 w-2.5 rounded-sm flex-shrink-0 ${ex.is_current ? 'bg-primary' : 'border border-border bg-muted'}`} />
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-medium text-sm">{ex.role}</span>
                                                            {ex.is_current && <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-md">Current</span>}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{ex.company}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                        {ex.year_start}{ex.is_current ? ' – Present' : ex.year_end ? ` – ${ex.year_end}` : ''}
                                                    </span>
                                                    <Button variant="ghost" size="icon" onClick={() => startEdit(ex)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => router.delete(`/admin/experience/${ex.id}`)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
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

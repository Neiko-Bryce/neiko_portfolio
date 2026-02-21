import { useForm, router } from '@inertiajs/react';
import {
    Check, ExternalLink, Loader2,
    Pencil, Trash2, X,
    Github, Twitter, Linkedin, Instagram, Facebook, Youtube, Globe,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select-native';
import AdminLayout from '@/layouts/AdminLayout';

interface SocialLink { id: number; platform: string; url: string }

const PLATFORMS = [
    'GitHub', 'LinkedIn', 'Twitter', 'Instagram', 'Facebook',
    'YouTube', 'DevTo', 'Medium', 'Behance', 'Dribbble', 'Portfolio', 'Other',
];

// Pick an icon per platform
const platformIcon = (p: string) => {
    const m: Record<string, React.ComponentType<{ className?: string }>> = {
        GitHub: Github, Twitter: Twitter, Linkedin: Linkedin,
        LinkedIn: Linkedin, Instagram: Instagram, Facebook: Facebook,
        Youtube: Youtube, YouTube: Youtube,
    };
    return m[p] ?? Globe;
};

const blank = () => ({ platform: 'GitHub', url: '' });

function PlatformSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <Select value={value} onChange={e => onChange(e.target.value)}>
            {PLATFORMS.map(p => <option key={p}>{p}</option>)}
        </Select>
    );
}

export default function AdminSocialLinks({ socialLinks }: { socialLinks: SocialLink[] }) {
    const [editId, setEditId] = useState<number | null>(null);
    const addForm = useForm(blank());
    const editForm = useForm(blank());

    const startEdit = (s: SocialLink) => {
        setEditId(s.id);
        editForm.setData({ platform: s.platform, url: s.url });
    };


    return (
        <AdminLayout title="Social Links">
            <div className="max-w-3xl space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Add Social Link</CardTitle>
                        <CardDescription>Social profiles and links shown on your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={e => { e.preventDefault(); addForm.post('/admin/social-links', { onSuccess: () => addForm.reset() }); }}
                            className="flex flex-wrap gap-3 items-end">
                            <div className="space-y-1.5">
                                <Label>Platform</Label>
                                <PlatformSelect value={addForm.data.platform} onChange={v => addForm.setData('platform', v)} />
                            </div>
                            <div className="space-y-1.5 flex-1 min-w-[220px]">
                                <Label>URL *</Label>
                                <Input type="url" value={addForm.data.url} onChange={e => addForm.setData('url', e.target.value)} required placeholder="https://github.com/username" />
                                {addForm.errors.url && <p className="text-xs text-destructive">{addForm.errors.url}</p>}
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
                        <CardTitle>All Social Links</CardTitle>
                        <CardDescription>{socialLinks.length} link{socialLinks.length !== 1 ? 's' : ''}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {socialLinks.length === 0 ? (
                            <p className="px-6 py-10 text-center text-sm text-muted-foreground">No social links yet.</p>
                        ) : (
                            <div className="divide-y">
                                {socialLinks.map(s => {
                                    const Icon = platformIcon(s.platform);
                                    return (
                                        <div key={s.id} className="px-6 py-4">
                                            {editId === s.id ? (
                                                <form onSubmit={e => { e.preventDefault(); editForm.put(`/admin/social-links/${s.id}`, { onSuccess: () => setEditId(null) }); }}
                                                    className="flex flex-wrap gap-3 items-center">
                                                    <PlatformSelect value={editForm.data.platform} onChange={v => editForm.setData('platform', v)} />
                                                    <Input type="url" value={editForm.data.url} onChange={e => editForm.setData('url', e.target.value)} required className="flex-1 min-w-[180px]" />
                                                    <Button type="submit" size="sm"><Check className="h-4 w-4" /> Save</Button>
                                                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
                                                </form>
                                            ) : (
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="flex-shrink-0 rounded-md bg-muted p-2">
                                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium">{s.platform}</p>
                                                            <p className="text-xs font-mono text-muted-foreground truncate">{s.url}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 flex-shrink-0">
                                                        <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                            <a href={s.url} target="_blank" rel="noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => startEdit(s)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" onClick={() => router.delete(`/admin/social-links/${s.id}`)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}

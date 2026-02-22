import { useForm } from '@inertiajs/react';
import { Camera, Loader2, Save, User } from 'lucide-react';
import { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/layouts/AdminLayout';

interface Profile {
    name: string | null; headline: string | null; location: string | null;
    about: string | null; avatar_url: string | null; email: string | null;
    schedule_call_url: string | null; blog_url: string | null; company_url: string | null;
}

export default function AdminProfile({ profile }: { profile: Profile | null }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: profile?.name ?? '',
        headline: profile?.headline ?? '',
        location: profile?.location ?? '',
        about: profile?.about ?? '',
        email: profile?.email ?? '',
        schedule_call_url: profile?.schedule_call_url ?? '',
        blog_url: profile?.blog_url ?? '',
        company_url: profile?.company_url ?? '',
        avatar: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('avatar', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/profile', { forceFormData: true });
    };

    // Current avatar source: new preview > saved avatar > null
    const avatarSrc = preview ?? (profile?.avatar_url ? `/storage/${profile.avatar_url}` : null);

    return (
        <AdminLayout title="Profile">
            <form onSubmit={submit} className="max-w-2xl space-y-6">

                {/* ── Avatar Card ── */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Photo</CardTitle>
                        <CardDescription>
                            This photo appears on your public portfolio. Click the avatar to change it.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-6">
                        <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            <Avatar className="h-24 w-24 ring-2 ring-border ring-offset-2">
                                <AvatarImage src={avatarSrc ?? undefined} alt={data.name} />
                                <AvatarFallback className="text-2xl font-semibold bg-muted">
                                    <User className="h-10 w-10 text-muted-foreground" />
                                </AvatarFallback>
                            </Avatar>
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="h-6 w-6 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                <Camera className="mr-1 h-4 w-4" />
                                {preview ? 'Change Photo' : 'Upload Photo'}
                            </Button>
                            {preview && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                                    Preview ready — save to apply
                                </p>
                            )}
                            {errors.avatar && <p className="text-xs text-destructive">{errors.avatar}</p>}
                            <p className="text-xs text-muted-foreground">JPG, PNG or WebP, max 2MB</p>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Basic Info Card ── */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Your public name, headline, and location</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Neiko Bryce Fantilaga"
                                />
                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={data.location}
                                    onChange={e => setData('location', e.target.value)}
                                    placeholder="Hinoba-an, Negros Occidental"
                                />
                                {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="headline">Headline</Label>
                            <Input
                                id="headline"
                                value={data.headline}
                                onChange={e => setData('headline', e.target.value)}
                                placeholder="Full Stack Developer & Open Source Enthusiast"
                            />
                            {errors.headline && <p className="text-xs text-destructive">{errors.headline}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* ── About Card ── */}
                <Card>
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                        <CardDescription>Bio that appears in your About section</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <textarea
                                id="about"
                                value={data.about}
                                onChange={e => setData('about', e.target.value)}
                                rows={6}
                                placeholder="Write a few sentences about yourself..."
                                className="border-input placeholder:text-muted-foreground flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] resize-y"
                            />
                            {errors.about && <p className="text-xs text-destructive">{errors.about}</p>}
                            {data.about && (
                                <p className="text-xs text-muted-foreground text-right">{data.about.length} characters</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ── Contact & Links Card ── */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact & Links</CardTitle>
                        <CardDescription>Email and external URLs shown on your portfolio</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label htmlFor="schedule_call_url">Schedule a Call URL</Label>
                            <Input
                                id="schedule_call_url"
                                type="url"
                                value={data.schedule_call_url}
                                onChange={e => setData('schedule_call_url', e.target.value)}
                                placeholder="https://calendly.com/yourname"
                            />
                            {errors.schedule_call_url && <p className="text-xs text-destructive">{errors.schedule_call_url}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="blog_url">Blog URL</Label>
                            <Input
                                id="blog_url"
                                type="url"
                                value={data.blog_url}
                                onChange={e => setData('blog_url', e.target.value)}
                                placeholder="https://yourblog.com"
                            />
                            {errors.blog_url && <p className="text-xs text-destructive">{errors.blog_url}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company_url">Start Your Digital Journey</Label>
                            <Input
                                id="company_url"
                                type="url"
                                value={data.company_url}
                                onChange={e => setData('company_url', e.target.value)}
                                placeholder="https://treebyte.vercel.app/"
                            />
                            {errors.company_url && <p className="text-xs text-destructive">{errors.company_url}</p>}
                        </div>
                    </CardContent>
                </Card>

                {/* ── Save ── */}
                <div className="flex justify-end">
                    <Button type="submit" disabled={processing} size="lg">
                        {processing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
                        ) : (
                            <><Save className="mr-2 h-4 w-4" /> Save Profile</>
                        )}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Penting: Memanggil getUser() akan memperbarui session dan refresh token secara otomatis
    // jika session sudah expired namun refresh token masih valid.
    // Ini membuat sesi login menjadi "permanen" selama refresh token belum expired atau di-revoke.
    const { data: { user } } = await supabase.auth.getUser()

    // Redirect logic
    const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register') ||
        request.nextUrl.pathname === '/';

    const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard');

    if (!user && isDashboardPage) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}

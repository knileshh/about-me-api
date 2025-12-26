import Link from "next/link";

const footerLinks = {
    product: [
        { name: "Features", href: "/" },
        { name: "Create Profile", href: "/builder" },
        { name: "API Docs", href: "/docs" },
        { name: "Pricing", href: "/pricing" },
    ],
    resources: [
        { name: "Blog", href: "/blog" },
        { name: "FAQ", href: "/faq" },
        { name: "Support", href: "/support" },
    ],
    legal: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
    ],
    social: [
        { name: "Twitter", href: "https://twitter.com/knileshh" },
        { name: "GitHub", href: "https://github.com/knileshh" },
        { name: "LinkedIn", href: "https://www.linkedin.com/in/knileshh" },
    ],
};

export function Footer() {
    return (
        <footer className="w-full border-t bg-muted/30">
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link href="/" className="font-bold text-xl">
                            About Me API
                        </Link>
                        <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                            Your identity, one API call away. Create a personal API endpoint
                            that AI tools and applications can use to understand you.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold mb-3">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold mb-3">Resources</h4>
                        <ul className="space-y-2">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold mb-3">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} About Me API. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        {footerLinks.social.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

import Link from "next/link";
import { Button } from "../ui/button";

export default function Landing() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to CLI Compass</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your go-to platform for discovering and sharing command-line expertise
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 mb-12">
        <div className="p-6 rounded-lg border bg-card">
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <ul className="space-y-3">
            <li>✨ Curated collection of command-line commands</li>
            <li>🔍 Easy-to-use search functionality</li>
            <li>🏷️ Organized by categories and tags</li>
            <li>👥 Community-driven knowledge sharing</li>
            <li>📝 Step-by-step process guides</li>
          </ul>
        </div>

        <div className="p-6 rounded-lg border bg-card">
          <h2 className="text-2xl font-semibold mb-4">Why Use CLI Compass?</h2>
          <ul className="space-y-3">
            <li>🚀 Speed up your development workflow</li>
            <li>📚 Learn from the community&apos;s experience</li>
            <li>💡 Share your knowledge with others</li>
            <li>🔐 Save and organize your favorite commands</li>
            <li>🌟 Contribute to a growing knowledge base</li>
          </ul>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Ready to Get Started?</h2>
        <div className="space-x-4">
          <Button asChild>
            <Link href="/public/command">Browse Commands</Link>
          </Button>
          <Button asChild>
            <Link href="/public/process">Browse Processes</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

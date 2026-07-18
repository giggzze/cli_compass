"use client";

import Link from "next/link";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "../ui/button";

function CtaButtons({ className }: { className?: string }) {
  return (
    <div className={className ?? "flex flex-wrap items-center justify-center gap-3"}>
      <Button asChild>
        <Link href="/public/command">Browse Commands</Link>
      </Button>
      <Button asChild variant="outline">
        <Link href="/public/process">Browse Processes</Link>
      </Button>
      <SignInButton mode="modal" afterSignInUrl="/private/command">
        <Button variant="secondary">Sign in</Button>
      </SignInButton>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      {/* Hero */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold">CLI Compass</h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Your command-line companion — discover, save, and share shell commands
          and multi-step process guides.
        </p>
        <CtaButtons />
      </div>

      {/* How it works */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-2xl font-semibold">How it works</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Step 1
            </p>
            <h3 className="mb-2 text-lg font-semibold">Browse</h3>
            <p className="text-muted-foreground">
              Explore public commands and process guides, searchable by category
              and tags.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Step 2
            </p>
            <h3 className="mb-2 text-lg font-semibold">Save &amp; template</h3>
            <p className="text-muted-foreground">
              Fill variables before you copy, star favorites, and keep private
              collections when signed in.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <p className="mb-2 text-sm font-medium text-muted-foreground">
              Step 3
            </p>
            <h3 className="mb-2 text-lg font-semibold">Share processes</h3>
            <p className="text-muted-foreground">
              Build multi-step guides for yourself, your team, or the community.
            </p>
          </div>
        </div>
      </section>

      {/* Feature: Commands */}
      <section className="mb-12 grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-2xl font-semibold">Commands</h2>
          <p className="text-muted-foreground">
            Searchable snippets with categories and tags. Browse what the
            community shares, or sign in to save private commands you use every
            day.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5 text-left shadow-sm">
          <div className="mb-1 flex items-center justify-between gap-2">
            <h3 className="font-semibold">Docker prune unused images</h3>
            <span className="rounded border px-2 py-0.5 text-xs text-muted-foreground">
              docker
            </span>
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            Remove dangling images older than a given window.
          </p>
          <pre className="overflow-x-auto rounded-md bg-neutral-100 px-3 py-2 font-mono text-sm">
            <code>{`docker image prune -a --filter "until={{hours}}h"`}</code>
          </pre>
        </div>
      </section>

      {/* Feature: Templates & favorites */}
      <section className="mb-12 grid items-center gap-8 md:grid-cols-2">
        <div className="order-2 rounded-lg border bg-card p-5 shadow-sm md:order-1">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Template fill
          </p>
          <div className="mb-3 space-y-2 text-sm">
            <div className="flex items-center justify-between gap-2 rounded border px-3 py-2">
              <span className="text-muted-foreground">hours</span>
              <span className="font-mono">24</span>
            </div>
          </div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">
            Ready to copy
          </p>
          <pre className="overflow-x-auto rounded-md bg-neutral-100 px-3 py-2 font-mono text-sm">
            <code>
              docker image prune -a --filter &quot;until=24h&quot;
            </code>
          </pre>
        </div>
        <div className="order-1 md:order-2">
          <h2 className="mb-3 text-2xl font-semibold">Templates &amp; favorites</h2>
          <p className="text-muted-foreground">
            Commands can include variables you fill in before copying. Star the
            ones you reuse so they stay one search away.
          </p>
        </div>
      </section>

      {/* Feature: Processes */}
      <section className="mb-16 grid items-center gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-3 text-2xl font-semibold">Processes</h2>
          <p className="text-muted-foreground">
            Multi-step guides with explanations and optional code at each step —
            ideal for onboarding, deploy checklists, and workflows you do not
            want to relearn from scratch.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5 shadow-sm">
          <h3 className="mb-4 font-semibold">Ship a hotfix</h3>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                1
              </span>
              <div>
                <p className="font-medium">Create a branch</p>
                <pre className="mt-1 overflow-x-auto rounded-md bg-neutral-100 px-2 py-1 font-mono text-xs">
                  <code>{`git checkout -b hotfix/{{ticket}}`}</code>
                </pre>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                2
              </span>
              <div>
                <p className="font-medium">Run checks</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Confirm tests and lint pass before you push.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium">
                3
              </span>
              <div>
                <p className="font-medium">Open the PR</p>
                <pre className="mt-1 overflow-x-auto rounded-md bg-neutral-100 px-2 py-1 font-mono text-xs">
                  <code>gh pr create --fill</code>
                </pre>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Closing CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Ready to dig in?</h2>
        <p className="text-muted-foreground">
          Browse publicly, or sign in to create private collections and share
          your own commands and processes.
        </p>
        <CtaButtons />
      </div>
    </div>
  );
}

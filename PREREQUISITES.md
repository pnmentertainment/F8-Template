# Prerequisites

Tools you need on your machine **before** you can clone and run this
template. These are the things your AI assistant or terminal will ask
permission to install.

If you already have all of these, skip to [step 1 of the
README](./README.md#set-up-the-template).

---

## TL;DR — what you'll install

| Tool             | What it does                                | Required? |
| ---------------- | ------------------------------------------- | --------- |
| **Node.js + npm** | Runs Next.js, installs packages             | ✅ Yes    |
| **Git**          | Clones the repo, pushes to GitHub           | ✅ Yes    |
| **Stripe CLI**   | Forwards webhook events to your dev server  | ✅ Yes    |
| **Homebrew** (Mac) / **winget** or **Scoop** (Windows) | Package manager that installs the above | ⚙️ Recommended |
| **GitHub CLI** (`gh`) | Push code, open PRs from the terminal | Optional |
| **Vercel CLI**   | Deploy from the terminal instead of the web | Optional |

You'll also need **free accounts** at: GitHub, Supabase, Stripe, Vercel.

---

## macOS

### 1. Homebrew (one-time)

The de-facto package manager for Mac. Paste into Terminal:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then follow the on-screen instructions to add Homebrew to your PATH.

### 2. Node.js (gives you `node` and `npm`)

```bash
brew install node
```

Verify:

```bash
node --version   # should print v20.x.x or higher
npm --version    # should print 10.x.x or higher
```

If you're on Node 18 it'll still work, but 20+ is recommended.

### 3. Git

```bash
brew install git
```

Verify:

```bash
git --version
```

### 4. Stripe CLI

```bash
brew install stripe/stripe-cli/stripe
```

Then log in (one time):

```bash
stripe login
```

Verify:

```bash
stripe --version
```

---

## Windows

### 1. winget (built into Windows 11) — or install Scoop

winget ships with Windows 11. If you're on Windows 10, install it from
the Microsoft Store ("App Installer"), or use **Scoop**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
irm get.scoop.sh | iex
```

### 2. Node.js

```powershell
winget install OpenJS.NodeJS.LTS
```

Or, with Scoop:

```powershell
scoop install nodejs-lts
```

Verify (open a new PowerShell):

```powershell
node --version
npm --version
```

### 3. Git

```powershell
winget install Git.Git
```

Or:

```powershell
scoop install git
```

### 4. Stripe CLI

```powershell
scoop install stripe
```

Or download the latest installer from
<https://github.com/stripe/stripe-cli/releases> and add it to PATH.

Then:

```powershell
stripe login
```

---

## Linux (Ubuntu / Debian-flavoured)

### 1. Node.js

The version in the default apt repos is often old. Use NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

### 2. Git

```bash
sudo apt install -y git
```

### 3. Stripe CLI

Download the latest `.deb` from
<https://github.com/stripe/stripe-cli/releases>, then:

```bash
sudo dpkg -i stripe_*_linux_amd64.deb
stripe login
```

---

## Free accounts you'll need

Sign up for these — all free for development:

- **GitHub** — <https://github.com> — to host your code.
- **Supabase** — <https://supabase.com> — database + auth. Free tier is
  plenty for development.
- **Stripe** — <https://stripe.com> — payments. **Test mode** is free
  and never charges real cards.
- **Vercel** — <https://vercel.com> — hosting for production. Free hobby
  tier.

You'll plug API keys from Supabase and Stripe into `.env.local` in
[step 3 of the README](./README.md#set-up-the-template).

---

## Optional but useful

### GitHub CLI (`gh`)

For creating PRs and managing GitHub from the terminal.

```bash
brew install gh           # macOS
winget install GitHub.cli # Windows
```

Then `gh auth login`.

### Vercel CLI

For deploying without leaving the terminal.

```bash
npm install -g vercel
```

You can skip this — the Vercel **web dashboard** does the same job.

---

## What `npm install` will pull in

You won't install these by hand — once you clone the repo and run
`npm install`, all of these are fetched automatically from `package.json`:

- `next`, `react`, `react-dom`, `typescript`
- `@supabase/ssr`, `@supabase/supabase-js`
- `drizzle-orm`, `postgres`, `drizzle-kit`
- `stripe`
- `tailwindcss`, `tailwindcss-animate`, `postcss`, `autoprefixer`
- `@radix-ui/react-*` (avatar, dialog, dropdown, label, separator, slot, tabs, toast)
- `lucide-react` (icons)
- `next-themes` (dark mode)
- `react-hook-form`, `@hookform/resolvers`, `zod`
- `class-variance-authority`, `clsx`, `tailwind-merge`

Total install size: ~300 MB.

---

## Troubleshooting

**"command not found: node" after install**
Open a new terminal. The PATH change only takes effect in new shells.

**"EACCES: permission denied" when running npm**
Don't `sudo npm`. Either fix npm's prefix
(<https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally>)
or use `nvm` to install Node into your home directory.

**Stripe CLI "command not found" after install**
For Homebrew, run `brew doctor`. For Scoop, open a new PowerShell.

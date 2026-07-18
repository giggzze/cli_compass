-- CLI Compass Seed Data
-- This file seeds the Supabase database with real-world commands and processes

BEGIN;

-- Ensure the user profile exists
INSERT INTO public.profiles (id, username, created_at, updated_at)
VALUES ('user_2pGP5Tv6mGctQuyVr23ru4hogaW', 'seed_user', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Categories
INSERT INTO public.categories (id, name, created_at, updated_at)
VALUES
  ('10000000-0000-0000-0000-000000000001', 'System/DevOps', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000002', 'Database', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000003', 'Web Development', NOW(), NOW()),
  ('10000000-0000-0000-0000-000000000004', 'Version Control', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Commands - System/DevOps (15 commands)
INSERT INTO public.commands (id, category_id, code, description, language, doc_url, is_private, created_at, updated_at)
VALUES
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'docker run -it ubuntu:22.04 /bin/bash', 'Run an interactive Ubuntu container', 'bash', 'https://docs.docker.com/engine/reference/commandline/run/', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'docker build -t myapp:1.0 .', 'Build a Docker image from Dockerfile in current directory', 'bash', 'https://docs.docker.com/engine/reference/commandline/build/', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'docker-compose up -d', 'Start Docker Compose services in detached mode', 'bash', 'https://docs.docker.com/compose/reference/up/', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000001', 'docker ps -a', 'List all Docker containers (running and stopped)', 'bash', 'https://docs.docker.com/engine/reference/commandline/ps/', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000001', 'find . -type f -name "*.log" -mtime +7 -delete', 'Find and delete log files older than 7 days', 'bash', 'https://linux.die.net/man/1/find', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000001', 'grep -r "pattern" --include="*.js" .', 'Search for a pattern in JavaScript files recursively', 'bash', 'https://linux.die.net/man/1/grep', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000001', 'awk ''{print $1, $NF}'' file.txt', 'Print first and last columns of a file', 'bash', 'https://linux.die.net/man/1/awk', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000001', 'curl -X GET https://api.example.com/data -H "Authorization: Bearer TOKEN"', 'Make an authenticated GET request to an API', 'bash', 'https://curl.se/docs/', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000001', 'npm install package-name --save-dev', 'Install a package as a development dependency', 'bash', 'https://docs.npmjs.com/cli/v8/commands/npm-install', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000001', 'yarn add react@18.0.0', 'Install a specific version of a package using yarn', 'bash', 'https://yarnpkg.com/cli/add', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000001', 'nvm install 18.17.0 && nvm use 18.17.0', 'Install and switch to Node.js version 18.17.0', 'bash', 'https://github.com/nvm-sh/nvm', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000001', 'sudo systemctl restart docker', 'Restart the Docker daemon on Linux', 'bash', 'https://docs.docker.com/engine/install/linux-postinstall/', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000001', 'ps aux | grep node', 'List all running Node.js processes', 'bash', 'https://linux.die.net/man/1/ps', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000001', 'ls -lah ~/.ssh/', 'List SSH keys with detailed permissions', 'bash', 'https://linux.die.net/man/1/ls', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000001', 'chmod 600 ~/.ssh/id_rsa', 'Set correct permissions for SSH private key', 'bash', 'https://linux.die.net/man/1/chmod', FALSE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Commands - Database (12 commands)
INSERT INTO public.commands (id, category_id, code, description, language, doc_url, is_private, created_at, updated_at)
VALUES
  ('20000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000002', 'SELECT * FROM users WHERE age > 18 ORDER BY created_at DESC LIMIT 10;', 'Select users over 18, ordered by creation date, limit to 10', 'sql', 'https://www.postgresql.org/docs/current/sql-select.html', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000002', 'INSERT INTO users (name, email, created_at) VALUES (''John Doe'', ''john@example.com'', NOW());', 'Insert a new user record', 'sql', 'https://www.postgresql.org/docs/current/sql-insert.html', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000002', 'UPDATE users SET email = ''newemail@example.com'' WHERE id = $1;', 'Update user email by ID (parameterized)', 'sql', 'https://www.postgresql.org/docs/current/sql-update.html', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000002', 'DELETE FROM sessions WHERE expires_at < NOW();', 'Delete expired sessions', 'sql', 'https://www.postgresql.org/docs/current/sql-delete.html', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000002', 'SELECT u.name, COUNT(p.id) as post_count FROM users u LEFT JOIN posts p ON u.id = p.user_id GROUP BY u.id, u.name;', 'Join users with posts count', 'sql', 'https://www.postgresql.org/docs/current/tutorial-join.html', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000002', 'CREATE INDEX idx_users_email ON users(email);', 'Create an index on email column for faster lookups', 'sql', 'https://www.postgresql.org/docs/current/sql-createindex.html', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000002', 'EXPLAIN ANALYZE SELECT * FROM posts WHERE user_id = $1;', 'Analyze query performance with explain plan', 'sql', 'https://www.postgresql.org/docs/current/sql-explain.html', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000002', 'psql -h localhost -U postgres -d mydb -c "SELECT version();"', 'Connect to PostgreSQL and check version', 'bash', 'https://www.postgresql.org/docs/current/app-psql.html', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000024', '10000000-0000-0000-0000-000000000002', 'ALTER TABLE users ADD COLUMN phone VARCHAR(20);', 'Add a new column to existing table', 'sql', 'https://www.postgresql.org/docs/current/sql-altertable.html', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000002', 'CREATE VIEW active_users AS SELECT * FROM users WHERE deleted_at IS NULL;', 'Create a view for active users', 'sql', 'https://www.postgresql.org/docs/current/sql-createview.html', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000026', '10000000-0000-0000-0000-000000000002', 'BEGIN; UPDATE accounts SET balance = balance - 100 WHERE id = 1; UPDATE accounts SET balance = balance + 100 WHERE id = 2; COMMIT;', 'Transaction example: transfer money between accounts', 'sql', 'https://www.postgresql.org/docs/current/tutorial-transactions.html', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000027', '10000000-0000-0000-0000-000000000002', 'SELECT * FROM users WHERE id IN (SELECT user_id FROM posts GROUP BY user_id HAVING COUNT(*) > 10);', 'Find users with more than 10 posts using subquery', 'sql', 'https://www.postgresql.org/docs/current/sql-syntax.html', FALSE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Commands - Web Development (15 commands)
INSERT INTO public.commands (id, category_id, code, description, language, doc_url, is_private, created_at, updated_at)
VALUES
  ('20000000-0000-0000-0000-000000000028', '10000000-0000-0000-0000-000000000003', 'const arr = [1, 2, 3].map(x => x * 2).filter(x => x > 2);', 'Chain map and filter operations on array', 'javascript', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000029', '10000000-0000-0000-0000-000000000003', 'const { name, age } = { name: "John", age: 30 };', 'Destructure object properties', 'javascript', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000030', '10000000-0000-0000-0000-000000000003', 'const [head, ...tail] = [1, 2, 3, 4];', 'Use spread operator to split array', 'javascript', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000003', 'async function fetchData() { const data = await fetch(url).then(r => r.json()); return data; }', 'Async/await pattern for fetching data', 'javascript', 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000003', 'const Component = ({ title }) => <h1>{title}</h1>;', 'React functional component with props', 'javascript', 'https://react.dev/learn', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000033', '10000000-0000-0000-0000-000000000003', 'const [count, setCount] = useState(0);', 'React useState hook for state management', 'javascript', 'https://react.dev/reference/react/useState', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000034', '10000000-0000-0000-0000-000000000003', 'useEffect(() => { document.title = title; }, [title]);', 'React useEffect hook for side effects', 'javascript', 'https://react.dev/reference/react/useEffect', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000035', '10000000-0000-0000-0000-000000000003', '.flex { display: flex; justify-content: center; align-items: center; }', 'CSS flexbox centering pattern', 'css', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000036', '10000000-0000-0000-0000-000000000003', '.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }', 'CSS grid with 3 equal columns and gap', 'css', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000037', '10000000-0000-0000-0000-000000000003', '@media (max-width: 768px) { .container { width: 100%; } }', 'CSS media query for responsive design', 'css', 'https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000038', '10000000-0000-0000-0000-000000000003', '.transition { transition: all 0.3s ease-in-out; }', 'CSS smooth transition on all properties', 'css', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000039', '10000000-0000-0000-0000-000000000003', '@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }', 'CSS keyframe animation', 'css', 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000040', '10000000-0000-0000-0000-000000000003', 'const { useQuery } = require("@tanstack/react-query"); const { data } = useQuery({ queryKey: ["users"], queryFn: fetchUsers });', 'React Query hook for data fetching', 'javascript', 'https://tanstack.com/query/latest', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000041', '10000000-0000-0000-0000-000000000003', 'import { createContext, useContext } from "react"; const Context = createContext();', 'React Context API setup', 'javascript', 'https://react.dev/reference/react/createContext', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000042', '10000000-0000-0000-0000-000000000003', 'import clsx from "clsx"; const className = clsx("base", isActive && "active");', 'Conditional CSS class names with clsx', 'javascript', 'https://github.com/lukeed/clsx', FALSE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Commands - Version Control (10 commands)
INSERT INTO public.commands (id, category_id, code, description, language, doc_url, is_private, created_at, updated_at)
VALUES
  ('20000000-0000-0000-0000-000000000043', '10000000-0000-0000-0000-000000000004', 'git checkout -b feature/new-feature', 'Create and checkout a new feature branch', 'bash', 'https://git-scm.com/docs/git-checkout', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000044', '10000000-0000-0000-0000-000000000004', 'git merge --no-ff feature/new-feature', 'Merge feature branch with merge commit', 'bash', 'https://git-scm.com/docs/git-merge', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000045', '10000000-0000-0000-0000-000000000004', 'git rebase -i HEAD~3', 'Interactive rebase last 3 commits', 'bash', 'https://git-scm.com/docs/git-rebase', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000046', '10000000-0000-0000-0000-000000000004', 'git cherry-pick abc123', 'Apply a specific commit to current branch', 'bash', 'https://git-scm.com/docs/git-cherry-pick', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000047', '10000000-0000-0000-0000-000000000004', 'git log --oneline --graph --all', 'View git history as graph with one-line commits', 'bash', 'https://git-scm.com/docs/git-log', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000048', '10000000-0000-0000-0000-000000000004', 'git reset --soft HEAD~1', 'Undo last commit but keep changes staged', 'bash', 'https://git-scm.com/docs/git-reset', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000049', '10000000-0000-0000-0000-000000000004', 'git stash && git pull && git stash pop', 'Stash changes, pull latest, and restore changes', 'bash', 'https://git-scm.com/docs/git-stash', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000050', '10000000-0000-0000-0000-000000000004', 'git tag -a v1.0.0 -m "Release version 1.0.0"', 'Create an annotated tag for release', 'bash', 'https://git-scm.com/docs/git-tag', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000051', '10000000-0000-0000-0000-000000000004', 'gh pr create --title "Feature: New UI" --body "Implements the new user interface"', 'Create a pull request using GitHub CLI', 'bash', 'https://cli.github.com/manual/gh_pr_create', FALSE, NOW(), NOW()),
  ('20000000-0000-0000-0000-000000000052', '10000000-0000-0000-0000-000000000004', 'git commit -m "feat: add user authentication" --no-verify', 'Commit with conventional commit message, skip hooks', 'bash', 'https://www.conventionalcommits.org/', FALSE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Link all seed commands to the user via user_commands table
INSERT INTO public.user_commands (id, user_id, command_id, is_favorite, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000001', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000002', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000003', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000004', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000005', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000006', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000007', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000008', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000009', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000010', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000011', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000012', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000013', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000014', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000015', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000016', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000017', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000018', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000019', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000020', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000021', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000022', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000023', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000024', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000025', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000026', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000027', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000028', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000029', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000030', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000031', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000032', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000033', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000034', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000035', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000036', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000037', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000038', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000039', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000040', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000041', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000042', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000043', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000044', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000045', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000046', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000047', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000048', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000049', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000050', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000051', FALSE, NOW(), NOW()),
  (gen_random_uuid(), 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', '20000000-0000-0000-0000-000000000052', FALSE, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Insert Processes
INSERT INTO public.processes (id, title, user_id, is_private, created_at, updated_at)
VALUES
  ('30000000-0000-0000-0000-000000000001', 'Installing Docker on Linux', 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', FALSE, NOW(), NOW()),
  ('30000000-0000-0000-0000-000000000002', 'Setting Up a Node.js Project', 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', FALSE, NOW(), NOW()),
  ('30000000-0000-0000-0000-000000000003', 'Git Feature Branch Workflow', 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', FALSE, NOW(), NOW()),
  ('30000000-0000-0000-0000-000000000004', 'Deploying a Docker Application', 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', FALSE, NOW(), NOW()),
  ('30000000-0000-0000-0000-000000000005', 'Setting Up a React Project with Tailwind CSS', 'user_2pGP5Tv6mGctQuyVr23ru4hogaW', FALSE, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Process Steps for Docker Installation
INSERT INTO public.process_steps (id, process_id, "order", "stepExplanation", code, language, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 1, 'Check if Docker is already installed on your system', 'docker --version', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 2, 'Update package manager and install dependencies', 'sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg lsb-release', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 3, 'Add Docker GPG key and repository', 'curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 4, 'Install Docker from official repository', 'sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', 5, 'Start Docker daemon and add user to docker group', 'sudo systemctl start docker && sudo usermod -aG docker $USER', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001', 6, 'Verify Docker installation by running hello-world', 'docker run hello-world', 'bash', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Process Steps for Node.js Project Setup
INSERT INTO public.process_steps (id, process_id, "order", "stepExplanation", code, language, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000002', 1, 'Create a new project directory and initialize git', 'mkdir my-project && cd my-project && git init', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000008', '30000000-0000-0000-0000-000000000002', 2, 'Initialize a new npm project', 'npm init -y', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000009', '30000000-0000-0000-0000-000000000002', 3, 'Install necessary dependencies', 'npm install express dotenv', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000010', '30000000-0000-0000-0000-000000000002', 4, 'Configure npm scripts in package.json', 'npm set-script dev "node index.js" && npm set-script start "node index.js"', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000011', '30000000-0000-0000-0000-000000000002', 5, 'Create .gitignore file for Node projects', 'echo "node_modules/\n.env\n.DS_Store" > .gitignore', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000012', '30000000-0000-0000-0000-000000000002', 6, 'Create main application file', 'echo ''const express = require("express");\nconst app = express();\napp.listen(3000, () => console.log("Server running on port 3000"));'' > index.js', 'bash', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Process Steps for Git Feature Branch Workflow
INSERT INTO public.process_steps (id, process_id, "order", "stepExplanation", code, language, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0000-000000000013', '30000000-0000-0000-0000-000000000003', 1, 'Ensure you are on main branch and pull latest changes', 'git checkout main && git pull origin main', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000014', '30000000-0000-0000-0000-000000000003', 2, 'Create and checkout a new feature branch', 'git checkout -b feature/user-authentication', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000015', '30000000-0000-0000-0000-000000000003', 3, 'Make your changes and stage them', 'git add . && git commit -m "feat: implement user authentication"', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000016', '30000000-0000-0000-0000-000000000003', 4, 'Push your feature branch to remote', 'git push -u origin feature/user-authentication', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000017', '30000000-0000-0000-0000-000000000003', 5, 'Create a pull request on GitHub', 'gh pr create --title "User Authentication" --body "Implements user login and signup"', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000018', '30000000-0000-0000-0000-000000000003', 6, 'After approval, merge and clean up', 'git checkout main && git pull origin main && git merge --no-ff feature/user-authentication && git branch -d feature/user-authentication', 'bash', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Process Steps for Docker Deployment
INSERT INTO public.process_steps (id, process_id, "order", "stepExplanation", code, language, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0000-000000000019', '30000000-0000-0000-0000-000000000004', 1, 'Create a Dockerfile for your application', 'echo ''FROM node:18\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["node", "index.js"]'' > Dockerfile', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000020', '30000000-0000-0000-0000-000000000004', 2, 'Build the Docker image', 'docker build -t myapp:1.0 .', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000021', '30000000-0000-0000-0000-000000000004', 3, 'Test the container locally', 'docker run -p 3000:3000 myapp:1.0', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000022', '30000000-0000-0000-0000-000000000004', 4, 'Tag and push image to Docker registry', 'docker tag myapp:1.0 docker.io/username/myapp:1.0 && docker push docker.io/username/myapp:1.0', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000023', '30000000-0000-0000-0000-000000000004', 5, 'Deploy using Docker Compose', 'docker-compose up -d', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000024', '30000000-0000-0000-0000-000000000004', 6, 'Verify deployment and check logs', 'docker ps && docker logs <container-id>', 'bash', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert Process Steps for React + Tailwind Setup
INSERT INTO public.process_steps (id, process_id, "order", "stepExplanation", code, language, created_at, updated_at)
VALUES
  ('40000000-0000-0000-0000-000000000025', '30000000-0000-0000-0000-000000000005', 1, 'Create a new React app using Create React App or Vite', 'npx create-react-app my-app || npm create vite@latest my-app -- --template react', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000026', '30000000-0000-0000-0000-000000000005', 2, 'Navigate to project and install Tailwind CSS', 'cd my-app && npm install -D tailwindcss postcss autoprefixer', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000027', '30000000-0000-0000-0000-000000000005', 3, 'Initialize Tailwind configuration', 'npx tailwindcss init -p', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000028', '30000000-0000-0000-0000-000000000005', 4, 'Configure template paths in tailwind.config.js', 'echo ''module.exports = { content: ["./src/**/*.{js,jsx}"], theme: { extend: {} }, plugins: [] }'' > tailwind.config.js', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000029', '30000000-0000-0000-0000-000000000005', 5, 'Add Tailwind directives to CSS file', 'echo ''@tailwind base;\n@tailwind components;\n@tailwind utilities;'' > src/index.css', 'bash', NOW(), NOW()),
  ('40000000-0000-0000-0000-000000000030', '30000000-0000-0000-0000-000000000005', 6, 'Start development server', 'npm start', 'bash', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

COMMIT;

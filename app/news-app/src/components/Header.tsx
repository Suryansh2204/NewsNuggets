import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          News App
        </Link>

        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                Welcome, {user?.username || 'User'}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

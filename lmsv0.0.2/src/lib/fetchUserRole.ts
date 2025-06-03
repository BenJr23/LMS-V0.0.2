export async function fetchUserRole(email: string): Promise<string | null> {
    try {
      const response = await fetch('/api/fetch-roles?email=' + encodeURIComponent(email));
      const data = await response.json();
      console.log('Role API response:', data); // ✅ LOG IT
  
      return data.role ?? null;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  }
  